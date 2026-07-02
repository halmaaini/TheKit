# Snip — Key Workflows

> **EXAMPLE — filled instance, not a template.** A worked example of the Project Kit for a fictional URL shortener ("Snip"). Imitate the shape; don't edit these to build a real project. The blank templates live one level up.

> **Derived from `decisions.md` — change decisions there first.** These flows realize the features in `product/prd.md` over the entities in `product/data-model.md`. Use the exact entity/state names from `product/data-model.md`.

## How to read this

Each flow is the **happy path plus its edges**. Steps are terse and numbered; the **End state** is stated in terms of a `product/data-model.md` state where possible.

- **Actor** — who performs it · **Trigger** — what starts it · **Steps** — the ordered actions · **End state** — resulting data/system state · **Edge cases** — what can go wrong and what happens.

---

## 1. Sign up / log in

- **Actor:** Solo sharer or small-team member
- **Trigger:** User opens Snip and submits the email + password form.
- **Steps:**
  1. User submits email + password.
  2. Supabase Auth (D-7) creates or authenticates the account; a `user` row exists with a stable `id`.
  3. A session **JWT** is issued and attached to subsequent requests — this identity is what the database uses for isolation (D-9).
- **End state:** User is authenticated; requests carry a JWT that scopes every query to `owner_id = <this user>` (D-10).
- **Edge cases:**
  - Invalid credentials → rejected with `AUTH_INVALID`, no session issued.
  - Duplicate email on sign up → rejected with `AUTH_EMAIL_TAKEN`.
  - Missing/expired JWT on any later request → denied (see `governance/16-security-and-approval.md`).

---

## 2. Create a short link

- **Actor:** Authenticated user
- **Trigger:** User pastes a long URL and taps **Shorten**.
- **Steps:**
  1. User submits `target_url`.
  2. System **validates the URL** at the boundary (well-formed, http/https only) (see `governance/05-type-safety.md`).
  3. System **generates a unique `short_code` server-side** (D-5) — random over the agreed charset, checked against the unique index that also covers tombstones (D-11).
  4. A `link` row is created in state `active` with `owner_id` = the caller (from the JWT), `is_active = true`.
- **End state:** A new `link` is `active` and owned by the caller; the short URL is shown for sharing.
- **Edge cases:**
  - Invalid / non-http(s) URL → rejected with `LINK_URL_INVALID`, no row created.
  - Generated code collides with an existing or tombstoned code → regenerate and retry; never reuse (D-11).
  - Unauthenticated caller → denied (D-8, `governance/16-security-and-approval.md`).

---

## 3. Resolve & redirect (`GET /:code`)

- **Actor:** Any public visitor (no auth required to follow a link)
- **Trigger:** A visitor requests `GET /:code`.
- **Steps:**
  1. System looks up the `link` by `short_code`.
  2. If found **and** `is_active` (state `active`), respond **302** to `target_url` immediately.
  3. **After** issuing the redirect, record a `click_event` **asynchronously** (D-12) — the write must **never block or delay the redirect**.
- **End state:** Visitor is redirected; exactly one `click_event` is appended to the ledger (fire-and-forget, insert-only).
- **Edge cases:**
  - Code not found → `404` (`LINK_NOT_FOUND`), no redirect, no click recorded.
  - Link `disabled` or soft-deleted (tombstone) → `410 Gone` (`LINK_INACTIVE`), no redirect (D-13).
  - Click write fails → logged and dropped; the redirect already succeeded and is never rolled back (the redirect is the product; the click is best-effort).

---

## 4. View analytics (per-link click count)

- **Actor:** Authenticated user (the link's owner)
- **Trigger:** User opens their links list / a link's detail page.
- **Steps:**
  1. System lists the caller's `link` rows — **scoped by RLS** to `owner_id` = caller (D-10); no app-side owner filter is trusted alone.
  2. For each link, the click count is **derived** by counting its `click_event` rows (D-12) — never read from a stored counter.
  3. Counts are displayed per link.
- **End state:** User sees only their own links with trustworthy, ledger-derived click counts.
- **Edge cases:**
  - User tries to load another user's link (guessed id) → RLS returns **zero rows**; treated as not found (D-10).
  - Link with no clicks → count shows `0` (empty ledger for that link), not an error.

---

## Bottom line

The load-bearing flows are **resolve & redirect (flow 3)** and **view analytics (flow 4)**; both hinge on the hard lines — the redirect must never block the append-only click write (D-12), and analytics must be isolated by RLS and derived from the ledger (D-10, D-12).
