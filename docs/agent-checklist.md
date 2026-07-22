# Agent checklist

Run this before declaring a deck complete.

## Structure

- [ ] Single `[data-hssf-canvas]` + `[data-hssf-stage]`
- [ ] Every slide: `data-hssf-slide` + unique `data-hssf-label`
- [ ] First slide has `is-active` (or leave to runtime ensure)
- [ ] Footer on each slide; section slides use `hssf-footer--light`
- [ ] End uses `hssf-brand-end` (+ `--nopage` if desired)
- [ ] Nav has `data-hssf-prev` / `next` / `counter` / `fullscreen`
- [ ] Progress bar markup present

## Content

- [ ] Read [charter.md](./charter.md) (thin deck, preferred components, hand-offs)
- [ ] Prefer **preferred** allowlist ([components/README.md](./components/README.md)); avoid soft-deprecated unless justified
- [ ] Full session **≥ 15 slides** (target 15–20+), unless user asked for shorter
- [ ] `styles/deck.css` minimal (tokens only) — no parallel `deck-*` widget kit
- [ ] ≤ 6 bullets / slide; ≤ ~18 lines of code
- [ ] Bullets have claim/evidence (not orphan nouns only)
- [ ] HTML special chars escaped in code samples
- [ ] No real secrets / credentials
- [ ] Images have `alt`; architecture via `hssf-figure` (not flow topology)
- [ ] Grid/card fragments use `data-hssf-fragment="hold"` when layout must stay stable
- [ ] Vietnamese (or requested language) consistent

## Runtime

- [ ] `HSSF.init(...)` after script load
- [ ] CDN version **pinned** or `--local` vendor present
- [ ] Served over HTTP (`npx serve`), not relied on `file://`
- [ ] Keyboard: next/prev/home/end work
- [ ] Fragments: author attribute only; order correct
- [ ] Hash deep-link works (e.g. `#2`)

## Visual QA

- [ ] No document scrollbars at **1280×720** (and ideally 1366×768)
- [ ] Stage letterboxes cleanly; content not clipped unexpectedly
- [ ] Section/title contrast OK (light footer on red)
- [ ] Brand red + Montserrat look intact
- [ ] Print optional: fragments all visible, nav hidden

## Agent process

- [ ] Followed [writing-a-deck.md](./writing-a-deck.md) arc (or user-specified outline)
- [ ] Avoided [anti-patterns.md](./anti-patterns.md)
- [ ] Compared tricky slides to [sample-scenario.md](./sample-scenario.md) / sample-deck

## Quick commands

```bash
# monorepo
pnpm build && pnpm run sample

# scaffolded deck
npx serve .
```
