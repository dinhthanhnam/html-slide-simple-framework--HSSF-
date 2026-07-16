/**
 * PR-04 — hash parse, goTo/next/prev, fragment-aware step.
 */

import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  parseHash,
  clampSlideIndex,
  formatHash,
  indexFromLocation,
} from "../src/js/hash.js";
import {
  revealNextFragment,
  hideLastFragment,
  resetFragments,
  prepareFragments,
  getFragments,
} from "../src/js/fragments.js";
import { createNavigation } from "../src/js/navigation.js";

// ── minimal DOM mocks ────────────────────────────────────

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
      return set.has(c);
    },
    _set: set,
  };
}

function makeEl(tag = "div", attrs = {}) {
  /** @type {any} */
  const el = {
    tagName: tag.toUpperCase(),
    classList: makeClassList(
      attrs.className ? String(attrs.className).split(/\s+/) : [],
    ),
    attributes: { ...attrs },
    children: /** @type {any[]} */ ([]),
    parentElement: null,
    style: {},
    textContent: "",
    dataset: {},
    disabled: false,
    setAttribute(k, v) {
      this.attributes[k] = String(v);
    },
    getAttribute(k) {
      return this.attributes[k] ?? null;
    },
    hasAttribute(k) {
      return k in this.attributes;
    },
    appendChild(child) {
      child.parentElement = this;
      this.children.push(child);
      return child;
    },
    querySelectorAll(sel) {
      return queryAll(this, sel);
    },
    querySelector(sel) {
      const all = queryAll(this, sel);
      return all[0] || null;
    },
    closest() {
      return null;
    },
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return true;
    },
    focus() {},
  };
  if (attrs["data-hssf-fragment"] !== undefined) {
    el.attributes["data-hssf-fragment"] = attrs["data-hssf-fragment"];
  }
  return el;
}

function matches(el, sel) {
  if (sel === "[data-hssf-slide]" || sel === ".hssf-slide") {
    return (
      el.hasAttribute("data-hssf-slide") ||
      el.classList.contains("hssf-slide")
    );
  }
  if (sel === "[data-hssf-fragment]") {
    return el.hasAttribute("data-hssf-fragment");
  }
  if (sel === "[data-hssf-fragment]:not(.is-visible)") {
    return (
      el.hasAttribute("data-hssf-fragment") &&
      !el.classList.contains("is-visible")
    );
  }
  if (sel === "[data-hssf-fragment].is-visible") {
    return (
      el.hasAttribute("data-hssf-fragment") &&
      el.classList.contains("is-visible")
    );
  }
  if (sel === "[data-hssf-page]") {
    return el.hasAttribute("data-hssf-page");
  }
  if (sel === "[data-hssf-counter]") {
    return el.hasAttribute("data-hssf-counter");
  }
  if (sel === "[data-hssf-progress-bar]") {
    return el.hasAttribute("data-hssf-progress-bar");
  }
  if (sel === "[data-hssf-live]") {
    return el.hasAttribute("data-hssf-live");
  }
  if (sel === "[data-hssf-prev]") {
    return el.hasAttribute("data-hssf-prev");
  }
  if (sel === "[data-hssf-next]") {
    return el.hasAttribute("data-hssf-next");
  }
  if (sel === "[data-hssf-fullscreen]") {
    return el.hasAttribute("data-hssf-fullscreen");
  }
  return false;
}

function walk(root, fn) {
  fn(root);
  for (const c of root.children || []) walk(c, fn);
}

function queryAll(root, sel) {
  const out = [];
  // multi-selectors not needed; walk descendants + self
  walk(root, (el) => {
    if (el !== root && matches(el, sel)) out.push(el);
    // also allow matching self for canvas-level queries when root is canvas
  });
  // include self for canvas chrome queries
  if (matches(root, sel)) out.unshift(root);
  // special: query slides only among descendants when from canvas
  if (sel === "[data-hssf-slide], .hssf-slide" || sel.includes("data-hssf-slide")) {
    const slides = [];
    walk(root, (el) => {
      if (el !== root && matches(el, "[data-hssf-slide]")) slides.push(el);
    });
    return slides;
  }
  if (sel === "[data-hssf-fragment]") {
    const frags = [];
    walk(root, (el) => {
      if (el !== root && matches(el, "[data-hssf-fragment]")) frags.push(el);
    });
    return frags;
  }
  if (sel === "[data-hssf-fragment]:not(.is-visible)") {
    return queryAll(root, "[data-hssf-fragment]").filter(
      (el) => !el.classList.contains("is-visible"),
    );
  }
  if (sel === "[data-hssf-fragment].is-visible") {
    return queryAll(root, "[data-hssf-fragment]").filter((el) =>
      el.classList.contains("is-visible"),
    );
  }
  // single chrome element
  const found = [];
  walk(root, (el) => {
    if (matches(el, sel)) found.push(el);
  });
  return found;
}

function makeDeck(slideCount = 3, { withFragmentsOn = -1 } = {}) {
  const canvas = makeEl("div", { className: "hssf-canvas" });
  canvas.attributes["data-hssf-canvas"] = "";

  const bar = makeEl("div");
  bar.attributes["data-hssf-progress-bar"] = "";
  canvas.appendChild(bar);

  const counter = makeEl("span");
  counter.attributes["data-hssf-counter"] = "";
  canvas.appendChild(counter);

  const prevBtn = makeEl("button");
  prevBtn.attributes["data-hssf-prev"] = "";
  canvas.appendChild(prevBtn);

  const nextBtn = makeEl("button");
  nextBtn.attributes["data-hssf-next"] = "";
  canvas.appendChild(nextBtn);

  for (let i = 0; i < slideCount; i++) {
    const slide = makeEl("section", { className: "hssf-slide" });
    slide.attributes["data-hssf-slide"] = "";
    slide.attributes["data-hssf-label"] = `S${i + 1}`;
    if (i === 0) slide.classList.add("is-active");
    const page = makeEl("span");
    page.attributes["data-hssf-page"] = "";
    slide.appendChild(page);

    if (i === withFragmentsOn) {
      for (let f = 0; f < 2; f++) {
        const frag = makeEl("li");
        frag.attributes["data-hssf-fragment"] = "";
        slide.appendChild(frag);
      }
    }
    canvas.appendChild(slide);
  }

  // fix querySelectorAll for combined selector used by getSlides
  const origQSA = canvas.querySelectorAll.bind(canvas);
  canvas.querySelectorAll = (sel) => {
    if (
      sel === "[data-hssf-slide], .hssf-slide" ||
      sel === "[data-hssf-slide]"
    ) {
      return canvas.children.filter(
        (c) =>
          c.hasAttribute("data-hssf-slide") ||
          c.classList.contains("hssf-slide"),
      );
    }
    return origQSA(sel);
  };

  return canvas;
}

function fakeWin(hash = "") {
  const listeners = new Map();
  return {
    location: { hash, href: `http://localhost/${hash}` },
    history: {
      replaceState(_a, _b, url) {
        const m = String(url).match(/#.*$/);
        fakeWinHash.value = m ? m[0] : "";
        this._hash = fakeWinHash.value;
      },
    },
    addEventListener(type, fn) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(fn);
    },
    removeEventListener(type, fn) {
      listeners.get(type)?.delete(fn);
    },
    CustomEvent: class CustomEvent {
      constructor(type, init = {}) {
        this.type = type;
        this.detail = init.detail;
        this.bubbles = init.bubbles;
      }
    },
    getSelection() {
      return { toString: () => "" };
    },
    _listeners: listeners,
  };
}

const fakeWinHash = { value: "" };

// ── tests ────────────────────────────────────────────────

describe("hash helpers (PR-04)", () => {
  it("parseHash accepts #3, #slide-3, #slide=3", () => {
    assert.equal(parseHash("#3"), 3);
    assert.equal(parseHash("3"), 3);
    assert.equal(parseHash("#slide-3"), 3);
    assert.equal(parseHash("#slide=3"), 3);
    assert.equal(parseHash("#slide_3"), 3);
  });

  it("parseHash empty → null; garbage → null", () => {
    assert.equal(parseHash(""), null);
    assert.equal(parseHash("#"), null);
    assert.equal(parseHash("#foo"), null);
  });

  it("clampSlideIndex clamps to range and empty → 0", () => {
    assert.equal(clampSlideIndex(null, 5), 0);
    assert.equal(clampSlideIndex(1, 5), 0);
    assert.equal(clampSlideIndex(5, 5), 4);
    assert.equal(clampSlideIndex(99, 5), 4);
    assert.equal(clampSlideIndex(0, 5), 0);
  });

  it("formatHash is 1-based canonical", () => {
    assert.equal(formatHash(0), "#1");
    assert.equal(formatHash(2), "#3");
  });

  it("indexFromLocation uses parse + clamp", () => {
    assert.equal(indexFromLocation(10, { hash: "#slide-4" }), 3);
    assert.equal(indexFromLocation(3, { hash: "#99" }), 2);
    assert.equal(indexFromLocation(3, { hash: "" }), 0);
  });
});

describe("fragments helpers (PR-04 hook)", () => {
  it("reveal / hide / reset in order", () => {
    const slide = makeEl("section");
    const a = makeEl("li");
    a.attributes["data-hssf-fragment"] = "";
    const b = makeEl("li");
    b.attributes["data-hssf-fragment"] = "";
    slide.appendChild(a);
    slide.appendChild(b);

    // patch query for fragments
    slide.querySelectorAll = (sel) => {
      if (sel === "[data-hssf-fragment]") return [a, b];
      return [];
    };

    prepareFragments(slide);
    assert.equal(a.getAttribute("data-hssf-fragment-index"), "0");
    assert.equal(b.classList.contains("is-visible"), false);

    assert.ok(revealNextFragment(slide));
    assert.equal(a.classList.contains("is-visible"), true);
    assert.ok(revealNextFragment(slide));
    assert.equal(b.classList.contains("is-visible"), true);
    assert.equal(revealNextFragment(slide), false);

    assert.ok(hideLastFragment(slide));
    assert.equal(b.classList.contains("is-visible"), false);

    resetFragments(slide);
    assert.equal(a.classList.contains("is-visible"), false);
  });
});

describe("createNavigation (PR-04)", () => {
  it("goTo / next / prev change active slide", () => {
    const canvas = makeDeck(3);
    const win = fakeWin("");
    const nav = createNavigation(
      canvas,
      { hash: false, keyboard: false, swipe: false },
      win,
    );

    assert.equal(nav.getIndex(), 0);
    assert.equal(nav.getSlideCount(), 3);

    nav.next();
    assert.equal(nav.getIndex(), 1);
    const slides = canvas.querySelectorAll("[data-hssf-slide]");
    assert.equal(slides[1].classList.contains("is-active"), true);
    assert.equal(slides[0].classList.contains("is-active"), false);

    nav.prev();
    assert.equal(nav.getIndex(), 0);

    nav.goTo(2);
    assert.equal(nav.getIndex(), 2);
    nav.home();
    assert.equal(nav.getIndex(), 0);
    nav.end();
    assert.equal(nav.getIndex(), 2);

    nav.destroy();
  });

  it("next reveals fragments before leaving slide", () => {
    const canvas = makeDeck(2, { withFragmentsOn: 0 });
    const win = fakeWin("");
    const nav = createNavigation(
      canvas,
      { hash: false, keyboard: false, swipe: false },
      win,
    );

    const slide0 = canvas.querySelectorAll("[data-hssf-slide]")[0];
    const frags = getFragments(slide0);
    // ensure getFragments works — need querySelectorAll on slide
    slide0.querySelectorAll = (sel) => {
      if (String(sel).includes("data-hssf-fragment")) {
        return slide0.children.filter((c) =>
          c.hasAttribute("data-hssf-fragment"),
        );
      }
      return [];
    };

    // re-prepare after patch
    prepareFragments(slide0);

    assert.equal(nav.getIndex(), 0);
    nav.next(); // frag 1
    assert.equal(nav.getIndex(), 0);
    assert.equal(
      slide0.children.filter(
        (c) =>
          c.hasAttribute("data-hssf-fragment") &&
          c.classList.contains("is-visible"),
      ).length,
      1,
    );
    nav.next(); // frag 2
    assert.equal(nav.getIndex(), 0);
    nav.next(); // → slide 2
    assert.equal(nav.getIndex(), 1);

    nav.destroy();
  });

  it("hash option writes canonical #n via replaceState", () => {
    const canvas = makeDeck(3);
    fakeWinHash.value = "";
    const win = fakeWin("");
    win.location.hash = "";
    const nav = createNavigation(
      canvas,
      { hash: true, keyboard: false, swipe: false },
      win,
    );
    nav.goTo(1);
    assert.ok(
      fakeWinHash.value === "#2" || win.location.hash === "#2",
      `expected #2, got hash=${win.location.hash} replace=${fakeWinHash.value}`,
    );
    nav.destroy();
  });

  it("starts from hash #3", () => {
    const canvas = makeDeck(4);
    const win = fakeWin("#3");
    win.location.hash = "#3";
    const nav = createNavigation(
      canvas,
      { hash: true, keyboard: false, swipe: false },
      win,
    );
    assert.equal(nav.getIndex(), 2);
    nav.destroy();
  });
});
