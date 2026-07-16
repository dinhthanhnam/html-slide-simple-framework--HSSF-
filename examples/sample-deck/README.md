# Sample deck — Git Fundamentals cho Fresher

Rikkei Education training deck built with **HSSF** (18 slides).

## Run

```bash
# from monorepo root
pnpm build
npx --yes serve . -l 5180
# open http://127.0.0.1:5180/examples/sample-deck/
```

Or:

```bash
pnpm run sample
```

## Assets

| Path | Use |
|------|-----|
| `assets/images/branch-flow.svg` | Slide Lab (figure) |
| `styles/deck.css` | `.deck-*` local only |

Runtime CSS/JS: `../../packages/hssf/dist/hssf.css` + `hssf.js` (dev). After npm publish, pin:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/hssf@0.1.0/dist/hssf.min.css" />
<script src="https://cdn.jsdelivr.net/npm/hssf@0.1.0/dist/hssf.min.js" defer></script>
```

## Coverage

See monorepo `DESIGN.md` § F — all catalog blocks appear at least once.  
Acceptance test: `packages/hssf/test/sample-deck.test.js`.

## Controls

| Key | Action |
|-----|--------|
| → / Space | Next fragment / slide |
| ← | Prev |
| Home / End | First / last |
| F | Fullscreen |
| `#5` | Jump to slide 5 |
