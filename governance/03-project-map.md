# 03 — Project Map

> **Template** · Lifecycle: populate-once · Owner: Lead/Architect · Load: Always
> Fill: replace every `{{PLACEHOLDER}}` and `⟨FILL⟩` block with your project's reality, then delete the guidance notes. Keep it to ~one page.
> Related: `decisions.md` (§ stack), `09-backend-architecture.md`, `17-external-integrations.md`

## Purpose

The read-first document. Before writing code, an agent must know **what the product is, what exists, where it lives, and the exact words we use.** Without this, agents create files in the wrong place, duplicate what exists, and invent names for things that already have one.

---

## What this product is

⟨FILL⟩ One paragraph: what `{{PROJECT_NAME}}` does, who uses it, and — just as important — **what it is NOT** (name the adjacent things it's easy to mistake it for). Pull this from `decisions.md`.

> _Example shape:_ "A `{{ONE-LINE CATEGORY}}` for `{{PRIMARY USER}}`. It is *not* `{{THE THING PEOPLE WILL ASSUME}}`. It helps `{{USER}}` `{{CORE JOB}}`."

Surfaces (delete if single-surface):

- **{{SURFACE 1}}** — ⟨FILL: who uses it, its character⟩
- **{{SURFACE 2}}** — ⟨FILL⟩

Full product context: `product/prd.md`.

---

## Tech stack

⟨FILL from `decisions.md` § stack. Delete rows that don't apply; add rows you need.⟩

| Layer | Choice |
|---|---|
| Framework | {{FRAMEWORK}} |
| Language | {{LANGUAGE}} |
| Styling / UI | {{UI}} |
| State | {{STATE}} |
| Validation | {{VALIDATION}} |
| Data access / ORM | {{DATA_ACCESS}} |
| Database | {{DATABASE}} |
| Auth | {{AUTH}} |
| Background work | {{JOBS}} |
| External services | {{INTEGRATIONS}} |
| Hosting | {{HOSTING}} |
| Tests | {{TEST_STACK}} |

---

## Structure & boundaries

⟨FILL⟩ Describe how the codebase is organized (monorepo vs single app; separation by package vs route group) and paste the top-level folder tree with a one-line purpose + who-may-use-it per folder.

```
{{FOLDER TREE — annotate each top-level dir with its purpose and access scope}}
```

### Import boundary rules

⟨FILL⟩ The rules that keep the import graph clean. State them as "X may import Y, never Z." Typical lines:

- {{ROLE/PACKAGE A}} may import {{SHARED}}, never {{ROLE/PACKAGE B}}.
- Business logic lives in `{{DOMAIN LAYER}}`, never in components or route handlers (see `09-backend-architecture.md`).
- Everything crossing the wire is validated by a schema from `{{VALIDATION LAYER}}` (see `05-type-safety.md`).
- Vendors are wrapped in `{{WRAPPER LAYER}}` — never called raw (see `17-external-integrations.md`).

---

## Entry points

⟨FILL⟩ Where execution starts, so an agent can trace the system:

- App boots at `{{ENTRY FILE}}`.
- API/handlers start at `{{API ENTRY}}`.
- Auth + identity resolution: `{{AUTH ENTRY}}`.

---

## External integrations

⟨FILL — one wrapper per service; delete if none. Mirror this table in `17-external-integrations.md`.⟩

| Service | Wrapper | Purpose |
|---|---|---|
| {{SERVICE}} | `{{lib/...}}` | {{WHAT FOR}} |

---

## Glossary (domain language — use these exact words)

⟨FILL — the single highest-value section. Every domain noun/verb, defined once, so agents and code use one name per concept. Match these words to your data model and API.⟩

| Term | Meaning |
|---|---|
| **{{TERM}}** | {{DEFINITION — include lifecycle/states if it has them}} |
| **{{TERM}}** | {{DEFINITION}} |

Full object model: `product/data-model.md`.

---

## Bottom line

⟨FILL⟩ One sentence capturing the shape: {{e.g. "One app, two role-separated surfaces, one database; logic in the domain layer, validation at the boundary, vendors behind wrappers."}}
