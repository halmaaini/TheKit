#!/usr/bin/env node
/**
 * MANIFEST ↔ file-tree drift checker (reference implementation).
 * TEMPLATE: installs to <repo>/scripts/check-manifest.mjs. Makes the MANIFEST's own
 * "same-commit" rule mechanical: a doc listed but missing, or a kit doc present but
 * unlisted, fails the check — so MANIFEST.md can't silently drift from reality.
 *
 * Usage:
 *   node scripts/check-manifest.mjs [--manifest <path>]     # default: MANIFEST.md
 * Paths in the MANIFEST are resolved relative to the manifest's own directory (the kit root).
 *
 * What it checks:
 *   1. LISTED → EXISTS: every backticked file/dir in a MANIFEST table row exists.
 *      Rows marked deleted (lifecycle cell "—" or row text contains "Deleted") are
 *      expected NOT to exist — a still-present file gets a warning.
 *   2. PRESENT → LISTED: every .md file in the kit's doc directories appears in a row.
 *      Transient/instance locations are exempt (see EXEMPT below) — tune to your kit.
 *
 * Exit: 0 = in sync (warnings allowed) · 1 = drift · 2 = manifest missing/unparsable.
 */
import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";

const argv = process.argv.slice(2);
const opt = (flag, dflt) => { const i = argv.indexOf(flag); return i >= 0 && argv[i + 1] ? argv[i + 1] : dflt; };
const manifestPath = opt("--manifest", "MANIFEST.md");

let md;
try { md = readFileSync(manifestPath, "utf8"); }
catch { console.error(`❌ manifest not found: '${manifestPath}' (use --manifest <path>)`); process.exit(2); }
const ROOT = dirname(manifestPath);

// Files/dirs never required to be listed (transient dropzones, per-task instances, non-kit content).
// ⟨FILL: tune to your kit if you add instance directories.⟩
const EXEMPT = [
  /^intake\/(?!README\.md$|intake-log\.md$)/,   // dropped raw files are transient
  /^archive\/(?!README\.md$|archive-log\.md$)/, // archived raw material isn't a kit doc
  /^delivery\/tasks\/(?!TEMPLATE-)/,            // per-task spec instances
  /^delivery\/gates\/(?!TEMPLATE-)/,            // per-gate spec instances
  /^example\//,                                 // the worked example documents itself
];

// --- parse: section headings give the directory context; table rows give the entries ---
const sections = []; // { dir, rows: [{ cell, deleted, line }] }
let current = null;
let lineNo = 0;
for (const raw of md.split("\n")) {
  lineNo++;
  const h = raw.match(/^##\s+(.+)$/);
  if (h) {
    const t = h[1];
    const dirTick = t.match(/`([^`]+)\/`/);            // e.g. ## `governance/` — how you build it
    const isRoot = /root documents/i.test(t);
    current = (dirTick || isRoot) ? { dir: dirTick ? dirTick[1] : ".", rows: [] } : null;
    if (current) sections.push(current);
    continue;
  }
  if (!current) continue;
  const cells = raw.match(/^\|\s*(.+?)\s*\|\s*(.*?)\s*\|/);
  if (!cells) continue;
  const [, first, second] = cells;
  if (/^doc(\/file)?$/i.test(first) || /^:?-{2,}/.test(first)) continue; // header/separator
  const ticks = [...first.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
  if (ticks.length === 0) continue;                    // prose row
  const deleted = second.trim() === "—" || /deleted/i.test(raw);
  for (const t of ticks) current.rows.push({ entry: t, deleted, line: lineNo });
}
if (sections.length === 0) {
  console.error(`❌ no parsable sections found in '${manifestPath}' — expected '## Root documents' / '## \`<dir>/\` …' headings with tables.`);
  process.exit(2);
}

const errors = [];
const warnings = [];
const listedFiles = new Set(); // exact file paths
const listedDirs = [];         // dir entries (trailing slash) — anything under them counts as listed

// --- direction 1: listed → exists ---
for (const s of sections) {
  for (const r of s.rows) {
    const relPath = s.dir === "." ? r.entry : join(s.dir, r.entry);
    const full = join(ROOT, relPath);
    if (r.entry.endsWith("/")) listedDirs.push(relPath.endsWith("/") ? relPath : relPath + "/");
    else listedFiles.add(relPath);
    const self = relPath === "MANIFEST.md" || full === manifestPath;
    if (r.deleted) {
      if (existsSync(full)) warnings.push(`MANIFEST line ${r.line} says '${relPath}' was deleted, but it still exists — delete the file or restore the row`);
      continue;
    }
    if (!self && !existsSync(full))
      errors.push(`'${relPath}' is listed in MANIFEST (line ${r.line}) but does not exist — remove/mark the row in the SAME commit that deleted it`);
  }
}

// --- direction 2: present → listed (kit doc dirs only; .md files) ---
const exempt = (rel) => EXEMPT.some((re) => re.test(rel));
const scanDirs = sections.map((s) => s.dir);
for (const dir of new Set(scanDirs)) {
  const base = join(ROOT, dir === "." ? "" : dir);
  if (!existsSync(base) || !statSync(base).isDirectory()) continue;
  const walk = (d) => {
    for (const name of readdirSync(d)) {
      const full = join(d, name);
      const rel = relative(ROOT, full);
      if (statSync(full).isDirectory()) {
        // only recurse where a section owns the tree (delivery/, enforcement/) — root section stays flat
        if (dir !== ".") walk(full);
        continue;
      }
      if (!name.endsWith(".md")) continue;
      if (dir === "." && rel.includes("/")) continue;   // root section: root files only
      if (exempt(rel)) continue;
      if (!listedFiles.has(rel) && !listedDirs.some((d) => rel.startsWith(d)))
        errors.push(`'${rel}' exists but has no MANIFEST row — add one in the SAME commit that added the file`);
    }
  };
  walk(base);
}

for (const w of warnings) console.warn(`⚠ ${w}`);
if (errors.length) {
  console.error(`❌ MANIFEST drift:\n - ` + errors.join("\n - "));
  process.exit(1);
}
const n = listedFiles.size + listedDirs.length;
console.log(`✅ MANIFEST in sync: ${n} listed entr${n === 1 ? "y" : "ies"} across ${sections.length} sections match the tree${warnings.length ? ` (${warnings.length} warning(s))` : ""}.`);
process.exit(0);
