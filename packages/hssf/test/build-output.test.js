/**
 * PR-09 — production dist artifacts exist after build.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "../dist");

const REQUIRED = [
  "hssf.js",
  "hssf.min.js",
  "hssf.esm.js",
  "hssf.esm.min.js",
  "hssf.css",
  "hssf.min.css",
  "atom-one-dark.css",
];

describe("production build outputs (PR-09)", () => {
  it("dist contains required assets when built", () => {
    if (!fs.existsSync(distDir)) {
      // unit suite can run before build in isolation
      return;
    }
    for (const f of REQUIRED) {
      assert.ok(
        fs.existsSync(path.join(distDir, f)),
        `missing dist/${f} — run pnpm build`,
      );
    }
  });

  it("min.js is smaller than unminified IIFE when both exist", () => {
    const a = path.join(distDir, "hssf.js");
    const b = path.join(distDir, "hssf.min.js");
    if (!fs.existsSync(a) || !fs.existsSync(b)) return;
    assert.ok(
      fs.statSync(b).size < fs.statSync(a).size,
      "hssf.min.js should be smaller than hssf.js",
    );
  });

  it("min.css is smaller than unminified CSS when both exist", () => {
    const a = path.join(distDir, "hssf.css");
    const b = path.join(distDir, "hssf.min.css");
    if (!fs.existsSync(a) || !fs.existsSync(b)) return;
    assert.ok(
      fs.statSync(b).size < fs.statSync(a).size,
      "hssf.min.css should be smaller than hssf.css",
    );
  });

  it("print.css source forces fragment reveal", () => {
    const print = fs.readFileSync(
      path.join(__dirname, "../src/css/print.css"),
      "utf8",
    );
    assert.match(print, /@media print/);
    assert.match(print, /data-hssf-fragment/);
    assert.match(print, /display:\s*revert/);
    assert.match(print, /hssf-nav/);
  });
});
