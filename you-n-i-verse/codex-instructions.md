# 🎮 Codex Build Contract — YOU-N-I-VERSE (Game Platform)

**Prime directive:** This repo is the **playground**. It renders the science from Stellar as lived experience: charts → sentences → quests → town growth. All domain math/logic lives in **/core**.

## Scope (What belongs here)
- React/Tailwind/shadcn UI (mobile-first)
- Avatar + field visualizations (Body/Tropical, Heart/Draconic, Mind/Sidereal)
- Sentence generator UI (gate-line-color-tone-base-axis-house)
- Collapse routing & quest assignment **using** `/core` engines
- Game systems: town builder, resonance challenges, inventory of sentence fragments

## Out of scope
- Publishing research papers/results (Stellar)
- Editing or forking `/core` logic (import it)

---

## Architecture & Directories

/core              # Submodule or package — DO NOT EDIT HERE
/app               # Next.js/React app routes
/components        # UI building blocks (shadcn/ui)
/lib               # API clients, persistence, utilities
/data              # Static seeds (icons, glyph maps)
/state             # State machines (xstate/zustand) for game/quests

---

## Shared Core Integration
**Install:**
```bash
# Submodule
git submodule add <core-repo-url> core
git submodule update --init --recursive

# Or package
npm i youniverse-core
```

Use:

```ts
import { collapse, toSentence, mapChartToCTB } from "@/core/engine";
import { hexCodonElementMap } from "@/core/mappings";
```

---

## External Inputs

Swiss Ephemeris (or equivalent) → positions → Gates/Lines → mapChartToCTB

User birth data (optional) → drives chart render + quest seeds

Stellar API (read-only) for published “laws” and experiment-backed parameters

---

## Game Layers (phased)

1. Core Field: chart & avatar, 3-ring node view (Body/Heart/Mind)
2. Resonance Lab: sentence puzzles, resonance challenges, CTB alignment
3. Town Builder: generative agents, buildings unlocked by sentence assembly

> All sentence assembly uses assigned keywords only. No vague metaphors.

---

## UI/UX Standards

Tailwind + shadcn/ui, rounded-2xl, soft shadows, grid layouts

Local Backup: in-app “Download Project Snapshot (.zip)” button

Accessibility: tab order, ARIA roles, prefers-reduced-motion guardrails

---

## State & Persistence

zustand or xstate for deterministic state machines (quests, fragments, towns)

Export/import player state as JSON; encrypt at rest if cloud sync is enabled

---

## Definition of Done

Screens: Landing, Onboarding, Dashboard, Chart, Lab, Town

Sentence → Quest loop wired to /core/collapse

Backup button produces a portable snapshot

E2E smoke via Playwright: onboarding → chart → generate sentence → accept quest

---

## Quick Start (local)

npm i
git submodule update --init --recursive
npm run dev

---

## Commit Hygiene

Conventional commits

Include screenshots of new UI flows in PR descriptions

