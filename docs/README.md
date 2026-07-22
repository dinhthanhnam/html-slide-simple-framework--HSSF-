# HSSF documentation

Agent-first docs for **Rikkei Education** HTML slides.

## Start here

| Doc | Audience |
|-----|----------|
| [charter.md](./charter.md) | **Scope** — thin deck, what HSSF owns, Tailwind/figure hand-off |
| [quickstart.md](./quickstart.md) | Human + agent — install, scaffold, serve |
| [writing-a-deck.md](./writing-a-deck.md) | Playbook cấu trúc buổi học (15–20+ slides) |
| [agent-checklist.md](./agent-checklist.md) | Checklist trước khi giao deck |
| [anti-patterns.md](./anti-patterns.md) | Việc **không** làm |
| [../AGENTS.md](../AGENTS.md) | Entry cho coding agents trong monorepo |

## System

| Doc | Nội dung |
|-----|----------|
| [design-tokens.md](./design-tokens.md) | Màu, type, spacing, geometry |
| [chrome.md](./chrome.md) | Canvas, stage, scale, nav, hash |
| [qa.md](./qa.md) | Browser matrix, Playwright, print |
| [sri.md](./sri.md) | SRI hashes (điền sau publish) |

## Components

| Doc | Group |
|-----|--------|
| [components/README.md](./components/README.md) | Index + allowlist |
| [components/layout.md](./components/layout.md) | title, section, columns, grid, card |
| [components/content.md](./components/content.md) | list, callout, table, code |
| [components/teaching.md](./components/teaching.md) | steps, timeline, compare, agenda |
| [components/visual.md](./components/visual.md) | icon, stat, diagram, accent |
| [components/flow.md](./components/flow.md) | flow, arrow, connector |
| [components/effects.md](./components/effects.md) | hover pulse/spin/lift/glow |
| [components/term.md](./components/term.md) | glossary term + modal |
| [components/media.md](./components/media.md) | figure |
| [components/fragments.md](./components/fragments.md) | `data-hssf-fragment` |

## Samples & design

| Path | Role |
|------|------|
| [sample-scenario.md](./sample-scenario.md) | Kịch bản Git fresher + map component |
| [../examples/sample-deck/](../examples/sample-deck/) | ~18-slide **teaching** sample (not a component zoo) |
| [../DESIGN.md](../DESIGN.md) | Architecture + PR plan |

## Scaffold (generated decks)

Decks from `npx create-hssf` ship a **self-contained** `AGENTS.md` (no monorepo required).  
Monorepo agents should prefer this `docs/` tree for full detail.
