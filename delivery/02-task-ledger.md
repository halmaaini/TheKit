# Task Ledger

> **Template** · Lifecycle: living · Owner: Any agent · Load: Reference
> Fill: replace every `{{PLACEHOLDER}}` and `⟨FILL⟩` block; seed your real tasks into the ledger table, then delete the guidance notes. Keep the status vocabulary and update protocol as-is unless your workflow differs.
> Related: `delivery/01-phases-and-gates.md` (phase gates), `delivery/03-task-matrix.md` (summary view), `delivery/06-agent-build-architecture.md` (roles & protocols), `delivery/07-session-handoff.md`

## Purpose

This file is the **single source of truth for task status and dependencies** across the entire build.

- **Any agent:** Read this file at the start of every task to confirm prerequisites are met, and update your row when your task's state changes.
- **Gate agents:** Update the phase row in the Phase Overview table when a gate is signed.
- **No other file** decides overall project state — this is the ledger. The task matrix (`03-task-matrix.md`) is a derived summary view; if the two disagree, the ledger wins.

---

## Status Values

| Value | Meaning |
|---|---|
| `Not Started` | Prerequisites not yet met, or the phase is not yet open |
| `In Progress` | An agent has started; work is not complete |
| `Blocked` | Cannot proceed — reason recorded in the task's handoff log |
| `Done` | Exit criteria checked; handoff log filled; awaiting review |
| `Review: Passed` | Reviewed and passes — a gate may now count this task |
| `Review: Failed` | Review found issues — sent back to fix |
| `Gate: Pending` | All tasks in the phase are `Review: Passed`; gate check in progress |
| `Gate: Passed` | Gate signed; the next phase is unblocked |

⟨FILL: trim any statuses your workflow doesn't use (e.g. drop the `Review:`/`Gate:` rows if you have no separate review or gate step). Keep the vocabulary small and unambiguous.⟩

> **This vocabulary is a state machine.** Its legal transitions and gate preconditions are specified in `../enforcement/state-machine.md` and enforced by `../enforcement/scripts/validate-ledger.mjs` (run by `/task`, `/gate`, the pre-commit hook, and CI). A dependency counts as satisfied only when `Done` or `Gate: Passed`.

---

## Roles (summary)

Full roles, protocols, and edge-case rules live in `delivery/06-agent-build-architecture.md`. Read that file before this ledger.

- **Task agent** — executes one task spec; marks its row `Done`.
- **Review agent** — audits the output; marks the row `Review: Passed` or `Review: Failed`.
- **Gate agent** — runs the phase gate only after every row in the phase is `Review: Passed`.
- **Owner (human)** — approves inputs, signs the gate's owner row, resolves blockers.

⟨FILL: adjust to your team. If you build solo with no separate review/gate agents, collapse this to a single executing role and simplify the statuses to match.⟩

---

## Update Protocol (for agents)

1. **Before starting a task:** Confirm every row listed in "Depends On" shows `Done` or `Gate: Passed`. If not, do not start — set your row to `Blocked` and record the reason in the handoff log.
2. **When starting:** Change your row's Status to `In Progress`.
3. **When complete:** Change Status to `Done`. Fill in the handoff log in your spec file (see `delivery/07-session-handoff.md`). Tick the corresponding checkbox in `delivery/03-task-matrix.md`.
4. **Gate agent:** When all task rows in a phase show `Review: Passed`, open the gate spec, run the checklist, and collect sign-offs. When the gate passes, set the phase row in Phase Overview to `Gate: Passed` and flip the next phase's blocked rows to `Not Started` (unblocking them).

---

## Phase Overview

⟨FILL: one row per delivery phase. `{{PHASE}}` = your phase label; `{{GATE_FILE}}` = the gate spec's path. This is the top-level status board; the per-task tables below carry the detail.⟩

| Phase | Status | Gate File |
|---|---|---|
| {{PHASE-1}} — {{Phase name}} | `Gate: Passed` | ⟨e.g. planning locked, no code⟩ |
| {{PHASE-2}} — {{Phase name}} | `Not Started` | `delivery/gates/{{phase-2-gate}}.md` |
| … | … | … |

---

## Task Ledger

⟨FILL: one section per phase; one row per task. Use a stable `{{TASK-ID}}` scheme (e.g. `{{PHASE}}-01`, `{{PHASE}}-02`). "Depends On" lists the task IDs (or phase gates) that must be `Done` **or beyond** (`Review: Passed`, `Gate: Passed`) first. "Spec File" points to the task's execution contract — **copy `delivery/tasks/TEMPLATE-task-spec.md` for each task, and `delivery/gates/TEMPLATE-gate-spec.md` for each gate**, and keep the gate itself as the final row of each phase.⟩

### {{PHASE-2}} — {{Phase name}}

| Task ID | Task Name | Status | Depends On | Spec File |
|---|---|---|---|---|
| {{TASK-ID}} | {{Task name}} | `Not Started` | {{PHASE-1}} → `Gate: Passed` | `delivery/tasks/{{phase-2}}/{{task-id}}.md` |
| … | … | … | … | … |
| {{PHASE-2}}-GATE | **{{Phase name}} Gate** | `Not Started` | all {{PHASE-2}} tasks `Review: Passed` | `delivery/gates/{{phase-2-gate}}.md` |

<!-- Example task row (delete once you have real tasks):
| P2-01 | Project setup | `Not Started` | P1 → `Gate: Passed` | `delivery/tasks/p2/01-project-setup.md` |
-->

---

## Parallel Task Visibility

⟨FILL — list tasks that may run at the same time because no dependency links them. This is what lets an orchestrator (or you) fan out safely. Delete if you never run tasks in parallel.⟩

| Phase | Parallel group |
|---|---|
| {{PHASE}} | {{TASK-ID}} and {{TASK-ID}} can run in parallel after {{TASK-ID}} |

---

## Progress Summary

> Agent: update this section each time a phase gate passes.

| Metric | Value |
|---|---|
| Total tasks (excluding gates) | {{N}} |
| Total gates | {{N}} |
| Tasks Done | {{N}} |
| Gates Passed | {{N}} |
| Current phase | {{PHASE}} |
| Release target | {{MILESTONE — e.g. the final phase's sign-off}} |
