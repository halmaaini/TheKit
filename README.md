# TheKit

**A reusable, project-agnostic "operating system" for building software with AI coding agents.**

Drop it into a new repo and every project starts with senior-team discipline
already baked in: a single source-of-truth decision record, structured product
& design specs, a coding constitution, a gated delivery plan, and an enforcement
harness that makes the checkable rules bind mechanically.

> **One source of truth; everything else is derived.** `decisions.md` is
> canonical — change it there first, then update what depends on it.

## Use it
Click **"Use this template" → Create a new repository**, then open your copy and
read **[START-HERE.md](./START-HERE.md)** (technical) or **[READTHIS.md](./READTHIS.md)**
(plain-English). New to it? Skim **[example/](./example/)** — a filled worked
instance (a fictional URL shortener) showing what "done" looks like.

**Already have a codebase?** Follow **[ADOPT-EXISTING.md](./ADOPT-EXISTING.md)** —
the kit drops into a `kit/` subfolder, the record is reverse-engineered *as-built*,
and a grandfathering ratchet holds every new line to the rules without turning
your existing code red.

## What's inside
- `decisions.md` — the single source of truth
- `intake/` — drop raw material; the agent distills it into the docs
- `product/` · `design/` — what to build, and how it looks
- `governance/` — the coding constitution
- `delivery/` — the gated build plan + task ledger
- `enforcement/` — the guardrail harness (hooks · commands · CI)
- `logs/` · `archive/` — the append-only record and frozen history
- `example/` — a filled sample to imitate

## License & attribution
Dual-licensed: **docs under [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/)**,
**code under [MIT](./LICENSE)**. Use, adapt, and build on TheKit — including
commercially — **provided you keep attribution**:

> Based on **TheKit** by Haitham Al Maaini — https://github.com/halmaaini/TheKit — CC-BY-4.0 (docs) / MIT (code).

See **[LICENSE](./LICENSE)** for full terms. © 2026 Haitham Al Maaini.
