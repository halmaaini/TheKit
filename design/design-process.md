# Design Process

> **Template** · Lifecycle: optional · Owner: Product/Design · Load: Reference
> Fill: replace every `{{PLACEHOLDER}}` and `⟨FILL⟩` block; keep the process, swap the specifics.
> Delete this file if: the product has no UI.
> Related: `product/prd.md`, `product/workflows.md`, `governance/10-frontend-architecture.md`, `governance/11-component-reuse.md`, `decisions.md`

This file defines how UI wireframes are produced, reviewed, and approved for this project. It is a **process template**, not a screen inventory — the process is reusable; the screens and tooling are yours to fill in.

Approved wireframes become the **layout source of truth** for all coding agents. No coding task with a UI surface starts until its wireframes are approved and saved to `⟨your design output location⟩`.

---

## The sequence (do not reorder)

Design comes **before** build. The order exists to stop agents from guessing layout, inventing names, or hard-coding values that a later design pass would overturn.

1. **Design** — produce a high-fidelity wireframe for each screen with `{{DESIGN_TOOL}}` (e.g. an AI design tool that outputs static HTML). Real layout, real labels, real placeholder data, real empty states.
2. **Approve** — the approval authority reviews each screen and either requests changes or signs off. Only signed-off screens advance.
3. **Lock tokens** — extract the colors, typography, spacing, and component styles the approved screens establish, and record them in the design-system spec (`design/design-system.md`). Once locked, they are the reference; screens do not silently drift from them.
4. **Build** — coding agents reference the approved wireframes and the locked tokens directly. They implement layout from the design output, not from imagination.

> If a step is skipped, later steps inherit the ambiguity. Approve before locking; lock before building.

---

## Roles

| Role | Responsibility |
|---|---|
| **Designer / operator** | Drives `{{DESIGN_TOOL}}`: describes each screen, iterates until it looks right, exports the final artifact to `⟨your design output location⟩`. No technical background required. |
| **{{APPROVAL_AUTHORITY}}** | The single authority who signs off each screen. Sign-off is what turns a draft into the layout source of truth. When sources conflict, this role's ruling wins — log it in `decisions.md`. |
| **Coding agents** | Consume approved wireframes + locked tokens. They implement, they do not redesign. |

---

## Tooling

- **Design tool:** `{{DESIGN_TOOL}}` — ⟨FILL: name your tool and its output format, e.g. "an AI design tool producing static HTML with inline CSS, no JavaScript, no external stylesheets"⟩.
- **Output format:** ⟨FILL: the exact artifact format coding agents will read (e.g. static HTML, Figma frames, a component-library page)⟩.
- **Target surfaces:** ⟨FILL: each surface + its design width/breakpoint, e.g. "{{SURFACE_1}} — desktop web at {{WIDTH}}px; {{SURFACE_2}} — mobile at {{WIDTH}}px"⟩.

---

## Running a design session

Open a session with `{{DESIGN_TOOL}}` and give it the ground rules up front:

- Output the agreed artifact format only — no logic, no frameworks, no invented dependencies.
- Make it high-fidelity: real layout, real labels, real placeholder data, real empty and error states.
- Design only for the surface and role specified in this pass; do not add features outside current scope.
- Do not invent product features. If a screen seems to need one that isn't in scope, flag it — don't design it in.
- After sign-off, export the final clean artifact so it can be saved.

Then request one screen at a time. Be specific about the role/surface, the screen's purpose, and any detail that matters (e.g. "this screen should feel calm, not dense"). Iterate in plain language ("make the sidebar narrower") until the approval authority signs off, then export and save.

---

## Screen list per phase

⟨FILL: your screen list per phase. One block per delivery phase; for each screen give role/surface, a file/artifact name, and a one-line purpose. Work through screens in phase order — approve and save a phase's batch before starting the next. Save approved artifacts to `⟨your design output location⟩`, organized per phase.⟩

---

## What is IN scope for a wireframe

- Layout, hierarchy, and navigation structure.
- Real labels and status-chip wording.
- Placeholder content, empty states, and error states.
- The visual language that seeds the design tokens.

## What is OUT of scope for a wireframe

Wireframes describe **what a screen looks like**, never **how it works**. The following are decided in the specs, not the design tool — if the design tool proposes them, reject it and note the conflict:

- **Data logic** — how values are computed, aggregated, or derived. Lives in `product/data-model.md` / `product/workflows.md`.
- **API shapes** — request/response payloads and field contracts. Live in `governance/19-api-contract.md`.
- **Field-level data model** — which fields an entity actually has. Lives in `product/data-model.md`.
- **Business rules & feature scope** — what features exist on a screen. Lives in `product/prd.md` and `product/roadmap.md`.

A wireframe that contradicts a spec is wrong by default; the spec is the authority.

---

## After a screen is approved

1. Save the final artifact to `⟨your design output location⟩` under the correct phase.
2. When a phase's screens are all approved, mark the design task `Done` in `delivery/02-task-ledger.md`.
3. If the approved screens establish colors/typography not yet locked, extract the tokens and update `design/design-system.md`.
4. Coding agents then reference the saved artifacts directly for layout — they do not re-decide design.

---

## What the design tool must NOT change

These are fixed in the specs. If the design tool suggests something that contradicts them, reject it and note the conflict.

| Topic | Decided in |
|---|---|
| What features exist on each screen | `product/prd.md`, `product/roadmap.md` |
| Status / label wording | `design/design-system.md` |
| Enum values and their display labels | `product/data-model.md` |
| Data fields on each entity | `product/data-model.md` |
| Navigation structure | `⟨your approved wireframes⟩` |
| How any value is calculated | `product/workflows.md`, `product/data-model.md` |

If the design tool renames a status, adds an out-of-scope feature, or changes navigation — override it. The specs are the authority.
