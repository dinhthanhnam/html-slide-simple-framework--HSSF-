# Changelog

All notable changes to HSSF (`hssf-slides` + `@dinhthanhnam/create-hssf`) are documented here.

## [0.5.0] — 2026-07-22

### Added

- **Advance-slide hint:** toaster bottom-right when the next next-action advances to the next slide (fragments complete / none left). Pulse on `[data-hssf-next]`. Disable via `advanceHint: false` or `data-hssf-advance-hint="off"`.

### Docs

- `docs/chrome.md` + fragments note for advance hint

## [0.4.0] — 2026-07-22

Charter discipline + fragment `hold` (minor).

### Added

- **`docs/charter.md`** — product scope: thin decks, preferred components, Tailwind/figure hand-offs, 15–20+ slide sessions
- Fragment variant **`data-hssf-fragment="hold"`** — keeps layout box (no `display:none`) for grid/flex cards

### Docs

- Preferred vs soft-deprecated allowlist in `docs/components/README.md`
- Flow/media: prefer figure for architecture; frame/carousel secondary
- Writing playbook + anti-patterns + agent checklist aligned with charter
- Scaffold `AGENTS.md` (default + sample) updated for preferred allowlist + `hold`

## [0.3.0] — 2026-07-17

Layout primitives + media frames + carousel (reduce need for Tailwind on decks).

### Added — layout

- `hssf-stack`, `hssf-cluster`, `hssf-split`, `hssf-media-split`, `hssf-fill`, `hssf-spacer`
- Columns: `--3-1` / `--1-3`, gap `--tight|--loose`, align `--start|--center|--end`
- Grid: `--auto`, gap/align modifiers
- Card: `--compact`, `--center`, `--row`; equal height in grids
- `hssf-slide__inner` default gap + `--tight|--loose`

### Added — media

- **`hssf-frame`**: soft/shadow/primary, browser chrome, polaroid, device, badge, caption
- **`hssf-carousel`**: viewport + slides + prev/next + dots + counter; runtime `attachCarousels`
- Deck arrows not stolen unless focus is inside carousel

### Docs

- Updated `docs/components/layout.md`, `media.md`, allowlist, scaffold `AGENTS.md` snippets

---

## [0.2.1] — 2026-07-16

### Fixed

- **Type scale vs deck override:** `--hssf-fs-*` used `rem` (always vs `<html>`), so setting `--hssf-stage-font-size` on `.hssf-stage` did **not** enlarge titles/lists/cards.
- `--hssf-fs-*` are now `calc(N * var(--hssf-stage-font-size))`. Deck authors can scale the whole deck with:

```css
.hssf-stage {
  --hssf-stage-font-size: 20px;
}
```

Default multipliers unchanged (at 16px stage root: base still 18px, hero 72px, etc.).

---

## [0.2.0] — 2026-07-16

Interactive teaching extras: glossary modals, motion utilities, flow/arrow connectors.

### npm package names

| Package | Version | Notes |
|---------|---------|--------|
| `hssf-slides` | **0.2.0** | Runtime |
| `@dinhthanhnam/create-hssf` | **0.2.0** | CLI (aligned version) |

### Added

- **Glossary terms + modal**
  - Markup: `button.hssf-term[data-hssf-term]` + `data-hssf-term-title` / `data-hssf-term-body`
  - Rich defs: `data-hssf-term="id"` + `[data-hssf-term-def="id"]`
  - Runtime injects modal; Esc / backdrop / close; pauses slide keyboard nav while open
  - `HSSF.init({ terms })`, `deck.closeTerm()`, `deck.isTermOpen()`, events `hssf:termopen` / `hssf:termclose`
- **Motion utilities** (`hssf-fx--*`)
  - Hover: pulse, spin, lift, scale, glow
  - Continuous: pulse, spin, spin-slow
  - `prefers-reduced-motion` respected
- **Flow / arrow / connector system**
  - `hssf-flow` row/col + nodes + labeled edges
  - `hssf-arrow` (right/down/left/up/bidir/glyph)
  - `hssf-connector` (h/v/dashed/elbow/tee)
- Docs: `docs/components/{flow,effects,term}.md`; scaffold `AGENTS.md` snippets
- Sample deck: VCS slide uses flow + terms demo

### Size budgets (gzip, unchanged)

- `hssf.min.css` ≤ 50 KB  
- `hssf.min.js` ≤ 200 KB

---

## [0.1.1 / CLI 0.1.2] — 2026-07-16

First public npm release for **Rikkei Education** HTML training decks.

### npm package names

| Package | Version | Notes |
|---------|---------|--------|
| `hssf-slides` | **0.1.1** | Runtime (short `hssf` blocked by npm) |
| `@dinhthanhnam/create-hssf` | **0.1.2** | CLI (unscoped `create-hssf` blocked as similar to `create-hash`) |

### Added

- Runtime **`hssf-slides`**: design tokens, chrome/scale, navigation, fragments, component CSS, highlight.js + Atom One Dark, print
- Dual build: IIFE (`window.HSSF`) + ESM; minified production assets
- Scaffold CLI **`@dinhthanhnam/create-hssf`** (bin `create-hssf`): CDN or `--local` vendor, templates `default` \| `sample`, self-contained `AGENTS.md`
- Sample deck: Git Fundamentals cho Fresher (18 slides)
- Docs: agent cookbook under `docs/`, monorepo `AGENTS.md`
- CI: unit tests, size budgets, Playwright smoke (no document scrollbars)

### Accessibility (PR-13)

- Canvas defaults: `role="region"`, `aria-roledescription="slide deck"`, polite live region
- Nav control labels when missing; progressbar ARIA on progress bar
- Autofocus remains **opt-in** (`autofocus: true`)
- Larger nav hit targets; `100dvh` / safe-area; Vietnamese `overflow-wrap` on titles

### Size budgets (gzip)

- `hssf.min.css` ≤ 50 KB  
- `hssf.min.js` ≤ 200 KB (includes highlight.js common)

### Notes

- Personalization for Rikkei Education only (not a universal framework)
- Pin CDN versions; prefer HTTP serve over `file://`
