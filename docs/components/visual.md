# Visual components (PR-08)

No icon fonts. Use text, numbers, emoji, or author SVG inside circles.

## Icon circle

```html
<div class="hssf-icon-circle">01</div>
<div class="hssf-icon-circle hssf-icon-circle--sm hssf-icon-circle--soft">A</div>
<div class="hssf-icon-circle hssf-icon-circle--lg hssf-icon-circle--primary">★</div>
```

Sizes: `--sm` `--md` (default) `--lg` · Colors: `--primary` `--soft`

## Icon label

```html
<div class="hssf-icon-label">
  <div class="hssf-icon-circle hssf-icon-circle--md">A</div>
  <span class="hssf-icon-label__text">Nhánh feature</span>
</div>
```

## Stat

```html
<div class="hssf-stat">
  <p class="hssf-stat__value">3</p>
  <p class="hssf-stat__label">vùng chính của Git</p>
</div>
```

## Accent

```html
<div class="hssf-accent hssf-accent--bar-left">
  <p>Nội dung có gạch đỏ trái</p>
</div>
<div class="hssf-accent hssf-accent--blob" aria-hidden="true"></div>
```

## Diagram (placeholder)

```html
<div class="hssf-diagram">
  <div class="hssf-diagram__frame">
    <div class="hssf-diagram__node">Working</div>
    <span class="hssf-diagram__arrow" aria-hidden="true">→</span>
    <div class="hssf-diagram__node">Staging</div>
    <span class="hssf-diagram__arrow" aria-hidden="true">→</span>
    <div class="hssf-diagram__node">Repo</div>
  </div>
  <p class="hssf-diagram__caption">Luồng thay đổi file</p>
</div>
```
