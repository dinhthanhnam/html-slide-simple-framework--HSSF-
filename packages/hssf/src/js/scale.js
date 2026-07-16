/**
 * Canvas scale model (PR-03).
 * Stage is position:absolute at 50%/50%; JS sets:
 *   transform: translate(-50%, -50%) scale(s)
 * where s = min(wrapW / logicalW, wrapH / logicalH).
 *
 * Forbidden: CSS zoom; stage in normal flex flow at 1920×1080.
 */

/**
 * Read logical slide size from CSS variables (not hard-coded only).
 * @param {Element | null} stage
 * @param {typeof globalThis} [win]
 * @returns {{ logicalW: number, logicalH: number }}
 */
export function readLogicalSize(stage, win = globalThis) {
  const doc = win.document;
  let w = 1920;
  let h = 1080;

  try {
    const rootCs = win.getComputedStyle(doc.documentElement);
    const stageCs = stage ? win.getComputedStyle(stage) : null;

    const parse = (cs, name, fallback) => {
      if (!cs) return fallback;
      const raw = cs.getPropertyValue(name).trim();
      const n = parseFloat(raw);
      return Number.isFinite(n) && n > 0 ? n : fallback;
    };

    w = parse(stageCs, "--hssf-slide-w", parse(rootCs, "--hssf-slide-w", w));
    h = parse(stageCs, "--hssf-slide-h", parse(rootCs, "--hssf-slide-h", h));

    // Fallback to computed width/height if vars missing (px)
    if (stageCs && (w === 1920 || h === 1080)) {
      const cw = parseFloat(stageCs.width);
      const ch = parseFloat(stageCs.height);
      if (Number.isFinite(cw) && cw > 0) w = cw;
      if (Number.isFinite(ch) && ch > 0) h = ch;
    }
  } catch {
    // jsdom / missing getComputedStyle
  }

  return { logicalW: w, logicalH: h };
}

/**
 * Compute uniform scale factor to fit logical stage into wrap box.
 * @param {number} wrapW
 * @param {number} wrapH
 * @param {number} logicalW
 * @param {number} logicalH
 * @returns {number}
 */
export function computeScale(wrapW, wrapH, logicalW, logicalH) {
  if (
    !Number.isFinite(wrapW) ||
    !Number.isFinite(wrapH) ||
    !Number.isFinite(logicalW) ||
    !Number.isFinite(logicalH) ||
    wrapW <= 0 ||
    wrapH <= 0 ||
    logicalW <= 0 ||
    logicalH <= 0
  ) {
    return 1;
  }
  return Math.min(wrapW / logicalW, wrapH / logicalH);
}

/**
 * Apply transform on stage from current wrap metrics.
 * @param {HTMLElement} canvas
 * @param {typeof globalThis} [win]
 * @returns {number} scale factor applied
 */
export function fitStage(canvas, win = globalThis) {
  if (!canvas || typeof canvas.querySelector !== "function") return 1;

  const stage =
    canvas.querySelector("[data-hssf-stage]") ||
    canvas.querySelector(".hssf-stage");
  if (!stage) return 1;

  const wrap =
    canvas.querySelector(".hssf-stage-wrap") ||
    /** @type {HTMLElement} */ (stage.parentElement);

  if (!wrap) return 1;

  const { logicalW, logicalH } = readLogicalSize(stage, win);
  const wrapW = wrap.clientWidth || 0;
  const wrapH = wrap.clientHeight || 0;

  // Zero-size wrap (hidden tab / pre-layout): keep previous or scale 1
  if (wrapW < 1 || wrapH < 1) {
    return 1;
  }

  const s = computeScale(wrapW, wrapH, logicalW, logicalH);
  stage.style.transform = `translate(-50%, -50%) scale(${s})`;
  stage.dataset.hssfScale = String(s);
  canvas.dataset.hssfScale = String(s);
  return s;
}

/**
 * Attach ResizeObserver + window listeners; returns disposer.
 * @param {HTMLElement} canvas
 * @param {{ onFit?: (s: number) => void }} [options]
 * @param {typeof globalThis} [win]
 * @returns {{ fit: () => number, destroy: () => void }}
 */
export function attachScale(canvas, options = {}, win = globalThis) {
  const fit = () => {
    const s = fitStage(canvas, win);
    if (typeof options.onFit === "function") options.onFit(s);
    return s;
  };

  /** @type {ResizeObserver | null} */
  let ro = null;
  const wrap = canvas.querySelector(".hssf-stage-wrap");

  if (typeof win.ResizeObserver === "function") {
    ro = new win.ResizeObserver(() => {
      fit();
    });
    ro.observe(canvas);
    if (wrap) ro.observe(wrap);
  }

  const onResize = () => fit();
  const onFs = () => {
    // layout settles after fullscreen transition
    fit();
    win.setTimeout(fit, 50);
    win.setTimeout(fit, 200);
  };

  win.addEventListener("resize", onResize);
  win.addEventListener("fullscreenchange", onFs);
  win.addEventListener("orientationchange", onResize);

  // Initial fit (double rAF for layout readiness)
  if (typeof win.requestAnimationFrame === "function") {
    win.requestAnimationFrame(() => {
      fit();
      win.requestAnimationFrame(fit);
    });
  } else {
    fit();
  }

  return {
    fit,
    destroy() {
      if (ro) ro.disconnect();
      win.removeEventListener("resize", onResize);
      win.removeEventListener("fullscreenchange", onFs);
      win.removeEventListener("orientationchange", onResize);
    },
  };
}
