#!/usr/bin/env node
// PreToolUse(Bash) guard — blocks the actions "agents never do" (delivery/06).
// TEMPLATE: installs to <repo>/.claude/hooks/guard-bash.mjs · set the protected branch below.
// Blocks: direct push to the protected branch, force-push to it, and 'git commit --no-verify'.
import { readFileSync } from "node:fs";

const DEFAULT_BRANCH = process.env.PROTECTED_BRANCH || "main"; // {{DEFAULT_BRANCH}}
const b = DEFAULT_BRANCH.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function deny(reason) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: reason },
  }));
  process.exit(0);
}

let input = {};
try { input = JSON.parse(readFileSync(0, "utf8")); } catch { process.exit(0); }
const cmd = String(input?.tool_input?.command ?? "");

if (/\bgit\s+push\b/.test(cmd)) {
  const force = /(--force\b|--force-with-lease\b|(^|\s)-f(\s|$))/.test(cmd);
  const touchesDefault = new RegExp(`(\\borigin\\s+${b}\\b|\\bHEAD:${b}\\b|:${b}\\b|\\s${b}\\s*$)`).test(cmd);
  if (touchesDefault && force) deny(`Force-push to '${DEFAULT_BRANCH}' is blocked. Work on a feature branch; merging is a human action.`);
  if (touchesDefault) deny(`Direct push to '${DEFAULT_BRANCH}' is blocked (delivery/06 — agents never push to the default branch). Use a feature branch + PR.`);
}
if (/\bgit\s+commit\b/.test(cmd) && /--no-verify\b/.test(cmd))
  deny("`git commit --no-verify` bypasses the pre-commit guardrails. Fix the flagged issue instead of skipping the checks.");

process.exit(0); // allow
