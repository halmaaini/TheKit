# 10 — Frontend Architecture

> **Template** · Lifecycle: populate-once · Owner: Architect · Load: Reference
> Fill: replace `{{FRAMEWORK}}`/`{{DATA_LAYER}}`/`{{UI_LIB}}` and the surface names with your stack; keep the state-category rules and the four-states rule.
> Delete this file if: the project has no UI.
> Related: `11-component-reuse.md`, `19-api-contract.md`, `15-error-handling.md`, `16-security-and-approval.md`

## Purpose

Keep the frontend predictable: **where state lives, how data is fetched, and how distinct surfaces stay cleanly separated.**

---

## Folder Layout

See `03-project-map.md`. ⟨FILL: name your surfaces and what they share — e.g. "two surfaces `{{SURFACE_A}}` and `{{SURFACE_B}}` share only `{{components/ui}}`." Delete if single-surface.⟩

---

## Server vs Client Rendering

*(Keep this section only if your `{{FRAMEWORK}}` splits server/client rendering; otherwise delete.)*

- **Default to server rendering.** Fetch on the server, ship less JS.
- **Escalate to a client component** only when you need interactivity: forms, local state, event handlers, browser APIs.
- Keep client components small — push data fetching up and pass props down.

---

## State Categories (pick the right one)

| State | Where it lives | Tool |
|---|---|---|
| Server data (records from the API) | Server cache | **{{DATA_LAYER}}** — never copied into local state |
| URL state (filters, pagination, open tab) | The URL | {{URL_STATE_MECHANISM}} |
| Form state | The form | {{FORM_LIB}} + schema resolver (`05-type-safety.md`) |
| Local UI state (dropdown open) | The component | local component state |
| Cross-component client state | Shared context | context (simple); a store only if truly justified |

Do **not** duplicate server data into local state. Do **not** put filter/pagination state in a store when it belongs in the URL.

---

## Data Fetching

- All API calls go through the **typed client generated from your API contract** (`19-api-contract.md`, `⟨your API spec⟩`). No hand-written requests, no hand-written response types.
- Every async view handles **all four states: loading, error, empty, success.** Mandatory, not optional — design the empty and error states, don't leave them to chance.

```
const { data, isLoading, error } = use{{Resource}}()
if (isLoading) return <{{Resource}}Skeleton />
if (error)     return <ErrorState error={error} />     // see 15-error-handling
if ({{isEmpty(data)}}) return <Empty{{Resource}} />
return <{{Resource}} data={data} />
```

---

## Styling

- ⟨FILL: your styling system — e.g. `{{UI_LIB}}` primitives + utility classes.⟩
- Use the design tokens (colors, spacing, type scale) from `⟨your design-system source⟩`. **Don't invent hex values inline.**
- ⟨FILL: if surfaces have distinct personalities (density, touch size), name the rule; else delete.⟩

---

## Surface Separation

⟨FILL: keep this section only if you have >1 surface.⟩

- A `{{SURFACE_A}}` view must never import a `{{SURFACE_B}}`-specific component, and vice versa.
- Never render a value that must not cross a visibility boundary in a surface that shouldn't see it. The data shouldn't even reach that surface (enforced server-side, `16-security-and-approval.md`) — but don't rely on that alone; don't build UI that expects fields it must not receive.

---

## Accessibility & Forms

- Follow `⟨your accessibility guidelines⟩` (focus rings, labels, touch-target size, correct input modes).
- **One** shared form pattern, **one** shared field component, **one** shared submit pattern — see `11-component-reuse.md`.

---

## Forbidden Patterns

- Hand-written requests or hand-written API response types.
- Business logic (any value with a single source of truth) computed in a component — call the API value (`14-single-source-of-truth.md`).
- Server data mirrored into local state.
- Filter/pagination state in a global store instead of the URL.
- Inline hex colors instead of design tokens.

---

## Bottom Line

Server rendering by default, server data through the generated client, URL holds filter state, every async view handles all four states, and separate surfaces never cross-import.
