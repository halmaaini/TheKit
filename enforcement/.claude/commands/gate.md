---
description: Run a phase gate — validate ledger, verify all tasks reviewed, run checks, sign off or list failures.
---

<!-- TEMPLATE — installs to `.claude/commands/gate.md` in the target repo. Fill every {{PLACEHOLDER}}.
     {{KIT_PATH}} = path to this kit's docs (or "" if they live at repo root).
     {{TEST_CMD}} / {{LINT_CMD}} / {{TYPE_CMD}} = your project's commands.
     Invoke: `/gate <phase-id>`. -->

# /gate — run a phase gate

You are a **Gate Agent** (see `{{KIT_PATH}}/delivery/06-agent-build-architecture.md`). Run the gate for phase `$ARGUMENTS`. A gate either passes cleanly or fails — no exceptions, no negotiating requirements, no fixing code. Read the phase's gate checklist in `{{KIT_PATH}}/delivery/01-phases-and-gates.md` before starting.

## 1 — Load context

Read `delivery/06-agent-build-architecture.md`, `{{KIT_PATH}}/delivery/02-task-ledger.md`, the phase's gate checklist in `{{KIT_PATH}}/delivery/01-phases-and-gates.md`, the Handoff Log of every task in the phase, the spec docs the gate references, and `{{KIT_PATH}}/logs/decisions-log.md`.

## 2 — Validate the ledger

```bash
node scripts/validate-ledger.mjs
```

If it exits non-zero, the gate **fails** — list the state-machine violations and stop.

## 3 — Verify every task is reviewed

Confirm **every** task row in the phase shows `Review: Passed`. Any row not at `Review: Passed` (still `In Progress`, `Blocked`, `Done`, `Review: Failed`, …) fails the gate. List each offending row.

## 4 — Run the automated checks

Run and record the result of each:

```bash
{{TEST_CMD}}
{{LINT_CMD}}
{{TYPE_CMD}}
```

Any non-zero exit fails the gate.

## 5 — Run the hard-line checks

The hard-line spot-checks are machine-readable (`{{KIT_PATH}}/enforcement/hard-lines.json` — one entry per line in `governance/13`). Run all three:

```bash
node scripts/check-hard-lines.mjs --self-test --manifest {{KIT_PATH}}/enforcement/hard-lines.json
node scripts/check-hard-lines.mjs --coverage --doc {{KIT_PATH}}/governance/13-domain-hard-lines.md --manifest {{KIT_PATH}}/enforcement/hard-lines.json
node scripts/check-hard-lines.mjs --all --manifest {{KIT_PATH}}/enforcement/hard-lines.json
```

`--all` sweeps the whole tree, not just a diff — a gate audits the phase, not a commit. Any non-zero exit fails the gate. For lines marked `mechanical: false`, confirm their named test file ran green in step 4.

## 6 — Decide

**All pass:** set the phase row in the Phase Overview table of `{{KIT_PATH}}/delivery/02-task-ledger.md` to `Gate: Passed`, unblock the next phase's rows (`Not Started`), fill the gate's sign-off table, and append a ruling to `{{KIT_PATH}}/logs/decisions-log.md` recording the pass (phase, date, checks run, result).

**Any fail:** do NOT set `Gate: Passed`. List every failure with exact file and line references, leave the gate unpassed, and send the findings to the relevant Task Agent(s) to fix. Re-run only the failing items on the next attempt.
