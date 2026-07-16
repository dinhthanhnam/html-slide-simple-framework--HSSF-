/**
 * PR-07 — content component class inventory.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentCss = path.join(__dirname, "../src/css/components/content.css");
const distCss = path.join(__dirname, "../dist/hssf.css");

const REQUIRED = [
  ".hssf-heading",
  ".hssf-heading__kicker",
  ".hssf-heading__title",
  ".hssf-list",
  ".hssf-list--sub",
  ".hssf-list--numbered",
  ".hssf-callout",
  ".hssf-callout--info",
  ".hssf-callout--success",
  ".hssf-callout--warning",
  ".hssf-callout--danger",
  ".hssf-callout--tip",
  ".hssf-callout__label",
  ".hssf-callout__body",
  ".hssf-quote",
  ".hssf-quote__cite",
  ".hssf-table",
  ".hssf-table--striped",
  ".hssf-table--compact",
  ".hssf-code",
  ".hssf-code__header",
  ".hssf-code__filename",
  ".hssf-code__lang",
  ".hssf-code__pre",
  ".hssf-code__code",
];

describe("content components (PR-07)", () => {
  const css = fs.readFileSync(contentCss, "utf8");

  it("defines all public content classes", () => {
    for (const sel of REQUIRED) {
      assert.ok(css.includes(sel), `missing ${sel}`);
    }
  });

  it("callouts use semantic tokens and 4px left border", () => {
    assert.match(css, /border-left:\s*4px/);
    assert.match(css, /--hssf-color-info-soft/);
    assert.match(css, /--hssf-color-success-soft/);
    assert.match(css, /--hssf-color-warning-soft/);
    assert.match(css, /--hssf-color-danger-soft/);
  });

  it("code chrome uses Atom One Dark shell tokens", () => {
    assert.match(css, /--hssf-code-bg/);
    assert.match(css, /--hssf-code-header-h/);
    assert.match(css, /highlight\.js|hljs/i);
  });

  it("built dist embeds content when present", () => {
    if (!fs.existsSync(distCss)) return;
    const dist = fs.readFileSync(distCss, "utf8");
    assert.match(dist, /\.hssf-callout--danger/);
    assert.match(dist, /\.hssf-table--striped/);
    assert.match(dist, /\.hssf-code__filename/);
    assert.match(dist, /\.hssf-list--numbered/);
  });
});
