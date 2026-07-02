# Delivery — Master Plan

> **Template** · Lifecycle: living · Owner: Lead · Load: Reference
> Fill: adapt the overview to your project; keep the source-of-truth order and the agent/human usage flows.
> Related: `01-phases-and-gates.md`, `02-task-ledger.md`, `03-task-matrix.md`, `04-risk-register.md`, `05-change-requests.md`, `06-agent-build-architecture.md`, `07-session-handoff.md`, `08-phase-implementation-map.md`, `../decisions.md`, `../product/prd.md`

## Purpose

This folder is the **execution engine** for the project: it turns the product specs and locked decisions into an operational plan an agent can run, one task at a time, with explicit ownership, dependencies, gates, and handoffs. Everything here answers a single question: *what is the next unblocked task, and is it safe to start?*

> ⟨FILL⟩ One paragraph: what building `{{PROJECT_NAME}}` means as a delivery effort — the shape of the work, roughly how many phases, and what "done" looks like. Pull scope from `../product/prd.md` and constraints from `../decisions.md`.

---

## Source-of-truth order

When documents conflict, resolve **top to bottom** — the higher source wins and the lower one gets corrected to match:

1. **`../decisions.md`** — the canonical locked-decision record. Nothing overrides it.
2. **Delivery docs** (this folder) — `02-task-ledger.md` is the task source of truth; phases/gates, risks, and CRs derive from it and from decisions.
3. **Product specs** — `../product/prd.md`, `data-model.md`, `workflows.md` and any `⟨your spec doc⟩`.

> Never edit a lower source to disagree with a higher one. Change the higher source first (log the ruling), then propagate down.

---

## How AGENTS use this folder

Read in this order at the start of a task:

1. **`06-agent-build-architecture.md`** — your role, protocols, and edge-case rules. Read this first.
2. **`02-task-ledger.md`** — the single source of truth for task status and dependencies. Pick the next unblocked task.
3. **`../logs/decisions-log.md`** — check for precedents or policy exceptions already set that affect your task.
4. Confirm every **"Depends On"** row for your task shows `Done` or `Gate: Passed` before starting.
5. Read the **task spec** the ledger points to (`⟨your spec doc⟩`, e.g. `../product/prd.md` §X or a phase spec).
6. Flip your ledger row to `In Progress` when you start, `Done` when complete, and log any ruling you had to make.

> **Starting from a handoff prompt?** Follow it exactly — it already names your immediate next action and the spec to read. See `07-session-handoff.md`.

---

## How HUMANS review progress

1. **`02-task-ledger.md`** — full project snapshot: what's done, in progress, blocked.
2. **`03-task-matrix.md`** — the phase-level status board (summary view of the ledger).
3. **`01-phases-and-gates.md`** — phase objectives and exit criteria; confirm gates are genuinely met.
4. **`04-risk-register.md`** — open risks and their mitigations.
5. **`05-change-requests.md`** — any scope changes and how they were decided.
6. **`../logs/decisions-log.md`** — rulings and disagreements resolved, including any made on your behalf.

---

## Operating model

- **Phased delivery** with explicit entry/exit criteria and cross-functional sign-off gates (`01-phases-and-gates.md`).
- **Parallel tracks where safe**, sequenced by the dependency chain in the ledger.
- **Explicit blockers and fallback paths** per phase — no silent stalls.
- **One task in flight per agent**; update the ledger the moment reality changes.

> ⟨FILL⟩ Note any project-specific delivery constraints here (fixed deadline, staged rollout, regulatory gate, pilot before GA, …), or delete this block.
