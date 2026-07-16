/**
 * Parse create-hssf CLI argv (no external deps).
 */

/**
 * @param {string[]} argv - process.argv.slice(2)
 */
export function parseArgs(argv) {
  /** @type {{
   *   help: boolean,
   *   version: boolean,
   *   local: boolean,
   *   force: boolean,
   *   template: 'default' | 'sample',
   *   title: string | null,
   *   year: number,
   *   target: string | null,
   *   unknown: string[],
   * }} */
  const out = {
    help: false,
    version: false,
    local: false,
    force: false,
    template: "default",
    title: null,
    year: new Date().getFullYear(),
    target: null,
    unknown: [],
  };

  const rest = [...argv];
  while (rest.length) {
    const a = rest.shift();
    if (a == null) break;

    if (a === "-h" || a === "--help") {
      out.help = true;
      continue;
    }
    if (a === "-v" || a === "--version") {
      out.version = true;
      continue;
    }
    if (a === "--local") {
      out.local = true;
      continue;
    }
    if (a === "--force") {
      out.force = true;
      continue;
    }
    if (a === "--no-sample") {
      out.template = "default";
      continue;
    }
    if (a === "--sample") {
      out.template = "sample";
      continue;
    }
    if (a === "--template" || a === "-t") {
      const v = rest.shift();
      if (v === "default" || v === "sample") out.template = v;
      else if (v === "minimal") out.template = "default";
      else out.unknown.push(`--template ${v ?? ""}`);
      continue;
    }
    if (a.startsWith("--template=")) {
      const v = a.slice("--template=".length);
      if (v === "default" || v === "sample" || v === "minimal") {
        out.template = v === "minimal" ? "default" : v;
      } else out.unknown.push(a);
      continue;
    }
    if (a === "--title") {
      out.title = rest.shift() ?? null;
      continue;
    }
    if (a.startsWith("--title=")) {
      out.title = a.slice("--title=".length);
      continue;
    }
    if (a === "--year") {
      const y = Number(rest.shift());
      if (Number.isFinite(y)) out.year = y;
      continue;
    }
    if (a.startsWith("--year=")) {
      const y = Number(a.slice("--year=".length));
      if (Number.isFinite(y)) out.year = y;
      continue;
    }
    if (a.startsWith("-")) {
      out.unknown.push(a);
      continue;
    }
    if (out.target == null) out.target = a;
    else out.unknown.push(a);
  }

  return out;
}

export function helpText(version) {
  return `create-hssf v${version} (@dinhthanhnam/create-hssf)

Scaffold a Rikkei Education HSSF HTML slide deck (runtime: hssf-slides).

Usage:
  npx @dinhthanhnam/create-hssf <directory> [options]
  npx @dinhthanhnam/create-hssf . --force

Options:
  --local              Copy hssf.min.css/js into vendor/ (offline after install)
  --template <name>    default | sample   (default: default)
  --sample             Same as --template sample
  --no-sample          Same as --template default
  --title <text>       Deck <title> and hero title
  --year <yyyy>        Footer year (default: current year)
  --force              Allow non-empty directory
  -h, --help           Show help
  -v, --version        Show version

Examples:
  npx create-hssf my-deck
  npx create-hssf my-deck --local
  npx create-hssf my-deck --template sample --title "Git Lab"

Serve the deck over HTTP (not file://):
  npx serve my-deck
`;
}
