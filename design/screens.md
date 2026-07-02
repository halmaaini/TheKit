# {{PROJECT_NAME}} — Screen Specs

> **Template** · Lifecycle: living · Owner: Design/Product · Load: Reference
> Fill: replace every `{{PLACEHOLDER}}` and `⟨FILL: …⟩` block. Add one spec block per screen as it's designed; keep the index in sync.
> Delete this file if: the product has no UI.
> Related: `design/design-system.md`, `design/design-process.md`, `product/workflows.md`, `product/data-model.md`, `governance/10-frontend-architecture.md`, `governance/19-api-contract.md`

> **One spec per screen — the bridge from wireframe to build.** A screen spec says *what's on the screen and how it behaves*, using tokens/primitives from `design/design-system.md` and data from `product/data-model.md`. It does **not** re-decide data logic or API shapes (those are the specs' job). A coding agent builds a screen from its spec + its approved wireframe, not from imagination.

## Screen index

⟨FILL: one row per screen. Keep `Status` honest; it mirrors the design task in `delivery/02-task-ledger.md`.⟩

| Screen | Surface / role | Phase | Status | Wireframe artifact |
|---|---|---|---|---|
| {{SCREEN_A}} | {{SURFACE/ROLE}} | {{PHASE}} | Not started / Designed / Approved | `⟨artifact path⟩` |
| {{SCREEN_B}} | {{SURFACE/ROLE}} | {{PHASE}} | ⟨FILL⟩ | `⟨artifact path⟩` |

---

## Screen spec template

⟨Copy this block per screen. Delete guidance once filled.⟩

### {{SCREEN_NAME}}

- **Purpose:** ⟨FILL: the one job this screen does for its user.⟩
- **Surface / role:** ⟨FILL: e.g. desktop web · role `{{ROLE}}` — who can see it (`governance/16-security-and-approval.md`).⟩
- **Entry / exit:** ⟨FILL: how the user arrives, where each action leads (name the workflow in `product/workflows.md`).⟩
- **Layout regions:** ⟨FILL: the main areas top-to-bottom (e.g. header · filter bar · list · detail panel).⟩
- **Components used:** ⟨FILL: from `design/design-system.md` by name — `DataTable`, `Button(variant=primary)`, `{{PRIMITIVE}}`. Reuse before inventing (`governance/11`).⟩
- **Data shown:** ⟨FILL: which entities/fields, from `product/data-model.md`; served by ⟨endpoint from `governance/19-api-contract.md`⟩. The screen **displays** canonical values, never recomputes them (`governance/14`).⟩
- **States:** loading · **empty** (⟨FILL: empty-state copy⟩) · error (⟨FILL⟩) · success. Every data view defines all four (`governance/10`).
- **Copy:** ⟨FILL: real labels, button text, status wording — matches the labels fixed in `design/design-system.md` / `product/data-model.md`.⟩
- **Edge cases / permissions:** ⟨FILL: what a user without access sees; long lists; RTL/i18n if applicable.⟩
- **Wireframe:** `⟨approved artifact path⟩` — the layout authority once approved (`design/design-process.md`).

---

## Bottom line

⟨FILL⟩ Each screen has one spec tying **layout + components + data + states + copy** to the design system and the data model — so an agent builds the right screen once, and every screen handles loading/empty/error/success.
