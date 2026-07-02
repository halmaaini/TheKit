# 05 — Type Safety

> **Template** · Lifecycle: living · Owner: Lead · Load: Always
> Fill: replace `{{VALIDATION_LIB}}`/`{{ORM}}`/`{{LANGUAGE}}` with your stack; keep the boundary-validation rules. The TypeScript + Zod code below is a labeled "e.g." — swap it for your language's equivalent. **No static types in your stack (plain JS, etc.)? Don't delete this doc** — keep the boundary-validation half as your runtime-safety rules; dynamic languages need that gate most. Delete only if you have neither a type system nor an input boundary to protect.
> Related: `12-data-access-and-schema.md`, `15-error-handling.md`, `19-api-contract.md`

## Purpose

Type safety is the cheapest bug prevention we have. The moment untyped escape hatches and unchecked casts creep in, the type system stops protecting you. Start strict, stay strict.

---

## Core Principles

1. Types reflect reality, not wishful thinking.
2. Validate at every boundary; trust types only inside the boundary.
3. Narrow unknown/dynamic values with guards — never cast them away.

---

## Golden Rules

✅ **Do**
- Define one validation schema (e.g. `{{VALIDATION_LIB}}`) per I/O boundary and derive the static type from it — one source, not two.
- Use your ORM's generated types for DB rows (e.g. `{{ORM}}`); map to domain types at the edge.
- Use tagged/discriminated unions with exhaustive matching (assert the impossible case in the default branch).

❌ **Don't**
- Use the language's "any" escape hatch, a double cast (`as unknown as X`), a suppress-the-error directive (without a linked issue), or a non-null assertion to force a value.
- Paper over a type error with a cast to make the build pass.
- Hand-write a type for something that already has a generated/inferred type (API client, ORM).

---

## Validate at the Boundary

Every value entering the system gets a schema in your validation layer (e.g. `{{lib/validation/}}`):

- API request bodies (route handlers)
- DB results that leave the data-access layer as domain types
- Webhook and third-party payloads
- Anything from query params, env, or form input

**Required pattern (language-agnostic):** parse untrusted input against a schema at the boundary; downstream code receives an already-typed, already-validated value.

```ts
// e.g. TypeScript + Zod — lib/validation/entity.schema.ts
import { z } from 'zod'

export const createEntitySchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  status: z.enum(['ACTIVE', 'PAUSED', 'INACTIVE']).default('ACTIVE'),
  cadenceDays: z.number().int().positive().default(7),
  accessEnabled: z.boolean().default(false),
})

export type CreateEntityInput = z.infer<typeof createEntitySchema>
```

```ts
// e.g. in the route handler — parse, don't trust
const input = createEntitySchema.parse(await req.json())
```

The schema's enum/literal values must match your data model exactly (see `12-data-access-and-schema.md`).

---

## Narrowing

```ts
// ❌ wrong — cast past the unknown
const id = (data as any).entityId

// ✅ right — validate, then it's typed
const { entityId } = idSchema.parse(data)
```

```ts
// e.g. exhaustive handling of a union — compiler enforces all cases
function label(status: Status): string {
  switch (status) {
    case 'ACTIVE':   return 'Active'
    case 'PAUSED':   return 'Paused'
    case 'INACTIVE': return 'Inactive'
    default: { const _exhaustive: never = status; return _exhaustive }
  }
}
```

---

## Forbidden Patterns

⟨Adapt the left column to your language's specific escape hatches.⟩

| Pattern (e.g.) | Why | Instead |
|---|---|---|
| "any" escape hatch | Disables checking | Use an unknown/dynamic type + a guard/schema |
| Double cast (`as unknown as X`) | Lies to the compiler | Validate with `{{VALIDATION_LIB}}` |
| `value \|\| ''` to silence undefined | Hides real nullability | Model the optional honestly |
| Force-unwrap / non-null `!` | Crashes at runtime | Narrow or validate first |
| Hand-written API response types | Drifts from the contract | Use the generated client (`19-api-contract.md`) |

---

## Enforcement

- Compiler config at its strictest setting (e.g. TS `strict: true`, `noUncheckedIndexedAccess: true`).
- Linter blocks the escape hatches above.
- Spot-check before committing (adapt patterns to your language):
  ```bash
  # e.g. TypeScript
  grep -rn ": any\|as any\|@ts-ignore\|as unknown as" {{src dirs}}
  ```
- PR checklist: no new escape hatches, all boundaries validated, unions exhaustive.

---

## Bottom Line

Parse at the edge with your validation lib, derive types from schemas and your ORM, narrow unknown values — never cast them away. No escape hatches, ever.
