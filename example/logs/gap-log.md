# Gap Log

> **EXAMPLE — filled instance, not a template.** A worked example of the Project Kit for a fictional URL shortener ("Snip"). Imitate the shape; don't edit these to build a real project. The blank templates live one level up.

A **gap** is something the product needs that is **not yet decided or specified** — a missing decision, an undefined behaviour, an unhandled case, an absent doc. This log makes gaps visible so they get closed instead of silently guessed.

**Rules:**
- **One row per gap**, with a stable ID (`GAP-1`, `GAP-2`, …).
- **Append rows; never delete them.** When a gap closes, set its status to `Closed` and record how (usually a `decisions.md` ID or a doc link) — the row stays for history.
- **Discovering a gap is not filling it.** Log it, then close it via a decision or escalate — don't quietly invent an answer (`governance/01-agent-rules.md`).
- A gap that blocks a task should also block that task in `delivery/02-task-ledger.md`.

---

## Log

| ID | Gap (what's missing / undecided) | Discovered by | Status | Resolution (decision id / doc / note) |
|---|---|---|---|---|
| GAP-1 | Short-code length and charset undecided — needed before code generation (task 1-3) can be built. | Task 1-3 planning | Closed | **D-14** — 7 chars, base62 `[0-9A-Za-z]` (~3.5T space, low collision). Concretizes the D-11 hard line; the tombstone-aware unique index still guarantees non-reuse. |
| GAP-2 | No rule for what a disabled/tombstoned link returns to a visitor — 404 vs 410, and whether to reveal that a code *once existed*. | Task 2-1 planning | Open | Leaning 410 Gone for disabled/tombstoned (per `product/workflows.md` flow 3), but disclosure trade-off (410 confirms the code existed) not yet ruled. Escalated to Lead. |

<!-- Append new rows above this line. Keep Closed rows for the audit trail. -->
