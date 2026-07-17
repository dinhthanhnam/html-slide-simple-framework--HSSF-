/**
 * PR-06 — layout component class inventory present in CSS / dist.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const layoutCss = path.join(__dirname, "../src/css/components/layout.css");
const distCss = path.join(__dirname, "../dist/hssf.css");

const REQUIRED = [
  ".hssf-header",
  ".hssf-header__accent",
  ".hssf-header__title",
  ".hssf-header__subtitle",
  ".hssf-title-block",
  ".hssf-title-block--center",
  ".hssf-title-block--left",
  ".hssf-title-block__eyebrow",
  ".hssf-title-block__title",
  ".hssf-title-block__meta",
  ".hssf-section-block",
  ".hssf-section-block__num",
  ".hssf-section-block__title",
  ".hssf-brand-end",
  ".hssf-brand-end__kicker",
  ".hssf-brand-end__title",
  ".hssf-brand-end__org",
  ".hssf-brand-end__logo",
  ".hssf-columns",
  ".hssf-columns--2",
  ".hssf-columns--3",
  ".hssf-columns--2-1",
  ".hssf-columns--1-2",
  ".hssf-columns--3-1",
  ".hssf-columns--1-3",
  ".hssf-columns--tight",
  ".hssf-columns--loose",
  ".hssf-columns__col",
  ".hssf-stack",
  ".hssf-cluster",
  ".hssf-split",
  ".hssf-media-split",
  ".hssf-fill",
  ".hssf-spacer",
  ".hssf-grid",
  ".hssf-grid--2",
  ".hssf-grid--3",
  ".hssf-grid--4",
  ".hssf-grid--auto",
  ".hssf-card",
  ".hssf-card--soft",
  ".hssf-card--outline",
  ".hssf-card--shadow",
  ".hssf-card--compact",
  ".hssf-card__title",
  ".hssf-card__body",
  ".hssf-card__icon",
  ".hssf-nav--minimal",
];

describe("layout components (PR-06)", () => {
  const css = fs.readFileSync(layoutCss, "utf8");

  it("defines all public layout classes", () => {
    for (const sel of REQUIRED) {
      assert.ok(css.includes(sel), `missing ${sel}`);
    }
  });

  it("uses design tokens for geometry", () => {
    assert.match(css, /--hssf-header-accent-w/);
    assert.match(css, /--hssf-fs-hero/);
    assert.match(css, /--hssf-card-min-h/);
    assert.match(css, /--hssf-color-primary/);
    assert.match(css, /--hssf-shadow-card/);
  });

  it("title-block hero and section num use extrabold scale", () => {
    assert.match(css, /\.hssf-title-block__title[\s\S]*?--hssf-fs-hero/);
    assert.match(css, /\.hssf-section-block__num[\s\S]*?--hssf-fs-hero/);
  });

  it("built dist embeds layout when present", () => {
    if (!fs.existsSync(distCss)) return;
    const dist = fs.readFileSync(distCss, "utf8");
    assert.match(dist, /\.hssf-title-block/);
    assert.match(dist, /\.hssf-brand-end/);
    assert.match(dist, /\.hssf-columns--2-1/);
    assert.match(dist, /\.hssf-card--soft/);
  });
});
