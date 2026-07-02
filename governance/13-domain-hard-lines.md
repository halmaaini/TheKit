# 13 — Domain Hard Lines

> **Template** · Lifecycle: **populate-once — customize heavily** · Owner: Lead/Architect · Load: Always
> Fill: **replace the entire body with YOUR project's hard lines.** The examples below are illustrations, not rules to keep. Cite the decisions that justify each line (e.g. `(D-…)`).
> Related: `14-single-source-of-truth.md`, `16-security-and-approval.md`, and every doc that enforces one of your lines.

## Purpose

This is **the doc you customize most.** Every project has a small set of **non-negotiable guarantees** it cannot violate without becoming a different (or broken) product. This layer names them, explains *why* each one exists, and points at how each is *enforced* — in schema, in code, and in tests.

Keep it to **2–5 hard lines.** If everything is a hard line, nothing is. Each line must be:
- **Testable** — you can write a test that fails when it's violated.
- **Enforced at the strongest layer available** — a DB constraint beats app code beats a code-review checklist.
- **Traceable** — it cites the decision that made it a hard line.

> **Wire the check when you write the line — the harness enforces this.** Every hard line here must have a matching entry (`HL-<n>`) in `../enforcement/hard-lines.json`: greppable lines carry `patterns` **with fixtures proving they fire**; non-greppable lines carry `mechanical: false` plus the test that enforces them. One engine (`../enforcement/scripts/check-hard-lines.mjs`) runs the same checks in pre-commit, CI, and `/gate`, and its `--coverage` mode **fails when a line here has no wired check** (or a check no line). Use `/hardline` to do both halves in one loop, and add a row to the rule→mechanism map in `../enforcement/README.md`. Harness not installed yet (you're at START-HERE step 5)? Run the same engine from the kit source: `node ../enforcement/scripts/check-hard-lines.mjs …`. A hard line with no mechanical check is only a hope.

> ⟨FILL⟩ Delete everything below this line and write your project's hard lines using the template that follows. The two worked examples show the shape and the range.

---

## Template for each hard line

```
### <N> — <Name of the guarantee>   (D-<decision id>)

**The line:** <one sentence an agent can't misread — what must ALWAYS or NEVER happen>

**Why:** <the failure this prevents; what breaks in the product if it's crossed>

**Golden rules:**
✅ <the required pattern>
❌ <the forbidden pattern>

**Enforcement:**
- Schema/DB: <constraint, trigger, or policy — the strongest layer>
- Code: <the required pattern + the marker comment, see 08-code-comments>
- Test: <the exact test that fails on violation>
- Spot-check: <the `HL-<N>` entry in ../enforcement/hard-lines.json — the actual regex lives THERE, not (only) in prose>
```

---

## Worked example A — a data-governance product

*(An example for a data-governance / audit-heavy product. Your lines will differ.)*

### 1 — Provenance (D-M1)
**The line:** No generated document exists without a physical link to the exact committed inputs it came from.
**Why:** The product's promise is "this output came from these answers, by these people." Break the link and the promise is a lie.
**Enforcement:** NOT-NULL FK join table · write links in the same transaction as the content · test asserts a non-empty source set on every generation path.

### 2 — Append-only ledger (D-M2)
**The line:** Once a record is committed it is never edited or deleted; a change creates a new superseding record.
**Enforcement:** DB trigger forbidding `UPDATE`/`DELETE` on committed rows · revision workflow · test that mutation throws.

### 3 — Tenant isolation (D-M3)
**The line:** One tenant never sees another's data; isolation is a database guarantee, not an app-layer habit.
**Enforcement:** Row-Level Security under the caller's identity · every table ships a policy in the same migration · negative test returns zero rows across tenants.

### 4 — Agent-output safety (D-N4/N5)
**The line:** LLM output is validated before it touches the DB or control flow; deterministic code decides, models only produce content.
**Enforcement:** schema-validate every model response before persist · no model call outside the gateway · test that malformed output is rejected.

---

## Worked example B — a money/analytics product

*(A different domain — a billing/payments app — to show the range. Here numeric correctness, not audit trails, is what the product rests on.)*

### 1 — Money is integer minor units, never floats
**The line:** Monetary amounts are stored and computed as integer minor units (e.g. cents); floating-point money is never introduced anywhere.
**Enforcement:** integer/decimal column types only (no `float`/`double` for money) · one money helper is the sole place amounts are handled · test that a representative sum is exact to the cent.

### 2 — Totals are computed in one place, never in the UI
**The line:** Every derived amount (subtotal, tax, total) has one home in the domain layer; no component recomputes money from raw rows.
**Enforcement:** one implementation per figure (see `14`) · component grep finds no arithmetic on amounts · invariant tests on the calculator.

### 3 — The transaction ledger is append-only; balance is derived
**The line:** A posted transaction is never edited or deleted; a correction posts a new reversing entry, and the balance is the sum of the ledger.
**Enforcement:** DB trigger forbids `UPDATE`/`DELETE` on posted rows · balance is a `SUM` over entries, never a mutable column · test that a reversal preserves history and nets out.

---

## Bottom line

Name the few guarantees your product rests on, enforce each at the strongest layer you can, make each one testable, and trace it to a decision. Everything else in `governance/` should serve these lines.
