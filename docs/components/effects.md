# Motion & hover effects (v0.2)

Utility classes prefix **`hssf-fx--`**. Compose on icons, cards, flow nodes, stats, etc.

All continuous animations honor `prefers-reduced-motion: reduce`.

## Hover (recommended for teaching)

```html
<div class="hssf-icon-circle hssf-fx--hover-pulse">1</div>
<div class="hssf-card hssf-fx--hover-lift">…</div>
<div class="hssf-flow__node hssf-fx--hover-glow">Staging</div>
<span class="hssf-icon-circle hssf-fx--hover-spin">↻</span>
<div class="hssf-stat__value hssf-fx--hover-scale">3</div>
```

| Class | Behavior |
|-------|----------|
| `hssf-fx--hover-pulse` | Soft scale + pulse ring on hover/focus |
| `hssf-fx--hover-spin` | Continuous spin while hovered |
| `hssf-fx--hover-lift` | Lift + card shadow |
| `hssf-fx--hover-scale` | Scale ~1.06 |
| `hssf-fx--hover-glow` | Brand glow / border |

## Continuous attention (use sparingly)

```html
<span class="hssf-icon-circle hssf-fx--pulse">!</span>
<span class="hssf-icon-circle hssf-fx--spin-slow" aria-hidden="true">↻</span>
```

| Class | Notes |
|-------|--------|
| `hssf-fx--pulse` | Always pulsing — one key callout max per slide |
| `hssf-fx--spin` | Fast continuous spin |
| `hssf-fx--spin-slow` | Slow spin (loading metaphor) |

## Anti-patterns

- Do not put continuous spin on large text blocks
- Do not stack 4+ continuous animations on one slide
- Prefer hover effects on projector demos where the instructor can point
