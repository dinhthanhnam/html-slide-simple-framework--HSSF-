# Changelog

All notable changes to HSSF (`hssf-slides` + `@dinhthanhnam/create-hssf`) are documented here.

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
