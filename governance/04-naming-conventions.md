# 04 — Naming Conventions

> **Template** · Lifecycle: populate-once · Owner: Lead/Architect · Load: Always
> Fill: pick your casing for each row, replace every `{{EXAMPLE}}` with a real name from your codebase, and delete rows that don't apply to your stack. Keep the "one name per concept" discipline.
> Related: `03-project-map.md`, `12-data-access-and-schema.md`, `19-api-contract.md`

## Purpose

Remove ambiguity about what to name things. Inconsistent naming is the cheapest chaos to prevent and the most annoying to fix later. Pick a convention per row **once**, then hold the line.

---

## Files & Folders

⟨FILL: set your casing per row; the *Convention* column is the rule, the *Example* column is yours to fill.⟩

| Thing | Convention (e.g.) | Example |
|---|---|---|
| UI component file | PascalCase | `{{WidgetCard}}.{{ext}}` |
| Non-component source file | kebab-case | `{{value-calculator}}.{{ext}}` |
| Route / view segment folder | kebab-case | `{{app/(area)/sub-view/}}` |
| Route handler | fixed filename | `{{route}}.{{ext}}` |
| Test file | `*.test.*` (unit/integration), `*.spec.*` (e2e) | `{{value}}.test.{{ext}}` |
| Schema file | kebab-case + `.schema.*` | `{{entity}}.schema.{{ext}}` |
| Hook / composable file | camelCase, framework prefix | `{{useEntityProfile}}.{{ext}}` |

---

## Code Identifiers

⟨FILL: adapt to your language's idioms; keep the "one style per kind" rule.⟩

| Thing | Convention (e.g.) | Example |
|---|---|---|
| Variable / function | camelCase | `{{calculateTotal}}` |
| Type / class / component | PascalCase, no `I` prefix | `{{EntitySummary}}`, not `{{IEntity}}` |
| Enum (prefer union/literal types) | PascalCase type, UPPER members | `type {{Status}} = '{{ACTIVE}}' \| ...` |
| Constant | UPPER_SNAKE_CASE | `{{DEFAULT_CADENCE_DAYS}}` |
| Boolean | `is/has/can/should` prefix | `{{isVisible}}`, `{{hasOpenFlag}}` |

**Match enum/literal values to your data model and API exactly** — one spelling per value, defined once (see `12-data-access-and-schema.md`). ⟨FILL: name the canonical source.⟩

---

## UI Components

⟨FILL: keep if you have a UI; delete otherwise.⟩

| Thing | Convention (e.g.) | Example |
|---|---|---|
| Event handler prop | `on` + Event | `{{onApprove}}`, `{{onSubmit}}` |
| Internal handler | `handle` + Event | `{{handleApprove}}` |
| Boolean prop | `is/has/can` | `{{isLoading}}`, `{{canEdit}}` |
| Variant prop | noun describing the axis | `{{tone}}="danger"`, `{{size}}="sm"` |

---

## API

⟨FILL: keep if you expose an API; the rules below hold for any REST-style boundary. Delete/adapt for RPC/GraphQL. Mirror the contract in `19-api-contract.md`.⟩

- Resource paths are **plural nouns**: `{{/api/v1/entities}}`, not `{{/getEntities}}`.
- Nest by ownership: `{{/api/v1/entities/:id/children}}`.
- Actions that aren't CRUD use a verb sub-path: `{{/items/:id/approve}}`, `{{/records/:id/submit}}`.
- Version prefix is always `{{/api/v1}}`.
- Query params use one casing (e.g. camelCase): `{{?hasFlag=true&isDue=true}}`.

---

## Database

⟨FILL: keep if you have a database; delete otherwise. Rules below are ORM-agnostic (see `12-data-access-and-schema.md`).⟩

| Thing | Convention (e.g.) | Example |
|---|---|---|
| Model / table | PascalCase singular (or your ORM's default) | `{{EntitySubmission}}` |
| Field / column | camelCase (or snake_case per stack) | `{{accessEnabled}}` |
| Foreign key field | `<entity>Id` | `{{entityId}}`, `{{parentId}}` |
| Enum | PascalCase type, UPPER values | `{{Status.ACTIVE}}` |
| Index | `idx_<table>_<columns>` | `{{idx_entity_owner_date}}` |

Standard columns on every model: `id`, `createdAt`, `updatedAt`, and `deletedAt` where soft-deletable. ⟨FILL: adjust to your conventions.⟩

---

## Environment Variables

⟨FILL: adapt prefixes to your framework.⟩

| Scope | Convention (e.g.) | Example |
|---|---|---|
| Public (client-exposed) | framework public prefix | `{{PUBLIC_}}{{API_URL}}` |
| Server secret | UPPER_SNAKE, no public prefix | `{{SERVICE_ROLE_KEY}}` |

Never inline a secret. See `16-security-and-approval.md`.

---

## Branches & Commits

- Branch: `feature/<short-desc>`, `fix/<short-desc>`, `chore/<short-desc>`.
- Commit: conventional commits — `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`.

---

## Bottom Line

Pick one convention per kind and hold it: components PascalCase, other files kebab-case, DB fields with `<entity>Id` FKs, REST paths plural. Match the enum/literal values in your schema exactly — one name per concept.
