# {{TITLE}}

Rikkei Education slide deck scaffolded with [hssf-slides](https://www.npmjs.com/package/hssf-slides) via `create-hssf`.

**Runtime mode:** `{{ASSET_MODE}}` (hssf-slides@{{HSSF_VERSION}})

## Serve (required)

Do **not** open `index.html` as `file://` for reliable keyboard/fullscreen.

```bash
npx serve .
# open the printed local URL
```

Keyboard: `←` `→` `Space` · `Home` `End` · `F` fullscreen · hash `#2`

## Files

| Path | Role |
|------|------|
| `index.html` | Deck markup |
| `styles/deck.css` | Local `.deck-*` overrides only |
| `assets/images/` | Images |
| `AGENTS.md` | Rules + copy-paste for AI agents |
| `vendor/` | Present only with `--local` |

## Offline checklist (`--local`)

- [x] `vendor/hssf.min.css` and `vendor/hssf.min.js` present
- [ ] Optional: self-host Montserrat woff2 (default uses Google Fonts CDN)
- [ ] Serve over LAN HTTP for classroom projector

## CDN mode

CSS/JS load from jsDelivr pin `hssf@{{HSSF_VERSION}}`. Needs network.

## Authoring

See **AGENTS.md**. Brand: white + red, Montserrat, footer Rikkei Academy.
