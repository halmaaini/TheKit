# {{PROJECT_NAME}} — Product Requirements

> **Template** · Lifecycle: populate-once (living early) · Owner: Product · Load: Reference
> Fill: replace every `{{PLACEHOLDER}}` and `⟨FILL: …⟩` block, then delete the guidance notes. Keep it skimmable — tables and bullets, not prose.
> Related: `decisions.md`, `product/roadmap.md`, `product/workflows.md`, `governance/03-project-map.md`

> **Derived from `decisions.md` — change decisions there first.** This doc restates and expands the *concept* and *scope* decisions (§A, §R). If a fact here disagrees with `decisions.md`, `decisions.md` wins.

## Problem

⟨FILL: 2–4 bullets — the pain that exists today, for whom, and why current options fall short. Pull from `decisions.md` D-1/D-2.⟩

- {{THE PAIN}} — ⟨FILL: who feels it and how often⟩
- {{WHY TODAY'S OPTIONS FAIL}} — ⟨FILL⟩

---

## Users / personas

⟨FILL: the few user types that actually gate design. Don't model org-chart nuance the product doesn't serve.⟩

| Persona | Who they are | Core job they hire the product for |
|---|---|---|
| **{{PERSONA_A}}** | {{ONE-LINE WHO}} | {{THE JOB — the outcome they want}} |
| **{{PERSONA_B}}** | {{ONE-LINE WHO}} | {{THE JOB}} |

---

## Goals

⟨FILL: 3–5 outcomes this release must achieve. Each should be observable — you can tell if it happened.⟩

- {{GOAL — an outcome, not a feature}} _(e.g. "a {{PERSONA_A}} can {{DO THE CORE JOB}} in under {{N}} minutes")_
- {{GOAL}}

## Non-goals

⟨FILL: things people will *expect* but you are deliberately NOT doing — and why. This is where scope discipline lives.⟩

- {{NON-GOAL}} — ⟨FILL: why it's out (later horizon / different product / wrong for our user)⟩

---

## Scope (this release)

⟨FILL: one paragraph naming what "done" means for the release named in `product/roadmap.md`.⟩

> _Example shape:_ "v1 lets a **{{PERSONA_A}}** {{CORE FLOW}} end-to-end, with {{THE ONE HARD CONSTRAINT}} guaranteed. It does not yet {{THE OBVIOUS-BUT-DEFERRED THING}}."

---

## Key features

⟨FILL: the features that make up this release. Priority: P0 = release-blocking, P1 = important, P2 = nice-to-have. Keep each feature to one line; details live in `product/workflows.md`.⟩

| Feature | For whom | Priority | Notes / links |
|---|---|---|---|
| {{FEATURE}} | {{PERSONA}} | P0 | ⟨FILL: one line — flow it belongs to in `workflows.md`⟩ |
| {{FEATURE}} | {{PERSONA}} | P1 | ⟨FILL⟩ |

---

## Success metrics

⟨FILL: how you'll know the goals were met. Prefer a baseline → target for each. Delete the column you can't measure yet.⟩

| Metric | Baseline | Target | How measured |
|---|---|---|---|
| {{METRIC — tied to a Goal above}} | {{TODAY}} | {{TARGET}} | ⟨FILL: source of the number⟩ |

---

## Constraints & assumptions

⟨FILL: the fixed facts the design must respect (from `decisions.md` §B/§E/§F/§T) and the beliefs it rests on (which, if wrong, change the plan).⟩

- **Constraint:** {{HARD FACT}} — ⟨FILL: e.g. platform, budget, regulation, a hard line from `governance/13-domain-hard-lines.md`⟩
- **Assumption:** {{BELIEF}} — ⟨FILL: what breaks if this is false⟩

---

## Out of scope

⟨FILL: explicit "not in this release" list, so no agent silently builds it. Point deferred items at `product/roadmap.md`.⟩

- {{THING}} — deferred to {{v2 / later}} (see `product/roadmap.md`).

---

## Bottom line

⟨FILL⟩ One sentence: for **{{PERSONA}}**, this release delivers **{{THE CORE OUTCOME}}** while guaranteeing **{{THE HARD LINE}}** — and explicitly defers **{{THE DEFERRED THING}}**.
