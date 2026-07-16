# Chrome & runtime (khung)

## DOM skeleton

```
.hssf-body
└── .hssf-canvas[data-hssf-canvas]
    ├── .hssf-progress > .hssf-progress__bar
    ├── .hssf-live.hssf-sr-only[data-hssf-live]
    ├── .hssf-stage-wrap
    │   └── .hssf-stage[data-hssf-stage]
    │       └── section.hssf-slide[data-hssf-slide] × N
    │           ├── .hssf-slide__inner
    │           └── footer.hssf-footer
    └── nav.hssf-nav
        ├── [data-hssf-prev]
        ├── [data-hssf-counter]
        ├── [data-hssf-next]
        └── [data-hssf-fullscreen]
```

Nav and progress are **viewport chrome** — they do **not** scale with the stage.

## Slide variants

| Class | Use |
|-------|-----|
| `hssf-slide--title` | Opening |
| `hssf-slide--section` | Red divider |
| `hssf-slide--content` | Default teaching |
| `hssf-slide--dark` | Rare dark content |

Only one slide has `.is-active` at a time. Runtime sets `aria-hidden`.

## Scale model (normative)

Logical stage: **1920×1080**.

```
transform: translate(-50%, -50%) scale(s)
s = min(wrapW / 1920, wrapH / 1080)
```

- Stage is `position: absolute` inside `.hssf-stage-wrap`
- **Forbidden:** CSS `zoom`; stage in normal flow at 1920×1080
- Acceptance: **no document scrollbars** at 1280×720 / 1366×768

API: `deck.fit()`, `HSSF.fitStage(canvas)`, `HSSF.computeScale(...)`.

## Navigation

Fragment-first: next reveals `data-hssf-fragment`, then advances slide.  
Leaving a slide **resets** fragments.

See [components/fragments.md](./components/fragments.md).

### Hash

- Write: `#3` (1-based)
- Read: `#3`, `#slide-3`, `#slide=3`
- Clamp out of range

### Progress

`width = n <= 1 ? 0 : (i / (n - 1)) * 100%`  
= journey from first → last slide (0% on first, 100% on last).

### Events

```js
canvas.addEventListener("hssf:slidechange", (e) => {
  // { index, prevIndex, total }
});
canvas.addEventListener("hssf:fragment", (e) => {
  // { action, slideIndex, fragmentIndex, totalFragments, visible }
});
```

## Footer

```html
<footer class="hssf-footer">
  <span class="hssf-footer__copy">© {{YEAR}} By Rikkei Academy - Rikkei Education - All rights reserved.</span>
  <span class="hssf-footer__page" data-hssf-page></span>
</footer>
```

| Modifier | Use |
|----------|-----|
| `--light` | Section / dark slides |
| `--nopage` | Brand-end (hide page) |

Year = deck creation year (CLI inject), not dynamic JS.

## Print

`print.css`: one slide per page, all fragments visible, nav hidden.  
See [qa.md](./qa.md).

## Accessibility defaults (PR-13)

On `HSSF.init` (unless `{ a11y: false }`):

| Item | Behavior |
|------|----------|
| `role` | `region` (not `application`) |
| `aria-roledescription` | `slide deck` |
| `tabindex` | `0` if missing — keyboard focusable |
| Live region | Creates `[data-hssf-live]` if missing; polite announcements |
| Nav buttons | `aria-label` if unlabeled |
| Progress bar | `role="progressbar"` + valuetext |
| Autofocus | **Off** by default; pass `autofocus: true` to focus canvas |

## Serve constraint

**HTTP(S) MUST.** `file://` is best-effort only (KD-17).
