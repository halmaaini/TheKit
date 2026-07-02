---
description: Lock a new domain hard line — write it in governance/13 AND wire its mechanical check, in one loop.
---

<!-- TEMPLATE — installs to `.claude/commands/hardline.md` in the target repo. Fill every {{PLACEHOLDER}}.
     {{KIT_PATH}} = path to this kit's docs (or "" if they live at repo root).
     This command makes the rule in governance/13 — "wire the check when you write the line" — a driven
     loop instead of a doc note. Invoke: `/hardline <short name of the guarantee>`. -->

# /hardline — lock a hard line and wire its check

You are adding a **domain hard line** — a non-negotiable guarantee the product rests on (see `{{KIT_PATH}}/governance/13-domain-hard-lines.md`). A hard line is not real until **both halves** exist: the prose (the line, why, golden rules) *and* the wired check. Do not stop halfway; `--coverage` will fail the next commit if you do.

## 1 — Ground it in a decision

Hard lines derive from decisions. Find the decision in `{{KIT_PATH}}/decisions.md` that justifies `$ARGUMENTS`. If none exists, **STOP and propose one to the human first** — never lock a hard line on an undecided foundation. Once decided, record it in `{{KIT_PATH}}/logs/decisions-log.md` (append-only).

## 2 — Write the line in governance/13

Append a `### <n> — <Name>   (D-<id>)` section using the template in that doc (the line · why · golden rules · enforcement). Keep the set small (2–5): if this is line 6+, first challenge whether an existing line already covers it. The write-guard will ask for confirmation — expected; `13` is a governance doc.

## 3 — Wire the check in `{{KIT_PATH}}/enforcement/hard-lines.json`

Add **one entry** with `"id": "HL-<n>"` (the same `<n>` as the heading) and the decision id:

- **Greppable line** → `patterns`: `regex` + `files` scope + `message`, **plus `shouldMatch` / `shouldNotMatch` fixtures — required.** Self-test rejects a pattern you can't prove fires. Scope `files` tightly (source paths where the rule applies, not docs).
- **Not greppable** (DB constraint, trigger, RLS…) → `"mechanical": false` + `enforcedBy` (where the real enforcement lives) + `testFile` (the test that fails on violation — it must exist; write it if it doesn't).

If the manifest still carries `"template": true`, replace the illustrative entries with your real ones and **remove the flag now** — until you do, the scan modes warn instead of binding.

## 4 — Prove it

```bash
node scripts/check-hard-lines.mjs --self-test --manifest {{KIT_PATH}}/enforcement/hard-lines.json
node scripts/check-hard-lines.mjs --coverage --doc {{KIT_PATH}}/governance/13-domain-hard-lines.md --manifest {{KIT_PATH}}/enforcement/hard-lines.json
```

Both must pass. A self-test failure means your regex doesn't fire — **fix the pattern, not the fixture.** A coverage failure means the two halves disagree.

## 5 — Record it

- Add a row to the rule→mechanism map in `{{KIT_PATH}}/enforcement/README.md`.
- Append the ruling to `{{KIT_PATH}}/logs/decisions-log.md`: the line, its decision, the check wired.
- If enforcement belongs at a **stronger layer** (schema constraint, trigger, RLS policy, test), file the implementation task in `{{KIT_PATH}}/delivery/02-task-ledger.md` — the grep is the backstop, **not** the enforcement.

## 6 — Report

Print: the line's name + id, its decision, check type (patterns or mechanical), fixture count, self-test + coverage results, and any deeper-layer tasks filed.
