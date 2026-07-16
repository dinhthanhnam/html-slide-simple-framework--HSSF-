# Sample scenario — Git Fundamentals cho Fresher

**Audience:** Rikkei Education fresher onboarding  
**Duration:** 60–75 minutes  
**Runnable deck:** [`examples/sample-deck/`](../examples/sample-deck/)

## Slide map

| # | `data-hssf-label` | On-slide focus | Primary components |
|---|-------------------|----------------|--------------------|
| 1 | Title | Opening | title-block, accent |
| 2 | Agenda | Lộ trình | header, agenda |
| 3 | Sec-Why | Divider | section-block |
| 4 | Pain | No VCS vs Git | compare, callout, list |
| 5 | VCS | 3 states | diagram, defs |
| 6 | Sec-Install | Divider | section-block |
| 7 | Install-Steps | Config | steps + fragments, code, columns |
| 8 | Sec-Lifecycle | Divider | section-block |
| 9 | Timeline | status→add→commit | timeline + fragments |
| 10 | Commands | Cheat sheet | heading, table, code |
| 11 | Sec-Branch | Divider | section-block |
| 12 | Branch-Types | Naming | grid, card, icon-circle, icon-label |
| 13 | Branch-Steps | Flow | steps + fragments, code |
| 14 | Danger | Anti-patterns | list, callout--danger |
| 15 | Lab | Hands-on | columns, code, figure (SVG) |
| 16 | Messages | Commit style | quote, compare, callout |
| 17 | Summary | Takeaways | list, stat |
| 18 | End | Close | brand-end |

## Learning outcomes

After the session, fresher can:

1. Explain working tree / staging / repository  
2. Run daily `status` → `add` → `commit`  
3. Create a feature branch and describe merge back to main  
4. Avoid force-push / secrets / vague messages  

## How agents should reuse this

- **Copy structure**, not necessarily Git topic.
- Keep the **Title → Agenda → (Section → …) × N → Summary → End** spine.
- Preserve footer string and brand-end copy unless product asks otherwise.
- For a new topic: replace labels, keep component variety for teaching clarity.

## Run

```bash
pnpm build
pnpm run sample
# http://127.0.0.1:5180/examples/sample-deck/
```

Deep link example: `#5` → VCS slide.
