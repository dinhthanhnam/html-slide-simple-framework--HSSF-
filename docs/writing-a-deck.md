# Writing a deck (playbook)

How to structure a Rikkei Education training session with HSSF.

**Scope first:** [charter.md](./charter.md) — thin deck, preferred components, layout hand-off.

## Length

| Role | Target |
|------|--------|
| Training session / sample | **15–20 slides minimum** (often 18–28) |
| Smoke / CI | few slides |

Do **not** aim for 8–10 slides for a full session — too short for RE pedagogy.  
**Thin CSS ≠ few slides:** more slides with complete claims beat telegraphic decks.

## Default arc (60–75 minutes)

```
Title
→ Agenda (and/or objectives)
→ ( Section divider
    → Context / problem
    → Concept (figure or defs/steps — not flow architecture)
    → Commands / code
    → Lab or compare
  ) × N
→ Summary
→ Brand end
```

Match the sample scenario: [sample-scenario.md](./sample-scenario.md) (~18 slides).

## Slide recipes

### 1. Title

- `hssf-slide--title`
- `hssf-title-block` (+ optional `hssf-accent--bar-left`)
- Footer normal (not light)

### 2. Agenda

- `hssf-header` + `hssf-agenda`
- One row per section of the session

### 3. Section divider

- `hssf-slide--section` + `hssf-section-block`
- `hssf-footer--light`
- Big number (`01`, `02`, …)

### 4. Problem / contrast

- `hssf-compare` cons vs pros
- Optional `hssf-callout--tip` or `--danger`
- Prefer **full sentences / clear consequences**, not noun-only bullets

### 5. Concept

- Prefer `hssf-figure` + asset for architecture
- Or `hssf-defs` / short `hssf-list` + callout
- Avoid `hssf-flow` for multi-layer topology

### 6. Procedure

- `hssf-steps` with `data-hssf-fragment` on each item
- Pair with `hssf-code` + `language-bash` / `language-java`
- Layout: `hssf-columns--1-2` **or** Tailwind flex inside `hssf-slide__inner`

### 7. Reference table

- `hssf-heading` + `hssf-table--striped`
- ≤ 5 columns, ≤ 8 rows on screen

### 8. Lab

- Code | actions; explicit student steps
- Screenshot: `hssf-figure` (frame only if UI chrome matters)

### 9. Summary

- Short `hssf-list` with **actionable** takeaways
- Optional `hssf-stat` only if the number teaches something

### 10. End

- `hssf-slide--section` + `hssf-brand-end`
- `hssf-footer--light hssf-footer--nopage`

## Layout

1. Prefer **preferred** blocks from [components/README.md](./components/README.md).
2. Complex layout → **Tailwind** (or utilities) inside `.hssf-slide__inner` — see charter.
3. Do **not** build a second component system in `deck.css`.

## Density + prose quality

| Element | Limit / rule |
|---------|----------------|
| Bullets | ≤ 6 top-level |
| Code block | ≤ ~18 lines |
| Ideas | **1 claim** per slide (+ evidence / example) |
| Title length | Prefer ≤ 2 lines at hero size |
| Bullet text | Prefer verb + object + why; avoid orphan nouns |

## Language

- **On-slide body:** Vietnamese for RE fresher decks (default)
- **API / classes / data attributes:** English
- **Code:** real identifiers; comments VI or EN

## Fragments (teaching pace)

Use on:

- Steps, timeline items, list bullets
- Cards in a grid: `data-hssf-fragment="hold"` so layout does not jump

Do not over-fragment: 2–4 reveals per slide is enough.

## Footer & year

```
© {{YEAR}} By Rikkei Academy - Rikkei Education - All rights reserved.
```

CLI injects year at scaffold. Do not invent alternate copyright lines.

## Workflow for agents

1. Read [charter.md](./charter.md) + user brief (topic, duration, audience).
2. Outline **≥ 15** `data-hssf-label`s for a full session (or user-specified count).
3. Scaffold with `create-hssf` or copy sample-deck.
4. Fill slides using **preferred** allowlist; hand off layout/diagrams per charter.
5. Keep `deck.css` minimal.
6. Run [agent-checklist.md](./agent-checklist.md).
7. Verify `npx serve` + keyboard + no scrollbars at 1280×720.
