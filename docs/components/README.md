# Component catalog

HSSF is **shadcn-like authoring**: copy HTML markup + classes.  
Runtime CSS/JS is versioned on npm — not a copy-source registry.

**Read first:** [../charter.md](../charter.md) — what HSSF owns vs hand-off (Tailwind, figures).

## Rules for agents

1. Prefer **Preferred allowlist** below for **new** decks.
2. Soft-deprecated classes may still exist in CSS; **do not** use them for new teaching content unless the doc’s “when to use” applies.
3. Deck overrides: **minimal** `.deck-*` in `styles/deck.css` (tokens only). **No** parallel widget kits.
4. **No** inventing public `hssf-*` names.
5. **No** Material Icons / icon fonts — text, numbers, emoji, or SVG.
6. Code highlighting: `language-*` + highlight.js (bundled), not `hssf-tok-*`.
7. Complex layout → Tailwind (or utilities) inside `.hssf-slide__inner` — see charter.
8. Architecture diagrams → `hssf-figure` + asset, not flow topology.

## Groups

| Group | Doc | Prefer | Soft-deprecate / secondary |
|-------|-----|--------|----------------------------|
| Layout | [layout.md](./layout.md) | header, stack, cluster, columns, grid, fill, spacer, card | split/media-split OK if simple; don’t invent deeper nests in CSS |
| Content | [content.md](./content.md) | heading, list, callout, table, code | quote (optional) |
| Teaching | [teaching.md](./teaching.md) | steps, compare, agenda, defs | timeline OK; avoid over-fragment |
| Visual | [visual.md](./visual.md) | icon-circle, icon-label, stat (sparingly), accent | diagram text boxes only for tiny flows |
| Flow | [flow.md](./flow.md) | **linear 2–4 step process only** | architecture, labeled edges as primary diagram |
| Effects | [effects.md](./effects.md) | hover on small targets | continuous spin/pulse on large regions |
| Term | [term.md](./term.md) | one term style (`hssf-term`; chip optional, stay consistent) | mixing underline + chip looks |
| Media | [media.md](./media.md) | **figure** | frame browser/device/polaroid, carousel-as-hero |
| Fragments | [fragments.md](./fragments.md) | `data-hssf-fragment`, `hold` for grid/cards | over-fragmenting |

## Chrome (required)

See [../chrome.md](../chrome.md): canvas, stage, slide, footer, nav, progress.

---

## Preferred allowlist (new decks)

Use these first. Enough for a full **15–20+** slide session.

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
hssf-stack --tight|--loose|--xl|--center
hssf-cluster --tight|--loose|--center|--between|--end
hssf-fill --center|--end
hssf-spacer
hssf-columns --2|--3|--2-1|--1-2|--3-1|--1-3 --tight|--loose --start|--center|--end __col --center|--grow
hssf-grid --2|--3|--4|--auto --tight|--loose --start|--center
hssf-card --soft|--outline|--shadow|--compact|--center|--row __icon __title __body
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
hssf-term --chip
hssf-term-modal (runtime) __backdrop __dialog __close __kicker __title __body
hssf-figure --border|--shadow|--contain|--cover|--full __img __caption
hssf-fx--hover-lift|--hover-glow|--hover-scale|--hover-pulse
```

Fragments: `data-hssf-fragment` [= `fade` | `highlight` | **`hold`** ].

---

## Soft-deprecated / secondary (legacy allowlist)

Still valid CSS for older decks. **New decks:** avoid unless the linked doc’s narrow use-case applies.

```
hssf-split --col|--center|--start|--tight|--loose __main __side
hssf-media-split --1-2|--2-1|--media-left __text __media
hssf-diagram __frame __node __arrow __caption
hssf-flow --row|--col|--wrap|--tight|--loose
hssf-flow__node --primary|--soft|--outline|--sm __node-sub
hssf-flow__edge --dashed|--muted|--labeled __line __edge-label
hssf-arrow --right|--down|--left|--up|--bidir|--lg|--muted|--white|--glyph
hssf-connector --h|--v|--dashed|--thick|--muted|--elbow|--tee
hssf-fx--pulse|--spin|--spin-slow
hssf-fx--hover-spin
hssf-frame --soft|--shadow|--primary|--browser|--polaroid|--device|--cover|--sm|--lg
hssf-frame__chrome __dots __dot __titlebar __media __img __badge __caption
hssf-carousel --shadow __viewport __track __slide __img __caption __controls __btn __dots __dot __counter
```

| Class family | Prefer instead |
|--------------|----------------|
| `hssf-flow` for architecture | `hssf-figure` + diagram asset |
| `hssf-flow__edge--labeled` as main visual | steps / list + figure |
| `hssf-frame--browser` on infographics | `hssf-figure--shadow` |
| `hssf-carousel` as session spine | normal slides + fragments |
| Continuous `hssf-fx--spin` | one small hover affordance |

### Full legacy freeze string (compat)

Everything that shipped in 0.3 remains parseable; prefer list above for authoring. Full historical blob (including preferred):

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
hssf-stack --tight|--loose|--xl|--center
hssf-cluster --tight|--loose|--center|--between|--end
hssf-split --col|--center|--start|--tight|--loose __main __side
hssf-media-split --1-2|--2-1|--media-left __text __media
hssf-fill --center|--end
hssf-spacer
hssf-columns --2|--3|--2-1|--1-2|--3-1|--1-3 --tight|--loose --start|--center|--end __col --center|--grow
hssf-grid --2|--3|--4|--auto --tight|--loose --start|--center
hssf-card --soft|--outline|--shadow|--compact|--center|--row __icon __title __body
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
hssf-flow --row|--col|--wrap|--tight|--loose
hssf-flow__node --primary|--soft|--outline|--sm __node-sub
hssf-flow__edge --dashed|--muted|--labeled __line __edge-label
hssf-arrow --right|--down|--left|--up|--bidir|--lg|--muted|--white|--glyph
hssf-connector --h|--v|--dashed|--thick|--muted|--elbow|--tee
hssf-fx--pulse|--spin|--spin-slow
hssf-fx--hover-pulse|--hover-spin|--hover-lift|--hover-scale|--hover-glow
hssf-term --chip
hssf-term-modal (runtime) __backdrop __dialog __close __kicker __title __body
hssf-figure --border|--shadow|--contain|--cover|--full __img __caption
hssf-frame --soft|--shadow|--primary|--browser|--polaroid|--device|--cover|--sm|--lg
hssf-frame__chrome __dots __dot __titlebar __media __img __badge __caption
hssf-carousel --shadow __viewport __track __slide __img __caption __controls __btn __dots __dot __counter
```

States: `.is-active` (slide / carousel), `.is-visible` (fragment — runtime only), `.is-open` (term modal — runtime only).

Carousel data: `data-hssf-carousel`, `data-hssf-carousel-slide`, `data-hssf-carousel-prev|next|dots|counter`, `data-hssf-carousel-loop`.

Data attrs (terms): `data-hssf-term`, `data-hssf-term-title`, `data-hssf-term-body`, `data-hssf-term-def`, `data-hssf-term-def-title`.

## Reference deck

Teaching sample (**~18 slides**, not a zoo): [../../examples/sample-deck/](../../examples/sample-deck/)  
Scenario map: [../sample-scenario.md](../sample-scenario.md)
