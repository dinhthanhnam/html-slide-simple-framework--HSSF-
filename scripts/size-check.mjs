/**
 * Gzip size budgets (PR-09).
 *
 * Original design (pre-hljs) was CSS < 40KB / JS < 8KB gzip.
 * With highlight.js/lib/common + Atom One Dark (product decision):
 *
 *   hssf.min.css       ≤ 50 KB gzip
 *   hssf.min.js        ≤ 200 KB gzip  (IIFE + hljs common)
 *   hssf.esm.min.js    ≤ 200 KB gzip  (optional presence)
 *
 * Writes packages/hssf/dist/size-report.json for CI artifacts / debugging.
 */

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../packages/hssf/dist");

const BUDGETS = [
  { file: "hssf.min.css", maxGzip: 50 * 1024, required: true },
  { file: "hssf.min.js", maxGzip: 200 * 1024, required: true },
  { file: "hssf.esm.min.js", maxGzip: 200 * 1024, required: false },
];

function gzipSize(buf) {
  return zlib.gzipSync(buf, { level: 9 }).length;
}

let failed = false;
const report = {
  checkedAt: new Date().toISOString(),
  budgets: {},
  ok: true,
};

if (!fs.existsSync(distDir)) {
  console.error(`[size-check] dist missing: ${distDir} — run pnpm build first`);
  process.exit(1);
}

for (const { file, maxGzip, required } of BUDGETS) {
  const full = path.join(distDir, file);
  if (!fs.existsSync(full)) {
    if (required) {
      console.error(`[size-check] missing required ${file}`);
      failed = true;
      report.budgets[file] = { missing: true, ok: false };
    } else {
      console.log(`[size-check] SKIP optional ${file} (not built)`);
      report.budgets[file] = { missing: true, optional: true, ok: true };
    }
    continue;
  }
  const raw = fs.readFileSync(full);
  const gz = gzipSize(raw);
  const ok = gz <= maxGzip;
  const status = ok ? "OK" : "FAIL";
  console.log(
    `[size-check] ${status} ${file}: ${raw.length} raw / ${gz} gzip (budget ${maxGzip})`,
  );
  report.budgets[file] = {
    bytes: raw.length,
    gzip: gz,
    budgetGzip: maxGzip,
    ok,
  };
  if (!ok) failed = true;
}

report.ok = !failed;
fs.writeFileSync(
  path.join(distDir, "size-report.json"),
  JSON.stringify(report, null, 2) + "\n",
  "utf8",
);

if (failed) {
  console.error("[size-check] FAILED — see size-report.json");
  process.exit(1);
}
console.log("[size-check] all budgets OK");
