# Read This First — Plain-English Guide

**What this is:** a ready-made starter pack for building software with an AI assistant. Drop it into a new, empty project and it gives the AI everything it needs to plan the work, follow good habits, and build it properly — while checking with you on the important decisions.

Think of it as the binder a careful team prepares on day one, so nothing important gets made up along the way.

**Who does what:** You bring the ideas and make the calls. The AI does the planning and building, follows the rules in here, and stops to ask you whenever a real decision is needed.

---

## How it works (three steps)

1. **You share what you want.** Put any notes, documents, PDFs, or sketches into the **`intake`** folder — or just tell the AI. It reads them and turns them into clear plans.
2. **The AI writes it all down.** It records every decision in one main file, **`decisions.md`**, and builds the plans and rules around it. It asks you before locking anything important.
3. **The AI builds, step by step.** It works through a checklist in **`delivery`**, one task at a time, keeping everything up to date as it goes.

---

## Do ✅

- Put your ideas and documents in the **`intake`** folder.
- Skim the **`example`** folder once — it's a finished sample that shows what "done" looks like.
- Read and approve the big decisions when the AI asks.
- If something should change, change your mind in **`decisions.md`** first — everything else follows from it.

## Don't ❌

- Don't hand-edit the **history** (`logs`, and any file ending in `-log`) — it's a permanent record; only add to it, never erase.
- Don't quietly rewrite the **rules** (`governance`) — change the decision first, then the rule.
- Don't treat the **`archive`** folder as current — it's old, replaced material kept only for reference.
- Don't skip **`decisions.md`** — it's the one file everything else follows.

---

## What's in here (folder map)

```
READTHIS.md      ← this guide, for you
START-HERE.md    the AI's entry point (more technical)
decisions.md     THE key file — every important decision, in one place
MANIFEST.md      a list of every file and how to treat it

intake/          drop your notes, PDFs, and ideas here
product/         what we're building, described in plain words
design/          how it should look — screens and styles
governance/      the rules for building it well
delivery/        the step-by-step build checklist
enforcement/     automatic safety checks (optional)
logs/            the running history — added to, never erased
archive/         old, replaced material — reference only
example/         a finished sample to learn from
```

---

## The one thing to remember

There is a single "source of truth": **`decisions.md`**. Everything else follows from it. When something needs to change, change it there first — and the rest is updated to match.
