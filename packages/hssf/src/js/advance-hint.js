/**
 * Advance-to-next-slide hint (toaster).
 * Visible when the next “next” action will change slide (no fragments left).
 */

const HINT_ATTR = "data-hssf-advance-hint";
const WILL_ADVANCE_ATTR = "data-hssf-will-advance";

/**
 * @param {HTMLElement} canvas
 * @param {typeof globalThis} [win]
 * @returns {HTMLElement | null}
 */
export function ensureAdvanceHint(canvas, win = globalThis) {
  if (!canvas || typeof canvas.querySelector !== "function") return null;
  let el = canvas.querySelector(`[${HINT_ATTR}]`);
  if (el) return /** @type {HTMLElement} */ (el);

  const doc = canvas.ownerDocument || win.document;
  if (!doc || typeof doc.createElement !== "function") return null;

  el = doc.createElement("div");
  el.className = "hssf-advance-hint";
  el.setAttribute(HINT_ATTR, "");
  el.setAttribute("role", "status");
  el.setAttribute("aria-live", "polite");
  el.hidden = true;
  el.innerHTML =
    '<span class="hssf-advance-hint__dot" aria-hidden="true"></span>' +
    '<span class="hssf-advance-hint__text">→ Sang slide tiếp theo</span>';
  canvas.appendChild(el);
  return el;
}

/**
 * @param {HTMLElement} canvas
 * @param {{ willAdvanceSlide: boolean, enabled?: boolean }} state
 * @param {typeof globalThis} [win]
 */
export function syncAdvanceHint(canvas, state, win = globalThis) {
  if (!canvas) return;
  const enabled = state.enabled !== false;
  const show = enabled && state.willAdvanceSlide === true;

  if (show && typeof canvas.setAttribute === "function") {
    canvas.setAttribute(WILL_ADVANCE_ATTR, "true");
  } else if (
    !show &&
    typeof canvas.removeAttribute === "function"
  ) {
    canvas.removeAttribute(WILL_ADVANCE_ATTR);
  }

  if (!enabled) {
    const existing = canvas.querySelector?.(`[${HINT_ATTR}]`);
    if (existing) {
      existing.classList.remove("is-visible");
      existing.hidden = true;
    }
    return;
  }

  const el = ensureAdvanceHint(canvas, win);
  if (!el) return;
  el.classList.toggle("is-visible", show);
  el.hidden = !show;
}

/**
 * Next key/button would call goTo(index+1) rather than reveal a fragment.
 * @param {HTMLElement | null | undefined} slide
 * @param {number} index
 * @param {number} slideCount
 */
export function willNextAdvanceSlide(slide, index, slideCount) {
  if (slideCount <= 0) return false;
  if (index >= slideCount - 1) return false;
  if (!slide || typeof slide.querySelectorAll !== "function") return true;
  const left = slide.querySelectorAll(
    "[data-hssf-fragment]:not(.is-visible)",
  ).length;
  return left === 0;
}
