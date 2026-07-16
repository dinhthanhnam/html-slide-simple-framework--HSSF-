/**
 * PR-01 placeholder tests — keep CI green.
 * Navigation / fragment tests land in PR-04 / PR-05.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { init, version } from "../src/js/index.js";

describe("hssf package smoke", () => {
  it("exports a semver-like version string", () => {
    assert.match(version, /^\d+\.\d+\.\d+/);
  });

  it("init() returns version and accepts null root safely", () => {
    const result = init(null);
    assert.equal(result.version, version);
    assert.equal(result.root, null);
  });

  it("init() marks a mock root as ready", () => {
    const attrs = new Map();
    const root = {
      setAttribute(name, value) {
        attrs.set(name, value);
      },
      getAttribute(name) {
        return attrs.has(name) ? attrs.get(name) : null;
      },
      hasAttribute(name) {
        return attrs.has(name);
      },
      removeAttribute(name) {
        attrs.delete(name);
      },
      querySelectorAll() {
        return [];
      },
      querySelector() {
        return null;
      },
    };
    const result = init(/** @type {any} */ (root), {
      highlight: false,
      scale: false,
      navigation: false,
    });
    assert.equal(result.root, root);
    assert.equal(attrs.get("data-hssf-ready"), "true");
    assert.equal(attrs.get("data-hssf-version"), version);
    assert.equal(typeof result.fit, "function");
    assert.equal(typeof result.destroy, "function");
    result.destroy();
  });
});
