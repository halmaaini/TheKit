# {{TASK-ID}} — {{Task name}}

> **Template** · Lifecycle: living (one copy per task) · Owner: Lead seeds it; the Task Agent completes it · Load: Reference (read when executing this task)
> Fill: copy this file to `delivery/tasks/{{phase}}/{{task-id}}-{{short-name}}.md` when you seed the ledger — one per task row. Replace every `{{PLACEHOLDER}}`; delete guidance lines.
> Related: `../02-task-ledger.md` (the row that points here), `../06-agent-build-architecture.md` (the Handoff Log Minimum Standard), `../gates/TEMPLATE-gate-spec.md`

**Goal:** {{One sentence: the outcome this task delivers — verifiable, not activity. "Add X so that Y" beats "work on X."}}

**Context (read before writing a line):**
- The always-loaded governance set (`governance/README.md`) — assumed, don't relist it.
- {{The specific spec sections this task implements — e.g. `product/workflows.md` flow 2, `product/data-model.md` §Ballot.}}
- {{The hard lines this task touches — cite them: `governance/13` HL-n (D-…). If none, say "none".}}

**Exit criteria** — each one checkable by a reviewer, not a vibe:

- [ ] {{Concrete, testable outcome 1 — name the artifact: "`src/store/ballots.js` exposes only `upsertBallot()` (HARD-LINE D-…)"}}
- [ ] {{Outcome 2}}
- [ ] {{Tests: name the specific tests that must exist and pass — invariant tests for any hard line touched (see `governance/07`)}}
- [ ] {{The project's fast checks green — e.g. `node --test` / `{{TEST_CMD}}` — and the hard-line engine clean}}

**Out of scope:** {{What an eager agent might do but must not — the scope fence. Delete if truly nothing.}}

---

## Handoff Log

> Filled by the Task Agent **before** setting the ledger row to `Done`. Every section per the Minimum Standard in `delivery/06` — a missing or vague section is a review failure. Append; never rewrite an earlier entry.

**Summary:** {{2–4 sentences: what was built and the shape it took.}}

**Files created / modified:** {{Complete list — no omissions.}}

**Exit criteria:** {{Each criterion above, restated with HOW it was verified — the test name, the command output, the grep.}}

**Protocol entries:** {{Unplanned decisions, blockers hit, spec issues found (per 06's protocols) — or "none".}}

**Documentation updates:** {{Docs touched beyond this spec — or "none".}}

**Foundational decisions:** {{Anything future tasks build on — or "none new (all traced to D-…)."}}

---

## Review

> Filled by the **Review Agent** (separate session — it audits, it does not fix; findings go back to a Task Agent).

**Verdict:** {{Review: Passed | Review: Failed}} — {{date}}
**Findings:** {{Each finding: what, where, why it matters, what's required. On pass: what was audited and how.}}
