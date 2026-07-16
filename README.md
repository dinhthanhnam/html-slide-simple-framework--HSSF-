# HSSF — HTML Slide Simple Framework

Component library for **Rikkei Education** HTML training slides.

Style: white + red, Montserrat. Philosophy: **shadcn-like authoring** (copy HTML markup) + versioned CSS/JS runtime on npm / jsDelivr. Not a universal framework; no drag-drop admin.

- Design: [`DESIGN.md`](./DESIGN.md)
- **Docs for agents:** [`docs/README.md`](./docs/README.md)
- Monorepo agent entry: [`AGENTS.md`](./AGENTS.md)
- Changelog: [`CHANGELOG.md`](./CHANGELOG.md)

## Status

| Item | State |
|------|--------|
| Monorepo / tooling | **Done (PR-01)** |
| Design tokens & brand | **Done (PR-02)** |
| Canvas / scale / chrome | **Done (PR-03)** |
| Navigation + hash + fullscreen | **Done (PR-04)** |
| Fragments contract + tests | **Done (PR-05)** |
| Layout components | **Done (PR-06)** |
| Content components | **Done (PR-07)** |
| Teaching / visual / media | **Done (PR-08)** |
| Production build + Playwright | **Done (PR-09)** |
| Sample deck Git fresher | **Done (PR-10)** |
| `npx create-hssf` CLI | **Done (PR-11)** |
| Agent documentation | **Done (PR-12)** |
| Polish / a11y | **Done (PR-13)** |
| npm publish | **Done** — `hssf-slides@0.1.1` + `@dinhthanhnam/create-hssf@0.1.2` |

## Packages

| Package | npm name | Role |
|---------|----------|------|
| Runtime | **`hssf-slides@0.1.1`** | CSS + JS |
| CLI | **`@dinhthanhnam/create-hssf@0.1.2`** (bin: `create-hssf`) | Scaffold |

**npm naming:** short `hssf` / `create-hssf` rejected (similarity). Use **`hssf-slides`** + **`@dinhthanhnam/create-hssf`**.

## Tooling (locked)

- **pnpm** workspaces (`packageManager`: `pnpm@9.15.0`)
- **esbuild** — dual JS build: IIFE (`window.HSSF`) + ESM
- **Node** ≥ 18
- **MIT** license
- **node:test** for unit tests; Playwright smoke later

## Develop

```bash
# Enable pnpm (once)
corepack enable
corepack prepare pnpm@9.15.0 --activate

pnpm install
pnpm run build    # → packages/hssf/dist/*
pnpm run test
pnpm run size     # gzip budgets
pnpm run size     # gzip budgets → dist/size-report.json
pnpm run test:e2e # Playwright smoke (needs pnpm build first)
pnpm run ci       # build + unit + size + e2e

# Preview smoke / sample (serve monorepo root)
pnpm run smoke
# → http://127.0.0.1:5173/examples/smoke/
pnpm run sample
# → http://127.0.0.1:5180/examples/sample-deck/
```

### Sample deck (PR-10)

**Git Fundamentals cho Fresher** — 18 slides, full component coverage.

Path: [`examples/sample-deck/`](./examples/sample-deck/)  
Labels: Title → Agenda → … → End (see `DESIGN.md` § F).

### Scaffold CLI (PR-11)

```bash
pnpm build
pnpm run create-hssf my-deck
pnpm run create-hssf my-deck --local --template sample
# published:
# npx @dinhthanhnam/create-hssf my-deck
```

Generated: `index.html`, `AGENTS.md`, `README.md`, `styles/deck.css`, optional `vendor/`.

## Documentation (PR-12)

| Start | Path |
|-------|------|
| Docs index | [`docs/README.md`](./docs/README.md) |
| Quickstart | [`docs/quickstart.md`](./docs/quickstart.md) |
| Write a session | [`docs/writing-a-deck.md`](./docs/writing-a-deck.md) |
| Checklist | [`docs/agent-checklist.md`](./docs/agent-checklist.md) |
| Anti-patterns | [`docs/anti-patterns.md`](./docs/anti-patterns.md) |
| Components | [`docs/components/README.md`](./docs/components/README.md) |


### Production dist (`pnpm build`)

| File | Role |
|------|------|
| `hssf.min.js` | CDN IIFE (includes highlight.js) |
| `hssf.js` | Debug IIFE |
| `hssf.esm.js` / `hssf.esm.min.js` | ESM |
| `hssf.min.css` | Minified CSS + Atom One Dark + print |
| `build-meta.json` / `size-report.json` | Size telemetry |

**Budgets (gzip):** CSS ≤ 50KB · JS ≤ 200KB (hljs). See [`docs/qa.md`](./docs/qa.md).



### Dist outputs (`packages/hssf/dist`)

| File | Format |
|------|--------|
| `hssf.min.js` | IIFE, minified — CDN / classic `<script>` (bundles **highlight.js**) |
| `hssf.js` | IIFE, unminified |
| `hssf.esm.js` | ESM |
| `hssf.css` / `hssf.min.css` | HSSF styles + official **atom-one-dark.css** |
| `atom-one-dark.css` | Standalone copy of highlight.js theme (optional separate link) |

### Code highlighting

Uses [highlight.js](https://highlightjs.org/) `lib/common` + official **Atom One Dark** theme CSS (not a hand-rolled clone).

```html
<div class="hssf-code">
  <div class="hssf-code__header">Dockerfile</div>
  <pre><code class="language-dockerfile">FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY app.jar app.jar
ENTRYPOINT ["java","-jar","app.jar"]
</code></pre>
</div>
```

`HSSF.init(canvas)` runs `highlight.js` on all `pre code` under the deck. Disable with `HSSF.init(canvas, { highlight: false })`.

### Navigation (PR-04)

| Input | Action |
|-------|--------|
| `→` `PageDown` `Space` | Next fragment, else next slide |
| `←` `PageUp` | Prev fragment, else prev slide |
| `Home` / `End` | First / last slide |
| `F` / fullscreen button | Toggle fullscreen on canvas |
| Buttons `[data-hssf-next]` / `prev` | Same as arrows |
| Hash `#3` / `#slide-3` | Deep-link (canonical write `#n`) |
| Swipe horizontal ≥50px | Next / prev |

```js
const deck = HSSF.init(canvas, {
  hash: true,       // default
  keyboard: true,   // default
  swipe: true,      // default
  clickNav: false,  // opt-in: click stage to advance
  highlight: true,
  scale: true,
});
deck.next();
deck.prev();
deck.goTo(2);
deck.getIndex();
deck.toggleFullscreen();
deck.getFragmentState(); // { total, visible, nextIndex, complete }
```

### Fragments (PR-05)

```html
<li data-hssf-fragment>Step 1</li>
<li data-hssf-fragment="highlight">Step 2</li>
```

- Only `data-hssf-fragment` — runtime toggles `.is-visible`
- **Reset on leave** slide; re-enter starts at zero
- Event: `hssf:fragment` `{ action, slideIndex, fragmentIndex, totalFragments, visible }`
- Docs: [`docs/components/fragments.md`](./docs/components/fragments.md)

### Layout (PR-06)

`hssf-header` · `hssf-title-block` · `hssf-section-block` · `hssf-brand-end` · `hssf-columns` · `hssf-grid` · `hssf-card`

Cookbook: [`docs/components/layout.md`](./docs/components/layout.md)

### Content (PR-07)

`hssf-heading` · `hssf-list` · `hssf-callout` · `hssf-quote` · `hssf-table` · `hssf-code` (+ highlight.js)

Cookbook: [`docs/components/content.md`](./docs/components/content.md)

### Teaching / visual / media (PR-08)

- Teaching: `steps` · `timeline` · `compare` · `agenda` · `defs`
- Visual: `icon-circle` · `icon-label` · `stat` · `accent` · `diagram`
- Media: `figure`

Docs: [`teaching.md`](./docs/components/teaching.md) · [`visual.md`](./docs/components/visual.md) · [`media.md`](./docs/components/media.md)



CDN (after publish):

```
https://cdn.jsdelivr.net/npm/hssf-slides@0.1.1/dist/hssf.min.css
https://cdn.jsdelivr.net/npm/hssf-slides@0.1.1/dist/hssf.min.js
```

## Repo layout

```
packages/hssf/           # runtime
packages/create-hssf/    # CLI (stub until PR-11)
scripts/build.mjs        # esbuild + CSS concat
examples/                # smoke + sample (later PRs)
docs/                    # agent-oriented docs (later)
reference/session-4-notes.md  # brand extraction from Session 4.pptx
DESIGN.md                # architecture & PR plan
```

## Brand tokens (PR-02)

Curated from Session 4 (Rikkei Education):

| Token | Value |
|-------|--------|
| `--hssf-color-primary` | `#BE2727` |
| `--hssf-color-soft` | `#FEF2F2` |
| `--hssf-color-text` | `#333333` |
| `--hssf-code-bg` | `#282c34` (Atom One Dark) |
| `--hssf-font-sans` | Montserrat |
| `--hssf-font-mono` | Courier New |
| `--hssf-slide-w/h` | 1920 × 1080 (16:9) |

Full notes: [`reference/session-4-notes.md`](./reference/session-4-notes.md)


## License

MIT — see [LICENSE](./LICENSE)
