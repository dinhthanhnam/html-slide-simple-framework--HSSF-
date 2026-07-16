/**
 * Hash deep-link helpers (PR-04).
 *
 * Canonical write: `#<1-based-index>` e.g. `#3`
 * Accept read: `#3`, `#slide-3`, `#slide=3`
 * Empty / invalid → clamp to [1, n] (empty → 1)
 */

/**
 * Parse location hash into 1-based slide index, or null if empty/unrecognized.
 * @param {string} hash - e.g. "#3", "#slide-3", "slide=3", ""
 * @returns {number | null} 1-based index, or null if empty
 */
export function parseHash(hash) {
  if (hash == null) return null;
  let raw = String(hash).trim();
  if (raw.startsWith("#")) raw = raw.slice(1);
  raw = raw.trim();
  if (!raw) return null;

  // #3
  if (/^\d+$/.test(raw)) {
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : null;
  }

  // #slide-3 or #slide=3
  const m = raw.match(/^slide[-_=](\d+)$/i);
  if (m) {
    const n = parseInt(m[1], 10);
    return Number.isFinite(n) ? n : null;
  }

  return null;
}

/**
 * Clamp 1-based index into [1, n]. Empty/null → 1 when n >= 1.
 * @param {number | null} oneBased
 * @param {number} slideCount
 * @returns {number} 0-based index
 */
export function clampSlideIndex(oneBased, slideCount) {
  const n = Math.max(0, slideCount | 0);
  if (n === 0) return 0;
  if (oneBased == null || !Number.isFinite(oneBased)) return 0;
  const clamped = Math.min(n, Math.max(1, Math.floor(oneBased)));
  return clamped - 1;
}

/**
 * Canonical hash string for 0-based index.
 * @param {number} zeroBased
 * @returns {string} e.g. "#2"
 */
export function formatHash(zeroBased) {
  const i = Math.max(0, Math.floor(zeroBased));
  return `#${i + 1}`;
}

/**
 * Read hash from window and return 0-based index (clamped).
 * @param {number} slideCount
 * @param {Pick<Location, 'hash'>} [loc]
 * @returns {number} 0-based
 */
export function indexFromLocation(slideCount, loc = globalThis.location) {
  const oneBased = parseHash(loc?.hash ?? "");
  return clampSlideIndex(oneBased, slideCount);
}

/**
 * Write canonical hash without scrolling (history.replaceState when available).
 * @param {number} zeroBased
 * @param {{ replace?: boolean, win?: Window }} [opts]
 */
export function writeHash(zeroBased, opts = {}) {
  const win = opts.win || globalThis;
  const next = formatHash(zeroBased);
  try {
    const url = new URL(win.location.href);
    if (url.hash === next) return;
    url.hash = next;
    if (opts.replace !== false && win.history?.replaceState) {
      win.history.replaceState(null, "", url.pathname + url.search + next);
    } else if (win.location) {
      win.location.hash = next;
    }
  } catch {
    try {
      if (win.location) win.location.hash = next;
    } catch {
      /* ignore */
    }
  }
}
