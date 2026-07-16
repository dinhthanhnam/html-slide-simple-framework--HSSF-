/**
 * Shell helpers: active slide, page numbers, counter, progress.
 */

import { syncProgressA11y } from "./a11y.js";

/**
 * @param {HTMLElement} canvas
 * @returns {HTMLElement[]}
 */
export function getSlides(canvas) {
  return Array.from(
    canvas.querySelectorAll("[data-hssf-slide], .hssf-slide"),
  );
}

/**
 * Ensure exactly one slide is active (first if none).
 * @param {HTMLElement} canvas
 * @returns {number} active index (0-based)
 */
export function ensureActiveSlide(canvas) {
  const slides = getSlides(canvas);
  if (slides.length === 0) return 0;

  let active = slides.findIndex((s) => s.classList.contains("is-active"));
  if (active < 0) active = 0;

  slides.forEach((slide, i) => {
    const on = i === active;
    slide.classList.toggle("is-active", on);
    slide.setAttribute("aria-hidden", on ? "false" : "true");
  });

  return active;
}

/**
 * Fill [data-hssf-page] and [data-hssf-counter]; progress bar width.
 * @param {HTMLElement} canvas
 * @param {number} [index] 0-based active index
 */
export function updateChrome(canvas, index) {
  const slides = getSlides(canvas);
  const n = slides.length;
  const i =
    typeof index === "number" && index >= 0
      ? index
      : Math.max(
          0,
          slides.findIndex((s) => s.classList.contains("is-active")),
        );

  slides.forEach((slide, idx) => {
    const pageEls = slide.querySelectorAll("[data-hssf-page]");
    pageEls.forEach((el) => {
      el.textContent = String(idx + 1);
    });
  });

  const counter = canvas.querySelector("[data-hssf-counter]");
  if (counter) {
    counter.textContent = n > 0 ? `${i + 1} / ${n}` : "0 / 0";
  }

  const bar = canvas.querySelector("[data-hssf-progress-bar]");
  if (bar) {
    const pct = n <= 1 ? 0 : (i / (n - 1)) * 100;
    bar.style.width = `${pct}%`;
  }
  syncProgressA11y(canvas, i < 0 ? 0 : i, n);

  const live = canvas.querySelector("[data-hssf-live]");
  if (live && slides[i]) {
    const label =
      slides[i].getAttribute("data-hssf-label") ||
      slides[i].getAttribute("aria-label") ||
      `Slide ${i + 1}`;
    // Polite live region — announce label + position
    live.textContent = `${label}, slide ${i + 1} of ${n}`;
  }
}
