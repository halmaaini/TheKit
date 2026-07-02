#!/usr/bin/env node
// PreToolUse(Edit|Write|MultiEdit) guard — forces human confirmation before an agent changes a
// source-of-truth or governance doc, so locked rules aren't rewritten silently.
// TEMPLATE: installs to <repo>/.claude/hooks/guard-write.mjs · tune ASK_PATTERNS to where your kit lives.
import { readFileSync } from "node:fs";

// Repo-relative paths that require confirmation before edit. {{KIT_PATH}}: prefix if the kit is in a subfolder.
const ASK_PATTERNS = [
  /(^|\/)decisions\.md$/,
  /(^|\/)governance\/[^/]+\.md$/,
];

function decide(decision, reason) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: decision, permissionDecisionReason: reason },
  }));
  process.exit(0);
}

let input = {};
try { input = JSON.parse(readFileSync(0, "utf8")); } catch { process.exit(0); }
const file = String(input?.tool_input?.file_path ?? "");

if (ASK_PATTERNS.some((re) => re.test(file)))
  decide("ask", `'${file}' is a source-of-truth / governance doc. Change the decision in decisions.md FIRST and log it in logs/decisions-log.md before editing a locked rule (governance README + delivery/06). Confirm to proceed.`);

process.exit(0); // allow everything else
