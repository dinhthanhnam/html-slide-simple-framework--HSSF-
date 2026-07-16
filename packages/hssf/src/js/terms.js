/**
 * Glossary term clicks → modal (v0.2)
 *
 * Triggers: [data-hssf-term] (usually button.hssf-term)
 * Definition sources (priority):
 *   1. data-hssf-term-title + data-hssf-term-body on trigger
 *   2. [data-hssf-term-def="<id>"] matching data-hssf-term="<id>"
 *   3. Fallback: trigger text as title, empty body
 */

const ATTR_OPEN = "data-hssf-term-open";

/**
 * @param {HTMLElement} canvas
 * @param {{ enabled?: boolean }} [options]
 * @param {typeof globalThis} [win]
 */
function noopTerms() {
  return {
    open() {},
    close() {},
    isOpen() {
      return false;
    },
    destroy() {},
  };
}

export function attachTerms(canvas, options = {}, win = globalThis) {
  if (options.enabled === false || !canvas) {
    return noopTerms();
  }

  const doc = canvas.ownerDocument || win.document;
  // Unit mocks / non-DOM environments
  if (
    !doc ||
    typeof doc.createElement !== "function" ||
    typeof canvas.appendChild !== "function" ||
    typeof canvas.addEventListener !== "function"
  ) {
    return noopTerms();
  }

  /** @type {HTMLElement | null} */
  let lastFocus = null;
  /** @type {Array<() => void>} */
  const cleanups = [];

  const modal = ensureModal(canvas, doc);
  const bodyEl = modal.querySelector("[data-hssf-term-modal-body]");
  const titleEl = modal.querySelector("[data-hssf-term-modal-title]");
  const kickerEl = modal.querySelector("[data-hssf-term-modal-kicker]");
  const dialog = modal.querySelector("[data-hssf-term-modal-dialog]");
  const closeBtns = modal.querySelectorAll("[data-hssf-term-close]");

  function isOpen() {
    return canvas.getAttribute(ATTR_OPEN) === "true";
  }

  /**
   * @param {HTMLElement} trigger
   */
  function resolveContent(trigger) {
    const titleAttr = trigger.getAttribute("data-hssf-term-title");
    const bodyAttr = trigger.getAttribute("data-hssf-term-body");
    const id =
      trigger.getAttribute("data-hssf-term") ||
      trigger.getAttribute("data-hssf-term-id") ||
      "";

    if (titleAttr || bodyAttr) {
      return {
        title: titleAttr || (trigger.textContent || "").trim(),
        bodyHtml: bodyAttr ? escapeHtml(bodyAttr).replace(/\n/g, "<br />") : "",
        fromDom: false,
      };
    }

    if (id && id !== "true" && id !== "") {
      const def = canvas.querySelector(`[data-hssf-term-def="${cssEscape(id)}"]`);
      if (def) {
        const clone = /** @type {HTMLElement} */ (def.cloneNode(true));
        clone.removeAttribute("hidden");
        clone.hidden = false;
        clone.removeAttribute("data-hssf-term-def");
        // Prefer nested title if present
        const nestedTitle = clone.querySelector("[data-hssf-term-def-title]");
        let title = (trigger.textContent || "").trim();
        if (nestedTitle) {
          title = (nestedTitle.textContent || title).trim();
          nestedTitle.remove();
        }
        return { title, bodyHtml: clone.innerHTML, fromDom: true };
      }
    }

    return {
      title: (trigger.textContent || "").trim() || "Thuật ngữ",
      bodyHtml: "",
      fromDom: false,
    };
  }

  /**
   * @param {HTMLElement} trigger
   */
  function open(trigger) {
    if (!bodyEl || !dialog) return;
    lastFocus =
      /** @type {HTMLElement | null} */ (doc.activeElement) || trigger;

    const { title, bodyHtml } = resolveContent(trigger);
    if (titleEl) titleEl.textContent = title;
    if (kickerEl) kickerEl.textContent = "Thuật ngữ";
    bodyEl.innerHTML = bodyHtml || `<p>${escapeHtml("Chưa có định nghĩa.")}</p>`;

    modal.classList.add("is-open");
    modal.removeAttribute("hidden");
    modal.setAttribute("aria-hidden", "false");
    canvas.setAttribute(ATTR_OPEN, "true");
    dialog.setAttribute("aria-labelledby", titleEl ? titleEl.id : "");

    const closeBtn = modal.querySelector(
      ".hssf-term-modal__close",
    );
    if (closeBtn && typeof closeBtn.focus === "function") {
      try {
        closeBtn.focus();
      } catch {
        /* ignore */
      }
    }

    try {
      canvas.dispatchEvent(
        new win.CustomEvent("hssf:termopen", {
          bubbles: true,
          detail: { title, trigger },
        }),
      );
    } catch {
      /* non-DOM */
    }
  }

  function close() {
    if (!isOpen()) return;
    modal.classList.remove("is-open");
    modal.setAttribute("hidden", "");
    modal.setAttribute("aria-hidden", "true");
    canvas.removeAttribute(ATTR_OPEN);
    if (bodyEl) bodyEl.innerHTML = "";

    if (lastFocus && typeof lastFocus.focus === "function") {
      try {
        lastFocus.focus();
      } catch {
        /* ignore */
      }
    }
    lastFocus = null;

    try {
      canvas.dispatchEvent(
        new win.CustomEvent("hssf:termclose", { bubbles: true }),
      );
    } catch {
      /* non-DOM */
    }
  }

  function onCanvasClick(e) {
    const t = /** @type {Element | null} */ (e.target);
    if (!t || typeof t.closest !== "function") return;
    const trigger = t.closest("[data-hssf-term]");
    if (!trigger || !canvas.contains(trigger)) return;
    // Ignore if clicking inside modal body that happens to have data attr
    if (trigger.closest("[data-hssf-term-modal]")) return;
    e.preventDefault();
    e.stopPropagation();
    open(/** @type {HTMLElement} */ (trigger));
  }

  function onCloseClick(e) {
    e.preventDefault();
    e.stopPropagation();
    close();
  }

  function onKeyDown(e) {
    if (!isOpen()) return;
    if (e.key === "Escape" || e.key === "Esc") {
      e.preventDefault();
      e.stopPropagation();
      close();
    }
  }

  canvas.addEventListener("click", onCanvasClick);
  cleanups.push(() => canvas.removeEventListener("click", onCanvasClick));

  closeBtns.forEach((btn) => {
    btn.addEventListener("click", onCloseClick);
    cleanups.push(() => btn.removeEventListener("click", onCloseClick));
  });

  if (win.document) {
    win.document.addEventListener("keydown", onKeyDown, true);
    cleanups.push(() =>
      win.document.removeEventListener("keydown", onKeyDown, true),
    );
  }

  return {
    open,
    close,
    isOpen,
    destroy() {
      close();
      cleanups.forEach((fn) => fn());
      cleanups.length = 0;
    },
  };
}

/**
 * @param {HTMLElement} canvas
 * @param {Document} doc
 */
function ensureModal(canvas, doc) {
  let modal = canvas.querySelector("[data-hssf-term-modal]");
  if (modal) return /** @type {HTMLElement} */ (modal);

  modal = doc.createElement("div");
  modal.className = "hssf-term-modal";
  modal.setAttribute("data-hssf-term-modal", "");
  modal.setAttribute("hidden", "");
  modal.setAttribute("aria-hidden", "true");

  const backdrop = doc.createElement("button");
  backdrop.type = "button";
  backdrop.className = "hssf-term-modal__backdrop";
  backdrop.setAttribute("data-hssf-term-close", "");
  backdrop.setAttribute("aria-label", "Đóng");

  const dialog = doc.createElement("div");
  dialog.className = "hssf-term-modal__dialog";
  dialog.setAttribute("data-hssf-term-modal-dialog", "");
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");

  const closeBtn = doc.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "hssf-term-modal__close";
  closeBtn.setAttribute("data-hssf-term-close", "");
  closeBtn.setAttribute("aria-label", "Đóng");
  closeBtn.textContent = "×";

  const kicker = doc.createElement("p");
  kicker.className = "hssf-term-modal__kicker";
  kicker.setAttribute("data-hssf-term-modal-kicker", "");
  kicker.textContent = "Thuật ngữ";

  const title = doc.createElement("h2");
  title.className = "hssf-term-modal__title";
  title.setAttribute("data-hssf-term-modal-title", "");
  title.id = "hssf-term-modal-title";

  const body = doc.createElement("div");
  body.className = "hssf-term-modal__body";
  body.setAttribute("data-hssf-term-modal-body", "");

  dialog.appendChild(closeBtn);
  dialog.appendChild(kicker);
  dialog.appendChild(title);
  dialog.appendChild(body);
  modal.appendChild(backdrop);
  modal.appendChild(dialog);
  canvas.appendChild(modal);
  return modal;
}

/** @param {string} s */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Minimal CSS.escape polyfill for attribute selectors */
function cssEscape(value) {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(value);
  }
  return String(value).replace(/["\\]/g, "\\$&");
}
