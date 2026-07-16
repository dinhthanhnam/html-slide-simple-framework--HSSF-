# @dinhthanhnam/create-hssf

Scaffold a portable [hssf-slides](https://www.npmjs.com/package/hssf-slides) (HSSF) deck for **Rikkei Education**.

CLI bin: `create-hssf`

## Usage

```bash
npx @dinhthanhnam/create-hssf my-deck
npx @dinhthanhnam/create-hssf my-deck --local
npx @dinhthanhnam/create-hssf my-deck --template sample --title "Git Lab"
npx @dinhthanhnam/create-hssf . --force
```

| Flag | Meaning |
|------|---------|
| `--local` | Copy `hssf.min.css` / `hssf.min.js` into `vendor/` |
| `--template default` | Minimal 4-slide starter (default) |
| `--template sample` | Condensed Git fresher outline (6 slides) |
| `--title` | Deck title |
| `--year` | Footer year |
| `--force` | Allow non-empty directory |

**Does not** run `npm install` inside the deck.

## Serve

```bash
cd my-deck
npx serve .
```

Use HTTP(S), not `file://`.

## Offline (`--local`)

After scaffold:

```
my-deck/
  vendor/hssf.min.css
  vendor/hssf.min.js
  index.html   # links ./vendor/*
```

Montserrat still loads from Google Fonts by default (optional self-host later).

## Monorepo dev

```bash
pnpm build
node packages/create-hssf/bin/create-hssf.js tmp-deck --local --force
```

Depends on `hssf-slides` (`workspace:*` in monorepo; pinned on npm publish).

## License

MIT
