# AGENTS.md — HSSF monorepo

Instructions for coding agents working **in this repository** (not only generated decks).

## What this project is

**HSSF** = HTML Slide Simple Framework for **Rikkei Education** only.

- shadcn-like **markup components** + versioned CSS/JS runtime
- Packages: `hssf` (runtime), `create-hssf` (scaffold CLI)
- Not a universal presentation framework; no drag-drop admin

Canonical design: [`DESIGN.md`](./DESIGN.md)  
Human/agent docs: [`docs/README.md`](./docs/README.md)

## Commands

```bash
pnpm install
pnpm build          # packages/hssf/dist/*
pnpm test           # unit (node:test)
pnpm size           # gzip budgets
pnpm test:e2e       # Playwright smoke (build first; chromium installed)
pnpm ci             # build + test + size + e2e
pnpm run sample     # serve sample-deck
pnpm run create-hssf my-deck
```

## Layout

```
packages/hssf/           # runtime CSS + JS
packages/create-hssf/    # npx scaffold
examples/smoke/          # early chrome/nav smoke
examples/sample-deck/    # 18-slide Git fresher
docs/                    # agent cookbook (PR-12)
reference/               # brand extraction notes
```

## When authoring slides

1. Prefer editing `examples/sample-deck` or scaffolding via `create-hssf`.
2. Public classes: allowlist in [`docs/components/README.md`](./docs/components/README.md).
3. Fragments: [`docs/components/fragments.md`](./docs/components/fragments.md).
4. Playbook: [`docs/writing-a-deck.md`](./docs/writing-a-deck.md).
5. Before done: [`docs/agent-checklist.md`](./docs/agent-checklist.md).

## When changing the framework

1. Update tokens/components CSS under `packages/hssf/src/css/`.
2. Keep dual build IIFE + ESM; highlight.js + Atom One Dark stay bundled.
3. Scale model remains absolute-center + `translate(-50%,-50%) scale(s)` — no CSS `zoom`.
4. Add/extend unit tests; keep Playwright no-scrollbar acceptance.
5. Update `docs/` + scaffold `templates/*/AGENTS.md` if public API/classes change.
6. Do not expand scope to multi-brand or visual admin.

## Generated decks

Decks from CLI include their **own** `AGENTS.md` (self-contained).  
That file is the source of truth **inside** a deck folder; this root file is for the monorepo.

## Non-goals (v0.1)

- Drag-drop editor, speaker notes UI, overview picker
- Prism / manual tok classes
- Icon font packages
- Unscoped universal theming

## Brand

- Primary `#BE2727`, soft `#FEF2F2`, Montserrat + Courier New
- Footer: `© YEAR By Rikkei Academy - Rikkei Education - All rights reserved.`
