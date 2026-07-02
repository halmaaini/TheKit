# Governance — The Coding Constitution

> **Template** · Lifecycle: living · Owner: Lead · Load: Always
> Fill: adjust the Always-Loaded vs Reference split to your doc set, and delete rows for any docs you removed (e.g. no UI → drop the frontend docs).
> Related: `../MANIFEST.md` (lifecycle rules for every doc), `../decisions.md` (the source of truth these rules trace to)

**What this is:** the rulebook every developer and AI agent reads before writing code for this project. These docs keep the codebase consistent, safe, and free of bloat — so any contributor produces code that looks like the original team wrote it.

**What this is NOT:** product specs. The *what to build* lives in `product/`. This folder is the *how to build it* and *how to behave while building it*.

---

## How to use this folder

1. **Before any session,** read the Always-Loaded set (below).
2. **When working in a domain,** pull the matching Reference doc.
3. **When a rule and reality conflict,** fix the code or update the doc — never silently ignore both.
4. **Keep docs short.** Long docs get ignored. Every rule should trace to a real risk in *this* project and cite the decision that justifies it (e.g. `(D-…)`).

---

## The five layers

The 19 core docs are organized into five layers, from how an agent behaves down to the guarantees the product rests on. (Docs 20–23 are optional cross-cutting extensions — CI/CD, dependencies, i18n, performance — add the ones your project needs.)

| Layer | Covers | Docs |
|---|---|---|
| **Agent Behavior** | how to behave and what process to follow | 01, 02, 18 |
| **Foundation** | what the product is, where things live, what to call them | 03, 04 |
| **Code Quality** | types, file layout, tests, comments | 05, 06, 07, 08 |
| **Architecture** | backend/frontend structure, reuse, data access, API boundary | 09, 10, 11, 12, 19 |
| **Domain Safety** | the project's hard lines and the rules that protect them | 13, 14, 15, 16, 17 |

---

## The documents

| # | Document | Layer | Load |
|---|---|---|---|
| 01 | `01-agent-rules.md` | Agent Behavior | Always |
| 02 | `02-dev-workflow.md` | Agent Behavior | Always |
| 03 | `03-project-map.md` | Foundation | Always |
| 04 | `04-naming-conventions.md` | Foundation | Always |
| 05 | `05-type-safety.md` | Code Quality | Always |
| 06 | `06-file-organization.md` | Code Quality | Always |
| 07 | `07-testing-standards.md` | Code Quality | Reference |
| 08 | `08-code-comments.md` | Code Quality | Always |
| 09 | `09-backend-architecture.md` | Architecture | Reference |
| 10 | `10-frontend-architecture.md` | Architecture | Reference |
| 11 | `11-component-reuse.md` | Architecture | Always |
| 12 | `12-data-access-and-schema.md` | Architecture | Reference |
| 13 | `13-domain-hard-lines.md` | Domain Safety | Always |
| 14 | `14-single-source-of-truth.md` | Domain Safety | Always |
| 15 | `15-error-handling.md` | Domain Safety | Always |
| 16 | `16-security-and-approval.md` | Domain Safety | Reference |
| 17 | `17-external-integrations.md` | Domain Safety | Reference |
| 18 | `18-assistant-tooling.md` | Agent Behavior | Reference |
| 19 | `19-api-contract.md` | Architecture | Reference |
| 20 | `20-ci-cd-and-deployment.md` | Operations *(optional)* | Reference |
| 21 | `21-dependencies-and-supply-chain.md` | Operations *(optional)* | Reference |
| 22 | `22-internationalization.md` | Cross-cutting *(optional)* | Reference |
| 23 | `23-performance-budgets.md` | Cross-cutting *(optional)* | Reference |

> **`13-domain-hard-lines.md` is the doc you customize most.** It names the 2–5 non-negotiable guarantees your product rests on. Everything else in governance serves those lines — fill it first and deliberately.

> **Fill order (minimum viable governance).** Don't let ~20 docs stall you: **fill `03`, `04`, `13` first** (what it is · what to call things · what it must never do), **adopt `01`/`02` as-is** (they're designed for it), and let every other doc **start as-shipped and tighten when it first bites** — that's what `living` means. Delete the optional docs that don't apply (update `MANIFEST.md` in the same commit).

---

## Always-Loaded set (every session)

These are short by design. Load them every time:

- `01-agent-rules.md` — how to behave
- `02-dev-workflow.md` — the process to follow
- `03-project-map.md` — what exists and where
- `04-naming-conventions.md` — how to name things
- `05-type-safety.md` — how to write safe types
- `06-file-organization.md` — how to avoid bloat
- `08-code-comments.md` — comment standard & in-code traceability
- `11-component-reuse.md` — reuse before you create
- `13-domain-hard-lines.md` — the guarantees the product can't cross
- `14-single-source-of-truth.md` — where each value is calculated
- `15-error-handling.md` — how errors are surfaced

## Reference set (pull when relevant)

- Touching API routes / server handlers → `09-backend-architecture.md`, `19-api-contract.md`
- Touching UI → `10-frontend-architecture.md`, `11-component-reuse.md` (+ the UI spec in `../design/`)
- Changing the schema / data access → `12-data-access-and-schema.md`
- Touching sensitive calculations → `13-domain-hard-lines.md`, `14-single-source-of-truth.md`
- Touching auth / roles / visibility / approvals → `16-security-and-approval.md`
- Touching external services → `17-external-integrations.md`
- Writing tests → `07-testing-standards.md`
- Before merging / adding connectors → `18-assistant-tooling.md`
- CI/CD & deploy → `20-ci-cd-and-deployment.md` · dependencies & licensing → `21-dependencies-and-supply-chain.md` · i18n → `22-internationalization.md` · performance → `23-performance-budgets.md` *(optional extensions — keep what applies)*

> ⟨FILL: move any doc between the two sets to fit your project. No UI → drop the frontend/component docs; no database → drop the data-access doc; no API boundary → drop the API-contract doc.⟩

---

## Reading order for a new contributor

1. `03-project-map.md` — understand what this product is
2. `01-agent-rules.md` + `02-dev-workflow.md` — understand how we work
3. `04-naming-conventions.md` + `05-type-safety.md` + `06-file-organization.md` + `08-code-comments.md` — understand how we write code
4. `11-component-reuse.md` + `14-single-source-of-truth.md` — the two biggest anti-bloat, anti-bug levers
5. `13-domain-hard-lines.md` — the guarantees everything else protects
6. Domain docs as the task requires

---

## Maintenance

- **Pain-driven:** every rule should answer "what bug or friction does this prevent?" If it doesn't, cut it.
- **Living:** when a real bug reveals a missing rule, add it to the relevant doc.
- **One change per doc edit:** keep rule changes reviewable.
- **The bottom line:** less is more. A page that gets read beats ten pages that get skipped.
