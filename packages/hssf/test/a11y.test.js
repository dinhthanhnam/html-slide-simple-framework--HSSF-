/**
 * PR-13 — a11y defaults
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ensureCanvasA11y, syncProgressA11y } from "../src/js/a11y.js";

function el(tag = "div", attrs = {}) {
  /** @type {any} */
  const node = {
    tagName: tag.toUpperCase(),
    attributes: { ...attrs },
    classList: {
      _s: new Set(String(attrs.className || "").split(/\s+/).filter(Boolean)),
      contains(c) {
        return this._s.has(c);
      },
      add(c) {
        this._s.add(c);
      },
    },
    children: [],
    setAttribute(k, v) {
      this.attributes[k] = String(v);
    },
    getAttribute(k) {
      return this.attributes[k] ?? null;
    },
    hasAttribute(k) {
      return k in this.attributes;
    },
    querySelector(sel) {
      return query(this, sel);
    },
    insertBefore(child, ref) {
      const i = ref ? this.children.indexOf(ref) : 0;
      this.children.splice(i < 0 ? this.children.length : i, 0, child);
      child.parentNode = this;
      return child;
    },
    firstChild: null,
    ownerDocument: {
      createElement(t) {
        return el(t);
      },
    },
  };
  Object.defineProperty(node, "firstChild", {
    get() {
      return this.children[0] || null;
    },
  });
  return node;
}

function query(root, sel) {
  if (sel.includes("data-hssf-live")) {
    return root.children.find((c) => c.getAttribute("data-hssf-live") != null) || null;
  }
  if (sel.includes("data-hssf-prev")) {
    return root.children.find((c) => c.getAttribute("data-hssf-prev") != null) || null;
  }
  if (sel.includes("data-hssf-next")) {
    return root.children.find((c) => c.getAttribute("data-hssf-next") != null) || null;
  }
  if (sel.includes("data-hssf-fullscreen")) {
    return (
      root.children.find((c) => c.getAttribute("data-hssf-fullscreen") != null) ||
      null
    );
  }
  if (sel.includes("data-hssf-progress-bar")) {
    return (
      root.children.find((c) => c.getAttribute("data-hssf-progress-bar") != null) ||
      null
    );
  }
  if (sel.includes("data-hssf-progress") || sel.includes("hssf-progress")) {
    return (
      root.children.find(
        (c) =>
          c.getAttribute("data-hssf-progress") != null ||
          c.classList.contains("hssf-progress"),
      ) || null
    );
  }
  if (sel.includes("data-hssf-nav") || sel === ".hssf-nav") {
    return (
      root.children.find(
        (c) =>
          c.getAttribute("data-hssf-nav") != null || c.classList.contains("hssf-nav"),
      ) || null
    );
  }
  if (sel.includes("stage-wrap")) {
    return root.children.find((c) => c.classList.contains("hssf-stage-wrap")) || null;
  }
  return null;
}

describe("ensureCanvasA11y (PR-13)", () => {
  it("sets region role, roledescription, tabindex", () => {
    const canvas = el("div");
    const wrap = el("div", { className: "hssf-stage-wrap" });
    canvas.children.push(wrap);
    ensureCanvasA11y(canvas);
    assert.equal(canvas.getAttribute("role"), "region");
    assert.equal(canvas.getAttribute("aria-roledescription"), "slide deck");
    assert.equal(canvas.getAttribute("tabindex"), "0");
    assert.equal(canvas.getAttribute("aria-label"), "Presentation");
  });

  it("creates live region when missing", () => {
    const canvas = el("div");
    const wrap = el("div", { className: "hssf-stage-wrap" });
    canvas.children.push(wrap);
    ensureCanvasA11y(canvas);
    const live = canvas.children.find(
      (c) => c.getAttribute("data-hssf-live") != null,
    );
    assert.ok(live);
    assert.equal(live.getAttribute("aria-live"), "polite");
    assert.ok(live.classList.contains("hssf-sr-only"));
  });

  it("labels nav buttons when unlabeled", () => {
    const canvas = el("div");
    const prev = el("button");
    prev.setAttribute("data-hssf-prev", "");
    const next = el("button");
    next.setAttribute("data-hssf-next", "");
    canvas.children.push(prev, next);
    ensureCanvasA11y(canvas);
    assert.equal(prev.getAttribute("aria-label"), "Previous slide");
    assert.equal(next.getAttribute("aria-label"), "Next slide");
    assert.equal(prev.getAttribute("type"), "button");
  });

  it("syncProgressA11y sets valuetext", () => {
    const canvas = el("div");
    const bar = el("div");
    bar.setAttribute("data-hssf-progress-bar", "");
    canvas.children.push(bar);
    syncProgressA11y(canvas, 1, 3);
    assert.equal(bar.getAttribute("aria-valuenow"), "50");
    assert.match(bar.getAttribute("aria-valuetext") || "", /2 of 3/);
  });
});
