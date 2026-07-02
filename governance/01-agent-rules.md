# 01 — Agent Behavioral Rules

> **Template** · Lifecycle: living · Owner: Lead · Load: Always
> Fill: adopt the 12 rules as-is; then point the "Project Hard Lines" section at your real non-negotiables in `13-domain-hard-lines.md`.
> Related: `02-dev-workflow.md`, `06-file-organization.md`, `11-component-reuse.md`, `13-domain-hard-lines.md`, `14-single-source-of-truth.md`

## Purpose

Prevent the predictable ways AI agents fail on a codebase: wrong assumptions, overcomplication, scope creep, and confident-but-broken output.

---

## Core Rules

1. **Think before coding.** State your assumptions before you implement. If a request has more than one reasonable reading, present the options — do not silently pick one. If something is unclear, stop and ask.

2. **Simplicity first.** Build only what was asked. No speculative flexibility, no abstractions for single-use code. If you wrote 150 lines and 40 would do, rewrite. Test: "would a senior dev call this overcomplicated?"

3. **Surgical changes.** When editing existing code, touch only what the request requires. Do not reformat, rename, or "improve" adjacent code. Match the surrounding style. Every changed line must trace to the request.

4. **Goal-driven execution.** Turn the task into a verifiable goal. "Add validation" → "write tests for invalid input, then make them pass." "Fix the bug" → "write a failing test that reproduces it, then make it pass."

5. **Hard attempt budget.** If a test or build keeps failing, stop after 3 real attempts and surface the impasse with the actual error. Do not loop.

6. **Read before write.** Before changing a function, read its call sites. Never change a signature without checking what depends on it. (See `14-single-source-of-truth.md` for shared calculations.)

7. **No hallucinated APIs.** Do not invent methods, props, or calls on your framework, ORM, or libraries (e.g. `{{ORM}}`, `{{FRAMEWORK}}`). If unsure it exists, check the docs or source first.

8. **Preserve tests.** Do not edit or delete passing tests to make code go green. Tests are a contract. (See `07-testing-standards.md`.)

9. **Fail loudly.** When you hit an error you cannot resolve, report the full error with context. Never swallow exceptions or paper over a failure.

10. **Respect the diff.** Review your own diff before presenting it. Revert stray whitespace, import reordering, and style drift. Justify every line.

11. **Ask, don't guess.** When a requirement is ambiguous and guessing wrong is costly, ask. Use an explicit clarifying question rather than assuming.

12. **Reuse before you create.** Search for existing code, components, and calculations first. Creating a parallel version is the default failure mode. (See `06-file-organization.md` and `11-component-reuse.md`.)

---

## Project Hard Lines

These are the mistakes that cause real harm in *this* project. **⟨FILL⟩ Replace the examples below with 2–5 pointers to your real non-negotiables — defined in full in `13-domain-hard-lines.md`.** Keep each as a one-line "never do X" that points at the doc which enforces it.

- **Never {{VIOLATE_ACCESS_BOUNDARY}}** (e.g. leak privileged data across a role or tenant boundary). Check any new externally-facing endpoint or component against `16-security-and-approval.md`. *(D-…)*
- **Never recalculate a canonical value** outside its source of truth. See `14-single-source-of-truth.md`. *(D-…)*
- **Never trust externally-submitted data as trusted/verified.** See `13-domain-hard-lines.md`. *(D-…)*
- **Never suppress a type error to move past it** (no escape hatch / unchecked cast). See `05-type-safety.md`. *(D-…)*

---

## Bottom Line

Behave like a careful senior engineer joining an established team: understand first, change little, verify everything, and ask when unsure.
