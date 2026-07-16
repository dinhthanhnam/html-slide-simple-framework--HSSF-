# Release 0.1.0 (PR-14)

**Do not publish until you intend to go public on npm.**  
This doc is the release runbook.

## Pre-flight

```bash
pnpm install
pnpm ci
# optional: re-check name
npm view @dinhthanhnam/hssf version || echo "not published yet"
npm view @dinhthanhnam/create-hssf version || echo "not published yet"
```

- [ ] `pnpm ci` green  
- [ ] `LICENSE` MIT present on both packages  
- [ ] Version both packages `0.1.0` (same string)  
- [ ] `files` field includes `dist` for hssf  

## Build & pack smoke

```bash
pnpm build
pnpm --filter hssf pack --pack-destination /tmp
pnpm --filter create-hssf pack --pack-destination /tmp
# inspect tarballs include dist/ templates/
```

## Publish (maintainers only)

```bash
npm login          # once per machine
pnpm build
pnpm run publish:release
# if account has 2FA (common):
node scripts/publish.mjs --otp 123456
```

`pnpm publish` rewrites `workspace:*` → real version automatically.

**2FA required by npm:** pass authenticator code via `--otp` or env `NPM_OTP`.

Alternatively create a [granular access token](https://www.npmjs.com/settings/~/tokens) with **Bypass 2FA / automation** and:

```bash
npm config set //registry.npmjs.org/:_authToken=npm_XXXX
pnpm run publish:release
```

```bash
# after publish
npx @dinhthanhnam/create-hssf@0.1.0 tmp-hssf-smoke-deck
cd tmp-hssf-smoke-deck && npx serve .
```

## Post-publish

1. Fill [sri.md](./sri.md) hashes from jsDelivr URLs  
2. Tag git: `git tag v0.1.0 && git push origin v0.1.0`  
3. Verify:

```
https://cdn.jsdelivr.net/npm/@dinhthanhnam/hssf@0.1.0/dist/hssf.min.css
https://cdn.jsdelivr.net/npm/@dinhthanhnam/hssf@0.1.0/dist/hssf.min.js
```

## Package names

npm blocks unscoped `hssf` (similarity to `css`/`jss`/…). Published as:

- `@dinhthanhnam/hssf`
- `@dinhthanhnam/create-hssf` (CLI bin still `create-hssf`)

## Dependency note

In monorepo:

```json
"dependencies": { "@dinhthanhnam/hssf": "workspace:*" }
```

`pnpm publish` rewrites `workspace:*` → `0.1.0` for the registry tarball.
