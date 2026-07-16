/**
 * Deck navigation controller (PR-04).
 * Keyboard, buttons, hash, optional click-nav & swipe; fragment-aware next/prev.
 */

import { getSlides, updateChrome } from "./shell.js";
import {
  clampSlideIndex,
  formatHash,
  indexFromLocation,
  parseHash,
  writeHash,
} from "./hash.js";
import { toggleFullscreen } from "./fullscreen.js";
import {
  emitFragmentEvent,
  getFragmentState,
  hideLastFragment,
  prepareFragments,
  resetFragments,
  revealNextFragment,
} from "./fragments.js";

const INTERACTIVE_SEL =
  "a, button, input, textarea, select, label, [data-hssf-no-click-nav], [contenteditable='true']";

/**
 * @typedef {object} NavOptions
 * @property {boolean} [hash=true]
 * @property {boolean} [keyboard=true]
 * @property {boolean} [clickNav=false]
 * @property {boolean} [swipe=true]
 * @property {boolean} [autofocus=false]
 * @property {(detail: { index: number, prevIndex: number }) => void} [onChange]
 */

/**
 * @param {HTMLElement} canvas
 * @param {NavOptions} [options]
 * @param {typeof globalThis} [win]
 */
export function createNavigation(canvas, options = {}, win = globalThis) {
  const opts = {
    hash: options.hash !== false,
    keyboard: options.keyboard !== false,
    clickNav:
      options.clickNav === true ||
      (typeof canvas.getAttribute === "function" &&
        canvas.getAttribute("data-hssf-click-nav") === "true"),
    swipe: options.swipe !== false,
    autofocus: options.autofocus === true,
    onChange: options.onChange,
  };

  let index = 0;
  let destroyed = false;
  /** @type {Array<() => void>} */
  const cleanups = [];

  const slides = () => getSlides(canvas);

  function currentSlide() {
    return slides()[index] || null;
  }

  function applyActive(prevIndex) {
    const list = slides();
    list.forEach((slide, i) => {
      const on = i === index;
      slide.classList.toggle("is-active", on);
      slide.setAttribute("aria-hidden", on ? "false" : "true");
    });

    // Fragment lifecycle (KD-5): reset on leave, prepare on enter
    if (typeof prevIndex === "number" && prevIndex !== index && list[prevIndex]) {
      const cleared = resetFragments(list[prevIndex]);
      emitFragmentEvent(
        canvas,
        {
          action: "reset",
          slideIndex: prevIndex,
          fragmentIndex: -1,
          totalFragments: getFragmentState(list[prevIndex]).total,
          visible: 0,
          cleared,
        },
        win,
      );
    }
    if (list[index]) {
      prepareFragments(list[index], { reset: true });
      const st = getFragmentState(list[index]);
      emitFragmentEvent(
        canvas,
        {
          action: "prepare",
          slideIndex: index,
          fragmentIndex: -1,
          totalFragments: st.total,
          visible: st.visible,
        },
        win,
      );
    }

    updateChrome(canvas, index);

    if (opts.hash) {
      writeHash(index, { win, replace: true });
    }

    canvas.dataset.hssfIndex = String(index);

    syncNavDisabled();

    if (typeof opts.onChange === "function") {
      opts.onChange({ index, prevIndex: prevIndex ?? index });
    }

    try {
      canvas.dispatchEvent(
        new win.CustomEvent("hssf:slidechange", {
          bubbles: true,
          detail: { index, prevIndex: prevIndex ?? index, total: list.length },
        }),
      );
    } catch {
      /* non-DOM */
    }
  }

  /**
   * @param {number} zeroBased
   * @param {{ force?: boolean }} [goOpts]
   */
  function goTo(zeroBased, goOpts = {}) {
    if (destroyed) return index;
    const list = slides();
    const n = list.length;
    if (n === 0) return 0;
    const next = Math.min(n - 1, Math.max(0, Math.floor(zeroBased)));
    if (!goOpts.force && next === index) {
      updateChrome(canvas, index);
      return index;
    }
    const prev = index;
    index = next;
    applyActive(prev);
    return index;
  }

  function next() {
    if (destroyed) return index;
    const slide = currentSlide();
    const revealed = slide ? revealNextFragment(slide) : false;
    if (revealed) {
      emitFragmentEvent(
        canvas,
        {
          action: "reveal",
          slideIndex: index,
          fragmentIndex: revealed.index,
          totalFragments: revealed.state.total,
          visible: revealed.state.visible,
          variant: revealed.variant,
        },
        win,
      );
      updateChrome(canvas, index);
      syncNavDisabled();
      return index;
    }
    const list = slides();
    if (index < list.length - 1) {
      return goTo(index + 1);
    }
    return index;
  }

  function prev() {
    if (destroyed) return index;
    const slide = currentSlide();
    const hidden = slide ? hideLastFragment(slide) : false;
    if (hidden) {
      emitFragmentEvent(
        canvas,
        {
          action: "hide",
          slideIndex: index,
          fragmentIndex: hidden.index,
          totalFragments: hidden.state.total,
          visible: hidden.state.visible,
          variant: hidden.variant,
        },
        win,
      );
      updateChrome(canvas, index);
      syncNavDisabled();
      return index;
    }
    if (index > 0) {
      return goTo(index - 1);
    }
    return index;
  }

  function home() {
    return goTo(0, { force: true });
  }

  function end() {
    const list = slides();
    return goTo(Math.max(0, list.length - 1), { force: true });
  }

  function setDisabled(el, value) {
    if (!el) return;
    // duck-type (Node tests have no HTMLButtonElement)
    if ("disabled" in el) el.disabled = value;
  }

  function syncNavDisabled() {
    const list = slides();
    const prevBtn = canvas.querySelector("[data-hssf-prev]");
    const nextBtn = canvas.querySelector("[data-hssf-next]");
    const slide = list[index];
    let fragsLeft = false;
    let fragsVisible = false;
    if (slide && typeof slide.querySelectorAll === "function") {
      fragsLeft =
        slide.querySelectorAll("[data-hssf-fragment]:not(.is-visible)")
          .length > 0;
      fragsVisible =
        slide.querySelectorAll("[data-hssf-fragment].is-visible").length > 0;
    }
    setDisabled(prevBtn, index <= 0 && !fragsVisible);
    setDisabled(nextBtn, index >= list.length - 1 && !fragsLeft);
  }

  function onKeyDown(e) {
    if (destroyed) return;
    // Term modal owns keyboard while open (Esc closes; block slide nav)
    if (
      typeof canvas.getAttribute === "function" &&
      canvas.getAttribute("data-hssf-term-open") === "true"
    ) {
      return;
    }
    // ignore when typing in fields
    const t = /** @type {Element | null} */ (e.target);
    if (
      t &&
      typeof t.closest === "function" &&
      t.closest("input, textarea, select, [contenteditable='true']")
    ) {
      return;
    }

    const key = e.key;
    if (
      key === "ArrowRight" ||
      key === "PageDown" ||
      key === " " ||
      key === "Spacebar"
    ) {
      e.preventDefault();
      next();
      return;
    }
    if (key === "ArrowLeft" || key === "PageUp") {
      e.preventDefault();
      prev();
      return;
    }
    if (key === "Home") {
      e.preventDefault();
      home();
      return;
    }
    if (key === "End") {
      e.preventDefault();
      end();
      return;
    }
    if (key === "f" || key === "F") {
      // don't steal when modifier chords
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      e.preventDefault();
      toggleFullscreen(canvas);
    }
  }

  function onClick(e) {
    if (destroyed) return;
    const target = /** @type {Element | null} */ (e.target);
    if (!target || typeof target.closest !== "function") return;

    if (target.closest("[data-hssf-next]")) {
      e.preventDefault();
      next();
      return;
    }
    if (target.closest("[data-hssf-prev]")) {
      e.preventDefault();
      prev();
      return;
    }
    if (target.closest("[data-hssf-fullscreen]")) {
      e.preventDefault();
      toggleFullscreen(canvas);
      return;
    }

    if (!opts.clickNav) return;
    // ignore interactive + text selection
    if (target.closest(INTERACTIVE_SEL)) return;
    const sel = win.getSelection?.();
    if (sel && String(sel).length > 0) return;
    // only inside stage content
    if (!target.closest(".hssf-stage, [data-hssf-stage]")) return;
    next();
  }

  // Touch swipe
  let touchX = 0;
  let touchY = 0;
  let touchActive = false;

  function onTouchStart(e) {
    if (!opts.swipe || destroyed) return;
    const t = e.changedTouches?.[0];
    if (!t) return;
    touchX = t.clientX;
    touchY = t.clientY;
    touchActive = true;
  }

  function onTouchEnd(e) {
    if (!opts.swipe || !touchActive || destroyed) return;
    touchActive = false;
    const t = e.changedTouches?.[0];
    if (!t) return;
    const dx = t.clientX - touchX;
    const dy = t.clientY - touchY;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) next();
    else prev();
  }

  function onHashChange() {
    if (destroyed || !opts.hash) return;
    const list = slides();
    const nextIdx = indexFromLocation(list.length, win.location);
    if (nextIdx !== index) goTo(nextIdx, { force: true });
  }

  // Initial index: hash wins if present, else existing .is-active
  {
    const list = slides();
    const fromHash = opts.hash
      ? indexFromLocation(list.length, win.location)
      : null;
    let start = 0;
    if (opts.hash && win.location?.hash) {
      start = fromHash ?? 0;
    } else {
      const active = list.findIndex((s) => s.classList.contains("is-active"));
      start = active >= 0 ? active : 0;
    }
    index = start;
    applyActive(undefined);
  }

  if (opts.keyboard) {
    win.addEventListener("keydown", onKeyDown);
    cleanups.push(() => win.removeEventListener("keydown", onKeyDown));
  }

  canvas.addEventListener("click", onClick);
  cleanups.push(() => canvas.removeEventListener("click", onClick));

  if (opts.swipe) {
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd, { passive: true });
    cleanups.push(() => {
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchend", onTouchEnd);
    });
  }

  if (opts.hash) {
    win.addEventListener("hashchange", onHashChange);
    cleanups.push(() => win.removeEventListener("hashchange", onHashChange));
  }

  if (opts.autofocus && typeof canvas.focus === "function") {
    try {
      canvas.focus({ preventScroll: true });
    } catch {
      canvas.focus();
    }
  }

  return {
    next,
    prev,
    home,
    end,
    goTo,
    getIndex: () => index,
    getSlideCount: () => slides().length,
    /** Fragment state for the active slide */
    getFragmentState: () => getFragmentState(currentSlide()),
    formatHash: () => formatHash(index),
    destroy() {
      destroyed = true;
      while (cleanups.length) {
        const fn = cleanups.pop();
        try {
          fn?.();
        } catch {
          /* ignore */
        }
      }
    },
  };
}

export { parseHash, clampSlideIndex, formatHash, indexFromLocation };
