# Gap Log

> **Template** · Lifecycle: **append-only** (status field may update) · Owner: Any agent · Load: Reference
> Fill: nothing up front — starts empty, grows as gaps are discovered. Add a row per gap; flip `Open → Closed` when resolved; never delete history.
> Related: `logs/contradiction-log.md`, `logs/decisions-log.md`, `decisions.md`

A **gap** is something the product needs that is **not yet decided or specified** — a missing decision, an undefined behaviour, an unhandled case, an absent doc. This log makes gaps visible so they get closed instead of silently guessed.

**Rules:**
- **One row per gap.** Give each a stable ID (`GAP-1`, `GAP-2`, …).
- **Append rows; never delete them.** When a gap closes, set its status to `Closed` and record how (usually a `decisions.md` ID or a doc link) — the row stays for history.
- **Discovering a gap is not the same as filling it.** Log it, then either close it via a decision or escalate. Don't quietly invent an answer (see `governance/01-agent-rules.md` — ask, don't guess).
- A gap that blocks a task should also block that task in `delivery/02-task-ledger.md`.

---

## Log

| ID | Gap (what's missing / undecided) | Discovered by | Status | Resolution (decision id / doc / note) |
|---|---|---|---|---|
| GAP-1 | ⟨FILL: e.g. "No rule for what happens when {{X}}"⟩ | ⟨role/task⟩ | Open | — |

<!-- Append new rows above this line. Keep Closed rows for the audit trail. -->
