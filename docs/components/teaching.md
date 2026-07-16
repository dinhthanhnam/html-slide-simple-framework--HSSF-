# Teaching components (PR-08)

Step-by-step, timeline, compare, agenda, definitions. Pair with `data-hssf-fragment` for reveal.

## Steps

```html
<ol class="hssf-steps"><!-- default vertical -->
  <li class="hssf-steps__item" data-hssf-fragment>
    <span class="hssf-steps__num">01</span>
    <div class="hssf-steps__content">
      <h3 class="hssf-steps__title">Init repo</h3>
      <p class="hssf-steps__desc"><code>git init</code></p>
    </div>
  </li>
</ol>

<ol class="hssf-steps hssf-steps--horizontal">…</ol>
```

Modifiers: `--vertical` (default) · `--horizontal`

## Timeline

```html
<ul class="hssf-timeline">
  <li class="hssf-timeline__item" data-hssf-fragment>
    <span class="hssf-timeline__dot" aria-hidden="true"></span>
    <div class="hssf-timeline__body">
      <p class="hssf-timeline__time">Bước 1</p>
      <p class="hssf-timeline__text">Working tree dirty</p>
    </div>
  </li>
</ul>
```

## Compare

```html
<div class="hssf-compare">
  <div class="hssf-compare__col hssf-compare__col--cons">
    <h3 class="hssf-compare__title">Hạn chế</h3>
    <ul class="hssf-list"><li>…</li></ul>
  </div>
  <div class="hssf-compare__col hssf-compare__col--pros">
    <h3 class="hssf-compare__title">Giải pháp</h3>
    <ul class="hssf-list"><li>…</li></ul>
  </div>
</div>
```

## Agenda

```html
<ol class="hssf-agenda">
  <li class="hssf-agenda__item">
    <span class="hssf-agenda__num">01</span>
    <p class="hssf-agenda__text">Git là gì?</p>
  </li>
</ol>
```

## Definitions

```html
<div class="hssf-defs">
  <div class="hssf-defs__row">
    <dt>Commit</dt>
    <dd>Snapshot có message</dd>
  </div>
</div>
```
