# Snip — Decision Record

> **EXAMPLE — filled instance, not a template.** A worked example of the Project Kit for a fictional URL shortener ("Snip"). Imitate the shape; don't edit these to build a real project. The blank templates live one level up.

**Purpose:** The single, canonical log of every locked design decision for **Snip**. All other documents — PRD, data model, workflows, governance hard lines, delivery plan — **derive from and point back to this file.** When a decision changes, change it **here first**, then update the docs that depend on it.

**Version:** 1.0
**Last updated:** 2026-07-01
**Status:** Decisions locked for v1. Open items tracked in Open Questions below.

> Mirrors the principle Snip itself follows: one source of truth (the database), everything else derived (all click counts come from the ledger).

---

## How to use this file

- **Every decision has a stable ID** (`D-1`, `D-2`, …). IDs are permanent — never renumber. Governance rules and code comments cite these IDs (the traceability spine).
- **To change a locked decision:** amend the row in place, bump the version, and add an entry to `logs/decisions-log.md`. Never silently overwrite history.
- **Unresolved items are marked `OPEN`** and tracked in Open Questions until they lock.

---

## A. Concept — what we're building

| ID | Decision | Rationale |
|---|---|---|
| D-1 | Snip is a **multi-tenant URL-shortener SaaS**: shorten a long URL → get a short code → share it → see how many people clicked. | A focused, well-understood job beats a broad tool no one finishes. |
| D-2 | Users are **individuals and small teams**. The core job is **"make a short link in seconds and know how many people clicked."** | Keeps every feature decision anchored to a single outcome. |
| D-3 | Snip is **NOT** a marketing-analytics suite, **NOT** a link-in-bio builder, **NOT** an ad network. | Names the tempting adjacencies we refuse, so scope doesn't creep. |

## B. Foundations — the shape of the thing

| ID | Decision | Rationale |
|---|---|---|
| D-4 | **Multi-tenant, single codebase, per-user isolation.** One deployment serves all users; each user's data is fenced off from every other's. | Cheapest to operate; isolation is enforced in the DB, not by convention (see D-10). |
| D-5 | The **database is the source of truth**; **short codes are generated server-side**. Clients never mint codes or hold authoritative counts. | Prevents collisions and client-forged data; all derived numbers trace to one place. |
| D-6 | Snip is a **web app** with **email + password auth**. | Lowest-friction form factor for the target user; no native apps in v1. |

## E. Security & access

| ID | Decision | Rationale |
|---|---|---|
| D-8 | A user may only read/write **their own** links and click data; there is no cross-user sharing in v1. | Isolation is the product's trust foundation; hardened as hard line D-10. |
| D-9 | Auth identity (the caller's JWT) is passed to the database so **row-level policies** decide visibility — not app code alone. | Defense in depth: even a buggy query can't leak another user's rows. |

## F. Domain hard lines

> The non-negotiables. These seed `governance/13-domain-hard-lines.md`. Kept to three.

| ID | Decision | Rationale |
|---|---|---|
| D-10 | **Tenant isolation** — a user only ever sees/edits their own links and click data. Enforced by Postgres **Row-Level Security** under the caller's JWT. | Cross-tenant leakage would destroy user trust and the product. A DB guarantee, not an app habit. |
| D-11 | **Short-code integrity** — a short code maps to **exactly one link for all time**; never reused or reassigned after a link is deleted. Enforced by a **unique constraint + a tombstone** on deleted codes. | Reusing a code would silently hijack a previously-shared URL — a security and trust failure. |
| D-12 | **Append-only click ledger** — click events are **inserted, never updated or deleted**; all counts are **derived** from the ledger. Enforced by a **trigger forbidding UPDATE/DELETE** on `click_events`. | Analytics must be trustworthy and auditable; a mutable ledger can't be trusted. |

## D. Data & lifecycle

| ID | Decision | Rationale |
|---|---|---|
| D-14 | Short codes are **7 characters, base62** (`[0-9A-Za-z]`), generated randomly server-side. | Closes GAP-1: ~3.5T keyspace makes collisions rare while keeping codes short. Concretizes the D-11 hard line; the tombstone-aware unique index still guarantees non-reuse regardless of length. |

## T. Tech stack

> Seeds the stack table in `governance/03-project-map.md`.

| ID | Decision | Rationale |
|---|---|---|
| D-7 | Stack: **Next.js (App Router)** · **TypeScript (strict)** · **PostgreSQL via Drizzle** · **Supabase Auth** · **Vercel** hosting · **Vitest + Playwright** tests. | One coherent, typed, serverless-friendly stack; Postgres RLS + Supabase Auth make the JWT-driven isolation in D-9/D-10 native. |

## R. Scope & horizon

| ID | Decision | Rationale |
|---|---|---|
| D-13 | **v1** = auth, link CRUD, redirect, click tracking, basic per-link analytics. **v2** = custom domains, QR codes, team sharing. | v1 delivers the whole core job end-to-end; growth features wait. Seeds `product/roadmap.md`. |

---

## Open questions (unresolved — resolve, then move into a section above)

| ID | Question | Owner | Status |
|---|---|---|---|
| H-1 | Do we rate-limit link creation per user in v1, or defer abuse controls to v2? | Lead | OPEN |

---

## Change history

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-06-24 | Initial concept + foundations captured (D-1…D-6). |
| 0.5 | 2026-06-27 | Hard lines D-10…D-12 locked; stack D-7 chosen; scope D-13 set. |
| 1.0 | 2026-07-01 | Short-code integrity clarified to soft-delete + tombstone (see `logs/decisions-log.md` LOG-001); GAP-1 closed by adding D-14 (7-char base62 short codes). Decisions locked for v1. |
