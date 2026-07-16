/**
 * Bump both packages to the same version (stub for PR-14).
 * Usage: node scripts/release.mjs 0.1.0
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const version = process.argv[2];

if (!version || !/^\d+\.\d+\.\d+/.test(version)) {
  console.error("Usage: node scripts/release.mjs <semver>");
  process.exit(1);
}

const packages = [
  path.join(root, "package.json"),
  path.join(root, "packages", "hssf", "package.json"),
  path.join(root, "packages", "create-hssf", "package.json"),
];

for (const pkgPath of packages) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  pkg.version = version;
  if (pkg.name === "create-hssf" && pkg.dependencies?.hssf) {
    // Published dep pin; monorepo still uses workspace protocol until publish
    if (pkg.dependencies.hssf.startsWith("workspace:")) {
      // leave workspace protocol in monorepo
    } else {
      pkg.dependencies.hssf = version;
    }
  }
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log(`[release] ${pkg.name ?? "root"} → ${version}`);
}

console.log(
  "[release] Remember to update packages/hssf/src/js/index.js version constant and rebuild.",
);
