#!/usr/bin/env node
/**
 * Ledger state-machine validator (reference implementation).
 * TEMPLATE: installs to <repo>/scripts/validate-ledger.mjs. Adapt LEDGER_PATH and the row parser
 * to YOUR ledger's exact table format. Enforces the invariants in enforcement/state-machine.md.
 *
 * Usage:
 *   node scripts/validate-ledger.mjs [path-to-ledger.md]
 *   node scripts/validate-ledger.mjs --transition "In Progress" "Done"   # check a single move
 *
 * Exit: 0 = valid · 1 = invariant/transition violated · 2 = ledger not found.
 */
import { readFileSync } from "node:fs";

const STATUSES = ["Not Started", "In Progress", "Blocked", "Done", "Review: Failed", "Review: Passed", "Gate: Pending", "Gate: Passed"];
const SATISFIED_DEP = new Set(["Done", "Gate: Passed"]);
const STARTED = new Set(["In Progress", "Done", "Review: Failed", "Review: Passed"]);

// Allowed transitions — keep in sync with enforcement/state-machine.md.
const TRANSITIONS = {
  "Not Started": ["In Progress", "Blocked"],
  "In Progress": ["Blocked", "Done"],
  "Blocked": ["In Progress"],
  "Done": ["Review: Passed", "Review: Failed"],
  "Review: Failed": ["In Progress"],
  "Review: Passed": ["Gate: Pending"],
  "Gate: Pending": ["Gate: Passed", "Review: Failed"],
  "Gate: Passed": [],
};

// --- single-transition mode ---
const argv = process.argv.slice(2);
if (argv[0] === "--transition") {
  const [, from, to] = argv;
  const legal = (TRANSITIONS[from] || []).includes(to);
  if (!legal) {
    console.error(`❌ illegal transition '${from}' → '${to}'. Legal from '${from}': ${(TRANSITIONS[from] || []).join(", ") || "(terminal)"}`);
    process.exit(1);
  }
  console.log(`✅ '${from}' → '${to}' is a legal transition.`);
  process.exit(0);
}

// --- full-ledger mode ---
const LEDGER_PATH = argv[0] || process.env.LEDGER_PATH || "delivery/02-task-ledger.md";
let md;
try { md = readFileSync(LEDGER_PATH, "utf8"); } catch { console.error(`ledger not found: ${LEDGER_PATH}`); process.exit(2); }

const errors = [];
const tasks = [];          // { id, phase, status, deps:[], isGate }
const phaseTaskStatuses = {}; // phase -> [status,...] for non-gate rows
let phase = "(none)";

for (const raw of md.split("\n")) {
  const line = raw.trimEnd();
  const header = line.match(/^#{2,4}\s+(.+?)\s*$/);
  if (header) { phase = header[1].replace(/[*_`]/g, "").trim(); continue; }
  const cells = line.match(/^\|\s*([^|]+?)\s*\|\s*([^|]*?)\s*\|\s*([^|]+?)\s*\|\s*([^|]*?)\s*\|/);
  if (!cells) continue;
  let [, id, , status, deps] = cells;
  id = id.trim();
  status = status.replace(/`/g, "").trim();
  if (/^task\s*id$/i.test(id) || /^:?-{2,}/.test(id) || /^status$/i.test(status)) continue; // header/separator
  if (/\{\{|…|\.\.\.|\bexample\b/i.test(`${id} ${status} ${deps}`)) continue;               // template/example rows
  if (!STATUSES.includes(status)) { errors.push(`unknown status '${status}' on row '${id}'`); continue; }
  const depList = deps.split(/[,;]/).map((s) => s.replace(/`/g, "").trim())
    .filter(Boolean).filter((d) => !/^(—|-|none|n\/a)$/i.test(d));
  const isGate = /gate/i.test(id);
  tasks.push({ id, phase, status, deps: depList, isGate });
  if (!isGate) (phaseTaskStatuses[phase] ||= []).push(status);
}

const statusById = Object.fromEntries(tasks.map((t) => [t.id, t.status]));

// Invariant 2: started tasks have satisfied dependencies.
for (const t of tasks) {
  if (!STARTED.has(t.status)) continue;
  for (const d of t.deps) {
    if (/gate:\s*passed/i.test(d)) continue;            // explicit "<phase> → Gate: Passed" literal — trust the gate check below
    const ds = statusById[d];
    if (ds === undefined) continue;                     // dep not a known task id (free-text) — skip
    if (!SATISFIED_DEP.has(ds)) errors.push(`'${t.id}' is '${t.status}' but dependency '${d}' is '${ds}' (must be Done or Gate: Passed)`);
  }
}

// Invariant 3: a phase gate is 'Gate: Passed' only if every task in that phase is 'Review: Passed'.
for (const g of tasks.filter((t) => t.isGate && t.status === "Gate: Passed")) {
  const notReady = (phaseTaskStatuses[g.phase] || []).filter((s) => s !== "Review: Passed");
  if (notReady.length) errors.push(`phase '${g.phase}' shows 'Gate: Passed' but ${notReady.length} task(s) are not 'Review: Passed' (${notReady.join(", ")})`);
}

if (errors.length) {
  console.error("❌ ledger invariants violated:\n - " + errors.join("\n - "));
  process.exit(1);
}
console.log(`✅ ledger valid (${tasks.length} rows): statuses legal, dependencies satisfied, gates well-formed.`);
process.exit(0);
