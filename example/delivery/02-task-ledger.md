# Task Ledger

> **EXAMPLE — filled instance, not a template.** A worked example of the Project Kit for a fictional URL shortener ("Snip"). Imitate the shape; don't edit these to build a real project. The blank templates live one level up.

## Purpose

This file is the **single source of truth for task status and dependencies** across the Snip build.

- **Any agent:** read this at the start of every task to confirm prerequisites are met, and update your row when your task's state changes.
- **Gate agents:** update the phase row in Phase Overview when a gate is signed.
- **No other file** decides overall project state. `03-task-matrix.md` is a derived summary; if the two disagree, this ledger wins.

> **This ledger is frozen mid-flight** to show a realistic in-progress build: Phase 0 is done, Phase 1 is partly done (one task in progress, one waiting), and a Phase 2 task is Blocked on the in-progress Phase 1 task.

---

## Status Values

| Value | Meaning |
|---|---|
| `Not Started` | Prerequisites not yet met, or the phase is not yet open |
| `In Progress` | An agent has started; work is not complete |
| `Blocked` | Cannot proceed — reason recorded in the task's handoff log |
| `Done` | Exit criteria checked; handoff log filled; awaiting review |
| `Gate: Passed` | Gate signed; the next phase is unblocked |

---

## Update Protocol (for agents)

1. **Before starting a task:** confirm every row in "Depends On" shows `Done` or `Gate: Passed`. If not, set your row to `Blocked` and record the reason.
2. **When starting:** set your row's Status to `In Progress`.
3. **When complete:** set Status to `Done`; fill the handoff log in your spec file.
4. **Gate agent:** when all task rows in a phase are `Done`/reviewed, run the gate, collect sign-offs, set the phase row to `Gate: Passed`, and unblock the next phase.

---

## Phase Overview

| Phase | Status | Gate File |
|---|---|---|
| Phase 0 — Setup | `Gate: Passed` | `delivery/gates/phase-0-gate.md` |
| Phase 1 — Links + isolation | `In Progress` | `delivery/gates/phase-1-gate.md` |
| Phase 2 — Redirect + clicks | `Not Started` | `delivery/gates/phase-2-gate.md` |
| Phase 3 — Analytics | `Not Started` | `delivery/gates/phase-3-gate.md` |

---

## Task Ledger

### Phase 0 — Setup

| Task ID | Task Name | Status | Depends On | Spec File |
|---|---|---|---|---|
| 0-1 | Toolchain + repo (Next.js, TS strict, Vercel, Vitest/Playwright) | `Done` | — | `delivery/tasks/p0/01-toolchain.md` |
| 0-2 | DB connection (Drizzle + Postgres, empty migration runs) | `Done` | 0-1 | `delivery/tasks/p0/02-db-connection.md` |

### Phase 1 — Links + isolation

| Task ID | Task Name | Status | Depends On | Spec File |
|---|---|---|---|---|
| 1-1 | Auth + JWT wiring (Supabase Auth; `users` row on sign up) | `Done` | Phase 0 → `Gate: Passed` | `delivery/tasks/p1/01-auth-jwt.md` |
| 1-2 | `links` schema + RLS policy (same migration) — tenant isolation (D-10) | `In Progress` | 1-1 | `delivery/tasks/p1/02-links-schema-rls.md` |
| 1-3 | Short-code generation + tombstone unique index; soft-delete (D-11) | `Not Started` | 1-2 | `delivery/tasks/p1/03-short-code-integrity.md` |

### Phase 2 — Redirect + clicks

| Task ID | Task Name | Status | Depends On | Spec File |
|---|---|---|---|---|
| 2-1 | `click_events` schema + append-only trigger (D-12) | `Blocked` | 1-2 | `delivery/tasks/p2/01-click-ledger.md` |

### Phase 3 — Analytics

| Task ID | Task Name | Status | Depends On | Spec File |
|---|---|---|---|---|
| 3-1 | Ledger-derived per-link click count (owner-scoped) (D-10, D-12) | `Not Started` | 2-1 | `delivery/tasks/p3/01-analytics-count.md` |

> **Why 2-1 is Blocked:** the `click_events` migration builds on the `links` table shape being finalized in **1-2** (FK `link_id → links`, and the RLS pattern reused for click scoping). 1-2 is still `In Progress`, so 2-1 cannot start — reason recorded in its handoff log.

---

## Parallel Task Visibility

| Phase | Parallel group |
|---|---|
| Phase 1 | 1-2 and a docs/spec pass could proceed together, but 1-3 must wait for 1-2 (short codes live on the `links` table). |

---

## Progress Summary

> Agent: update this section each time a phase gate passes.

| Metric | Value |
|---|---|
| Total tasks (excluding gates) | 7 |
| Total gates | 4 |
| Tasks Done | 3 (0-1, 0-2, 1-1) |
| Gates Passed | 1 (Phase 0) |
| Current phase | Phase 1 — Links + isolation |
| Release target | Phase 3 gate signed (v1 core: auth · link CRUD · redirect · clicks · analytics) |
