# START HERE — Project Kit

> **Read this first, every session.** This folder is a **reusable, project-agnostic starter kit** for building software with AI coding agents. Copy it into a new repo, fill it in for your project, and it becomes the single place an agent (or a human) learns *what you're building*, *how to build it*, and *how to behave while building it*.
>
> Nothing here is specific to any one product. Every file is a **template**: it ships with structure, guidance, and `{{PLACEHOLDERS}}` you replace. This takes one minute to understand.

---

## What this kit is (and is not)

| | |
|---|---|
| **IS** | The rulebook + plan + product spec for one software project. Read by AI agents before every coding session so their output looks like one careful team wrote it. |
| **IS NOT** | Application code, or a description of a specific product. It is the *scaffolding around* the code. |

> **These docs are durable, not throwaway.** Once you copy the kit into your repo they become your project's **living documentation** — they sit beside `src/` and evolve as you build (PRD → specs → screens → code). You don't graduate away from them; you keep them true.

The kit rests on one principle, borrowed from good system design:

> **One source of truth; everything else is derived.**
> `decisions.md` is canonical. When a decision changes, change it **there first**, then update the docs that depend on it. Never edit a derived doc to disagree with `decisions.md`.

---

## The folders + the root files

```
<kit-root>/
├── AGENTS.md            ← copy to your repo root — the file your coding agent auto-loads
├── READTHIS.md          ← plain-English guide for non-technical humans
├── START-HERE.md        ← you are here — orientation + how to instantiate
├── MANIFEST.md          ← THE INDEX: every doc, and its lifecycle rule
│                          (populate-once · living · append-only · derived · optional)
├── AUTHORING-GUIDE.md   ← the meta-guide: what each doc must contain, how to write it
├── decisions.md         ← SOURCE OF TRUTH: every locked design decision, versioned
│
├── intake/              ← DROPZONE for raw source material — the agent distills it into the docs
│   ├── README.md            the protocol: classify → extract → route → ask → log → archive
│   └── intake-log.md        append-only: each file → what was extracted → where it went
│
├── product/             ← WHAT you're building
│   ├── prd.md               problem, users, scope, non-goals
│   ├── data-model.md        entities, relationships, lifecycle/state machines
│   ├── workflows.md         the key end-to-end flows
│   ├── agents.md            AI agent/worker design (delete if no AI in the product)
│   └── roadmap.md           v1 / v2 / later horizon
│
├── design/              ← the UI SPEC (delete the whole folder if no UI)
│   ├── design-system.md     tokens · primitives · states · accessibility (design SoT)
│   ├── screens.md           per-screen specs (layout · states · components · copy)
│   └── design-process.md    how wireframes are produced & approved
│
├── governance/          ← HOW you build it (the Coding Constitution)
│   ├── README.md            load order: always-loaded vs reference set
│   ├── 01…19-*.md           core: behavior · foundation · code quality · architecture · domain safety
│   └── 20…23-*.md           optional: ci/cd · dependencies · i18n · performance
│
├── delivery/            ← the PLAN to build it (master plan / execution engine)
│   ├── README.md            overview + how agents and humans use this folder
│   ├── 01-phases-and-gates  phases, entry/exit criteria, sign-off gates
│   ├── 02-task-ledger       SINGLE SOURCE OF TRUTH for task status & dependencies
│   ├── 03-task-matrix       phase-level summary view
│   ├── 04-risk-register     risks + mitigations
│   ├── 05-change-requests   lightweight scope-change process
│   ├── 06-agent-build-architecture  the roles & protocols agents follow to execute
│   ├── 07-session-handoff   how to hand off between working sessions
│   └── 08-phase-implementation-map  (optional) map delivery phases → implementation phases
│
├── logs/                ← the DISCOVERY RECORD (grows as you work)
│   ├── decisions-log.md     append-only: rulings, precedents, disagreements resolved
│   ├── gap-log.md           open / closed gaps discovered
│   └── contradiction-log.md flagged conflicts + how they were resolved
│
├── archive/             ← FROZEN history: processed raw sources + superseded docs (never authoritative)
│   ├── README.md            the rule: read only for history, never as current truth
│   └── archive-log.md       append-only: what was archived, when, why, what replaced it
│
├── enforcement/         ← (optional) the guardrail HARNESS that makes the rules bind
│   ├── README.md            install steps + the rule→mechanism map
│   ├── state-machine.md     the ledger/gate state machine the validator enforces
│   ├── .claude/             SessionStart + PreToolUse hooks · /task /gate /handoff · settings.json
│   ├── git-hooks/           pre-commit backstop (append-only · hard-line greps · ledger check)
│   ├── scripts/             validate-ledger.mjs — the state-machine validator
│   └── ci/                  guardrails.yml — required checks for the default branch
│
└── example/             ← a FILLED worked instance (a fictional URL shortener) to imitate
```

**The mental model:** `intake/` = *raw in* · `decisions.md` + `product/` + `design/` = *what* · `governance/` = *how* · `delivery/` = *the plan* · `enforcement/` = *the guardrails* · `logs/` = *the record* · `archive/` = *frozen history*.

---

## How to instantiate this kit in a new project

> **Adopting into an EXISTING codebase?** Follow **`ADOPT-EXISTING.md`** instead of the steps below — same kit, inverted flow (*code → decisions*), with a grandfathering ratchet so install day isn't red day.

Do these in order. Don't skip — each step feeds the next. **New to the kit? Skim `example/` first** — a complete filled instance (a fictional URL shortener) that shows what "done" looks like.

0. **Clean up the copy.** A "Use this template" copy inherits TheKit's own `README.md` and license files. Replace `README.md` with your project's readme, **keeping a "Based on TheKit" attribution line** (the LICENSE requires credit); keep `LICENSE` and `LICENSE-CC-BY-4.0.txt` — they license the kit content now in your repo.
1. **Point your agent at the kit.** Copy `AGENTS.md` to your repo root (it's already there if the kit *is* your repo root — just fill it); rename to `CLAUDE.md` if that's what your agent auto-loads; set `{{KIT_PATH}}` and `{{PROJECT_NAME}}`. Now every session starts by reading the kit.
2. **Drop your raw material in `intake/` and process it.** PDFs, an existing PRD, notes, mockups, HTML — put them in `intake/`; the agent distills them into `decisions.md` and the `product/`/`design/` docs, asking you whenever a file implies a decision or conflicts with one. This is the on-ramp that feeds the next steps. (No raw material yet? Skip it.)
3. **Fill `decisions.md`.** Capture the locked decisions (concept, stack, architecture, hard constraints) — seeded by intake and your own calls. This is the root everything derives from. Version it.
4. **Fill `product/` and `design/`.** Write the PRD, data model, and workflows; then the design system and screen specs. Delete `product/agents.md` if there's no AI, and the whole `design/` folder if there's no UI — and **update `MANIFEST.md` in the same commit** (its rule).
5. **Adapt `governance/`.** Priority order, so ~20 docs don't stall you: **fill `03`, `04`, and `13` first** — `13-domain-hard-lines.md` is the doc you most customize (see the note in it) — **adopt `01`/`02` as-is**, and let the rest start as-shipped, tightening each doc when it first bites. Delete rules and optional docs that don't apply (MANIFEST, same commit). *Tip: it's fine to do step 7 (install the harness) before this step — `/hardline` and the checks are useful while you write the hard lines; until then, run the engine from `enforcement/scripts/`.*
6. **Fill `delivery/`.** Break the work into phases/gates, seed the task ledger — copying `delivery/tasks/TEMPLATE-task-spec.md` per task and `delivery/gates/TEMPLATE-gate-spec.md` per gate — and list your risks.
7. **Install the enforcement harness (optional, recommended).** Copy `enforcement/` per its README so the checkable rules bind mechanically — SessionStart + guard hooks, the ledger validator, a pre-commit backstop, and CI. Docs-only is fine to start; add the harness when you want drift prevention.
8. **Delete `example/`** once your own docs are written — it's a teaching aid, not part of your project (MANIFEST, same commit).
9. **Start building.** Each session: read the always-loaded governance set + the ledger, do one task, update the ledger, log any rulings.

> **Rule of thumb while filling:** every rule and every doc must answer *"what bug or friction does this prevent in THIS project?"* If it doesn't, delete it. **A page that gets read beats ten that get skipped.**

---

## Conventions every doc follows (so an agent knows the rules at a glance)

**1. Every template doc opens with a banner** telling the agent how to treat it:

```
> **Template** · Lifecycle: <populate-once|living|append-only|derived|optional>
> · Owner: <role> · Load: <always|reference>
> Fill: replace {{PLACEHOLDERS}}; delete guidance blocks marked ⟨FILL⟩ when done.
> Delete this file if: <condition, for optional docs>
```

**2. Placeholders are explicit:** `{{PROJECT_NAME}}`, `{{STACK_FRAMEWORK}}`, `⟨FILL: …⟩`. Nothing filled-in is real until you replace it. Stack doesn't have the thing a placeholder names? Write **"none — ⟨what replaces it⟩"** and keep the rule that survives. Doneness check: `grep -rn "{{[A-Z_]"` (uppercase-anchored, so GitHub Actions' `${{ }}` syntax doesn't false-positive).

**3. Lifecycle vocabulary** (defined once, used everywhere — full list in `MANIFEST.md`):

| Lifecycle | Rule for the agent |
|---|---|
| **Populate-once** | Fill at project start; edit rarely and deliberately. |
| **Living** | Edit in place as the project evolves (ledger, risks, most governance). |
| **Append-only** | Never edit or delete past entries; only add new ones (logs). |
| **Derived** | Do **not** hand-edit to diverge — regenerate from `decisions.md`. |
| **Optional** | Delete the whole file if the condition in its banner doesn't apply. |

**4. Traceability spine:** governance rules cite the decision that justifies them (e.g. `(D-12)`), and code cites the rule/decision it enforces. Rule ↔ decision ↔ code stays linked.

---

## Changing rules or decisions mid-project

The kit is built to evolve. Route each change to the right home:

- **Refining a rule** (real pain, no decision change) → edit the `governance/` doc **in place** (they're `living`); note what changed and why.
- **Changing a locked decision** → edit `decisions.md` **first** (bump its version), record it in `logs/decisions-log.md` (append-only, with a *Propagation* line), **then** update every doc derived from it. Order: decision → rule → code.
- **A one-off exception** (rule holds, this case is special) → log a **Policy Exception** in `logs/decisions-log.md`; don't rewrite the rule. Scope changes go to `delivery/05-change-requests.md`.

---

## Session-start checklist

1. Read this file.
2. Read `MANIFEST.md` — know which docs are in play and how to treat each.
3. Read `decisions.md` and the always-loaded `governance/` set.
4. **Check `intake/`** — if unprocessed files are waiting, process them per `intake/README.md` before other work.
5. Read `delivery/02-task-ledger.md` — pick up the next unblocked task.
6. Confirm which lifecycle your target doc has **before** you edit it.

---

*Keystone doc. If the kit's structure changes, update this map and `MANIFEST.md` in the same commit.*

---
© 2026 Haitham Al Maaini · **TheKit** · https://github.com/halmaaini/TheKit
Dual-licensed — docs: CC-BY-4.0 · code: MIT. Reuse freely **with attribution**; see [LICENSE](./LICENSE).
