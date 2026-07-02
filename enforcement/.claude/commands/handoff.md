---
description: Generate a ready-to-paste session handoff prompt from the current ledger and handoff logs.
---

<!-- TEMPLATE — installs to `.claude/commands/handoff.md` in the target repo. Fill every {{PLACEHOLDER}}.
     {{KIT_PATH}} = path to this kit's docs (or "" if they live at repo root).
     This is the exact command described in delivery/07-session-handoff.md. Invoke: `/handoff`. -->

# /handoff — generate a session handoff prompt

Read the project state and print a single copy-pasteable handoff prompt that orients a fresh, memory-less session. Follow the process and template in `{{KIT_PATH}}/delivery/07-session-handoff.md` exactly.

## Step 1 — Read

- `{{KIT_PATH}}/delivery/02-task-ledger.md` — full task status and dependencies across all phases
- `{{KIT_PATH}}/logs/decisions-log.md` — open exceptions, active flags, precedents
- The Handoff Log inside every task spec whose ledger status is `In Progress` or `Blocked` — focus on the most recent `CHECKPOINT STATE` entry, and copy it **verbatim**

## Step 2 — Fill the template

Fill the **Handoff Prompt Template** from `delivery/07-session-handoff.md` with real values. Emit exactly these sections:

- **Read these first** — `delivery/06-agent-build-architecture.md`, `delivery/02-task-ledger.md`, `logs/decisions-log.md` (in order)
- **Current state** — active phase, overall progress, and the Completed / In progress (with verbatim last checkpoint) / Blocked / Next-unblocked lists
- **Active flags** — every open item: review requests awaiting the owner, unresolved blockers, open policy-exception requests, spec issues awaiting a ruling
- **Your immediate next action** — one clear sentence
- **Spec file for this session** — full path to the relevant task spec

## Step 3 — Output rules

Fill every section with real values — never leave a placeholder blank; write **"None"** where there is nothing to report. Output **only** the prompt block between the `════` markers — no preamble, no explanation.
