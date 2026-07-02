# 17 — External Integrations

> **Template** · Lifecycle: living · Owner: Lead · Load: Reference
> Fill: replace `{{}}` placeholders and list your real vendors in the integrations table. Keep the wrapper rule and every rule under "Rules for Every Wrapper" as-is.
> Delete this file if: the product calls **no external services**.
> Related: `03-project-map.md`, `15-error-handling.md`, `16-security-and-approval.md`, `07-testing-standards.md`

## Purpose

External services fail, change, rate-limit, and hold secrets. Calling their SDKs directly from business logic spreads that risk everywhere. **Wrap each one.**

---

## The Wrapper Rule

Every external service has **one wrapper module** under `{{WRAPPER LAYER}}` (e.g. `lib/`). All access goes through it. Business logic never imports the vendor SDK directly.

```
{{WRAPPER LAYER}}/
  {{auth}}/        → {{AUTH}} client + identity
  {{db}}           → {{DATA_ACCESS}} (database)
  {{email}}/       → {{EMAIL}}
  {{monitoring}}/  → {{ERROR_TRACKING}}
```

Each wrapper exposes a **domain-shaped interface**, not the raw vendor API — so a vendor can be swapped without touching callers.

---

## The Integrations

⟨FILL — one row per external service you actually call. This table mirrors the integration table in `03-project-map.md`; keep them in sync.⟩

| Service | Wrapper | Used for | Notes |
|---|---|---|---|
| {{AUTH}} | `{{lib/auth/}}` | ⟨FILL: login, sessions, identity⟩ | ⟨FILL: local/dev story⟩ |
| {{DATABASE}} | `{{lib/db}}` | ⟨FILL: data access⟩ | ⟨FILL⟩ |
| {{EMAIL}} | `{{lib/email/}}` | ⟨FILL: transactional email⟩ | ⟨FILL: local email sink⟩ |
| {{ERROR_TRACKING}} | `{{lib/monitoring/}}` | ⟨FILL: error/perf monitoring⟩ | ⟨FILL⟩ |
| {{LLM}} | `{{lib/llm/}}` | ⟨FILL — delete row if no AI calls⟩ | Paid — add usage awareness |

---

## Rules for Every Wrapper

- **Config, not constants:** credentials, endpoints, and timeouts come from env vars (see `16-security-and-approval.md`). Never hardcode.
- **Timeouts:** every external call has one.
- **Wrap errors:** convert vendor errors into domain errors (see `15-error-handling.md`); retry transient network failures within reason; surface hard failures clearly. **Never swallow.**
- **Leak guards:** a wrapper never emits restricted data outbound. Guard at the boundary so privileged fields can't be sent to a party that shouldn't see them (see `16-security-and-approval.md`).
- **Log without secrets:** log the call and its latency, never the payload secrets or sensitive data.
- **Mock in tests:** wrappers are mocked in unit/integration tests; verify local sends via a local sink, not real external calls (see `07-testing-standards.md`).

---

## Async / notification specifics

⟨FILL — delete if you send no email/notifications.⟩

- Don't block the HTTP response on a send — fire it **after** the core write succeeds (see `09-backend-architecture.md`).
- Message copy, subjects, and triggers come from ⟨your notification-copy spec⟩. Don't invent new copy inline.
- Never send restricted content to a party not allowed to see it (see `16-security-and-approval.md`).

---

## Adding a New Integration

1. Create `{{WRAPPER LAYER}}/<service>/` with a domain-shaped interface.
2. Put config in env vars; document them in `.env.example`.
3. Add a timeout, error wrapping, a leak guard, and a test mock.
4. If it's paid (e.g. {{LLM}}, SMS), add usage awareness.
5. Update the integration table in `03-project-map.md`.

> ⟨FILL: services explicitly out of scope (e.g. push, SMS) — don't add them without a product decision.⟩

---

## Forbidden Patterns

- ❌ Importing a vendor SDK from a controller, component, or service directly.
- ❌ External secrets in code or logs.
- ❌ A synchronous slow external call inside an HTTP handler.
- ❌ Emitting restricted data through a wrapper without a leak guard.
- ❌ Inventing notification copy instead of using the copy spec.

---

## Bottom Line

One wrapper per service exposing a domain interface, config from env, timeouts and wrapped errors everywhere, leak guards at the boundary, vendors mocked in tests — and no restricted data ever leaves through an integration.
