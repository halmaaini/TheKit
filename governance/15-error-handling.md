# 15 — Error Handling & Observability

> **Template** · Lifecycle: populate-once · Owner: Lead · Load: Always
> Fill: replace every `{{PLACEHOLDER}}` and `⟨FILL⟩` block — chiefly the error-code catalog — then delete the guidance notes.
> Related: `19-api-contract.md`, `09-backend-architecture.md`, `16-security-and-approval.md`, `17-external-integrations.md`

## Purpose

Make errors visible, understandable, and debuggable — so we don't troubleshoot from scratch every time. Most debugging time is wasted on errors that should have been obvious.

---

## Error categories

Every error maps to one category and one HTTP status. This mapping is universal — keep it.

| Category | HTTP | Notes |
|---|---|---|
| Validation (bad input) | 400 | Structured, field-level. From the validation boundary (`{{VALIDATION_LIB}}`). |
| Auth required | 401 | No / invalid session. |
| Forbidden | 403 | Authenticated but not allowed (wrong role / not owner). |
| Not found | 404 | Missing or hidden from this caller. |
| Conflict | 409 | State collision (e.g. resource already in the target state). |
| Business rule | 422 | A domain rule was broken, carrying a stable rule code. |
| System | 500 | Logged with full context; generic message to the user. |

---

## Standard error shape

Returned inside the envelope (see `19-api-contract.md`):

```json
{ "data": null, "error": { "code": "{{ERROR_CODE}}", "message": "Human-readable, safe to show." } }
```

`code` is a stable machine-readable string; `message` is safe to surface. Never put internal details, stack traces, or secrets in either.

### Error code catalog (stable, centralized)

Keep all codes in **one enum** (`{{ERROR_CODES_MODULE}}` — ⟨FILL: e.g. `lib/errors/codes.ts`⟩), which is the single source of truth. Never invent ad-hoc strings at the throw site; add the code to the enum first.

⟨FILL — replace the placeholders with your real codes, grouped by status. Keep the shape.⟩

- **401** `{{AUTH_REQUIRED}}`
- **403** `{{FORBIDDEN}}` · `⟨your authorization codes⟩`
- **400** `{{VALIDATION_ERROR}}` · `⟨your input-error codes⟩`
- **404** `{{NOT_FOUND}}`
- **409** `{{CONFLICT}}` · `⟨your state-collision codes⟩`
- **422** `⟨your business-rule codes⟩`
- **500** `{{INTERNAL_ERROR}}`

---

## Backend

Universal — keep:

- One error class/type per category; a **single handler** maps it to the envelope + status. Throw sites never build the HTTP response themselves.
- **Never swallow.** No empty `catch`. Either handle meaningfully or rethrow.
- Never catch as an untyped/`any` error — narrow it (see `05-type-safety.md`).
- System errors are logged with context and reported to your monitoring tool (`{{MONITORING_TOOL}}`); the user gets a generic message, never a stack trace.

```
// ✅ throw a coded, categorized error — the central handler formats it
if (⟨state conflict⟩) {
  throw new ConflictError('{{CONFLICT_CODE}}', 'Human-readable, safe to show.')
}
```

---

## Frontend / consumer

⟨FILL — delete if there is no UI.⟩

- One shared error component for inline/page errors; one error boundary for the unexpected.
- Never render a raw error object or stack to a user.
- Map known error codes to friendly copy (⟨FILL: where the user-facing strings live⟩).

---

## Logging

Universal — keep:

- **Structured** (e.g. JSON) logs. Standard fields: `timestamp, level, traceId, {{IDENTITY_FIELD}}, route, code, message, context`.
- Levels: **ERROR** (broke), **WARN** (recovered / suspicious), **INFO** (lifecycle), **DEBUG** (local only).
- **Never log secrets or sensitive data** — passwords, tokens, and anything your project classifies as sensitive (⟨FILL: the sensitive fields for your domain⟩; see `16-security-and-approval.md`).
- A `traceId` per request flows into both the logs and the error response, so a user-reported error maps to its log line.

---

## Forbidden patterns

- Empty / swallowing `catch` blocks.
- Generic errors with no code or context.
- Stack traces or raw errors shown to end users.
- Logging request bodies that may contain secrets or sensitive data.
- A code thrown at a call site that isn't in the central enum.

---

## Bottom line

Categorize the error, return `{ code, message }` with the right status from a central handler, surface it via shared UI, log it structured with a traceId — and never swallow it or leak sensitive data.
