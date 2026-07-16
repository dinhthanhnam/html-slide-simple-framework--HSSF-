#!/usr/bin/env node
/**
 * create-hssf — scaffold CLI (PR-11)
 */

import { createRequire } from "node:module";
import path from "node:path";
import { scaffold } from "../src/index.js";
import { helpText, parseArgs } from "../src/parse-args.js";

const require = createRequire(import.meta.url);
const pkg = require("../package.json");

const args = parseArgs(process.argv.slice(2));

if (args.version) {
  console.log(`create-hssf v${pkg.version}`);
  process.exit(0);
}

if (args.help) {
  console.log(helpText(pkg.version));
  process.exit(0);
}

if (args.unknown.length) {
  console.error(`[create-hssf] Unknown option(s): ${args.unknown.join(", ")}`);
  console.error(helpText(pkg.version));
  process.exit(1);
}

if (!args.target) {
  console.error("[create-hssf] Missing <directory>\n");
  console.error(helpText(pkg.version));
  process.exit(1);
}

try {
  const result = await scaffold(args.target, {
    local: args.local,
    template: args.template,
    title: args.title ?? undefined,
    year: args.year,
    force: args.force,
    hssfVersion: pkg.version,
  });

  console.log(`[create-hssf] Created deck in ${result.target}`);
  console.log(`  template: ${result.template}`);
  console.log(`  assets:   ${result.local ? "local vendor/" : "CDN jsDelivr"}`);
  console.log(`  hssf:     @${result.hssfVersion}`);
  console.log(`  year:     ${result.year}`);
  if (result.vendorFiles.length) {
    console.log(`  vendor:   ${result.vendorFiles.join(", ")}`);
  }

  const cd =
    path.resolve(result.target) === path.resolve(process.cwd())
      ? "."
      : args.target;

  console.log(`
Next:
  cd ${cd}
  npx serve .
  # open the URL printed by serve — do not use file://
`);
  process.exit(0);
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(msg);
  process.exit(1);
}
