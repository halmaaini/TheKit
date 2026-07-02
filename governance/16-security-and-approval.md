# 16 — Security & Approval

> **Template** · Lifecycle: populate-once · Owner: Lead/Architect · Load: Reference
> Fill: replace `{{ROLE}}` and every `⟨FILL⟩` block with your project's roles, visibility rules, and approval flow. Keep the universal hard lines below; delete rows that don't apply.
> Related: `13-domain-hard-lines.md`, `09-backend-architecture.md`, `12-data-access-and-schema.md`, `15-error-handling.md`

## Purpose

If the product holds sensitive data or has more than one class of user, authorization mistakes are **critical bugs**. This doc is the day-to-day rule set: who may see and do what, and how that's enforced so the same guarantee holds even when app code has a bug. The universal rules below always apply; the specific roles, visibility matrix, and approval flow are yours to define.

---

## Identity comes from the session, never from the request

- The caller's identity and role are read from the **authenticated session** (e.g. a verified token claim), verified on **every** request.
- Never trust a role, tenant, or owner id supplied in the request body, query string, or a client-set header. Those are inputs, not identity.
- Resolve identity in one place (`{{AUTH ENTRY}}`, see `03-project-map.md`) so every handler authorizes against the same source.

---

## The Roles

⟨FILL — list each role and the scope of data/actions it owns. Keep it to the few roles that actually gate access; don't model org-chart nuance the code doesn't enforce.⟩

- **{{ROLE_A}}** — ⟨FILL: what it owns; the boundary it must never cross (e.g. "only its own {{TENANT}}")⟩
- **{{ROLE_B}}** — ⟨FILL: what it may see; the narrower scope⟩

---

## The Hard Lines

⟨FILL — the 2–4 authorization invariants this product cannot violate. State each as "X is always scoped to / stripped before / denied unless …". These belong to `13-domain-hard-lines.md` when they define the product; mirror the enforcement here.⟩

1. **{{TENANT/OWNER isolation}}.** Every query for `{{ROLE_A}}` is scoped to its `{{OWNER_ID}}`. It can never read another `{{ROLE_A}}`'s data.
2. **{{NARROW-role isolation}}.** Every query for `{{ROLE_B}}` is scoped to its own `{{SUBJECT_ID}}`.
3. **{{Privileged fields never leak}}.** Fields visible only to `{{ROLE_A}}` are stripped by a **shared serializer keyed on role** before any `{{ROLE_B}}`-facing response — never hand-filtered per endpoint.

```
// every scoped query — no exceptions (pseudocode)
db.<entity>.findFirst({ where: { id, {{OWNER_ID}}, deletedAt: null } })
```

---

## Visibility matrix

⟨FILL — one table mapping which fields each role may see. This drives the shared serializer. Delete if you have a single role.⟩

| Restricted to {{ROLE_A}} | Visible to {{ROLE_B}} (when shared) |
|---|---|
| {{FIELD}} | {{FIELD}} |
| {{FIELD}} | {{FIELD}} |

Enforce with the shared serializer keyed on role — **never** ad-hoc per endpoint (see `09-backend-architecture.md`).

---

## Authorization is enforced server-side, with defense in depth

- **App layer:** guards on every route + owner/tenant scoping in the data-access layer.
- **Data layer:** where the store supports it, a row-level policy that rejects unauthorized rows **even if the app has a bug** (e.g. row-level security, tenant-scoped views). App scoping and the data-layer policy must agree, and ship in the same migration (see `12-data-access-and-schema.md`).
- **Never** rely on the frontend for an authorization decision — the frontend only hides; the server denies.

---

## Approval flow (project-specific)

⟨FILL: your approval / state-transition flow — the sequence of states a record moves through, who may advance it, and what makes a transition valid. Delete this section if the product has no approval/review step.⟩

> _Shape to fill:_ a record moves through `{{STATE_1}} → {{STATE_2}} → {{STATE_3}}`; only `{{ROLE}}` may advance it; each transition is validated server-side and rejected with a stable error code (see `15-error-handling.md`) if the source state or actor is wrong. Illegal transitions never mutate state.

---

## Input & secrets (universal)

- **Validate all input at the boundary** with a schema (see `05-type-safety.md`). Never trust client-provided ids without an ownership check.
- Use only the data-access layer / parameterized queries — **never** string-built queries.
- **Secrets live in env vars only** (see `03-project-map.md`); never in code, never in the VCS, never in logs (see `15-error-handling.md`).
- Set the standard security headers (e.g. HSTS, X-Frame-Options, CSP) at the edge. ⟨FILL: your header policy / where it's configured.⟩

---

## Audit sensitive events

Record an audit entry for security-relevant actions — auth events, permission changes, and any privileged state transition. ⟨FILL: which events you audit, where the trail is written, and its retention.⟩ Never put secrets or full sensitive payloads in the audit record.

---

## Always test the negative case

For every protected resource, write a test that a **wrong role / non-owner is denied** (e.g. 403) — not just that the owner is allowed (see `07-testing-standards.md`).

---

## Forbidden Patterns

- ❌ A data-access query without an owner/tenant scope.
- ❌ Reading identity, role, or owner id from request input instead of the session.
- ❌ Per-endpoint hand-filtering of restricted fields instead of the shared serializer.
- ❌ Authorization checks done only in the frontend.
- ❌ String-interpolated queries; secrets in code or logs; sensitive data in audit records.

---

## Bottom Line

Identity from the session (never the request), authorization enforced server-side and again in the data layer, restricted fields stripped by one shared serializer, input validated at the boundary, secrets in env, sensitive events audited — and every protected path proven with a negative test.
