# Quickstart

## Prerequisites

- Node.js ≥ 18
- HTTP server for viewing decks (`npx serve`)

## Option A — Scaffold a new deck

```bash
npx @dinhthanhnam/create-hssf my-deck
cd my-deck
npx serve .
```

Flags:

```bash
npx @dinhthanhnam/create-hssf my-deck --local
npx @dinhthanhnam/create-hssf my-deck --template sample
npx @dinhthanhnam/create-hssf my-deck --title "Session 03" --year 2026
```

Open the URL printed by `serve`. **Do not** use `file://` as the primary path.

## Option B — Monorepo development

```bash
corepack enable
corepack prepare pnpm@9.15.0 --activate
pnpm install
pnpm build
pnpm run sample
# → http://127.0.0.1:5180/examples/sample-deck/
```

Other targets:

| Command | URL |
|---------|-----|
| `pnpm run smoke` | `/examples/smoke/` |
| `pnpm run sample` | `/examples/sample-deck/` |

Serve **repo root** so relative links to `packages/hssf/dist/*` resolve.

## Minimal HTML contract

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/hssf-slides@0.2.0/dist/hssf.min.css" />
<!-- Montserrat via Google Fonts or self-host -->
<body class="hssf-body">
  <div class="hssf-canvas" data-hssf-canvas tabindex="0" role="region"
       aria-roledescription="slide deck" aria-label="My deck">
    <div class="hssf-progress" data-hssf-progress aria-hidden="true">
      <div class="hssf-progress__bar" data-hssf-progress-bar></div>
    </div>
    <div class="hssf-live hssf-sr-only" data-hssf-live aria-live="polite" aria-atomic="true"></div>
    <div class="hssf-stage-wrap">
      <div class="hssf-stage" data-hssf-stage>
        <section class="hssf-slide hssf-slide--title is-active"
                 data-hssf-slide data-hssf-label="Title" aria-hidden="false">
          <div class="hssf-slide__inner">…</div>
          <footer class="hssf-footer">…</footer>
        </section>
      </div>
    </div>
    <nav class="hssf-nav" data-hssf-nav>…</nav>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/hssf-slides@0.2.0/dist/hssf.min.js" defer></script>
  <script>
    document.addEventListener("DOMContentLoaded", function () {
      window.HSSF.init(document.querySelector("[data-hssf-canvas]"));
    });
  </script>
</body>
```

**Pin the version** (`hssf-slides@0.2.0`), never floating `@latest` in production decks.

## Init options

```js
HSSF.init(canvas, {
  highlight: true,   // highlight.js (default)
  scale: true,       // fit 1920×1080 stage
  navigation: true,  // keyboard, buttons, hash, swipe
  terms: true,       // glossary term → modal (default)
  hash: true,
  keyboard: true,
  swipe: true,
  clickNav: false,   // opt-in: click stage to advance
});
```

## Controls

| Input | Action |
|-------|--------|
| `→` `PageDown` `Space` | Next fragment, else next slide |
| `←` `PageUp` | Prev fragment, else prev slide |
| `Home` / `End` | First / last slide |
| `F` | Fullscreen canvas |
| Buttons `data-hssf-next` / `prev` | Same |
| Hash `#3` / `#slide-3` | Deep link (writes `#n`) |

## Next reads

1. [writing-a-deck.md](./writing-a-deck.md) — cấu trúc buổi học  
2. [components/README.md](./components/README.md) — catalog  
3. [agent-checklist.md](./agent-checklist.md) — QA before handoff  
