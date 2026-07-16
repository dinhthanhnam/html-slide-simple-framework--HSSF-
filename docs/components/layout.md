# Layout components (PR-06)

Rikkei Education HSSF — shadcn-style **copy markup**. Do not invent public `hssf-*` classes; deck overrides use `.deck-*`.

## Inventory

| Block | Purpose |
|-------|---------|
| `hssf-header` | Content slide title + red accent bar |
| `hssf-title-block` | Title slide hero |
| `hssf-section-block` | Section divider (big number) |
| `hssf-brand-end` | Closing academy slide |
| `hssf-columns` | 2/3-col or asymmetric layout |
| `hssf-grid` | Equal card grids |
| `hssf-card` | Content card |

---

## Header

```html
<header class="hssf-header">
  <div class="hssf-header__accent" aria-hidden="true"></div>
  <h2 class="hssf-header__title">Dockerfile cơ bản</h2>
  <p class="hssf-header__subtitle">Đóng gói Spring Boot service</p>
</header>
```

- Accent width: `--hssf-header-accent-w` (6px)
- Title: `fs-2xl` extrabold · Subtitle: `fs-md` muted

---

## Title block

```html
<section class="hssf-slide hssf-slide--title is-active" data-hssf-slide data-hssf-label="Title">
  <div class="hssf-slide__inner">
    <div class="hssf-title-block hssf-title-block--center">
      <p class="hssf-title-block__eyebrow">Session 01</p>
      <h1 class="hssf-title-block__title">Git Fundamentals cho Fresher</h1>
      <p class="hssf-title-block__meta">Rikkei Education · Backend Starter</p>
    </div>
  </div>
  <footer class="hssf-footer">
    <span class="hssf-footer__copy">© 2026 By Rikkei Academy - Rikkei Education - All rights reserved.</span>
    <span class="hssf-footer__page" data-hssf-page></span>
  </footer>
</section>
```

Modifiers: `--center` (default hero) · `--left`

---

## Section block

Use with `hssf-slide--section` + `hssf-footer--light`:

```html
<section class="hssf-slide hssf-slide--section" data-hssf-slide data-hssf-label="Branch">
  <div class="hssf-slide__inner">
    <div class="hssf-section-block">
      <span class="hssf-section-block__num">03</span>
      <h2 class="hssf-section-block__title">Nhánh (Branch) và Merge cơ bản</h2>
    </div>
  </div>
  <footer class="hssf-footer hssf-footer--light">
    <span class="hssf-footer__copy">© 2026 By Rikkei Academy - Rikkei Education - All rights reserved.</span>
    <span class="hssf-footer__page" data-hssf-page></span>
  </footer>
</section>
```

---

## Brand end

No logo shipped in package (trademark). Optional author image:

```html
<section class="hssf-slide hssf-slide--section" data-hssf-slide data-hssf-label="End">
  <div class="hssf-slide__inner">
    <div class="hssf-brand-end">
      <!-- optional: <img class="hssf-brand-end__logo" src="assets/rikkei-logo.svg" alt="" /> -->
      <p class="hssf-brand-end__kicker">KẾT THÚC</p>
      <h2 class="hssf-brand-end__title">HỌC VIỆN ĐÀO TẠO LẬP TRÌNH CHẤT LƯỢNG NHẬT BẢN</h2>
      <p class="hssf-brand-end__org">Rikkei Education</p>
    </div>
  </div>
  <footer class="hssf-footer hssf-footer--light hssf-footer--nopage">
    <span class="hssf-footer__copy">© 2026 By Rikkei Academy - Rikkei Education - All rights reserved.</span>
    <span class="hssf-footer__page" data-hssf-page></span>
  </footer>
</section>
```

---

## Columns

```html
<div class="hssf-columns hssf-columns--2">
  <div class="hssf-columns__col">…</div>
  <div class="hssf-columns__col">…</div>
</div>
```

| Modifier | Grid |
|----------|------|
| `--2` | 1fr 1fr |
| `--3` | 1fr 1fr 1fr |
| `--2-1` | 2fr 1fr |
| `--1-2` | 1fr 2fr |

---

## Grid + card

```html
<div class="hssf-grid hssf-grid--3">
  <article class="hssf-card hssf-card--soft">
    <h3 class="hssf-card__title">Commit</h3>
    <div class="hssf-card__body">Lưu snapshot có thông điệp.</div>
  </article>
  <article class="hssf-card hssf-card--outline">
    <h3 class="hssf-card__title">Branch</h3>
    <div class="hssf-card__body">Phát triển song song an toàn.</div>
  </article>
  <article class="hssf-card hssf-card--shadow">
    <h3 class="hssf-card__title">Merge</h3>
    <div class="hssf-card__body">Gộp thay đổi vào nhánh chính.</div>
  </article>
</div>
```

Card mods: `--soft` · `--outline` · `--shadow`  
Optional: `hssf-card__icon`, `hssf-card__title`, `hssf-card__body`  
Grid mods: `--2` · `--3` · `--4`

---

## Agent notes

1. Prefer **header** on content slides; **title-block** on first slide; **section-block** on red dividers.
2. Footer on title/section: use `hssf-footer--light` when slide bg is dark/red.
3. Do not nest columns inside columns more than one level (overflow risk at 1920×1080).
4. Card `min-height` = `--hssf-card-min-h` (160px).
