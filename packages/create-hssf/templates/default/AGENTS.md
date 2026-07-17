# AGENTS.md — HSSF deck authoring

You are editing a **Rikkei Education** HTML slide deck built with **HSSF** (HTML Slide Simple Framework).

- **Do not** introduce React/Vue/Svelte or a bundler for simple decks.
- **Do not** invent public `hssf-*` classes outside the allowlist / snippets below.
- Deck-local CSS only under `.deck-*` in `styles/deck.css`.

## Runtime

1. Serve over **HTTP** (not `file://`):

```bash
npx serve .
```

2. Init after `hssf.min.js` loads:

```js
window.HSSF.init(document.querySelector("[data-hssf-canvas]"));
```

3. Pin runtime version on CDN (never `@latest` floating in production decks).

## Skeleton

- One `.hssf-canvas[data-hssf-canvas]`
- One `.hssf-stage[data-hssf-stage]` inside `.hssf-stage-wrap`
- Many `section.hssf-slide[data-hssf-slide][data-hssf-label]`
- Nav + progress **outside** the stage
- Footer copy: `© {{YEAR}} By Rikkei Academy - Rikkei Education - All rights reserved.`
- Title/section dark slides: `hssf-footer--light`
- End slide: `hssf-brand-end` + optional `hssf-footer--nopage`

## Fragments

- Author only: `data-hssf-fragment` or `data-hssf-fragment="fade|highlight"`
- **Do not** set `.is-visible` yourself
- Runtime reveals next fragment on → / Space; **resets on leave slide**

## Density

- ≤ 6 bullets per slide
- Code ≤ ~18 lines
- Escape `& < >` in HTML
- One idea per slide
- 16:9 logical stage; avoid overflow walls of text

## Type size (deck override)

Scale **all** `hssf-fs-*` text via stage root (not bare `rem` / not only body):

```css
/* styles/deck.css */
.hssf-stage {
  --hssf-stage-font-size: 20px; /* default 16px */
}
```

## Allowlist (public `hssf-*`)

title-block, section-block, brand-end, header, **stack / cluster / split / media-split / fill / spacer**, columns, grid, card, heading, list, callout, quote, table, code (+ `language-*` for highlight.js), steps, timeline, compare, agenda, defs, icon-circle, icon-label, stat, accent, diagram, flow, arrow, connector, fx (`hssf-fx--*`), term (+ modal), figure, **frame**, **carousel**, footer, nav, progress

## Terms (glossary modal)

```html
<button type="button" class="hssf-term" data-hssf-term
  data-hssf-term-title="Commit"
  data-hssf-term-body="Snapshot tại một thời điểm.">commit</button>
```

Or rich HTML: `data-hssf-term="id"` + `<div hidden data-hssf-term-def="id">…</div>`.  
Esc / backdrop closes. Do not invent modal markup — runtime injects it.

## Checklist

- [ ] Every slide has `data-hssf-label`
- [ ] Keyboard works over HTTP
- [ ] Fragment order makes sense when teaching
- [ ] No secrets in repo
- [ ] No document scrollbars at 1280×720
- [ ] Footer year correct
- [ ] Terms use `<button type="button">` + `data-hssf-term`

## Snippets (copy-paste)

### Content slide shell

```html
<section class="hssf-slide hssf-slide--content" data-hssf-slide data-hssf-label="Label">
  <div class="hssf-slide__inner"><!-- blocks --></div>
  <footer class="hssf-footer">
    <span class="hssf-footer__copy">© {{YEAR}} By Rikkei Academy - Rikkei Education - All rights reserved.</span>
    <span class="hssf-footer__page" data-hssf-page></span>
  </footer>
</section>
```

### Title

```html
<div class="hssf-title-block hssf-title-block--center">
  <p class="hssf-title-block__eyebrow">Session 01</p>
  <h1 class="hssf-title-block__title">Tiêu đề buổi học</h1>
  <p class="hssf-title-block__meta">Rikkei Education</p>
</div>
```

### Section divider

Pair with `hssf-slide--section` + `hssf-footer--light`:

```html
<div class="hssf-section-block">
  <span class="hssf-section-block__num">02</span>
  <h2 class="hssf-section-block__title">Tên phần</h2>
</div>
```

### Header + list

```html
<header class="hssf-header">
  <div class="hssf-header__accent" aria-hidden="true"></div>
  <h2 class="hssf-header__title">Tiêu đề slide</h2>
  <p class="hssf-header__subtitle">Phụ đề</p>
</header>
<ul class="hssf-list">
  <li>Mục 1</li>
  <li data-hssf-fragment>Mục 2 (reveal)</li>
</ul>
```

### Heading

```html
<div class="hssf-heading">
  <p class="hssf-heading__kicker">1. Chủ đề</p>
  <h2 class="hssf-heading__title">Tiêu đề nội dung</h2>
</div>
```

### Callout

```html
<aside class="hssf-callout hssf-callout--danger">
  <p class="hssf-callout__label">Lưu ý</p>
  <p class="hssf-callout__body">Không commit file <code>.env</code>.</p>
</aside>
```

### Code (highlight.js)

```html
<div class="hssf-code">
  <div class="hssf-code__header">
    <span class="hssf-code__filename">example.sh</span>
    <span class="hssf-code__lang">bash</span>
  </div>
  <pre class="hssf-code__pre"><code class="hssf-code__code language-bash">git status</code></pre>
</div>
```

### Flow + arrows

```html
<div class="hssf-flow hssf-flow--row">
  <div class="hssf-flow__node hssf-fx--hover-lift">A</div>
  <span class="hssf-flow__edge" aria-hidden="true">
    <span class="hssf-flow__line"></span>
    <span class="hssf-arrow hssf-arrow--right"></span>
  </span>
  <div class="hssf-flow__node hssf-flow__node--primary">B</div>
</div>
```

### Layout: text + media

```html
<div class="hssf-media-split hssf-fill">
  <div class="hssf-media-split__text hssf-stack">
    <ul class="hssf-list"><li>Mục 1</li></ul>
  </div>
  <div class="hssf-media-split__media">
    <figure class="hssf-frame hssf-frame--browser">
      <div class="hssf-frame__chrome" aria-hidden="true">
        <span class="hssf-frame__dots">
          <span class="hssf-frame__dot"></span>
          <span class="hssf-frame__dot"></span>
          <span class="hssf-frame__dot"></span>
        </span>
        <p class="hssf-frame__titlebar">demo</p>
      </div>
      <div class="hssf-frame__media">
        <img class="hssf-frame__img" src="assets/shot.png" alt="Demo" />
      </div>
    </figure>
  </div>
</div>
```

### Carousel

```html
<div class="hssf-carousel" data-hssf-carousel tabindex="0">
  <div class="hssf-carousel__viewport">
    <div class="hssf-carousel__track">
      <figure class="hssf-carousel__slide is-active" data-hssf-carousel-slide>
        <img class="hssf-carousel__img" src="assets/1.png" alt="1" />
        <figcaption class="hssf-carousel__caption">Bước 1</figcaption>
      </figure>
      <figure class="hssf-carousel__slide" data-hssf-carousel-slide>
        <img class="hssf-carousel__img" src="assets/2.png" alt="2" />
      </figure>
    </div>
  </div>
  <div class="hssf-carousel__controls">
    <button type="button" class="hssf-carousel__btn" data-hssf-carousel-prev aria-label="Trước">‹</button>
    <div class="hssf-carousel__dots" data-hssf-carousel-dots></div>
    <span class="hssf-carousel__counter" data-hssf-carousel-counter></span>
    <button type="button" class="hssf-carousel__btn" data-hssf-carousel-next aria-label="Sau">›</button>
  </div>
</div>
```

### Steps + fragments

```html
<ol class="hssf-steps">
  <li class="hssf-steps__item" data-hssf-fragment>
    <span class="hssf-steps__num">01</span>
    <div class="hssf-steps__content">
      <h3 class="hssf-steps__title">Bước một</h3>
      <p class="hssf-steps__desc">Mô tả ngắn</p>
    </div>
  </li>
</ol>
```

### Compare

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

### Brand end

```html
<div class="hssf-brand-end">
  <p class="hssf-brand-end__kicker">KẾT THÚC</p>
  <h2 class="hssf-brand-end__title">HỌC VIỆN ĐÀO TẠO LẬP TRÌNH CHẤT LƯỢNG NHẬT BẢN</h2>
  <p class="hssf-brand-end__org">Rikkei Education</p>
</div>
```

## Anti-patterns

- Off-brand colors / non-Montserrat UI fonts
- Missing `data-hssf-slide` / labels
- Inventing `hssf-*` class names
- Loading CDN `@latest` without pin
- Opening deck via `file://` and expecting fullscreen/module quirks to work
