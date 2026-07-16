# hssf-slides

**HTML Slide Simple Framework (HSSF)** for [Rikkei Education](https://rikkei.edu.vn) training decks.

Rikkei-branded (white + red, Montserrat), shadcn-style HTML components, portable CSS/JS runtime.

> npm rejects short name `hssf` (too similar to `css`/`jss`/…). Published as **`hssf-slides`**.

## Install

```bash
# CDN
# https://cdn.jsdelivr.net/npm/hssf-slides@0.1.1/dist/hssf.min.css
# https://cdn.jsdelivr.net/npm/hssf-slides@0.1.1/dist/hssf.min.js

# Scaffold a deck
npx create-hssf my-deck
```

## Browser API

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/hssf-slides@0.1.1/dist/hssf.min.css" />
<script src="https://cdn.jsdelivr.net/npm/hssf-slides@0.1.1/dist/hssf.min.js" defer></script>
<script>
  document.addEventListener("DOMContentLoaded", function () {
    // Auto-runs highlight.js on pre>code (Atom One Dark CSS is inside hssf.min.css)
    window.HSSF.init(document.querySelector("[data-hssf-canvas]"));
  });
</script>
```

### Code blocks (highlight.js + Atom One Dark)

```html
<div class="hssf-code">
  <div class="hssf-code__header">Main.java</div>
  <pre><code class="language-java">public class Main {
  public static void main(String[] args) {}
}
</code></pre>
</div>
```

- JS: `highlight.js@11` (`lib/common` languages) bundled into `hssf.min.js`
- CSS: official `highlight.js/styles/atom-one-dark.css` concatenated into `hssf.min.css`
- Options: `HSSF.init(el, { highlight: false })` · `HSSF.highlight(el)` · `HSSF.hljs`

## License

MIT
