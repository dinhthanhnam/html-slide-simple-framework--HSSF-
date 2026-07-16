/**
 * Syntax highlighting via highlight.js + Atom One Dark theme (CSS bundled separately).
 * Uses highlight.js/lib/common language set (good default for training decks).
 */

import hljs from "highlight.js/lib/common";

/**
 * Highlight all code blocks under root.
 * Markup: <pre><code class="language-java">…</code></pre>
 * or class="language-dockerfile", language-bash, language-yaml, etc.
 *
 * @param {ParentNode | null} root
 * @param {{ highlight?: boolean }} [options]
 * @returns {number} number of elements highlighted
 */
export function highlightCode(root, options = {}) {
  if (options.highlight === false) return 0;
  if (root == null || typeof root.querySelectorAll !== "function") return 0;

  const nodes = root.querySelectorAll("pre code, .hssf-code code");
  let count = 0;
  for (const el of nodes) {
    // highlight.js 11 sets data-highlighted after processing
    if (el.dataset.highlighted === "yes") continue;
    try {
      hljs.highlightElement(/** @type {HTMLElement} */ (el));
      count += 1;
    } catch (err) {
      if (typeof console !== "undefined") {
        console.warn("[hssf] highlight failed on element", err);
      }
    }
  }
  return count;
}

export { hljs };
