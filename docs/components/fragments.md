# Fragments (step reveal)

**Status:** PR-05 + hold  
**Contract:** KD-5 — author attribute only; runtime toggles `.is-visible`.

## Author markup

```html
<ul class="hssf-list">
  <li>Luôn hiện</li>
  <li data-hssf-fragment>Bước 1 (reveal bằng → / Space)</li>
  <li data-hssf-fragment="fade">Bước 2 (fade = default)</li>
  <li data-hssf-fragment="highlight">Bước 3 (viền đỏ Rikkei)</li>
</ul>

<!-- Grid / cards: keep box so layout does not jump -->
<div class="hssf-grid hssf-grid--2">
  <article class="hssf-card" data-hssf-fragment="hold">…</article>
  <article class="hssf-card" data-hssf-fragment="hold">…</article>
</div>
```

### Rules

| Do | Don't |
|----|--------|
| Chỉ dùng `data-hssf-fragment` | Tự thêm `.is-visible` hoặc `.hssf-fragment` |
| Flat DOM order | Nested fragment stacks |
| Optional value: `fade` \| `highlight` \| **`hold`** | Invent variants without docs |
| `hold` on grid/flex **items** that must keep size | `hold` on every list bullet (reflow is fine) |

## Variants

| Value | Hidden behavior | Use when |
|-------|-----------------|----------|
| (empty) / `fade` | `display: none` — list reflows | Steps, bullets, timeline (teaching default) |
| `highlight` | same as fade; revealed with brand outline | Emphasize one item |
| **`hold`** | box stays in flow (`visibility` + `opacity`); no height jump | Cards in `hssf-grid`, compare columns, fixed two-column panels |

## Runtime behavior

1. **Enter slide:** index `data-hssf-fragment-index="0..k"`; all hidden.
2. **Next (→ / Space / next button):** reveal next fragment; if none left → next slide.
3. **Prev (←):** hide last visible fragment; if none → previous slide.
4. **Leave slide:** remove all `.is-visible` (**reset**). Re-enter starts from zero.
5. **Home / End:** jump slide + reset fragments on leave.
6. **Advance hint (v0.5):** when no fragments remain (or none exist) and not last slide, a toaster + next-button pulse signals that the next next-action goes to the next slide — see [chrome.md](../chrome.md).

## Events

```js
canvas.addEventListener("hssf:fragment", (e) => {
  // e.detail: { action, slideIndex, fragmentIndex, totalFragments, visible, variant? }
  // action: 'reveal' | 'hide' | 'reset' | 'prepare'
});
```

## API helpers

```js
import {
  getFragmentState,
  revealNextFragment,
  resetFragments,
} from "hssf";

const deck = HSSF.init(canvas);
deck.getFragmentState(); // { total, visible, nextIndex, complete, variants }
```

## CSS notes

- Default hidden: `display: none` (list reflows — intentional).
- `hold`: does **not** use `display: none`; keeps author `display` (flex/grid/block).
- `highlight`: soft red background + primary outline when visible.
- `prefers-reduced-motion`: no entrance animation.
- **Print:** all fragments forced visible (`print.css`).
- **Do not** re-implement hold in `deck.css` unless pinning an older runtime without `hold`.

## Anti-patterns

- Putting fragments outside `.hssf-slide`
- Nested `data-hssf-fragment` for ordered stacks
- Deck-local `!important` overrides fighting fragment CSS on modern runtimes
- Styling with invented public classes instead of documented variants
