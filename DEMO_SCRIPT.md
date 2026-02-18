# Demo Video Script — Elastic Incident Commander

**Target Length:** 3 minutes
**Format:** Screen recording of dashboard + voiceover narration
**Tool:** Record dashboard at https://[vercel-url] with demo mode

---

## [0:00 – 0:20] Hook + Problem Statement

**Screen:** Dashboard in initial state (all agents idle, incident header showing)

**Narration:**
> "Production incidents take an average of 45 minutes to resolve — not because the fix is hard, but because triage, log correlation, and escalation eat up all the time. Incident Commander fixes this with four AI agents that collaborate through Elastic's A2A protocol to resolve P1 incidents in under 5 minutes."

---

## [0:20 – 0:35] Architecture Overview

**Screen:** Point to the four Agent Cards on the left sidebar

**Narration:**
> "We built four specialized agents using Elastic Agent Builder. Triage classifies alerts. Diagnosis correlates logs and metrics using 8 ES|QL queries. Remediation executes fixes through custom tools. And Communication generates postmortems. They hand off structured context to each other via the A2A protocol — no human in the loop."

---

## [0:35 – 0:55] Start the Demo — Triage Phase

**Screen:** Click "▶ Play" button. Triage Agent activates (green glow). Timeline populates with first events.

**Narration:**
> "Let's watch it in action. A PagerDuty alert fires — payment-service error rate is above 5%. The Triage Agent immediately runs ES|QL queries for error rate spikes and log correlation. Within seconds, it classifies this as P1 Critical — 847 errors in 5 minutes, 62% of transactions failing — and routes to the Diagnosis Agent via A2A."

**Highlight:** Point to the first A2A message appearing in the right panel.

---

## [0:55 – 1:25] Diagnosis Phase

**Screen:** Diagnosis Agent activates. Multiple ES|QL tool badges appear in timeline.

**Narration:**
> "Now the Diagnosis Agent takes over. Watch the ES|QL tools fire — CPU anomaly detection, memory pressure check, recent deployments, service latency. It finds that payment-service v2.15.0 was deployed 47 minutes ago, and memory usage is at 97% causing OOM errors. Latency has spiked 13x. Root cause identified with high confidence: memory leak in the new deploy."

**Highlight:** Point to the "Root cause identified" timeline entry and the A2A handoff message.

---

## [1:25 – 1:55] Remediation Phase

**Screen:** Remediation Agent activates. Custom tool badges show rollback + scale.

**Narration:**
> "The Remediation Agent receives the diagnosis and executes two custom tools: first, a rollback from v2.15.0 to v2.14.0 across all 4 hosts, then horizontal scaling from 4 to 8 replicas to drain the request backlog. It verifies the fix by re-running the error rate query — errors drop from 5.2% to 0.1%."

**Highlight:** Point to the error rate mini-chart in Metrics Panel showing the spike and recovery.

---

## [1:55 – 2:25] Communication Phase + Resolution

**Screen:** Communication Agent activates. "✅ Resolved" appears in header. Impact metrics animate in.

**Narration:**
> "Finally, the Communication Agent generates a full incident report with timeline, root cause analysis, and three action items — all published automatically. And look at the impact: MTTR went from 47 minutes to 4 minutes 12 seconds. That's a 91% reduction, with 79% of steps fully automated."

**Highlight:** Point to MTTR Before (47 min, red) vs MTTR After (4.2 min, green) cards, then the 91% reduction badge.

---

## [2:25 – 2:50] Technical Deep Dive

**Screen:** Scroll through A2A messages panel, showing the structured handoffs

**Narration:**
> "Under the hood, each agent handoff is a structured A2A message with context, confidence levels, and recommended actions. We built 12 tools total — 8 ES|QL queries for observability data correlation and 4 custom webhook tools for remediation. The entire system runs on Elastic Cloud Serverless with Agent Builder orchestrating the multi-agent workflow."

---

## [2:50 – 3:00] Closing

**Screen:** Show the full resolved dashboard with all metrics visible

**Narration:**
> "Elastic Incident Commander — four agents, one A2A protocol, five-minute resolution. Built with Elastic Agent Builder for the Elasticsearch Hackathon 2026."

---

## Recording Tips

1. **Use 2x speed** during the demo to keep pacing tight (the demo has 19 steps)
2. **Pause at A2A handoffs** — these are the most impressive moments
3. **Highlight tool badges** — judges score on ES|QL and tool usage
4. **Show the metrics panel last** — the 91% MTTR reduction is the emotional climax
5. **Resolution:** 1920×1080, clean browser (no bookmarks bar)
6. **Audio:** Clear voiceover, no background music needed
