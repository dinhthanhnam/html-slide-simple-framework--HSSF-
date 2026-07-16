/**
 * PR-11 — create-hssf scaffold tests
 */

import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { parseArgs, helpText } from "../src/parse-args.js";
import { scaffold, substitute, version } from "../src/index.js";
import { resolveHssfRoot } from "../src/copy-vendor.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("parseArgs", () => {
  it("parses directory and flags", () => {
    const a = parseArgs([
      "my-deck",
      "--local",
      "--template",
      "sample",
      "--title",
      "Hello",
      "--year",
      "2025",
    ]);
    assert.equal(a.target, "my-deck");
    assert.equal(a.local, true);
    assert.equal(a.template, "sample");
    assert.equal(a.title, "Hello");
    assert.equal(a.year, 2025);
  });

  it("--no-sample forces default template", () => {
    const a = parseArgs(["x", "--sample", "--no-sample"]);
    assert.equal(a.template, "default");
  });

  it("helpText includes usage", () => {
    assert.match(helpText("0.1.0"), /create-hssf/);
    assert.match(helpText("0.1.0"), /--local/);
  });
});

describe("substitute", () => {
  it("replaces mustache keys", () => {
    assert.equal(
      substitute("v{{HSSF_VERSION}} y{{YEAR}}", {
        HSSF_VERSION: "0.1.0",
        YEAR: "2026",
      }),
      "v0.1.0 y2026",
    );
  });
});

describe("scaffold", () => {
  /** @type {string} */
  let tmp;

  before(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "create-hssf-"));
  });

  after(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it("exports version string", () => {
    assert.match(version, /^\d+\.\d+\.\d+/);
  });

  it("scaffolds default CDN deck", async () => {
    const dir = path.join(tmp, "cdn-deck");
    const result = await scaffold(dir, {
      template: "default",
      title: "Test Deck",
      year: 2026,
      local: false,
    });
    assert.equal(result.template, "default");
    assert.ok(fs.existsSync(path.join(dir, "index.html")));
    assert.ok(fs.existsSync(path.join(dir, "AGENTS.md")));
    assert.ok(fs.existsSync(path.join(dir, "README.md")));
    assert.ok(fs.existsSync(path.join(dir, "styles", "deck.css")));
    const html = fs.readFileSync(path.join(dir, "index.html"), "utf8");
    assert.match(html, /cdn\.jsdelivr\.net\/npm\/hssf-slides@/);
    assert.match(html, /Test Deck/);
    assert.match(html, /© 2026 By Rikkei Academy/);
    assert.ok(!fs.existsSync(path.join(dir, "vendor")));
  });

  it("scaffolds sample template", async () => {
    const dir = path.join(tmp, "sample-deck");
    await scaffold(dir, { template: "sample", force: true });
    const html = fs.readFileSync(path.join(dir, "index.html"), "utf8");
    assert.match(html, /data-hssf-label="Agenda"/);
    assert.match(html, /hssf-compare/);
    assert.match(html, /hssf-steps/);
  });

  it("scaffolds --local with vendor copy when dist exists", async () => {
    let root;
    try {
      root = resolveHssfRoot();
    } catch {
      return; // skip if hssf not linked
    }
    const distJs = path.join(root, "dist", "hssf.min.js");
    if (!fs.existsSync(distJs)) {
      return; // skip until build
    }
    const dir = path.join(tmp, "local-deck");
    const result = await scaffold(dir, { local: true, force: true });
    assert.equal(result.local, true);
    assert.ok(fs.existsSync(path.join(dir, "vendor", "hssf.min.css")));
    assert.ok(fs.existsSync(path.join(dir, "vendor", "hssf.min.js")));
    const html = fs.readFileSync(path.join(dir, "index.html"), "utf8");
    assert.match(html, /\.\/vendor\/hssf\.min\.css/);
    assert.match(html, /\.\/vendor\/hssf\.min\.js/);
  });

  it("refuses non-empty directory without --force", async () => {
    const dir = path.join(tmp, "nonempty");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "keep.txt"), "x");
    await assert.rejects(
      () => scaffold(dir, { force: false }),
      /not empty/i,
    );
  });
});
