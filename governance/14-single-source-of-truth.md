# 14 — Single Source of Truth

> **Template** · Lifecycle: living · Owner: Lead · Load: Always
> Fill: replace every `{{PLACEHOLDER}}` and `⟨FILL⟩` block; populate the canonical-values table as values are born.
> Related: `decisions.md`, `13-domain-hard-lines.md`, `09-backend-architecture.md`

## Purpose

Duplication is the root cause of "the dashboard says 75% but the profile says 80%." For every important fact, there is **one place** it is defined, and everything else derives from it. This document names those places and the values they own.

---

## The two sources of truth

Distinguish the two — they answer different questions and live in different places:

- **Design SoT — `decisions.md`.** The canonical record of *locked decisions*: what we're building and the rules we chose. When a decision changes, change it **there first**, then update derived docs. Never edit a derived doc to disagree with `decisions.md`.
- **Runtime SoT — the database.** The canonical record of *current facts* at run time. Derived/cached values (aggregates, denormalized columns, cached UI state) are computed from it, never the reverse.

Everything else — docs, cached fields, UI state — is **derived** from one of these two and must not silently diverge from it.

---

## The rule (derived values)

- Every canonical value has exactly **one implementation**, in the domain layer (`{{DOMAIN_LAYER}}` — ⟨FILL: e.g. `lib/domain/`⟩).
- The boundary (API/service) returns the pre-computed value. **Consumers never recalculate it.**
- If you need a canonical value, import the one function — never re-derive it inline.

---

## The canonical values

⟨FILL — the highest-value section. One row per value your product computes and reuses. Add a row the moment a new canonical value is born; put its implementation in the domain layer. This table is the index of "where is X defined."⟩

| Value | Source of truth | Definition | Invariants |
|---|---|---|---|
| **{{VALUE}}** | `{{path/to/impl}}` | {{one-line definition — or "full spec: ⟨your spec doc⟩"}} | {{the invariant that must always hold, e.g. `0 ≤ x ≤ 100`}} |
| **{{VALUE}}** | `{{path/to/impl}}` | {{…}} | {{…}} |

> Justify each value's existence with a decision cite where relevant (e.g. `(D-…)`).

---

## How it flows

```
{{DOMAIN_LAYER}}/<value>     ← the ONLY implementation
        │
   service layer             ← calls it
        │
   boundary response         ← returns the value
        │
   consumer (UI/caller)      ← displays it, never recomputes
```

---

## Forbidden patterns

- A second implementation of any canonical value anywhere.
- A consumer computing a canonical value from raw rows.
- Two endpoints/paths computing the same value differently.
- Hardcoding a threshold/parameter that belongs in config or a record.
- Editing a derived doc or cached field to disagree with its source of truth.

---

## Spot check

⟨FILL — greps that prove each value has exactly one home and consumers only display it.⟩

```bash
# there should be exactly one home for each canonical value
grep -rln "{{FORMULA_FRAGMENT}}" {{SEARCH_PATHS}}
```

---

## Bottom line

Two sources of truth — `decisions.md` for design, the database for runtime — and everything else derives from one of them. One implementation per canonical value in the domain layer, returned by the boundary, displayed (never recomputed) downstream. Add a row above whenever a new canonical value is born.
