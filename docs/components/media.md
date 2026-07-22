# Media components

Figure, **frame** (khung ảnh), and **carousel**.

Assets live in the **deck** (`assets/`), not the `hssf-slides` package.

---

## Figure

```html
<figure class="hssf-figure hssf-figure--shadow hssf-figure--border">
  <img class="hssf-figure__img" src="assets/diagram.png" alt="Git workflow" />
  <figcaption class="hssf-figure__caption">
    Nguồn: tài liệu nội bộ Rikkei Education
  </figcaption>
</figure>
```

| Modifier | Effect |
|----------|--------|
| `--border` | Border around image |
| `--shadow` | Soft card shadow |
| `--contain` | Full width, object-fit contain |
| `--cover` | object-fit cover |
| `--full` | Stretch to column width |

Max height: `--hssf-figure-max-h` (~520px).

---

## Frame (khung ảnh / screenshot) — secondary

**Prefer `hssf-figure` for most images** (diagrams, infographics, photos).

`hssf-frame` is **soft-deprecated as a default** ([charter](../charter.md)): easy to over-chrome. Use only when the chrome teaches something (e.g. real UI screenshot in a browser frame).

| Asset type | Prefer |
|------------|--------|
| Architecture / infographic | `hssf-figure--shadow` (no fake browser) |
| Terminal / console crop | `hssf-figure` or simple `--device` if needed |
| Product UI screenshot | `hssf-frame--browser` OK |

Rich chrome around screenshots — not a substitute for a clear figure:

### Simple soft frame

```html
<figure class="hssf-frame hssf-frame--shadow">
  <div class="hssf-frame__media">
    <img class="hssf-frame__img" src="assets/console.png" alt="Terminal output" />
    <span class="hssf-frame__badge">01</span>
  </div>
  <figcaption class="hssf-frame__caption">ssh vào VPS lần đầu</figcaption>
</figure>
```

### Browser chrome

```html
<figure class="hssf-frame hssf-frame--browser">
  <div class="hssf-frame__chrome" aria-hidden="true">
    <span class="hssf-frame__dots">
      <span class="hssf-frame__dot"></span>
      <span class="hssf-frame__dot"></span>
      <span class="hssf-frame__dot"></span>
    </span>
    <p class="hssf-frame__titlebar">https://example.com</p>
  </div>
  <div class="hssf-frame__media">
    <img class="hssf-frame__img" src="assets/ui.png" alt="Dashboard" />
  </div>
</figure>
```

### Polaroid / device

```html
<figure class="hssf-frame hssf-frame--polaroid">
  <div class="hssf-frame__media">
    <img class="hssf-frame__img" src="assets/photo.jpg" alt="" />
  </div>
  <figcaption class="hssf-frame__caption">Lab: chụp màn hình lab</figcaption>
</figure>

<figure class="hssf-frame hssf-frame--device hssf-frame--cover">
  <div class="hssf-frame__media">
    <img class="hssf-frame__img" src="assets/mobile.png" alt="Mobile UI" />
  </div>
</figure>
```

| Class | Use |
|-------|-----|
| `hssf-frame` | Base |
| `--soft` / `--shadow` / `--primary` | Surface |
| `--browser` | Traffic lights + title bar |
| `--polaroid` | Photo mat + caption below |
| `--device` | Dark bezel |
| `--cover` / `--sm` / `--lg` | Media fit / max height |
| `hssf-frame__badge` | Corner label |

---

## Carousel

Markup + runtime (`HSSF.init` → `carousel: true` default).

**Does not steal deck `→`/`←`** unless focus is **inside** the carousel (buttons/dots or tab into it). Prefer buttons when teaching.

```html
<div class="hssf-carousel hssf-carousel--shadow" data-hssf-carousel tabindex="0">
  <div class="hssf-carousel__viewport">
    <div class="hssf-carousel__track">
      <figure class="hssf-carousel__slide is-active" data-hssf-carousel-slide>
        <img class="hssf-carousel__img" src="assets/step-1.png" alt="Bước 1" />
        <figcaption class="hssf-carousel__caption">Bước 1 — tạo VPS</figcaption>
      </figure>
      <figure class="hssf-carousel__slide" data-hssf-carousel-slide>
        <img class="hssf-carousel__img" src="assets/step-2.png" alt="Bước 2" />
        <figcaption class="hssf-carousel__caption">Bước 2 — SSH</figcaption>
      </figure>
      <figure class="hssf-carousel__slide" data-hssf-carousel-slide>
        <img class="hssf-carousel__img" src="assets/step-3.png" alt="Bước 3" />
        <figcaption class="hssf-carousel__caption">Bước 3 — cài package</figcaption>
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

| Attr / class | Role |
|--------------|------|
| `data-hssf-carousel` | Root (required) |
| `data-hssf-carousel-slide` | Each panel |
| `data-hssf-carousel-prev` / `next` | Controls |
| `data-hssf-carousel-dots` | Runtime fills dots |
| `data-hssf-carousel-counter` | `1 / N` text |
| `data-hssf-carousel-loop="false"` | Stop at ends (default loops) |
| `.is-active` | Visible slide (first should have it) |

Disable runtime:

```js
HSSF.init(canvas, { carousel: false });
```

### With layout (text + carousel)

```html
<div class="hssf-media-split hssf-media-split--2-1 hssf-fill">
  <div class="hssf-media-split__text hssf-stack">
    <header class="hssf-header">…</header>
    <ul class="hssf-list">…</ul>
  </div>
  <div class="hssf-media-split__media">
    <!-- carousel or frame -->
  </div>
</div>
```

---

## Agent notes

1. Prefer **frame** for single screenshot; **carousel** for 3–6 steps (not 20).
2. Always set meaningful `alt` (or empty `alt=""` if pure decorative + caption).
3. Keep images under `assets/`; pin CDN HSSF version.
4. Do not put deck-wide navigation inside the carousel track.
