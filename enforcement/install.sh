#!/usr/bin/env bash
# enforcement/install.sh — one-step harness install (the manual steps in README.md, scripted).
# Run FROM YOUR REPO ROOT:   bash <kit>/enforcement/install.sh
#   --kit <path>   where the kit lives in your repo (default: auto — this script's parent's parent
#                  relative to the repo; e.g. "." when the kit IS the repo root)
#   --force        overwrite files that already exist (default: refuse and list them)
# Windows: run under Git Bash or WSL (this is a bash script; the hooks it installs are too).
#
# What it does: copies .claude/ + scripts/ + the pre-commit hook + the CI workflow into your
# repo, strips the "TEMPLATE — installs to…" header comments from the installed copies, and
# chmods the shell hooks. It does NOT fill your placeholders — it prints the checklist instead.
set -euo pipefail

FORCE=0; KIT_ARG=""
while [ $# -gt 0 ]; do
  case "$1" in
    --force) FORCE=1 ;;
    --kit) KIT_ARG="${2:?--kit needs a path}"; shift ;;
    *) echo "unknown option: $1" >&2; exit 2 ;;
  esac
  shift
done

REPO="$(git rev-parse --show-toplevel 2>/dev/null)" || { echo "❌ run this from inside your git repo." >&2; exit 2; }
SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"                # <kit>/enforcement
KIT="${KIT_ARG:-$(python3 -c "import os;print(os.path.relpath(os.path.dirname('$SRC'),'$REPO'))" 2>/dev/null || echo ".")}"
cd "$REPO"

copied=(); skipped=()
install_file() { # $1=src $2=dest
  if [ -e "$2" ] && [ "$FORCE" -ne 1 ]; then skipped+=("$2"); return 0; fi
  mkdir -p "$(dirname "$2")"
  cp "$1" "$2"
  # strip the template-header comment lines so installed copies read as the real thing
  # (and don't pollute the `grep -rn "{{[A-Z_]"` doneness check). Match on the SOURCE name —
  # some destinations lose their extension (.git/hooks/pre-commit).
  case "$1" in
    *.md)   perl -0pi -e 's/<!--\s*TEMPLATE — installs.*?-->\n*//s' "$2" ;;
    *.sh|*.mjs) perl -ni -e 'print unless /^\s*(#|\/\/|\*)\s*TEMPLATE\b/' "$2" ;;
    *.yml)  perl -ni -e 'print unless /^# TEMPLATE — /' "$2" ;;
    *.json) perl -ni -e 'print unless /^\s*"_comment":\s*"TEMPLATE/' "$2" ;;
  esac
  copied+=("$2")
}

# 1) Claude Code layer (settings.json is special: never overwritten — merging is a human call)
for f in "$SRC"/.claude/hooks/*; do install_file "$f" ".claude/hooks/$(basename "$f")"; done
for f in "$SRC"/.claude/commands/*; do install_file "$f" ".claude/commands/$(basename "$f")"; done
if [ -e ".claude/settings.json" ]; then
  skipped+=(".claude/settings.json (exists — merge the hooks block from $SRC/.claude/settings.json by hand)")
else
  install_file "$SRC/.claude/settings.json" ".claude/settings.json"
fi

# 2) Scripts
for f in "$SRC"/scripts/*.mjs; do install_file "$f" "scripts/$(basename "$f")"; done

# 3) Git hook (into .git/hooks — or set `git config core.hooksPath git-hooks` and version it instead)
install_file "$SRC/git-hooks/pre-commit.sh" ".git/hooks/pre-commit"

# 4) CI workflow
install_file "$SRC/ci/guardrails.yml" ".github/workflows/guardrails.yml"

# 5) chmod the shell pieces
chmod +x .claude/hooks/session-start.sh .git/hooks/pre-commit 2>/dev/null || true

echo "✅ installed ${#copied[@]} file(s):"; printf '   %s\n' "${copied[@]:-"(none — everything existed)"}"
if [ ${#skipped[@]} -gt 0 ]; then
  echo "⚠ skipped ${#skipped[@]} existing file(s) (re-run with --force to overwrite):"; printf '   %s\n' "${skipped[@]}"
fi

cat <<EOF

Next (the installer can't decide these for you):
  1. Fill the placeholders in the installed copies — {{KIT_PATH}} (your kit is at: ${KIT}),
     {{DEFAULT_BRANCH}}, {{NODE_VERSION}}, and the {{INSTALL/LINT/TYPE/TEST}}_CMD slots
     (DELETE steps your stack doesn't have; if your test suite is fast, run it in pre-commit §4).
     Doneness check:  grep -rn "{{[A-Z_]" .claude .git/hooks/pre-commit .github/workflows scripts
  2. Fill ${KIT}/enforcement/hard-lines.json (one entry per hard line — /hardline drives it),
     then remove its "template": true flag.
  3. Make the "guardrails" job a REQUIRED status check in your branch protection — without
     that, CI reports but does not block.
EOF
