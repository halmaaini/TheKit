#!/usr/bin/env bash
# Pre-commit guardrail — the agent-agnostic backstop (binds for humans AND agents).
# TEMPLATE install: `cp enforcement/git-hooks/pre-commit.sh .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit`
#   or version it: `git config core.hooksPath git-hooks`.
# Set {{KIT_PATH}} and fill the hard-line greps + fast commands for your project.
set -euo pipefail
KIT="${KIT_PATH:-.}"   # {{KIT_PATH}}
fail=0

# 1) APPEND-ONLY logs (governance/14): reject any commit that modifies or deletes an existing line.
append_only=(
  "${KIT}/logs/decisions-log.md"
  "${KIT}/logs/gap-log.md"
  "${KIT}/logs/contradiction-log.md"
  "${KIT}/intake/intake-log.md"
  "${KIT}/archive/archive-log.md"
)
for f in "${append_only[@]}"; do
  [ -f "$f" ] || continue
  removed=$(git diff --cached --unified=0 -- "$f" | grep -Ec '^-[^-]' || true)
  if [ "${removed:-0}" -gt 0 ]; then
    echo "❌ append-only violation: '$f' has ${removed} modified/deleted line(s). Logs may only be appended to (governance/14)."
    fail=1
  fi
done

# 2) HARD LINES (governance/13, 05, 16): the checks are machine-readable — one entry per hard line in
#    ${KIT}/enforcement/hard-lines.json (add via /hardline). Pre-commit, CI, and /gate all call the SAME
#    engine, so the checks cannot drift apart. No hand-written greps here.
staged=$(git diff --cached --name-only --diff-filter=ACM || true)
if [ -f "${KIT}/enforcement/hard-lines.json" ]; then
  node "${KIT}/scripts/check-hard-lines.mjs" --staged --manifest "${KIT}/enforcement/hard-lines.json" || fail=1
  # Wiring is enforced: touching the hard-lines doc or manifest must leave fixtures firing and coverage 1:1.
  if echo "${staged}" | grep -qE '(13-domain-hard-lines\.md|hard-lines\.json)'; then
    node "${KIT}/scripts/check-hard-lines.mjs" --self-test --manifest "${KIT}/enforcement/hard-lines.json" || fail=1
    node "${KIT}/scripts/check-hard-lines.mjs" --coverage --doc "${KIT}/governance/13-domain-hard-lines.md" --manifest "${KIT}/enforcement/hard-lines.json" || fail=1
  fi
fi

# 3) STATE MACHINE: validate the ledger if it changed.
if echo "${staged}" | grep -q "task-ledger.md"; then
  node "${KIT}/scripts/validate-ledger.mjs" || fail=1
fi

# 4) FAST quality gate. ⟨FILL your commands.⟩ If your test suite runs in a few seconds, RUN IT HERE:
#    the hard-line greps above only see ADDED lines, so DELETING a guard is invisible to them —
#    a fast test suite is the only commit-time net for that. Keep only genuinely slow suites CI-only.
# {{TEST_CMD}} || fail=1
# {{LINT_CMD}} || fail=1
# {{TYPE_CMD}} || fail=1

if [ "$fail" -ne 0 ]; then
  echo ""
  echo "Pre-commit guardrails failed. Fix the above — do NOT bypass with --no-verify."
  exit 1
fi
echo "✅ pre-commit guardrails passed."
exit 0
