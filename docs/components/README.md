# Component catalog

HSSF is **shadcn-like authoring**: copy HTML markup + classes.  
Runtime CSS/JS is versioned on npm — not a copy-source registry.

## Rules for agents

1. **Only** public classes listed here / in DESIGN C.8.
2. Deck overrides: `.deck-*` in `styles/deck.css`.
3. **No** inventing `hssf-*` names.
4. **No** Material Icons / icon fonts — text, numbers, emoji, or SVG.
5. Code highlighting: `language-*` + highlight.js (bundled), not `hssf-tok-*`.

## Groups

| Group | Doc | Blocks |
|-------|-----|--------|
| Layout | [layout.md](./layout.md) | header, title-block, section-block, brand-end, columns, grid, card |
| Content | [content.md](./content.md) | heading, list, callout, quote, table, code |
| Teaching | [teaching.md](./teaching.md) | steps, timeline, compare, agenda, defs |
| Visual | [visual.md](./visual.md) | icon-circle, icon-label, stat, accent, diagram |
| Media | [media.md](./media.md) | figure |
| Fragments | [fragments.md](./fragments.md) | `data-hssf-fragment` |

## Chrome (not “components” but required)

See [../chrome.md](../chrome.md): canvas, stage, slide, footer, nav, progress.

## Allowlist (v0.1 freeze)

```
hssf-body hssf-canvas hssf-progress hssf-progress__bar
hssf-live hssf-sr-only hssf-stage-wrap hssf-stage
hssf-slide hssf-slide--title|--section|--content|--dark hssf-slide__inner
hssf-footer hssf-footer--light|--nopage hssf-footer__copy hssf-footer__page
hssf-nav hssf-nav--minimal hssf-nav__btn hssf-nav__counter
hssf-header hssf-header__accent hssf-header__title hssf-header__subtitle
hssf-title-block hssf-title-block--center|--left
hssf-title-block__eyebrow __title __meta
hssf-section-block __num __title
hssf-brand-end __kicker __title __org __logo
hssf-columns --2|--3|--2-1|--1-2 __col
hssf-grid --2|--3|--4
hssf-card --soft|--outline|--shadow __icon __title __body
hssf-heading __kicker __title
hssf-list --sub|--numbered
hssf-callout --info|--success|--warning|--danger|--tip __label __body
hssf-quote __cite
hssf-table --striped|--compact
hssf-code __header __filename __lang __pre __code
hssf-steps --vertical|--horizontal __item __num __content __title __desc
hssf-timeline __item __dot __body __time __text
hssf-compare __col __col--cons|--pros __title
hssf-agenda __item __num __text
hssf-defs __row
hssf-icon-circle --sm|--md|--lg --primary|--soft
hssf-icon-label __text
hssf-stat __value __label
hssf-accent --bar-left|--blob
hssf-diagram __frame __node __arrow __caption
hssf-figure --border|--shadow|--contain __img __caption
```

States: `.is-active` (slide), `.is-visible` (fragment — runtime only).

## Reference deck

Full coverage: [../../examples/sample-deck/](../../examples/sample-deck/)  
Scenario map: [../sample-scenario.md](../sample-scenario.md)
