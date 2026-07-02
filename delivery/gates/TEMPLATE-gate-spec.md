# {{PHASE-ID}} — {{Phase name}} Gate

> **Template** · Lifecycle: living (one copy per phase gate) · Owner: Lead seeds it; the Gate Agent runs it · Load: Reference
> Fill: copy to `delivery/gates/{{phase-id}}-{{short-name}}-gate.md` when you seed the ledger — one per phase. The ledger's gate row points here.
> Related: `../01-phases-and-gates.md` (this phase's exit criteria), `../02-task-ledger.md`, `../tasks/TEMPLATE-task-spec.md`

A gate **passes clean or fails** — no negotiating requirements, no fixing code at the gate (`delivery/06`). Run via `/gate {{PHASE-ID}}`.

## Checklist

- [ ] Ledger valid: `node scripts/validate-ledger.mjs` exits 0.
- [ ] Every task row in {{PHASE-ID}} is `Review: Passed` (list any that aren't — each is a finding).
- [ ] Automated checks green: {{your test command — e.g. `node --test`}}.
- [ ] Hard-line engine clean, all three modes: `--self-test` · `--coverage` · `--all`.
- [ ] **Mutation-check** each hard-line invariant test this phase added: break the guard, watch the test go red, restore.
  ⚠ **Commit (or stash) everything BEFORE mutating** — `git status` must be clean before and after, or a mutation can ride into a commit on an untracked file.
- [ ] Handoff logs complete per `06`'s Minimum Standard for every task in the phase.
- [ ] {{Phase-specific exit criteria from `01-phases-and-gates.md` — one checkbox each.}}

## Decide

- **All pass:** set the phase row + gate row to `Gate: Passed` in the ledger, unblock the next phase, fill the sign-off below, append the ruling to `logs/decisions-log.md`.
- **Any fail:** do **not** pass. List every failure with file/line, leave the gate unpassed, send findings to the responsible Task Agent(s). Re-run only the failing items next attempt.

## Sign-off

| Function | Signs off on | Signed |
|---|---|---|
| Engineering (agent) | checklist above, evidence linked | {{date / —}} |
| Owner (human) | scope honesty — the phase delivered what it promised | {{date / —}} |
