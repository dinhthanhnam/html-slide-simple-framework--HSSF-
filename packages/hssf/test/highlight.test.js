/**
 * highlight.js integration — Atom One Dark is CSS; JS uses lib/common.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { highlightCode, hljs, init, version } from "../src/js/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distCss = path.join(__dirname, "../dist/hssf.css");
const distOneDark = path.join(__dirname, "../dist/atom-one-dark.css");

describe("hssf highlight.js (Atom One Dark)", () => {
  it("exports hljs and highlightCode", () => {
    assert.equal(typeof highlightCode, "function");
    assert.ok(hljs);
    assert.equal(typeof hljs.highlightElement, "function");
  });

  it("highlightCode no-ops on null and when highlight:false", () => {
    assert.equal(highlightCode(null), 0);
    assert.equal(highlightCode({ querySelectorAll: () => [] }, { highlight: false }), 0);
  });

  it("highlightCode swallows DOM-less element errors and returns 0", () => {
    const el = {
      dataset: {},
      className: "language-javascript",
      textContent: "const x = 1;",
    };
    const root = {
      querySelectorAll() {
        return [el];
      },
    };
    // No browser DOM → hljs throws; highlightCode catches and counts 0
    assert.equal(highlightCode(root), 0);
  });

  it("init respects highlight:false", () => {
    const attrs = new Map();
    let codeQuery = false;
    const root = {
      setAttribute(k, v) {
        attrs.set(k, v);
      },
      getAttribute(k) {
        return attrs.has(k) ? attrs.get(k) : null;
      },
      hasAttribute(k) {
        return attrs.has(k);
      },
      removeAttribute() {},
      querySelectorAll(sel) {
        // shell may query slides; highlight must not run for pre code
        if (String(sel).includes("code") || String(sel).includes("pre")) {
          codeQuery = true;
          throw new Error("should not query code when highlight:false");
        }
        return [];
      },
      querySelector() {
        return null;
      },
    };
    const r = init(/** @type {any} */ (root), {
      highlight: false,
      scale: false,
      navigation: false,
    });
    assert.equal(r.version, version);
    assert.equal(attrs.get("data-hssf-ready"), "true");
    assert.equal(codeQuery, false);
  });

  it("built CSS includes official Atom One Dark markers when dist exists", () => {
    if (!fs.existsSync(distCss)) return;
    const css = fs.readFileSync(distCss, "utf8");
    assert.match(css, /Atom One Dark/i);
    assert.match(css, /\.hljs\s*\{/);
    assert.match(css, /#282c34/);
    assert.match(css, /#abb2bf/);
    assert.ok(
      fs.existsSync(distOneDark),
      "dist/atom-one-dark.css should be copied for optional separate link",
    );
  });
});
