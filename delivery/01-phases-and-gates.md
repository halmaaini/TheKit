# Phases, Gates, Dependencies, and Critical Paths

> **Template** · Lifecycle: living · Owner: Lead/QA · Load: Reference
> Fill: replace the worked example with YOUR phases; keep the per-phase structure and the sign-off gate rule.
> Related: `README.md`, `02-task-ledger.md`, `03-task-matrix.md`, `04-risk-register.md`

## Purpose

This document breaks the build into ordered **phases**, each with an objective, entry/exit criteria, critical path, blockers, and a fallback. A phase advances only through a **cross-functional sign-off gate**. Agents use it to know *what a phase is trying to achieve* and *what "done" means*; the day-to-day task status lives in `02-task-ledger.md`.

Keep each phase small enough that its exit criteria are checkable. Every exit criterion must be something a reviewer can verify — not a vibe.

---

## Per-phase structure

Give **every** phase these six sections. The worked example below shows the shape; replace it with your real phases (`{{PHASE}}` = a delivery phase, e.g. Phase 2).

```
## {{PHASE}} — {{Phase Name}}

### Objective
⟨FILL: one or two sentences — what this phase delivers.⟩

### Entry Criteria
- ⟨FILL: what must be true/signed-off before this phase starts (usually the prior gate).⟩

### Exit Criteria
- ⟨FILL: verifiable outcomes that let the gate pass. One bullet per checkable result.⟩

### Critical Path
- ⟨FILL: the ordered chain that gates everything else, e.g. A -> B -> C.⟩

### Blockers
- ⟨FILL: the known things that would stall this phase.⟩

### Fallback
- ⟨FILL: the reduced-scope path if a blocker hits, so the phase can still close.⟩
```

> ⟨FILL⟩ Delete the worked example below and list your project's phases using the structure above. Most projects need 4–7. Keep them sequenced by the dependency chain in `02-task-ledger.md`.

---

## Worked example (illustration — replace)

*(Generic "foundation" phase. Yours will differ in objective and criteria.)*

## Phase 2 — Build Foundation

### Objective
Stand up the application shell, navigation, and the first core domain so later phases have something to build on.

### Entry Criteria
- Phase 1 gate passed (architecture, schema, and access model signed off).

### Exit Criteria
- App shell and primary navigation working end-to-end.
- First core entity supports full create/read/update with its status lifecycle.
- Access rules enforced at the boundary (unauthorized routes return nothing).

### Critical Path
- Access layer -> core domain model -> primary UI shell.

### Blockers
- Auth or tenant-isolation model unresolved.

### Fallback
- Temporarily simplify secondary settings while preserving the data-isolation guarantee.

---

## Gate sign-off rule

Each phase gate requires explicit sign-off from the accountable functions before the next phase starts:

| Function | Signs off on |
|---|---|
| Product | Scope and exit criteria are genuinely met. |
| Design | UX/flows meet the bar (omit if no UI). |
| Engineering | Implementation is correct and criteria are demonstrably satisfied. |
| QA | Released/user-facing workflows validated (required when the phase ships behavior). |

> ⟨FILL⟩ Adjust the function list to your team. Record each gate's pass in `03-task-matrix.md` (phase row → `Gate: Passed`) and log the ruling in `../logs/decisions-log.md`. **No phase begins until the previous phase's gate is signed off.**

---

## Optional — Delivery phase → implementation phase map

Use this **only if you run two phase layers**: coarse delivery phases (this doc) mapped onto a finer set of implementation phases in your spec. It resolves the "which phase do you mean?" ambiguity by pinning one to the other.

> Delete this subsection if your phase model is single-layer.

| {{PHASE}} (delivery) | Implementation phases (spec) | Task spec |
|---|---|---|
| ⟨FILL: e.g. Phase 2 — Build Foundation⟩ | ⟨FILL: e.g. impl phases 1–4⟩ | ⟨your spec doc / phase spec⟩ |

> The delivery phase is the **gate**; the implementation phases are the **detail** that must all complete before that gate can pass.
