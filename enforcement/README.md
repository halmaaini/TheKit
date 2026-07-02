# enforcement/ — The Guardrail Harness

> **Template** · Lifecycle: populate-once → living · Owner: Lead · Load: Reference
> Fill: install the harness into your repo (steps below) and replace every `{{PLACEHOLDER}}`.
> Delete this folder if: you deliberately run docs-only, with no mechanical enforcement.
> Related: `../governance/13-domain-hard-lines.md`, `../governance/18-assistant-tooling.md`, `../delivery/06-agent-build-architecture.md`, `../delivery/02-task-ledger.md`, `state-machine.md`

## Why this exists

The rest of the kit is **advisory prose** — rules an agent is asked to follow. Prose degrades as context fills, gets skipped, and gets rationalized around. This folder makes the *checkable* rules **binding**: the agent is driven through a loop, blocked from forbidden actions, and its state moves are validated by a machine. It turns "please follow the rules" into "you can't drift on the rules a machine can check."

> **The spectrum.** Not everything is mechanically enforceable. "Does this screen feel right?" can't be a hook. So: push every *checkable* rule (branch, path, diff, grep, state invariant, CI) into the harness; leave *judgment* (taste, product fit) to the Review Agent and the human. The goal is **no drift on the mechanical rules**, not "no prose."

## The three layers

| Layer | What it does | Mechanism |
|---|---|---|
| **1. Structured execution** | Drives the agent through the operating loop instead of hoping it remembers | `SessionStart` hook + `/task` · `/gate` · `/handoff` slash commands |
| **2. Tool/action gating** | Blocks forbidden actions in the moment | `PreToolUse` hooks (Bash + write guards) + the `pre-commit` git hook |
| **3. State machine** | Rejects illegal ledger/gate moves | `scripts/validate-ledger.mjs` + `state-machine.md` (the spec) + CI |

## Rule → mechanism map

Every mechanical rule in the kit now has an enforcer:

| Rule (kit source) | Enforced by | File |
|---|---|---|
| Load kit context before acting | prints the must-reads into context at session start | `.claude/hooks/session-start.sh` |
| Follow the task loop; confirm deps before starting | `/task` drives it; validator confirms deps | `.claude/commands/task.md`, `scripts/validate-ledger.mjs` |
| No `Done` without `Review: Passed`; no phase unblock without `Gate: Passed`; deps must be satisfied | ledger state-machine validator | `scripts/validate-ledger.mjs`, `state-machine.md` |
| Append-only logs — never edit/delete past entries (`14`, logs/) | pre-commit rejects any commit that removes/modifies an existing log line | `git-hooks/pre-commit.sh` |
| Don't change a locked decision/governance rule silently | write-guard forces human confirmation on `decisions.md` / `governance/**` edits | `.claude/hooks/guard-write.mjs` |
| Agents never push to the default branch / never `--no-verify` (`delivery/06`) | bash-guard denies those commands | `.claude/hooks/guard-bash.mjs` |
| Your domain hard lines (no `any`, unscoped queries, secrets…) (`13`, `05`, `16`) | grep checks on staged diff + in CI | `git-hooks/pre-commit.sh`, `ci/guardrails.yml` |
| Tests / lint / type green before merge | required CI checks + branch protection | `ci/guardrails.yml` |
| Provenance / immutability / isolation domain lines (`13`) | code-level DB triggers + tests (your app owns these) | out of harness scope — see each hard line's *Enforcement* in `governance/13` |

## Layout

```
enforcement/
├── README.md                  ← this file
├── state-machine.md           ← the ledger/gate state machine the validator enforces
├── .claude/
│   ├── settings.json          → repo .claude/settings.json  (registers hooks + permissions)
│   ├── hooks/
│   │   ├── session-start.sh    → repo .claude/hooks/  (SessionStart: load context)
│   │   ├── guard-bash.mjs       → repo .claude/hooks/  (PreToolUse Bash: block push-to-main / --no-verify)
│   │   └── guard-write.mjs      → repo .claude/hooks/  (PreToolUse Edit/Write: confirm on decisions/governance)
│   └── commands/
│       ├── task.md · gate.md · handoff.md  → repo .claude/commands/  (the operating loop)
├── git-hooks/
│   └── pre-commit.sh           → repo .git/hooks/pre-commit  (append-only + hard-line + ledger backstop)
├── scripts/
│   └── validate-ledger.mjs     → repo scripts/  (state-machine validator; run by hooks, /gate, CI)
└── ci/
    └── guardrails.yml          → repo .github/workflows/  (agent-agnostic required checks)
```

## Install (in your target repo)

1. **Copy the Claude Code layer:** `enforcement/.claude/` → `<repo>/.claude/` (merge `settings.json` if you already have one).
2. **Copy the scripts:** `enforcement/scripts/` → `<repo>/scripts/`.
3. **Install the git hook:** `cp enforcement/git-hooks/pre-commit.sh .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit` — or version it: `git config core.hooksPath git-hooks`.
4. **Add CI:** `enforcement/ci/guardrails.yml` → `<repo>/.github/workflows/guardrails.yml`, and make it a **required status check** with branch protection on the default branch.
5. **Fill placeholders** everywhere: `{{KIT_PATH}}` (where the kit lives), `{{DEFAULT_BRANCH}}`, `{{INSTALL_CMD}}` / `{{LINT_CMD}}` / `{{TYPE_CMD}}` / `{{TEST_CMD}}`, and your hard-line grep patterns (from `governance/13`).
6. **Chmod the shell hooks:** `chmod +x enforcement/.claude/hooks/session-start.sh git-hooks/pre-commit.sh`.

## Cross-agent note

The **git hook + CI** are agent-agnostic — they bind for any agent *and* any human, and are the real backstop. The **`.claude/` hooks and commands** are Claude Code–specific; for another agent (Cursor, etc.) replicate the same guard logic in that agent's hook system, but keep the git-hook + CI regardless. Logic-heavy pieces are Node (`.mjs`) because most agent projects have Node — port them to your runtime if not.

## Bottom line

Three layers: a loop the agent is driven through, guards that block forbidden actions in the moment, and a state machine that rejects illegal moves — backed by a git hook and CI that bind for humans and agents alike. Everything checkable is enforced; judgment stays with the reviewer and the human.
