# Subresource Integrity (SRI)

**Status:** placeholder until **PR-14 / npm publish**.

After publishing `hssf@x.y.z`, fill hashes for:

```
https://cdn.jsdelivr.net/npm/@dinhthanhnam/hssf@VERSION/dist/hssf.min.css
https://cdn.jsdelivr.net/npm/@dinhthanhnam/hssf@VERSION/dist/hssf.min.js
```

## Template (post-release)

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@dinhthanhnam/hssf@0.1.0/dist/hssf.min.css"
  integrity="sha384-TODO"
  crossorigin="anonymous"
/>
<script
  src="https://cdn.jsdelivr.net/npm/@dinhthanhnam/hssf@0.1.0/dist/hssf.min.js"
  integrity="sha384-TODO"
  crossorigin="anonymous"
  defer
></script>
```

## Generate hashes (maintainers)

```bash
pnpm build
# example:
openssl dgst -sha384 -binary packages/hssf/dist/hssf.min.js | openssl base64 -A
```

Or use [srihash.org](https://www.srihash.org/) on the jsDelivr URL after publish.

## Notes

- Scaffold CLI v0.1 does **not** inject SRI by default (optional follow-up).
- `--local` vendor files are same-origin; SRI optional.
- Always **pin** version in the URL even when using integrity.
