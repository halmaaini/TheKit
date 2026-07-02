# 22 — Internationalization

> **Template** · Lifecycle: living · Owner: Lead · Load: Reference
> Fill: replace every `{{PLACEHOLDER}}` and `⟨FILL: …⟩` block with your i18n library, catalog location, and supported locales.
> Delete this file if: the product is **single-language** with no localization plans.
> Related: `10-frontend-architecture.md`, `04-naming-conventions.md`, `12-data-access-and-schema.md`, `19-api-contract.md`

## Purpose

Retrofitting localization is brutal — hardcoded strings and locale-blind formatting are scattered everywhere by then. Building it in from the start costs almost nothing and keeps the door open. Every user-facing string and every formatted value goes through the locale layer.

---

## Golden rules

- ✅ **No hardcoded user-facing strings.** Every label, message, and error uses a **translation key** resolved from the message catalog (⟨FILL: `{{CATALOG_DIR}}` and `{{I18N_LIB}}`⟩).
- ✅ **Store UTC, render local.** Persist timestamps as UTC (see `12-data-access-and-schema.md`); apply the user's timezone only at display.
- ❌ Concatenating translated fragments to build a sentence — word order differs by language. Use one keyed message with interpolation.
- ❌ Formatting numbers, dates, or currency by hand.

---

## Formatting

- **Locale-aware** number, date, and currency formatting via the platform/locale API — never manual `,`/`.` or `$` assembly.
- ⟨FILL: your currency display rule and default locale.⟩

## Pluralization

- Use the i18n library's plural rules (zero / one / few / many / other as the locale needs), not an `if (n === 1)` branch.

## RTL

- Layout must support **right-to-left** locales — use logical/start-end direction, not hardcoded left/right (see `10-frontend-architecture.md`).

## Key naming

- Consistent, namespaced keys (⟨FILL: e.g. `{{domain.screen.element}}`⟩), aligned with `04-naming-conventions.md`. One key per concept — no duplicates.

---

## Enforcement

- A **lint/grep** that flags hardcoded user-facing string literals in UI code (⟨FILL: your rule / config⟩).
- A test that **every catalog key resolves** in every supported locale — no missing or orphaned keys.
- ⟨FILL: a check that new UI text ships with its key, not a literal.⟩

---

## Bottom line

Every user-facing string is a catalog key, all numbers/dates/currency use locale-aware formatting, timestamps are stored UTC and rendered local, layouts support RTL, and pluralization goes through the i18n library — enforced by a hardcoded-string lint and a key-resolution test.
