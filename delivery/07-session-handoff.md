# Session Handoff

> **Template** · Lifecycle: living · Owner: Any agent · Load: Reference
> Fill: replace every `{{PLACEHOLDER}}` and `⟨FILL⟩` block with your project's reality (project name, stack, doc paths). Keep the process, the template sections, and the generation rules.
> Related: `delivery/02-task-ledger.md` (task status), `delivery/06-agent-build-architecture.md` (roles), `logs/decisions-log.md` (active flags & precedents)

## Purpose

When a working session ends, the next session starts with **no memory** of what happened. This document defines how to generate a **handoff prompt** — a single copy-pasteable block of text that orients a fresh session in under a minute — and gives the exact template to fill.

---

## How to generate a handoff prompt

**Option 1 — Slash command (fastest).** Wire up a `/handoff` command (a saved prompt / skill) so an agent reads the ledger and active handoff logs automatically and prints the filled prompt. The prompt at the bottom of this file (**Generation Prompt**) is exactly what that command should run.

**Option 2 — Verbal request.** Say "give me a handoff prompt" or "I need a handoff doc." The agent follows the same process: reads the ledger, reads active handoff logs, fills the template below, and outputs it ready to copy.

Either way the process is identical — the slash command just skips the typing.

---

## What the agent reads before generating

⟨FILL: point these at your real files.⟩

1. `delivery/02-task-ledger.md` — task statuses and dependencies across all phases
2. `logs/decisions-log.md` — open exceptions, active flags, precedents
3. The handoff log in any task spec marked `In Progress` or `Blocked` — specifically the most recent `CHECKPOINT STATE` entry

---

## Handoff Prompt Template

The generated output always follows this structure. Fill every section — never leave a placeholder blank; write "None" where there is nothing to report.

```
════════════════════════════════════════
{{PROJECT_NAME}} — SESSION HANDOFF PROMPT
Copy everything below and paste into a new session.
════════════════════════════════════════

You are starting a new session on the {{PROJECT_NAME}} project — {{ONE-LINE DESCRIPTION: what it is, stack, roles/surfaces}}.

## Read these first (in order)
1. `delivery/06-agent-build-architecture.md` — your role, protocols, rules of engagement
2. `delivery/02-task-ledger.md` — current task statuses and dependencies
3. `logs/decisions-log.md` — active exceptions and precedents

## Current state
**Active phase:** {{PHASE — e.g. "Phase 2 — Build Foundation"}}
**Overall progress:** {{N of M tasks done · N of K gates passed}}

**Completed (this phase):**
- {{TASK-ID}} {{Task name}}
- (or "None yet")

**In progress:**
- {{TASK-ID}} {{Task name}}
  Last checkpoint: {{paste the most recent CHECKPOINT STATE entry from this task's handoff log, verbatim}}
- (or "None")

**Blocked:**
- {{TASK-ID}} {{Task name}} — {{reason from the handoff log BLOCKED entry}}
- (or "None")

**Next unblocked tasks (not yet started):**
- {{TASK-ID}} {{Task name}}  (list every task whose dependencies are met)

## Active flags
{{List every open item from handoff logs and the decisions log — review requests awaiting the owner, unresolved blockers, open policy-exception requests, spec issues awaiting a ruling. Write "None" if nothing is open.}}

## Your immediate next action
{{One clear sentence — e.g. "Resume {{TASK-ID}} from Phase 2 (services layer), picking up from the checkpoint above." or "Start {{TASK-ID}} — read its spec first."}}

## Spec file for this session
{{Full path to the task spec relevant to the immediate next action — e.g. delivery/tasks/{{phase}}/{{task-id}}.md}}

════════════════════════════════════════
END OF HANDOFF PROMPT
════════════════════════════════════════
```

---

## Rules for the agent generating the prompt

- Fill every section with real values — **no placeholder left blank.**
- For any `In Progress` task, paste the most recent `CHECKPOINT STATE` entry **verbatim** so the new session knows exactly where work stopped.
- If a section has nothing to report, write **"None"** — never omit the section.
- Output **only** the prompt block. No preamble, no explanation. The user copies and pastes it directly.

---

## Generation Prompt

This is the exact instruction the `/handoff` command (or a verbal request) runs. Adapt the file paths, then save it as your slash command.

```
Read the project state and generate a ready-to-paste session handoff prompt.

Step 1 — Read these files:
- delivery/02-task-ledger.md — full task status across all phases
- logs/decisions-log.md — active exceptions and precedents
- The handoff log inside any task spec whose ledger status is `In Progress` or
  `Blocked` — focus on the most recent CHECKPOINT STATE entry

Step 2 — Fill the "Handoff Prompt Template" from delivery/07-session-handoff.md
with real values from what you just read. Do not leave any placeholder unfilled.
If a section has nothing to report, write "None."

Output: print only the prompt block between the ════ markers, nothing else.
```
