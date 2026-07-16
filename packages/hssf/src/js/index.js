/**
 * HSSF — HTML Slide Simple Framework (Rikkei Education)
 * Public API entry.
 */

import { highlightCode, hljs } from "./highlight.js";
import {
  attachScale,
  fitStage,
  computeScale,
  readLogicalSize,
} from "./scale.js";
import { ensureActiveSlide, updateChrome, getSlides } from "./shell.js";
import { ensureCanvasA11y } from "./a11y.js";
import { createNavigation } from "./navigation.js";
import {
  parseHash,
  clampSlideIndex,
  formatHash,
  indexFromLocation,
  writeHash,
} from "./hash.js";
import { toggleFullscreen, isFullscreen } from "./fullscreen.js";
import {
  getFragments,
  getFragmentState,
  getFragmentVariant,
  revealNextFragment,
  hideLastFragment,
  resetFragments,
  prepareFragments,
  revealAllFragments,
  hideAllFragments,
  hasUnrevealedFragments,
  hasVisibleFragments,
  emitFragmentEvent,
} from "./fragments.js";

export const version = "0.1.1";

export {
  highlightCode,
  hljs,
  fitStage,
  computeScale,
  readLogicalSize,
  attachScale,
  getSlides,
  ensureActiveSlide,
  updateChrome,
  ensureCanvasA11y,
  createNavigation,
  parseHash,
  clampSlideIndex,
  formatHash,
  indexFromLocation,
  writeHash,
  toggleFullscreen,
  isFullscreen,
  getFragments,
  getFragmentState,
  getFragmentVariant,
  revealNextFragment,
  hideLastFragment,
  resetFragments,
  prepareFragments,
  revealAllFragments,
  hideAllFragments,
  hasUnrevealedFragments,
  hasVisibleFragments,
  emitFragmentEvent,
};

/**
 * Initialize a slide deck on a canvas root element.
 *
 * @param {HTMLElement | null} root
 * @param {{
 *   highlight?: boolean,
 *   scale?: boolean,
 *   hash?: boolean,
 *   keyboard?: boolean,
 *   clickNav?: boolean,
 *   swipe?: boolean,
 *   autofocus?: boolean,
 *   navigation?: boolean,
 * }} [options]
 */
export function init(root, options = {}) {
  if (root == null) {
    if (typeof console !== "undefined") {
      console.warn("[hssf] init(): root element is null or undefined");
    }
    return emptyDeck(options);
  }

  root.setAttribute("data-hssf-ready", "true");
  root.setAttribute("data-hssf-version", version);

  // A11y defaults: region + live + nav labels (autofocus remains opt-in)
  if (options.a11y !== false) {
    ensureCanvasA11y(root);
  }

  // Ensure DOM has a coherent active slide before nav takes over
  ensureActiveSlide(root);

  if (options.highlight !== false) {
    highlightCode(root, options);
  }

  /** @type {{ fit: () => number, destroy: () => void } | null} */
  let scaleCtl = null;
  if (options.scale !== false) {
    scaleCtl = attachScale(root);
  }

  /** @type {ReturnType<typeof createNavigation> | null} */
  let nav = null;
  if (options.navigation !== false) {
    nav = createNavigation(root, {
      hash: options.hash,
      keyboard: options.keyboard,
      clickNav: options.clickNav,
      swipe: options.swipe,
      autofocus: options.autofocus,
    });
  } else {
    updateChrome(root, ensureActiveSlide(root));
  }

  const deck = {
    version,
    root,
    options,
    fit() {
      return scaleCtl ? scaleCtl.fit() : fitStage(root);
    },
    next() {
      return nav ? nav.next() : deck.getIndex();
    },
    prev() {
      return nav ? nav.prev() : deck.getIndex();
    },
    home() {
      return nav ? nav.home() : 0;
    },
    end() {
      return nav ? nav.end() : deck.getIndex();
    },
    /** @param {number} zeroBased */
    goTo(zeroBased) {
      return nav ? nav.goTo(zeroBased) : 0;
    },
    getIndex() {
      if (nav) return nav.getIndex();
      const slides = getSlides(root);
      return Math.max(
        0,
        slides.findIndex((s) => s.classList.contains("is-active")),
      );
    },
    getSlideCount() {
      return nav ? nav.getSlideCount() : getSlides(root).length;
    },
    /** @returns {ReturnType<typeof getFragmentState>} */
    getFragmentState() {
      if (nav && typeof nav.getFragmentState === "function") {
        return nav.getFragmentState();
      }
      const slides = getSlides(root);
      const i = deck.getIndex();
      return getFragmentState(slides[i] || null);
    },
    toggleFullscreen() {
      return toggleFullscreen(root);
    },
    destroy() {
      if (nav) {
        nav.destroy();
        nav = null;
      }
      if (scaleCtl) {
        scaleCtl.destroy();
        scaleCtl = null;
      }
      root.removeAttribute("data-hssf-ready");
    },
  };

  return deck;
}

function emptyDeck(options) {
  return {
    version,
    root: null,
    options,
    destroy() {},
    fit() {
      return 1;
    },
    next() {
      return 0;
    },
    prev() {
      return 0;
    },
    home() {
      return 0;
    },
    end() {
      return 0;
    },
    goTo() {
      return 0;
    },
    getIndex() {
      return 0;
    },
    getSlideCount() {
      return 0;
    },
    getFragmentState() {
      return {
        total: 0,
        visible: 0,
        nextIndex: -1,
        complete: true,
        variants: [],
      };
    },
    toggleFullscreen() {
      return Promise.resolve(false);
    },
  };
}

export function attachGlobal(
  api = {
    init,
    version,
    highlight: highlightCode,
    hljs,
    fitStage,
    computeScale,
    parseHash,
    formatHash,
    toggleFullscreen,
  },
) {
  if (typeof globalThis !== "undefined") {
    globalThis.HSSF = api;
  }
  return api;
}

if (typeof window !== "undefined" && !globalThis.HSSF) {
  attachGlobal({
    init,
    version,
    highlight: highlightCode,
    hljs,
    fitStage,
    computeScale,
    parseHash,
    formatHash,
    toggleFullscreen,
  });
}
