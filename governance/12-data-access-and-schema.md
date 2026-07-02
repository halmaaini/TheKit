# 12 — Data Access & Schema

> **Template** · Lifecycle: populate-once · Owner: Architect · Load: Reference
> Fill: replace every `{{PLACEHOLDER}}` and `⟨FILL⟩` block with your DB/ORM/migration reality, then delete the guidance notes.
> Related: `13-domain-hard-lines.md`, `09-backend-architecture.md`, `16-security-and-approval.md`
> Delete this file if: the project has no database.

## Purpose

Prevent schema drift, wrong types, missing indexes, and naming chaos. Schema mistakes are the hardest to undo, so prevent them up front. The canonical schema lives in `{{SCHEMA_FILE}}` (⟨FILL: e.g. your ORM schema / migrations dir / `product/data-model.md`⟩); this doc is the rules around it.

---

## Naming

⟨FILL⟩ Fill the right column to match `04-naming-conventions.md`. The rows are the concepts every schema has; the conventions are yours.

| Thing | Convention |
|---|---|
| Table / model | {{e.g. PascalCase singular}} |
| Column / field | {{e.g. camelCase in app, snake_case in DB}} |
| Foreign key | {{e.g. `<entity>Id`}} |
| Enum type / values | {{e.g. PascalCase type / UPPER_SNAKE values}} |
| Index | {{e.g. `idx_<table>_<columns>`}} |

Use the exact enum values already defined in the schema — don't introduce synonyms.

---

## Standard columns (every table)

Universal — keep regardless of stack:

- **`id`** — one stable primary-key convention for the whole schema (⟨FILL: e.g. UUID / bigint identity⟩). Pick one, use it everywhere.
- **`created_at`** — set on insert, never mutated.
- **`updated_at`** — set on every write, if your tables track it.
- ⟨FILL: any other column your project puts on *every* table — e.g. a soft-delete timestamp, a tenant key. Add only what's genuinely universal.⟩

> If `13-domain-hard-lines.md` names a hard line that requires a per-row column (e.g. a soft-delete marker, a tenant/owner key, a source/trust flag), that column belongs here and is enforced at the schema layer — not left to callers.

---

## Type rules

Store one canonical representation; convert/format at the edge. ⟨FILL — keep the universal lines, replace the examples with your domain's types.⟩

- **Numeric quantities:** store one canonical unit/precision; never store two unit copies of the same value. Convert at display. (If precision is a hard line, see `13-domain-hard-lines.md`.)
- **Percentages / ratios:** pick one scale (e.g. whole number 0–100 *or* fraction 0–1) and use it consistently.
- **Timestamps:** always timezone-aware; store UTC, apply timezone at display.
- **Enumerations:** use a real enum/constrained type, not a free-text status column.
- **Booleans:** explicit, non-null, with a default.
- ⟨FILL: domain-specific type decisions (which values are `{{NUMERIC_TYPE}}` vs string, etc.).⟩

---

## Casing boundary

The database and the application may use different casing (e.g. `snake_case` columns, `camelCase` app fields). **Map between them at exactly one boundary** — the data-access layer (`{{DATA_ACCESS_LAYER}}`). Above that boundary, code sees only app-casing; below it, only DB-casing. Never scatter ad-hoc renaming across services or components.

---

## Ownership & isolation

⟨FILL — delete if the product is single-tenant with no per-row ownership.⟩

- If records are owned (by a user, tenant, or parent entity), every query is scoped by that owner key; state the scoping rule here and in `16-security-and-approval.md`.
- If your project has a hard line requiring a *database-level* isolation guarantee (e.g. row-level security), define it in `13-domain-hard-lines.md` and enforce it here — the migration that adds a table ships its policy in the same change. Application scoping and the DB policy must agree.

---

## Indexing

Universal:

- **Index every foreign key.**
- Index columns used in common `WHERE` / `ORDER BY` (⟨FILL: your hot query paths — e.g. owner + date, status flags⟩).

---

## Migrations

Universal — keep, placeholder only the tool:

- One migration = one logical change. **Immutable once merged** — never edit a merged migration; add a new one.
- Generate and apply through `{{ORM}}` / `{{MIGRATION_TOOL}}` (⟨FILL: your generate + deploy commands; CI runs deploy⟩).
- **Destructive changes** (drop column/table) follow a documented expand-then-contract process, never a raw in-place drop.
- ⟨FILL: your delete policy — soft-delete vs hard-delete. If soft-delete, queries exclude deleted rows by default.⟩

---

## Forbidden patterns

- Storing a quantity as the wrong type, or storing two unit copies of one value.
- Nullable boolean status flags.
- A foreign key without an index.
- Editing a merged migration.
- Casing conversion scattered outside the one data-access boundary.
- ⟨FILL: a query that isn't scoped to its owner — if ownership applies.⟩

---

## Bottom line

One id + timestamp convention on every table, one canonical unit per value, real enums not strings, index every foreign key, immutable migrations, and casing mapped at a single boundary. Any per-row guarantee your product rests on (see `13`) is enforced here at the schema layer, not by callers.
