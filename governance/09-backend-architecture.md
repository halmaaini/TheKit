# 09 — Backend Architecture

> **Template** · Lifecycle: populate-once · Owner: Architect · Load: Reference
> Fill: replace the layer names, folder paths, and `{{FRAMEWORK}}`/`{{ORM}}`/`{{VALIDATION}}` placeholders with your stack; keep the layering rules and dependency direction.
> Delete this file if: the project has no backend (pure static / frontend-only).
> Related: `19-api-contract.md`, `12-data-access-and-schema.md`, `14-single-source-of-truth.md`, `16-security-and-approval.md`, `15-error-handling.md`

## Purpose

Define how the backend is structured so **business logic stays out of the HTTP layer** and every **authorization / ownership boundary is enforced in exactly one place.**

---

## Layers

⟨FILL⟩ Name your HTTP entry (e.g. `{{FRAMEWORK}}` route handlers / controllers) and the layers behind it. Keep the four-role separation; rename to fit your stack.

```
HTTP layer      →  parse + authorize + format     (thin — transport only)
   Service      →  business logic                 ({{lib/services/**}})
   Repository   →  data access                    ({{lib/repositories/**}})
   Domain       →  canonical calculations         ({{lib/domain/**}})
```

### Responsibilities

- **HTTP layer** — validate input with a schema (`05-type-safety.md`), run the auth guard, call **one** service, shape the response envelope, map errors. **No business logic, no direct data-access calls.**
- **Service** — all business logic. Receives validated input, returns domain types. Pure where possible.
- **Repository** — all data access ({{ORM}}/query builder/SQL). Returns typed rows. **Always scoped to the caller's owner boundary** (see Authorization).
- **Domain** — shared calculations that must have a single source of truth (`14-single-source-of-truth.md`).

**Dependency direction:** HTTP → service → repository → data store. Never the reverse. Services never import the HTTP framework.

---

## Anatomy of a Feature (recipe)

⟨FILL: keep the shape, swap in a feature from your product.⟩ Adding "`{{VERB}} a {{ENTITY}}`":

1. **Schema** — `{{lib/validation/<entity>.schema}}`: the input shape.
2. **Repository** — `{{lib/repositories/<entity>.repo}}`: `findById`, `update…` (owner-scoped).
3. **Service** — `{{lib/services/<entity>.service}}`: `{{verbEntity}}()` — applies the state transition and any derived updates via `{{lib/domain}}`.
4. **HTTP** — `{{route/controller path}}`: guard → parse → call service → envelope.
5. **Tests** — service unit test + integration test for the route **incl. a negative authorization case**.

This must match the endpoint already defined in your API contract (`19-api-contract.md`, `⟨your API spec⟩`).

---

## Authorization Lives Here, Once

- Every protected route runs the appropriate auth guard.
- Every repository query is **scoped to the authenticated caller's owner boundary** ({{e.g. tenant / account / user id}}). **No exceptions.**
- Fields that must not cross a role/visibility boundary are stripped by a **shared serializer** before any response that could expose them — never ad-hoc per endpoint.

Full rules: `16-security-and-approval.md`.

```
// repository — always owner-scoped
function find{{Entity}}(id, {{ownerId}}) {
  return db.{{entity}}.findFirst({ where: { id, {{ownerId}}, deletedAt: null } })
}
```

---

## Response & Error Shape

- Success: `{ data, error: null, meta }`.
- Error: `{ data: null, error: { code, message } }` with the right status.
- Map thrown domain errors to the envelope in **one** place. See `15-error-handling.md`.

---

## Transactions

Use a transaction when one logical action writes multiple rows (e.g. a single operation writes a parent row + N child rows + updates a derived counter). **All-or-nothing.**

---

## Async Work

⟨FILL: describe the project's async work, or state "none."⟩ Route slow/side-effect work (e.g. email, webhooks, notifications) through its wrapper (`17-external-integrations.md`); **don't block the response** on a slow send. Only introduce a job queue if the workload actually needs one.

---

## Forbidden Patterns

- Direct data-access calls inside the HTTP layer or a UI component.
- Business logic in the HTTP layer.
- A repository query without an owner scope.
- Per-endpoint hand-filtering of protected fields instead of the shared serializer.

---

## Bottom Line

Thin HTTP layer, logic in services, data access in repositories, calculations in domain. Every query is scoped to its owner, and every visibility line is enforced in one shared place.
