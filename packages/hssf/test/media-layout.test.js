/**
 * v0.3 — frame / carousel CSS + carousel bind smoke.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { attachCarousels } from "../src/js/carousel.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const media = fs.readFileSync(
  path.join(__dirname, "../src/css/components/media.css"),
  "utf8",
);
const layout = fs.readFileSync(
  path.join(__dirname, "../src/css/components/layout.css"),
  "utf8",
);

const FRAME = [
  ".hssf-frame",
  ".hssf-frame--browser",
  ".hssf-frame--polaroid",
  ".hssf-frame--device",
  ".hssf-frame--primary",
  ".hssf-frame__chrome",
  ".hssf-frame__media",
  ".hssf-frame__caption",
  ".hssf-frame__badge",
];

const CAROUSEL = [
  ".hssf-carousel",
  ".hssf-carousel__viewport",
  ".hssf-carousel__slide",
  ".hssf-carousel__controls",
  ".hssf-carousel__btn",
  ".hssf-carousel__dot",
  ".hssf-carousel__counter",
];

const LAYOUT_PRIMITIVES = [
  ".hssf-stack",
  ".hssf-cluster",
  ".hssf-split",
  ".hssf-media-split",
  ".hssf-fill",
  ".hssf-grid--auto",
];

describe("layout primitives (v0.3)", () => {
  it("defines stack/cluster/split helpers", () => {
    for (const sel of LAYOUT_PRIMITIVES) {
      assert.ok(layout.includes(sel), `missing ${sel}`);
    }
  });
});

describe("frame CSS (v0.3)", () => {
  it("defines frame variants", () => {
    for (const sel of FRAME) {
      assert.ok(media.includes(sel), `missing ${sel}`);
    }
  });
});

describe("carousel CSS (v0.3)", () => {
  it("defines carousel classes", () => {
    for (const sel of CAROUSEL) {
      assert.ok(media.includes(sel), `missing ${sel}`);
    }
  });
});

describe("attachCarousels (v0.3)", () => {
  it("noops on empty mock canvas", () => {
    const canvas = {
      querySelectorAll() {
        return [];
      },
    };
    const ctl = attachCarousels(/** @type {any} */ (canvas));
    ctl.destroy();
  });

  it("activates slides and advances on next", () => {
    function el(tag = "div") {
      /** @type {any} */
      const node = {
        tagName: tag.toUpperCase(),
        className: "",
        attributes: {},
        children: [],
        textContent: "",
        innerHTML: "",
        parentNode: null,
        classList: {
          _s: new Set(),
          add(c) {
            this._s.add(c);
            node.className = [...this._s].join(" ");
          },
          remove(c) {
            this._s.delete(c);
            node.className = [...this._s].join(" ");
          },
          toggle(c, force) {
            if (force === true) this.add(c);
            else if (force === false) this.remove(c);
            else if (this._s.has(c)) this.remove(c);
            else this.add(c);
          },
          contains(c) {
            return this._s.has(c);
          },
        },
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
        appendChild(c) {
          this.children.push(c);
          c.parentNode = this;
          return c;
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
        addEventListener() {},
        removeEventListener() {},
        contains(n) {
          return n === this || this.children.some((c) => c === n || c.contains?.(n));
        },
      };
      return node;
    }

    function walk(n, fn) {
      fn(n);
      for (const c of n.children || []) walk(c, fn);
    }

    function match(n, sel) {
      if (sel.startsWith(".")) return (n.className || "").split(/\s+/).includes(sel.slice(1));
      if (sel.includes("data-hssf-carousel-slide") || sel.includes("hssf-carousel__slide")) {
        return (
          n.getAttribute("data-hssf-carousel-slide") != null ||
          (n.className || "").includes("hssf-carousel__slide")
        );
      }
      if (sel.includes("data-hssf-carousel-prev"))
        return n.getAttribute("data-hssf-carousel-prev") != null;
      if (sel.includes("data-hssf-carousel-next"))
        return n.getAttribute("data-hssf-carousel-next") != null;
      if (sel.includes("data-hssf-carousel-dots"))
        return n.getAttribute("data-hssf-carousel-dots") != null;
      if (sel.includes("data-hssf-carousel-counter"))
        return n.getAttribute("data-hssf-carousel-counter") != null;
      if (sel.includes("data-hssf-carousel") && !sel.includes("slide") && !sel.includes("prev"))
        return n.getAttribute("data-hssf-carousel") != null;
      return false;
    }

    function find(root, sel) {
      let found = null;
      walk(root, (n) => {
        if (!found && match(n, sel)) found = n;
      });
      return found;
    }

    const root = el("div");
    root.setAttribute("data-hssf-carousel", "");
    root.className = "hssf-carousel";

    const s1 = el("figure");
    s1.classList.add("hssf-carousel__slide");
    s1.classList.add("is-active");
    s1.setAttribute("data-hssf-carousel-slide", "");
    const s2 = el("figure");
    s2.classList.add("hssf-carousel__slide");
    s2.setAttribute("data-hssf-carousel-slide", "");
    root.appendChild(s1);
    root.appendChild(s2);

    const prev = el("button");
    prev.setAttribute("data-hssf-carousel-prev", "");
    const next = el("button");
    next.setAttribute("data-hssf-carousel-next", "");
    const listeners = [];
    next.addEventListener = (type, fn) => listeners.push([type, fn]);
    prev.addEventListener = (type, fn) => listeners.push([type, fn]);
    root.addEventListener = () => {};
    root.appendChild(prev);
    root.appendChild(next);

    const counter = el("span");
    counter.setAttribute("data-hssf-carousel-counter", "");
    root.appendChild(counter);

    const canvas = {
      querySelectorAll(sel) {
        if (sel.includes("data-hssf-carousel")) return [root];
        return [];
      },
    };

    const doc = {
      createElement(tag) {
        return el(tag);
      },
    };
    root.ownerDocument = doc;

    const ctl = attachCarousels(/** @type {any} */ (canvas), {}, { document: doc });
    assert.ok(s1.classList.contains("is-active"));
    assert.equal(s2.classList.contains("is-active"), false);

    const nextClick = listeners.find(
      (l) => l[0] === "click" && l[1].toString().includes("next") === false,
    );
    // Fire all click handlers that advance — next button's handler
    const nextHandlers = listeners.filter((l) => l[0] === "click");
    // Last registered click on next is second prev/next pair - call the one that next registered
    // Our mock pushes both prev and next; call both with a fake event and check state after next
    nextHandlers[1][1]({ preventDefault() {}, stopPropagation() {} });

    assert.equal(s1.classList.contains("is-active"), false);
    assert.ok(s2.classList.contains("is-active"));
    assert.match(counter.textContent, /2\s*\/\s*2/);

    ctl.destroy();
  });
});
