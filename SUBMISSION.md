# Elastic Incident Commander — Hackathon Submission

## Project Description (~400 words)

**Elastic Incident Commander** is a multi-agent DevOps incident response system that reduces Mean Time To Resolution (MTTR) from 45 minutes to under 5 minutes using four specialized AI agents orchestrated via Elastic's A2A (Agent-to-Agent) protocol.

### The Problem

Production incidents cost engineering teams an average of 45 minutes to resolve. The bottleneck isn't the fix — it's the manual triage, log correlation across scattered dashboards, cross-team escalation, and communication overhead. A single P1 incident can involve 3-5 engineers, 4+ tools, and dozens of context switches before anyone writes a remediation command.

### The Solution

Incident Commander deploys four purpose-built agents through Elastic Agent Builder, each with specialized ES|QL tools:

- **Triage Agent** — Receives alerts, classifies severity (P1–P4), and routes to specialists using ES|QL queries for error rate spikes and log correlation.
- **Diagnosis Agent** — Correlates logs and metrics across 8 ES|QL queries (CPU anomalies, memory pressure, deployment events, service latency, dependency errors, throughput drops) to identify root cause with high confidence.
- **Remediation Agent** — Executes automated fixes via 4 custom tools: rolling restarts, horizontal scaling, deployment rollbacks, and configuration updates.
- **Communication Agent** — Generates real-time status updates, incident timelines, and structured postmortems with 5-whys analysis.

The agents hand off structured context via A2A protocol messages — each handoff includes the agent's findings, confidence level, and recommended next action. This chain-of-responsibility pattern means no human needs to manually correlate data or escalate between teams.

### Technical Implementation

We built 12 tools total: 8 ES|QL tools with pre-written queries for observability data correlation, and 4 custom webhook-based tools for remediation actions. The orchestration layer runs on Python with `uv`, and a Next.js dashboard provides real-time visualization of the incident lifecycle, agent activity, A2A message flow, and MTTR comparison metrics.

### Features We Liked

1. **A2A Protocol** — The agent-to-agent handoff model is genuinely powerful. Structuring each handoff as a typed message with context, confidence, and recommendations made the multi-agent flow reliable and debuggable.
2. **ES|QL Tools** — Writing pre-built ES|QL queries as agent tools was the fastest path to useful agent behavior. The piped query syntax is intuitive for composing complex correlations.

### Challenge

The biggest challenge was designing the agent handoff schema — deciding what context each agent needs from its predecessor without over-sharing (causing confusion) or under-sharing (causing re-queries). We iterated on the A2A message format several times before landing on the structured triage→diagnosis→remediation→communication chain.

### Impact

In our demo scenario (payment-service memory leak after a bad deploy), Incident Commander resolves the P1 incident in 4 minutes 12 seconds — a **91% reduction in MTTR** compared to the 47-minute manual baseline, with 79% of response steps fully automated.

---

**Tech Stack:** Elastic Cloud Serverless · Agent Builder · ES|QL (8 queries) · Custom Tools (4 actions) · A2A Protocol · Python + uv · Next.js Dashboard

**Live Dashboard:** [See deployment URL]

**Repository:** https://github.com/mgnlia/elastic-agent-builder-hackathon
