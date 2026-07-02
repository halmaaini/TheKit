# Phases, Gates, Dependencies, and Critical Paths

> **EXAMPLE — filled instance, not a template.** A worked example of the Project Kit for a fictional URL shortener ("Snip"). Imitate the shape; don't edit these to build a real project. The blank templates live one level up.

## Purpose

This document breaks Snip's build into ordered **phases**, each with an objective, entry/exit criteria, critical path, blockers, and a fallback. A phase advances only through a **cross-functional sign-off gate**. Day-to-day task status lives in `02-task-ledger.md`.

Each phase is small enough that its exit criteria are checkable by a reviewer — not a vibe.

---

## Phase 0 — Setup

### Objective
Stand up the project skeleton: Next.js + TypeScript (strict), Drizzle + Postgres, Supabase Auth, and the test harness (Vitest + Playwright) — so later phases have a working, typed, testable base (D-7).

### Entry Criteria
- `decisions.md` locked at v1; hard lines D-10/D-11/D-12 defined in `governance/13-domain-hard-lines.md`.

### Exit Criteria
- App builds and deploys to Vercel; `tsc --strict` passes with zero errors.
- Drizzle connects to Postgres; an empty migration runs cleanly.
- Vitest and Playwright each run a trivial passing test in CI.

### Critical Path
- Repo + toolchain → DB connection (Drizzle/Postgres) → test harness green.

### Blockers
- Supabase project / Postgres credentials not provisioned.

### Fallback
- Use a local Postgres container to keep DB tasks moving while cloud provisioning is pending.

---

## Phase 1 — Links + isolation

### Objective
Deliver authenticated link CRUD with **tenant isolation (D-10)** and **short-code integrity (D-11)** enforced at the database from day one.

### Entry Criteria
- Phase 0 gate passed (toolchain + DB + tests green).

### Exit Criteria
- `users` and `links` schema migrated, **each shipping its RLS policy in the same migration** (D-10).
- Server-side short-code generation with the tombstone-aware unique index (D-11); delete is soft-delete.
- Authenticated user can create / list / disable / delete **only their own** links.
- RLS **negative test** passes: user A cannot read user B's link (zero rows) (D-10).

### Critical Path
- Auth + JWT wiring → `users`/`links` schema + RLS policies → link CRUD handlers → short-code generation + tombstone index.

### Blockers
- Isolation model (JWT → RLS) not working end-to-end.

### Fallback
- If custom code-collision retry proves fiddly, widen the code length to reduce collisions while keeping the non-reuse guarantee (never relax D-11).

---

## Phase 2 — Redirect + clicks

### Objective
Deliver public `GET /:code` resolution with a fast 302 redirect and an **append-only click ledger (D-12)** written asynchronously, never blocking the redirect.

### Entry Criteria
- Phase 1 gate passed (links exist, are owned, and are isolated).

### Exit Criteria
- `GET /:code` returns 302 to `target_url` for `active` links; 404 for unknown, 410 for disabled/tombstoned (D-13).
- `click_events` table exists with the **append-only trigger** (UPDATE/DELETE throws) (D-12).
- A click is recorded **after** the redirect, asynchronously; a failed click write does not affect the redirect.
- Test: attempting to UPDATE/DELETE a `click_event` throws (D-12).

### Critical Path
- `click_events` schema + append-only trigger → resolver (`GET /:code`) → async click writer.

### Blockers
- Async click write coupling into the redirect path (would violate "never block the redirect").

### Fallback
- If the async queue isn't ready, use a fire-and-forget insert that is explicitly non-awaited on the redirect path — still insert-only (D-12).

---

## Phase 3 — Analytics

### Objective
Deliver basic per-link analytics: each of the user's links shows a click count **derived from the ledger** (D-12), visible only to the owner (D-10).

### Entry Criteria
- Phase 2 gate passed (clicks are being recorded append-only).

### Exit Criteria
- Links list shows a per-link click count computed as `COUNT(*)` over `click_events` — no stored counter (D-12).
- Counts are scoped by RLS to the owner; another user's link shows nothing (D-10).
- Test: displayed count equals the number of ledger rows inserted for that link.

### Critical Path
- Ledger-derived count query → links list UI → owner-scoped display.

### Blockers
- Count performance on high-click links (revisit aggregation only if needed — ledger stays append-only).

### Fallback
- If live `COUNT(*)` is too slow at volume, add a **materialized/derived** read model refreshed from the ledger — never a hand-mutated counter (preserves D-12).

---

## Gate sign-off rule

Each phase gate requires explicit sign-off from the accountable functions before the next phase starts:

| Function | Signs off on |
|---|---|
| Product | Scope and exit criteria are genuinely met. |
| Design | UX/flows meet the bar (light for Snip — mostly the create + analytics screens). |
| Engineering | Implementation is correct and criteria are demonstrably satisfied. |
| QA | User-facing workflows validated — especially the RLS negative test and the append-only trigger test. |

> Record each gate's pass in `03-task-matrix.md` (phase row → `Gate: Passed`) and log the ruling in `../logs/decisions-log.md`. **No phase begins until the previous phase's gate is signed off.**
