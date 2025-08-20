# 🌌 Codex Build Contract — Stellar Proximology (Research Lab)

**Prime directive:** This repo is the **scientific backbone**. It publishes falsifiable experiments, replication kits, and structured results. It never forks logic that belongs in `/core`.

## Scope (What belongs here)
- Reproducible experiments (Bible/I Ching/Human Design/Astro × physics/field theory)
- Replication kits (datasets, small scripts, notebooks)
- Methods, protocols, results pages
- Thin API endpoints that expose published results (read-only where possible)

## Out of scope (What does NOT belong here)
- Game UI/UX, quests, town sim logic (goes to **YOU-N-I-VERSE**)
- Collapse/sentence engines and shared models (**/core**)
- Heavy front-end frameworks; this site is static-first

---

## Architecture & Directories

/core            # Git submodule or npm/pip package — DO NOT EDIT HERE
/experiments     # Each experiment = folder with index.md + data + code
/replication-kits
/site            # Static site (e.g., Astro/Eleventy) publishing the lab
/api             # Optional: tiny read-only endpoints surfacing published results

### Experiment Template (required)
Every experiment folder must include:

- `index.md` — Abstract, hypotheses, methods, materials, procedure, metrics, results, discussion, limitations, next steps
- `protocol.json` — Machine-readable metadata
- `run.ipynb` or `run.py` — Reproducible execution script
- `data/` — Inputs/outputs (versioned)
- `kit/` — Minimal files required for external replication

> Keep all **interpretation** in `index.md`. Keep **code paths** deterministic. Randomness must be seeded.

---

## Shared Core Integration
- Import models/mappings from **/core**:
  - Trinity/Pentacore field math (Mind/Body/Heart/Soul/Spirit)
  - Codon ↔ Hexagram ↔ Element tables
  - Sentence & collapse engines (gate-line-color-tone-base-axis-house)
- Never duplicate `/core`. If you think you need to: you don’t.

**Install (example):**
```bash
# If /core is a submodule
git submodule add <core-repo-url> core
git submodule update --init --recursive

# Or as a package
pip install youniverse-core  # or npm i youniverse-core
```

---

## API Contract (optional)

Read-only, cache-friendly endpoints:

GET /api/experiments → list of experiment metadata

GET /api/experiments/:slug → machine-readable protocol + published results

GET /api/replication-kits/:slug → signed download URL

Response bodies mirror protocol.json and results.json.

---

## Brand & Tone

Academic & surgical. Methods > vibes.

Cite sources. Log limitations. Prefer “we don’t know yet” to hand-waving.

---

## CI/CD

Lint: markdown, JSON schema, notebooks (nbQA)

Build: static site build and integrity checks

Test: execute run.py with fixed seeds; compare checksums

Artifacts: publish kit.zip at build time (user clicks to download; do not commit zips)

---

## Definition of Done

Experiment passes schema validation

run.py reproduces results on CI runner

Site renders abstract + results

Replication kit produced & downloadable

/core dependency up-to-date and pinned

---

## Commit Hygiene

Conventional commits

One experiment per PR

Include replication notes in PR description (hardware, runtime, env, seed)

---

## Quick Start (local)

# 1) Install site deps
npm i    # or pnpm i / yarn

# 2) Pull core
git submodule update --init --recursive

# 3) Run local site
npm run dev

# 4) Validate experiments
npm run validate:protocols

