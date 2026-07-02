#!/usr/bin/env bash
# SessionStart hook — force-loads the kit's operating context at the top of every session.
# TEMPLATE: installs to <repo>/.claude/hooks/session-start.sh · set {{KIT_PATH}} (where the kit lives, e.g. "." or "planning").
# stdout from a SessionStart hook is injected into the agent's context.
KIT="${KIT_PATH:-.}"   # {{KIT_PATH}}
cat <<EOF
[project-kit] Load the operating context before doing anything:
  1. ${KIT}/START-HERE.md + ${KIT}/MANIFEST.md   — the map + per-doc lifecycle rules (what you may edit/append/never touch).
  2. ${KIT}/decisions.md                          — the source of truth; everything derives from it.
  3. ${KIT}/governance/README.md (always-loaded set) + ${KIT}/governance/13-domain-hard-lines.md — the rules you cannot cross.
  4. ${KIT}/intake/                               — process any unprocessed source files first.
  5. ${KIT}/delivery/02-task-ledger.md            — the next unblocked task. Confirm deps:
         node ${KIT}/scripts/validate-ledger.mjs
Guardrails are ACTIVE: no direct push to the protected branch, no 'git commit --no-verify',
edits to decisions.md / governance/** require confirmation, and logs/ are append-only (enforced at commit).
Prefer the /task, /gate, and /handoff commands — they drive the loop for you.
EOF
exit 0
