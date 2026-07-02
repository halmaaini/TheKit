# 21 — Dependencies & Supply Chain

> **Template** · Lifecycle: living · Owner: Lead · Load: Reference
> Fill: replace every `{{PLACEHOLDER}}` and `⟨FILL: …⟩` block with your package manager, audit command, and license policy.
> Delete this file if: the project has **no third-party dependencies**.
> Related: `05-type-safety.md`, `16-security-and-approval.md`, `07-testing-standards.md`, `delivery/06-agent-build-architecture.md`

## Purpose

Every dependency is code you didn't write, running with your privileges, that can break, bloat, or be compromised. Each one is a liability to be justified — not a convenience to be reached for. Fewer, well-vetted, pinned deps beat a long list of casual ones.

---

## Golden rules

- ✅ **Pin versions and commit the lockfile** (`{{LOCKFILE}}`). Builds are reproducible; the lockfile is source of truth for what actually ships.
- ✅ **Prefer the standard library.** Reach for a dependency only when the stdlib genuinely can't do it.
- ❌ Adding a dependency to save a few lines you could write and own.
- ❌ Floating/unpinned version ranges, or an uncommitted lockfile.

---

## Adding a dependency

A new dependency is an unplanned architectural change. It goes through **`delivery/06-agent-build-architecture.md` Protocol 3 — Unplanned Dependency Protocol** (stop, justify, get approval) before it lands. Agents never silently add packages.

Before proposing one, vet it:

- **Maintenance:** active commits, releases, open-issue health.
- **Popularity / trust:** real adoption, not a one-off.
- **Transitive weight:** how many packages does it drag in? Prefer a small tree.
- **Fit:** does it solve *this* problem without a pile of unused surface?

---

## Vulnerability scanning

- Run a dependency **audit in CI** (⟨FILL: your audit command, e.g. `{{AUDIT_CMD}}`⟩). A known high-severity vulnerability fails the build.
- ⟨FILL: your policy for triaging and patching flagged advisories.⟩

---

## Licensing

- **Check license compatibility before adding.** A dependency's license must be compatible with how you ship (see `16-security-and-approval.md` for anything customer-facing).
- Keep a repo **`LICENSE`** file for your own project.
- ⚠️ Watch **copyleft** (GPL/AGPL-family) — it can impose obligations on your whole distribution. ⟨FILL: your allowed / denied license list.⟩

---

## Enforcement

- Lockfile committed and required (CI fails if it's missing or out of sync).
- Audit step in the CI pipeline (see `20-ci-cd-and-deployment.md`).
- A dependency-review checklist (vetted · pinned · license-cleared · Protocol 3 approved) on any PR that touches `{{MANIFEST_FILE}}` / `{{LOCKFILE}}`.

---

## Bottom line

Prefer the stdlib, justify every dependency through Protocol 3, pin versions with a committed lockfile, audit for vulnerabilities in CI, and clear each license before it ships.
