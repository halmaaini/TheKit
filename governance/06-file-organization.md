# 06 — File Organization & Anti-Bloat

> **Template** · Lifecycle: living · Owner: Lead · Load: Always
> Fill: swap the grep examples for your real domain terms, folders, and file extensions; tune the size thresholds. Keep the search-first discipline and the promotion path.
> Related: `03-project-map.md`, `11-component-reuse.md`, `14-single-source-of-truth.md`

## Purpose

The number-one AI failure mode is creating new code when reusable code already exists. This document is the direct counter.

---

## Search Before You Create

Before writing any new file, function, or component, run a real search. Document what you searched. ⟨FILL: replace the terms, folders, and extensions with yours.⟩

```bash
# Is there already a calculation/util for this?
grep -rn "{{domainTermA}}\|{{domainTermB}}" {{lib dir}}/

# Is there already a component for this?
ls {{component dirs}}
grep -rn "Card\|Badge\|Table\|Modal" {{component dir}}/

# Is there already an endpoint for this?
grep -rn "{{resourceA}}\|{{resourceB}}" {{api dir}}/
```

If something close exists: **extend it**, don't duplicate it. See `11-component-reuse.md`.

---

## Pre-Flight Checklist (every new piece of code)

1. Does similar functionality already exist? (You must have searched.)
2. Can existing code be extended with a parameter/variant instead of copied?
3. Is this in the right place per `03-project-map.md`? (e.g. domain layer for calculations, shared-UI dir for reusable components.)

---

## File Size

⟨FILL: tune to your language/team; the two-tier "consider / must" shape holds.⟩

| Threshold (e.g.) | Action |
|---|---|
| ~250 lines | Consider splitting |
| 400 lines | Must split, unless it's one cohesive concept |

**Split when** a file has multiple responsibilities, multiple unrelated exports, or mixed abstraction levels.
**Don't split** a single cohesive concept just to hit a number — fragmentation is also bloat.

---

## One Responsibility Per File

- One component per file (plus its tightly-coupled subcomponents).
- One service / one calculation concept per file.
- One schema group per resource file.

---

## Where Utilities Go (promotion path)

1. Used once, locally → inline in the file.
2. Used by a few files in one feature → a `*-utils.*` next to them.
3. Used across features → the shared lib (and if it's a canonical domain value, the domain layer — see `14-single-source-of-truth.md`).

Don't start at step 3 speculatively.

---

## Dead Code

- Remove on sight when it's clearly orphaned by your change.
- **Never comment code out** — delete it. Git remembers.
- Do not delete *pre-existing* unrelated dead code unless asked (`01-agent-rules.md` rule 3).

---

## Forbidden Patterns

| Pattern (e.g.) | Instead |
|---|---|
| `WidgetNew.tsx`, `entity-service-v2.ts` | Extend the original |
| Copy-paste a function with a tweak | Extract a parameterized version |
| New calculation that re-derives a canonical value | Call the source of truth (`14-single-source-of-truth.md`) |
| New file when an existing one fits | Add to the existing file |

---

## Bottom Line

Search first. Extend before you create. Keep files focused. Delete dead code, never comment it out.
