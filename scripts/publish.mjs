/**
 * Publish hssf + create-hssf to npm (PR-14).
 *
 * Usage:
 *   pnpm build
 *   node scripts/publish.mjs
 *   node scripts/publish.mjs --otp 123456
 *   $env:NPM_OTP="123456"; node scripts/publish.mjs
 *
 * npm account must allow publish (2FA OTP or automation token).
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const argv = process.argv.slice(2);
let otp = process.env.NPM_OTP || process.env.npm_config_otp || "";
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === "--otp" && argv[i + 1]) {
    otp = argv[i + 1];
    i++;
  } else if (argv[i].startsWith("--otp=")) {
    otp = argv[i].slice("--otp=".length);
  }
}

function run(cmd, args, cwd = root) {
  console.log(`\n> ${cmd} ${args.join(" ")}  (cwd=${cwd})`);
  const r = spawnSync(cmd, args, {
    cwd,
    stdio: "inherit",
    shell: true,
    env: process.env,
  });
  if (r.status !== 0) {
    process.exit(r.status ?? 1);
  }
}

function mustExist(rel) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) {
    console.error(`[publish] missing ${rel} — run pnpm build`);
    process.exit(1);
  }
}

mustExist("packages/hssf/dist/hssf.min.js");
mustExist("packages/hssf/dist/hssf.min.css");
mustExist("packages/hssf/LICENSE");
mustExist("packages/create-hssf/LICENSE");
mustExist("packages/create-hssf/templates/default/index.html");

const who = spawnSync("npm", ["whoami"], { encoding: "utf8", shell: true });
if (who.status !== 0) {
  console.error(`
[publish] Not logged in to npm.

  npm login

Then:

  pnpm build
  node scripts/publish.mjs --otp <code-from-authenticator>
`);
  process.exit(1);
}
console.log(`[publish] npm user: ${who.stdout.trim()}`);
if (otp) {
  console.log("[publish] using OTP from --otp / NPM_OTP");
} else {
  console.log(
    "[publish] no OTP provided — if 2FA is enabled, pass --otp <code>",
  );
}

// Runtime first (hssf-slides), then CLI (create-hssf)
// Unscoped `hssf` is blocked by npm (name too similar to css/jss/xss/…)
// Use npm publish from package dirs; rewrite workspace:* before packing CLI

function publishNpm(dir) {
  const args = ["publish", "--access", "public"];
  if (otp) args.push("--otp", otp);
  run("npm", args, path.join(root, dir));
}

// Rewrite create-hssf dependency for registry (npm does not rewrite workspace:*)
const cliPkgPath = path.join(root, "packages/create-hssf/package.json");
const cliPkg = JSON.parse(fs.readFileSync(cliPkgPath, "utf8"));
const hssfPkg = JSON.parse(
  fs.readFileSync(path.join(root, "packages/hssf/package.json"), "utf8"),
);
const prevDep = cliPkg.dependencies?.["hssf-slides"];
cliPkg.dependencies = {
  ...(cliPkg.dependencies || {}),
  "hssf-slides": hssfPkg.version,
};
fs.writeFileSync(cliPkgPath, JSON.stringify(cliPkg, null, 2) + "\n");

try {
  publishNpm("packages/hssf");
  publishNpm("packages/create-hssf");
} finally {
  // restore workspace protocol for monorepo
  cliPkg.dependencies["hssf-slides"] = prevDep || "workspace:*";
  fs.writeFileSync(cliPkgPath, JSON.stringify(cliPkg, null, 2) + "\n");
}

console.log(`
[publish] Done.

Verify:
  npm view hssf-slides version
  npm view @dinhthanhnam/create-hssf version
  npx @dinhthanhnam/create-hssf@${hssfPkg.version} tmp-hssf-check

CDN (may take a minute):
  https://cdn.jsdelivr.net/npm/hssf-slides@${hssfPkg.version}/dist/hssf.min.css
  https://cdn.jsdelivr.net/npm/hssf-slides@${hssfPkg.version}/dist/hssf.min.js
`);
