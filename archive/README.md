# archive/ — Frozen History

> **Template** · Lifecycle: living (the README) · Owner: Any agent · Load: Reference
> Adopt as-is. Delete this folder only if you never archive anything (you will).
> Related: `../intake/`, `archive-log.md`, `../logs/decisions-log.md`

**What this is:** where processed raw sources and superseded docs go to rest. It preserves history — what a source file said, what an old version of a doc claimed — without cluttering the live kit.

---

## The one hard rule

**Nothing in `archive/` is authoritative.** Read it only to answer *"what did we used to have / where did this come from?"* — **never** to answer *"what's true now."* The current truth lives in `decisions.md` and the live docs. An agent that treats an archived PRD as current will build the wrong thing.

To make this unmissable, an archived doc keeps its content but gets a top banner: `> ⛔ ARCHIVED — not authoritative. Superseded by ⟨what⟩ on ⟨date⟩. Kept for history only.`

---

## What goes here

- **Processed raw sources** — the original PDF/deck/notes after their content was extracted at `../intake/`.
- **Superseded doc versions** — an old PRD or design when a new one replaces it (the *current* doc stays live; the old copy lands here).
- **Abandoned ideas** — a direction that was considered and dropped, worth keeping for the record.

## What does NOT go here

- Anything still current or still consulted. If you re-read it regularly, it's a live source, not an archive item.
- The only copy of something you still need — archive is for superseded/duplicated material, not a junk drawer for live work.

---

## How to archive something

1. Move the file into `archive/` (keep a clear name; prefix with a date if helpful).
2. If it's a doc, add the `⛔ ARCHIVED` banner at its top.
3. Add a row to `archive-log.md`: what, when, why, and what superseded it.
4. Prefer archiving over deleting — history is cheap and occasionally decisive.

## Bottom line

A quiet, clearly-labelled graveyard for old sources and superseded docs. Kept for provenance, never mistaken for current truth.
