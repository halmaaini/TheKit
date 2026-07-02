# Central Risk Register + Phase Highlights

> **Template** · Lifecycle: living · Owner: Lead · Load: Reference
> Fill: replace the example rows with your real risks; revisit the register at every phase gate.
> Related: `01-phases-and-gates.md`, `05-change-requests.md`, `../governance/13-domain-hard-lines.md`

## Purpose

One place to name what could derail delivery, how likely and how bad it is, and what you're doing about it — with an accountable owner per risk. Review it at every phase gate: close what's retired, add what's newly visible.

Impact and Likelihood use **High / Medium / Low**. A risk that would violate a `../governance/13-domain-hard-lines.md` guarantee is **always High impact**.

---

## Central Risk Register

> ⟨FILL⟩ Replace the example rows with your project's risks. Keep the columns. Give each a stable ID (`R1`, `R2`, …) and one clear owning function.

| ID | Risk | Impact | Likelihood | Owner | Mitigation |
|---|---|---|---|---|---|
| R1 | Scope expansion during the release ({{PROJECT_NAME}} creep) | High | Medium | Product | Enforce the change-request process (`05-change-requests.md`); hold the out-of-scope list. |
| R2 | Cross-track dependency delays stall the critical path | Medium | High | Lead/Eng | Dependency review each session; escalate blockers early via the ledger. |
| ⟨FILL⟩ | ⟨your risk⟩ | ⟨H/M/L⟩ | ⟨H/M/L⟩ | ⟨function⟩ | ⟨how you reduce it⟩ |

---

## Per-phase risk highlights

For each phase, name the one or two risks most acute *in that phase* and the mitigation you'll apply at its gate.

> ⟨FILL⟩ One block per phase (`{{PHASE}}`). Delete the example.

### {{PHASE}} — ⟨FILL: Phase Name⟩
- **Risk:** ⟨FILL: the phase-specific risk⟩
- **Mitigation:** ⟨FILL: what you do about it before the gate⟩

### Phase 2 *(example)*
- **Risk:** access-model implementation drifts from the agreed design.
- **Mitigation:** validate the auth/access plan against the code at the phase gate.
