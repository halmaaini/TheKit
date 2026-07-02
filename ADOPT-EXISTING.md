# ADOPT-EXISTING — Bringing the Kit into a Codebase That Already Exists

> **Keystone doc** · Lifecycle: living · Owner: Lead · Load: only when adopting into an existing repo
> Greenfield (empty repo)? This is not your doc — follow `START-HERE.md`. Same kit, opposite flow:
> greenfield goes *decisions → code*; adoption is **archaeology** — *code → decisions*.
> Related: `START-HERE.md`, `MANIFEST.md`, `intake/README.md`, `enforcement/README.md`

## The one rule that keeps adoption honest

> **The record starts true.** Every reverse-engineered decision describes what the code *does today*, marked **(as-built)**. What you *wish* were different goes to `product/roadmap.md` or a change request — never into `decisions.md` as if it were reality. A source of truth that starts as fiction never recovers.

## Pick your depth

Each depth is a strict subset of the next — starting shallow never wastes work. Deepen whenever the missing layer starts to hurt.

| Depth | You get | You do |
|---|---|---|
| **1 — Harness only** | Guardrails on all *new* work: hard lines, ledger + gates for future tasks, append-only logs, hooks, CI | Phases **A-lite → C → E → F** (skip the product/design docs; governance = `13` + `03`'s stack table only) |
| **2 — Governance + harness** | Depth 1 + the coding constitution — for teams whose specs live elsewhere | Depth 1 + the full **governance pass** in phase B/C |
| **3 — Full kit** | The whole operating system: decisions, product/design docs, constitution, plan, guardrails | All six phases |

## Setup — getting the kit in

0. **Triage your existing hooks FIRST.** Run `git config core.hooksPath` and read whatever pre-commit hook you have (husky/lefthook/hand-rolled). Two reasons this is step 0: (a) your hooks run on every adoption commit — an over-broad check (a repo-wide pattern ban, say) will reject kit content; scope it to your own source dirs now, or bypass once with `--no-verify` and note it (the kit's own no-bypass rule starts *after* adoption); (b) if `core.hooksPath` is set, `.git/hooks/` is never consulted — the installer handles this (phase E), but you should know where your hooks actually live before anything else.
1. **Copy the kit into a subfolder** — this doc uses **`kit/`** throughout (any path works; it's just `{{KIT_PATH}}`):
   ```bash
   git clone --depth 1 https://github.com/halmaaini/TheKit kit && rm -rf kit/.git
   git add kit && git commit -m "Adopt TheKit (kit/)"
   ```
   Keep the attribution: `kit/LICENSE` requires credit — the "Based on TheKit" line in your README does it.
2. **Delete `kit/example/`** (teaching aid) and `kit/README.md` (TheKit's homepage — your repo has its own). Mark both rows in `kit/MANIFEST.md` — same commit.
3. **Merge, never overwrite, the agent entry file.** Your repo may already have a `CLAUDE.md`/`AGENTS.md`. Append the kit's `AGENTS.md` content (with `{{KIT_PATH}}` = `kit`) to yours — the "read the kit first" instructions must not erase rules you already rely on.
4. **Set `{{KIT_PATH}}` = `kit` everywhere it appears** as you fill docs, including the `KIT_PATH` env in `enforcement/ci/guardrails.yml`.

## The protocol — six phases

### A — Inventory (read-only; touch nothing yet)

Walk the repo and write down, without judging: the stack (deps, runtime, build), entry points, folder shape, what CI already runs, what the tests already assert, and every doc that exists (README, ADRs, wikis, design notes). Output: the raw material for `governance/03-project-map.md` — and a pile for intake.

### B — Existing docs through intake; decisions reverse-engineered (as-built)

- **Put every existing doc through `kit/intake/`** per the standard protocol (`kit/intake/README.md`) — ADRs and old design docs are decision gold. **Copy live docs** (your README, wiki exports — things the repo still serves) so the *copy* gets processed and archived while the original stays in place until a ruling corrects or replaces it; **move dead notes**. Where a doc contradicts the code, **the code wins the as-built record**; log the conflict in `logs/contradiction-log.md` and let the owner rule on which should change.
- **Reverse-engineer `decisions.md`:** every load-bearing choice already in the code becomes a decision row with **(as-built, adopted YYYY-MM-DD)** in its rationale. Propose in batches; **the owner confirms each batch** (or parks items as `OPEN` H-rows). Owner unavailable? Mark the batch **(as-built, unconfirmed)** and keep going — the adoption gate requires the confirmation before it signs. Wishes → roadmap, not decisions.
- Depth 2–3: run the governance pass with the standard triage (fill `03`/`04`/`13` first; adopt `01`/`02` as-is; the rest tightens when it bites). Where the codebase is *internally inconsistent* (two naming styles, two error shapes), the decision picks the winner and the losers become debt (phase D).

### C — Hard lines from actual invariants

What does this product already promise? What do the tests already assert? What did past incidents teach? Lock 2–5 lines in `governance/13` and wire them via `/hardline` — with `files` scopes tuned to the real layout. Before the harness is installed, run the engine from the kit source: `node kit/enforcement/scripts/check-hard-lines.mjs …`.

A line can be **provisional** (evidence says it's a guarantee; the owner hasn't ruled — e.g. "no running counters"). Keep the heading's `(D-n)` bare — coverage binds on it — and state the provisionality in the body, tied to its `OPEN` H-row. Its debt task blocks on the ruling.

### D — Gap analysis → the debt ledger (the ratchet)

Run the hard-line engine over the whole tree as a **report, not a blocker**:

```bash
node kit/enforcement/scripts/check-hard-lines.mjs --all --manifest kit/enforcement/hard-lines.json
```

Every hit is **existing debt**: cluster the hits and file one ledger task per cluster (use `kit/delivery/tasks/TEMPLATE-task-spec.md`). Do the same for governance gaps found in B (naming migrations, error-shape unification). **Nothing gets "fixed silently" during adoption** — adoption changes the *record and the guardrails*, not the code.

> **The ratchet.** The enforcement engine is diff-based: pre-commit (`--staged`) and CI (`--range`) check **added lines only** — so your existing code is grandfathered by construction, and install day is not red day. New code is clean immediately; old code burns down deliberately, task by task. `--all` is for gates and debt reports, and a phase gate that includes debt tasks uses it scoped to their exit criteria.

### E — Install the harness

```bash
bash kit/enforcement/install.sh        # refuses to overwrite; --force to override
```

The installer resolves `git config core.hooksPath` and installs the hook **where git actually looks** — a hook written to `.git/hooks/` while `core.hooksPath` points elsewhere would be silently inert, which is the worst failure mode a guardrail can have. **Verify with a throwaway commit** that the kit checks visibly run; never trust an installer's word for an enforcement layer.

Existing-repo merge cases the installer deliberately leaves to you:
- **`.claude/settings.json` exists** → merge the kit's hooks block by hand (the installer says exactly what from where).
- **A pre-commit hook already exists** (husky, lefthook, hand-rolled) → the installer skips and prints the chain line: call the kit's hook from yours — do not replace silently.
- **CI exists** → `guardrails.yml` lands *beside* your workflow; fill its `KIT_PATH` env (`kit`), delete steps your stack doesn't have, and make **guardrails** a required check. Fold its steps into your existing workflow later if you prefer one file.

### F — Seed delivery from reality — adoption is Phase 1

Seed `kit/delivery/02-task-ledger.md` with **Phase 1 = "Adoption"**: the phases above as task rows (inventory, decisions confirmed, hard lines wired, debt filed, harness live), plus the debt tasks from D as their own phase or track. Gate it with the checklist below. Future work proceeds through the normal loop (`/task` → review → `/gate`) from day one.

## The adoption gate (what "adopted" means)

- [ ] `decisions.md` filled **(as-built)** and **confirmed by the owner**; wishes parked in roadmap/`OPEN`, not recorded as fact
- [ ] Existing docs processed through intake (extracted → routed → archived); contradictions logged with rulings
- [ ] 2–5 hard lines locked in `13`, wired in `hard-lines.json`, `--self-test` and `--coverage` green
- [ ] Debt report run (`--all`); every cluster filed as a ledger task — zero silent fixes
- [ ] Harness installed and firing (make a throwaway commit; watch pre-commit run) — merge cases resolved, `guardrails` a required check
- [ ] Ledger valid (`validate-ledger`); Phase 1 rows `Review: Passed`; this checklist signed in `logs/decisions-log.md`
- [ ] *(Depth 3)* `product/` docs written from reality; stale external docs archived with `archive-log` rows

## Bottom line

Copy the kit into `kit/`, make the record true (**as-built**, owner-confirmed), lock the guarantees the product already makes, file the debt instead of hiding it, and let the ratchet do the rest: **every new line held to the rules from today; every old line on the books to burn down.**
