# QA matrix (PR-09)

Manual + automated checks for HSSF runtime and smoke deck.

## Automated (CI)

| Check | Command |
|-------|---------|
| Unit tests | `pnpm run test` |
| Size budgets | `pnpm run size` |
| Playwright smoke | `pnpm run test:e2e` |
| Full CI local | `pnpm run ci` |

Playwright project: **Chromium** (required).  
Budgets (gzip): `hssf.min.css` ≤ 50KB · `hssf.min.js` ≤ 200KB (includes highlight.js).

### Smoke assertions

- `data-hssf-ready` after init
- `data-hssf-scale` applied
- **No document scrollbars** at 1280×720 and 1366×768 (±1px)
- Next button / ArrowRight advances fragment or slide
- Hash `#2` → slide index 1

## Manual browsers

| Browser | Priority | Notes |
|---------|----------|--------|
| Chrome / Edge (Chromium) | P0 | Primary; CI covers smoke |
| Firefox | P1 | Keyboard + scale + fullscreen |
| **Safari** (macOS / iOS) | P1 | WebKit: fullscreen prefix, `100vh` chrome, ResizeObserver |
| Projector / 1920×1080 | P0 | Stage fills wrap; no letterbox scroll |

### Safari-specific checklist

1. Open smoke over **HTTP** (`pnpm run smoke`), not `file://`.
2. Stage scales without horizontal page scroll on laptop viewport.
3. Fullscreen button (may need user gesture; webkit prefix handled in runtime).
4. Fragments: `display:none` / `.is-visible` reflow OK.
5. Hash navigation after reload (`#3`).
6. `100dvh` canvas height — no extra bottom gap under iOS Safari chrome.
7. Long Vietnamese titles wrap (`overflow-wrap`) without blowing stage width.

### Projector checklist

1. 1920×1080 output if possible; otherwise letterbox is expected.
2. Nav buttons ≥ 44×44 CSS px — usable with clicker / touch.
3. Stand far test: body ≥ `--hssf-fs-base` (18px logical before scale).
4. Progress bar visible on dark letterbox.
5. Do not put critical UI only in browser chrome (fullscreen recommended).

## Print / PDF

1. Open smoke → browser Print → Landscape.
2. Every slide on its own page.
3. **All fragments visible** (not only current reveal).
4. Nav / progress hidden.
5. Code blocks not clipped mid-block when possible.

## Visual / brand

- Primary red `#BE2727`, Montserrat, footer Rikkei string.
- Section slides: light footer.
- Brand-end slide present in smoke.

## Non-goals (v0.1)

- Pixel-perfect visual regression golden images
- Real device farm (BrowserStack)
- Measuring 60fps in CI
