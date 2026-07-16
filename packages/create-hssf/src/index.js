/**
 * create-hssf — scaffold library entry.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { copyVendor } from "./copy-vendor.js";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = path.resolve(__dirname, "..");
const TEMPLATES = path.join(PKG_ROOT, "templates");

export const version = require("../package.json").version;

/**
 * @param {string} targetDir
 * @param {{
 *   local?: boolean,
 *   template?: 'default' | 'sample',
 *   title?: string,
 *   year?: number,
 *   force?: boolean,
 *   hssfVersion?: string,
 * }} [options]
 */
export async function scaffold(targetDir, options = {}) {
  const abs = path.resolve(targetDir);
  const template = options.template === "sample" ? "sample" : "default";
  const local = options.local === true;
  const force = options.force === true;
  const year = options.year ?? new Date().getFullYear();
  const title =
    options.title?.trim() ||
    (template === "sample"
      ? "Git Fundamentals cho Fresher"
      : "Session title");
  const hssfVersion = options.hssfVersion || version;

  const templateDir = path.join(TEMPLATES, template);
  if (!fs.existsSync(templateDir)) {
    throw new Error(`[create-hssf] Template not found: ${template}`);
  }

  if (fs.existsSync(abs)) {
    const entries = fs.readdirSync(abs).filter((n) => n !== ".git");
    if (entries.length > 0 && !force) {
      throw new Error(
        `[create-hssf] Directory not empty: ${abs}\n` +
          `  Use --force to scaffold into a non-empty directory.`,
      );
    }
  } else {
    fs.mkdirSync(abs, { recursive: true });
  }

  // Runtime package name on npm: hssf-slides (unscoped `hssf` rejected as too similar)
  const cssHref = local
    ? "./vendor/hssf.min.css"
    : `https://cdn.jsdelivr.net/npm/hssf-slides@${hssfVersion}/dist/hssf.min.css`;
  const jsSrc = local
    ? "./vendor/hssf.min.js"
    : `https://cdn.jsdelivr.net/npm/hssf-slides@${hssfVersion}/dist/hssf.min.js`;

  const vars = {
    HSSF_VERSION: String(hssfVersion),
    YEAR: String(year),
    TITLE: title,
    CSS_HREF: cssHref,
    JS_SRC: jsSrc,
    ASSET_MODE: local ? "local" : "cdn",
  };

  copyTemplateTree(templateDir, abs, vars);

  /** @type {string[]} */
  let vendorFiles = [];
  if (local) {
    const result = copyVendor(path.join(abs, "vendor"));
    vendorFiles = result.files;
  }

  return {
    target: abs,
    template,
    local,
    year,
    title,
    hssfVersion,
    vendorFiles,
    files: listRelativeFiles(abs),
  };
}

/**
 * @param {string} srcDir
 * @param {string} destDir
 * @param {Record<string, string>} vars
 */
function copyTemplateTree(srcDir, destDir, vars) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const name of fs.readdirSync(srcDir)) {
    if (name === ".gitkeep") {
      // keep empty dirs via placeholder only when no other files
      continue;
    }
    const from = path.join(srcDir, name);
    const to = path.join(destDir, name);
    const st = fs.statSync(from);
    if (st.isDirectory()) {
      copyTemplateTree(from, to, vars);
      continue;
    }
    let body = fs.readFileSync(from, "utf8");
    if (isTextFile(name)) {
      body = substitute(body, vars);
    }
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.writeFileSync(to, body, "utf8");
  }

  // ensure assets/images exists
  const imgDir = path.join(destDir, "assets", "images");
  fs.mkdirSync(imgDir, { recursive: true });
  const keep = path.join(imgDir, ".gitkeep");
  if (!fs.existsSync(keep) && fs.readdirSync(imgDir).length === 0) {
    fs.writeFileSync(keep, "", "utf8");
  }
}

/**
 * @param {string} text
 * @param {Record<string, string>} vars
 */
export function substitute(text, vars) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    key in vars ? vars[key] : `{{${key}}}`,
  );
}

function isTextFile(name) {
  return /\.(html?|css|md|txt|svg|json)$/i.test(name);
}

/**
 * @param {string} dir
 * @param {string} [base]
 * @returns {string[]}
 */
function listRelativeFiles(dir, base = dir) {
  /** @type {string[]} */
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) {
      out.push(...listRelativeFiles(full, base));
    } else {
      out.push(path.relative(base, full).split(path.sep).join("/"));
    }
  }
  return out.sort();
}
