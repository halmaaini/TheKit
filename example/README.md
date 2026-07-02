# Example — Snip (a filled Project Kit instance)

> **EXAMPLE — filled instance, not a template.** A worked example of the Project Kit for a fictional URL shortener ("Snip"). Imitate the shape; don't edit these to build a real project. The blank templates live one level up.

**What this folder is:** a small, coherent, **fully-filled** walkthrough of the Project Kit for one fictional product — **Snip**, a multi-tenant URL-shortener SaaS. Every file here is what a *real* filled kit doc looks like: real decisions with stable IDs, a real PRD, a real data model, real hard lines, a real phase plan, and a task ledger frozen **mid-flight** so you can see what an in-progress build looks like.

**What Snip is:** users create short links (long URL → short code), share them, and see how many people clicked. Individuals and small teams. The core job is *"make a short link in seconds and know how many people clicked."*

---

## How to use this folder

- **Read it to learn the shape.** Open `decisions.md` first, then follow the traceability spine — every downstream doc cites the `D-…` decision it derives from.
- **Imitate, don't edit.** These docs describe a fictional product. To start a real project, fill the **blank templates one level up** (`../decisions.md`, `../product/…`, etc.), using these as your reference for tone and structure.
- **Notice the banner.** Every file here opens with the EXAMPLE banner instead of the template banner, so no one mistakes a filled example for a blank to fill.

---

## What's filled here (the spine)

This is a focused **spine**, not all ~40 kit docs. It covers the load-bearing path from decision → product → hard line → plan → log:

| Doc | What it shows |
|---|---|
| `decisions.md` | The canonical decision record (D-1…D-12, stack `T`, scope `R`), version 1.0 — the root everything derives from. |
| `product/prd.md` | Problem, users, goals, non-goals, v1 scope, key features, success metric. |
| `product/data-model.md` | Entities (`users`, `links`, `click_events`), relationships, the link lifecycle, and the invariants that seed tests. |
| `product/workflows.md` | The 4 end-to-end flows (sign up, create link, redirect+track, view analytics). |
| `governance/13-domain-hard-lines.md` | **The showcase.** The three non-negotiables — tenant isolation (D-10), short-code integrity (D-11), append-only click ledger (D-12) — each with golden rules and four-layer enforcement. |
| `delivery/01-phases-and-gates.md` | Phases 0–3, each with objective, entry/exit criteria, critical path, and a sign-off gate. |
| `delivery/02-task-ledger.md` | A realistic **mid-flight** ledger: some tasks Done, one In Progress, one Blocked. |
| `logs/gap-log.md` | Two gap rows — one closed via a decision, one still open. |
| `logs/decisions-log.md` | One ruling — soft-delete + tombstone satisfies the short-code hard line (D-11). |

---

## The rest of the kit follows the same pattern

The docs **not** filled here — the full `governance/` constitution (01–19), the rest of `delivery/` (risk register, change requests, agent build architecture, session handoff), `product/roadmap.md`, `contradiction-log.md`, and so on — follow the **exact same shape** as their blank templates one level up. Once you've internalized how `decisions.md` and `13-domain-hard-lines.md` are filled here, filling the others is mechanical: replace the `{{PLACEHOLDERS}}`, delete the `⟨FILL⟩` guidance, and keep the voice (tables, ✅/❌, "Bottom line", D-ID citations).

---

*Learning artifact. If the kit's doc shapes change, refresh this example so it keeps matching the templates it teaches.*
