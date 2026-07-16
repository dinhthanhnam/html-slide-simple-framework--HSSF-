# Glossary terms + modal (v0.2)

Clickable terms open a **modal dialog** with a short definition. Runtime ships with `HSSF.init` (`terms: true` by default).

## Inline attributes (simplest)

```html
<button
  type="button"
  class="hssf-term"
  data-hssf-term
  data-hssf-term-title="Commit"
  data-hssf-term-body="Snapshot of the project at a point in time."
>
  commit
</button>
```

- Use **`<button type="button">`** (not bare `<span>`) for keyboard + a11y
- `data-hssf-term` marks the trigger
- Title/body via `data-hssf-term-title` / `data-hssf-term-body` (plain text; newlines → `<br>`)

## Chip style

```html
<button type="button" class="hssf-term hssf-term--chip" data-hssf-term
  data-hssf-term-title="Staging" data-hssf-term-body="Index / vùng đệm trước commit.">
  Staging
</button>
```

## Rich HTML definition

```html
<button type="button" class="hssf-term" data-hssf-term="branch">branch</button>

<div hidden data-hssf-term-def="branch">
  <span data-hssf-term-def-title>Branch</span>
  <p>Một dòng phát triển độc lập trong repo.</p>
  <p>Nhánh mặc định thường là <code>main</code>.</p>
</div>
```

- `data-hssf-term="id"` matches `[data-hssf-term-def="id"]` anywhere under the canvas
- Optional `[data-hssf-term-def-title]` becomes the modal title
- Definition node stays `hidden` in the slide; content is cloned into the modal

## Behavior

| Action | Result |
|--------|--------|
| Click term | Open modal |
| Esc / backdrop / × | Close |
| While open | Slide keyboard nav paused |
| Print | Modal hidden |

## API / events

```js
const deck = HSSF.init(canvas);
deck.isTermOpen(); // boolean
deck.closeTerm();

canvas.addEventListener("hssf:termopen", (e) => {
  console.log(e.detail.title, e.detail.trigger);
});
canvas.addEventListener("hssf:termclose", () => {});
```

Disable:

```js
HSSF.init(canvas, { terms: false });
```

## Tips

- Keep body ≤ 2–3 short sentences (projector readability)
- Do not put secrets in term bodies
- One idea per modal — link “xem thêm” only if needed outside deck
