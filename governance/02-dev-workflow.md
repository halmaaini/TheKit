# 02 — Development Workflow (Spec-Driven)

> **Template** · Lifecycle: living · Owner: Lead · Load: Always
> Fill: adopt the phases as-is; tune the mode table and commit rules to your team. Point the spec references at your real spec docs.
> Related: `01-agent-rules.md`, `03-project-map.md`, `product/prd.md`, `delivery/02-task-ledger.md`

## Purpose

Stop "vibe coding." The most expensive mistake is building the wrong thing — or the right thing in the wrong order. Think, plan, then build.

---

## The Phases

Apply in order. Don't skip ahead.

1. **Constitution check.** Confirm you've read the Always-Loaded docs in `README.md`. Confirm the task doesn't violate a hard line in `01-agent-rules.md` / `13-domain-hard-lines.md`.

2. **Specify (what & why).** Restate what is being built and why, in plain language, tied to a user story. The source material is `product/prd.md` and `product/workflows.md` ⟨FILL: or your spec doc⟩. Don't talk stack yet.

3. **Clarify.** List anything underspecified and ask before planning. Ambiguity resolved here is 10x cheaper than during coding.

4. **Plan (how).** Name the files, modules, and patterns you'll touch. Reference the architecture docs (`09-backend-architecture.md`, `10-frontend-architecture.md`). Check the API contract (`19-api-contract.md`) and schema (`12-data-access-and-schema.md`).

5. **Task breakdown.** Split the plan into small, individually verifiable steps, each with a success criterion. Record status in `delivery/02-task-ledger.md`.

6. **Implement.** Execute in order, verifying each step. Commit after each logical unit (see commit rules below).

7. **Validate.** Confirm every acceptance criterion is met, tests pass (`07-testing-standards.md`), and no constitution rule was broken. Review your own diff.

---

## Full vs Light vs Direct

| Mode | When | Phases |
|---|---|---|
| **Full** | New feature, new surface, new model, anything spanning 3+ files | All 7 |
| **Light** | Bug fix, small enhancement, single-file change | Plan → Implement → Validate |
| **Direct** | Typo, config tweak, dependency bump | Implement → Validate |

Err toward more structure. If a "small" change starts growing, stop and write a plan.

---

## Commits

- One logical change per commit (see `01-agent-rules.md` rules 3 & 10).
- Conventional-commit style: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`. See `04-naming-conventions.md`.
- Never commit secrets. Never `git add -A` blindly — add files by name.
- Don't push or open a PR unless asked.

---

## Where Artifacts Live

⟨FILL: pick your working-artifact home.⟩ If you produce spec/plan/task artifacts, put them under a dedicated working folder at the repo root (e.g. `.specs/` or `.plans/`) — not in `governance/`. This folder is rules; those folders are working artifacts.

---

## Bottom Line

Understand → plan → small verifiable steps → verify. Structure scales down for small tasks but never disappears.
