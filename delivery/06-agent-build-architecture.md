# 06 — Agent Build Architecture

> **Template** · Lifecycle: populate-once · Owner: Lead · Load: Reference
> Fill: adopt these roles & protocols; tune names/counts to your team. Delete protocols you won't use.
> Delete this file if: you build solo with no multi-agent protocol.
> Related: `delivery/02-task-ledger.md`, `delivery/07-session-handoff.md`, `governance/18-assistant-tooling.md`

## Purpose

This document defines the **agent execution model** your project adopts to build software with AI coding agents: what roles exist, what each one reads / does / outputs, how they hand off to each other, and how edge cases are handled so the whole thing doesn't stall or drift. Every agent executing work on the project reads this document before starting.

The value of this doc is the **protocols** — the ~17 rules below that turn "an AI writes code" into "a disciplined team ships software." Keep the ones that apply to how you work; delete the rest.

---

## How to adopt this in your project

1. **Pick your roles.** The five below (Task, Review, Gate, Orchestrator, Product Owner) are a good default. If you run leaner, you might collapse Review into Gate, or skip the Orchestrator entirely — but keep at least Task + one independent check.
2. **Wire the reading lists.** Every role starts by loading the same small set of docs (this file, the task ledger, the always-loaded governance set). Fill the `{{…}}` paths to match your kit.
3. **Choose which protocols you'll enforce.** All 17 exist to close a specific failure mode. Delete any that don't match a risk you actually have — but read each one first; most bite eventually.
4. **Tune the specialists.** The eight consultant roles map to common review domains. Keep the ones that match your stack (drop the DB specialist if you have no database, the Design specialist if you have no UI) and adjust the trigger matrix to your folder layout.
5. **Set the ⟨FILL⟩ counts.** Number of phases/sprints, who signs off a gate, the parallel-work policy — decide these once and record them here.

> Rule of thumb: every protocol must answer *"what specific failure does this prevent in THIS project?"* If it can't, delete it. A protocol that gets followed beats ten that get skipped.

> **Minimum tune (don't let this doc's size stall you):** only steps 1 and 5 above are load-bearing on day one — pick the roles and set the counts/sign-offs. Every other `⟨FILL⟩` in this file can wait until the protocol it belongs to first fires; the protocols read fine as-shipped.

---

## Platform note

Agents run as **[your AI coding agent] sessions** (e.g. Claude Code). Each task runs as a **separate session**. Sessions do not share memory — each agent loads its context from the documents in this kit at session start, not from the previous agent's memory.

⟨FILL⟩ If you have locked a specific agent/orchestration approach as a decision, record it here and cite the decision (e.g. `(D-…)`): which tool, whether an external orchestration framework is allowed, and why. Default stance: prefer a coding agent with native file/shell/git access over adding an orchestration framework unless the plan needs one — an external framework adds complexity without benefit at small scale.

---

## Agent Roles

⟨FILL — this template defines five roles. Adjust the count and names to your team.⟩ Each role is a distinct session with a defined reading list, scope, and output.

---

### Role 1 — Task Agent

**What it does:** Executes one task spec from start to finish. Writes code, runs tests, fills the handoff log, updates the ledger.

**Triggered by:** Product Owner (manually) or the Orchestrator.

**Reads at session start (in this order):**
1. `delivery/06-agent-build-architecture.md` — this file (rules of engagement)
2. `delivery/02-task-ledger.md` — confirm task status and dependencies
3. The always-loaded governance set (`governance/README.md` lists it; includes agent rules + dev workflow)
4. `logs/decisions-log.md` — precedents and open rulings
5. The specific task spec listed in the ledger row
6. All context documents the task spec names

**Hard rules:**
- Confirm every "Depends On" row in the ledger shows `Done` or `Gate: Passed` before writing a single line of code. If not → stop, set own status to `Blocked`, surface the reason.
- Update own ledger row to `In Progress` at session start.
- Update own ledger row to `Done` only after all exit criteria in the task spec are checked.
- Fill in the Handoff Log in the task spec file completely — never leave it blank.
- Never make a decision not covered by the spec without logging it (see Unplanned Decisions protocol below).

**Output:** Code committed to a feature branch, handoff log filled, ledger row updated to `Done`.

---

### Role 2 — Review Agent

**What it does:** Independently audits the Task Agent's output after the task is marked Done but before the Gate Agent runs. This is the primary defence against hallucination, missed requirements, and silent wrong decisions.

**Triggered by:** Immediately after a Task Agent marks its row `Done` in the ledger. The Review Agent is a separate session — it has no memory of the Task Agent's session.

**Reads at session start:**
1. `delivery/06-agent-build-architecture.md`
2. The task spec file the Task Agent just completed
3. The handoff log the Task Agent filled in
4. The governance/spec documents the task spec named in its context section
5. `logs/decisions-log.md` — to honour existing precedents

**What it checks:**
1. **Completeness** — every exit-criteria checkbox in the task spec is genuinely met (not just ticked). Spot-check by reading the actual files created.
2. **Spec conformance** — file paths, function names, API shapes, and field names match the governing spec documents exactly. Run grep checks against known required patterns.
3. **Architecture compliance** — the project's layer/boundary rules hold (e.g. no business logic in route handlers, no direct vendor imports outside the wrapper layer, no unscoped data queries — per your `governance/` architecture docs).
4. **Hallucination check** — no invented fields, endpoints, or features not in the spec. Compare against the canonical schema/API spec docs.
5. **Test coverage** — required tests (including negative/authorization cases) exist and are not skipped.
6. **Handoff log** — is complete, honest, and lists every file created or modified.

**Output — two possible outcomes** (a third, "Spec Issue", is added by Protocol 13):

| Outcome | What the Review Agent does |
|---|---|
| **Pass** | Adds a review pass note to the task's Handoff Log. Sets the ledger row to `Review: Passed`. Gate Agent is now unblocked for this task. |
| **Fail** | Lists every specific finding in the Handoff Log. Sets the task ledger row back to `In Progress`. Does NOT fix the issues — sends them back to a Task Agent to resolve. |

**What the Review Agent does NOT do:** It does not fix code. It does not make judgement calls on design. It only audits and reports.

---

### Role 3 — Gate Agent

**What it does:** Runs the phase/sprint gate checklist from `delivery/01-phases-and-gates.md` after all tasks in a phase are `Done` and all have `Review: Passed`. Signs off the phase and unblocks the next one.

**Triggered by:** After all task rows in a phase show `Review: Passed`.

**Reads at session start:**
1. `delivery/06-agent-build-architecture.md`
2. `delivery/02-task-ledger.md`
3. The phase's gate checklist in `delivery/01-phases-and-gates.md`
4. The handoff logs of all tasks in the phase
5. The spec documents referenced by the gate
6. `logs/decisions-log.md`

**What it checks:**
- Every item in the gate checklist — no skipping, no assuming.
- Runs the automated test suites (⟨FILL: your `test` / `build` / `e2e` commands⟩) and records results.
- Runs the named grep checks in the gate (e.g. unscoped queries, direct vendor imports, any leakage of restricted fields into responses — per your hard lines).
- Verifies all blocking-severity bug conditions are clear.

**Output — two possible outcomes:**

| Outcome | What the Gate Agent does |
|---|---|
| **Pass** | Updates the phase row in the ledger to `Gate: Passed`. Moves the next phase's task rows from blocked to unblocked. Fills in the sign-off table in the gate. |
| **Fail** | Lists every failing item with exact file and line references. Sets the gate back to `Not Started`. Sends findings to the relevant Task Agent(s) to fix. |

**Gate Agent does NOT do:** It does not fix failing code. It does not negotiate requirements. If a gate item fails, it fails — no exceptions.

⟨FILL⟩ Name who owns the human sign-off row on a gate (e.g. Product Owner, Lead, QA) and whether any gate needs more than one signer.

---

### Role 4 — Orchestrator Agent (optional, for automated runs)

**What it does:** Reads the ledger, finds the next unblocked task, spawns the correct agent (Task or Gate), waits for completion, then moves to the next.

**When to use:** Only when running multiple tasks in sequence without manual intervention. For early phases, manual triggering by the Product Owner is usually preferred — you learn where the plan is weak before you automate it.

**Reads at session start:**
1. `delivery/06-agent-build-architecture.md`
2. `delivery/02-task-ledger.md`

**Logic:**
1. Scan the ledger for rows where status = `Not Started` and all `Depends On` rows = `Done` or `Gate: Passed`.
2. Trigger a Task Agent session for each unblocked task (in parallel only where the ledger marks tasks as parallelisable).
3. After each Task Agent completes, trigger a Review Agent for that task.
4. After all tasks in a phase have `Review: Passed`, trigger the Gate Agent.
5. After the Gate Agent passes, update the ledger and move to the next phase.

**Does NOT:** Make any product decisions. Modify task specs. Override gate failures.

---

### Role 5 — Product Owner (Human)

**That is you.** Your inputs are not optional — they are blocking dependencies for specific tasks.

**Your touchpoints:**

| When | What you do | Blocking what |
|---|---|---|
| Before any UI phase | Produce/approve wireframes using ⟨your design tool⟩ (see `design/design-process.md`) | The first UI task of that phase cannot start |
| At each phase gate | Review and sign the human row in the gate | Gate cannot pass |
| When a `Blocked` escalation arrives | Make the decision described in the blocker | Task Agent cannot proceed |
| When a strategic scope question arises | Answer it (postpone/prepone a feature, adjust a threshold, resolve a taste call) | Depends on the question |

You do not review code. You review outcomes: does this screen feel right, does this flow make sense, does this match your vision for the product.

---

## Execution Model

### Session-start protocol (all agent types)

Every agent, at the start of every session, does this before any other action:

1. Read `delivery/06-agent-build-architecture.md` (this file).
2. Read `delivery/02-task-ledger.md`.
3. Confirm own role and which task or gate to run.
4. Confirm all dependencies are met. If not → stop immediately (see Protocol 2, Blocker Escalation).
5. Load task-specific documents.
6. Begin work.

### Handoff sequence for a single task

```
Product Owner (or Orchestrator) triggers Task Agent
    │
    ▼
Task Agent runs → marks ledger row In Progress
    │
    ▼
Task Agent completes → fills Handoff Log → marks ledger row Done
    │
    ▼
Review Agent runs → audits output
    │
    ├── Review PASS → marks `Review: Passed` in ledger
    │       │
    │       ▼
    │   (next task or Gate Agent)
    │
    └── Review FAIL → sends findings back to Task Agent
            │
            ▼
        Task Agent fixes → marks Done again → Review Agent re-runs
```

### Phase completion sequence

```
All tasks in phase: `Review: Passed`
    │
    ▼
Gate Agent runs the phase gate checklist
    │
    ├── Gate PASS → phase → `Gate: Passed` in ledger → next phase unblocked
    │
    └── Gate FAIL → findings logged → relevant Task Agent(s) fix → Gate Agent re-runs
```

---

## Gap Protocols

These protocols close the gaps that otherwise stall or corrupt an agent-run build. Every Task Agent and Review Agent must follow the ones your project keeps. Each protocol names the **problem** it prevents, then the **rule**.

> ⟨FILL⟩ Delete any protocol below that doesn't match a failure mode you actually have. Renumber if you drop some. Read each one before deleting it — most describe a failure that only becomes obvious after it has already cost you a session.

---

### Protocol 1 — Entry Criteria Enforcement

**Problem:** Nothing technically stops a Task Agent from starting when its dependencies are not done.

**Rule:** At session start, before writing any code, a Task Agent reads the ledger and checks every row listed in its "Depends On" column. If any row is not `Done` or `Gate: Passed`, the agent:

1. Sets its own ledger row to `Blocked`.
2. Writes in its Handoff Log: `BLOCKED — waiting on [task ID]: [current status]`.
3. Stops. Does not proceed. Does not guess that the dependency is "probably fine."

The Product Owner or Orchestrator resolves the block and re-triggers the Task Agent.

---

### Protocol 2 — Blocker Escalation

**Problem:** A Task Agent hits something mid-task that the spec doesn't cover and makes a silent guess instead of escalating.

**Rule:** If a Task Agent encounters any of the following mid-task, it **stops immediately**:

- A decision that requires product or design input (layout, copy, feature behaviour not in spec)
- A conflict between two spec documents that cannot be resolved by the source-of-truth order in `START-HERE.md` / your kit's canonical ordering
- A technical constraint that makes the specified approach impossible
- An ambiguity that would require inventing behaviour not described anywhere

**What the agent does:**
1. Commits all work completed so far to the branch with a message starting `WIP:`.
2. Sets its ledger row to `Blocked`.
3. Writes in the Handoff Log: `BLOCKED — [exact description of the blocker, what decision is needed, what the options are]`.
4. Stops.

The Product Owner reviews the blocker and provides a decision before the agent is re-triggered.

**What the agent does NOT do:** Guess. Proceed. Implement a "reasonable default" without documenting it. Silent decisions are not allowed.

---

### Protocol 3 — Unplanned Dependency Protocol

**Problem:** A Task Agent needs a library, tool, or external service not mentioned in the plan and adds it silently.

**Rule:** If a Task Agent needs to add any of the following that are not already in the project:

- A new package/dependency
- A new environment variable
- A new external service or API
- A new data model or migration not in the canonical schema doc

The agent must:
1. Stop before adding it.
2. Document the need in the Handoff Log: `UNPLANNED DEPENDENCY — [what is needed, why, options considered, recommended choice]`.
3. If the addition is a widely-used, low-risk utility (e.g. a date-formatting helper, a UUID generator) with no security implications and no schema changes — the agent may proceed and must log the decision with rationale.
4. If the addition involves a new external service, a schema change, or anything that affects security — treat as a blocker (Protocol 2).

The Review Agent checks the handoff log for undocumented additions and flags them as findings.

---

### Protocol 4 — Hallucination Defence

**Problem:** A Task Agent invents an API field, endpoint, or behaviour not in the spec.

**Three layers of defence:**

**Layer 1 — Spec grounding (Task Agent):**
Before implementing any API endpoint, data field, or domain function, the Task Agent reads the relevant spec section and quotes the exact field name or shape in a code comment. This forces the agent to look up the spec rather than recall from memory.

**Layer 2 — Review Agent grep checks:**
The Review Agent runs checks like the following on every task completion (⟨FILL⟩ with your project's canonical names and enums):

```bash
# No field names in code that don't exist in the canonical schema doc
# No endpoint paths in code that don't exist in the canonical API doc
# No status/enum values other than the ones the spec defines
# No canonical calculation performed outside its single home module
```

**Layer 3 — Gate Agent test suite:**
The gate runs the automated test suites. Tests written to assert exact API shapes and domain invariants catch hallucinated behaviour at runtime.

---

### Protocol 5 — Incomplete Task Discovered Late

**Problem:** A Gate Agent (or Review Agent) discovers that a task was marked Done but is actually incomplete.

**Rule:**
1. The Gate Agent or Review Agent documents the specific gap with file name and line reference.
2. Sets the relevant task row back to `In Progress` in the ledger.
3. Sets the gate or review back to `Not Started`.
4. A Task Agent is triggered to resolve only the documented gap — not redo the whole task.
5. Review Agent re-audits the gap items only.
6. Gate Agent re-runs only the gate checklist items that were failing.

---

### Protocol 6 — Better Solution Discovered by Agent

**Problem:** An agent finds a better technical approach than what the spec describes.

**Rule:** Agents have latitude on HOW to implement, as long as:
- All exit criteria are met
- All named invariants hold (your project's hard lines from `governance/13-domain-hard-lines.md` — e.g. isolation, state-machine, layer boundaries, no direct vendor imports)
- All spec-defined field names, API shapes, and domain calculations are preserved exactly

If the agent's alternative satisfies all of the above, it may proceed. It must document the deviation in the Handoff Log: `IMPLEMENTATION NOTE — chose [approach] over [spec approach] because [reason]. All exit criteria verified.`

If the alternative requires changing a named invariant, an API shape, or a data field — treat as a blocker (Protocol 2). The spec is the authority; agents do not unilaterally change it.

---

### Protocol 7 — Policy Exception Protocol

**Problem:** A strict rule in a governance/spec doc blocks a legitimate product need that the rule's author didn't anticipate — for example, a computation that must happen at the edge for a valid UX reason even though the rule says all computation belongs in the domain layer.

**Rule:** No agent may bend, ignore, or work around a governance rule on its own — ever. If an agent hits a rule that blocks a valid approach:

1. Stop at the point of conflict.
2. Commit work completed so far with a `WIP:` prefix.
3. Set its ledger row to `Blocked`.
4. Write in the Handoff Log: `POLICY EXCEPTION REQUEST — Rule: [document and section, exact rule text]. Conflict: [what edge case makes this rule block the valid approach]. Options: [list options with trade-offs]. Recommendation: [agent's preferred path].`
5. Append an entry to `logs/decisions-log.md` using that file's format.
6. Escalate to the Product Owner — this is always a human decision.

**Product Owner decides:**
- **Grant exception:** State the exception, the reason, and any constraints. The entry in `logs/decisions-log.md` is updated with the ruling and becomes a **locked precedent** — future agents in the same situation follow the exception, not the original rule.
- **Uphold rule:** Agent must find an approach that respects the rule as written. The ruling is logged.

**What agents never do:** "I think the intent of the rule doesn't apply here" is not grounds to proceed. A logged, Product Owner–approved exception is the only authorisation to deviate from a governance rule.

---

### Protocol 8 — Agent Disagreement and Conflict Resolution

**Problem:** Two agents reach conflicting conclusions, a specialist flags something a Review Agent already passed, or an agent disputes a ruling made against it — and the conflict is resolved silently.

**Rule:** Any time agents produce conflicting findings or an agent disputes a ruling, the conflict must be documented and resolved through the hierarchy below. It cannot be resolved by one agent silently overwriting another.

**Conflict Resolution Hierarchy:**

| Situation | Authority | Who resolves |
|---|---|---|
| A governance/spec doc addresses it directly | The document | Follow the document — no agent opinion needed. Log only if interpretation was genuinely ambiguous. |
| Docs are silent — technical/structural question | Architecture specialist | Architecture specialist gives a ruling. Log in `logs/decisions-log.md`. |
| Docs are silent — security-critical finding | Security specialist | **Hard veto** — no other agent, including the Architecture specialist, can override a security-critical finding without Product Owner approval and a logged exception. |
| Two specialists conflict on a structural question | Architecture specialist | Architecture specialist is the tiebreaker. |
| Two specialists conflict and security is involved | Security specialist | The security veto applies regardless of other opinions. |
| Two docs conflict with each other (same level) | Architecture specialist | Architecture specialist rules which definition governs. The ruling is logged; the doc that lost is updated to match. |
| Docs are silent — product, strategy, or taste question | Product Owner | Escalate to human. No agent resolves this alone. |

⟨FILL⟩ Adjust the authority column to your team. The principle to keep: a single named tiebreaker for structural conflicts, a hard veto for your safety-critical domain, and the human for taste/strategy.

**Documentation requirement:** Every disagreement that reaches step 2 or higher in this hierarchy must be logged in `logs/decisions-log.md`. Entries are permanent — they build a precedent record so the same conflict is not relitigated in a future phase.

**How to log a disagreement:**
1. The agent that surfaces the conflict writes the initial entry.
2. The agent (or human) that makes the ruling adds the outcome.
3. Review Agents and Gate Agents read `logs/decisions-log.md` at session start to understand precedents already set.

---

### Protocol 9 — Documentation Ownership

**Problem:** A Task Agent adds a new endpoint, model, or calculation and updates the code correctly — but the spec documents, cross-references, and related files are left stale. Future agents work from out-of-date docs and the project drifts.

**Owner:** The Task Agent that produced the change owns every documentation update that change requires. The Review Agent verifies completeness before issuing `Review: Passed`.

**The two-step rule:**

1. **Update the primary document** — the spec doc directly governing what was added (see trigger table below).
2. **Run the cascade check** — after updating the primary, scan every document that references it and update any that now need to reflect the change. Do not stop at the first obvious document.

**Allowed vs. restricted:**
- Task Agents may **add** new entries to spec documents (new endpoint, new field, new calculation).
- Task Agents may **never edit or delete** an existing locked definition in a governance/spec doc without a Product Owner–approved Policy Exception (Protocol 7).

**Documentation Trigger Table**

⟨FILL — map "thing produced" → "doc(s) that must be updated." The rows below are generic examples; replace the doc names with your kit's real paths.⟩

| What the Task Agent produced | Primary document(s) to update | Cascade — also check and update if affected |
|---|---|---|
| New API endpoint | `governance/19-api-contract.md` | `governance/07-testing-standards.md` (if new critical path) |
| New data model or field | `governance/12-data-access-and-schema.md` + `product/data-model.md` | `governance/19-api-contract.md` (if response shape changed); your domain/calc module (if the field feeds a calculation); `governance/16-security-and-approval.md` (if the field is sensitive) |
| New domain calculation | `product/data-model.md` / your domain module | `governance/14-single-source-of-truth.md`; `governance/12-data-access-and-schema.md` (if new fields required) |
| New authorization policy / migration | `governance/16-security-and-approval.md` | `governance/12-data-access-and-schema.md` (if table ownership changed) |
| New package / env var | `governance/21-dependencies-and-supply-chain.md`, `governance/20-ci-cd-and-deployment.md` | `governance/20-ci-cd-and-deployment.md` (if required in CI) |
| New UI screen or layout change | `design/screens.md` + `design/design-system.md` (log any deviation from approved layout) | `product/workflows.md` (if navigation changed) |
| New error code | your error-codes module | `governance/19-api-contract.md` (if the error is returned by an endpoint) |
| New folder or file location | `governance/03-project-map.md` | project root readme / doc map |
| Policy exception granted | `logs/decisions-log.md` | the governance doc where the exception applies (add a pointer to the log entry) |
| New agent protocol, role, or specialist | `delivery/06-agent-build-architecture.md` (this file) | agent reading lists elsewhere; doc map |
| Task completed | `delivery/02-task-ledger.md` (status → `Done`) | `delivery/03-task-matrix.md` (tick the box) |

**Task Agent exit checklist for documentation (run before marking `Done`):**

- [ ] Primary spec document updated for every new item added
- [ ] Cascade check complete — every document that references what changed has been reviewed and updated where needed
- [ ] All new files and all modified files listed in the Handoff Log
- [ ] No existing locked definition in any governance/spec doc was edited or deleted (if one needed changing, a Policy Exception was filed first)

**Review Agent documentation check (part of every review):**
1. Read the Handoff Log's list of files created or modified.
2. Cross-reference the trigger table to identify which documents should have been updated.
3. Open the relevant docs and confirm the new items are present.
4. Flag any missing update as a **P1 finding** — documentation gaps block `Review: Passed`.

---

### Protocol 10 — Session Recovery

**Problem:** A Task Agent session crashes, times out, or hits the context limit before completing. The ledger shows `In Progress`, the branch may have partial work, and the new session has no memory of what was done.

**Rule:** When a Task Agent session starts and finds its own ledger row already set to `In Progress`:

1. Do not start from scratch. Do not re-implement anything already committed.
2. Run `git log --oneline -20` on the feature branch to read what was committed and when.
3. Read the partial Handoff Log if one exists.
4. Compare committed work against the task spec exit criteria to assess what is done and what remains.
5. Write in the Handoff Log: `SESSION RECOVERY — previous session completed: [list]. Resuming from: [next item].`
6. Continue from where the previous session left off.

---

### Protocol 11 — Checkpoint Commits

**Problem:** A Task Agent works through a long task then hits the context limit before committing. All work is lost with no state to recover from.

**Rule:** Task Agents must commit work at logical checkpoints — not only at completion. A **checkpoint commit** is required after each natural boundary, for example (⟨FILL⟩ to your architecture's layers):

- All schema changes and migration files
- Each complete architectural layer (e.g. all data-access first, then all services, then all handlers — each committed separately)
- Each complete UI screen or component group
- All test files (committed after the code they test)

**Commit message format:** `CHECKPOINT [Task ID]: [what was completed in this commit]`

**State snapshot requirement:** At every checkpoint commit, the agent also writes a state snapshot entry in the Handoff Log immediately after committing:

```
CHECKPOINT STATE [n] — [label]:
Completed: [what was done in this phase]
Remaining: [what phases/items are still left]
Decisions: [any non-trivial choices made during this phase]
Next session starts at: [exact description of where to pick up if this session ends here]
```

This turns the Handoff Log into a running recovery document. If context is compacted or the session ends unexpectedly, the next session reads the Handoff Log (a file — always accessible regardless of context state) to restore full situational awareness. Git history alone is not sufficient for recovery.

---

### Protocol 12 — Parallel Task File Conflicts

**Problem:** Two tasks running in parallel both modify the same file, producing a git merge conflict.

**Rule:** Before starting work, a Task Agent checks the ledger's parallel-task visibility section to identify tasks running in parallel. For each parallel task:

1. Read the parallel task's spec to identify which files it will create or modify.
2. List any overlapping files in the Handoff Log: `PARALLEL OVERLAP — [task ID] and this task both modify: [file list]. Coordination: [how the overlap is handled].`
3. Where both tasks add to the same file, use **additive edits only** — append new sections, never rewrite existing content.
4. Avoid modifying shared config files unless the task spec explicitly requires it.

**Merge conflict resolution:** The task that merges second is responsible for resolving the conflict. Resolution must preserve all changes from both tasks — no silent deletion of the other task's work.

⟨FILL⟩ If you never run tasks in parallel, delete this protocol and note "serial execution only" in the ledger.

---

### Protocol 13 — Spec Issue Escalation

**Problem:** The Review Agent discovers the task spec itself is wrong — not the implementation. The Task Agent implemented exactly what was asked, but what was asked conflicts with a governance/spec doc. Returning it as `Review: Failed` creates an infinite loop because the Task Agent cannot fix a wrong spec by rewriting correct code.

**Rule:** The Review Agent has a **third outcome**:

| Outcome | When to use | What the Review Agent does |
|---|---|---|
| **Review: Passed** | Implementation matches spec and all governance docs | Mark ledger row `Review: Passed` |
| **Review: Failed** | Implementation does not match spec or governance docs | List findings, set row to `In Progress`, send back to Task Agent |
| **Spec Issue** | Spec itself conflicts with a governance/spec doc — implementation is correct given the spec | Log `SPEC ISSUE — [exact conflict, which spec doc vs which governance doc]` in the Handoff Log. Set row to `Blocked`. Escalate to the Architecture specialist. Task Agent does NOT re-run until the spec is corrected. |

After a Spec Issue: the Architecture specialist (or the Product Owner, if it is a product question) corrects the task spec file. The task row is reset to `Not Started`. A fresh Task Agent runs against the corrected spec.

---

### Protocol 14 — Agent Self-Correction

**Problem:** A Task Agent mid-task realises it made a mistake in earlier work — wrong naming, wrong layer, wrong pattern. With no protocol, agents either silently fix (undocumented) or leave it for Review to catch.

**Rule:**

- **Before the first CHECKPOINT commit:** Silent correction is allowed. No log entry required — the work has not been recorded yet.
- **After a CHECKPOINT commit:** The correction must be documented: `SELF-CORRECTION — [what was wrong, in which file/function]. [What was changed and why].`
- **If the correction affects an API shape, schema field, or domain calculation:** Treat as a mid-task blocker (Protocol 2) — do not silently correct something another task or agent depends on.

---

### Protocol 15 — Spec Change and Downstream Impact

**Problem:** A governance/spec doc changes mid-phase (triggered by a policy exception or product decision). Tasks already marked `Done` used the old definition and are now stale. No one identifies the impact.

**Rule:** When any governance/spec doc is modified, the agent making the change must immediately:

1. Search the codebase for every reference to the changed element (field name, endpoint path, enum value, calculation).
2. List every affected task ID in the change's entry in `logs/decisions-log.md`.
3. For each affected task:
   - `Done` or `Review: Passed` → set back to `In Progress`. Write `SPEC CHANGE IMPACT — [what changed, what needs updating]` in that task's Handoff Log.
   - `Not Started` → update the task spec file to reflect the new definition before that task begins.
   - `In Progress` → write a `SPEC CHANGE IMPACT` note to the active Handoff Log immediately.
4. Gate Agent re-runs any checklist items that touched the changed element.

---

### Protocol 16 — Product Owner On-Demand Review Flag

**Problem:** An agent encounters something that looks right technically but may not align with the Product Owner's vision. There is no lightweight way to surface it without triggering a full blocker.

**Rule:** Any agent — at any time — may add the following to its Handoff Log **without stopping work**:

`PRODUCT OWNER REVIEW REQUEST — [what to review]. [Why it needs human judgment]. [Options]. [Recommended path].`

This does not block execution unless the agent also explicitly invokes Protocol 2. The agent continues. The Product Owner reviews the flag at their next check-in and may:

- **Take no action** — approves the agent's path implicitly.
- **Redirect** — sets the task back to `In Progress` with a new direction note.
- **Escalate to a full blocker** — if the issue is serious enough to stop work.

**When agents use this:** Layout or copy that is a product taste call. A feature edge case where the technically correct answer may not be the right product answer. Anything the agent wants a human second opinion on without being willing to fully stop.

---

### Protocol 17 — Large Task Phase Planning

**Problem:** Agents cannot detect their own context utilisation as a percentage. There is no "context is running low" signal to act on. Large tasks that run linearly until context runs out leave no clean recovery point — and no plan for how long the task was expected to take.

**The practical equivalent:** Define phase boundaries *before writing any code*. Each phase is designed to complete in one session. If context gets heavy, the agent ends the session deliberately at a phase boundary rather than being cut off mid-implementation.

**What counts as a large task** (⟨FILL⟩ to your thresholds):
- Creates or modifies ~10+ files
- Spans 3+ architectural layers (e.g. schema + data-access + service + handler + UI)
- Has 7+ exit criteria in the task spec
- Is explicitly labelled as large in the task spec or ledger

**Rule:** Before writing any code, the Task Agent for a large task defines phase boundaries as the **very first action** of the session.

1. Read all task spec exit criteria completely.
2. Group the work into phases where each phase:
   - Produces a coherent, committable unit of work
   - Can realistically complete in one session
   - Has 2–4 mini exit criteria of its own
3. Write the phase plan to the Handoff Log: `PHASE PLAN — Phase 1: [name, deliverable, mini criteria]. Phase 2: [...]. …`
4. Begin Phase 1.

At each phase boundary: checkpoint commit + state snapshot (Protocol 11). If context is feeling heavy after a phase completes, end the session deliberately — the next session recovers cleanly via Protocol 10.

**Recommended phase structure for common task types** (⟨FILL⟩ to your stack):

| Task type | Suggested phases |
|---|---|
| Full-stack feature | 1: Schema + migrations · 2: Data-access + services · 3: Handlers + validation · 4: UI screens · 5: Tests |
| UI-only task | 1: Layout + components · 2: Data wiring + state · 3: Tests |
| Domain logic task | 1: Core calculation + types · 2: Edge cases + invariants · 3: Tests |
| Project setup (e.g. the first foundation task) | 1: Repo init + tooling config · 2: Folder structure + shared config · 3: Auth plumbing · 4: DB connection + seed · 5: CI config |

These are starting suggestions — the Task Agent adapts the phase split based on the actual task spec before it starts.

---

## Handoff Log Minimum Standard

A handoff log is not complete because it exists. It is complete only when it contains every section below. The Review Agent treats a missing or vague section as a **P1 finding**.

```
### Handoff Log — [Task ID]

**Summary:**
[One paragraph: what was built, the main implementation decisions, anything notable about how this task went.]

**Files created or modified:**
- `path/to/file` — [one line: what this file does or what changed]
- (list every file — no omissions; "see commit" is not acceptable)

**Exit criteria:**
- [x] [Criterion from task spec] — [brief note on how it was verified]
- [ ] [Criterion] — NOT MET: [reason] (if any criterion was not met, task cannot be marked Done)

**Protocol entries** (include every entry that applies; omit types that did not occur):
- IMPLEMENTATION NOTE — …
- UNPLANNED DEPENDENCY — …
- SELF-CORRECTION — …
- SESSION RECOVERY — …
- CHECKPOINT STATE — …
- PARALLEL OVERLAP — …
- CONSULTATION REQUEST / CONSULTATION RESULT — …
- POLICY EXCEPTION REQUEST — …
- PRODUCT OWNER REVIEW REQUEST — …
- SPEC ISSUE — …
- BLOCKED — …

**Documentation updates:**
- [doc updated] — [what was added or changed]
- "None" is only valid if the task produced zero new spec-worthy items (new endpoint, field, calculation, env var, etc.)

**Foundational decisions** (required for the first foundation task and any task that establishes a new pattern):
- [Any implementation choice not specified in the task spec or any governance doc — e.g. tooling config, linting rules, folder scaffolding, package selections — with rationale for each]
- Omit this section only for tasks that follow already-established patterns with no novel choices
```

---

## Context Loading Reference

Quick reference: what each agent type reads before starting work. (⟨FILL⟩ paths to match your kit.)

| Agent | Always reads | Also reads |
|---|---|---|
| Task Agent | `06-agent-build-architecture.md`, `delivery/02-task-ledger.md`, `logs/decisions-log.md`, the always-loaded `governance/` set | Task spec + all docs listed in the task's context section |
| Review Agent | `06-agent-build-architecture.md`, `logs/decisions-log.md`, the task spec, the task handoff log | Governance/spec docs referenced in the task spec |
| Gate Agent | `06-agent-build-architecture.md`, `delivery/02-task-ledger.md`, `logs/decisions-log.md`, the gate checklist, all task handoff logs in the phase | Governance/spec docs referenced in the gate |
| Orchestrator | `06-agent-build-architecture.md`, `delivery/02-task-ledger.md` | Nothing else — it only reads status, does not execute work |

---

## What Agents Never Do

Regardless of role, no agent ever:

- Pushes directly to the default branch — all work goes to a feature branch
- Merges branches — that is a human (Product Owner) action
- Modifies a governance/spec document without a documented reason and Product Owner awareness
- Adds a scope item not in the agreed scope boundary — that requires a change request via `delivery/05-change-requests.md`
- Marks a task `Done` before its handoff log is filled in
- Proceeds past a blocker by guessing
- Bends or ignores a governance rule without a logged, Product Owner–approved Policy Exception (Protocol 7)
- Resolves an agent disagreement silently — all conflicts at hierarchy step 2 or above go to `logs/decisions-log.md` (Protocol 8)
- Starts from scratch when a session recovers — always checks branch state and partial handoff log first (Protocol 10)
- Commits only at task completion — checkpoint commits are required at each layer boundary (Protocol 11)
- Silently corrects post-checkpoint mistakes without a SELF-CORRECTION log entry (Protocol 14)
- Modifies a governance/spec doc without immediately identifying and flagging all downstream tasks affected (Protocol 15)
- Submits a handoff log that is missing any required section from the Handoff Log Minimum Standard

---

## Specialist Consultants

Specialist agents are not execution agents — they do not write code. They are **consultants** called in two situations:

1. **Review consultation** — the Review Agent calls them automatically after a task is marked `Done`, based on what files the task produced.
2. **Mid-task consultation** — a Task Agent calls one when it hits a decision in that specialist's domain and needs a ruling before proceeding.

Each specialist reads only its own domain documents, produces a structured findings report, and hands it back. The Review Agent (or Task Agent) acts on the findings.

> ⟨FILL⟩ This template defines eight specialists mapped to common review domains. Keep the ones that match your stack and delete the rest — e.g. drop the DB+Schema specialist if you have no database, the Design specialist if you have no UI. Each specialist below lists a generic **domain**, **reads**, **called-when trigger**, and **review focus**; fill the doc names and folder globs with your kit's real paths.

---

### Specialist 1 — Design

**Domain:** UI layout, copy, accessibility, visual consistency.
**Reads:** approved wireframes for the current phase; design-system spec (labels, tokens, component variants, empty-state copy); screen-content spec; accessibility guidelines; user-flow diagrams.
**Called when:** a task produces UI files (⟨FILL glob⟩, e.g. `app/**/*.tsx`, `components/**`).
**Reviews:** every screen matches its approved wireframe; status labels use exact spec text; empty states exist with correct copy; interactive targets meet the accessibility minimum; no forbidden user-facing language or raw enum values; no out-of-scope features present; every input has a label and every icon-only control an accessible name.

---

### Specialist 2 — Architecture

**Domain:** Code structure, layer boundaries, patterns.
**Reads:** your backend + frontend architecture docs; `governance/03-project-map.md` (folder structure, import rules); `governance/06-file-organization.md`.
**Called when:** a task produces code files (handlers, domain, UI).
**Reviews:** handlers contain no business logic (parse → delegate → respond only); services contain no direct data-access calls; data-access contains no business logic; domain functions are pure (no data-access, no vendor imports); no direct ORM/vendor import outside its wrapper layer; folder structure matches the project map; no circular imports.

---

### Specialist 3 — Security

**Domain:** Auth, isolation, and containment of restricted data (per your `governance/13-domain-hard-lines.md`).
**Reads:** `governance/16-security-and-approval.md` (hard lines, serializer rules, defence in depth); the security/authorization spec; the canonical schema doc (ownership fields).
**Called when:** a task produces files that touch auth, data-access, or migrations.
**Reviews:** every data-access query is scoped to the caller's tenant/owner key — no exceptions; identity is taken from the verified token, never from request params/body; restricted fields never appear in responses meant for a lower-privilege audience; a single shared serializer is the one place restricted fields are stripped; every new table ships its authorization policy in the same migration; auth edge cases handled (expired token → 401, missing header → 401, wrong role → 403).

---

### Specialist 4 — Testing

**Domain:** Test coverage, test quality, test integrity.
**Reads:** `governance/07-testing-standards.md`; the test-strategy spec (critical journeys, acceptance criteria, coverage requirements).
**Called when:** a task produces test files.
**Reviews:** every endpoint has at minimum a happy path, an unauthenticated (401) test, a wrong-role (403) test, and a wrong-tenant test; denial assertions use exact status codes (not "not 200"); no skip/only modifiers committed; tests are hermetic (no hardcoded IDs, no shared state); every domain function has unit tests for all its edge cases; test file names follow the naming convention.

---

### Specialist 5 — Domain Logic

**Domain:** Business-rule correctness (your canonical calculations, state machines, and invariants).
**Reads:** the canonical-calculations spec (formulae, state machines, rules); `governance/14-single-source-of-truth.md`; any numeric-safety rules.
**Called when:** a task produces domain files, or any service/handler that calls a calculation.
**Reviews:** each formula exactly matches its canonical definition; no calculation logic exists outside its single home module (grep confirms); state machines match the spec; derived values are only updated from data in a valid state; numeric values use the mandated exact type (no floating-point where precision matters); no canonical calculation is performed in a handler, service, or UI component.

---

### Specialist 6 — API + Spec

**Domain:** API-contract conformance — endpoints, shapes, envelope, error codes.
**Reads:** the canonical API doc; the machine-readable API spec (ground truth for shapes); `governance/19-api-contract.md` (envelope format, versioning, generated types).
**Called when:** a task produces API-boundary files.
**Reviews:** every endpoint path matches the spec (no invented routes); every request field name matches exactly (no renamed/added fields); every response uses the correct envelope on success and on error; error codes come from the shared codes module (no inline strings); HTTP status codes are correct; no endpoint returns a raw object; validation schemas live in the validation layer, not inline in handlers.

---

### Specialist 7 — DB + Schema

**Domain:** Data-model correctness, migration safety, query patterns.
**Reads:** the canonical schema doc (authoritative model definitions, field names, types, relations, indexes); `governance/12-data-access-and-schema.md` (migration rules, naming, change process); any numeric-safety rules for field types.
**Called when:** a task produces schema or migration changes.
**Reviews:** every model field name matches the schema doc (no renamed/extra fields); all new models carry the mandated audit columns (id + timestamps); numeric fields that need precision use the exact type (not a float); no migration file has been edited after creation (migrations are immutable); every new table has its authorization policy; schema validation passes; no drift after the migration applies; no raw SQL in application code (only in migrations).

---

### Specialist 8 — Quality Control

**Domain:** Full compliance with the whole `governance/` set.
**Reads:** every document in `governance/`.
**Called when:** **every** task completion — always. This specialist is never optional.
**Reviews:** no unsafe/`any`-style escape hatches (type-safety doc); all files in correct folders (file-organization doc); all names follow the naming convention; all errors use the shared error type + codes (no raw string throws); no existing shared component duplicated without searching first (component-reuse doc); all external calls go through wrappers, never direct SDK imports (integrations doc); non-blocking side effects (e.g. email) never block a response; the dev workflow was followed (spec read before coding, no skipped phases).

---

## Consultation Trigger Matrix

This table tells the Review Agent which specialists to call based on what the Task Agent produced. Call all applicable specialists — not just one. ⟨FILL — replace the globs with your project's folder layout, and drop rows for specialists you removed.⟩

| Files produced by Task Agent | Specialists to consult |
|---|---|
| UI files (`app/**/*.tsx`, `components/**`) | Design, Architecture, Quality Control |
| API-boundary files (`app/api/**`) | API+Spec, Security, Architecture, Quality Control |
| Data-access files (`lib/repositories/**`) | Security, DB+Schema, Architecture, Quality Control |
| Service files (`lib/services/**`) | Architecture, Domain Logic, Quality Control |
| Domain files (`lib/domain/**`) | Domain Logic, Quality Control |
| Validation files (`lib/validation/**`) | API+Spec, Quality Control |
| Schema / migration files | DB+Schema, Security, Quality Control |
| Test files (`tests/**`) | Testing, Quality Control |
| Any files (always) | Quality Control |

---

## Specialist Output Format

Every specialist produces a findings report in this format. The Review Agent collects all reports and synthesises the final pass/fail.

```
## [Specialist Name] — Findings Report
Task: [Task ID]
Outcome: PASS | FAIL

### Findings
| # | Severity | File | Line | Rule violated | Description | Recommendation |
|---|---|---|---|---|---|---|
| 1 | P0 | [file] | [line] | [governance doc §] | [what's wrong] | [how to fix it] |

### Summary
[One sentence: pass with no findings / fail with N findings (X P0, Y P1, Z P2)]
```

**Severity:**
- **P0** — blocks task approval; must be fixed before `Review: Passed` can be set
- **P1** — must be fixed before gate sign-off
- **P2** — log to a post-phase backlog; does not block

---

## Mid-Task Consultation Protocol

When a Task Agent needs specialist input during execution (not after):

1. Agent stops at the decision point.
2. Writes a consultation request in the Handoff Log: `CONSULTATION REQUEST — [Specialist]: [exact question]`.
3. Spawns a specialist session, giving it the relevant context (the question, the relevant spec section, the current code).
4. Specialist provides a ruling: `RULING: [decision] — [reason] — [reference to spec]`.
5. Task Agent logs the ruling in the Handoff Log: `CONSULTATION RESULT — [Specialist]: [ruling]`.
6. Task Agent proceeds based on the ruling.

Mid-task consultation does not count as a review pass. The Review Agent still runs after the task is complete.

---

## Full Agent Roster Summary

⟨FILL⟩ Counts are per phase/sprint — adjust to your cadence.

| # | Agent | Type | Count per phase (avg) |
|---|---|---|---|
| 1 | Task Agent | Execution | 1 per task |
| 2 | Review Agent | Execution | 1 per task |
| 3 | Gate Agent | Execution | 1 per phase |
| 4 | Orchestrator Agent | Execution (optional) | 1 per phase |
| 5 | Design | Specialist | Called per task with UI output |
| 6 | Architecture | Specialist | Called per task with code output |
| 7 | Security | Specialist | Called per task with API/data-access output |
| 8 | Testing | Specialist | Called per task with test output |
| 9 | Domain Logic | Specialist | Called per task with domain/service output |
| 10 | API + Spec | Specialist | Called per task with API-boundary output |
| 11 | DB + Schema | Specialist | Called per task with schema/migration output |
| 12 | Quality Control | Specialist | Called on **every** task — no exceptions |
| 13 | Product Owner | Human | At wireframe approval + gate sign-off |

---

## Bottom line

Roles give the work an owner; protocols keep it from stalling, drifting, or hallucinating; specialists catch what a single pass misses. Adopt the set that matches how your team actually works, wire every reading list to this kit's real paths, and delete anything that doesn't prevent a failure you actually have.
