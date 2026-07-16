# Media components (PR-08)

## Figure

```html
<figure class="hssf-figure hssf-figure--shadow hssf-figure--border">
  <img class="hssf-figure__img" src="assets/diagram.png" alt="Git workflow" />
  <figcaption class="hssf-figure__caption">
    Nguồn: tài liệu nội bộ Rikkei Education
  </figcaption>
</figure>
```

Modifiers: `--border` · `--shadow` · `--contain`  
Max image height: `--hssf-figure-max-h` (~520px).

Assets live in the **deck** (`assets/`), not the hssf package.
