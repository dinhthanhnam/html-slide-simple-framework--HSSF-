/**
 * Accessibility defaults (PR-13).
 * - role="region" + aria-roledescription on canvas (not role=application)
 * - ensure live region for slide announcements
 * - label nav controls if missing
 * - tabindex=0 for keyboard without forcing autofocus (default off)
 */

/**
 * @param {HTMLElement} canvas
 * @param {{ ensureLive?: boolean, labelNav?: boolean }} [options]
 */
export function ensureCanvasA11y(canvas, options = {}) {
  if (!canvas || typeof canvas.setAttribute !== "function") return;

  const has = (name) =>
    typeof canvas.hasAttribute === "function"
      ? canvas.hasAttribute(name)
      : canvas.getAttribute?.(name) != null;

  // Keyboard target without trapping (KD: autofocus off by default)
  if (!has("tabindex")) {
    canvas.setAttribute("tabindex", "0");
  }

  if (!canvas.getAttribute("role")) {
    canvas.setAttribute("role", "region");
  }

  if (!canvas.getAttribute("aria-roledescription")) {
    canvas.setAttribute("aria-roledescription", "slide deck");
  }

  if (!canvas.getAttribute("aria-label") && !canvas.getAttribute("aria-labelledby")) {
    canvas.setAttribute("aria-label", "Presentation");
  }

  if (options.ensureLive !== false) {
    ensureLiveRegion(canvas);
  }

  if (options.labelNav !== false) {
    labelNavControls(canvas);
  }

  const progress = canvas.querySelector("[data-hssf-progress], .hssf-progress");
  if (progress && typeof progress.setAttribute === "function") {
    const pHas =
      typeof progress.hasAttribute === "function"
        ? progress.hasAttribute("aria-hidden")
        : progress.getAttribute?.("aria-hidden") != null;
    if (!pHas) progress.setAttribute("aria-hidden", "true");
  }

  const bar = canvas.querySelector("[data-hssf-progress-bar]");
  if (bar && typeof bar.setAttribute === "function") {
    bar.setAttribute("role", "progressbar");
    const bHas = (n) =>
      typeof bar.hasAttribute === "function"
        ? bar.hasAttribute(n)
        : bar.getAttribute?.(n) != null;
    if (!bHas("aria-valuemin")) bar.setAttribute("aria-valuemin", "0");
    if (!bHas("aria-valuemax")) bar.setAttribute("aria-valuemax", "100");
  }
}

/**
 * @param {HTMLElement} canvas
 * @param {number} index 0-based
 * @param {number} total
 */
export function syncProgressA11y(canvas, index, total) {
  const bar = canvas?.querySelector?.("[data-hssf-progress-bar]");
  if (!bar || typeof bar.setAttribute !== "function") return;
  const pct = total <= 1 ? 0 : Math.round((index / (total - 1)) * 100);
  bar.setAttribute("aria-valuenow", String(pct));
  bar.setAttribute(
    "aria-valuetext",
    total > 0 ? `Slide ${index + 1} of ${total}` : "No slides",
  );
}

/**
 * @param {HTMLElement} canvas
 */
function ensureLiveRegion(canvas) {
  let live = canvas.querySelector("[data-hssf-live]");
  if (live) {
    if (!live.classList.contains("hssf-sr-only")) {
      live.classList.add("hssf-sr-only");
    }
    if (!live.classList.contains("hssf-live")) {
      live.classList.add("hssf-live");
    }
    if (!live.getAttribute("aria-live")) {
      live.setAttribute("aria-live", "polite");
    }
    if (!live.getAttribute("aria-atomic")) {
      live.setAttribute("aria-atomic", "true");
    }
    return live;
  }

  const doc = canvas.ownerDocument;
  live =
    typeof doc?.createElement === "function"
      ? doc.createElement("div")
      : null;
  if (!live || typeof live.setAttribute !== "function") return null;
  if (live.classList && typeof live.classList.add === "function") {
    live.classList.add("hssf-live");
    live.classList.add("hssf-sr-only");
  } else {
    live.className = "hssf-live hssf-sr-only";
  }
  live.setAttribute("data-hssf-live", "");
  live.setAttribute("aria-live", "polite");
  live.setAttribute("aria-atomic", "true");
  // Insert near top of canvas (before stage) if possible
  const wrap = canvas.querySelector(".hssf-stage-wrap");
  if (typeof canvas.insertBefore === "function") {
    if (wrap) {
      canvas.insertBefore(live, wrap);
    } else if (canvas.firstChild) {
      canvas.insertBefore(live, canvas.firstChild);
    } else if (typeof canvas.appendChild === "function") {
      canvas.appendChild(live);
    } else if (Array.isArray(canvas.children)) {
      canvas.children.unshift(live);
    }
  } else if (Array.isArray(canvas.children)) {
    canvas.children.unshift(live);
  }
  return live;
}

/**
 * @param {HTMLElement} canvas
 */
function labelNavControls(canvas) {
  const pairs = [
    ["[data-hssf-prev]", "Previous slide"],
    ["[data-hssf-next]", "Next slide"],
    ["[data-hssf-fullscreen]", "Toggle fullscreen"],
  ];
  for (const [sel, label] of pairs) {
    const el = canvas.querySelector(sel);
    if (el && !el.getAttribute("aria-label") && !el.getAttribute("aria-labelledby")) {
      el.setAttribute("aria-label", label);
    }
    if (el && el.tagName === "BUTTON" && !el.getAttribute("type")) {
      el.setAttribute("type", "button");
    }
  }

  const nav = canvas.querySelector("[data-hssf-nav], .hssf-nav");
  if (nav && !nav.getAttribute("aria-label")) {
    nav.setAttribute("aria-label", "Slide navigation");
  }

  const counter = canvas.querySelector("[data-hssf-counter]");
  if (counter && !counter.getAttribute("aria-live")) {
    // Counter is decorative if live region exists; keep polite optional
    counter.setAttribute("aria-hidden", "false");
  }
}
