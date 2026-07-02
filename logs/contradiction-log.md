# Contradiction Log

> **Template** · Lifecycle: **append-only** (status field may update) · Owner: Any agent · Load: Reference
> Fill: nothing up front — starts empty, grows as conflicts are found. Add a row per contradiction; record its resolution; never delete history.
> Related: `logs/gap-log.md`, `logs/decisions-log.md`, `decisions.md`

A **contradiction** is when two sources disagree — two docs, a doc and the code, two decisions, or two contributors' inputs. Left unresolved, contradictions become bugs. This log surfaces each conflict and how it was settled.

**Rules:**
- **One row per contradiction.** Give each a stable ID (`CON-1`, `CON-2`, …).
- **Record both sides** and which one won (or the new decision that supersedes both).
- **Append rows; never delete them.** When resolved, set status to `Resolved` and cite the ruling (usually a `logs/decisions-log.md` entry or a `decisions.md` id).
- Resolving a contradiction usually means **amending `decisions.md`** so the conflict can't recur — do that, don't just fix one side.

---

## Log

| ID | Contradiction (source A vs source B) | Severity | Discovered by | Status | Resolution (ruling / decision id) |
|---|---|---|---|---|---|
| CON-1 | ⟨FILL: e.g. "`decisions.md` D-4 says X vs `product/data-model.md` says Y"⟩ | High / Low | ⟨role/task⟩ | Open | — |

<!-- Append new rows above this line. Keep Resolved rows for the audit trail. -->
