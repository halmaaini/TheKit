# Snip — Data Model

> **EXAMPLE — filled instance, not a template.** A worked example of the Project Kit for a fictional URL shortener ("Snip"). Imitate the shape; don't edit these to build a real project. The blank templates live one level up.

> **Derived from `decisions.md` — change decisions there first.** Entities, states, and invariants here come from `decisions.md` §B/§F. Use the exact nouns from the glossary — one name per concept.

## Entities

| Entity | Purpose | Key fields |
|---|---|---|
| **user** | An authenticated account (individual or team member) that owns links | `id`, `email`, `created_at` |
| **link** | A short code that redirects to a target URL, owned by one user | `id`, `owner_id` (FK → user), `short_code` (UNIQUE), `target_url`, `is_active`, `created_at` |
| **click_event** | One recorded visit to a link — the raw, append-only analytics row | `id`, `link_id` (FK → link), `occurred_at`, `referrer`, `country`, `ua_hash` |

> `ua_hash` stores a hash of the user agent, not the raw UA — no PII in the ledger.

---

## Relationships

- **user 1 — ∗ link** — a user has many links; FK `owner_id` on `link`. A link's `owner_id` is set at creation and **never changes** (invariant below).
- **link 1 — ∗ click_event** — a link has many click events; FK `link_id` on `click_event`. Click events are only ever inserted (D-12).

> ```
> user ──1:∗── link ──1:∗── click_event   (append-only)
> ```

---

## Lifecycle / state machines

A **link** has a simple active/disabled lifecycle. Its `short_code` is **not** part of the lifecycle — the code is fixed for all time (D-11).

- `active` → `disabled` — owner disables the link (`is_active = false`). The code still exists and is still reserved, but `GET /:code` no longer redirects (returns 404/410).
- `disabled` → `active` — owner re-enables the link. Same code, redirect resumes.
- `active`/`disabled` → **soft-deleted (tombstone)** — owner deletes the link. The row is marked deleted and the code is **retained as a tombstone**; it is never redirected again and **never reissued** to a new link (D-11; see `logs/decisions-log.md` LOG-001).

> Terminal state: **soft-deleted / tombstone**. There is no path back — a deleted code stays retired forever. The short code is fixed from creation and survives every state change.

---

## Invariants

- **Short-code uniqueness + immutability + non-reuse** — every `link.short_code` is unique across all links (including tombstones), is set once at creation and never edited, and is never assigned to a second link even after the first is deleted — seeds test; (D-11).
- **Owner never changes** — a `link.owner_id` set at creation is never updated to a different user — seeds test; (D-8).
- **No orphan click events** — every `click_event` references exactly one existing `link` — seeds test; (D-5).
- **Click ledger append-only** — no `click_event` row is ever updated or deleted after insert — seeds test; (D-12).
- **Redirect only when active** — `GET /:code` produces a 302 only if the link is `active` (not disabled, not tombstoned) — seeds test; (D-13).

---

## Provenance / immutability

- **Append-only click ledger** — a `click_event` is never edited or deleted; the true click count for a link is **derived** by counting its ledger rows, never stored as a mutable counter (D-12).
- Enforced at: a **Postgres trigger** that raises on `UPDATE`/`DELETE` of `click_events`. Full statement and tests: `governance/13-domain-hard-lines.md` (hard line 3).

- **Short-code tombstone** — a deleted link's `short_code` is retained (soft-delete) so the code can never be reissued (D-11).
- Enforced at: a **partial unique index** covering all codes including tombstones. Full statement and tests: `governance/13-domain-hard-lines.md` (hard line 2).

---

## Bottom line

The model centers on **link** (owned by a **user**) and its append-only **click_event** ledger; its stateful piece is **link** (`active`/`disabled`/tombstone, code fixed), and the invariants that seed tests are **short-code uniqueness/immutability/non-reuse (D-11)** and **append-only click ledger (D-12)**.
