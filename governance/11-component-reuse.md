# 11 — Component Reuse

> **Template** · Lifecycle: living · Owner: Lead · Load: Always
> Fill: replace the shared-library inventory with your real primitives and keep it current; swap surface/folder names for yours. Keep the decision tree and the variants-over-new-components rule.
> Delete this file if: the project has no UI.
> Related: `06-file-organization.md`, `10-frontend-architecture.md`, `⟨your design-system source⟩`

## Purpose

The single biggest lever against UI bloat: **reuse or extend an existing component before creating a new one.** AI agents default to creating parallel components — this stops that.

---

## Decision Tree

⟨FILL: rename the folders to yours; keep the four-step order.⟩

```
Need a UI piece?
  1. Does a shared component in {{components/ui}} already solve it?      → use it
  2. Can a shared component be extended (new prop/variant) to solve it?  → extend it
  3. Is it genuinely new AND reusable across surfaces?                   → add to {{components/ui}}
  4. Is it specific to one surface and not reusable?                     → {{that surface's folder}}
```

Always search first (`06-file-organization.md`):
```bash
ls {{components/ui}} {{components/<surface>}}
grep -rn "Card\|Badge\|Chip\|Table\|Modal\|Field" {{components/}}
```

---

## Shared Library Inventory

The canonical primitives live in `{{components/ui}}`. **Consult this before building anything.** ⟨FILL: replace the rows below with your real components; the ones listed are common examples — keep those that apply, delete the rest, add your own. Map each to `⟨your design-system source⟩`.⟩

| Component | Purpose | Key props |
|---|---|---|
| `Button` | All actions | `tone` (primary/secondary/danger/ghost), `size`, `isLoading` |
| `Input`, `Textarea` | Text entry | `error`, `inputMode` |
| `Select` | Dropdowns | `options`, `value`, `onChange` |
| `Card` | Surface container | `padding`, `as` |
| `Modal` | All dialogs | `open`, `onClose`, `title` |
| `Toast` | Transient confirmations | `tone`, `message` |
| `DataTable` | Data grids w/ built-in states | `columns`, `rows`, `isLoading`, `empty` |
| `EmptyState` | Empty list/screen | `icon`, `title`, `action` |
| `ErrorState` | Inline/page error | `error` (see `15-error-handling.md`) |
| `FormField` | Label + control + error wrapper | `label`, `error`, `required` |
| `{{DOMAIN_COMPONENT}}` | ⟨FILL: your domain-specific reusable piece⟩ | ⟨FILL⟩ |

> Keep this table updated as the library grows. **An out-of-date inventory causes the exact duplication it's meant to prevent.**

---

## Patterns (one of each, app-wide)

- **Forms:** one `FormField` + your form lib + schema resolver. Every form uses it.
- **Modals:** one `Modal` primitive. Every dialog uses it.
- **Tables/lists:** one `DataTable` with built-in loading/empty/error/pagination. Every grid uses it.
- **Page layouts:** shared layouts for the recurring page types (list / detail / form / dashboard).

## Variants Over New Components

Need a different look? Add a **variant prop** to the existing component — don't fork it.

```
// ✅ extend
<Button tone="danger" size="sm" />

// ❌ never
// {{components/ui}}/DangerButtonSmall
```

---

## Forbidden Patterns

- `Button2`, `ButtonNew`, `CustomButton` beside the existing `Button`.
- Reimplementing a form layout, modal, or table from scratch.
- Copy-pasting a card with minor tweaks instead of adding a prop.
- Building one surface's component by copying another surface's (across the `{{SURFACE_A}}`/`{{SURFACE_B}}` line).

---

## Bottom Line

Check the inventory, reuse or extend with a variant, and only create something new when it's genuinely new. Update the inventory when you do.
