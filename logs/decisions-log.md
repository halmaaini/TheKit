# Decisions & Disagreements Log

> **Template** · Lifecycle: **append-only** · Owner: Any agent · Load: Reference (read at session start)
> Fill: nothing up front — this log starts empty and grows as you work. Keep the format; append entries.
> Related: `decisions.md` (the source of truth this log amends), `delivery/06-agent-build-architecture.md`

This file is an **append-only** record of the rulings and disagreements that shape a project *after* the initial `decisions.md` is written. It captures four event types:

| Type | When it is logged |
|---|---|
| `Policy Exception` | A governance rule was set aside for a specific edge case, approved by the owner |
| `Agent Disagreement` | Two agents reached conflicting conclusions; includes how it was resolved and by whom |
| `Tiebreaker Ruling` | A lead/specialist ruled on a question not covered by any doc |
| `Strategic Decision` | The owner made a scope/priority/direction call mid-execution not already in `decisions.md` |

**Rules for all agents:**
- **Append only** — never edit or delete a previous entry.
- Every entry must be **complete** before the agent that logged it proceeds.
- Review/Gate agents **read this file at session start** to understand precedents already set — a precedent entry overrides the original rule for its stated scope.
- Rulings here carry the **same authority** as the doc that originally governed the question. If a ruling changes a locked decision, also amend `decisions.md` and bump its version.

---

## Entry format

```
### [LOG-NNN] — [Type]: [Short title]

**Date:** YYYY-MM-DD
**Task:** [Task ID, e.g. 2-1, or "Pre-sprint" if not tied to a task]
**Type:** Policy Exception | Agent Disagreement | Tiebreaker Ruling | Strategic Decision
**Parties:** [Which agents or roles were involved]
**Conflict / Question:**
[One paragraph: what the conflict was, what rule or finding triggered it, why it couldn't be resolved by reading the relevant doc alone.]

**Ruling:**
[The decision made — be precise. If a policy exception was granted, state its exact scope.]

**Made by:** [Owner | Lead | named specialist role]
**Constraints:** [Any conditions on the ruling, or "None"]
**Precedent:** [Yes — which future cases this applies to | No — one-off]
**Propagation:** [Which docs were updated as a result — e.g. "decisions.md D-12 amended; governance/15 updated", or "None"]
```

---

## Log

> Starts empty. Append entries below as rulings are made. Newest at the bottom.

<!-- ⟨EXAMPLE — delete once you have real entries⟩

### [LOG-001] — Tiebreaker Ruling: {{short title}}

**Date:** {{YYYY-MM-DD}}
**Task:** {{task id}}
**Type:** Tiebreaker Ruling
**Parties:** {{Task Agent vs Review Agent}}
**Conflict / Question:** {{what was ambiguous and why the docs didn't settle it}}
**Ruling:** {{the precise decision}}
**Made by:** {{Lead}}
**Constraints:** None
**Precedent:** Yes — {{applies to all future cases of X}}
**Propagation:** {{decisions.md D-… added}}

-->
