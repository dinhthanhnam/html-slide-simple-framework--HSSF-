/**
 * PR-12 — monorepo agent docs tree present.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../..");

const REQUIRED = [
  "AGENTS.md",
  "docs/README.md",
  "docs/quickstart.md",
  "docs/design-tokens.md",
  "docs/chrome.md",
  "docs/writing-a-deck.md",
  "docs/sample-scenario.md",
  "docs/anti-patterns.md",
  "docs/agent-checklist.md",
  "docs/sri.md",
  "docs/qa.md",
  "docs/components/README.md",
  "docs/components/layout.md",
  "docs/components/content.md",
  "docs/components/teaching.md",
  "docs/components/visual.md",
  "docs/components/media.md",
  "docs/components/fragments.md",
  "packages/create-hssf/templates/default/AGENTS.md",
  "packages/create-hssf/templates/sample/AGENTS.md",
];

describe("agent documentation tree (PR-12)", () => {
  it("ships all required doc files", () => {
    for (const rel of REQUIRED) {
      const full = path.join(root, rel);
      assert.ok(fs.existsSync(full), `missing ${rel}`);
      const st = fs.statSync(full);
      assert.ok(st.size > 80, `${rel} looks empty`);
    }
  });

  it("docs index links quickstart and checklist", () => {
    const index = fs.readFileSync(path.join(root, "docs/README.md"), "utf8");
    assert.match(index, /quickstart\.md/);
    assert.match(index, /agent-checklist\.md/);
    assert.match(index, /writing-a-deck\.md/);
  });

  it("root AGENTS.md points at docs and DESIGN", () => {
    const agents = fs.readFileSync(path.join(root, "AGENTS.md"), "utf8");
    assert.match(agents, /docs\/README\.md/);
    assert.match(agents, /DESIGN\.md/);
    assert.match(agents, /pnpm build/);
  });

  it("scaffold AGENTS.md remains self-contained (snippets + rules)", () => {
    const ag = fs.readFileSync(
      path.join(root, "packages/create-hssf/templates/default/AGENTS.md"),
      "utf8",
    );
    assert.match(ag, /Allowlist/);
    assert.match(ag, /Snippets/);
    assert.match(ag, /data-hssf-fragment/);
    assert.match(ag, /hssf-title-block/);
    assert.match(ag, /npx serve/);
  });
});
