# 18 — Assistant Tooling

> **Template** · Lifecycle: living · Owner: Lead · Load: Reference
> Fill: replace `{{}}` placeholders and list your real slash commands and MCP connectors. Keep the before-merge review rule and the "add only when the service exists" rule as-is.
> Related: `02-dev-workflow.md`, `07-testing-standards.md`, `16-security-and-approval.md`, `17-external-integrations.md`, `../enforcement/README.md`

## Purpose

Which assistant tooling — skills, slash commands, MCP connectors — to use on this project, and when. Keep it **minimal**: add a connector only when the service it talks to actually exists.

---

## Before every merge

Run these against the branch diff before merging to the default branch:

- **`code-review`** — correctness review of the diff; catches bugs before they land.
- **`security-review`** — checks this project's hard lines (see `13-domain-hard-lines.md`, `16-security-and-approval.md`): isolation/visibility boundaries, restricted-data leakage, and validation/type-safety gaps (see `01-agent-rules.md`).

Advisory but expected — treat a finding as a blocker until it's triaged.

---

## Slash commands

- **`/task`**, **`/gate`**, **`/handoff`** — drive the operating loop, run a phase gate, and generate a session handoff. Shipped by the enforcement harness (`../enforcement/`); `/handoff` follows `delivery/07-session-handoff.md`.
- ⟨FILL — optional project shortcuts you choose to add, e.g. a command to scaffold a canonical value + its `14-single-source-of-truth.md` row. Add later only if the shortcut proves useful; don't invent commands speculatively.⟩

---

## MCP connectors

Add a connector **when the underlying service exists**; don't wire speculatively.

⟨FILL — one row per connector you actually use. Typical shape below; replace with your services.⟩

| Connector | Use | Add when |
|---|---|---|
| **{{VCS}}** | PRs, reviews, CI status, issues | ⟨FILL — often already wired⟩ |
| **{{ERROR_TRACKING}}** | Pull errors from the dashboard into the session; pairs with `15-error-handling.md` | Once error tracking is live |
| **{{DATABASE}}** | Inspect schema, check/run migrations, review access policies | Once the database project exists |

---

## SessionStart hook

Add a **SessionStart hook** (in `.claude/settings.json`) that installs dependencies and does any codegen (e.g. generating a DB client), so a fresh web/CI container can run tests and lint immediately. ⟨FILL: what your hook installs/generates; link the setup doc.⟩ The enforcement harness (`../enforcement/`) ships a ready SessionStart context-loader hook plus `PreToolUse` guards — install those and fold your install/codegen step into the same hook.

---

## Bottom Line

Run `code-review` + `security-review` before each merge; use `/handoff` to close a session; add an MCP connector only once its service exists; keep the toolset small.
