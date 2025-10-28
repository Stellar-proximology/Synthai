// server.js — SynthAi with local TF‑IDF "vector" RAG + profile evaluator
const express = require('express');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const multer = require('multer');

const app = express();
app.use(express.json({ limit: '50mb' }));
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const KNOW = path.join(ROOT, 'knowledge');
const PUBLIC = path.join(ROOT, 'public');
const INDEX_DIR = path.join(ROOT, 'indexes');
if (!fs.existsSync(KNOW)) fs.mkdirSync(KNOW, { recursive: true });
if (!fs.existsSync(PUBLIC)) fs.mkdirSync(PUBLIC, { recursive: true });
if (!fs.existsSync(INDEX_DIR)) fs.mkdirSync(INDEX_DIR, { recursive: true });

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.MODEL || 'tinyllama:latest';

// --- THINK MODE utilities
function extractFinal(text) {
  // Prefer content after 'FINAL:' marker if present; otherwise return full trimmed
  if (!text) return '';
  const idx = text.lastIndexOf('FINAL:');
  if (idx !== -1) {
    return text.slice(idx + 'FINAL:'.length).trim();
  }
  // Some reasoning models use <final> ... </final>
  const m = text.match(/<final>([\s\S]*?)<\/final>/i);
  if (m) return m[1].trim();
  return text.trim();
}
function modelForMode(mode, fallbackModel, thinkModelEnv) {
  if (mode === 'think') {
    return process.env.THINK_MODEL || thinkModelEnv || 'deepseek-r1:7b'; // reasoning-capable local model on Ollama
  }
  return process.env.MODEL || fallbackModel;
}


app.use(express.static(PUBLIC));

// ingest files
const upload = multer();
app.post('/api/ingest', upload.array('files'), (req, res) => {
  try {
    const files = req.files || [];
    files.forEach(f => {
      const safe = f.originalname.replace(/[^a-zA-Z0-9_\-\.]/g, '_');
      fs.writeFileSync(path.join(KNOW, safe), f.buffer);
    });
    res.json({ ok: true, saved: files.length });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// list files
app.get('/api/files', (req, res) => {
  const list = [];
  const files = fs.readdirSync(KNOW);
  for (const f of files) {
    const full = path.join(KNOW, f);
    if (fs.statSync(full).isFile()) list.push('knowledge/' + f);
  }
  res.json({ ok: true, files: list });
});

// chunker
function chunkText(txt, size=1000, overlap=150){
  const chunks = [];
  for (let i=0;i<txt.length;i+= (size - overlap)) {
    const end = Math.min(i + size, txt.length);
    chunks.push(txt.slice(i, end));
    if (end === txt.length) break;
  }
  return chunks;
}

// learn -> build TF-IDF index
app.post('/api/learn', async (req, res) => {
  try {
    const Natural = require('natural');
    const TfIdf = Natural.TfIdf;
    const tfidf = new TfIdf();
    const docs = [];
    const files = fs.readdirSync(KNOW);
    for (const f of files){
      const full = path.join(KNOW, f);
      if (!fs.statSync(full).isFile()) continue;
      const text = fs.readFileSync(full, 'utf8');
      const chunks = chunkText(text);
      chunks.forEach((c, idx)=>{
        docs.push({ id:`${f}::${idx}`, file:f, chunk:c });
        tfidf.addDocument(c, `${f}::${idx}`);
      });
    }
    fs.writeFileSync(path.join(INDEX_DIR, 'docs.json'), JSON.stringify({ docs }, null, 2), 'utf8');
    res.json({ ok: true, docs: docs.length });
  } catch (e) { res.status(500).json({ ok:false, error:e.message }); }
});

// ask with retrieval
app.post('/api/ask', async (req, res) => {
  try {
    const { query = '', k = 8, mode = 'normal' } = req.body || {};
    if (!query) return res.status(400).json({ ok: false, error: 'missing query' });
    const Natural = require('natural');
    const TfIdf = Natural.TfIdf;
    const tfidf = new TfIdf();

    const idxPath = path.join(INDEX_DIR, 'docs.json');
    if (!fs.existsSync(idxPath)) return res.status(400).json({ ok: false, error: 'index missing; call /api/learn first' });
    const { docs } = JSON.parse(fs.readFileSync(idxPath, 'utf8'));
    docs.forEach(d => tfidf.addDocument(d.chunk, d.id));
    const scores = docs.map((d, i)=>({ id: d.id, file: d.file, chunk: d.chunk, score: tfidf.tfidf(query, i) }))
                      .sort((a,b)=>b.score - a.score).slice(0, k);
    const context = scores.map(s => `
<<< ${s.file} (${s.id}) >>>
${s.chunk}`).join('\n');

    const modelToUse = modelForMode(mode, DEFAULT_MODEL, 'deepseek-r1:7b');
    const prompt = mode === 'think'
      ? `You are a domain analyst. Think privately, then provide only FINAL.
CONTEXT:
${context}

QUERY:
${query}

FINAL:`
      : `Use ONLY the CONTEXT to answer the QUERY. Cite ids if needed.
CONTEXT:
${context}

QUERY:
${query}

ANSWER:`;

    const r = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: modelToUse, prompt: prompt, stream: false })
    });
    if (!r.ok) {
      const txt = await r.text();
      return res.status(500).json({ ok: false, error: txt });
    }
    const j = await r.json();
    const raw = j.output || j?.choices?.[0]?.message?.content || '';
    const out = mode === 'think' ? extractFinal(raw) : (raw || '');
    res.json({ ok: true, output: out, retrieved: scores, model: modelToUse, mode });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});
    const idxPath = path.join(INDEX_DIR, 'docs.json');
    if (!fs.existsSync(idxPath)) return res.status(400).json({ ok:false, error:'index missing; call /api/learn first' });
    const { docs } = JSON.parse(fs.readFileSync(idxPath, 'utf8'));
    const Natural = require('natural');
    const TfIdf = Natural.TfIdf;
    const tfidf = new TfIdf();
    docs.forEach(d=> tfidf.addDocument(d.chunk, d.id));
    const scored = docs.map((d,i)=>({ ...d, score: tfidf.tfidf(query, i) }))
                       .sort((a,b)=> b.score - a.score)
                       .slice(0,k);
    const context = scored.map(s=> `\n<<< ${s.file} (${s.id}) >>>\n${s.chunk}`).join('\n');
    const prompt = `Use ONLY the CONTEXT to answer the QUERY. Cite ids if needed.\nCONTEXT:\n${context}\n\nQUERY:\n${query}\n\nANSWER:`;
    const r = await fetch(`${OLLAMA_URL}/api/generate`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ model: DEFAULT_MODEL, prompt, stream:false })
    });
    if (!r.ok) return res.status(500).json({ ok:false, error: await r.text() });
    const j = await r.json();
    res.json({ ok:true, output: j.output || j?.choices?.[0]?.message?.content || '', retrieved: scored });
  } catch (e) { res.status(500).json({ ok:false, error:e.message }); }
});

// profile evaluator
app.post('/api/profile/evaluate', async (req, res) => {
  try {
    const { profile = {}, objectives = [], mode = 'normal' } = req.body || {};
    const idxPath = path.join(INDEX_DIR, 'docs.json');
    let context = '(no index built yet)';
    if (fs.existsSync(idxPath)) {
      const { docs } = JSON.parse(fs.readFileSync(idxPath, 'utf8'));
      context = docs.slice(0, 15).map(d => `
<<< ${d.file} (${d.id}) >>>
${d.chunk}`).join('\n');
    }
    const modelToUse = modelForMode(mode, DEFAULT_MODEL, 'deepseek-r1:7b');
    const prompt = mode === 'think'
      ? `You are Synthia, an expert evaluator. Think privately; then provide only FINAL: a structured report with Key traits, Calculations, Recommendations, Caveats. Ground claims in CONTEXT.
CONTEXT:
${context}

PROFILE:
${JSON.stringify(profile, null, 2)}

OBJECTIVES:
${objectives.join('; ')}

FINAL:`
      : `You are Synthia, an evaluator for "human design" and "field mechanics" per the uploaded corpus.
Given a PROFILE and OBJECTIVES, output:
- Key traits
- Calculations (show steps)
- Recommendations
- Data gaps / uncertainties
Ground all claims in CONTEXT.

CONTEXT:
${context}

PROFILE:
${JSON.stringify(profile, null, 2)}

OBJECTIVES:
${objectives.join('; ')}

REPORT:`;

    const r = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: modelToUse, prompt, stream: false })
    });
    if (!r.ok) {
      const txt = await r.text();
      return res.status(500).json({ ok: false, error: txt });
    }
    const j = await r.json();
    const raw = j.output || j?.choices?.[0]?.message?.content || '';
    const out = mode === 'think' ? extractFinal(raw) : (raw || '');
    res.json({ ok: true, report: out, model: modelToUse, mode });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});
    if (!r.ok) return res.status(500).json({ ok:false, error: await r.text() });
    const j = await r.json();
    res.json({ ok:true, report: j.output || j?.choices?.[0]?.message?.content || '' });
  } catch (e) { res.status(500).json({ ok:false, error:e.message }); }
});

app.listen(PORT, ()=> console.log('SynthAi-vector-rag running at http://localhost:'+PORT));
