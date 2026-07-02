# Phase Implementation Map

> **Template** · Lifecycle: optional · Owner: Lead · Load: Reference
> Fill: replace every `{{PLACEHOLDER}}` and `⟨FILL⟩` block; keep the mapping table + dependency-chain sketch. Delete the guidance notes when done.
> Related: `delivery/01-phases-and-gates.md` (the delivery phases + gates), `delivery/02-task-ledger.md` (task status), `delivery/03-task-matrix.md` (summary view)
> Delete this file if: your phase model is **single-layer** — i.e. your delivery phases map 1:1 to your work units and there is no separate fine-grained implementation plan to reconcile. In that case fold anything useful into `01-phases-and-gates.md`.

## Purpose

Some projects carry **two phase systems**: a coarse set of **delivery phases** (with entry/exit gates, in `01-phases-and-gates.md`) and a finer set of **implementation phases** from a technical plan. When they don't line up 1:1, agents get confused about which "phase 3" is meant. This doc resolves that by mapping one onto the other, plus the **work units** (tasks) that sit under each.

Keep it to one page. If you only have one phase model, delete this file (see banner).

---

## The Map

⟨FILL — one row per delivery phase. Left to right: the coarse delivery phase → the fine implementation phase(s) it contains → where the work units for that phase live. This is the translation table between the two systems.⟩

| Delivery Phase | Implementation Phase(s) | Work Units (task files) |
|---|---|---|
| {{PHASE-1}} — {{Alignment/Planning}} | {{planning + specs}} | *(no code — planning only)* |
| {{PHASE-2}} — {{Phase name}} | {{impl phases N–M: short labels}} | `delivery/tasks/{{phase-2}}/` |
| {{PHASE-3}} — {{Phase name}} | {{impl phases N–M}} | `delivery/tasks/{{phase-3}}/` |
| … | … | … |

<!-- Example row (delete once real):
| P2 — Build Foundation | Impl phases 1–4: project setup, app shell, entity CRUD, seed data | delivery/tasks/p2/ |
-->

---

## Dependency Chain

⟨FILL — the strict order in which delivery phases unlock. One phase per line; each nested under the one it depends on. The parenthetical is the capability that phase delivers.⟩

```
{{PHASE-1}} (done)
    └── {{PHASE-2}}  ({{capability this phase delivers}})
            └── {{PHASE-3}}  ({{capability}})
                    └── {{PHASE-4}}  ({{capability}})
                            └── {{PHASE-N}}  ({{release-ready}})
```

**No phase may begin until the previous phase's gate is signed off** (see `delivery/01-phases-and-gates.md`).

---

## How a work unit maps up

⟨FILL — one worked example showing the full chain for a single task, so an agent can see how the three layers connect.⟩

> _Example shape:_ Task `{{TASK-ID}}` ({{task name}}) is one work unit of implementation phase `{{impl phase}}`, which rolls up into delivery phase `{{PHASE}}`. Its status is tracked in `delivery/02-task-ledger.md`; its gate is `{{PHASE}}`'s gate in `01-phases-and-gates.md`.

---

## Cross-Reference

`delivery/03-task-matrix.md` is the **status board** — agents tick it after completing each task. The task files under `delivery/tasks/…` are the **execution contracts** (the detail). This map is the **translation layer** between phase systems; keep it in sync when either system's phases change.

| When | Who updates | What |
|---|---|---|
| Task complete | Executing agent | Handoff log in the task file + checkbox in `03-task-matrix.md` |
| Phase gate passed | Gate agent | Phase Overview in `02-task-ledger.md` + phase row in `03-task-matrix.md` |
| A phase is added/renamed in either system | Lead | This map + `01-phases-and-gates.md` in the same commit |
