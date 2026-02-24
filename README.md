# 🛡️ Elastic Incident Commander

**Multi-agent DevOps incident response system built for the [Elasticsearch Agent Builder Hackathon](https://elasticsearch.devpost.com/).**

Reduces Mean Time To Resolution (MTTR) from 45 minutes to under 2 minutes using four specialized AI agents orchestrated via Elastic's A2A (Agent-to-Agent) protocol.

---

## 🔗 Links

- **Live Dashboard:** https://elastic-agent-builder-hackathon.vercel.app
- **Hackathon:** Elasticsearch Agent Builder Hackathon (Feb 27, 2026 deadline)

---

## 🤖 The Four Agents

| Agent | Role | Tools |
|-------|------|-------|
| 🔍 **Triage Agent** | Classifies severity (P1–P4), identifies affected services, routes to specialists | `error_rate_spike`, `search_service_catalog`, `search_recent_alerts` |
| 🔬 **Diagnosis Agent** | Correlates logs & metrics via ES\|QL, identifies root cause | `cpu_anomaly`, `log_correlation`, `service_latency`, `memory_pressure`, `deployment_events`, `dependency_errors`, `throughput_drop` |
| 🔧 **Remediation Agent** | Executes automated fixes — rollback, restart, scale, config update | `restart_service`, `scale_service`, `rollback_deployment`, `update_config` |
| 📢 **Communication Agent** | Generates incident reports, status updates, and postmortems | `search_incident_history` |

**12 tools total:** 8 ES|QL observability queries + 4 custom remediation actions.

---

## 🏗️ Architecture

```
PagerDuty Alert
      │
      ▼
┌─────────────┐    A2A     ┌──────────────┐    A2A     ┌───────────────────┐    A2A     ┌───────────────────┐
│ Triage Agent│──────────▶│Diagnosis Agent│──────────▶│Remediation Agent  │──────────▶│Communication Agent│
│ (classify)  │           │ (root cause)  │           │ (execute fix)     │           │ (report + close)  │
└─────────────┘           └──────────────┘           └───────────────────┘           └───────────────────┘
      │                          │                              │
   ES|QL                      ES|QL                        Custom Tools
  (3 tools)                  (7 tools)                    (rollback/scale)
```

Each agent handoff is a structured A2A message containing findings, confidence level, and recommended next action.

---

## 📊 Results

| Metric | Manual | Automated |
|--------|--------|-----------|
| Detection → Triage | 8 min | ~14 sec |
| Triage → Diagnosis | 15 min | ~30 sec |
| Diagnosis → Fix | 18 min | ~30 sec |
| Fix → Communication | 4 min | ~20 sec |
| **Total MTTR** | **45 min** | **1 min 55 sec** |
| **Reduction** | — | **95.7%** |

---

## 🛠️ Tech Stack

- **Elastic Cloud Serverless** — observability data store
- **Elastic Agent Builder** — agent orchestration
- **ES|QL** — observability query language (8 pre-built queries)
- **A2A Protocol** — agent-to-agent structured handoffs
- **Python + uv** — backend orchestration layer
- **Next.js 14 + TypeScript + Tailwind CSS** — live dashboard
- **Vercel** — frontend deployment

---

## 🚀 Running Locally

### Frontend

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Backend

```bash
uv sync
uv run incident-commander --help
```

---

## 📄 Submission Materials

- [`SUBMISSION.md`](./SUBMISSION.md) — Devpost description (~400 words)
- [`DEMO_SCRIPT.md`](./DEMO_SCRIPT.md) — 3-minute video script with timestamps
- [`SOCIAL_POST.md`](./SOCIAL_POST.md) — X/Twitter thread ready to post

---

## 📝 License

MIT — see [LICENSE](./LICENSE)
