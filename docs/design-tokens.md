# Design tokens

Source: `packages/hssf/src/css/tokens.css`  
Brand extraction notes: `reference/session-4-notes.md` (Session 4.pptx).

Tokens are a **curated subset** of Rikkei Education training decks — white + red, Montserrat, code via **highlight.js Atom One Dark**.

## Brand

| Token | Value | Use |
|-------|--------|-----|
| `--hssf-color-primary` | `#BE2727` | Accent, markers, CTAs |
| `--hssf-color-primary-deep` | `#991B1B` | Section slide bg |
| `--hssf-color-soft` | `#FEF2F2` | Soft panels |
| `--hssf-color-soft-2` | `#FEE2E2` | Borders soft |
| `--hssf-color-bg` | `#FFFFFF` | Content slide |
| `--hssf-color-text` | `#333333` | Body |
| `--hssf-color-text-strong` | `#1E293B` | Titles |
| `--hssf-color-muted` | `#7F848E` | Meta, captions |
| `--hssf-color-viewport` | `#111111` | Letterbox outside stage |

## Semantic (callouts)

| Token family | Use |
|--------------|-----|
| `--hssf-color-info*` | Info callout |
| `--hssf-color-success*` | Success / pros |
| `--hssf-color-warning*` | Warning |
| `--hssf-color-danger*` | Danger / anti-pattern |

## Code chrome (not syntax colors)

Syntax colors come from **official** `highlight.js/styles/atom-one-dark.css` (bundled).

| Token | Value |
|-------|--------|
| `--hssf-code-bg` | `#282c34` |
| `--hssf-code-bg-alt` | `#21252b` |
| `--hssf-code-fg` | `#abb2bf` |

## Typography

| Token | Meaning |
|-------|---------|
| `--hssf-font-sans` | Montserrat stack |
| `--hssf-font-mono` | Courier New stack |
| `--hssf-fw-regular` … `--hssf-fw-extrabold` | 400–800 |
| `--hssf-stage-font-size` | `16px` on stage (rem root) |
| `--hssf-fs-xs` … `--hssf-fs-hero` | Type scale |

## Geometry (16:9)

| Token | Value |
|-------|--------|
| `--hssf-slide-w` / `--hssf-slide-h` | `1920px` / `1080px` |
| `--hssf-slide-padding-x` / `y` | `72px` / `56px` |
| `--hssf-footer-h` | `48px` |
| `--hssf-header-accent-w` | `6px` |
| `--hssf-card-min-h` | `160px` |
| `--hssf-figure-max-h` | `520px` |

## Agent rules

1. Prefer tokens over hard-coded hex in `.deck-*` CSS.
2. Do not add new public `--hssf-*` without a design update.
3. Body copy Vietnamese OK; class names and tokens stay English.
