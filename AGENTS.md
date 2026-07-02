# AGENTS.md — Agent Entry Point

> **Template · copy me to your repository root** *(already there if the kit is your repo root — just fill and delete this banner)*. This is the first file a coding agent reads when it opens the repo. Place it at the repo root so it auto-loads. If your agent reads a different filename, copy/rename this file accordingly (Claude Code → `CLAUDE.md`; Cursor → `.cursor/rules/`; others → `AGENTS.md`). Keep the content identical.
> Lifecycle: populate-once · Owner: Lead · Load: auto (repo root — read every session).
> Fill: set `{{KIT_PATH}}` and `{{PROJECT_NAME}}`, then delete this banner.

You are working on **{{PROJECT_NAME}}**. This repository is governed by a **Project Kit** — a set of docs that define what to build, how to build it, and how to behave while building it. **Do not write code or plan work before reading it.**

## Read this first, every session

1. **`{{KIT_PATH}}/START-HERE.md`** — the map: what the kit is and how it's organized.
2. **`{{KIT_PATH}}/MANIFEST.md`** — the rule for **how to treat every doc** (which to populate, edit in place, only append to, never hand-edit, or delete).
3. **`{{KIT_PATH}}/decisions.md`** — the **source of truth**. Every other doc derives from it.
4. The **always-loaded** governance set listed in `{{KIT_PATH}}/governance/README.md`.
5. If you're picking up build work: **`{{KIT_PATH}}/delivery/02-task-ledger.md`** — the next unblocked task.

> `{{KIT_PATH}}` is wherever the kit lives in this repo (e.g. `.`, `planning/`, or `docs/`). Set it once above.

## Non-negotiable behaviors

- **Respect each doc's lifecycle** (from `MANIFEST.md`): never edit an `append-only` log's past entries; never hand-edit a `derived` doc to disagree with `decisions.md` — change the decision first, then regenerate.
- **Honor the project's hard lines** in `{{KIT_PATH}}/governance/13-domain-hard-lines.md`. These are the guarantees the product rests on. Crossing one is never an acceptable trade-off.
- **Confirm a task's dependencies are done** before starting it, and update its status in the ledger as you go.
- **Ask, don't guess** when a requirement is ambiguous and guessing wrong is costly (see `governance/01-agent-rules.md`). Log gaps in `{{KIT_PATH}}/logs/gap-log.md`.
- **Cite the decision** (`(D-…)`) behind any non-obvious rule you enforce in code (the traceability spine).

## What this repo is

⟨FILL: one or two sentences on {{PROJECT_NAME}} — or point at `{{KIT_PATH}}/product/prd.md`.⟩

---

*If the kit and reality disagree, fix the code or update the doc — never silently ignore both.*

---
<!-- Attribution (required by CC-BY-4.0 / MIT — please keep). -->
Built with **TheKit** by Haitham Al Maaini · https://github.com/halmaaini/TheKit
Licensed CC-BY-4.0 (docs) / MIT (code): https://github.com/halmaaini/TheKit/blob/main/LICENSE
