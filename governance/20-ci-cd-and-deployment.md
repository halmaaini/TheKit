# 20 — CI/CD & Deployment

> **Template** · Lifecycle: living · Owner: Lead · Load: Reference
> Fill: replace every `{{PLACEHOLDER}}` and `⟨FILL: …⟩` block with your pipeline, environments, and deploy commands.
> Delete this file if: the project has **no CI/CD** or you deploy manually.
> Related: `06-file-organization.md`, `12-data-access-and-schema.md`, `16-security-and-approval.md`, `delivery/06-agent-build-architecture.md`

## Purpose

The pipeline is the last gate before code becomes production. It exists so a green checkmark *means* something: lint, types, tests, and build all passed. Deploys must be boring, repeatable, and reversible — never a hand-run script from someone's laptop.

---

## The CI pipeline

Every PR runs the same checks, in this order, on a clean checkout:

- **Lint** → **type-check** → **test** → **build**.

All four must be green before a PR can merge. A red pipeline blocks merge — no overrides, no "I'll fix it after."

⟨FILL: your pipeline file — e.g. `{{CI_CONFIG}}` (`.github/workflows/ci.yml`) and the exact commands each stage runs.⟩

---

## Branch protection

- The default branch (`{{DEFAULT_BRANCH}}`) is protected. **No direct pushes.** All changes land through a reviewed PR.
- Required status checks (lint, type-check, test, build) must pass before merge.
- ⟨FILL: required approvals, linear history / squash policy.⟩

This is the CI expression of `delivery/06-agent-build-architecture.md` "What Agents Never Do" — an agent never pushes to the default branch and never merges around a red check.

---

## Environments

Keep **dev / staging / prod** at parity — same build artifact, same migrations, only config differs.

- ✅ Promote the *same* build through environments.
- ❌ Rebuild per environment or let staging drift from prod.

⟨FILL: your environment list, URLs, and what differs between them.⟩

---

## Config management

- All config (endpoints, credentials, feature flags) comes from **env vars** — never hardcoded, never committed. See `16-security-and-approval.md` and `17-external-integrations.md`.
- Document every variable in `.env.example`.

---

## Rollback

- **Code:** reverting a bad deploy is a documented one-step action — redeploy the previous known-good build (⟨FILL: your rollback command⟩).
- **Database:** migrations follow the expand-then-contract rule in `12-data-access-and-schema.md`, so a code rollback never faces a schema it can't read. Never ship a destructive migration in the same release as the code that depends on the old shape.

---

## Releases & versioning

⟨FILL: your versioning scheme (e.g. SemVer), tagging, and changelog process.⟩

---

## Enforcement

- CI config committed and required for merge (`{{CI_CONFIG}}`).
- Branch protection enabled on `{{DEFAULT_BRANCH}}` with the four checks as **required status checks**.
- A rollback runbook that anyone can execute.

---

## Bottom line

Every PR passes lint · type-check · test · build before it can merge; nothing pushes straight to the default branch; the same artifact is promoted across parity environments with config from env; and every deploy — code and schema — can be rolled back.
