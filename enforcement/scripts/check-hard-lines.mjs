#!/usr/bin/env node
/**
 * Hard-line check engine (reference implementation).
 * TEMPLATE: installs to <repo>/scripts/check-hard-lines.mjs. One manifest, one engine:
 * pre-commit, CI, and /gate all run the SAME checks, so they cannot drift apart.
 * The manifest (enforcement/hard-lines.json) is the machine-readable half of
 * governance/13-domain-hard-lines.md — see /hardline for the wiring loop.
 *
 * Usage (exactly one mode per invocation):
 *   node scripts/check-hard-lines.mjs --staged                      # staged diff (pre-commit)
 *   node scripts/check-hard-lines.mjs --range <base>...<head>       # PR diff (CI)
 *   node scripts/check-hard-lines.mjs --all                         # whole tree (/gate phase audit)
 *   node scripts/check-hard-lines.mjs --coverage                    # every 13 heading ↔ manifest entry, both ways
 *   node scripts/check-hard-lines.mjs --self-test                   # fixtures fire; declared test files exist
 * Options:
 *   --manifest <path>   default: enforcement/hard-lines.json
 *   --doc <path>        default: governance/13-domain-hard-lines.md (coverage mode)
 *
 * Manifest shape (fixtures are REQUIRED — a check you can't prove fires is a hope):
 *   { "template": true|absent, "hardLines": [
 *       { "id": "HL-1", "name": "…", "decision": "D-…",
 *         "patterns": [ { "regex": "…", "flags": "i"?, "files": "…"?, "message": "…",
 *                         "shouldMatch": ["…"], "shouldNotMatch": ["…"]? } ] }
 *     | { "id": "HL-2", "name": "…", "decision": "D-…",
 *         "mechanical": false, "enforcedBy": "…", "testFile": "…" } ] }
 *   Ids HL-<n> bind 1:1 to the '### <n> — …' headings in governance/13 (checked by --coverage).
 *   Entries with other ids (e.g. GOV-05-…) are extra checkable rules from other governance docs.
 *
 * Exit: 0 = clean/valid · 1 = violation or check failed · 2 = bad usage or unusable manifest.
 */
import { readFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";

const argv = process.argv.slice(2);
const MODES = ["--staged", "--range", "--all", "--coverage", "--self-test"];
const mode = MODES.filter((m) => argv.includes(m));
const opt = (flag, dflt) => { const i = argv.indexOf(flag); return i >= 0 && argv[i + 1] ? argv[i + 1] : dflt; };

if (mode.length !== 1) {
  console.error(`usage: check-hard-lines.mjs <${MODES.join(" | ")}> [--manifest <path>] [--doc <path>]`);
  process.exit(2);
}

// Files the engine never matches against — they legitimately QUOTE forbidden patterns.
const SELF_EXCLUDE = [/hard-lines\.json$/, /13-domain-hard-lines\.md$/, /check-hard-lines\.mjs$/];
const isPlaceholder = (s) => /\{\{|⟨/.test(String(s ?? ""));

// --- load + validate the manifest (structural problems are exit 2 everywhere: never silently skip) ---
const manifestPath = opt("--manifest", "enforcement/hard-lines.json");
let manifest;
try { manifest = JSON.parse(readFileSync(manifestPath, "utf8")); }
catch (e) { console.error(`❌ cannot read/parse manifest '${manifestPath}': ${e.message}`); process.exit(2); }

const entries = manifest.hardLines;
const isTemplate = manifest.template === true;
const cfgErrors = [];
if (!Array.isArray(entries) || entries.length === 0) cfgErrors.push(`'hardLines' must be a non-empty array`);

for (const e of entries ?? []) {
  const where = `entry '${e?.id ?? "(no id)"}'`;
  if (!e?.id) cfgErrors.push(`${where}: 'id' is required`);
  if (!e?.name) cfgErrors.push(`${where}: 'name' is required`);
  if (!e?.decision) cfgErrors.push(`${where}: 'decision' is required (traceability — cite the decision, see governance/13)`);
  const hasPatterns = Array.isArray(e?.patterns) && e.patterns.length > 0;
  if (e?.mechanical === false) {
    if (hasPatterns) cfgErrors.push(`${where}: choose 'patterns' OR 'mechanical: false', not both`);
    if (!e?.enforcedBy) cfgErrors.push(`${where}: mechanical:false requires 'enforcedBy' (where the real enforcement lives)`);
    if (!e?.testFile) cfgErrors.push(`${where}: mechanical:false requires 'testFile' (the test that fails on violation)`);
  } else if (!hasPatterns) {
    cfgErrors.push(`${where}: needs 'patterns' (or 'mechanical: false' + enforcedBy + testFile for non-greppable lines)`);
  }
  for (const p of e?.patterns ?? []) {
    if (!p?.regex) { cfgErrors.push(`${where}: pattern missing 'regex'`); continue; }
    if (!p?.message) cfgErrors.push(`${where}: pattern '${p.regex}' missing 'message'`);
    if (!Array.isArray(p?.shouldMatch) || p.shouldMatch.length === 0)
      cfgErrors.push(`${where}: pattern '${p.regex}' has no 'shouldMatch' fixture — fixtures are REQUIRED (prove the check fires)`);
    const flags = String(p.flags ?? "").replace(/[gy]/g, ""); // g/y are stateful — never wanted here
    try { p._re = new RegExp(p.regex, flags); }
    catch (err) { cfgErrors.push(`${where}: invalid regex '${p.regex}': ${err.message}`); }
    if (p.files) {
      try { p._fileRe = new RegExp(p.files); }
      catch (err) { cfgErrors.push(`${where}: invalid 'files' regex '${p.files}': ${err.message}`); }
    }
  }
}
if (cfgErrors.length) {
  console.error(`❌ manifest '${manifestPath}' is invalid:\n - ` + cfgErrors.join("\n - "));
  process.exit(2);
}

// --- mode: --self-test — every pattern provably fires; declared test files exist ---
if (mode[0] === "--self-test") {
  const errors = [];
  let patterns = 0, fixtures = 0, testFiles = 0;
  for (const e of entries) {
    for (const p of e.patterns ?? []) {
      patterns++;
      for (const s of p.shouldMatch) { fixtures++; if (!p._re.test(s)) errors.push(`[${e.id}] regex '${p.regex}' does NOT match its fixture: ${JSON.stringify(s)} — fix the pattern, not the fixture`); }
      for (const s of p.shouldNotMatch ?? []) { fixtures++; if (p._re.test(s)) errors.push(`[${e.id}] regex '${p.regex}' MATCHES a shouldNotMatch fixture: ${JSON.stringify(s)} — pattern is too broad`); }
    }
    if (e.mechanical === false) {
      testFiles++;
      if (isPlaceholder(e.testFile)) console.log(`⚠ [${e.id}] testFile is still a template placeholder — fill it: ${e.testFile}`);
      else if (!existsSync(e.testFile)) errors.push(`[${e.id}] declared testFile does not exist: '${e.testFile}' — a named test that isn't there is only a hope`);
    }
  }
  if (errors.length) { console.error(`❌ self-test failed:\n - ` + errors.join("\n - ")); process.exit(1); }
  console.log(`✅ self-test passed: ${patterns} pattern(s), ${fixtures} fixture(s), ${testFiles} declared test file(s).`);
  process.exit(0);
}

// --- mode: --coverage — the 'wire the check when you write the line' rule, made mechanical ---
if (mode[0] === "--coverage") {
  const docPath = opt("--doc", "governance/13-domain-hard-lines.md");
  let doc;
  try { doc = readFileSync(docPath, "utf8"); }
  catch { console.error(`❌ hard-lines doc not found: '${docPath}' (use --doc <path>)`); process.exit(2); }

  if (isTemplate || doc.includes("⟨FILL⟩")) {
    console.log(`ℹ template state — coverage not binding yet. Fill '${docPath}' with your hard lines and '${manifestPath}' with their checks (see /hardline), then remove "template": true.`);
    process.exit(0);
  }

  const headings = [...doc.matchAll(/^###\s*(\d+)\s*[—–-]+\s*(.+?)\s*(?:\((D-[^)]+)\))?\s*$/gm)]
    .map((m) => ({ n: m[1], name: m[2].trim(), decision: m[3] }));
  if (headings.length === 0) {
    console.error(`❌ no '### <n> — <name>   (D-…)' headings found in '${docPath}' — hard lines must use the numbered heading format so coverage can bind them to the manifest.`);
    process.exit(1);
  }

  const errors = [];
  const byId = Object.fromEntries(entries.map((e) => [e.id, e]));
  for (const h of headings) {
    const e = byId[`HL-${h.n}`];
    if (!e) { errors.push(`hard line '### ${h.n} — ${h.name}' has NO entry 'HL-${h.n}' in ${manifestPath} — a hard line with no mechanical check is only a hope (wire it: /hardline)`); continue; }
    if (h.decision && e.decision && h.decision !== e.decision)
      errors.push(`'HL-${h.n}' decision mismatch: doc says (${h.decision}), manifest says (${e.decision})`);
  }
  const docIds = new Set(headings.map((h) => `HL-${h.n}`));
  for (const e of entries.filter((x) => /^HL-\d+$/.test(x.id)))
    if (!docIds.has(e.id)) errors.push(`manifest entry '${e.id}' (“${e.name}”) has no matching '### ${e.id.slice(3)} —' heading in ${docPath} — remove the entry or write the line`);

  if (errors.length) { console.error(`❌ coverage failed:\n - ` + errors.join("\n - ")); process.exit(1); }
  const extra = entries.filter((x) => !/^HL-\d+$/.test(x.id)).length;
  console.log(`✅ coverage: ${headings.length} hard line(s) in ${docPath} ↔ manifest, 1:1${extra ? ` (+${extra} extra rule(s) from other governance docs)` : ""}.`);
  process.exit(0);
}

// --- modes: --staged / --range / --all — scan lines for forbidden patterns ---
if (isTemplate) {
  console.log(`⚠ '${manifestPath}' is still the shipped template ("template": true) — hard-line checks are NOT binding yet. Fill it for your project (see /hardline), then remove the flag.`);
  process.exit(0);
}

const excluded = (file) => SELF_EXCLUDE.some((re) => re.test(file));
const lines = []; // { file, line, text }

if (mode[0] === "--all") {
  const files = execSync("git ls-files", { encoding: "utf8" }).split("\n").filter(Boolean);
  for (const file of files) {
    if (excluded(file)) continue;
    let content;
    try { content = readFileSync(file, "utf8"); } catch { continue; }
    if (content.includes("\0")) continue; // binary
    content.split("\n").forEach((text, i) => lines.push({ file, line: i + 1, text }));
  }
} else {
  const diffArgs = mode[0] === "--staged" ? "--cached" : opt("--range");
  if (!diffArgs) { console.error("usage: --range <base>...<head>"); process.exit(2); }
  let diff;
  try { diff = execSync(`git diff ${diffArgs} --unified=0 --no-color`, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }); }
  catch (e) { console.error(`❌ git diff failed: ${e.message}`); process.exit(2); }
  let file = null, lineNo = 0;
  for (const raw of diff.split("\n")) {
    if (raw.startsWith("+++ ")) { file = raw.replace(/^\+\+\+ b\//, "").trim(); continue; }
    const hunk = raw.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (hunk) { lineNo = Number(hunk[1]); continue; }
    if (raw.startsWith("+") && !raw.startsWith("+++")) {
      if (file && file !== "/dev/null" && !excluded(file)) lines.push({ file, line: lineNo, text: raw.slice(1) });
      lineNo++;
    }
    // '-' and '\ No newline' lines don't advance the new-file counter at unified=0
  }
}

const violations = [];
for (const e of entries) {
  for (const p of e.patterns ?? []) {
    for (const l of lines) {
      if (p._fileRe && !p._fileRe.test(l.file)) continue;
      if (p._re.test(l.text)) violations.push({ ...l, id: e.id, decision: e.decision, message: p.message });
    }
  }
}

if (violations.length) {
  for (const v of violations) console.error(`❌ ${v.file}:${v.line}  [${v.id} · ${v.decision}] ${v.message}\n     ${v.text.trim()}`);
  console.error(`\n${violations.length} hard-line violation(s). These cross guarantees in governance/13 — fix them; do not bypass.`);
  process.exit(1);
}
const scope = mode[0] === "--all" ? `${lines.length} line(s) across the tree` : `${lines.length} added line(s)`;
console.log(`✅ hard lines clean (${entries.reduce((n, e) => n + (e.patterns?.length ?? 0), 0)} pattern(s) over ${scope}).`);
process.exit(0);
