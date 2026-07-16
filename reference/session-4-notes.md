# Session 4 brand extraction notes

**Source file:** `(Slide) Session 4.pptx` (workspace root)  
**Extracted:** 2026-07-16  
**Purpose:** Ground HSSF design tokens in a real Rikkei Education deck.  
**Scope:** Curated subset only — not every color/shape in the PPTX.

---

## Slide geometry

| Property | Value |
|----------|--------|
| Slide count | 28 |
| Size (EMU) | 12 192 000 × 6 858 000 |
| Aspect | **16:9** (widescreen) |
| HSSF logical stage | **1920 × 1080** CSS px |

---

## Typography

| Role | Font (PPTX) | HSSF token |
|------|-------------|------------|
| UI / titles / body | **Montserrat** (also ExtraBold, SemiBold) | `--hssf-font-sans` |
| Code | **Courier New** | `--hssf-font-mono` |
| Icons (rare) | Material Icons (3 runs) | **Non-goal** — no icon font in HSSF v0.1 |

### Observed text sizes (pt, frequency sample)

| pt | Approx role | HSSF mapping (logical rem @ 16px) |
|----|-------------|-----------------------------------|
| 70 | Hero / section | `--hssf-fs-hero` (~72px) |
| 40 | Large title | `--hssf-fs-3xl` / `--hssf-fs-4xl` |
| 26.5 | Slide title | `--hssf-fs-2xl` (~36px on projector-friendly scale) |
| 24 | Subhead | `--hssf-fs-lg` / `--hssf-fs-xl` |
| 14–16 | Body | `--hssf-fs-base` (18px) / `--hssf-fs-md` |
| 10.5–12 | Code / footer / captions | `--hssf-fs-sm` / `--hssf-fs-xs` |

> PPTX points are dense; HSSF uses a slightly larger body scale for classroom projectors while keeping the same hierarchy.

### Font frequency (sample across slides)

| Font | Approx run count |
|------|------------------|
| Courier New | ~367 |
| Montserrat | ~104 |
| Montserrat ExtraBold | ~36 |
| Montserrat SemiBold | ~22 |
| Material Icons | ~3 |

---

## Color frequency (observed)

High-frequency colors used to drive the curated palette:

### Brand & UI

| Hex | Context | Token |
|-----|---------|--------|
| `#BE2727` | Primary brand red (text accents) | `--hssf-color-primary` |
| `#991B1B` | Deep red | `--hssf-color-primary-deep` |
| `#9A0000` | Darker red | `--hssf-color-primary-darker` |
| `#7F1D1D` | Deepest red | `--hssf-color-primary-deepest` |
| `#FEF2F2` | Soft red surface | `--hssf-color-soft` |
| `#FEE2E2` | Soft red surface 2 | `--hssf-color-soft-2` |
| `#FFFFFF` | Slide background | `--hssf-color-bg` |
| `#333333` | Body text | `--hssf-color-text` |
| `#1E293B` | Strong text | `--hssf-color-text-strong` |
| `#334155` | Slate text | `--hssf-color-text-slate` |
| `#7F848E` | Muted / code comment | `--hssf-color-muted` / `--hssf-code-comment` |
| `#475569` | Muted 2 | `--hssf-color-muted-2` |

### Code theme → **highlight.js Atom One Dark** (normative for HSSF)

Session 4 used similar One Dark colors (`#23272E`, `#ABB2BF`, …). HSSF does **not** hand-roll those classes.

| Source | Role |
|--------|------|
| `highlight.js/styles/atom-one-dark.css` | Official syntax colors (`.hljs`, `.hljs-keyword`, …) |
| Bundled into | `dist/hssf.css` / `hssf.min.css` + copy `dist/atom-one-dark.css` |
| Runtime | `highlight.js/lib/common` inside `hssf.min.js`; `init()` → `highlightElement` |

Chrome shell tokens (header bar only), aligned with Atom One Dark base:

| Hex | Token | Note |
|-----|--------|------|
| `#282c34` | `--hssf-code-bg` | Atom One Dark `base` |
| `#21252b` | `--hssf-code-bg-alt` | Header strip |
| `#abb2bf` | `--hssf-code-fg` | Atom One Dark `mono-1` |

Session 4 `#23272E` is close but **not** used as the syntax theme source of truth.

### Semantic (sparse in PPTX; mapped for teaching components)

| Hex (PPTX) | Notes | HSSF token |
|------------|-------|------------|
| `#064E3B` / `#6AA84F` / `#DCFCE7` | Green success callouts | `--hssf-color-success*` (curated) |
| `#FFF4E5` / `#92400E` | Warm warning | `--hssf-color-warning*` |
| `#F0F9FF` | Info soft | `--hssf-color-info*` |

### Explicitly **not** mapped (non-exhaustive)

These appear in Session 4 but are **not** first-class HSSF tokens:

- `#44546A` (shape gray)
- `#C00000` (alternate red)
- `#000000` (pure black shapes)
- Material Icons glyph colors
- One-off illustration fills

Agents/authors: use existing tokens or deck-local `.deck-*` CSS. Do **not** invent new public `--hssf-color-*` without a design update.

---

## Footer (exact reference string)

Observed on content slides (e.g. slides 4, 5, 7):

```text
© 2022 By Rikkei Academy - Rikkei Education - All rights reserved.
```

**HSSF policy (KD-16):**

- Template: `© {{YEAR}} By Rikkei Academy - Rikkei Education - All rights reserved.`
- `{{YEAR}}` = year of **deck creation** (CLI inject), not hard-coded `2022`
- Page numbers live in a separate footer element (`.hssf-footer__page`)

---

## Layout patterns observed (for later components)

Useful when implementing chrome / components (PR-03+):

1. **Title / section dividers** — large red or dark fields, big numbers, Montserrat ExtraBold  
2. **Content slides** — white background, red accents, left-accent headers  
3. **Code-heavy slides** — dark `#23272E` panels, Courier New, syntax colors above  
4. **Two-column** — problem vs solution, multi-service diagrams  
5. **Process / steps** — numbered teaching flow (Dockerfile directives, compose lifecycle)  
6. **Footer bar** — copyright left, page marker right  

HSSF sample deck topic is intentionally **Git Fundamentals** (not a copy of Session 4 content), but visual language matches this extraction.

---

## Verification commands

```bash
# Re-extract colors (requires python-pptx)
python -c "from pptx import Presentation; from collections import Counter; ..."

# Ensure built CSS still contains primary token
pnpm run build
# then search dist/hssf.css for --hssf-color-primary
```

---

## Changelog

| Date | Note |
|------|------|
| 2026-07-16 | Initial extraction for PR-02 tokens |
