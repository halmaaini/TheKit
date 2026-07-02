# enforcement/ — The Guardrail Harness

> **Template** · Lifecycle: populate-once → living · Owner: Lead · Load: Reference
> Fill: install the harness into your repo (steps below) and replace every `{{PLACEHOLDER}}`.
> Delete this folder if: you deliberately run docs-only, with no mechanical enforcement.
> Related: `../governance/13-domain-hard-lines.md`, `../governance/18-assistant-tooling.md`, `../delivery/06-agent-build-architecture.md`, `../delivery/02-task-ledger.md`, `state-machine.md`

## Why this exists

The rest of the kit is **advisory prose** — rules an agent is asked to follow. Prose degrades as context fills, gets skipped, and gets rationalized around. This folder makes the *checkable* rules **binding**: the agent is driven through a loop, blocked from forbidden actions, and its state moves are validated by a machine. It turns "please follow the rules" into "you can't drift on the rules a machine can check."

> **The spectrum.** Not everything is mechanically enforceable. "Does this screen feel right?" can't be a hook. So: push every *checkable* rule (branch, path, diff, grep, state invariant, CI) into the harness; leave *judgment* (taste, product fit) to the Review Agent and the human. The goal is **no drift on the mechanical rules**, not "no prose."
>
> **One known blind spot:** pattern checks scan **added** lines — they catch a forbidden pattern *appearing*, but cannot see a protective line being **deleted** (removing a guard adds nothing greppable). Tests own that failure mode: every hard line's invariant test fails when its guard is gone — which is why the pre-commit's fast-test slot matters (see `git-hooks/pre-commit.sh` §4).

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
| Your domain hard lines (no `any`, unscoped queries, secrets…) (`13`, `05`, `16`) | one manifest + one engine, run identically by pre-commit (`--staged`), CI (`--range`), and `/gate` (`--all`) | `hard-lines.json`, `scripts/check-hard-lines.mjs` |
| “Wire the check when you write the line” — no hard line without a check (`13`) | `--coverage` fails when a `13` heading has no manifest entry (or vice-versa); `--self-test` requires fixtures so every pattern provably fires | `check-hard-lines.mjs` via pre-commit + CI; `/hardline` drives the loop |
| Tests / lint / type green before merge | required CI checks + branch protection | `ci/guardrails.yml` |
| Provenance / immutability / isolation domain lines (`13`) | code-level DB triggers + tests (your app owns these) | out of harness scope — see each hard line's *Enforcement* in `governance/13` |
| MANIFEST ↔ file-tree sync (the "same-commit" rule) | drift checker: a doc listed-but-missing or present-but-unlisted fails pre-commit and CI (transient dirs exempt — tune the list in the script) | `scripts/check-manifest.mjs` |

## Layout

```
enforcement/
├── README.md                  ← this file
├── install.sh                 ← one-step installer (copy + strip headers + chmod + checklist)
├── state-machine.md           ← the ledger/gate state machine the validator enforces
├── hard-lines.json            ← machine-readable hard-line checks — one entry per line in governance/13
├── .claude/
│   ├── settings.json          → repo .claude/settings.json  (registers hooks + permissions)
│   ├── hooks/
│   │   ├── session-start.sh    → repo .claude/hooks/  (SessionStart: load context)
│   │   ├── guard-bash.mjs       → repo .claude/hooks/  (PreToolUse Bash: block push-to-main / --no-verify)
│   │   └── guard-write.mjs      → repo .claude/hooks/  (PreToolUse Edit/Write: confirm on decisions/governance)
│   └── commands/
│       ├── task.md · gate.md · handoff.md · hardline.md  → repo .claude/commands/  (the operating loop)
├── git-hooks/
│   └── pre-commit.sh           → repo .git/hooks/pre-commit  (append-only + hard-line + ledger backstop)
├── scripts/
│   ├── validate-ledger.mjs     → repo scripts/  (state-machine validator; run by hooks, /gate, CI)
│   ├── check-hard-lines.mjs    → repo scripts/  (hard-line engine: --staged · --range · --all · --coverage · --self-test)
│   └── check-manifest.mjs      → repo scripts/  (MANIFEST ↔ tree drift checker; run by pre-commit + CI)
└── ci/
    └── guardrails.yml          → repo .github/workflows/  (agent-agnostic required checks)
```

## Install (in your target repo)

**One step:** from your repo root, `bash <kit>/enforcement/install.sh` — copies the layers below, strips the template headers from the installed copies, chmods the hooks, refuses to overwrite existing files (`--force` to override; an existing `.claude/settings.json` is never touched — merge it by hand), and prints the fill checklist. *Windows: run it under Git Bash or WSL.* Or do it manually:

1. **Copy the Claude Code layer:** `enforcement/.claude/` → `<repo>/.claude/` (merge `settings.json` if you already have one).
2. **Copy the scripts:** `enforcement/scripts/` → `<repo>/scripts/`.
3. **Install the git hook:** `cp enforcement/git-hooks/pre-commit.sh .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit` — or version it: `git config core.hooksPath git-hooks`.
4. **Add CI:** `enforcement/ci/guardrails.yml` → `<repo>/.github/workflows/guardrails.yml`, and make it a **required status check** with branch protection on the default branch.
5. **Fill placeholders** everywhere: `{{KIT_PATH}}` (where the kit lives), `{{DEFAULT_BRANCH}}`, `{{INSTALL_CMD}}` / `{{LINT_CMD}}` / `{{TYPE_CMD}}` / `{{TEST_CMD}}`.
6. **Fill `hard-lines.json`** — one entry per hard line in `governance/13`, fixtures required (`/hardline` drives the loop; `example/enforcement/hard-lines.json` shows a filled instance). It stays in the kit's `enforcement/` folder (living config); pre-commit/CI/`/gate` point at it via `--manifest`. Remove `"template": true` when your entries are real — until then the scan modes warn instead of binding.
7. **Chmod the shell hooks:** `chmod +x enforcement/.claude/hooks/session-start.sh git-hooks/pre-commit.sh`.
8. **Strip the "TEMPLATE — installs to…" header comment** from each installed copy — the installed file is the real thing, not a template, and leftover `{{…}}` mentions in those headers pollute the placeholder doneness check.

## Adopting into an existing codebase

The engine is diff-based on purpose: pre-commit (`--staged`) and CI (`--range`) check **added lines only**, so an existing codebase is grandfathered by construction — installing the harness does not turn old code red. Run `--all` once as a **debt report** and file the hits as ledger tasks; new code is held to the rules from day one while debt burns down deliberately (**the ratchet**). Two traps the installer handles but you should know: `core.hooksPath` redirects git away from `.git/hooks/` (a hook installed there would be silently inert — the installer resolves the real dir), and existing hooks must be **chained**, not replaced. Always verify with a throwaway commit that the kit checks visibly fire. Full protocol: `../ADOPT-EXISTING.md`.

## Cross-agent note

The **git hook + CI** are agent-agnostic — they bind for any agent *and* any human, and are the real backstop. The **`.claude/` hooks and commands** are Claude Code–specific; for another agent (Cursor, etc.) replicate the same guard logic in that agent's hook system, but keep the git-hook + CI regardless. Logic-heavy pieces are Node (`.mjs`) because most agent projects have Node — port them to your runtime if not.

## Bottom line

Three layers: a loop the agent is driven through, guards that block forbidden actions in the moment, and a state machine that rejects illegal moves — backed by a git hook and CI that bind for humans and agents alike. Everything checkable is enforced; judgment stays with the reviewer and the human.
