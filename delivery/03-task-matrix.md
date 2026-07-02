# Task Matrix

> **Template** · Lifecycle: living · Owner: Any agent · Load: Reference
> Fill: seed one row per phase-level task; update status alongside `02-task-ledger.md`.
> Related: `02-task-ledger.md` (task source of truth), `01-phases-and-gates.md`, `README.md`

## Purpose

The **status board**: a phase-grouped summary of where the work stands, so a human (or agent) sees the whole project at a glance without opening the ledger. This is a *summary view* — the authoritative task detail and dependencies live in `02-task-ledger.md`. Keep the two in sync: when you flip a status here, flip it there.

---

## Status vocabulary

Use these coarse values — this board is a summary, so finer ledger states (`Review: Passed`, `Gate: Pending`) collapse to the nearest value here:

| Status | Meaning |
|---|---|
| **Not Started** | Not yet begun. |
| **In Progress** | An agent is actively working it. |
| **Blocked** | Cannot proceed until a dependency clears (name the blocker). |
| **Done** | Complete and its exit criteria met. |
| **Gate: Passed** | The phase's sign-off gate has been signed off (`01-phases-and-gates.md`). |

Priority tags are optional: `(P0)` critical path · `(P1)` important · `(P2)` nice-to-have.

---

## Matrix

> ⟨FILL⟩ Replace with your phases and tasks. One `##` block per phase; one row per phase-level task. Use `{{PHASE}}` / `{{TASK-ID}}` and the owning function. Keep it coarse — this is a summary, not the ledger. Delete the example row once real rows exist.

## {{PHASE}} — ⟨FILL: Phase Name⟩

| Task ID | Owner | Task | Status | Notes / Spec |
|---|---|---|---|---|
| {{TASK-ID}} | ⟨function⟩ | ⟨FILL: what this delivers⟩ | Not Started | ⟨your spec doc⟩ |
| 2-1 *(example)* | Engineering | Implement app shell and navigation | In Progress | `../product/prd.md` §UI |

---

## Phase status roll-up

One row per phase — the top-line gate status.

| {{PHASE}} | Status | Gate |
|---|---|---|
| ⟨FILL: e.g. Phase 2 — Build Foundation⟩ | Not Started | ⟨gate criteria in `01-phases-and-gates.md`⟩ |

---

## Update protocol

| When | Who updates | What |
|---|---|---|
| Task complete | Executing agent | Row status here **and** in `02-task-ledger.md` |
| Gate passed | Gate agent | Phase roll-up row → `Gate: Passed`; log in `../logs/decisions-log.md` |
