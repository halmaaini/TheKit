# MANIFEST — Document Registry & Lifecycle Rules

> **Template** · Lifecycle: living · Owner: Lead/Architect · Load: Always
> This is the index an agent reads to know **how to treat every file in the kit**: whether to populate it, edit it in place, only append to it, never hand-edit it, or delete it. When you add, remove, or re-scope a doc, update this table in the **same commit**.

---

## Lifecycle vocabulary

| Lifecycle | What the agent may do | What the agent must NOT do |
|---|---|---|
| **Populate-once** | Fill at project start. Change later only via a deliberate decision (logged). | Casually rewrite; let it drift from `decisions.md`. |
| **Living** | Edit freely in place as the project evolves. | Leave stale — update it the moment reality changes. |
| **Append-only** | Add new dated/numbered entries at the end. | Edit or delete any existing entry. Ever. |
| **Derived** | Regenerate from its source when the source changes. | Hand-edit to disagree with `decisions.md`. |
| **Optional** | Keep and fill **or** delete the whole file. | Leave half-filled with template boilerplate. |
| **Meta** | Read for guidance on how to author other docs. | Ship it as project content. |

**Owner** = the role accountable for the doc's correctness (Lead/Architect, Product, Eng, QA, or *Any agent*). It does not mean only that role edits it.

---

## Root documents

| Doc | Lifecycle | Load | Owner | Populate when | Delete if |
|---|---|---|---|---|---|
| `AGENTS.md` | Populate-once | — | Lead | **Copy to your repo root** (or `CLAUDE.md`); the entry file your coding agent auto-loads | never |
| `READTHIS.md` | Living | Any | Plain-English human guide — how the kit works, do/don't, folder map | never |
| `START-HERE.md` | Living | Always | Lead | Adapt the intro to your project once | never |
| `MANIFEST.md` (this) | Living | Always | Lead | Update whenever the doc set changes | never |
| `AUTHORING-GUIDE.md` | **Meta** | Reference | Lead | Read before authoring/editing any doc | never (it's the how-to) |
| `decisions.md` | **Populate-once → then append/amend** | Always | Lead/Architect | **First.** The canonical decision record; everything derives from it | never — this is the source of truth |

> `decisions.md` is special: its *structure* is populate-once, but decisions accrete over time. **Add** new decisions and **amend** existing ones deliberately (with a version bump). Downstream docs are **derived** from it.

---

## The `example/` folder

A **filled worked instance** of the entire kit for a fictional URL shortener ("Snip"). Lifecycle: **read-only reference** — imitate it, never edit it, and **delete the whole folder** once your own docs are written. It exists so an agent can see exactly what "filled" looks like before touching a blank template.

---

## `intake/` — raw-source on-ramp

Where you drop unstructured source material (PDF, existing PRD, notes, mockups). The agent **extracts content into the kit docs** and archives the raw file — it never files raw files into the kit as the spec. See `intake/README.md` for the protocol.

| Doc | Lifecycle | Owner | Rule |
|---|---|---|---|
| `README.md` | Living | Lead/Architect | The intake protocol: classify → extract → route → ask → log → archive. Adopt as-is; tune the routing table. |
| `intake-log.md` | **Append-only** | Any agent | One row per file: what was extracted, where it went, open questions, status. Never rewrite past rows. |

> Dropped raw files are transient — they leave `intake/` for `archive/` once processed. Don't leave processed files in the dropzone.

---

## `product/` — what you're building

| Doc | Lifecycle | Owner | Populate when | Delete if |
|---|---|---|---|---|
| `prd.md` | Populate-once (living early) | Product | Step 2, from `decisions.md` | never |
| `data-model.md` | Living (derived from decisions) | Architect | Alongside the PRD | never |
| `workflows.md` | Living (derived from decisions) | Product/Architect | Alongside the PRD | never |
| `agents.md` | Optional · Living | Architect | If the product includes AI agents/workers | **product has no AI component** |
| `roadmap.md` | Living | Product | When you know v1 vs later | you only ever ship one release |

---

## `design/` — the UI spec (delete the whole folder if no UI)

| Doc | Lifecycle | Owner | Populate when | Delete if |
|---|---|---|---|---|
| `design-system.md` | Populate-once → living | Design/Architect | Tokens/primitives, after the first wireframes are approved | **no UI** |
| `screens.md` | Living | Design/Product | Per-screen specs, as each phase's screens are designed | **no UI** |
| `design-process.md` | Optional · Populate-once | Product/Design | How wireframes are produced & approved | **no UI** |

---

## `governance/` — how you build it (the Coding Constitution)

Load column: **Always** = read every session · **Reference** = pull when working in that domain.

| Doc | Lifecycle | Load | Populate when | Delete if |
|---|---|---|---|---|
| `README.md` | Living | Always | Adjust the always/reference split to your set | never |
| `01-agent-rules.md` | Living | Always | Adopt as-is; add project hard-line pointers | never |
| `02-dev-workflow.md` | Living | Always | Adopt; tune phases to your team | never |
| `03-project-map.md` | Populate-once | Always | Fill with your stack, folders, glossary | never |
| `04-naming-conventions.md` | Populate-once | Always | Fill your casing/naming table | never |
| `05-type-safety.md` | Living | Always | Adapt to your language/validation lib | language has no type system to protect |
| `06-file-organization.md` | Living | Always | Adapt size limits & structure | never |
| `07-testing-standards.md` | Living | Reference | Adapt to your test stack | never |
| `08-code-comments.md` | Living | Always | Adopt; set your traceability marker style | never |
| `09-backend-architecture.md` | Populate-once | Reference | Fill your layer model | **no backend** (pure static/frontend) |
| `10-frontend-architecture.md` | Populate-once | Reference | Fill your UI architecture | **no UI** |
| `11-component-reuse.md` | Living | Always | Adapt to your component system | **no UI** |
| `12-data-access-and-schema.md` | Populate-once | Reference | Fill your DB/ORM/migration rules | **no database** |
| `13-domain-hard-lines.md` | **Populate-once — HEAVILY customize** | Always | **Define YOUR project's non-negotiables here** (see the doc) | never — but its *content* is fully project-specific |
| `14-single-source-of-truth.md` | Living | Always | List your canonical values & their one home | never |
| `15-error-handling.md` | Populate-once | Always | Fill your error model & codes | never |
| `16-security-and-approval.md` | Populate-once | Reference | Fill auth/roles/authorization rules | never |
| `17-external-integrations.md` | Living | Reference | List your vendors & the wrapper rule | **no external services** |
| `18-assistant-tooling.md` | Living | Reference | Pick your skills/commands/connectors | never |
| `19-api-contract.md` | Populate-once | Reference | Fill your API boundary rules | **no API boundary** |
| `20-ci-cd-and-deployment.md` | Living | Reference | Fill your pipeline/deploy/env rules | **no CI/CD; manual deploy** |
| `21-dependencies-and-supply-chain.md` | Living | Reference | Fill your dependency/licensing rules | **no third-party deps** |
| `22-internationalization.md` | Populate-once | Reference | Fill your i18n rules | **single-language** |
| `23-performance-budgets.md` | Populate-once | Reference | Fill your perf budgets | **perf not tracked for v1** |

> **`13-domain-hard-lines.md` is the doc you customize most.** The example hard lines it shows are just *illustrations*. Replace them with the 2–5 guarantees your product actually rests on (e.g. auditability, immutability, tenant isolation, agent-output safety, money precision…). Everything else in governance hangs off these.

---

## `delivery/` — the plan to build it

| Doc | Lifecycle | Owner | Populate when | Delete if |
|---|---|---|---|---|
| `README.md` | Living | Lead | Adapt overview + source-of-truth order | never |
| `01-phases-and-gates.md` | Living | Lead/QA | Break work into phases with entry/exit gates | never |
| `02-task-ledger.md` | **Living — the task SoT** | Any agent | Seed tasks; update status every session | never |
| `03-task-matrix.md` | Living | Any agent | Keep the summary view in sync with the ledger | you don't want a summary view |
| `04-risk-register.md` | Living | Lead | List risks + mitigations; revisit per phase | never |
| `05-change-requests.md` | Append-only (log of CRs) | Lead | Raise a CR when scope/critical-path changes | never |
| `06-agent-build-architecture.md` | Populate-once | Lead | Adopt the roles & protocols; tune to your team | you build solo with no agent protocol |
| `07-session-handoff.md` | Living | Any agent | The handoff process + template | never |
| `08-phase-implementation-map.md` | Optional · Living | Lead | If you map delivery phases → impl phases | **your phase model is single-layer** |

---

## `logs/` — the discovery record

| Doc | Lifecycle | Owner | Rule |
|---|---|---|---|
| `decisions-log.md` | **Append-only** | Any agent | Record every ruling, precedent, disagreement resolved. Never edit past entries. |
| `gap-log.md` | **Append-only (status field updates allowed)** | Any agent | One row per gap; add rows, flip open→closed, never delete history. |
| `contradiction-log.md` | **Append-only (status field updates allowed)** | Any agent | One row per conflict; add rows, record resolution, never delete history. |

---

## `archive/` — frozen history

Processed raw sources and superseded docs, kept for provenance. **Nothing here is authoritative** — read it only for history, never to answer "what's current."

| Doc | Lifecycle | Owner | Rule |
|---|---|---|---|
| `README.md` | Living | Any agent | The rule: read-only history, never current truth; how to archive something. |
| `archive-log.md` | **Append-only** | Any agent | What was archived, when, why, and what superseded it. |

---

## `enforcement/` — the guardrail harness (optional)

Makes the *checkable* rules bind mechanically. Installed into the target repo (`.claude/`, `.git/hooks/`, `scripts/`, `.github/workflows/`) — see `enforcement/README.md`. The kit works docs-only; add this when you want drift prevention.

| Doc/file | Lifecycle | Owner | Rule |
|---|---|---|---|
| `README.md` | Living | Lead | Install steps + the rule→mechanism map. |
| `state-machine.md` | Living | Lead | The ledger/gate state machine the validator enforces — keep in sync with the validator. |
| `.claude/`, `git-hooks/`, `scripts/`, `ci/` | Living (code) | Lead | Executable templates — fill placeholders, then copy into the repo. |

---

## Quick rules for an agent editing this kit

- **Before editing any doc, check its row here.** Populate-once ≠ living ≠ append-only.
- **Never hand-edit a `derived` doc to disagree with `decisions.md`** — change the decision, then regenerate.
- **Never rewrite history in a `logs/` file** — append.
- **Delete `optional` docs that don't apply** to your project rather than leaving boilerplate.
- **Update this MANIFEST in the same commit** whenever you add, remove, merge, or re-scope a doc.

---
© 2026 Haitham Al Maaini · **TheKit** · https://github.com/halmaaini/TheKit
Dual-licensed — docs: CC-BY-4.0 · code: MIT. Reuse freely **with attribution**; see [LICENSE](./LICENSE).
