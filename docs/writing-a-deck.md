# Writing a deck (playbook)

How to structure a Rikkei Education training session with HSSF.

## Default arc (60–75 minutes)

```
Title
→ Agenda
→ ( Section divider
    → Context / problem
    → Concept (diagram, defs, steps)
    → Commands / code
    → Lab or compare
  ) × N
→ Summary
→ Brand end
```

Match the sample scenario: [sample-scenario.md](./sample-scenario.md).

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

### 5. Concept

- `hssf-diagram` and/or `hssf-defs`
- Keep labels short

### 6. Procedure

- `hssf-steps` with `data-hssf-fragment` on each item
- Pair with `hssf-code` + `language-bash` / `language-java`

### 7. Reference table

- `hssf-heading` + `hssf-table--striped`
- ≤ 5 columns, ≤ 8 rows on screen

### 8. Lab

- `hssf-columns--1-2`: code | `hssf-figure`
- Explicit student actions

### 9. Summary

- Short `hssf-list` + optional `hssf-stat` row

### 10. End

- `hssf-slide--section` + `hssf-brand-end`
- `hssf-footer--light hssf-footer--nopage`

## Density rules

| Element | Limit |
|---------|--------|
| Bullets | ≤ 6 top-level |
| Code block | ≤ ~18 lines |
| Ideas | 1 per slide |
| Title length | Prefer ≤ 2 lines at hero size |

## Language

- **On-slide body:** Vietnamese for RE fresher decks (default)
- **API / classes / data attributes:** English
- **Code:** real identifiers; comments VI or EN

## Fragments (teaching pace)

Use on:

- Steps, timeline items, list bullets, cards

Do not over-fragment: 2–4 reveals per slide is enough.

## Footer & year

```
© {{YEAR}} By Rikkei Academy - Rikkei Education - All rights reserved.
```

CLI injects year at scaffold. Do not invent alternate copyright lines.

## Workflow for agents

1. Read user brief (topic, duration, audience).
2. Outline labels (`data-hssf-label`) for every slide.
3. Scaffold with `create-hssf` or copy sample-deck.
4. Fill slides using allowlisted components only.
5. Run [agent-checklist.md](./agent-checklist.md).
6. Verify `npx serve` + keyboard + no scrollbars at 1280×720.
