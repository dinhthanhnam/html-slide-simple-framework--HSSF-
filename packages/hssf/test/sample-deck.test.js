/**
 * PR-10 — sample deck acceptance (coverage + labels + fragments).
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sampleHtml = path.resolve(
  __dirname,
  "../../../examples/sample-deck/index.html",
);
const branchSvg = path.resolve(
  __dirname,
  "../../../examples/sample-deck/assets/images/branch-flow.svg",
);

const LABELS = [
  "Title",
  "Agenda",
  "Sec-Why",
  "Pain",
  "VCS",
  "Sec-Install",
  "Install-Steps",
  "Sec-Lifecycle",
  "Timeline",
  "Commands",
  "Sec-Branch",
  "Branch-Types",
  "Branch-Steps",
  "Danger",
  "Lab",
  "Messages",
  "Summary",
  "End",
];

const GREP_CLASSES = [
  "hssf-title-block",
  "hssf-section-block",
  "hssf-brand-end",
  "hssf-header",
  "hssf-heading",
  "hssf-agenda",
  "hssf-columns",
  "hssf-grid",
  "hssf-card",
  "hssf-list",
  "hssf-callout",
  "hssf-quote",
  "hssf-table",
  "hssf-code",
  "language-",
  "hssf-steps",
  "hssf-timeline",
  "hssf-compare",
  "hssf-defs",
  "hssf-icon-circle",
  "hssf-icon-label",
  "hssf-stat",
  "hssf-accent",
  "hssf-diagram",
  "hssf-flow",
  "hssf-arrow",
  "hssf-term",
  "hssf-fx--",
  "hssf-figure",
  "hssf-footer",
  "data-hssf-fragment",
];

describe("sample deck Git Fundamentals (PR-10)", () => {
  const html = fs.readFileSync(sampleHtml, "utf8");

  it("has exactly 18 data-hssf-slide sections", () => {
    const slides = html.match(/data-hssf-slide/g) || [];
    assert.equal(slides.length, 18);
  });

  it("includes all frozen data-hssf-label values", () => {
    for (const label of LABELS) {
      assert.ok(
        html.includes(`data-hssf-label="${label}"`),
        `missing label ${label}`,
      );
    }
  });

  it("satisfies component coverage grep list", () => {
    for (const token of GREP_CLASSES) {
      assert.ok(html.includes(token), `coverage missing: ${token}`);
    }
  });

  it("has fragments on Install-Steps, Timeline, Branch-Steps slides", () => {
    // crude but effective: those labels appear before multiple fragment attrs nearby
    const need = ["Install-Steps", "Timeline", "Branch-Steps"];
    for (const label of need) {
      const idx = html.indexOf(`data-hssf-label="${label}"`);
      assert.ok(idx >= 0, label);
      const slice = html.slice(idx, idx + 2500);
      assert.ok(
        (slice.match(/data-hssf-fragment/g) || []).length >= 2,
        `${label} should include ≥2 fragments`,
      );
    }
  });

  it("links workspace dist CSS/JS", () => {
    assert.match(html, /packages\/hssf\/dist\/hssf\.css/);
    assert.match(html, /packages\/hssf\/dist\/hssf\.js/);
  });

  it("ships branch-flow.svg for Lab figure", () => {
    assert.ok(fs.existsSync(branchSvg));
    const svg = fs.readFileSync(branchSvg, "utf8");
    assert.match(svg, /<svg/);
    assert.match(html, /branch-flow\.svg/);
    assert.match(html, /hssf-figure__img/);
  });

  it("uses Rikkei footer copyright string", () => {
    // HTML may wrap "All rights reserved" across lines
    assert.match(html, /By Rikkei Academy - Rikkei Education/);
    assert.match(html, /All rights\s+reserved/);
  });
});
