# {{PROJECT_NAME}} — AI Agent Design

> **Template** · Lifecycle: optional · Owner: Architect · Load: Reference
> Fill: replace every `{{PLACEHOLDER}}` and `⟨FILL: …⟩` block. Keep it provider-agnostic (works for any LLM/provider).
> **Delete this file if:** the product has no AI agents/workers in it. (This is about agents *inside the product*, not the coding agents that build it.)
> Related: `decisions.md`, `product/workflows.md`, `governance/13-domain-hard-lines.md`, `governance/16-security-and-approval.md`, `governance/17-external-integrations.md`

> **Derived from `decisions.md` — change decisions there first.** The agent roster and safety lines come from `decisions.md` §C (architecture) and §F (hard lines). Do not introduce an agent here that isn't a decision there.

## Principle

⟨FILL — keep this line⟩ **Deterministic code decides; models only produce content.** Every model output is validated before it touches the database or control flow. An agent is a *worker with a briefing*, not an authority.

---

## Agent roster

⟨FILL: one row per agent/worker in the product. `Validated output` = the schema-checked shape the deterministic layer accepts back.⟩

| Agent | Job (the one thing it does) | Input / briefing | Validated output |
|---|---|---|---|
| **{{AGENT_A}}** | {{WHAT IT PRODUCES}} | {{WHAT IT'S GIVEN — context, retrieved data, the task}} | {{SCHEMA/SHAPE it must return}} |
| **{{AGENT_B}}** | {{WHAT IT PRODUCES}} | {{INPUT}} | {{SHAPE}} |

---

## Orchestration

⟨FILL: how the pieces fit — what the deterministic control plane owns vs what is left to probabilistic work.⟩

- **Deterministic control (code owns):** ⟨FILL: routing, sequencing, retries, which agent runs when, what happens on failure, persistence⟩.
- **Probabilistic work (model owns):** ⟨FILL: only the content generation / classification / extraction inside a single agent call⟩.
- **Boundary:** every model call goes through {{THE GATEWAY/WRAPPER}} (see `governance/17-external-integrations.md`) — never called raw; the model never chooses a state transition or writes to the store directly.

---

## Output safety

⟨FILL — keep the pointers; fill the specifics.⟩ Model output is untrusted input until validated.

- Every response is **schema-validated before persist or use**; malformed output is rejected, not coerced. ⟨FILL: the validation layer, see `governance/05-type-safety.md`⟩.
- The non-negotiable output guarantees live in **`governance/13-domain-hard-lines.md`** (e.g. agent-output safety, provenance) — enforce them, don't restate them differently here.
- Access, secrets, and any privileged action an agent can trigger are governed by **`governance/16-security-and-approval.md`** — identity from the session, never from model output.

---

## Per-agent contract template

⟨FILL: copy this block once per agent. Keep it provider-agnostic — name capabilities, not a specific vendor/model unless a decision pins one (`decisions.md` §T).⟩

```
### Agent: {{AGENT_NAME}}   (D-<decision id>)

Job:        <the single responsibility, one sentence>
Trigger:    <what invokes it — a step in product/workflows.md>
Input:      <the exact briefing/context it receives, and where that comes from>
Output:     <the schema it MUST return — reject anything else>
Guardrails: <what it must never do; the hard line(s) it operates under>
Failure:    <what deterministic code does on invalid/empty/timed-out output>
Cost/limits:<token/latency budget, retry count, fallback behavior>
```

---

## Bottom line

⟨FILL⟩ One sentence: the product runs **{{N}}** agents — chiefly **{{AGENT_A}}** — inside a deterministic control plane, with every output schema-validated and every hard line enforced per `governance/13-domain-hard-lines.md`.
