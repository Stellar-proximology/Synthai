
// server.js — SynthAi backend with Auto-Patch (LLM-generated patches) + Patch workflow
const express = require('express');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const multer = require('multer');
const { exec } = require('child_process');

const app = express();
app.use(express.json({ limit: '50mb' }));
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const KNOW = path.join(ROOT, 'knowledge');
const PUBLIC = path.join(ROOT, 'public');
const PATCH_DIR = path.join(ROOT, 'patches');
const BACKUP_DIR = path.join(ROOT, 'backups', 'patches');
if (!fs.existsSync(KNOW)) fs.mkdirSync(KNOW, { recursive: true });
if (!fs.existsSync(PUBLIC)) fs.mkdirSync(PUBLIC, { recursive: true });
if (!fs.existsSync(PATCH_DIR)) fs.mkdirSync(PATCH_DIR, { recursive: true });
if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

app.use(express.static(PUBLIC));

// --- ingest files (multipart)
const upload = multer();
app.post('/api/ingest', upload.array('files'), (req, res) => {
  try {
    const files = req.files || [];
    files.forEach(f => {
      const safe = f.originalname.replace(/[^a-zA-Z0-9_\-\.]/g, '_');
      fs.writeFileSync(path.join(KNOW, safe), f.buffer);
    });
    res.json({ ok: true, saved: files.length });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// --- generate: proxy to local Ollama (or another local endpoint)
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.MODEL || 'tinyllama:latest';

app.post('/api/generate', async (req, res) => {
  const { prompt = '', context = '' } = req.body || {};
  const combined = `Context:\n${context}\n\nUser:\n${prompt}\n\nAnswer succinctly.`;
  try {
    const r = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: DEFAULT_MODEL, prompt: combined, stream: false })
    });
    if (!r.ok) {
      const txt = await r.text();
      return res.status(500).json({ ok: false, error: txt });
    }
    const j = await r.json();
    const out = j.output || j?.choices?.[0]?.message?.content || JSON.stringify(j);
    res.json({ ok: true, output: out });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// --- safe whitelisted run (very limited)
const WHITELIST = ['ls', 'pwd', 'whoami', 'bash'];
app.post('/api/run', (req, res) => {
  const { cmd, args = [] } = req.body || {};
  if (!cmd) return res.status(400).json({ ok: false, error: 'missing cmd' });
  if (!WHITELIST.includes(cmd) && cmd !== 'read') return res.status(403).json({ ok: false, error: 'not allowed' });

  if (cmd === 'read') {
    const fname = args[0] || '';
    const safe = path.normalize(fname).replace(/^(\.\.(\/|\\|$))+/, '');
    const full = path.join(KNOW, safe);
    if (!full.startsWith(KNOW) || !fs.existsSync(full)) return res.status(403).json({ ok: false, error: 'file access denied' });
    return res.json({ ok: true, content: fs.readFileSync(full, 'utf8') });
  }

  const fullCmd = cmd + (args.length ? ' ' + args.map(a => `"${String(a).replace(/"/g, '\\"')}"`).join(' ') : '');
  exec(fullCmd, { timeout: 30_000, maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
    if (err) return res.json({ ok: false, error: err.message, stdout, stderr });
    res.json({ ok: true, stdout, stderr });
  });
});

// --- simple file-list for UI
app.get('/api/files', (req, res) => {
  const list = [];
  const addFiles = (dir, prefix) => {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isFile()) list.push(path.join(prefix, f));
    }
  };
  addFiles(KNOW, 'knowledge');
  addFiles(PUBLIC, 'public');
  const topFiles = ['server.js', 'package.json', 'backup.sh'];
  for (const tf of topFiles) if (fs.existsSync(path.join(ROOT, tf))) list.push(tf);
  res.json({ ok: true, files: list });
});

// --- PATCH workflow: suggest/list/view/apply
app.post('/api/patch/suggest', (req, res) => {
  try {
    const { path: relPath = '', newContent = '', comment = '' } = req.body || {};
    if (!relPath || typeof newContent !== 'string') return res.status(400).json({ ok: false, error: 'missing path or content' });
    const normalized = path.normalize(relPath).replace(/^(\.\.(\/|\\|$))+/, '');
    const target = path.join(ROOT, normalized);
    if (!target.startsWith(ROOT)) return res.status(403).json({ ok: false, error: 'invalid target' });

    let original = '';
    if (fs.existsSync(target) && fs.statSync(target).isFile()) {
      original = fs.readFileSync(target, 'utf8');
    }

    const id = 'patch_' + Date.now();
    const patchObj = {
      id, target: normalized, comment, newContent, original,
      createdAt: new Date().toISOString(), applied: false, appliedAt: null, applier: null
    };
    const filePath = path.join(PATCH_DIR, id + '.json');
    fs.writeFileSync(filePath, JSON.stringify(patchObj, null, 2), 'utf8');

    res.json({ ok: true, id, message: 'Patch suggested and saved', preview: newContent.slice(0, 1200) });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get('/api/patch/list', (req, res) => {
  try {
    const ps = fs.readdirSync(PATCH_DIR).filter(f => f.endsWith('.json'));
    const out = ps.map(f => {
      const j = JSON.parse(fs.readFileSync(path.join(PATCH_DIR, f), 'utf8'));
      return { id: j.id, target: j.target, comment: j.comment, createdAt: j.createdAt, applied: j.applied };
    });
    res.json({ ok: true, patches: out });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get('/api/patch/view/:id', (req, res) => {
  try {
    const id = req.params.id;
    const file = path.join(PATCH_DIR, id + '.json');
    if (!fs.existsSync(file)) return res.status(404).json({ ok: false, error: 'not found' });
    const j = JSON.parse(fs.readFileSync(file, 'utf8'));
    res.json({ ok: true, patch: j });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post('/api/patch/apply', (req, res) => {
  try {
    const { id = '', applier = 'unknown' } = req.body || {};
    if (!id) return res.status(400).json({ ok: false, error: 'missing id' });
    const file = path.join(PATCH_DIR, id + '.json');
    if (!fs.existsSync(file)) return res.status(404).json({ ok: false, error: 'patch not found' });
    const patchObj = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (patchObj.applied) return res.status(400).json({ ok: false, error: 'patch already applied' });

    const targetFull = path.join(ROOT, patchObj.target);
    const targetDir = path.dirname(targetFull);
    if (!targetFull.startsWith(ROOT)) return res.status(403).json({ ok: false, error: 'invalid target' });

    const ts = Date.now();
    if (fs.existsSync(targetFull)) {
      const rel = patchObj.target.replace(/[\/\\]/g, '_');
      const bakName = `${rel}.orig.${ts}.bak`;
      const bakPath = path.join(BACKUP_DIR, bakName);
      fs.copyFileSync(targetFull, bakPath);
    } else {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.writeFileSync(targetFull, patchObj.newContent, 'utf8');

    patchObj.applied = true;
    patchObj.appliedAt = new Date().toISOString();
    patchObj.applier = applier;
    fs.writeFileSync(file, JSON.stringify(patchObj, null, 2), 'utf8');

    const corpus = path.join(KNOW, 'corpus.log');
    const logEntry = `--- PATCH APPLIED ${new Date().toISOString()} ---\nPATCH ID: ${id}\nTARGET: ${patchObj.target}\nAPPLIER: ${applier}\nCOMMENT: ${patchObj.comment}\n\n`;
    fs.appendFileSync(corpus, logEntry);
    res.json({ ok: true, message: 'Patch applied', backup: 'created' });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// --- AUTO-PATCH: use LLM to propose a new version of a target file
// Body: { target: 'server.js', instruction: 'add /hello endpoint', contextFiles?: ['knowledge/x.js'], apply?: false }
app.post('/api/patch/auto', async (req, res) => {
  try {
    const { target = '', instruction = '', contextFiles = [], apply = false } = req.body || {};
    if (!target || !instruction) return res.status(400).json({ ok: false, error: 'missing target or instruction' });

    const normalized = path.normalize(target).replace(/^(\.\.(\/|\\|$))+/, '');
    const targetFull = path.join(ROOT, normalized);
    if (!targetFull.startsWith(ROOT)) return res.status(403).json({ ok: false, error: 'invalid target' });

    let original = '';
    if (fs.existsSync(targetFull) && fs.statSync(targetFull).isFile()) {
      original = fs.readFileSync(targetFull, 'utf8');
    }

    // Load optional context snippets from knowledge
    let context = '';
    if (Array.isArray(contextFiles)) {
      for (const cf of contextFiles) {
        const safe = path.normalize(cf).replace(/^(\.\.(\/|\\|$))+/, '');
        const full = path.join(KNOW, safe);
        if (full.startsWith(KNOW) && fs.existsSync(full)) {
          const txt = fs.readFileSync(full, 'utf8');
          context += `\n\n--- Context file: ${safe} ---\n` + txt.slice(0, 5000);
        }
      }
    }

    const prompt = `You are a code editor. Given a TARGET file and an INSTRUCTION, produce the FULL UPDATED CONTENTS of the target file.\n\nRULES:\n- Return only the full updated file content, no prose.\n- Keep working code minimal, consistent, and runnable.\n- Preserve existing behavior unless required by the instruction.\n\nINSTRUCTION:\n${instruction}\n\nCURRENT TARGET (${normalized}):\n${original}\n\nOPTIONAL CONTEXT:\n${context}\n\nNOW OUTPUT ONLY THE FULL UPDATED FILE:`;

    const r = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: DEFAULT_MODEL, prompt, stream: false })
    });
    if (!r.ok) {
      const txt = await r.text();
      return res.status(500).json({ ok: false, error: txt });
    }
    const j = await r.json();
    const candidate = j.output || j?.choices?.[0]?.message?.content || '';

    if (!candidate || candidate.trim().length < 3) {
      return res.status(400).json({ ok: false, error: 'model returned empty content' });
    }

    // Save as suggested patch
    const id = 'patch_' + Date.now();
    const patchObj = {
      id, target: normalized, comment: `[AUTO] ${instruction}`, newContent: candidate, original,
      createdAt: new Date().toISOString(), applied: false, appliedAt: null, applier: null
    };
    const filePath = path.join(PATCH_DIR, id + '.json');
    fs.writeFileSync(filePath, JSON.stringify(patchObj, null, 2), 'utf8');

    // Auto-apply if requested
    if (apply) {
      // backup + write
      const ts = Date.now();
      if (fs.existsSync(targetFull)) {
        const rel = patchObj.target.replace(/[\/\\]/g, '_');
        const bakName = `${rel}.orig.${ts}.bak`;
        const bakPath = path.join(BACKUP_DIR, bakName);
        fs.copyFileSync(targetFull, bakPath);
      } else {
        fs.mkdirSync(path.dirname(targetFull), { recursive: true });
      }
      fs.writeFileSync(targetFull, candidate, 'utf8');
      patchObj.applied = true;
      patchObj.appliedAt = new Date().toISOString();
      patchObj.applier = 'auto';
      fs.writeFileSync(filePath, JSON.stringify(patchObj, null, 2), 'utf8');
      const corpus = path.join(KNOW, 'corpus.log');
      fs.appendFileSync(corpus, `--- AUTO PATCH APPLIED ${new Date().toISOString()} ---\nTARGET: ${patchObj.target}\nINSTR: ${instruction}\n\n`);
    }

    res.json({ ok: true, id, applied: !!apply, preview: candidate.slice(0, 1200) });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.listen(PORT, () => console.log(`SynthAi-autopatch running at http://localhost:${PORT}`));
