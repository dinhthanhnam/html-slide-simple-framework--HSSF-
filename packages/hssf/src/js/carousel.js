/**
 * Image / content carousel (v0.3)
 *
 * Markup:
 *   <div class="hssf-carousel" data-hssf-carousel>
 *     <div class="hssf-carousel__viewport">
 *       <div class="hssf-carousel__track">
 *         <figure class="hssf-carousel__slide is-active" data-hssf-carousel-slide>…</figure>
 *         <figure class="hssf-carousel__slide" data-hssf-carousel-slide>…</figure>
 *       </div>
 *     </div>
 *     <div class="hssf-carousel__controls">
 *       <button type="button" data-hssf-carousel-prev aria-label="Trước">‹</button>
 *       <div class="hssf-carousel__dots" data-hssf-carousel-dots></div>
 *       <span class="hssf-carousel__counter" data-hssf-carousel-counter></span>
 *       <button type="button" data-hssf-carousel-next aria-label="Sau">›</button>
 *     </div>
 *   </div>
 *
 * Deck arrow keys stay for slide nav — carousel uses buttons/dots only
 * (optional local key handling when carousel is focused).
 */

/**
 * @param {HTMLElement} canvas
 * @param {{ enabled?: boolean }} [options]
 * @param {typeof globalThis} [win]
 */
export function attachCarousels(canvas, options = {}, win = globalThis) {
  if (options.enabled === false || !canvas) {
    return { destroy() {} };
  }

  if (typeof canvas.querySelectorAll !== "function") {
    return { destroy() {} };
  }

  /** @type {Array<() => void>} */
  const cleanups = [];
  const roots = canvas.querySelectorAll("[data-hssf-carousel]");

  roots.forEach((root) => {
    const ctl = bindOne(/** @type {HTMLElement} */ (root), win);
    if (ctl) cleanups.push(ctl.destroy);
  });

  return {
    destroy() {
      cleanups.forEach((fn) => fn());
      cleanups.length = 0;
    },
  };
}

/**
 * @param {HTMLElement} root
 * @param {typeof globalThis} win
 */
function bindOne(root, win) {
  const slides = Array.from(
    root.querySelectorAll("[data-hssf-carousel-slide], .hssf-carousel__slide"),
  );
  if (slides.length === 0) return null;

  // Deduplicate if both selectors match same nodes
  const unique = [];
  const seen = new Set();
  for (const s of slides) {
    if (seen.has(s)) continue;
    seen.add(s);
    unique.push(s);
  }

  let index = Math.max(
    0,
    unique.findIndex((s) => s.classList.contains("is-active")),
  );
  if (index < 0) index = 0;

  const prevBtn = root.querySelector("[data-hssf-carousel-prev]");
  const nextBtn = root.querySelector("[data-hssf-carousel-next]");
  const dotsHost = root.querySelector("[data-hssf-carousel-dots]");
  const counter = root.querySelector("[data-hssf-carousel-counter]");
  const loop = root.getAttribute("data-hssf-carousel-loop") !== "false";

  /** @type {HTMLButtonElement[]} */
  let dots = [];

  if (dotsHost && unique.length > 1) {
    dotsHost.innerHTML = "";
    unique.forEach((_, i) => {
      const b = (root.ownerDocument || win.document).createElement("button");
      b.type = "button";
      b.className = "hssf-carousel__dot";
      b.setAttribute("data-hssf-carousel-dot", String(i));
      b.setAttribute("aria-label", `Ảnh ${i + 1}`);
      b.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        goTo(i);
      });
      dotsHost.appendChild(b);
      dots.push(b);
    });
  }

  function apply() {
    unique.forEach((slide, i) => {
      const on = i === index;
      slide.classList.toggle("is-active", on);
      slide.setAttribute("aria-hidden", on ? "false" : "true");
    });
    dots.forEach((d, i) => {
      d.classList.toggle("is-active", i === index);
      d.setAttribute("aria-current", i === index ? "true" : "false");
    });
    if (counter) {
      counter.textContent = `${index + 1} / ${unique.length}`;
    }
    if (prevBtn && "disabled" in prevBtn) {
      prevBtn.disabled = !loop && index <= 0;
    }
    if (nextBtn && "disabled" in nextBtn) {
      nextBtn.disabled = !loop && index >= unique.length - 1;
    }
  }

  /** @param {number} i */
  function goTo(i) {
    if (unique.length === 0) return;
    if (loop) {
      index = ((i % unique.length) + unique.length) % unique.length;
    } else {
      index = Math.min(unique.length - 1, Math.max(0, i));
    }
    apply();
  }

  function next() {
    goTo(index + 1);
  }

  function prev() {
    goTo(index - 1);
  }

  /** @type {Array<() => void>} */
  const localClean = [];

  if (prevBtn) {
    const onPrev = (e) => {
      e.preventDefault();
      e.stopPropagation();
      prev();
    };
    prevBtn.addEventListener("click", onPrev);
    localClean.push(() => prevBtn.removeEventListener("click", onPrev));
  }

  if (nextBtn) {
    const onNext = (e) => {
      e.preventDefault();
      e.stopPropagation();
      next();
    };
    nextBtn.addEventListener("click", onNext);
    localClean.push(() => nextBtn.removeEventListener("click", onNext));
  }

  // When carousel has focus, left/right cycle slides without advancing deck
  const onKey = (e) => {
    if (!root.contains(/** @type {Node} */ (e.target))) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      e.stopPropagation();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      e.stopPropagation();
      prev();
    }
  };
  root.setAttribute("tabindex", root.getAttribute("tabindex") || "0");
  root.addEventListener("keydown", onKey);
  localClean.push(() => root.removeEventListener("keydown", onKey));

  // Mark interactive for click-nav ignore
  root.setAttribute("data-hssf-no-click-nav", "");

  apply();

  return {
    destroy() {
      localClean.forEach((fn) => fn());
    },
  };
}
