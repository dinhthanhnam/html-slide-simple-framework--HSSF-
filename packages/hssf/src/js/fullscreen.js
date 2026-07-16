/**
 * Fullscreen helpers (PR-04) — target the canvas element.
 */

/**
 * @param {Element | null} el
 * @returns {boolean}
 */
export function isFullscreen(el) {
  if (typeof document === "undefined") return false;
  const fs =
    document.fullscreenElement ||
    // @ts-ignore webkit
    document.webkitFullscreenElement ||
    null;
  if (!el) return !!fs;
  return fs === el;
}

/**
 * Request fullscreen on element.
 * @param {HTMLElement} el
 * @returns {Promise<void>}
 */
export async function requestFullscreen(el) {
  if (!el) return;
  const req =
    el.requestFullscreen ||
    // @ts-ignore
    el.webkitRequestFullscreen ||
    // @ts-ignore
    el.msRequestFullscreen;
  if (typeof req === "function") {
    try {
      await req.call(el);
    } catch {
      /* user gesture / policy */
    }
  }
}

/**
 * Exit fullscreen.
 * @returns {Promise<void>}
 */
export async function exitFullscreen() {
  if (typeof document === "undefined") return;
  const exit =
    document.exitFullscreen ||
    // @ts-ignore
    document.webkitExitFullscreen ||
    // @ts-ignore
    document.msExitFullscreen;
  if (typeof exit === "function" && isFullscreen()) {
    try {
      await exit.call(document);
    } catch {
      /* ignore */
    }
  }
}

/**
 * Toggle fullscreen for canvas.
 * @param {HTMLElement} el
 * @returns {Promise<boolean>} true if now fullscreen
 */
export async function toggleFullscreen(el) {
  if (isFullscreen(el)) {
    await exitFullscreen();
    return false;
  }
  await requestFullscreen(el);
  return isFullscreen(el);
}
