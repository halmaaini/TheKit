# 08 — Code Comments & In-Code Traceability

> **Template** · Lifecycle: living · Owner: Lead · Load: Always
> Fill: set your project's marker syntax — the `{{FEATURE}}`/`{{SPEC}}`/hard-line marker names — and keep the traceability convention (header + JSDoc + why-comment + hard-line marker + cite-the-decision).
> Related: `04-naming-conventions.md`, `06-file-organization.md`, `13-domain-hard-lines.md`, `14-single-source-of-truth.md`, `16-security-and-approval.md`

## Purpose

Anyone opening a file should know in seconds **which feature it serves, which spec/decision defines it, and why any non-obvious code is the way it is** — without spelunking.

This kit deliberately runs a *heavier* comment standard than the generic "minimal comments" default: a small amount of durable, high-value commenting over none. The goal is traceability that **does not rot** — comment the *why* and the *links*, not the *what* (names already say the what).

---

## Required comments

**1. File header — every non-trivial source file.** One short block at the top naming the **feature** and the **spec/decision** it implements:

```
/**
 * Feature: {{FEATURE_NAME}}   (see ⟨your product spec, e.g. product/prd.md⟩)
 * Spec:    ⟨your spec doc⟩ §{{SECTION}}  ·  Decision: (D-{{id}})
 * Role:    {{one line — what this file owns, e.g. "the ONLY implementation of X" (14)}}
 */
```

Name the **feature** (matches an entry in your product spec) and the **spec section / decision** it implements. Trivial files (pure re-exports, generated code, simple presentational units) may skip it.

**2. JSDoc on every exported domain/service function.** State what it returns, the rule it owns, and the spec/decision pointer:

```
/**
 * {{what it returns, in one line}}.
 * {{the rule it encodes — edge cases / invariants}}.
 * Canonical — never re-derived elsewhere (14). Spec: ⟨your spec doc⟩ §{{SECTION}}.
 */
export function calculate{{VALUE}}(/* … */) { /* … */ }
```

**3. Why-comments for non-obvious logic.** Hidden constraints, invariants, workarounds, or surprising behaviour get a one-line `// why:`. If a future reader would ask "why is this here?", answer it in place.

**4. Hard-line / security markers.** Any field, serializer branch, or query that exists to protect one of your **domain hard lines** (`13`) or a role/authorization boundary (`16`) gets a one-line marker tying it back to the rule and the decision:

```
// {{HARD_LINE_MARKER}}: {{why this guards the line}} (13, D-{{id}})
{{guardedField}}: value,
```

⟨FILL: pick your marker vocabulary once and use it everywhere — e.g. one keyword per hard line so a grep finds every enforcement site. Keep the `(rule-doc, D-id)` citation.⟩

---

## Cite the decision

Every comment that encodes a *rule* names the rule doc and the decision behind it (e.g. `(13, D-…)`). This keeps the spine intact: **decision ↔ rule ↔ code** stays linked, so when a decision changes you can grep to every site that depends on it.

---

## Keep comments true (the anti-rot rule)

- **Change the behaviour → change the header/JSDoc in the same edit.** A stale comment is treated as a bug.
- Link by things that **don't move**: a **feature name** + **spec section** + **decision id**, never line numbers or "called from `X`".

---

## Discouraged (these rot — use structure instead)

| Don't | Do instead |
|---|---|
| Inline "used by X / called from Y / affects Z" cross-references | Let the architecture, the `14-single-source-of-truth.md` index, and tests track who-calls-what |
| Restate what the code/name already says (`// increment i`) | Delete it; name things well (`04-naming-conventions.md`) |
| Comment code out | Delete it — version control remembers (`06-file-organization.md`) |
| Decorative banners, orphan `TODO`s | A linked `TODO(owner/issue)` or nothing |

---

## Bottom Line

Every non-trivial file says which **feature** and **spec/decision** it serves; every shared calculation says what **rule** it owns and where that rule is defined; non-obvious code says **why**; every hard-line guard carries its marker and its `(rule, D-id)` citation. Link by feature + spec + decision, keep it current, and let the architecture — not comments — track who-calls-what.
