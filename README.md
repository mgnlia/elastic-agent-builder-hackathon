# 🛡️ Elastic Incident Commander — Multi-Agent A2A Dashboard

> **Real-time incident response dashboard powered by 4 AI agents using Elastic Agent Builder and A2A Protocol.**

Built for the [Elastic Agent Builder Hackathon](https://elasticsearch-agent-builder-hackathon.devpost.com/).

## 🎯 What It Does

Elastic Incident Commander demonstrates a **4-agent A2A (Agent-to-Agent) coordination system** for DevOps incident response. The interactive dashboard simulates a real-world scenario where a payment service CPU spike is detected, diagnosed, remediated, and communicated — all autonomously by AI agents in under 2 minutes.

### The Scenario: Payment Service CPU Spike

1. **🚨 Alert** — CloudWatch detects CPU >95% across 3 production hosts
2. **🔍 Triage Agent** — Classifies severity (P1), identifies 1,247 OOM errors
3. **🔬 Diagnosis Agent** — Correlates logs/metrics via ES|QL, finds memory leak in v2.14.0
4. **🔧 Remediation Agent** — Executes rolling rollback to v2.13.2
5. **📢 Communication Agent** — Generates incident report and postmortem
6. **✅ Resolved** — MTTR: 1 minute 55 seconds (95.7% reduction vs manual)

## 🔧 How It Leverages Elastic

- **ES|QL Queries** — Each agent uses Elastic's ES|QL for real-time log correlation, CPU anomaly detection, memory pressure analysis, and deployment event tracking
- **12 ES|QL Tools** — Custom tool definitions for `error_rate_spike`, `cpu_anomaly`, `log_correlation`, `service_latency`, `memory_pressure`, `deployment_events`, and more
- **Elastic Agent Builder** — Agent definitions follow the Elastic Agent Builder pattern with tool schemas and response handling
- **Observability Data** — Agents query `logs-*`, `metrics-system.cpu-*`, and `metrics-system.memory-*` indices

## 🤖 A2A Protocol

The agents communicate using the **A2A (Agent-to-Agent) Protocol**:

- **Alert** → System triggers Triage Agent
- **Handoff** → Triage hands off to Diagnosis with context
- **Handoff** → Diagnosis hands off to Remediation with root cause
- **Handoff** → Remediation hands off to Communication with resolution
- **Response** → Communication publishes final incident report

Each handoff includes full context transfer — no information is lost between agents.

## 📊 Key Metrics

| Metric | Manual | Automated | Improvement |
|--------|--------|-----------|-------------|
| Mean Time to Resolution | 45 min | 1m 55s | **95.7%** |
| Detection to Triage | 8 min | 14s | **97.1%** |
| Triage to Diagnosis | 15 min | 30s | **96.7%** |
| Diagnosis to Fix | 18 min | 30s | **97.2%** |
| Fix to Communication | 4 min | 20s | **91.7%** |

## 🚀 Tech Stack

- **Next.js 14** — React framework with App Router
- **TypeScript** — Full type safety
- **Tailwind CSS** — Utility-first styling with custom dark theme
- **Framer Motion** — Smooth animations and transitions
- **Lucide React** — Icon library
- **JetBrains Mono** — Monospace font for the terminal aesthetic

## 🏃 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## 🌐 Deployment

Deployed on Vercel:

```bash
vercel --prod
```

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main dashboard page
│   └── globals.css         # Global styles + custom scrollbar
├── components/
│   ├── Header.tsx          # Top bar with status + badges
│   ├── DemoControls.tsx    # Play/pause/speed controls + phase progress
│   ├── IncidentTimeline.tsx # Left panel: event cards with ES|QL queries
│   ├── AgentPanel.tsx      # Center: agent network + A2A message flow
│   └── MetricsDashboard.tsx # Right: MTTR comparison metrics
├── hooks/
│   └── useDemo.ts          # State machine for demo playback
└── lib/
    ├── types.ts            # TypeScript interfaces
    ├── utils.ts            # Helper functions
    └── demo-data.ts        # Mock incident data + agent definitions
```

## 📜 License

MIT
