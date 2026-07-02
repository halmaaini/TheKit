# Decisions & Disagreements Log

> **EXAMPLE — filled instance, not a template.** A worked example of the Project Kit for a fictional URL shortener ("Snip"). Imitate the shape; don't edit these to build a real project. The blank templates live one level up.

This file is an **append-only** record of the rulings and disagreements that shape Snip *after* the initial `decisions.md` was written. It captures four event types:

| Type | When it is logged |
|---|---|
| `Policy Exception` | A governance rule was set aside for a specific edge case, approved by the owner |
| `Agent Disagreement` | Two agents reached conflicting conclusions; includes how it was resolved and by whom |
| `Tiebreaker Ruling` | A lead/specialist ruled on a question not covered by any doc |
| `Strategic Decision` | The owner made a scope/priority/direction call mid-execution not already in `decisions.md` |

**Rules for all agents:**
- **Append only** — never edit or delete a previous entry.
- Every entry must be **complete** before the agent that logged it proceeds.
- Review/Gate agents **read this file at session start** — a precedent entry overrides the original rule for its stated scope.
- Rulings here carry the **same authority** as the doc that originally governed the question. If a ruling changes a locked decision, also amend `decisions.md` and bump its version.

---

## Log

> Newest at the bottom.

### [LOG-001] — Tiebreaker Ruling: soft-delete + tombstone satisfies short-code integrity (D-11)

**Date:** 2026-06-30
**Task:** 1-3 (short-code generation + integrity)
**Type:** Tiebreaker Ruling
**Parties:** Task Agent (1-3) vs Review Agent
**Conflict / Question:**
D-11 says a short code is "never reused or reassigned after a link is deleted." The Task Agent proposed a **hard delete** of the `links` row on delete (cleaner schema), then relying on the random generator's huge keyspace to make reuse "practically impossible." The Review Agent objected: once the row is gone, the unique index no longer covers that code, so a future `INSERT` *could* legally reissue it — the guarantee would rest on probability, not on a constraint. The two hard-line criteria in `governance/13-domain-hard-lines.md` (enforced at the strongest layer; testable) couldn't both be met by a hard delete, and the docs didn't spell out delete mechanics.

**Ruling:**
Delete is a **soft-delete + tombstone**, not a hard delete. On delete, the `links` row is marked with `deleted_at` and **retained**; the `short_code` unique index spans active *and* tombstoned rows, so the code can **never** be reissued — a database guarantee, not a probability. Redirects for a tombstoned code return 410 (`workflows.md` flow 3). This is the correct reading of D-11.

**Made by:** Lead
**Constraints:** Tombstone rows are excluded from all user-facing link lists (they must not appear in analytics or CRUD views); only the code reservation survives.
**Precedent:** Yes — applies to **all** future "how do we delete X that has an immutable public identifier" questions: retire via tombstone, never free the identifier.
**Propagation:** `product/data-model.md` lifecycle updated (terminal tombstone state); `governance/13-domain-hard-lines.md` hard line 2 states soft-delete + tombstone enforcement; `decisions.md` D-11 clarified and version bumped to 1.0.
