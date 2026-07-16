/**
 * PR-08 — teaching, visual, media class inventory.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cssDir = path.join(__dirname, "../src/css/components");
const distCss = path.join(__dirname, "../dist/hssf.css");

const teaching = fs.readFileSync(path.join(cssDir, "teaching.css"), "utf8");
const visual = fs.readFileSync(path.join(cssDir, "visual.css"), "utf8");
const media = fs.readFileSync(path.join(cssDir, "media.css"), "utf8");

const TEACHING = [
  ".hssf-steps",
  ".hssf-steps--vertical",
  ".hssf-steps--horizontal",
  ".hssf-steps__item",
  ".hssf-steps__num",
  ".hssf-steps__content",
  ".hssf-steps__title",
  ".hssf-steps__desc",
  ".hssf-timeline",
  ".hssf-timeline__item",
  ".hssf-timeline__dot",
  ".hssf-timeline__body",
  ".hssf-timeline__time",
  ".hssf-timeline__text",
  ".hssf-compare",
  ".hssf-compare__col",
  ".hssf-compare__col--cons",
  ".hssf-compare__col--pros",
  ".hssf-compare__title",
  ".hssf-agenda",
  ".hssf-agenda__item",
  ".hssf-agenda__num",
  ".hssf-agenda__text",
  ".hssf-defs",
  ".hssf-defs__row",
];

const VISUAL = [
  ".hssf-icon-circle",
  ".hssf-icon-circle--sm",
  ".hssf-icon-circle--md",
  ".hssf-icon-circle--lg",
  ".hssf-icon-circle--primary",
  ".hssf-icon-circle--soft",
  ".hssf-icon-label",
  ".hssf-icon-label__text",
  ".hssf-stat",
  ".hssf-stat__value",
  ".hssf-stat__label",
  ".hssf-accent",
  ".hssf-accent--bar-left",
  ".hssf-accent--blob",
  ".hssf-diagram",
  ".hssf-diagram__frame",
  ".hssf-diagram__node",
  ".hssf-diagram__arrow",
  ".hssf-diagram__caption",
];

const MEDIA = [
  ".hssf-figure",
  ".hssf-figure--border",
  ".hssf-figure--shadow",
  ".hssf-figure--contain",
  ".hssf-figure__img",
  ".hssf-figure__caption",
];

describe("teaching components (PR-08)", () => {
  it("defines all teaching classes", () => {
    for (const sel of TEACHING) {
      assert.ok(teaching.includes(sel), `missing ${sel}`);
    }
  });

  it("uses steps gap and timeline dot tokens", () => {
    assert.match(teaching, /--hssf-steps-gap/);
    assert.match(teaching, /--hssf-timeline-dot/);
    assert.match(teaching, /grid-template-columns:\s*1fr 1fr/);
  });
});

describe("visual components (PR-08)", () => {
  it("defines all visual classes", () => {
    for (const sel of VISUAL) {
      assert.ok(visual.includes(sel), `missing ${sel}`);
    }
  });

  it("icon sizes use design tokens", () => {
    assert.match(visual, /--hssf-icon-sm/);
    assert.match(visual, /--hssf-icon-md/);
    assert.match(visual, /--hssf-icon-lg/);
    assert.match(visual, /--hssf-diagram-node-min-w/);
  });
});

describe("media components (PR-08)", () => {
  it("defines all figure classes", () => {
    for (const sel of MEDIA) {
      assert.ok(media.includes(sel), `missing ${sel}`);
    }
  });

  it("caps figure height via token", () => {
    assert.match(media, /--hssf-figure-max-h/);
  });
});

describe("PR-08 dist bundle", () => {
  it("embeds teaching visual media when built", () => {
    if (!fs.existsSync(distCss)) return;
    const dist = fs.readFileSync(distCss, "utf8");
    assert.match(dist, /\.hssf-steps__num/);
    assert.match(dist, /\.hssf-timeline__dot/);
    assert.match(dist, /\.hssf-compare__col--pros/);
    assert.match(dist, /\.hssf-icon-circle--soft/);
    assert.match(dist, /\.hssf-diagram__node/);
    assert.match(dist, /\.hssf-figure__caption/);
  });
});
