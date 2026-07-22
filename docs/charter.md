# HSSF product charter

**Status:** Active (post-0.3 scope discipline)  
**Audience:** maintainers, content authors, coding agents  
**Goal:** thin decks, narrow framework, clear hand-offs — not a full UI kit.

## Operating principles

| Principle | Meaning |
|-----------|---------|
| **Deck thin** | Teaching HTML + allowlisted `hssf-*` blocks. `styles/deck.css` only for tiny token overrides (e.g. `--hssf-stage-font-size`). **No** parallel `deck-*` widget systems. |
| **Framework abstract + documented** | HSSF owns **contracts** (chrome, tokens, runtime, closed teaching blocks) with objective docs. Agents follow allowlist + recipes — not invent surfaces. |
| **Narrow, incremental** | One PR = one capability + docs + tests. Prefer soft-deprecate over comprehensive rebuilds. |
| **Hand off what we do poorly** | Complex layout → **Tailwind** (or any utility layer). Architecture diagrams → **figure / SVG / image**. Do not force everything into `hssf.css`. |

## In scope (own)

| Area | Notes |
|------|--------|
| Stage shell | canvas, stage, scale, letterbox, no-doc-scroll |
| Navigation runtime | prev/next, hash, progress, fullscreen, live region |
| Fragments | `data-hssf-fragment`, reset on leave; variants documented |
| Brand tokens | colors, type scale tied to `--hssf-stage-font-size`, spacing base |
| Chrome | header, footer, title-block, section-block, brand-end |
| Closed teaching blocks | list, callout, code, steps, compare, agenda, table, heading |
| Optional light helpers | stack / cluster / columns / grid **as convenience**, not a full layout engine |
| Terms | glossary modal runtime (optional) |
| Simple media | `hssf-figure` (preferred); frame/carousel = secondary |

## Out of scope / hand-off

| Area | Prefer | Why |
|------|--------|-----|
| Complex page layout (asymmetric panels, nested grids, absolute composition) | **Tailwind** (or equivalent utilities) inside `.hssf-slide__inner` | Agents have objective TW docs; HSSF layout modifiers are not a complete system |
| Architecture / multi-layer diagrams | **SVG or PNG** via `hssf-figure` | `hssf-flow` is for short linear processes only |
| Fake OS/browser chrome on infographics | Cropped asset + simple figure | Frame variants are easy to misuse |
| Second design system in deck | Never | No large `deck-*` card/pill/layer kits |
| Component zoo “showcase” decks | Sample **15–20 teaching slides**, not catalog demos | Coverage ≠ pedagogy |

## Preferred vs soft-deprecated components

See [components/README.md](./components/README.md).

- **Preferred (write these first):** chrome, list, callout, code, steps, compare, agenda, table, figure, header, simple columns/grid/stack.
- **Soft-deprecated for common teaching (still in CSS, avoid in new decks):** architecture use of flow/connectors; heavy frame chrome (browser/device/polaroid) on non-screenshots; carousel as primary teaching surface; continuous fx on large regions.

Soft-deprecate means: **still builds**, docs say when *not* to use; removal only in a future major after decks migrate.

## Layout interop (Tailwind and friends)

1. HSSF **does not** ship Tailwind. Optional at **deck** layer (CDN play, or build).
2. Place utilities **inside** `.hssf-slide__inner` (and descendants). Do not restyle `.hssf-canvas` / `.hssf-stage` / nav with random utilities.
3. Brand surfaces (callout, code, header) stay **`hssf-*`** — do not recolor brand with arbitrary hex.
4. If both HSSF layout helpers and Tailwind are available, pick **one** layout approach per slide region (avoid double systems fighting).
5. Preflight: if using TW with preflight, verify stage/nav still match [chrome.md](./chrome.md) and no document scrollbars at 1280×720.

### Minimal pattern

```html
<div class="hssf-slide__inner">
  <header class="hssf-header">…</header>
  <!-- Layout: utility layer -->
  <div class="flex gap-6 min-h-0 flex-1">
    <div class="flex-1 min-w-0">
      <ul class="hssf-list">…</ul>
      <aside class="hssf-callout hssf-callout--tip">…</aside>
    </div>
    <div class="w-[45%] min-w-0">
      <div class="hssf-code">…</div>
    </div>
  </div>
</div>
```

Without Tailwind, use **one** simple HSSF helper (`hssf-columns--1-2` or `hssf-stack`) — do not invent `deck-split-*`.

## Deck thinness rules

| Allowed in `styles/deck.css` | Forbidden |
|------------------------------|-----------|
| `--hssf-stage-font-size` | New public-looking component skins (`deck-card`, `deck-layer`, …) |
| Rare one-off spacing for a single lab asset | Parallel term/button styles fighting `hssf-term` |
| Print tweaks if needed | Copying half of a design system into the deck |

If you need a new **reusable** block: **propose it in HSSF docs + CSS** (small PR), do not grow deck-local kits.

## Session / sample length

| Role | Slides |
|------|--------|
| Smoke / CI | few slides OK |
| **Sample + production training session** | **15–20 minimum** (often 18–28) |
| “8–10 slide sample” | **Too short** for RE session pedagogy |

Arc still: Title → Agenda → (Section × N with problem/concept/lab) → Summary → End.  
**Thin CSS ≠ few slides.** Prefer more slides with complete claims over telegraphic noun phrases.

## Content quality (not density-only)

Density caps (≤6 bullets, ≤~18 lines code) remain. Additionally:

| Do | Don't |
|----|--------|
| Claim + reason or example | Orphan noun phrases (“App online”, “IP ready”) as only body |
| Verbs in bullets | Decorative stats with no teaching value |
| 1 **claim** per slide (+ evidence) | 1 **word cloud** per slide |
| Real commands / paths when labbing | Fake chrome without a learning goal |

## Incremental roadmap (framework)

Do **not** full-rebuild. Suggested order:

1. **Docs (this charter + allowlist)** — done when linked from README / AGENTS.
2. **Fragment `hold`** — reserve layout space (grid/cards); see [fragments.md](./components/fragments.md).
3. Soft-deprecate + sample guidance; keep 15–20 slide sample as teaching reference.
4. Later majors: remove dead CSS only after zero preferred usage.

## Non-goals (unchanged)

- Drag-drop editor, multi-brand theming, SPA framework lock-in
- Becoming a generic Tailwind component library
- Perfect PowerPoint parity

## Related

- [writing-a-deck.md](./writing-a-deck.md) — session arc & recipes  
- [components/README.md](./components/README.md) — allowlist  
- [anti-patterns.md](./anti-patterns.md)  
- [agent-checklist.md](./agent-checklist.md)  
- [../DESIGN.md](../DESIGN.md) — architecture history  
