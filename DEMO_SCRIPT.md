# Demo Video Script — Elastic Incident Commander

**Target Length:** 3 minutes
**Format:** Screen recording of dashboard + voiceover narration
**URL to record:** https://elastic-agent-builder-hackathon.vercel.app

> **TIP:** Use 2x speed during playback to keep the demo tight. The full demo runs ~2 minutes at 1x.

---

## [0:00 – 0:20] Hook + Problem Statement

**Screen:** Dashboard in initial state — all agents idle, header visible

**Narration:**
> "Production incidents take an average of 45 minutes to resolve — not because the fix is hard, but because triage, log correlation, and escalation eat all the time. Incident Commander fixes this with four AI agents that collaborate through Elastic's A2A protocol to resolve P1 incidents in under 2 minutes."

---

## [0:20 – 0:35] Architecture Overview

**Screen:** Point to the four Agent cards in the center panel

**Narration:**
> "We built four specialized agents using Elastic Agent Builder. Triage classifies alerts. Diagnosis correlates logs and metrics using ES|QL queries. Remediation executes automated fixes. And Communication generates postmortems and stakeholder notifications. They hand off structured context to each other via the A2A protocol — no human in the loop."

---

## [0:35 – 0:55] Start the Demo — Triage Phase

**Screen:** Click "▶ Start Demo". Triage Agent activates. Timeline populates with first events.

**Narration:**
> "Let's watch it live. A CloudWatch alarm fires — payment-service CPU is above 95% on three hosts. The Triage Agent ingests the alert, runs ES|QL queries against Elasticsearch, and within 14 seconds classifies this as P1 Critical: 1,247 errors including OutOfMemoryErrors and connection timeouts. It packages the findings and hands off to the Diagnosis Agent via A2A."

**Highlight:** First A2A handoff message appearing in the center message feed.

---

## [0:55 – 1:25] Diagnosis Phase

**Screen:** Diagnosis Agent activates. A2A messages stream in showing ES|QL queries firing.

**Narration:**
> "The Diagnosis Agent runs a correlation chain across Elasticsearch. Watch the ES|QL queries fire in the message feed — it's correlating deployment events with the error spike, checking heap usage, GC behavior, and service latency. In 30 seconds it pinpoints the root cause: payment-service v2.14.0, deployed 47 minutes ago, introduced a memory leak. Heap at 94%, GC thrashing. It hands off to Remediation with a specific rollback target."

**Highlight:** The A2A handoff message from Diagnosis → Remediation.

---

## [1:25 – 1:55] Remediation Phase

**Screen:** Remediation Agent activates. Rollback messages appear in feed.

**Narration:**
> "The Remediation Agent receives the diagnosis and immediately executes the rollback — payment-service v2.14.0 back to v2.13.2 across all three hosts. It runs health checks, confirms all endpoints returning 200 OK, and watches the metrics normalize: CPU drops from 95% to 18%, memory recovers, error rate hits zero. Then it hands off to the Communication Agent."

**Highlight:** The remediation complete → communication handoff message.

---

## [1:55 – 2:25] Communication Phase + Resolution

**Screen:** Communication Agent activates. "✅ Resolved" appears in header. MTTR badge animates in.

**Narration:**
> "The Communication Agent generates the incident report and fires notifications to Slack, PagerDuty, and Jira — all automated. And there's the result: MTTR from 45 minutes down to 1 minute 55 seconds. That's a 95.7% reduction. The entire chain — alert ingestion, triage, root cause analysis, rollback, verification, and communication — fully automated with no human context switches."

**Highlight:** The 95.7% MTTR reduction badge in the metrics panel.

---

## [2:25 – 2:50] Technical Deep Dive

**Screen:** Scroll through the A2A message feed showing structured handoffs

**Narration:**
> "Under the hood, each agent handoff is a typed A2A message with findings, confidence level, and recommended action. We built 12 tools total — 8 ES|QL queries for observability correlation and 4 custom tools for remediation. The full system runs on Elastic Cloud Serverless with Agent Builder orchestrating the multi-agent workflow."

---

## [2:50 – 3:00] Closing

**Screen:** Full resolved dashboard — all metrics visible

**Narration:**
> "Elastic Incident Commander — four agents, one A2A protocol, under two minutes. Built with Elastic Agent Builder for the Elasticsearch Hackathon 2026."

---

## Recording Checklist

- [ ] Browser: clean window, no bookmarks bar, 1920×1080
- [ ] URL: https://elastic-agent-builder-hackathon.vercel.app
- [ ] Set speed to 2x before hitting record (saves time)
- [ ] Pause briefly at each A2A handoff message — these are the money shots
- [ ] Show the 95.7% MTTR reduction badge as the final frame
- [ ] Clear voiceover, no background music needed
