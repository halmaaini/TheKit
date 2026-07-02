# 19 — API Contract & Data Fetching

> **Template** · Lifecycle: populate-once · Owner: Architect · Load: Reference
> Fill: replace every `{{PLACEHOLDER}}` and `⟨FILL⟩` block with your contract format and example routes, then delete the guidance notes.
> Related: `05-type-safety.md`, `09-backend-architecture.md`, `10-frontend-architecture.md`, `15-error-handling.md`, `16-security-and-approval.md`
> Delete this file if: the project has no API boundary.

## Purpose

The frontend/backend boundary is near-perfect *if* there is one source of truth for it. Bypassing the contract destroys that.

---

## The contract

- **The schema is the single source of truth** for every endpoint, payload, and enum. Keep it in one place (`{{CONTRACT_FILE}}` — ⟨FILL: e.g. an OpenAPI spec, a schema module, `product/data-model.md`⟩).
- Backend handlers must conform to it. Consumers must reach it through a **generated typed client**, not hand-rolled calls.
- When an endpoint changes: **update the contract first**, regenerate the client, then change code. Contract and code never drift.

---

## Generated client

- Generate a typed client from the contract (⟨FILL: your generator — e.g. `{{CLIENT_GENERATOR}}` producing typed request functions / query hooks⟩).
- Import from the generated client only. **No hand-written request calls. No hand-written response types.** (See `05-type-safety.md`.)

```
// ✅ typed, generated
const { data } = useGet{{Resource}}({ {{param}}: '{{VALUE}}' })

// ❌ hand-written request + implied types
const res = await fetch('/api/v1/{{resource}}?{{param}}={{VALUE}}')
```

---

## Standard shapes

One envelope, one error shape, one pagination shape — everywhere. Keep these; fill the specifics.

- **Response envelope:** `{ data, error, meta }`.
- **Error:** `{ code, message }` with the correct HTTP status. Codes come from the central catalog in `15-error-handling.md` — never invented per-endpoint.
- **Pagination:** one scheme for every list endpoint (⟨FILL: e.g. offset — `?page=&limit=` with `meta: { total, page, limit }`⟩). Every list uses it.
- **Filtering / sorting:** consistent query-param casing, enumerated per endpoint in the contract.

---

## Conventions

⟨FILL — keep the universal lines, replace the examples.⟩

- Versioned under `{{API_PREFIX}}` (e.g. `/api/v1`). A breaking change means a new version, not a silent change.
- Resource paths plural; non-CRUD actions as verb sub-paths (e.g. `/{{resource}}/:id/{{action}}`). See `04-naming-conventions.md`.
- The role/permission allowed per endpoint is declared in the contract and **enforced server-side** (see `16-security-and-approval.md`).
- Endpoints never leak fields a caller isn't entitled to — enforced by a shared serializer, documented in the contract.

---

## Every fetch handles four states

Loading, error, empty, success — on the consumer (see `10-frontend-architecture.md`). No silent failures, no perpetual spinners.

---

## Forbidden patterns

- Hand-written request calls or response types anywhere.
- Changing a route's shape without updating the contract first.
- A new list endpoint that invents its own pagination shape.
- Returning fields a caller isn't entitled to.
- An error code that isn't in the central catalog.

---

## Bottom line

The contract is law: update it first, generate the client, consume only the generated client, and keep one envelope / error / pagination shape everywhere.
