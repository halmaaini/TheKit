# 13 — Domain Hard Lines

> **EXAMPLE — filled instance, not a template.** A worked example of the Project Kit for a fictional URL shortener ("Snip"). Imitate the shape; don't edit these to build a real project. The blank templates live one level up.

## Purpose

This is **the doc Snip customizes most.** It names the small set of **non-negotiable guarantees** the product cannot violate without becoming broken or untrustworthy, explains *why* each exists, and points at how each is *enforced* — in schema, in code, and in tests.

Snip has **three** hard lines. If everything were a hard line, nothing would be. Each one is:
- **Testable** — a test fails when it's violated.
- **Enforced at the strongest layer available** — a DB constraint/trigger beats app code beats a review checklist.
- **Traceable** — it cites the decision that made it a hard line (`decisions.md`).

The three lines: **tenant isolation (D-10)** · **short-code integrity (D-11)** · **append-only click ledger (D-12)**.

---

### 1 — Tenant isolation   (D-10)

**The line:** A user only ever sees or edits **their own** links and click data. One user never reads or writes another user's rows — and isolation is a **database guarantee**, not an app-layer habit.

**Why:** Snip's entire trust proposition is "your links, your numbers." A single cross-tenant leak — one user seeing another's links or click counts — destroys that trust and the product. App-side `WHERE owner_id = ?` filters are one forgotten clause away from a breach; the database must enforce it even when a query is wrong.

**Golden rules:**
✅ Every query runs under the caller's **JWT**, and Postgres **Row-Level Security** restricts rows to `owner_id = auth.uid()`.
✅ Every user-owned table ships an RLS policy **in the same migration** that creates it.
❌ Never rely on an application-layer `WHERE owner_id = …` filter as the *only* thing keeping tenants apart.
❌ Never run user-facing reads under a service-role/admin key that bypasses RLS.

**Enforcement:**
- **Schema/DB:** `ALTER TABLE links ENABLE ROW LEVEL SECURITY;` + a policy `USING (owner_id = auth.uid())` for select/insert/update/delete; same for `click_events` (scoped through their link's owner). Policy ships in the table's migration.
- **Code:** the DB client always uses the request's JWT (never the service role for user requests). Marker comment: `// HARD-LINE D-10: caller JWT only; RLS enforces tenant isolation`.
- **Test:** negative test — as user A, query user B's link id → **zero rows returned** (not a filtered 200 that happened to be empty by app logic; RLS returns nothing).
- **Spot-check:** `grep` for `service_role` / admin keys in request-path code; any hit outside seed/migration scripts is a review stop.

---

### 2 — Short-code integrity   (D-11)

**The line:** A `short_code` maps to **exactly one link for all time**. It is generated server-side, **immutable**, and **never reused or reassigned** — not even after the link it belonged to is deleted.

**Why:** A short code is a public promise: whoever shared `snip.to/abc123` trusts it keeps pointing where it did. If a deleted code could be handed to a *new* link, an attacker could delete-then-recreate to **hijack a previously-shared URL** — silently redirecting someone else's audience. Codes must retire permanently.

**Golden rules:**
✅ Generate the code **server-side** (D-5) and enforce global uniqueness via a **unique index that also covers tombstones**.
✅ Delete is a **soft-delete + tombstone**: the row is marked deleted, the code is **retained** so it can never be reissued (see `logs/decisions-log.md` LOG-001).
❌ Never let a client supply or choose a `short_code`.
❌ Never `UPDATE` a `short_code`, and never **hard-delete** a link row (that would free the code for reuse).

**Enforcement:**
- **Schema/DB:** `short_code` column with a **partial unique index** spanning active *and* tombstoned rows (uniqueness across all codes ever issued); no `ON DELETE` that removes the code. Deletion sets a `deleted_at` tombstone rather than removing the row.
- **Code:** code generation retries on collision against that index; delete handler performs a soft-delete. Marker comment: `// HARD-LINE D-11: soft-delete + tombstone; short_code never reused`.
- **Test:** create link with code `X` → delete it → attempt to create a new link that resolves to code `X` → **rejected / regenerated to a different code**; also assert an `UPDATE links SET short_code = …` path does not exist / is blocked.
- **Spot-check:** `grep` for `DELETE FROM links` / hard-delete calls and any `short_code` assignment in update paths; both are review stops.

---

### 3 — Append-only click ledger   (D-12)

**The line:** `click_event` rows are **inserted, never updated or deleted**. Every click count is **derived** by counting the ledger — there is no mutable "count" column that can drift from the truth.

**Why:** Analytics is half the product ("know how many people clicked"). A mutable counter can be double-incremented, decremented, or corrupted, and no one can audit it after the fact. An append-only ledger is the only trustworthy basis for a number a user relies on — and it means the redirect never has to update shared state (it just appends), keeping flow 3 fast.

**Golden rules:**
✅ Record a click by **inserting** one `click_event`; compute counts with `COUNT(*)` over the ledger.
✅ Record the click **asynchronously, after** the 302 — the write **never blocks the redirect** (see `workflows.md` flow 3).
❌ Never `UPDATE` or `DELETE` a `click_event`.
❌ Never store an authoritative `click_count` column and mutate it in place.

**Enforcement:**
- **Schema/DB:** a **trigger** on `click_events` that `RAISE`s on `UPDATE` or `DELETE` (e.g. `BEFORE UPDATE OR DELETE ... RAISE EXCEPTION 'click_events is append-only (D-12)'`). No `click_count` column exists on `links`.
- **Code:** counts are always `COUNT(*)`-derived queries; the click writer only inserts. Marker comment: `// HARD-LINE D-12: append-only; counts derived from click_events`.
- **Test:** insert a `click_event`, then attempt `UPDATE`/`DELETE` on it → **throws** (trigger fires); and assert the analytics count for a link equals the number of ledger rows inserted.
- **Spot-check:** `grep` for `update(click_events` / `delete(click_events` and for any `click_count` field; both are review stops.

---

## Bottom line

Snip rests on three guarantees — **tenant isolation (D-10)**, **short-code integrity (D-11)**, and an **append-only click ledger (D-12)** — each enforced at the database (RLS policy · tombstone unique index · append-only trigger), each backed by a test that fails on violation, and each traced to its decision. Everything else in `governance/` serves these lines.
