/**
 * Fragment reveal contract (PR-05 / KD-5).
 *
 * Author MUST only write:
 *   <li data-hssf-fragment>…</li>
 *   <li data-hssf-fragment="fade">…</li>
 *   <li data-hssf-fragment="highlight">…</li>
 *
 * Author MUST NOT add .hssf-fragment or .is-visible manually.
 *
 * Runtime:
 *   - data-hssf-fragment-index="0..k" on prepare
 *   - .is-visible when revealed
 *   - reset (.is-visible removed) on leave slide
 *   - flat DOM order only (no nested stacks)
 *
 * Variants: empty | "fade" (default) | "highlight"
 */

/** @typedef {'fade' | 'highlight' | string} FragmentVariant */

/**
 * @param {Element | null} slide
 * @returns {HTMLElement[]}
 */
export function getFragments(slide) {
  if (!slide || typeof slide.querySelectorAll !== "function") return [];
  // Only direct query within slide — flat order (nested stacks unsupported)
  return Array.from(
    /** @type {NodeListOf<HTMLElement>} */ (
      slide.querySelectorAll("[data-hssf-fragment]")
    ),
  );
}

/**
 * Normalize variant from attribute value.
 * @param {Element} el
 * @returns {FragmentVariant}
 */
export function getFragmentVariant(el) {
  const raw = el.getAttribute?.("data-hssf-fragment");
  if (raw == null || raw === "" || raw === "true" || raw === "fade") {
    return "fade";
  }
  if (raw === "highlight") return "highlight";
  return String(raw);
}

/**
 * @param {Element | null} slide
 * @returns {{
 *   total: number,
 *   visible: number,
 *   nextIndex: number,
 *   complete: boolean,
 *   variants: FragmentVariant[],
 * }}
 */
export function getFragmentState(slide) {
  const frags = getFragments(slide);
  const total = frags.length;
  let visible = 0;
  const variants = frags.map((el, i) => {
    if (el.classList.contains("is-visible")) visible += 1;
    // ensure index attrs stay in sync if author mutated DOM
    if (!el.hasAttribute("data-hssf-fragment-index")) {
      el.setAttribute("data-hssf-fragment-index", String(i));
    }
    return getFragmentVariant(el);
  });
  return {
    total,
    visible,
    nextIndex: visible < total ? visible : -1,
    complete: total === 0 || visible >= total,
    variants,
  };
}

/**
 * Index fragments in document order; optionally clear visibility (enter slide).
 * @param {Element | null} slide
 * @param {{ reset?: boolean }} [opts]
 * @returns {HTMLElement[]}
 */
export function prepareFragments(slide, opts = {}) {
  const frags = getFragments(slide);
  frags.forEach((el, i) => {
    el.setAttribute("data-hssf-fragment-index", String(i));
    // Strip author-applied is-visible if reset (contract: author must not set it)
    if (opts.reset !== false) {
      el.classList.remove("is-visible");
    }
  });
  return frags;
}

/**
 * Reset all fragments on a slide (on leave) — remove .is-visible only.
 * @param {Element | null} slide
 * @returns {number} count reset
 */
export function resetFragments(slide) {
  const frags = getFragments(slide);
  let n = 0;
  frags.forEach((el) => {
    if (el.classList.contains("is-visible")) {
      el.classList.remove("is-visible");
      n += 1;
    } else {
      el.classList.remove("is-visible");
    }
  });
  return n;
}

/**
 * @param {Element | null} slide
 * @returns {HTMLElement[]}
 */
export function visibleFragments(slide) {
  return getFragments(slide).filter((el) => el.classList.contains("is-visible"));
}

/**
 * Reveal next hidden fragment in document order.
 * @param {Element | null} slide
 * @returns {false | { index: number, element: HTMLElement, variant: FragmentVariant, state: ReturnType<typeof getFragmentState> }}
 */
export function revealNextFragment(slide) {
  const frags = getFragments(slide);
  const index = frags.findIndex((el) => !el.classList.contains("is-visible"));
  if (index < 0) return false;
  const element = frags[index];
  element.classList.add("is-visible");
  // re-stamp index (stable)
  element.setAttribute("data-hssf-fragment-index", String(index));
  return {
    index,
    element,
    variant: getFragmentVariant(element),
    state: getFragmentState(slide),
  };
}

/**
 * Hide the last currently visible fragment.
 * @param {Element | null} slide
 * @returns {false | { index: number, element: HTMLElement, variant: FragmentVariant, state: ReturnType<typeof getFragmentState> }}
 */
export function hideLastFragment(slide) {
  const frags = getFragments(slide);
  for (let i = frags.length - 1; i >= 0; i--) {
    if (frags[i].classList.contains("is-visible")) {
      frags[i].classList.remove("is-visible");
      return {
        index: i,
        element: frags[i],
        variant: getFragmentVariant(frags[i]),
        state: getFragmentState(slide),
      };
    }
  }
  return false;
}

/**
 * Reveal every fragment on the slide (e.g. print / jump-to-end of step list).
 * @param {Element | null} slide
 * @returns {number} newly revealed count
 */
export function revealAllFragments(slide) {
  const frags = getFragments(slide);
  let n = 0;
  frags.forEach((el, i) => {
    el.setAttribute("data-hssf-fragment-index", String(i));
    if (!el.classList.contains("is-visible")) {
      el.classList.add("is-visible");
      n += 1;
    }
  });
  return n;
}

/**
 * Hide every fragment (same as full reset of visibility).
 * @param {Element | null} slide
 * @returns {number}
 */
export function hideAllFragments(slide) {
  return resetFragments(slide);
}

/**
 * @param {Element | null} slide
 * @returns {boolean}
 */
export function hasUnrevealedFragments(slide) {
  return getFragments(slide).some((el) => !el.classList.contains("is-visible"));
}

/**
 * @param {Element | null} slide
 * @returns {boolean}
 */
export function hasVisibleFragments(slide) {
  return getFragments(slide).some((el) => el.classList.contains("is-visible"));
}

/**
 * Dispatch `hssf:fragment` on canvas (or slide).
 * @param {EventTarget | null} target
 * @param {{
 *   action: 'reveal' | 'hide' | 'reset' | 'prepare',
 *   slideIndex: number,
 *   fragmentIndex: number,
 *   totalFragments: number,
 *   visible: number,
 *   variant?: string,
 * }} detail
 * @param {typeof globalThis} [win]
 */
export function emitFragmentEvent(target, detail, win = globalThis) {
  if (!target || typeof target.dispatchEvent !== "function") return;
  try {
    const Ev = win.CustomEvent || globalThis.CustomEvent;
    if (!Ev) return;
    target.dispatchEvent(
      new Ev("hssf:fragment", {
        bubbles: true,
        detail,
      }),
    );
  } catch {
    /* non-DOM */
  }
}
