# Fragments (step reveal)

**Status:** PR-05  
**Contract:** KD-5 — author attribute only; runtime toggles `.is-visible`.

## Author markup

```html
<ul class="hssf-list">
  <li>Luôn hiện</li>
  <li data-hssf-fragment>Bước 1 (reveal bằng → / Space)</li>
  <li data-hssf-fragment="fade">Bước 2 (fade = default)</li>
  <li data-hssf-fragment="highlight">Bước 3 (viền đỏ Rikkei)</li>
</ul>
```

### Rules

| Do | Don't |
|----|--------|
| Chỉ dùng `data-hssf-fragment` | Tự thêm `.is-visible` hoặc `.hssf-fragment` |
| Flat DOM order | Nested fragment stacks |
| Optional value: `fade` \| `highlight` | Invent variants without docs |

## Runtime behavior

1. **Enter slide:** index `data-hssf-fragment-index="0..k"`; all hidden.
2. **Next (→ / Space / next button):** reveal next fragment; if none left → next slide.
3. **Prev (←):** hide last visible fragment; if none → previous slide.
4. **Leave slide:** remove all `.is-visible` (**reset**). Re-enter starts from zero.
5. **Home / End:** jump slide + reset fragments on leave.

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

## CSS

- Hidden: `display: none` (list reflows — intentional for teaching).
- `highlight`: soft red background + primary outline.
- `prefers-reduced-motion`: no entrance animation.
- **Print:** all fragments forced visible (`print.css`).

## Anti-patterns

- Putting fragments outside `.hssf-slide`
- Relying on nested `data-hssf-fragment` inside another fragment for ordered stacks
- Styling with invented public classes instead of `data-hssf-fragment="highlight"`
