/**
 * Copy hssf dist assets into a deck's vendor/ folder (--local).
 * Resolution uses createRequire (ESM packages).
 */

import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);

const VENDOR_FILES = ["hssf.min.css", "hssf.min.js"];

/**
 * Resolve the installed `hssf` package root directory.
 * @returns {string}
 */
// Unscoped `hssf` blocked by npm similarity rules; publish as `hssf-slides`
const HSSF_PKG = "hssf-slides";

export function resolveHssfRoot() {
  try {
    const pkgJson = require.resolve(`${HSSF_PKG}/package.json`);
    return path.dirname(pkgJson);
  } catch {
    // Fallback: resolve main entry and walk up for package.json
    try {
      let dir = path.dirname(require.resolve(HSSF_PKG));
      for (let i = 0; i < 6; i++) {
        const candidate = path.join(dir, "package.json");
        if (fs.existsSync(candidate)) {
          const name = JSON.parse(fs.readFileSync(candidate, "utf8")).name;
          if (name === HSSF_PKG || name === "hssf" || name === "@dinhthanhnam/hssf")
            return dir;
        }
        const parent = path.dirname(dir);
        if (parent === dir) break;
        dir = parent;
      }
    } catch {
      /* fall through */
    }
    throw new Error(
      `[create-hssf] Cannot resolve package \`${HSSF_PKG}\`. ` +
        "Ensure the dependency is installed (npx caches it automatically).",
    );
  }
}

/**
 * @param {string} destVendorDir
 * @returns {{ root: string, files: string[] }}
 */
export function copyVendor(destVendorDir) {
  const root = resolveHssfRoot();
  const dist = path.join(root, "dist");
  if (!fs.existsSync(dist)) {
    throw new Error(
      `[create-hssf] hssf dist missing at ${dist}. Run \`pnpm build\` in monorepo or install a published hssf that includes dist/.`,
    );
  }

  fs.mkdirSync(destVendorDir, { recursive: true });
  const copied = [];
  for (const file of VENDOR_FILES) {
    const src = path.join(dist, file);
    if (!fs.existsSync(src)) {
      throw new Error(`[create-hssf] Missing ${src}`);
    }
    const dest = path.join(destVendorDir, file);
    fs.copyFileSync(src, dest);
    copied.push(file);
  }
  return { root, files: copied };
}
