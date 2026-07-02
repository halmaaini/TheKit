# 07 — Testing Standards

> **Template** · Lifecycle: living · Owner: Lead/QA · Load: Reference
> Fill: replace the `{{TEST_RUNNER}}` placeholders and the `⟨FILL⟩` "what must be tested" list with your project's real test tools and non-negotiable coverage; keep the rules.
> Related: `13-domain-hard-lines.md`, `16-security-and-approval.md`, `14-single-source-of-truth.md`

## Purpose

Define what gets tested and how, so tests catch real bugs and document expected behavior. This doc is the rules an agent follows while writing tests. If a fuller strategy/CI-wiring doc exists, point at it here: ⟨FILL: `⟨your test-strategy doc⟩` or delete this line⟩.

---

## Tools

⟨FILL from `decisions.md` § stack. Keep the rule ("one tool per layer"), replace the choices.⟩

| Layer | Choice |
|---|---|
| Unit + Integration | {{UNIT_TEST_RUNNER}} |
| End-to-end | {{E2E_RUNNER}} |

---

## Test Pyramid

```
   E2E (few)          critical journeys only
 Integration (some)   API boundary, authorization, data access
   Unit (many)        calculations, guards, utils
```

---

## What MUST Be Tested

These are non-negotiable. ⟨FILL: replace the bullets with your project's must-test list; keep the *categories* — hard lines, authorization, boundary validation, critical journeys.⟩

- **Every domain hard line** — write the test that fails when the line is crossed (see `13-domain-hard-lines.md`). Cover edge cases and invariants.
- **Every value with a single source of truth** — one place computes it; test that place directly (see `14-single-source-of-truth.md`).
- **Every authorization rule** — both positive *and* negative cases. An unauthorized caller must *fail* to reach protected data/routes (see `16-security-and-approval.md`).
- **Every boundary schema** — valid input passes, invalid input is rejected (see `05-type-safety.md`).
- **Every state transition** in your core lifecycle — legal transitions succeed, illegal ones throw.
- **The critical end-to-end journeys** — ⟨FILL: list the 3–8 flows a release cannot ship broken⟩.

## What SHOULD Be Tested

Components/units with logic, complex hooks, anything with branching.

## What Does NOT Need Tests

Pure layout, trivial getters, simple display formatting.

---

## Rules

- **Preserve passing tests.** Never edit a test to make broken code pass (see `01-agent-rules.md`).
- **No untyped escape hatches in tests.** Use typed factory functions for fixtures — a test that lies about types is not a test.
- **Every test asserts something.** No assertion-free tests, no testing the mock.
- **No disabled tests** (skipped/focused) committed to a shared branch.
- **Co-locate** unit tests next to source (e.g. `*.test.*`) or under a `unit/` tree; integration under `integration/`; e2e under `e2e/`.
- **Isolate** integration tests — fresh seed, no shared state, no order dependence.

---

## Example: a calculation invariant

*(language-agnostic shape — express in `{{UNIT_TEST_RUNNER}}`)*

```
describe(calculate{{VALUE}}):
  it("{{edge case, e.g. excluded items are dropped from the denominator}}"):
    expect(calculate{{VALUE}}({{input}})).toEqual({{expected}})
```

## Example: a negative authorization case

```
it("{{unauthorized role}} cannot read another owner's record"):
  res = as({{ROLE_A}}).get(`{{PROTECTED_PATH}}/{{OTHER_OWNER_ID}}`)
  expect(res.status).toBe({{FORBIDDEN_STATUS}})
```

---

## Bottom Line

Test every hard line, every authorization rule, every boundary schema, and the critical journeys. Tests are a contract — never weaken them to go green.
