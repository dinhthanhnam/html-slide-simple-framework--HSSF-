# Anti-patterns

Things agents and authors **must not** do in HSSF decks.

## Structure

| ❌ Bad | ✅ Good |
|--------|--------|
| Missing `data-hssf-slide` | Every slide is `section.hssf-slide[data-hssf-slide]` |
| No `data-hssf-label` | Unique short labels for live region / debugging |
| Nav/progress inside scaled stage | Nav/progress siblings of stage-wrap |
| Multiple `.is-active` slides | Exactly one active; runtime manages it |
| Manual `.is-visible` on fragments | Only `data-hssf-fragment`; runtime toggles |

## Styling

| ❌ Bad | ✅ Good |
|--------|--------|
| Invent `hssf-foo-bar` classes | Allowlist only; else `.deck-*` |
| Random hex blues/greens for brand UI | Tokens (`--hssf-color-primary`, soft, semantic) |
| Arial / Roboto for UI | Montserrat stack |
| Walls of 12pt text | ≤6 bullets, large type, breathing room |
| Material Icons dependency | Text / emoji / author SVG in icon-circle |

## Code

| ❌ Bad | ✅ Good |
|--------|--------|
| Manual `hssf-tok-*` spans | `language-js` + highlight.js |
| Unescaped `<` in HTML code samples | Escape `&lt;` or careful authoring |
| 40-line dumps | ≤ ~18 lines; split slides |
| Secrets in samples (real tokens) | Fake values only |

## Tooling

| ❌ Bad | ✅ Good |
|--------|--------|
| CDN `hssf@latest` | Pin `hssf@0.1.0` (or exact) |
| Present via `file://` only | `npx serve` / static HTTP |
| React SPA “because framework” | Static HTML for portable training decks |
| `npm install` inside every deck | CDN or `--local` vendor copy |

## Teaching

| ❌ Bad | ✅ Good |
|--------|--------|
| 15 fragments on one slide | 2–4 reveals |
| Skip section dividers in long decks | Clear `section-block` rhythm |
| End slide without brand-end | `hssf-brand-end` + light footer |
| Wrong copyright line | Rikkei Academy - Rikkei Education string |

## Accessibility / QA

| ❌ Bad | ✅ Good |
|--------|--------|
| Empty `aria-label` on canvas | Meaningful deck title |
| Rely on color alone for “wrong” | Callout label text (“Lưu ý”, “Sai”) |
| Ignore overflow scrollbars | Check 1280×720 no document scroll |

When unsure: open [examples/sample-deck](../examples/sample-deck/) and mirror patterns.
