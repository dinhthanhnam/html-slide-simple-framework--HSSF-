/**
 * Advance-slide toaster helpers.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  willNextAdvanceSlide,
  ensureAdvanceHint,
  syncAdvanceHint,
} from "../src/js/advance-hint.js";

function makeSlide(hiddenFragCount, visibleFragCount = 0) {
  const nodes = [];
  for (let i = 0; i < hiddenFragCount; i++) {
    nodes.push({ matches: () => false });
  }
  return {
    querySelectorAll(sel) {
      if (sel === "[data-hssf-fragment]:not(.is-visible)") {
        return { length: hiddenFragCount };
      }
      if (sel === "[data-hssf-fragment].is-visible") {
        return { length: visibleFragCount };
      }
      return { length: 0 };
    },
  };
}

describe("willNextAdvanceSlide", () => {
  it("false on last slide", () => {
    assert.equal(willNextAdvanceSlide(makeSlide(0), 2, 3), false);
  });

  it("true when no fragments left and not last", () => {
    assert.equal(willNextAdvanceSlide(makeSlide(0), 0, 3), true);
  });

  it("false when fragments remain", () => {
    assert.equal(willNextAdvanceSlide(makeSlide(2), 0, 3), false);
  });

  it("true with null slide (treat as no fragments)", () => {
    assert.equal(willNextAdvanceSlide(null, 0, 2), true);
  });
});

describe("syncAdvanceHint DOM", () => {
  it("injects toaster and toggles visibility", () => {
    const children = [];
    const attrs = new Map();
    /** @type {any} */
    const canvas = {
      children,
      querySelector(sel) {
        if (String(sel).includes("data-hssf-advance-hint")) {
          return children.find((c) => c.getAttribute?.("data-hssf-advance-hint") != null) || null;
        }
        return null;
      },
      appendChild(el) {
        children.push(el);
        return el;
      },
      setAttribute(k, v) {
        attrs.set(k, v);
      },
      removeAttribute(k) {
        attrs.delete(k);
      },
      ownerDocument: {
        createElement(tag) {
          const a = new Map();
          const el = {
            tagName: tag.toUpperCase(),
            className: "",
            hidden: false,
            innerHTML: "",
            classList: {
              _s: new Set(),
              add(c) {
                this._s.add(c);
                el.className = [...this._s].join(" ");
              },
              remove(c) {
                this._s.delete(c);
                el.className = [...this._s].join(" ");
              },
              toggle(c, force) {
                if (force) this.add(c);
                else if (force === false) this.remove(c);
                else if (this._s.has(c)) this.remove(c);
                else this.add(c);
              },
              contains(c) {
                return this._s.has(c);
              },
            },
            setAttribute(k, v) {
              a.set(k, String(v));
            },
            getAttribute(k) {
              return a.has(k) ? a.get(k) : null;
            },
          };
          return el;
        },
      },
    };

    syncAdvanceHint(canvas, { willAdvanceSlide: true, enabled: true });
    const hint = ensureAdvanceHint(canvas);
    assert.ok(hint);
    assert.equal(hint.hidden, false);
    assert.ok(hint.classList.contains("is-visible"));
    assert.equal(attrs.get("data-hssf-will-advance"), "true");

    syncAdvanceHint(canvas, { willAdvanceSlide: false, enabled: true });
    assert.equal(hint.hidden, true);
    assert.equal(attrs.has("data-hssf-will-advance"), false);
  });
});
