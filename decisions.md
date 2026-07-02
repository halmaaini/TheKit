# {{PROJECT_NAME}} — Decision Record

> **Template** · Lifecycle: populate-once (structure) → then append/amend deliberately · Owner: Lead/Architect · Load: Always
> Fill: replace `{{PLACEHOLDERS}}`; capture every locked decision as a numbered row. This file is the **canonical source of truth** — every other doc derives from it.
> Related: `START-HERE.md`, `MANIFEST.md`, `product/`, `governance/`

**Purpose:** The single, canonical log of every locked design decision for `{{PROJECT_NAME}}`. All other documents — PRD, data model, architecture, governance, delivery plan — **derive from and point back to this file.** When a decision changes, change it **here first**, then update the docs that depend on it.

**Version:** 0.1
**Last updated:** ⟨FILL: date⟩
**Status:** ⟨FILL: e.g. "Decisions locked except where marked OPEN."⟩

> Mirrors the principle the product itself should follow: one source of truth, everything else derived.

---

## How to use this file

- **Every decision gets a stable ID** (`D-1`, `D-2`, …). IDs are permanent — never renumber. Governance rules and code comments cite these IDs (the traceability spine).
- **Group decisions into thematic sections** (below). Add sections your project needs; delete those it doesn't.
- **To change a locked decision:** amend the row in place, bump the version, and add an entry to `logs/decisions-log.md` explaining the change. Never silently overwrite history.
- **Versioning convention:** the blank template is `0.1`; your first real fill bumps to `0.2`; bump the minor per amendment batch after that, and call it `1.0` when the record is first locked/shared beyond yourself.
- **Adopting an existing codebase?** Decisions reverse-engineered from code carry **(as-built, adopted YYYY-MM-DD)** in their rationale — they record what the code *does*, owner-confirmed; what you wish were different goes to the roadmap, never here as fact (see `ADOPT-EXISTING.md`).
- **Mark unresolved items `OPEN`** and track them in the Open Questions section until they lock.

---

## A. Concept — what we're building

| ID | Decision | Rationale |
|---|---|---|
| D-1 | ⟨FILL: the one-sentence definition of the product⟩ | ⟨why⟩ |
| D-2 | ⟨FILL: who the users are and the core job it does for them⟩ | |
| D-3 | ⟨FILL: what it explicitly is NOT / non-goals⟩ | |

## B. Foundations — the shape of the thing

| ID | Decision | Rationale |
|---|---|---|
| D-… | ⟨FILL: tenancy model, form factor, key structural choices⟩ | |
| D-… | ⟨FILL: what is the source of truth at runtime (e.g. the database)⟩ | |

## C. Architecture

| ID | Decision | Rationale |
|---|---|---|
| D-… | ⟨FILL: major architectural choices — services, agents, jobs, boundaries⟩ | |

## D. Data & lifecycle

| ID | Decision | Rationale |
|---|---|---|
| D-… | ⟨FILL: key entities, state machines, immutability/retention rules⟩ | |

## E. Security & access

| ID | Decision | Rationale |
|---|---|---|
| D-… | ⟨FILL: roles, isolation model, auth, visibility rules⟩ | |

## F. Domain hard lines

> The non-negotiables. These seed `governance/13-domain-hard-lines.md`. Keep to 2–5.

| ID | Decision | Rationale |
|---|---|---|
| D-… | ⟨FILL: hard line 1 — the guarantee the product rests on⟩ | |

## T. Tech stack

> Seeds the stack table in `governance/03-project-map.md`.

| ID | Decision | Rationale |
|---|---|---|
| D-… | ⟨FILL: framework / language / data layer / auth / hosting / tests / key vendors⟩ | |

## R. Scope & horizon

| ID | Decision | Rationale |
|---|---|---|
| D-… | ⟨FILL: what's in v1 vs later — seeds `product/roadmap.md`⟩ | |

---

## Open questions (unresolved — resolve, then move into a section above)

| ID | Question | Owner | Status |
|---|---|---|---|
| H-1 | ⟨FILL: an open item⟩ | ⟨role⟩ | OPEN |

---

## Change history

| Version | Date | Change |
|---|---|---|
| 0.1 | ⟨FILL⟩ | Initial decision record. |
