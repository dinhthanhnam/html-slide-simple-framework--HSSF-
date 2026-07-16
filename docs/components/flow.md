# Flow, arrows & connectors (v0.2)

Markup-first diagram system for process / state slides. Prefer this over hand-drawn SVG for linear and simple branch layouts.

Complements [visual.md](./visual.md) `hssf-diagram` (lighter frame + text arrows).

## Flow row

```html
<div class="hssf-flow hssf-flow--row hssf-flow--loose">
  <div class="hssf-flow__node">Working</div>
  <span class="hssf-flow__edge" aria-hidden="true">
    <span class="hssf-flow__line"></span>
    <span class="hssf-arrow hssf-arrow--right"></span>
  </span>
  <div class="hssf-flow__node hssf-flow__node--primary">Staging</div>
  <span class="hssf-flow__edge hssf-flow__edge--labeled" aria-hidden="true">
    <span class="hssf-flow__edge-label">git commit</span>
    <span class="hssf-flow__line"></span>
    <span class="hssf-arrow hssf-arrow--right"></span>
  </span>
  <div class="hssf-flow__node hssf-flow__node--soft">Repository</div>
</div>
```

### Direction

| Class | Layout |
|-------|--------|
| `hssf-flow--row` | Horizontal (default with `--row`) |
| `hssf-flow--col` | Vertical stack; edges become vertical |
| `hssf-flow--wrap` | Allow wrap |
| `hssf-flow--tight` / `--loose` | Gap density |

### Nodes

| Class | Use |
|-------|-----|
| `hssf-flow__node` | Default card node |
| `--primary` | Brand fill (white text) |
| `--soft` | Soft red fill |
| `--outline` | Red border, transparent fill |
| `--sm` | Compact |
| `hssf-flow__node-sub` | Secondary line under label |

### Edges

- `hssf-flow__edge` + `hssf-flow__line` + `hssf-arrow`
- `--dashed`, `--muted`, `--labeled` (+ `hssf-flow__edge-label`)

## Standalone arrows

```html
<span class="hssf-arrow hssf-arrow--right" aria-hidden="true"></span>
<span class="hssf-arrow hssf-arrow--down" aria-hidden="true"></span>
<span class="hssf-arrow hssf-arrow--left" aria-hidden="true"></span>
<span class="hssf-arrow hssf-arrow--up" aria-hidden="true"></span>
<span class="hssf-arrow hssf-arrow--bidir" aria-hidden="true"></span>
<span class="hssf-arrow hssf-arrow--glyph" aria-hidden="true">→</span>
```

Modifiers: `--lg`, `--muted`, `--white`.

## Connector primitives

For custom grids / columns layouts (not between flex flow items):

```html
<div class="hssf-connector hssf-connector--h" aria-hidden="true"></div>
<div class="hssf-connector hssf-connector--v" aria-hidden="true"></div>
<div class="hssf-connector hssf-connector--h hssf-connector--dashed" aria-hidden="true"></div>
<div class="hssf-connector hssf-connector--elbow" aria-hidden="true"></div>
<div class="hssf-connector hssf-connector--tee" aria-hidden="true"></div>
```

## When to use what

| Need | Component |
|------|-----------|
| Simple 3 boxes + → text | `hssf-diagram` (still valid) |
| Labeled arrows, node variants, hover | **`hssf-flow`** |
| Free layout L / T lines | `hssf-connector` |
| Complex org chart / freeform | Author SVG in `hssf-figure` |

## A11y

- Decorative arrows/edges: `aria-hidden="true"`
- Meaningful sequence: keep text in nodes; do not rely on arrow alone
