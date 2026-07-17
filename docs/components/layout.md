# Layout components

Rikkei Education HSSF — shadcn-style **copy markup**. Do not invent public `hssf-*` classes; deck overrides use `.deck-*`.

## Inventory

| Block | Purpose |
|-------|---------|
| `hssf-header` | Content slide title + red accent bar |
| `hssf-title-block` | Title slide hero |
| `hssf-section-block` | Section divider (big number) |
| `hssf-brand-end` | Closing academy slide |
| **`hssf-stack`** | Vertical flex + gap |
| **`hssf-cluster`** | Horizontal wrap + gap |
| **`hssf-split`** | Main + side flex regions |
| **`hssf-media-split`** | Text \| media grid |
| **`hssf-fill` / `hssf-spacer`** | Fill remaining slide body |
| `hssf-columns` | 2/3-col or asymmetric grid |
| `hssf-grid` | Equal card grids |
| `hssf-card` | Content card |

`hssf-slide__inner` is a column flex with gap (`--tight` / `--loose` modifiers).

---

## Layout primitives (v0.3)

Use these instead of Tailwind for common teaching layouts.

### Stack (vertical)

```html
<div class="hssf-stack hssf-stack--loose">
  <header class="hssf-header">…</header>
  <ul class="hssf-list">…</ul>
  <aside class="hssf-callout hssf-callout--tip">…</aside>
</div>
```

| Modifier | Gap / align |
|----------|-------------|
| `--tight` | small gap |
| `--loose` / `--xl` | larger gap |
| `--center` | center items |

### Cluster (horizontal wrap)

```html
<div class="hssf-cluster hssf-cluster--center">
  <div class="hssf-icon-circle">1</div>
  <div class="hssf-icon-circle">2</div>
  <div class="hssf-icon-circle">3</div>
</div>
```

`--tight` · `--loose` · `--center` · `--between` · `--end`

### Split (main + side)

```html
<div class="hssf-split hssf-fill">
  <div class="hssf-split__main hssf-stack">
    <ul class="hssf-list">…</ul>
  </div>
  <div class="hssf-split__side">
    <figure class="hssf-frame hssf-frame--shadow">…</figure>
  </div>
</div>
```

`--col` · `--center` · `--start` · `--tight` · `--loose`

### Media split (text | image)

```html
<div class="hssf-media-split hssf-media-split--1-2 hssf-fill">
  <div class="hssf-media-split__text hssf-stack">
    <header class="hssf-header">…</header>
    <ul class="hssf-list">…</ul>
  </div>
  <div class="hssf-media-split__media">
    <figure class="hssf-frame hssf-frame--browser">…</figure>
  </div>
</div>
```

| Modifier | Columns |
|----------|---------|
| (default) | 1fr 1fr |
| `--1-2` | text narrow, media wide |
| `--2-1` | text wide, media narrow |
| `--media-left` | media on left |

### Fill remaining height

```html
<div class="hssf-slide__inner">
  <header class="hssf-header">…</header>
  <div class="hssf-fill hssf-fill--center">
    <div class="hssf-grid hssf-grid--3">…</div>
  </div>
</div>
```

`hssf-spacer` = empty flex grow between blocks.

---

## Header

```html
<header class="hssf-header">
  <div class="hssf-header__accent" aria-hidden="true"></div>
  <h2 class="hssf-header__title">Dockerfile cơ bản</h2>
  <p class="hssf-header__subtitle">Đóng gói Spring Boot service</p>
</header>
```

---

## Title block

```html
<div class="hssf-title-block hssf-title-block--center">
  <p class="hssf-title-block__eyebrow">Session 01</p>
  <h1 class="hssf-title-block__title">Git Fundamentals cho Fresher</h1>
  <p class="hssf-title-block__meta">Rikkei Education · Backend Starter</p>
</div>
```

Modifiers: `--center` · `--left`

---

## Section block

Use with `hssf-slide--section` + `hssf-footer--light`:

```html
<div class="hssf-section-block">
  <span class="hssf-section-block__num">03</span>
  <h2 class="hssf-section-block__title">Nhánh (Branch) và Merge cơ bản</h2>
</div>
```

---

## Brand end

```html
<div class="hssf-brand-end">
  <p class="hssf-brand-end__kicker">KẾT THÚC</p>
  <h2 class="hssf-brand-end__title">HỌC VIỆN ĐÀO TẠO LẬP TRÌNH CHẤT LƯỢNG NHẬT BẢN</h2>
  <p class="hssf-brand-end__org">Rikkei Education</p>
</div>
```

---

## Columns

```html
<div class="hssf-columns hssf-columns--2 hssf-columns--loose">
  <div class="hssf-columns__col hssf-stack">…</div>
  <div class="hssf-columns__col">…</div>
</div>
```

| Modifier | Grid / align |
|----------|----------------|
| `--2` `--3` | equal cols |
| `--2-1` `--1-2` `--3-1` `--1-3` | asymmetric |
| `--tight` `--loose` | gap |
| `--start` `--center` `--end` | align-items |
| `__col--center` | center column content |

---

## Grid + card

```html
<div class="hssf-grid hssf-grid--3 hssf-grid--loose">
  <article class="hssf-card hssf-card--soft">
    <h3 class="hssf-card__title">Commit</h3>
    <div class="hssf-card__body">Lưu snapshot có thông điệp.</div>
  </article>
  …
</div>
```

Grid: `--2` `--3` `--4` `--auto` · `--tight` `--loose` · `--start` `--center`  
Card: `--soft` `--outline` `--shadow` `--compact` `--center` `--row`

---

## Recipe: content + screenshot

```html
<section class="hssf-slide hssf-slide--content" data-hssf-slide data-hssf-label="Demo">
  <div class="hssf-slide__inner">
    <header class="hssf-header">
      <div class="hssf-header__accent" aria-hidden="true"></div>
      <h2 class="hssf-header__title">Demo SSH</h2>
    </header>
    <div class="hssf-media-split hssf-fill">
      <div class="hssf-media-split__text hssf-stack">
        <ul class="hssf-list">
          <li data-hssf-fragment>Mở terminal</li>
          <li data-hssf-fragment>ssh user@ip</li>
        </ul>
      </div>
      <div class="hssf-media-split__media">
        <figure class="hssf-frame hssf-frame--browser">…</figure>
      </div>
    </div>
  </div>
  <footer class="hssf-footer">…</footer>
</section>
```

---

## Agent notes

1. Prefer **header** + **stack** / **media-split** over ad-hoc margins.
2. One nesting level of columns/split is enough (overflow risk at 1920×1080).
3. Cards in a grid get `height: 100%` for equal rows.
4. Footer on dark/red: `hssf-footer--light`.
