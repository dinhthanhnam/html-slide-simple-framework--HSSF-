/**
 * v0.2 — term modal logic + flow/effects CSS inventory.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { attachTerms } from "../src/js/terms.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cssDir = path.join(__dirname, "../src/css/components");
const flow = fs.readFileSync(path.join(cssDir, "flow.css"), "utf8");
const effects = fs.readFileSync(path.join(cssDir, "effects.css"), "utf8");
const term = fs.readFileSync(path.join(cssDir, "term.css"), "utf8");

const FLOW = [
  ".hssf-flow",
  ".hssf-flow--row",
  ".hssf-flow--col",
  ".hssf-flow__node",
  ".hssf-flow__node--primary",
  ".hssf-flow__node--soft",
  ".hssf-flow__edge",
  ".hssf-flow__line",
  ".hssf-flow__edge-label",
  ".hssf-arrow",
  ".hssf-arrow--right",
  ".hssf-arrow--down",
  ".hssf-arrow--left",
  ".hssf-arrow--up",
  ".hssf-arrow--bidir",
  ".hssf-connector",
  ".hssf-connector--h",
  ".hssf-connector--v",
  ".hssf-connector--dashed",
  ".hssf-connector--elbow",
  ".hssf-connector--tee",
];

const FX = [
  ".hssf-fx--pulse",
  ".hssf-fx--spin",
  ".hssf-fx--spin-slow",
  ".hssf-fx--hover-pulse",
  ".hssf-fx--hover-spin",
  ".hssf-fx--hover-lift",
  ".hssf-fx--hover-scale",
  ".hssf-fx--hover-glow",
];

const TERM = [
  ".hssf-term",
  ".hssf-term--chip",
  ".hssf-term-modal",
  ".hssf-term-modal__dialog",
  ".hssf-term-modal__title",
  ".hssf-term-modal__body",
  ".hssf-term-modal.is-open",
];

describe("flow / arrow / connector CSS (v0.2)", () => {
  it("defines flow system classes", () => {
    for (const sel of FLOW) {
      assert.ok(flow.includes(sel), `missing ${sel}`);
    }
  });
});

describe("effect utilities CSS (v0.2)", () => {
  it("defines hover and attention effects", () => {
    for (const sel of FX) {
      assert.ok(effects.includes(sel), `missing ${sel}`);
    }
  });

  it("respects reduced motion", () => {
    assert.match(effects, /prefers-reduced-motion/);
  });
});

describe("term + modal CSS (v0.2)", () => {
  it("defines term and modal classes", () => {
    for (const sel of TERM) {
      assert.ok(term.includes(sel), `missing ${sel}`);
    }
  });
});

describe("attachTerms (v0.2)", () => {
  it("noops without DOM createElement", () => {
    const canvas = {
      querySelector() {
        return null;
      },
      getAttribute() {
        return null;
      },
      setAttribute() {},
      removeAttribute() {},
    };
    const ctl = attachTerms(/** @type {any} */ (canvas));
    assert.equal(ctl.isOpen(), false);
    ctl.open(/** @type {any} */ ({}));
    ctl.destroy();
  });

  it("opens modal from data-hssf-term-title/body", () => {
    /** @type {any[]} */
    const children = [];
    /** @type {Map<string, string>} */
    const canvasAttrs = new Map();
    /** @type {Array<[string, Function]>} */
    const listeners = [];

    function makeEl(tag = "div") {
      /** @type {any} */
      const el = {
        tagName: tag.toUpperCase(),
        className: "",
        attributes: {},
        children: [],
        style: {},
        textContent: "",
        innerHTML: "",
        hidden: false,
        parentNode: null,
        setAttribute(k, v) {
          this.attributes[k] = String(v);
        },
        getAttribute(k) {
          return this.attributes[k] ?? null;
        },
        hasAttribute(k) {
          return k in this.attributes;
        },
        removeAttribute(k) {
          delete this.attributes[k];
        },
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
          contains(c) {
            return this._s.has(c);
          },
        },
        querySelector(sel) {
          return find(this, sel);
        },
        querySelectorAll(sel) {
          const out = [];
          walk(this, (n) => {
            if (match(n, sel)) out.push(n);
          });
          return out;
        },
        appendChild(child) {
          this.children.push(child);
          child.parentNode = this;
          return child;
        },
        cloneNode(deep) {
          const c = makeEl(tag);
          c.innerHTML = this.innerHTML;
          c.textContent = this.textContent;
          c.attributes = { ...this.attributes };
          if (deep) c.children = this.children.map((ch) => ch.cloneNode(true));
          return c;
        },
        focus() {},
        addEventListener() {},
        removeEventListener() {},
        contains(node) {
          if (node === this) return true;
          return this.children.some(
            (ch) => ch === node || (ch.contains && ch.contains(node)),
          );
        },
        closest(sel) {
          let n = this;
          while (n) {
            if (match(n, sel)) return n;
            n = n.parentNode;
          }
          return null;
        },
        dispatchEvent() {
          return true;
        },
      };
      return el;
    }

    function walk(node, fn) {
      fn(node);
      for (const ch of node.children || []) walk(ch, fn);
    }

    function match(node, sel) {
      if (sel.startsWith(".")) return (node.className || "").includes(sel.slice(1));
      if (sel.startsWith("[")) {
        const name = sel.replace(/[\[\]\"]/g, "").split("=")[0];
        return node.getAttribute(name) != null || name in (node.attributes || {});
      }
      return false;
    }

    function find(root, sel) {
      let found = null;
      walk(root, (n) => {
        if (!found && match(n, sel)) found = n;
      });
      // attribute selectors like [data-hssf-term-modal-body]
      if (!found && sel.includes("data-hssf-term-modal-body")) {
        walk(root, (n) => {
          if (!found && n.getAttribute("data-hssf-term-modal-body") != null)
            found = n;
        });
      }
      if (!found && sel.includes("data-hssf-term-modal-title")) {
        walk(root, (n) => {
          if (!found && n.getAttribute("data-hssf-term-modal-title") != null)
            found = n;
        });
      }
      if (!found && sel.includes("data-hssf-term-modal-kicker")) {
        walk(root, (n) => {
          if (!found && n.getAttribute("data-hssf-term-modal-kicker") != null)
            found = n;
        });
      }
      if (!found && sel.includes("data-hssf-term-modal-dialog")) {
        walk(root, (n) => {
          if (!found && n.getAttribute("data-hssf-term-modal-dialog") != null)
            found = n;
        });
      }
      if (!found && sel.includes("data-hssf-term-close")) {
        walk(root, (n) => {
          if (!found && n.getAttribute("data-hssf-term-close") != null) found = n;
        });
      }
      if (!found && sel.includes("data-hssf-term-modal") && !sel.includes("body")) {
        walk(root, (n) => {
          if (!found && n.getAttribute("data-hssf-term-modal") != null) found = n;
        });
      }
      if (!found && sel.includes(".hssf-term-modal__close")) {
        walk(root, (n) => {
          if (!found && (n.className || "").includes("hssf-term-modal__close"))
            found = n;
        });
      }
      return found;
    }

    const canvas = makeEl("div");
    canvas.ownerDocument = {
      createElement(tag) {
        return makeEl(tag);
      },
      activeElement: null,
    };
    canvas.addEventListener = (type, fn) => {
      listeners.push([type, fn]);
    };
    canvas.removeEventListener = () => {};
    canvas.appendChild = function (child) {
      children.push(child);
      this.children.push(child);
      child.parentNode = this;
      return child;
    };
    canvas.setAttribute = (k, v) => canvasAttrs.set(k, String(v));
    canvas.getAttribute = (k) => canvasAttrs.get(k) ?? null;
    canvas.removeAttribute = (k) => canvasAttrs.delete(k);
    canvas.contains = (node) => {
      if (!node) return false;
      if (node === canvas || children.includes(node)) return true;
      let n = node;
      while (n) {
        if (n === canvas) return true;
        n = n.parentNode;
      }
      return false;
    };
    canvas.querySelector = (sel) => {
      for (const ch of children) {
        const f = find(ch, sel);
        if (f) return f;
      }
      return find(canvas, sel);
    };
    canvas.dispatchEvent = () => true;

    const fakeWin = {
      document: {
        addEventListener() {},
        removeEventListener() {},
        activeElement: null,
      },
      CustomEvent: class {
        constructor(type, init) {
          this.type = type;
          this.detail = init?.detail;
          this.bubbles = init?.bubbles;
        }
      },
    };

    const ctl = attachTerms(canvas, {}, fakeWin);
    assert.equal(children.length, 1, "modal should be injected");
    assert.ok(
      listeners.some((l) => l[0] === "click"),
      "click listener registered",
    );

    const trigger = makeEl("button");
    trigger.setAttribute("data-hssf-term", "");
    trigger.setAttribute("data-hssf-term-title", "Commit");
    trigger.setAttribute(
      "data-hssf-term-body",
      "Snapshot of the project at a point in time.",
    );
    trigger.textContent = "commit";
    trigger.parentNode = canvas;

    // Direct API (same path as click handler after resolve)
    ctl.open(trigger);

    assert.equal(ctl.isOpen(), true);
    assert.equal(canvasAttrs.get("data-hssf-term-open"), "true");

    const titleEl = canvas.querySelector("[data-hssf-term-modal-title]");
    assert.ok(titleEl);
    assert.equal(titleEl.textContent, "Commit");

    const bodyEl = canvas.querySelector("[data-hssf-term-modal-body]");
    assert.ok(bodyEl);
    assert.match(bodyEl.innerHTML, /Snapshot/);

    ctl.close();
    assert.equal(ctl.isOpen(), false);
    ctl.destroy();
  });
});
