/**
 * PR-05 — fragment contract: prepare, reveal, hide, reset-on-leave, variants, events.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getFragments,
  getFragmentState,
  getFragmentVariant,
  prepareFragments,
  resetFragments,
  revealNextFragment,
  hideLastFragment,
  revealAllFragments,
  hideAllFragments,
  hasUnrevealedFragments,
  hasVisibleFragments,
  emitFragmentEvent,
} from "../src/js/fragments.js";
import { createNavigation } from "../src/js/navigation.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function makeClassList(initial = []) {
  const set = new Set(initial);
  return {
    contains: (c) => set.has(c),
    add: (c) => set.add(c),
    remove: (c) => set.delete(c),
    toggle(c, force) {
      if (force === true) set.add(c);
      else if (force === false) set.delete(c);
      else if (set.has(c)) set.delete(c);
      else set.add(c);
    },
  };
}

function makeFrag(variant) {
  const attrs = { "data-hssf-fragment": variant === undefined ? "" : variant };
  /** @type {any} */
  const el = {
    classList: makeClassList(),
    attributes: { ...attrs },
    setAttribute(k, v) {
      this.attributes[k] = String(v);
    },
    getAttribute(k) {
      return k in this.attributes ? this.attributes[k] : null;
    },
    hasAttribute(k) {
      return k in this.attributes;
    },
  };
  return el;
}

function makeSlide(frags) {
  /** @type {any} */
  const slide = {
    children: frags,
    classList: makeClassList(["hssf-slide"]),
    attributes: { "data-hssf-slide": "" },
    setAttribute(k, v) {
      this.attributes[k] = String(v);
    },
    getAttribute(k) {
      return this.attributes[k] ?? null;
    },
    hasAttribute(k) {
      return k in this.attributes;
    },
    querySelectorAll(sel) {
      if (String(sel).includes("data-hssf-fragment")) {
        let list = frags;
        if (sel.includes(":not(.is-visible)")) {
          list = frags.filter((f) => !f.classList.contains("is-visible"));
        } else if (sel.includes(".is-visible")) {
          list = frags.filter((f) => f.classList.contains("is-visible"));
        }
        return list;
      }
      return [];
    },
  };
  return slide;
}

describe("fragment variants (PR-05)", () => {
  it("normalizes empty / fade / highlight", () => {
    assert.equal(getFragmentVariant(makeFrag("")), "fade");
    assert.equal(getFragmentVariant(makeFrag("fade")), "fade");
    assert.equal(getFragmentVariant(makeFrag("true")), "fade");
    assert.equal(getFragmentVariant(makeFrag("highlight")), "highlight");
    assert.equal(getFragmentVariant(makeFrag("custom")), "custom");
  });
});

describe("fragment reveal contract (PR-05)", () => {
  it("prepare sets indices and clears is-visible", () => {
    const a = makeFrag("");
    const b = makeFrag("highlight");
    a.classList.add("is-visible"); // author mistake — cleared
    const slide = makeSlide([a, b]);
    prepareFragments(slide, { reset: true });
    assert.equal(a.getAttribute("data-hssf-fragment-index"), "0");
    assert.equal(b.getAttribute("data-hssf-fragment-index"), "1");
    assert.equal(a.classList.contains("is-visible"), false);
    assert.equal(b.classList.contains("is-visible"), false);
  });

  it("revealNext then hideLast in order", () => {
    const a = makeFrag("fade");
    const b = makeFrag("highlight");
    const slide = makeSlide([a, b]);
    prepareFragments(slide);

    const r1 = revealNextFragment(slide);
    assert.ok(r1);
    assert.equal(r1.index, 0);
    assert.equal(r1.variant, "fade");
    assert.equal(r1.state.visible, 1);
    assert.equal(a.classList.contains("is-visible"), true);

    const r2 = revealNextFragment(slide);
    assert.ok(r2);
    assert.equal(r2.index, 1);
    assert.equal(r2.variant, "highlight");
    assert.equal(r2.state.complete, true);

    assert.equal(revealNextFragment(slide), false);

    const h1 = hideLastFragment(slide);
    assert.ok(h1);
    assert.equal(h1.index, 1);
    assert.equal(b.classList.contains("is-visible"), false);
    assert.equal(hasUnrevealedFragments(slide), true);
    assert.equal(hasVisibleFragments(slide), true);
  });

  it("resetFragments clears all visibility", () => {
    const a = makeFrag("");
    const b = makeFrag("");
    const slide = makeSlide([a, b]);
    revealAllFragments(slide);
    assert.equal(getFragmentState(slide).visible, 2);
    const n = resetFragments(slide);
    assert.equal(n, 2);
    assert.equal(getFragmentState(slide).visible, 0);
    assert.equal(hideAllFragments(slide), 0);
  });

  it("getFragmentState reports nextIndex", () => {
    const slide = makeSlide([makeFrag(""), makeFrag(""), makeFrag("")]);
    prepareFragments(slide);
    let st = getFragmentState(slide);
    assert.equal(st.total, 3);
    assert.equal(st.nextIndex, 0);
    assert.equal(st.complete, false);
    revealNextFragment(slide);
    st = getFragmentState(slide);
    assert.equal(st.visible, 1);
    assert.equal(st.nextIndex, 1);
    revealAllFragments(slide);
    st = getFragmentState(slide);
    assert.equal(st.complete, true);
    assert.equal(st.nextIndex, -1);
  });

  it("emitFragmentEvent dispatches CustomEvent", () => {
    const events = [];
    const target = {
      dispatchEvent(ev) {
        events.push(ev);
        return true;
      },
    };
    emitFragmentEvent(
      target,
      {
        action: "reveal",
        slideIndex: 0,
        fragmentIndex: 1,
        totalFragments: 3,
        visible: 2,
        variant: "fade",
      },
      { CustomEvent: class CustomEvent {
        constructor(type, init) {
          this.type = type;
          this.detail = init.detail;
          this.bubbles = init.bubbles;
        }
      } },
    );
    assert.equal(events.length, 1);
    assert.equal(events[0].type, "hssf:fragment");
    assert.equal(events[0].detail.fragmentIndex, 1);
  });
});

describe("reset-on-leave via navigation (PR-05)", () => {
  function makeClassList2(initial = []) {
    const set = new Set(initial);
    return {
      contains: (c) => set.has(c),
      add: (c) => set.add(c),
      remove: (c) => set.delete(c),
      toggle(c, force) {
        if (force === true) set.add(c);
        else if (force === false) set.delete(c);
      },
    };
  }

  function makeDeck() {
    const frags = [makeFrag(""), makeFrag("highlight")];
    const slide0 = {
      classList: makeClassList2(["hssf-slide", "is-active"]),
      attributes: { "data-hssf-slide": "", "data-hssf-label": "A" },
      children: frags,
      setAttribute(k, v) {
        this.attributes[k] = String(v);
      },
      getAttribute(k) {
        return this.attributes[k] ?? null;
      },
      hasAttribute(k) {
        return k in this.attributes;
      },
      querySelectorAll(sel) {
        if (String(sel).includes("data-hssf-page")) return [];
        if (String(sel).includes("data-hssf-fragment")) {
          if (sel.includes(":not(.is-visible)")) {
            return frags.filter((f) => !f.classList.contains("is-visible"));
          }
          if (sel.includes(".is-visible")) {
            return frags.filter((f) => f.classList.contains("is-visible"));
          }
          return frags;
        }
        return [];
      },
    };
    const slide1 = {
      classList: makeClassList2(["hssf-slide"]),
      attributes: { "data-hssf-slide": "", "data-hssf-label": "B" },
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
      querySelectorAll() {
        return [];
      },
    };

    const chrome = {
      counter: { textContent: "" },
      bar: { style: { width: "" } },
      prev: { disabled: false },
      next: { disabled: false },
    };

    const canvas = {
      attributes: {},
      dataset: {},
      children: [slide0, slide1],
      setAttribute() {},
      getAttribute() {
        return null;
      },
      querySelectorAll(sel) {
        if (sel.includes("data-hssf-slide")) return [slide0, slide1];
        return [];
      },
      querySelector(sel) {
        if (sel === "[data-hssf-counter]") return chrome.counter;
        if (sel === "[data-hssf-progress-bar]") return chrome.bar;
        if (sel === "[data-hssf-prev]") return chrome.prev;
        if (sel === "[data-hssf-next]") return chrome.next;
        if (sel === "[data-hssf-live]") return null;
        return null;
      },
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {
        return true;
      },
      focus() {},
    };

    return { canvas, slide0, frags, chrome };
  }

  function fakeWin() {
    return {
      location: { hash: "", href: "http://localhost/" },
      history: { replaceState() {} },
      addEventListener() {},
      removeEventListener() {},
      CustomEvent: class {
        constructor(type, init = {}) {
          this.type = type;
          this.detail = init.detail;
        }
      },
      getSelection() {
        return { toString: () => "" };
      },
    };
  }

  it("leaving a slide resets its fragments", () => {
    const { canvas, slide0, frags } = makeDeck();
    const nav = createNavigation(
      canvas,
      { hash: false, keyboard: false, swipe: false },
      fakeWin(),
    );

    // reveal both fragments on slide 0
    nav.next();
    nav.next();
    assert.equal(frags[0].classList.contains("is-visible"), true);
    assert.equal(frags[1].classList.contains("is-visible"), true);
    assert.equal(nav.getIndex(), 0);

    // advance to slide 1 → reset leave
    nav.next();
    assert.equal(nav.getIndex(), 1);
    assert.equal(frags[0].classList.contains("is-visible"), false);
    assert.equal(frags[1].classList.contains("is-visible"), false);

    // re-enter slide 0 → still hidden (start from zero)
    nav.prev();
    assert.equal(nav.getIndex(), 0);
    assert.equal(frags[0].classList.contains("is-visible"), false);
    assert.equal(getFragments(slide0).length, 2);

    nav.destroy();
  });

  it("home/end force reset of fragment progress", () => {
    const { canvas, frags } = makeDeck();
    const nav = createNavigation(
      canvas,
      { hash: false, keyboard: false, swipe: false },
      fakeWin(),
    );
    nav.next();
    assert.equal(frags[0].classList.contains("is-visible"), true);
    nav.end();
    assert.equal(nav.getIndex(), 1);
    assert.equal(frags[0].classList.contains("is-visible"), false);
    nav.home();
    assert.equal(nav.getIndex(), 0);
    assert.equal(frags[0].classList.contains("is-visible"), false);
    nav.destroy();
  });
});

describe("fragment CSS artifacts (PR-05)", () => {
  it("fragments.css encodes display:none and highlight variant", () => {
    const css = fs.readFileSync(
      path.join(__dirname, "../src/css/fragments.css"),
      "utf8",
    );
    assert.match(css, /display:\s*none/);
    assert.match(css, /data-hssf-fragment="highlight"/);
    assert.match(css, /prefers-reduced-motion/);
  });

  it("print.css forces all fragments visible", () => {
    const css = fs.readFileSync(
      path.join(__dirname, "../src/css/print.css"),
      "utf8",
    );
    assert.match(css, /data-hssf-fragment/);
    assert.match(css, /display:\s*revert\s*!important/);
  });

  it("built dist includes fragments.css when present", () => {
    const dist = path.join(__dirname, "../dist/hssf.css");
    if (!fs.existsSync(dist)) return;
    const css = fs.readFileSync(dist, "utf8");
    assert.match(css, /hssf-fragment-in|data-hssf-fragment/);
  });
});
