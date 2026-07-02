# {{PROJECT_NAME}} — Key Workflows

> **Template** · Lifecycle: living (derived) · Owner: Product/Architect · Load: Reference
> Fill: replace every `{{PLACEHOLDER}}` and `⟨FILL: …⟩` block. Add one numbered flow per key end-to-end path; regenerate when `decisions.md` or `product/prd.md` changes.
> Related: `decisions.md`, `product/prd.md`, `product/data-model.md`, `governance/16-security-and-approval.md`

> **Derived from `decisions.md` — change decisions there first.** These flows realize the features in `product/prd.md` over the entities in `product/data-model.md`. Use the exact entity/state names from `product/data-model.md`.

## How to read this

Each flow is the **happy path plus its edges**, described so an agent can trace it end-to-end. Keep steps terse and numbered. State the **End state** in terms of a `product/data-model.md` state where possible.

- **Actor** — who performs it (a persona from `product/prd.md`).
- **Trigger** — what starts it.
- **Steps** — the ordered actions.
- **End state** — the resulting data/system state.
- **Edge cases** — what can go wrong and what happens then (each should map to an error code in `governance/15-error-handling.md`).

---

## 1. {{FLOW_NAME — e.g. "Create and submit a {{THING}}"}}

- **Actor:** {{PERSONA}}
- **Trigger:** {{WHAT STARTS IT — e.g. "user opens {{SCREEN}} and taps {{ACTION}}"}}
- **Steps:**
  1. ⟨FILL: first action⟩
  2. ⟨FILL: system validates {{INPUT}} at the boundary (see `governance/05-type-safety.md`)⟩
  3. ⟨FILL: {{ENTITY}} is created in state `{{STATE_1}}`⟩
  4. ⟨FILL: {{ACTOR/SYSTEM}} advances it to `{{STATE_2}}`⟩
- **End state:** {{ENTITY}} is `{{STATE_2}}` and ⟨FILL: side effects — notification sent, linked to {{ENTITY_X}}⟩.
- **Edge cases:**
  - ⟨FILL: invalid {{INPUT}} → rejected with `{{ERROR_CODE}}`, no state change⟩.
  - ⟨FILL: {{ACTOR}} not authorized → denied (see `governance/16-security-and-approval.md`)⟩.
  - ⟨FILL: illegal transition (wrong source state) → rejected, state untouched⟩.

---

## 2. {{FLOW_NAME}}

- **Actor:** {{PERSONA}}
- **Trigger:** ⟨FILL⟩
- **Steps:**
  1. ⟨FILL⟩
- **End state:** ⟨FILL⟩
- **Edge cases:**
  - ⟨FILL⟩

---

> _Add flows 3…N — one per key end-to-end path in `product/prd.md`. Don't document trivial CRUD; document the flows where ordering, state, authorization, or provenance matter._

---

## Bottom line

⟨FILL⟩ One sentence: the load-bearing flows are **{{FLOW_1}}** and **{{FLOW_2}}**; both hinge on **{{THE STATE OR HARD LINE THAT MATTERS}}**.
