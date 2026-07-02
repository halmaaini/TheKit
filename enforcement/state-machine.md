# Ledger State Machine

> **Template** · Lifecycle: living · Owner: Lead · Load: Reference
> This is the **spec** that `scripts/validate-ledger.mjs` enforces. If you change the states or transitions here, change the validator's tables in the same commit.
> Related: `../delivery/02-task-ledger.md`, `../delivery/06-agent-build-architecture.md`, `scripts/validate-ledger.mjs`

The task ledger (`delivery/02-task-ledger.md`) is the project's state machine. These are the legal states and moves; anything else is a bug the validator rejects.

## Task states

| State | Meaning |
|---|---|
| `Not Started` | Defined, not begun. |
| `In Progress` | An agent is actively working it. |
| `Blocked` | Cannot proceed until a dependency or decision clears. |
| `Done` | Exit criteria met; awaiting review. |
| `Review: Failed` | Review found issues; back to the Task Agent. |
| `Review: Passed` | Independently audited and accepted. |

## Phase (gate) states

| State | Meaning |
|---|---|
| `Gate: Pending` | All phase tasks `Review: Passed`; gate not yet run. |
| `Gate: Passed` | Gate checklist signed off; the next phase unblocks. |

## Legal transitions

```
Not Started ── start ──▶ In Progress
In Progress ── hit blocker ──▶ Blocked ── resolved ──▶ In Progress
In Progress ── exit criteria met ──▶ Done
Done ── review ──▶ Review: Passed   |   Review: Failed
Done / Review: Passed ── dependency regressed ──▶ Blocked   (see rule below)
Review: Failed ── fix ──▶ In Progress
Review: Passed ──▶ (task terminal; contributes to its phase gate)

[phase] all tasks Review: Passed ──▶ Gate: Pending ── gate run ──▶ Gate: Passed | Review: Failed (kick back)
Gate: Passed ──▶ (phase terminal; next phase unblocks)
```

Any move not on this list is illegal — e.g. `Not Started → Done`, `Done → Gate: Passed`, `Review: Failed → Done`.

## Dependency regression

When a dependency **leaves** Done-or-beyond (its review failed after dependents started), every started dependent moves to **`Blocked`** with a `BLOCKED — upstream: [task id] failed review` note in its handoff log. `Blocked` is exempt from the dependency invariant, so this is always a legal, truthful state to record. Re-entry once upstream re-passes: `Blocked → In Progress → Done → re-review` — the re-review is deliberate, because an upstream fix may invalidate the dependent's work.

## Preconditions (invariants the validator checks)

1. **Legal status.** Every status is one of the values above.
2. **Dependency satisfaction.** A task that has started (`In Progress`, `Done`, `Review: *`) has **every** "Depends On" entry satisfied — a dependency counts as satisfied when it is `Done` **or beyond** (`Review: Passed`, `Gate: Passed`). `Blocked` tasks are exempt from this check — `Blocked` is exactly how a dependent records an upstream regression.
3. **Gate precondition.** A phase's gate row is `Gate: Passed` **only if every task in that phase is `Review: Passed`.** No exceptions, no partial gates.
4. **No skips.** A task cannot reach `Done` from `Not Started` without passing through `In Progress`; a task cannot be `Review: Passed` without first being `Done`.

## How it's enforced

- **On demand / in the loop:** `node scripts/validate-ledger.mjs` — the `/task` and `/gate` commands run it before acting.
- **At commit:** the `pre-commit` hook runs it whenever the ledger file changes.
- **In CI:** `ci/guardrails.yml` runs it on every PR.
- **Single move check:** `node scripts/validate-ledger.mjs --transition "In Progress" "Done"` validates one transition against the table above.

## Bottom line

Status is not prose an agent sets freely — it's a state machine. Deps must be satisfied before work starts, and a gate can't pass until every task in its phase has passed review. The validator makes those the only legal moves.
