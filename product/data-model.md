# {{PROJECT_NAME}} — Data Model

> **Template** · Lifecycle: living (derived) · Owner: Architect · Load: Reference
> Fill: replace every `{{PLACEHOLDER}}` and `⟨FILL: …⟩` block. Regenerate when `decisions.md` §D changes — do not hand-edit to diverge.
> Related: `decisions.md`, `product/workflows.md`, `governance/03-project-map.md` (glossary), `governance/12-data-access-and-schema.md`, `governance/13-domain-hard-lines.md`

> **Derived from `decisions.md` — change decisions there first.** Entities, states, and invariants here come from `decisions.md` §D (data & lifecycle) and §F (hard lines). Use the exact nouns from the `governance/03-project-map.md` glossary — one name per concept.

## Entities

⟨FILL: one row per domain object. Keep `key fields` to the few that define the entity; the full column list lives in `governance/12-data-access-and-schema.md`.⟩

| Entity | Purpose | Key fields |
|---|---|---|
| **{{ENTITY_A}}** | {{WHAT IT REPRESENTS}} | `id`, {{FIELD}}, {{FIELD}}, `createdAt` |
| **{{ENTITY_B}}** | {{WHAT IT REPRESENTS}} | `id`, `{{ENTITY_A}}Id` (FK), {{FIELD}} |

---

## Relationships

⟨FILL: how entities connect. State cardinality plainly (one-to-many / many-to-many) and name the foreign key or join table.⟩

- **{{ENTITY_A}} 1 — ∗ {{ENTITY_B}}** — ⟨FILL: e.g. "a {{ENTITY_A}} has many {{ENTITY_B}}; FK `{{ENTITY_A}}Id` on {{ENTITY_B}}"⟩
- **{{ENTITY_B}} ∗ — ∗ {{ENTITY_C}}** — ⟨FILL: join table `{{join_table}}`⟩

> Optional: paste a small text ER sketch if it helps.
> ```
> {{ENTITY_A}} ──1:∗── {{ENTITY_B}} ──∗:∗── {{ENTITY_C}}
> ```

---

## Lifecycle / state machines

⟨FILL: for each entity that has a status, list its states and the legal transitions. Delete this section if nothing in the model is stateful. Illegal transitions must be rejected (see `governance/16-security-and-approval.md` → approval flow).⟩

**{{STATEFUL_ENTITY}}** — states and transitions:

- `{{STATE_1}}` → `{{STATE_2}}` — ⟨FILL: what triggers it, who may trigger it⟩
- `{{STATE_2}}` → `{{STATE_3}}` — ⟨FILL⟩
- `{{STATE_2}}` → `{{STATE_1}}` — ⟨FILL: or note "no path back"⟩

> Terminal states: {{STATE_3}} (⟨FILL: e.g. "immutable once reached"⟩).

---

## Invariants

⟨FILL: the must-always-hold rules over the data. Each one should read as a rule a test can assert, and each **seeds an invariant test** (see `governance/07-testing-standards.md`). Cite the decision or hard line behind it.⟩

- **{{INVARIANT}}** — ⟨FILL: e.g. "every {{ENTITY_B}} references exactly one existing {{ENTITY_A}} (no orphans)"⟩ — seeds test; (D-…).
- **{{INVARIANT}}** — ⟨FILL: e.g. "0 ≤ {{FIELD}} ≤ {{MAX}}" or "{{STATUS}} may only advance forward"⟩ — seeds test; (D-…).

---

## Provenance / immutability

⟨FILL — keep only if the product has hard lines about where data came from or that records can't change. Otherwise delete this section. Mirror the enforcement in `governance/13-domain-hard-lines.md`; do not restate the rule differently here.⟩

- **{{PROVENANCE / IMMUTABILITY LINE}}** — ⟨FILL: e.g. "a committed {{ENTITY}} is never edited or deleted; a change creates a new superseding record linked to the original"⟩.
- Enforced at: ⟨FILL: the strongest layer — DB constraint / trigger / policy⟩. Full statement and tests: `governance/13-domain-hard-lines.md`.

---

## Bottom line

⟨FILL⟩ One sentence: the model centers on **{{ENTITY_A}}** and **{{ENTITY_B}}**, its stateful piece is **{{STATEFUL_ENTITY}}**, and the invariants that seed tests are **{{INVARIANT_1}}** and **{{INVARIANT_2}}**.
