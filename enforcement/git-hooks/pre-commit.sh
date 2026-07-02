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

# 2) HARD-LINE greps over the staged diff (governance/13, 05, 16). ⟨FILL: your forbidden patterns.⟩
staged=$(git diff --cached --name-only --diff-filter=ACM || true)
ts_files=$(echo "${staged}" | grep -E '\.(ts|tsx)$' || true)
if [ -n "${ts_files}" ]; then
  if git diff --cached -- ${ts_files} | grep -nE '^\+.*(: any\b|as any\b|@ts-ignore)'; then
    echo "❌ type-safety hard line: 'any' / '@ts-ignore' introduced (governance/05)."
    fail=1
  fi
  # ⟨FILL⟩ e.g. unscoped query, direct vendor-SDK import outside the wrapper, hardcoded secret, calc outside its home module…
fi

# 3) STATE MACHINE: validate the ledger if it changed.
if echo "${staged}" | grep -q "task-ledger.md"; then
  node "${KIT}/scripts/validate-ledger.mjs" || fail=1
fi

# 4) FAST quality gate (keep it quick; heavy suites run in CI). ⟨FILL your commands.⟩
# {{LINT_CMD}} || fail=1
# {{TYPE_CMD}} || fail=1

if [ "$fail" -ne 0 ]; then
  echo ""
  echo "Pre-commit guardrails failed. Fix the above — do NOT bypass with --no-verify."
  exit 1
fi
echo "✅ pre-commit guardrails passed."
exit 0
