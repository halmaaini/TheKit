# Lightweight Change Request Process

> **Template** · Lifecycle: append-only · Owner: Lead · Load: Reference
> Fill: adopt the process as-is; tune the review functions to your team. Never edit a logged CR — supersede it with a new one.
> Related: `01-phases-and-gates.md`, `04-risk-register.md`, `../decisions.md`, `../logs/decisions-log.md`

## Purpose

A cheap, fast way to change scope or plan **without silent drift**. Any change that touches scope, the critical path, or a phase gate gets a short written CR so the decision — and its cost — is on record. Keep it lightweight: a CR is a paragraph and a decision, not a document.

---

## When to raise a change request

Raise one when proposed work affects any of:

- Release scope boundaries (in-scope / out-of-scope).
- Critical-path dependencies (`02-task-ledger.md`).
- A phase gate's exit criteria (`01-phases-and-gates.md`).
- A domain hard line (`../governance/13-domain-hard-lines.md`) — these get extra scrutiny.

> ⟨FILL⟩ Add any project-specific triggers (e.g. anything touching auth, data model, or a regulated flow), or delete this note.

---

## Change request template

Copy this block into the log below for each CR:

```
### CR-{{NNN}} — {{Short Title}}
- **Requested by:** {{name/role}}
- **Date:** {{YYYY-MM-DD}}
- **Requested change:** ⟨FILL: what should change⟩
- **Why needed now:** ⟨FILL: the trigger / cost of not doing it⟩
- **Scope impact:** ⟨FILL: what scope moves in or out⟩
- **Dependency impact:** ⟨FILL: which tasks/critical-path items shift⟩
- **Risk impact:** ⟨FILL: new/changed risks — cross-ref `04-risk-register.md`⟩
- **Recommended decision:** Approve / Defer / Reject
- **Decision:** ⟨Approve / Defer / Reject⟩ — {{date}}, by {{who}}
```

---

## Review and decision

- Product + Design + Engineering review the request. QA joins when behavior or release validation is impacted.
- On **Approve**, record it where it belongs:
  - `../decisions.md` if it changes a locked decision (bump the version).
  - The relevant phase (`01-phases-and-gates.md`) and task ledger (`02-task-ledger.md`) rows.
  - `../logs/decisions-log.md` as a dated ruling.

> ⟨FILL⟩ Set your review SLA. Suggested default: critical CRs reviewed within 1–2 working sessions; non-critical at the next planning checkpoint.

---

## Change request log

> Append-only. Add each CR at the **bottom**; never rewrite a past entry. To reverse a decision, add a new CR that supersedes the old one and reference its ID.

_No change requests yet._

<!-- ⟨FILL: paste completed CR blocks below, newest last⟩ -->
