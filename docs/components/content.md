# Content components (PR-07)

Copy-paste blocks for Rikkei Education decks. Syntax highlighting = **highlight.js** + Atom One Dark (bundled). No manual `hssf-tok-*`.

## Inventory

| Block | Purpose |
|-------|---------|
| `hssf-heading` | In-slide topic heading (kicker + title) |
| `hssf-list` | Bullets / numbered / nested |
| `hssf-callout` | Semantic notes |
| `hssf-quote` | Pull quote |
| `hssf-table` | Data table |
| `hssf-code` | Code panel + hljs |

---

## Heading

```html
<div class="hssf-heading">
  <p class="hssf-heading__kicker">1. Chủ đề</p>
  <h2 class="hssf-heading__title">Tiêu đề nội dung</h2>
</div>
```

Prefer `hssf-header` for slide chrome title; use `hssf-heading` for secondary sections inside a slide.

---

## List

```html
<ul class="hssf-list">
  <li>Mục luôn hiện</li>
  <li data-hssf-fragment>Mục reveal</li>
</ul>

<ol class="hssf-list hssf-list--numbered">
  <li>Bước một</li>
  <li>Bước hai</li>
</ol>

<ul class="hssf-list">
  <li>
    Parent
    <ul class="hssf-list hssf-list--sub">
      <li>Chi tiết</li>
    </ul>
  </li>
</ul>
```

Modifiers: `--numbered` · `--sub`  
Density rule: **≤ 6** top-level bullets per slide.

---

## Callout

```html
<aside class="hssf-callout hssf-callout--danger">
  <p class="hssf-callout__label">Lưu ý</p>
  <p class="hssf-callout__body">Không commit file <code>.env</code>.</p>
</aside>
```

| Modifier | Use |
|----------|-----|
| `--info` | Thông tin / định nghĩa |
| `--success` | Best practice / đúng |
| `--warning` | Cảnh báo |
| `--danger` | Lỗi nghiêm trọng / anti-pattern |
| `--tip` | Mẹo (default soft red) |

Border-left 4px + soft semantic background.

---

## Quote

```html
<blockquote class="hssf-quote">
  <p>Commit sớm, commit thường xuyên, message rõ ràng.</p>
  <cite class="hssf-quote__cite">Rikkei Education</cite>
</blockquote>
```

---

## Table

```html
<table class="hssf-table hssf-table--striped">
  <thead>
    <tr>
      <th>Lệnh</th>
      <th>Ý nghĩa</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>git status</code></td>
      <td>Trạng thái working tree</td>
    </tr>
    <tr>
      <td><code>git log --oneline</code></td>
      <td>Lịch sử gọn</td>
    </tr>
  </tbody>
</table>
```

Modifiers: `--striped` · `--compact`

---

## Code (+ highlight.js)

```html
<div class="hssf-code">
  <div class="hssf-code__header">
    <span class="hssf-code__filename">example.sh</span>
    <span class="hssf-code__lang">bash</span>
  </div>
  <pre class="hssf-code__pre"><code class="hssf-code__code language-bash">git status
git add .
git commit -m "feat: first commit"
</code></pre>
</div>
```

Rules:

- Put language on `<code class="language-…">` (hljs)
- **≤ ~18 lines** per block for projector readability
- Escape `& < >` in HTML source
- `HSSF.init()` auto-highlights; `{ highlight: false }` to skip

Simple header (text only still works):

```html
<div class="hssf-code">
  <div class="hssf-code__header">Main.java</div>
  <pre><code class="language-java">class Main {}</code></pre>
</div>
```

---

## Agent notes

1. Callout labels in Vietnamese for RE decks (`Lưu ý`, `Mẹo`, `Sai lầm thường gặp`).
2. Pair lists with fragments for step teaching.
3. Do not invent `hssf-tok-*` — use hljs languages.
4. Tables: keep ≤ 5 columns, ≤ 8 rows visible.
