/**
 * PR-03 — scale model unit tests (pure math + transform string).
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  computeScale,
  fitStage,
  readLogicalSize,
} from "../src/js/scale.js";
import { ensureActiveSlide, updateChrome } from "../src/js/shell.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const chromeCss = path.join(__dirname, "../src/css/chrome.css");
const distCss = path.join(__dirname, "../dist/hssf.css");

describe("hssf scale (PR-03)", () => {
  it("computeScale fits letterbox (1280×720 into wrap smaller)", () => {
    // wrap 1280×600 → limited by height: 600/1080
    const s = computeScale(1280, 600, 1920, 1080);
    assert.ok(Math.abs(s - 600 / 1080) < 1e-9);
  });

  it("computeScale fits pillarbox", () => {
    // wrap 800×1080 → limited by width
    const s = computeScale(800, 1080, 1920, 1080);
    assert.ok(Math.abs(s - 800 / 1920) < 1e-9);
  });

  it("computeScale is 1 when wrap equals logical", () => {
    assert.equal(computeScale(1920, 1080, 1920, 1080), 1);
  });

  it("computeScale guards invalid sizes", () => {
    assert.equal(computeScale(0, 100, 1920, 1080), 1);
    assert.equal(computeScale(100, 100, 0, 1080), 1);
  });

  it("fitStage sets translate(-50%,-50%) scale(s) on mock DOM", () => {
    const stageStyle = { transform: "" };
    const stage = {
      style: stageStyle,
      dataset: {},
      parentElement: null,
    };
    const wrap = {
      clientWidth: 960,
      clientHeight: 540,
    };
    stage.parentElement = wrap;

    const canvas = {
      dataset: {},
      querySelector(sel) {
        if (sel === "[data-hssf-stage]" || sel === ".hssf-stage") return stage;
        if (sel === ".hssf-stage-wrap") return wrap;
        return null;
      },
    };

    // Mock getComputedStyle for readLogicalSize
    const fakeWin = {
      document: { documentElement: {} },
      getComputedStyle() {
        return {
          getPropertyValue(name) {
            if (name === "--hssf-slide-w") return "1920px";
            if (name === "--hssf-slide-h") return "1080px";
            if (name === "width") return "1920px";
            if (name === "height") return "1080px";
            return "";
          },
        };
      },
    };

    const s = fitStage(/** @type {any} */ (canvas), fakeWin);
    assert.equal(s, 0.5);
    assert.equal(stageStyle.transform, "translate(-50%, -50%) scale(0.5)");
    assert.equal(stage.dataset.hssfScale, "0.5");
    assert.equal(canvas.dataset.hssfScale, "0.5");
  });

  it("readLogicalSize falls back to 1920×1080", () => {
    const fakeWin = {
      document: { documentElement: {} },
      getComputedStyle() {
        throw new Error("no css");
      },
    };
    const { logicalW, logicalH } = readLogicalSize(null, fakeWin);
    assert.equal(logicalW, 1920);
    assert.equal(logicalH, 1080);
  });

  it("ensureActiveSlide activates first when none active", () => {
    const slides = [
      {
        classList: {
          _on: false,
          contains(c) {
            return c === "is-active" && this._on;
          },
          toggle(c, on) {
            if (c === "is-active") this._on = on;
          },
        },
        setAttribute() {},
      },
      {
        classList: {
          _on: false,
          contains() {
            return false;
          },
          toggle(c, on) {
            if (c === "is-active") this._on = on;
          },
        },
        setAttribute() {},
      },
    ];
    const canvas = {
      querySelectorAll() {
        return slides;
      },
    };
    const i = ensureActiveSlide(/** @type {any} */ (canvas));
    assert.equal(i, 0);
    assert.equal(slides[0].classList._on, true);
    assert.equal(slides[1].classList._on, false);
  });

  it("updateChrome sets progress journey fraction", () => {
    const bar = { style: { width: "" } };
    const counter = { textContent: "" };
    const pages = [{ textContent: "" }, { textContent: "" }, { textContent: "" }];
    const slides = pages.map((p, idx) => ({
      classList: {
        contains(c) {
          return c === "is-active" && idx === 1;
        },
      },
      querySelectorAll(sel) {
        return sel === "[data-hssf-page]" ? [p] : [];
      },
      getAttribute() {
        return null;
      },
    }));
    const canvas = {
      querySelectorAll() {
        return slides;
      },
      querySelector(sel) {
        if (sel === "[data-hssf-progress-bar]") return bar;
        if (sel === "[data-hssf-counter]") return counter;
        if (sel === "[data-hssf-live]") return null;
        return null;
      },
    };
    updateChrome(/** @type {any} */ (canvas), 1);
    // i=1, n=3 → 1/2 = 50%
    assert.equal(bar.style.width, "50%");
    assert.equal(counter.textContent, "2 / 3");
    assert.equal(pages[0].textContent, "1");
    assert.equal(pages[2].textContent, "3");
  });

  it("chrome.css forbids zoom and keeps stage absolute", () => {
    const css = fs.readFileSync(chromeCss, "utf8");
    assert.match(css, /\.hssf-stage\s*\{/);
    assert.match(css, /position:\s*absolute/);
    assert.match(css, /translate\(-50%,\s*-50%\)/);
    assert.equal(/\bzoom\s*:/.test(css), false);
    assert.match(css, /\.hssf-stage-wrap/);
    assert.match(css, /min-width:\s*0/);
    assert.match(css, /min-height:\s*0/);
  });

  it("built CSS includes chrome when dist exists", () => {
    if (!fs.existsSync(distCss)) return;
    const css = fs.readFileSync(distCss, "utf8");
    assert.match(css, /\.hssf-stage-wrap/);
    assert.match(css, /\.hssf-nav/);
    assert.match(css, /\.hssf-progress/);
  });
});
