/**
 * PR-02 — ensure design tokens and base CSS ship required contracts.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cssDir = path.join(__dirname, "../src/css");
const tokensPath = path.join(cssDir, "tokens.css");
const basePath = path.join(cssDir, "base.css");
const distCss = path.join(__dirname, "../dist/hssf.css");

const REQUIRED_TOKENS = [
  "--hssf-color-primary",
  "--hssf-color-primary-deep",
  "--hssf-color-soft",
  "--hssf-color-bg",
  "--hssf-color-text",
  "--hssf-color-text-strong",
  "--hssf-color-muted",
  "--hssf-color-viewport",
  "--hssf-code-bg",
  "--hssf-code-fg",
  "--hssf-font-sans",
  "--hssf-font-mono",
  "--hssf-fw-extrabold",
  "--hssf-stage-font-size",
  "--hssf-fs-base",
  "--hssf-fs-2xl",
  "--hssf-fs-hero",
  "--hssf-slide-w",
  "--hssf-slide-h",
  "--hssf-slide-padding-x",
  "--hssf-slide-padding-y",
  "--hssf-footer-h",
  "--hssf-duration",
  "--hssf-ease",
];

describe("hssf design tokens (PR-02)", () => {
  const tokensCss = fs.readFileSync(tokensPath, "utf8");
  const baseCss = fs.readFileSync(basePath, "utf8");

  it("defines primary brand red #be2727 (Session 4)", () => {
    assert.match(tokensCss, /--hssf-color-primary:\s*#be2727/i);
  });

  it("defines logical 16:9 stage 1920×1080", () => {
    assert.match(tokensCss, /--hssf-slide-w:\s*1920px/);
    assert.match(tokensCss, /--hssf-slide-h:\s*1080px/);
  });

  it("includes Montserrat and Courier New stacks", () => {
    assert.match(tokensCss, /Montserrat/);
    assert.match(tokensCss, /Courier New/);
  });

  it("contains all required public token names", () => {
    for (const name of REQUIRED_TOKENS) {
      assert.ok(
        tokensCss.includes(name),
        `missing token ${name} in tokens.css`,
      );
    }
  });

  it("base.css includes body overflow lock and sr-only", () => {
    assert.match(baseCss, /\.hssf-body/);
    assert.match(baseCss, /overflow:\s*hidden/);
    assert.match(baseCss, /\.hssf-sr-only/);
  });

  it("base.css has no manual hssf-tok-* (code chrome lives in content.css)", () => {
    assert.equal(baseCss.includes(".hssf-tok-keyword"), false);
    // Block code styles moved to components/content.css (PR-07)
    assert.match(baseCss, /content\.css|highlight\.js/i);
  });

  it("code chrome tokens match Atom One Dark base (#282c34)", () => {
    assert.match(tokensCss, /--hssf-code-bg:\s*#282c34/i);
  });

  it("type scale is anchored to --hssf-stage-font-size (not rem vs html)", () => {
    // Deck override of stage root must scale component fonts (v0.2.1 fix)
    assert.match(
      tokensCss,
      /--hssf-fs-base:\s*calc\(\s*1\.125\s*\*\s*var\(--hssf-stage-font-size\)\s*\)/,
    );
    assert.match(
      tokensCss,
      /--hssf-fs-hero:\s*calc\(\s*4\.5\s*\*\s*var\(--hssf-stage-font-size\)\s*\)/,
    );
    // Guard regression: bare rem type scale re-breaks deck overrides
    assert.equal(
      /--hssf-fs-base:\s*[\d.]+rem/.test(tokensCss),
      false,
      "--hssf-fs-base must not use rem (breaks stage-font-size override)",
    );
  });

  it("built dist/hssf.css embeds primary token when present", () => {
    if (!fs.existsSync(distCss)) {
      // Build not run yet — skip rather than fail isolated unit run
      return;
    }
    const dist = fs.readFileSync(distCss, "utf8");
    assert.match(dist, /--hssf-color-primary:\s*#be2727/i);
    assert.match(dist, /\.hssf-sr-only/);
  });
});
