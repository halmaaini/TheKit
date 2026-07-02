# Authoring Guide — How to Write the Kit's Docs

> **Meta** · Lifecycle: meta (guidance, not project content) · Owner: Lead · Load: Reference
> Read this before authoring or editing any doc in the kit. It describes what each doc must contain.
> Related: START-HERE.md, MANIFEST.md

**What this is.** A meta-document. It does not contain rules itself — it describes **which docs must exist**, **what each one must contain**, and **how to write them** so an agent (or a human) can populate the kit for a real project. Use it as the spec for authoring `governance/` (the Coding Constitution) and `delivery/` (the Master Plan).

**Who it's for.** Whoever sets up a project's foundations before agents or developers start writing code — typically the Lead/Architect.

**What "done" looks like.** A filled-in kit where every doc is short, opinionated, and traceable to a decision, so an agent reading it produces code and plans that look like one careful team made them.

**How this guide is organized:**

| Part | Covers |
|---|---|
| **PART I — Authoring the Coding Constitution** | what each `governance/` doc (01–19) must contain |
| **PART II — Authoring the Delivery Plan** | what each `delivery/` doc must contain |
| **PART III — Kit conventions** | the banner, lifecycle vocab, placeholder convention, and traceability spine (pointers to START-HERE/MANIFEST) |

---

## First principles (apply to every doc you write)

1. **Keep docs short and opinionated.** Long docs get ignored. The goal is rules an agent can follow, not exhaustive theory. **A page that gets read beats ten that get skipped.**
2. **Pain-driven, not theory-driven.** Every rule must answer *"what bug or friction does this prevent in THIS project?"* If it can't, cut it.
3. **Examples beat explanations.** Show `Before ❌ / After ✅` code, not paragraphs.
4. **Traceable.** Rules cite the decision that justifies them (`(D-…)`); code cites the rule/decision it enforces. See PART III.
5. **Living, not carved.** When a real bug reveals a missing rule, add it. When a rule and reality conflict, fix the code or update the doc — never silently ignore both.
6. **Know the lifecycle before you edit.** Populate-once ≠ living ≠ append-only ≠ derived. Check the doc's row in `MANIFEST.md` first.

**Always-loaded vs reference.** Some docs belong in every agent session (the short behavioral, foundation, and hard-line docs); others are pulled only when working in that domain (backend, data access, integrations). Each doc's banner and `governance/README.md` say which. Author always-loaded docs to be *ruthlessly* short — they cost context every session.

---

# PART I — Authoring the Coding Constitution (`governance/`)

The constitution is 19 core numbered docs plus a `README.md`, organized into five layers, with optional cross-cutting extension docs (20–23: CI/CD, dependencies, i18n, performance) kept only where a project needs them. Each doc keeps the standard section shape (Purpose → Core Principles / Golden Rules → Required Patterns → Forbidden Patterns → Enforcement → Bottom Line) — scaled to the doc's size.

| Layer | Covers | Docs |
|---|---|---|
| **Agent Behavior** | how the agent behaves and what process it follows | 01, 02, 18 |
| **Foundation** | what the product is, where things live, what to call them | 03, 04 |
| **Code Quality** | types, file layout, tests, comments | 05, 06, 07, 08 |
| **Architecture** | backend/frontend structure, reuse, data access, API boundary | 09, 10, 11, 12, 19 |
| **Domain Safety** | the project's hard lines and the rules that protect them | 13, 14, 15, 16, 17 |

> **External inspiration (light touch only).** Two open sources shaped Layer 0 and are worth a one-line nod, not a dependency: Andrej Karpathy's viral rules on LLM coding pitfalls (behind the `01` core rules) and GitHub's Spec Kit for spec-driven development (behind the `02` phases). Cite them as inspiration; the kit stands alone without either.

---

## Layer 0 — Agent Behavior

Governs the AI agent itself — how it thinks, acts, and what process it follows. **Agent-tool agnostic**: applies whether you run Claude Code, Cursor, Copilot, Codex, or anything else. Load these first.

### `01-agent-rules.md` — Agent Behavioral Rules · *living · Always*

**Purpose:** Prevent the predictable ways agents fail on a codebase — wrong assumptions, overcomplication, scope creep, confident-but-broken output. This is the single highest-leverage doc for AI-assisted work.

**Must contain:**
- **~12 short behavioral rules**, one line each. The load-bearing ones: think before coding (state assumptions, present options, ask when unclear); simplicity first (build only what's asked); surgical changes (touch only what the request requires; every changed line traces to it); goal-driven execution (turn the task into a verifiable goal with a failing test first); a hard attempt budget (stop after N real attempts, surface the impasse); read before write; no hallucinated APIs; preserve passing tests; fail loudly; respect the diff; ask don't guess; reuse before you create.
- **A "Project Hard Lines" pointer section** — 2–5 one-line "never do X" pointers into `13-domain-hard-lines.md`, each citing its decision `(D-…)`. This is the project-specific part; keep the full detail in `13`.

**Format:** Short and direct — one line per rule, no essays. Keep the whole doc under ~100 lines; agents lose compliance as instruction length grows.

### `02-dev-workflow.md` — Development Workflow (Spec-Driven) · *living · Always*

**Purpose:** Stop "vibe coding." The most expensive mistake is building the wrong thing, or the right thing in the wrong order. Think → plan → build.

**Must contain:**
- **The phases, in order:** constitution check → specify (what & why) → clarify → plan (how) → task breakdown → implement → validate. The agent doesn't skip ahead.
- **A Full / Light / Direct mode table:** full (all phases) for new features/surfaces/models or 3+ files; light (plan → implement → validate) for bug fixes and single-file changes; direct (implement → validate) for typos/config/dep bumps. Err toward more structure.
- **Commit rules:** one logical change per commit; conventional-commit style; never commit secrets; don't push/PR unless asked.
- **Where working artifacts live:** a dedicated repo-root folder (e.g. `.specs/` or `.plans/`), *not* in `governance/`.

**Format:** Ordered phase list + a mode table. Practical enough to follow without interpretation.

### `18-assistant-tooling.md` — Assistant Tooling · *living · Reference*

**Purpose:** Govern the skills, slash-commands, and connectors the coding agent is allowed to use, and the rules for adding more.

**Must contain:** the approved tool/skill/connector list with what each is for; the rule for adding a new one (who approves, where it's recorded); any tools that are *forbidden* or need sign-off before use (see `16`). Keep it a short registry, not a tutorial.

---

## Layer 1 — Foundation

### `03-project-map.md` — Project Map · *populate-once · Always*

**Purpose:** The read-first document. Before writing code, an agent must know what the product is, what exists, where it lives, and the exact words the team uses. Without it, agents create files in the wrong place, duplicate what exists, and invent names for things that already have one.

**Must contain:**
- **What this product is** — one paragraph pulled from `decisions.md`, *including what it is NOT* (name the adjacent things it's easy to mistake it for). Surfaces list if multi-surface.
- **Tech stack table** — framework, language, UI, state, validation, data access, database, auth, background work, external services, hosting, tests. Delete rows that don't apply.
- **Structure & boundaries** — the top-level folder tree, each dir annotated with its purpose and access scope, plus **import boundary rules** ("X may import Y, never Z"; business logic in the domain layer; everything crossing the wire validated by a schema; vendors behind wrappers).
- **Entry points** — where execution starts (app boot, API/handlers, auth) so an agent can trace the system.
- **External integrations table** — one wrapper per service (mirror `17`).
- **Glossary** — the highest-value section: every domain noun/verb defined once, matched to the data model and API, so agents and code use one name per concept.

**Format:** Short — one page. Tables, tree, bullets; not prose.

> **Note on monorepo/package boundaries:** this kit folds import-graph and package-boundary rules into `03` (the boundary rules section) and `06` (where code goes). Do **not** create a separate "Monorepo Boundaries" doc unless a genuinely complex multi-package graph needs its own diagram — then add it as an optional doc and record it in `MANIFEST.md`.

### `04-naming-conventions.md` — Naming Conventions · *populate-once · Always*

**Purpose:** Remove all ambiguity about what to name things. Inconsistent naming is the #1 source of low-grade chaos in a codebase.

**Must contain** naming rules for whatever your stack has: files & folders (casing), language identifiers (variables, functions, types, enums, constants), UI components and their props/handlers, API endpoints (resource-style, versioning, plural vs singular), database (tables, columns, foreign keys, indexes, enums), environment variables, event/queue names, test files, and (optional) branch/commit conventions.

**Format:** Mostly tables — "what you're naming" → "convention" → "example".

---

## Layer 2 — Code Quality

### `05-type-safety.md` — Type Safety · *living · Always*

**Purpose:** How the type system is used across the codebase. Type safety is the cheapest bug prevention available; escape hatches erase its value.

**Must contain:** core principles (types reflect reality, validate at boundaries, narrow with guards); do/don't golden rules; **forbidden patterns** (unchecked casts, ignore-directives, coercions that hide bugs, non-null assertions); **required patterns** (schema validation at every I/O boundary — API, DB, jobs, uploads, messages; type guards; discriminated unions with exhaustiveness checks; centrally-defined domain types); how DB rows are typed and mapped to domain types at the boundary; how external/model/webhook data is validated; the exact lint rules that block the forbidden patterns; a PR checklist; grep spot-check commands.

**Format:** Heavy on `Before ❌ / After ✅`. Start strict — no "pragmatic exceptions"; once allowed, they spread. Delete this doc only if the language has no type system to protect.

### `06-file-organization.md` — File Organization & Anti-Bloat · *living · Always*

**Purpose:** Prevent the #1 pain — huge files and duplicated code from agents creating new code instead of reusing existing code. The most direct counter to agent bloat.

**Must contain:** a **pre-flight checklist** before writing any new code (does it already exist? can existing code be extended? is this the right folder?); a **search-before-create rule** with the actual searches to run; file-size soft/hard limits; when to split vs when a long cohesive concept stays whole; the one-responsibility rule; where utilities go and how they get promoted (inline → file-local → shared); a dead-code policy (delete on sight, never comment out); forbidden patterns (new file when one exists, copy-paste-with-tweaks, "v2"/"new" duplicate files); a PR checklist.

**Format:** Decision trees and explicit search procedures.

### `07-testing-standards.md` — Testing Standards · *living · Reference*

**Purpose:** Define what gets tested, at what level, with what patterns — so agents don't skip tests or write ones that catch nothing.

**Must contain:** the test pyramid (unit/integration/e2e proportions); **what MUST be tested** (every hard-line invariant, every schema validator red→green, every authorization rule with positive *and* negative cases, critical workflows end-to-end); what should; what needn't; test file location; naming; typed mock factories (no escape hatches in tests); the test-DB strategy; snapshot policy; coverage targets (meaningful, not 100%); forbidden patterns (disabled tests on main, tests that test the mock, tests with no assertions).

**Format:** A test example per category.

### `08-code-comments.md` — Code Comments & In-Code Traceability · *living · Always*

**Purpose:** Anyone opening a file should know in seconds which feature it serves, which spec/decision defines it, and why any non-obvious code is that way — without spelunking.

> **This kit deliberately runs a *heavier* comment standard than the usual "minimal comments" default** — a small amount of durable, high-value commenting that doesn't rot. Comment the *why* and the *links*, not the *what* (names already say the what).

**Must contain:**
- **File header** on every non-trivial file — names the feature, the spec section, and the decision `(D-…)` it implements, plus a one-line role.
- **JSDoc on every exported domain/service function** — what it returns, the rule it owns, the spec/decision pointer, and a "canonical — never re-derived (14)" note where it applies.
- **Why-comments** (`// why:`) for hidden constraints, invariants, workarounds.
- **Hard-line / security markers** — any field, serializer branch, or query that guards a hard line (`13`) or an authz boundary (`16`) carries a one-line marker tying it to the rule and decision. Pick one marker keyword per hard line so a grep finds every enforcement site.
- **The "cite the decision" rule** and the **anti-rot rule** (change behavior → change the comment in the same edit; link by things that don't move — feature + spec section + decision id, never line numbers).

**Format:** Comment templates + a "discouraged" table (no restating names, no commented-out code, no cross-reference comments — let architecture and tests track who-calls-what).

---

## Layer 3 — Architecture

### `09-backend-architecture.md` — Backend Architecture · *populate-once · Reference*

**Purpose:** How the backend is structured — where business logic lives, how features are organized, how requests flow. Without it, agents put logic in route handlers and scatter validation.

**Must contain:** the standard module/layer layout for your framework; layer responsibilities (handlers = I/O only; services = all business logic, pure as possible; data-access = all queries, returns typed rows; domain modules = reusable cross-feature logic); dependency direction (handlers → services → data-access, never back); input validation at the boundary; a step-by-step "anatomy of a feature" recipe; where auth guards live and how they're applied; transaction rules; log shape (no PII/secrets); forbidden patterns (business logic in handlers, raw queries outside the data layer, services with HTTP dependencies).

**Format:** A complete "anatomy of a feature" example + rules. Delete if there's no backend.

### `10-frontend-architecture.md` — Frontend Architecture · *populate-once · Reference*

**Purpose:** How the UI is structured — where state lives, how data is fetched, how pages compose. UI degrades fast without these decisions made once.

**Must contain:** folder structure; server vs client component rules (default to server, escalate only when needed); **state categories** each with one home (server state via a query lib and never duplicated; URL state in search params; form state via a form lib; local UI state; cross-component state via context, store only when justified); data-fetching rules (go through the generated/typed client, no hand-written fetch, standard loading/error/empty/success pattern); routing/layout rules; the standard form pattern; forbidden patterns (hand-written API calls, business logic in components, prop drilling beyond ~2 levels, global state for what should be URL state).

**Format:** A complete "anatomy of a page" example + rules. Delete if there's no UI.

### `11-component-reuse.md` — Component Reuse · *living · Always*

**Purpose:** The single biggest lever against UI bloat — when to create a new component vs extend/use an existing one. Agents default to creating new when a shared one already exists.

**Must contain:** a **component decision tree** (shared exists? → extend it? → truly new & reusable → shared library; app-specific → keep local); the **shared-library inventory** (every shared component, one-line description, key props, usage example — *the highest-value section*, kept current as the library grows); the variant pattern (add a `size`/`tone`/`intent` prop, don't fork the component); composition over duplication; the one shared form/modal/table/layout patterns everything must use; when breaking out is allowed (rare, documented); forbidden patterns (`Button2`/`ButtonNew`/`CustomButton` next to `Button`, reimplemented forms, copy-pasted modals); a PR checklist.

**Format:** The inventory is critical. Delete the doc if there's no UI.

### `12-data-access-and-schema.md` — Data Access & Schema · *populate-once · Reference*

**Purpose:** Prevent schema drift, inconsistent types, missing indexes, and naming chaos at the DB level. Schema mistakes are the hardest to undo — prevent them up front.

**Must contain:** naming (tables, columns, FKs, indexes, enums); the standard columns on every table (id, created/updated timestamps with timezone, created_by/updated_by, deleted_at if soft-delete); type rules (money as fixed-precision decimal never float, UUID identifiers, timezone-aware timestamps, explicit enums, no accidental nullable booleans); soft-delete policy and auto-excluding query helpers; indexing rules (every FK indexed, every WHERE/ORDER-BY column indexed, composite indexes for common patterns); migration rules (one change per migration, immutable after merge, documented multi-step process for destructive changes, reversible where possible); constraint rules; audit-trail approach; forbidden patterns (string type for money, implicit nullable, missing FK indexes, editing merged migrations).

**Format:** Schema template + rules + migration examples. Delete if there's no database.

### `19-api-contract.md` — API Contract & Data Fetching · *populate-once · Reference*

**Purpose:** Govern the frontend↔backend boundary. With a generated typed client this boundary can be near-perfect — but only if the rules hold.

**Must contain:** the contract (a schema — e.g. OpenAPI — is the single source of truth; backend generates, frontend consumes); generated-client usage examples; the forbidden alternative (hand-written fetch or hand-written response types, anywhere); the standard response envelope and error shape (cross-ref `15`); the pagination pattern (pick one), filtering/sorting conventions; versioning policy; idempotency rules; caching/invalidation; real-time/SSE channel structure if used; the standard loading/error/empty/success handling every fetch must implement.

**Format:** Correct/incorrect usage examples. Delete if there's no API boundary.

---

## Layer 4 — Domain Safety

### `13-domain-hard-lines.md` — Domain Hard Lines · *populate-once, customize HEAVILY · Always*

**This is the doc you customize most — it is a pluggable slot, not a fixed topic.** In the reference kit this slot was originally a numeric-safety doc; **do not treat it as one.** It is where **each project names the 2–5 non-negotiable guarantees it cannot violate without becoming a different or broken product** — and those guarantees differ completely by domain (auditability, immutability, tenant isolation, agent-output safety, money precision, provenance…).

**Must contain:**
- **A short intro** stating the "2–5 hard lines; if everything is a hard line, nothing is" rule, and that each line must be **testable** (a test fails when it's crossed), **enforced at the strongest layer available** (a DB constraint beats app code beats a review checklist), and **traceable** (cites the decision that made it a hard line).
- **A per-hard-line template**, repeated 2–5 times:
  ```
  ### <N> — <Name of the guarantee>   (D-<id>)
  The line:  <one sentence an agent can't misread — what must ALWAYS/NEVER happen>
  Why:       <the failure this prevents>
  Golden:    ✅ required pattern   ❌ forbidden pattern
  Enforcement: Schema/DB · Code (+ marker, see 08) · Test (the one that fails on violation) · Spot-check (grep/review)
  ```
- **Worked examples from different domains** to show the *range* (e.g. a data-governance product's lines: provenance, append-only ledger, tenant isolation, agent-output safety — vs a numeric/analytics product's lines: backend-calculates, verified-by-default, store-canonical-round-at-display). Label them clearly as illustrations to delete.

**Format:** Intro + template + delete-me examples. Everything else in `governance/` should serve these lines — so fill this doc *first* and deliberately.

### `14-single-source-of-truth.md` — Single Source of Truth · *living · Always*

**Purpose:** For every important domain concept, define the **one place** it is calculated, stored, or defined. Duplication is the root cause of "Page A shows different data than Page B."

**Must contain:** for each domain concept — its canonical definition, where it lives (module/function/column), how it's calculated, the invariants that must hold, and who may change it. Where canonical logic lives (`domain/` or `calculations/`). The rule that API responses return pre-calculated canonical values and the frontend never recalculates. Forbidden: recalculating a canonical value anywhere outside its source of truth.

**Format:** A table or section per concept. Living — every new domain concept gets an entry.

### `15-error-handling.md` — Error Handling & Observability · *populate-once · Always*

**Purpose:** Make errors visible, understandable, and debuggable without troubleshooting from scratch every time. Most debugging time is wasted on errors that should have been obvious.

**Must contain:** error **categories** (validation → 4xx field-level; authorization → 401/403; not-found → 404; conflict → 409; business-rule → 422 with a rule code; system → 500 logged with context, generic message to user); the **standard error shape** sent to the client (`code`, `message`, `details`, `traceId`); a **centralized error-code enum** (every error has a stable code); backend handling (typed exception classes, a global filter converting to the standard shape, never swallow errors); frontend handling (one error-display component, an error boundary, never show raw errors to users); **logging** (structured, a standard log shape, log-level guidance, no PII/secrets); **tracing** (a trace id per request, propagated through services and jobs, returned in errors); forbidden patterns (swallowed catches, generic messages with no code, logging full request bodies, stack traces to end users).

**Format:** Error catalog + code examples per category.

### `16-security-and-approval.md` — Security & Approval · *populate-once · Reference*

**Purpose:** Define who can do what, where it's enforced, and how authentication works. Multi-role/multi-tenant systems are extremely easy to get wrong; authorization mistakes are critical bugs.

**Must contain:** authentication (method, token format & lifetime, refresh, logout, password/hashing rules, MFA if any); the authorization model (roles, permissions per role, resource ownership, hierarchical access); **where authz is enforced** (backend only — never trust the frontend; guards at the boundary; ownership checks in services); the standard authorization patterns/decorators; **any human-approval gates** the product requires (what actions need sign-off, by whom, recorded where); sensitive-data handling (what counts as PII, storage/encryption/retention); input safety (validate at the boundary, parameterized queries only, XSS/CSRF); secrets management (env vars, rotation, prod storage); audit logging (auth, permission changes, exports, deletes); forbidden patterns (authz in the frontend, string-interpolated SQL, secrets in git, PII in logs).

**Format:** Permission matrix + code examples + checklist. Delete if the product has no auth boundary.

### `17-external-integrations.md` — External Integrations · *living · Reference*

**Purpose:** Govern how external services are integrated. They fail, change APIs, have rate limits and secrets; direct calls from business logic create chaos.

**Must contain:** the **wrapper pattern** (every service has one wrapper module; business logic never imports the vendor SDK directly); interface abstraction (each wrapper exposes a domain-shaped interface so vendors are swappable); config (credentials/endpoints/timeouts in config, never hardcoded); error handling (vendor errors wrapped in domain errors, retries within reason, hard failures surfaced); rate limiting; timeouts on every call; logging without secrets; how services are mocked in tests and which get contract tests; cost awareness for paid services; a short per-service subsection (bucket/key rules, from-addresses, pool limits, connection lifecycle, etc.); forbidden patterns (direct SDK calls from handlers/logic, secrets in code, synchronous slow calls in request handlers — use jobs).

**Format:** Wrapper template + per-service rules. Delete if there are no external services. If the product has background jobs, cover their rules here or in the backend doc — this kit does **not** ship a separate "Background Jobs" doc (add one only if async work is a large surface).

---

## `governance/README.md` — the load-order index · *living · Always*

**Purpose:** Tell an agent which docs to load every session vs pull on demand.

**Must contain:** the five-layer table; the full 19-doc index table (with layer + load); the **Always-Loaded set** (the short behavioral/foundation/hard-line docs); the **Reference set** mapped to triggers ("touching the API → 09, 19"; "touching UI → 10, 11"; …); a reading order for a new contributor; and the maintenance rules (pain-driven, living, one change per edit). Keep the "`13` is the doc you customize most" note near the top.

---

# PART II — Authoring the Delivery Plan (`delivery/`)

`delivery/` is the **execution engine**: it turns the product specs and locked decisions into an operational plan an agent can run one task at a time, with explicit ownership, dependencies, gates, and handoffs. Everything here answers one question: *what is the next unblocked task, and is it safe to start?* It is the twin of the constitution — same voice, same "short and traceable" discipline — but about *sequencing the build* rather than *governing the code*.

**The delivery source-of-truth order** (author every delivery doc to respect it): `decisions.md` wins over delivery docs, which win over product specs; and within delivery, **`02-task-ledger.md` is the task source of truth** — the matrix and everything else derive from it. Never edit a lower source to disagree with a higher one; change the higher one first and propagate down.

### `delivery/README.md` — Master-Plan overview · *living · Reference*

**Purpose:** Orient anyone entering the plan and define how the folder is used.

**Must contain:**
- **What building this project means as a delivery effort** — one paragraph: the shape of the work, roughly how many phases, what "done" looks like (scope from `product/prd.md`, constraints from `decisions.md`).
- **The source-of-truth order** (above), stated explicitly, top-to-bottom.
- **How AGENTS use the folder** — the read order at the start of a task: roles doc (`06`) → ledger (`02`, pick the next unblocked task) → decisions log → confirm every "Depends On" is `Done`/`Gate: Passed` → read the task spec → flip the ledger row. Note that a handoff prompt supersedes this (follow it exactly).
- **How HUMANS review progress** — ledger → matrix → phases/gates → risk register → change requests → decisions log.
- **The operating model** — phased delivery with entry/exit gates; parallel tracks only where the dependency chain allows; explicit blockers and fallbacks; one task in flight per agent; update the ledger the moment reality changes.

**Format:** Short orientation + two "how to use" lists. Don't restate the other docs — point to them.

### `delivery/01-phases-and-gates.md` — Phases, Gates, Dependencies, Critical Paths · *living · Reference*

**Purpose:** Break the build into ordered **phases**, each with an objective and verifiable exit criteria, advancing only through a cross-functional sign-off gate. Agents use it to know *what a phase is trying to achieve* and *what "done" means*; day-to-day status lives in the ledger.

**Must contain:**
- **A per-phase structure**, given to *every* phase (a phase = an objective + gate, e.g. "Phase 2"):
  ```
  ## {{PHASE}} — {{Name}}
  Objective        — one or two sentences: what this phase delivers.
  Entry Criteria   — what must be true/signed-off before it starts (usually the prior gate).
  Exit Criteria    — verifiable outcomes that let the gate pass (one bullet per checkable result).
  Critical Path    — the ordered chain that gates everything else (A → B → C).
  Blockers         — known things that would stall it.
  Fallback         — the reduced-scope path if a blocker hits, so the phase can still close.
  ```
  Keep each phase small enough that its exit criteria are checkable — every criterion must be something a reviewer can verify, not a vibe. Most projects need 4–7 phases, sequenced by the dependency chain in the ledger.
- **The gate sign-off rule** — a table of accountable functions (Product / Design / Engineering / QA — adjust to the team) and what each signs off. **No phase begins until the previous phase's gate is signed.** Record each pass in the matrix and log the ruling.
- **(Optional) A delivery-phase → implementation-phase map** — only if you run two phase layers (coarse delivery gates over finer implementation phases). The delivery phase is the *gate*; the implementation phases are the *detail* that must all complete before it passes. Delete if single-layer.

**Format:** A per-phase template + a worked example marked "replace" + the gate table.

### `delivery/02-task-ledger.md` — Task Ledger · *living — the task SoT · Reference*

**Purpose:** The **single source of truth for task status and dependencies** across the whole build. No other file decides project state; the matrix is a derived view, and if the two disagree, the ledger wins.

**Must contain:**
- **A status vocabulary** — a small, unambiguous set. A good default: `Not Started`, `In Progress`, `Blocked`, `Done`, `Review: Passed`, `Review: Failed`, `Gate: Pending`, `Gate: Passed`. Tell the author to trim any their workflow doesn't use (drop the `Review:`/`Gate:` values if there's no separate review/gate step).
- **A roles summary** pointing to `06` for the full version (Task / Review / Gate / Owner in one line each).
- **The update protocol for agents** — before starting, confirm every "Depends On" row is `Done`/`Gate: Passed` (else set `Blocked` with a reason); flip to `In Progress` when starting; to `Done` when exit criteria are checked and the handoff log is filled; the gate agent flips the phase row and unblocks the next phase.
- **A Phase Overview table** (one row per phase → status → gate file) as the top-level board.
- **The ledger itself** — one section per phase, one row per task: stable task id, name, status, "Depends On" (task ids / phase gates), and the spec-file path. Keep the gate as the final row of each phase.
- **(Optional) Parallel-task visibility** — which tasks can run at once because no dependency links them; this is what lets an orchestrator fan out safely.
- **A progress summary** — totals, tasks done, gates passed, current phase, release target.

**Format:** Status table + protocol + phase/task tables. This is the most-edited doc in the kit — keep the vocabulary tiny.

### `delivery/03-task-matrix.md` — Task Matrix · *living · Reference*

**Purpose:** A summary/board **view** of the ledger — a scannable status snapshot for humans, grouped by phase and (optionally) by owning function.

**Must contain:** a compact status legend; one checklist section per phase with each task's owner-function and status; optionally a sprint/status roll-up table. Author it as **derived from the ledger** — never let it contradict `02`.

**Format:** Checklists grouped by phase. Keep it a view, not a second source of truth.

### `delivery/04-risk-register.md` — Risk Register · *living · Reference*

**Purpose:** Track what could go wrong and what's being done about it, so risks are managed rather than rediscovered at the gate.

**Must contain:** a central table with, per risk — **id · risk · impact · likelihood · owner function · mitigation**. Optionally, per-phase risk highlights (the specific risk each phase carries + its mitigation). Revisit at every phase gate.

**Format:** One table + optional per-phase notes.

### `delivery/05-change-requests.md` — Change Requests · *append-only log · Reference*

**Purpose:** A lightweight process for changes that move scope, the critical path, a hard-line behavior, or a gate's exit criteria — so scope creep is deliberate and recorded.

**Must contain:** **when to raise a CR** (the trigger list above); a short **CR template** (title, requested by, date, the change, why now, scope impact, dependency impact, risk impact, recommended decision: approve/defer/reject); the **review rule** (which functions review; QA joins when behavior/release is affected; approved foundational changes are logged in `decisions.md` and propagated); an SLA note (critical vs non-critical turnaround). Author it append-only — CRs accrete; don't rewrite past ones.

**Format:** Trigger list + template + review rule.

### `delivery/06-agent-build-architecture.md` — Agent Build Architecture · *populate-once · Reference*

**Purpose:** The **agent execution model** the project adopts — what roles exist, what each reads/does/outputs, how they hand off, and how edge cases are handled so the build doesn't stall or drift. Every agent reads this before starting. **The value is the protocols** — the set of rules that turn "an AI writes code" into "a disciplined team ships software."

**Must contain:**
- **A "how to adopt this" preamble** — pick your roles, wire each role's reading list, choose which protocols to enforce (read each first; most bite eventually), tune the specialists, set the `⟨FILL⟩` counts (phases, who signs a gate, parallel-work policy).
- **A platform note** — agents run as separate sessions of your coding agent with **no shared memory**; each loads context from these docs at session start. Record here if a specific agent/orchestration approach is a locked decision (default stance: prefer a coding agent with native file/shell/git access over adding an orchestration framework at small scale).
- **The roles** — a good default is five, each a distinct session with a defined reading list, scope, and output:
  - **Task Agent** — executes one task spec end to end; writes code, runs tests, fills the handoff log, updates the ledger. Confirms dependencies before writing a line; logs any unplanned decision.
  - **Review Agent** — independently audits the Task Agent's output (separate session, no shared memory) for completeness, spec conformance, architecture/hard-line compliance, hallucination, test coverage, and an honest handoff log. **Passes or fails — it does not fix code.**
  - **Gate Agent** — runs the phase gate checklist only after every task in the phase is `Done` + reviewed; runs the test/build/grep checks; signs the phase and unblocks the next. **Does not fix failing code or negotiate requirements.**
  - **Orchestrator** — sequences work and fans out parallel-safe tasks per the ledger (optional; skip if you drive tasks manually).
  - **Product Owner (human)** — approves inputs, signs the gate's owner row, resolves blockers.
- **The gap-closing / edge-case protocols** — the heart of the doc. Give each protocol a name and the specific failure it prevents. Cover at least: an **unplanned-decision protocol** (what an agent does when the spec doesn't cover a case — log it, don't silently choose); a **blocker/escalation protocol**; a **spec-issue protocol** (a third review outcome when the *spec itself* is wrong, not the code); a **review-failure loop** (findings go back to a Task Agent, not fixed by the reviewer); a **hard-attempt-budget/anti-thrash rule**; and a **hallucination guard** against invented fields/endpoints. Tell the author each protocol must answer *"what specific failure does this prevent in THIS project?"* — delete any that don't.
- **The specialists** — a set of consultant/review roles mapped to review domains (e.g. security, data/schema, frontend/UX, performance, testing, integrations…), with a **trigger matrix** mapping folders/change-types to the specialist that must weigh in. Keep the ones that match the stack; drop the DB specialist with no database, the Design specialist with no UI.

**Format:** Preamble + role sections + a numbered protocol list + a specialist trigger matrix. This is the largest delivery doc, and that's fine — but every protocol earns its place or gets cut. Delete the whole file if you build solo with no multi-agent protocol.

### `delivery/07-session-handoff.md` — Session Handoff · *living · Reference*

**Purpose:** When a session ends the next one starts with no memory. Define how to produce a **handoff prompt** — one copy-pasteable block that orients a fresh session in under a minute.

**Must contain:**
- **How to generate one** — a slash command (e.g. `/handoff`) or a verbal request; either way the agent reads the ledger + active handoff logs and fills the template.
- **What the agent reads first** — the ledger (task statuses), the decisions log (open exceptions/flags), and the most recent checkpoint entry in any `In Progress`/`Blocked` task spec.
- **The handoff-prompt template** — fixed structure: read-these-first list → current project state (active phase, progress, completed, in-progress *with last checkpoint*, blocked, next unblocked) → active flags → the one-sentence immediate next action → the spec file for the session.
- **Rules for generating it** — fill every section with real values (no blank placeholders); paste any `In Progress` task's most recent checkpoint verbatim; write "None" for empty sections rather than omitting them; output only the prompt block, no preamble.

**Format:** Generation steps + a labelled template + generation rules.

> **(Optional) `delivery/08-phase-implementation-map.md`** — a two-layer phase map (delivery phases ↔ implementation phases/sprints). Author it only if you run two phase layers; otherwise omit and note in `MANIFEST.md`.

---

# PART III — Kit conventions

These are defined **authoritatively in `START-HERE.md` and `MANIFEST.md`** — read them there. This section is a quick reference so an authoring agent has the rules in one place; don't duplicate the full definitions.

### The banner (top of every doc, after the H1)

Every template doc opens with a banner telling the agent how to treat it:

```
> **Template** · Lifecycle: <populate-once|living|append-only|derived|optional> · Owner: <role> · Load: <always|reference>
> Fill: replace {{PLACEHOLDERS}}; delete guidance blocks marked ⟨FILL⟩ when done.
> Delete this file if: <condition, for optional docs>
> Related: <sibling docs this one points at>
```

The authoring guide itself uses `**Meta**` instead of `**Template**` (it's guidance, not project content). Keep the banner to the same few fields so an agent reads the rules at a glance.

### Lifecycle vocabulary (full definitions in `MANIFEST.md`)

| Lifecycle | Rule for the agent |
|---|---|
| **Populate-once** | Fill at project start; change later only via a deliberate, logged decision. |
| **Living** | Edit freely in place as the project evolves (ledger, risks, most governance). |
| **Append-only** | Never edit or delete past entries; only add new ones (logs, CRs). |
| **Derived** | Do not hand-edit to diverge — regenerate from `decisions.md`. |
| **Optional** | Delete the whole file if its banner condition doesn't apply. |
| **Meta** | Read for guidance on authoring; never ship as project content (this doc). |

### The placeholder convention

Nothing filled-in is real until replaced. Two markers:
- **`{{PLACEHOLDER}}`** — a value to substitute (`{{PROJECT_NAME}}`, `{{STACK_FRAMEWORK}}`, `{{TASK-ID}}`).
- **`⟨FILL: …⟩`** — a guidance block telling you what to write there; **delete it once done**. Never leave `{{…}}` or `⟨FILL⟩` in a doc you consider finished.

### The decision-ID traceability spine

The kit keeps one spine intact: **decision ↔ rule ↔ code**.
- `decisions.md` is canonical; every locked decision gets a stable id (`D-…`) and a version.
- Governance rules cite the decision that justifies them (e.g. `(D-12)`); delivery gates and CRs log the rulings they make.
- Code cites the rule/decision it enforces via the `08-code-comments.md` markers (file header + hard-line marker), so when a decision changes you can grep to every site that depends on it.
- Downstream docs are **derived** from decisions — change the decision first, then propagate; never edit a derived doc to disagree with `decisions.md`.

---

## Bottom line

Author every doc so a new developer or agent can read the kit and produce code and plans that look like the original team made them — **consistent, safe, bloat-free, and traceable** from day one. Keep each doc short, opinionated, and pain-driven; name the few hard lines the product rests on and make everything serve them; and when something hurts, write it down so it doesn't hurt again.
