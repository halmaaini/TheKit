# 23 — Performance Budgets

> **Template** · Lifecycle: living · Owner: Architect · Load: Reference
> Fill: replace every `{{PLACEHOLDER}}` and `⟨FILL: …⟩` block with your concrete budget numbers and measurement tooling.
> Delete this file if: performance is **not a tracked concern for v1**.
> Related: `19-api-contract.md`, `12-data-access-and-schema.md`, `10-frontend-architecture.md`, `07-testing-standards.md`

## Purpose

Performance rots silently — each change adds a little, and one day the app is slow with no single culprit. Explicit budgets turn "feels slow" into a number CI can enforce, and a few universal anti-patterns (N+1 queries, unpaginated lists, unindexed filters) cause most of the damage. Measure first; optimize deliberately.

---

## Define budgets

Set explicit, checkable numbers. ⟨FILL your targets — keep the categories that apply.⟩

| Concern | Budget |
|---|---|
| UI bundle size | ⟨FILL: e.g. `{{KB}}` gzipped⟩ |
| LCP / TTI | ⟨FILL: e.g. LCP < 2.5s⟩ |
| API p95 latency | ⟨FILL: e.g. < 300ms⟩ |
| DB query time | ⟨FILL: e.g. < 50ms⟩ |

Measure them **in CI where possible** — a regression past budget fails the build.

---

## Golden rules

- ✅ **Paginate every list endpoint.** No unbounded result sets — use the one pagination scheme in `19-api-contract.md`.
- ✅ **Index columns used in `WHERE` / `ORDER BY`**, and every foreign key (see `12-data-access-and-schema.md`).
- ✅ **Cache deliberately, with an invalidation plan.** A cache with no invalidation story is a bug in waiting.
- ❌ **N+1 queries** — load related data in a set, not one query per row.
- ❌ **Premature optimization.** Don't complicate code for speed without a measurement showing it's needed.

---

## Enforcement

- Budget thresholds checked in CI (⟨FILL: bundle-size / latency / query-time gates in `20-ci-cd-and-deployment.md`⟩).
- A **perf smoke test** exercising the hot paths against their budgets (see `07-testing-standards.md`).
- A **grep / lint for unpaginated list endpoints** and obvious N+1 patterns in review.

---

## Bottom line

Set explicit budgets and check them in CI, paginate every list, index what you filter and sort on, kill N+1s, cache only with invalidation — and never optimize without a measurement to justify it.
