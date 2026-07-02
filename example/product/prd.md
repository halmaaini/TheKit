# Snip — Product Requirements

> **EXAMPLE — filled instance, not a template.** A worked example of the Project Kit for a fictional URL shortener ("Snip"). Imitate the shape; don't edit these to build a real project. The blank templates live one level up.

> **Derived from `decisions.md` — change decisions there first.** This doc restates and expands the *concept* and *scope* decisions (§A, §R). If a fact here disagrees with `decisions.md`, `decisions.md` wins.

## Problem

- **Long URLs are awkward to share and impossible to measure.** A person posting a link in a bio, a tweet, or a slide has no idea how many people actually clicked. Felt every time they share something they care about.
- **Existing shorteners overshoot.** They bundle heavyweight marketing dashboards, retargeting, and pricing tiers aimed at agencies — overwhelming for someone who just wants a tidy link and a click count (see `decisions.md` D-3).

---

## Users / personas

| Persona | Who they are | Core job they hire the product for |
|---|---|---|
| **Solo sharer** | A creator, developer, or freelancer sharing links from a bio or post | Turn a long URL into a short one in seconds and later see how many people clicked |
| **Small team** | 2–5 people sharing links for a side project or small brand | Same, but each member manages their own links without stepping on the others |

---

## Goals

- A **Solo sharer** can create a working short link in **under 15 seconds** from logging in.
- Every short link **redirects reliably** and records a click **without slowing the redirect**.
- A user can see a **per-link click count** that is trustworthy (derived from the raw event ledger, D-12).
- A user **never** sees or affects another user's links or click data (D-10).

## Non-goals

- **Marketing-analytics dashboards** (funnels, UTM breakdowns, retargeting) — out; that's a different product (D-3).
- **Link-in-bio pages / landing-page builder** — out; we shorten links, we don't host pages (D-3).
- **Public / anonymous link creation** — out; every link belongs to an authenticated owner (D-6, D-8).

---

## Scope (this release)

> v1 lets a **Solo sharer or small-team member** sign up, create and manage their own short links, have those links redirect and record clicks reliably, and view a basic per-link click count — with **tenant isolation (D-10)**, **short-code integrity (D-11)**, and an **append-only click ledger (D-12)** all guaranteed. It does not yet support custom domains, QR codes, or team sharing (deferred to v2, D-13).

---

## Key features

| Feature | For whom | Priority | Notes / links |
|---|---|---|---|
| Email + password sign up / log in | All | P0 | Flow 1 in `workflows.md`; Supabase Auth (D-7) |
| Create short link (validate URL → generate unique code) | All | P0 | Flow 2 in `workflows.md`; server-side code generation (D-5) |
| Manage own links (list, disable/enable, delete) | All | P0 | Delete = soft-delete + tombstone (D-11); disable flips `is_active` |
| Resolve `GET /:code` → 302 redirect + record click | Everyone (public visitors) | P0 | Flow 3; click recorded async, never blocks the redirect (D-12) |
| Per-link analytics (click count) | All | P0 | Flow 4; count derived from `click_events` ledger (D-12) |
| Custom domains, QR codes, team sharing | All | P2 | Deferred to v2 (`product/roadmap.md`, D-13) |

---

## Success metrics

| Metric | Baseline | Target | How measured |
|---|---|---|---|
| Time from login → first working short link | n/a (new) | < 15 s (median) | Client timing instrumented on the create flow |
| Redirect p95 latency | n/a | < 100 ms | Edge/server timing on `GET /:code` |
| Cross-tenant data leaks | n/a | 0 | RLS negative tests (D-10) + audit |

---

## Constraints & assumptions

- **Constraint:** Tenant isolation is a **database guarantee** via Postgres RLS under the caller's JWT, not app-layer filtering (D-9, D-10; `governance/13-domain-hard-lines.md`).
- **Constraint:** Short codes are **immutable and never reused** (D-11) — this shapes the delete flow (soft-delete, not hard delete).
- **Assumption:** Click volume per link is modest enough that a single Postgres table with an index serves v1 analytics. If a link goes viral (millions of clicks), we revisit aggregation — but the ledger stays append-only.

---

## Out of scope

- Custom domains — deferred to **v2** (see `product/roadmap.md`, D-13).
- QR codes — deferred to **v2**.
- Team sharing (one link visible to multiple members) — deferred to **v2**; v1 is strictly per-user (D-8).

---

## Bottom line

For a **Solo sharer**, v1 delivers **a short link in seconds plus a trustworthy click count**, while guaranteeing **tenant isolation, short-code integrity, and an append-only ledger** — and explicitly defers **custom domains, QR codes, and team sharing**.
