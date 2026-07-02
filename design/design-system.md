# {{PROJECT_NAME}} — Design System

> **Template** · Lifecycle: populate-once → living · Owner: Design/Architect · Load: Reference
> Fill: replace every `{{PLACEHOLDER}}` and `⟨FILL: …⟩` block. Lock the tokens once the first wireframes are approved (see `design/design-process.md`).
> Delete this file if: the product has no UI.
> Related: `design/screens.md`, `design/design-process.md`, `governance/10-frontend-architecture.md`, `governance/11-component-reuse.md`, `governance/14-single-source-of-truth.md`

> **This is the design source of truth.** Colors, type, spacing, primitives, states, and the accessibility bar are defined **here, once**. Screens (`design/screens.md`) and code reference these tokens — they never invent raw values. This is the visual-language equivalent of `product/data-model.md`.

## Design tokens

⟨FILL: the raw values every screen and component draws from. Give each a **name**, not just a value — code references the name, never the hex/px. Keep the set small; a big palette is a smell.⟩

**Color**

| Token | Value | Use |
|---|---|---|
| `color.bg` | `{{#HEX}}` | app background |
| `color.surface` | `{{#HEX}}` | cards, panels |
| `color.text` | `{{#HEX}}` | primary text |
| `color.muted` | `{{#HEX}}` | secondary text |
| `color.primary` | `{{#HEX}}` | primary action |
| `color.danger` / `warning` / `success` | `{{#HEX}}` | status |

**Typography** — `{{FONT_FAMILY}}`

| Token | Size / weight / line-height | Use |
|---|---|---|
| `type.display` | ⟨FILL⟩ | page titles |
| `type.body` | ⟨FILL⟩ | default text |
| `type.caption` | ⟨FILL⟩ | meta / labels |

**Spacing / radius / shadow / breakpoints**

- Spacing scale: ⟨FILL: e.g. `4 · 8 · 12 · 16 · 24 · 32`⟩ — everything aligns to it; no arbitrary margins.
- Radius: ⟨FILL⟩ · Shadow/elevation: ⟨FILL⟩
- Breakpoints: ⟨FILL: e.g. `mobile <640 · tablet 640–1024 · desktop >1024`⟩

---

## Component primitives

⟨FILL: the base inventory every screen composes from — the shared `components/ui/**` set (`governance/11-component-reuse.md`). One row per primitive; express differences as **variants/props**, never forked components.⟩

| Primitive | Variants / props | Notes |
|---|---|---|
| `Button` | `variant: primary\|secondary\|ghost · size: sm\|md` | ⟨FILL⟩ |
| `Input` / `Field` | `state: default\|error\|disabled` | pairs with form validation |
| `Card` | ⟨FILL⟩ | ⟨FILL⟩ |
| `{{PRIMITIVE}}` | ⟨FILL⟩ | ⟨FILL⟩ |

> New UI reuses or extends these before adding anything (`11-component-reuse.md`). A `Button2` next to `Button` is a defect.

---

## Interaction states

Every interactive component defines **all** the states that apply to it — screens don't get to skip them:

`default` · `hover` · `focus` (visible) · `active` · `disabled` · `loading` · and for data views: `empty` · `error`.

⟨FILL: any product-specific state rules — e.g. destructive actions require a confirm; a control that mutates data shows a pending state.⟩ Mirrors the four-states rule for data fetching (`governance/10`, `19`).

---

## Accessibility bar (non-negotiable)

⟨FILL: adjust the targets, but keep the categories. These are pass/fail, not nice-to-have.⟩

- **Contrast:** text meets ⟨FILL: e.g. WCAG AA 4.5:1 (3:1 for large)⟩.
- **Focus:** every interactive element has a **visible** focus ring; nothing keyboard-inaccessible.
- **Keyboard:** all flows operable without a mouse; logical tab order; escape closes overlays.
- **Targets:** min hit area ⟨FILL: e.g. 44×44px⟩.
- **Semantics:** real semantic elements / roles; images have alt text; forms have labels.
- **Motion:** honor `prefers-reduced-motion`.

---

## What references this (and what must not diverge)

- **Screens** (`design/screens.md`) specify layout using these tokens/primitives by name.
- **Code** implements from the token names — **never hardcodes** a raw hex/px that a token already defines (single source of truth, `governance/14`).
- **Status/label wording** and enum display labels are fixed here + `product/data-model.md`; the design tool may not rename them (`design/design-process.md`).

## Bottom line

⟨FILL⟩ One small, named set of tokens + a shared primitive inventory + a hard accessibility bar. Screens and code reference this by name; nobody reinvents a color, a spacing, or a button.
