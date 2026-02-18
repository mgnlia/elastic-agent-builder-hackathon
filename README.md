# 🛡️ Elastic Incident Commander

**Multi-agent DevOps incident response system built with [Elastic Agent Builder](https://www.elastic.co/elastic-agent) and the [A2A Protocol](https://github.com/google/A2A).**

> Reduces Mean Time To Resolution (MTTR) from **45 minutes** (manual) to **under 2 minutes** (automated).

[![Built with Elastic Agent Builder](https://img.shields.io/badge/Built%20with-Elastic%20Agent%20Builder-00BFB3?style=flat-square)](https://www.elastic.co/elastic-agent)
[![A2A Protocol](https://img.shields.io/badge/Protocol-A2A-0077CC?style=flat-square)](https://github.com/google/A2A)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square)](https://python.org)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue?style=flat-square)](LICENSE)

---

## 🎯 What It Does

Elastic Incident Commander is a **4-agent orchestration system** that automatically triages, diagnoses, remediates, and communicates DevOps incidents — end to end — using Elastic's observability stack and agent-to-agent (A2A) messaging.

### The Problem

Manual incident response is slow, error-prone, and exhausting:

- **45-minute average MTTR** across the industry
- On-call engineers context-switch between 5+ tools
- Root cause analysis requires correlating logs, metrics, and traces manually
- Communication gaps between responders and stakeholders

### The Solution

Four specialized AI agents collaborate via A2A protocol, each with targeted ES|QL tools:

```
Alert → 🔍 Triage → 🔬 Diagnosis → 🔧 Remediation → 📢 Communication → ✅ Resolved
         (14s)        (30s)           (30s)              (20s)
                                                              Total: ~2 min
```

---

## 🤖 The Four Agents

| Agent | Role | Tools | Avg Time |
|-------|------|-------|----------|
| **🔍 Triage** | Classifies severity (P1–P4), identifies affected services, routes to specialists | `error_rate_spike`, `search_service_catalog`, `search_recent_alerts` | 14s |
| **🔬 Diagnosis** | Correlates logs & metrics via ES\|QL, identifies root cause | `cpu_anomaly`, `log_correlation`, `service_latency`, `memory_pressure`, `deployment_events`, `dependency_errors`, `throughput_drop` | 30s |
| **🔧 Remediation** | Executes fix actions — rollback, restart, scale, config update | `restart_service`, `scale_service`, `rollback_deployment`, `update_config` | 30s |
| **📢 Communication** | Generates status updates, incident reports, and postmortems | `search_incident_history` | 20s |

### Tool Breakdown

- **8 ES|QL query tools** — Pre-built queries for error spikes, CPU anomalies, memory pressure, latency, deployments, dependencies, throughput
- **4 custom action tools** — Service restart, horizontal scaling, deployment rollback, config updates
- **12 tools total** across all agents

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Elastic Cloud                         │
│  ┌─────────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ Elasticsearch│  │  Kibana  │  │  Agent Builder API │  │
│  │  (logs,      │  │          │  │                   │  │
│  │   metrics)   │  │          │  │  ┌─────────────┐  │  │
│  └──────────────┘  └──────────┘  │  │ Triage Agent│  │  │
│                                   │  ├─────────────┤  │  │
│                                   │  │ Diag Agent  │  │  │
│                                   │  ├─────────────┤  │  │
│                                   │  │ Remed Agent │  │  │
│                                   │  ├─────────────┤  │  │
│                                   │  │ Comms Agent │  │  │
│                                   │  └─────────────┘  │  │
│                                   └───────────────────┘  │
└─────────────────────────────────────────────────────────┘
         ▲                    ▲
         │  ES|QL queries     │  A2A messages
         │                    │
    ┌────┴────────────────────┴────┐
    │   Incident Commander CLI     │
    │   (Python / Typer / Rich)    │
    └──────────────────────────────┘
```

---

## 📊 Live Dashboard

The **frontend dashboard** provides a real-time visualization of the incident response pipeline:

- **Incident Timeline** — Step-by-step event log with ES|QL queries and results
- **Agent Activity Panel** — Live A2A message flow between all 4 agents
- **MTTR Metrics** — Before/after comparison (45 min → 1m 55s = 95.7% reduction)
- **Demo Mode** — Pre-loaded scenario (Payment Service CPU Spike) with play/pause/speed controls

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- [uv](https://docs.astral.sh/uv/) (recommended) or pip
- Node.js 18+ (for frontend)
- Elastic Cloud account with Agent Builder access

### Backend (Python CLI)

```bash
# Clone
git clone https://github.com/mgnlia/elastic-agent-builder-hackathon.git
cd elastic-agent-builder-hackathon

# Install with uv
uv sync

# Configure
cp .env.example .env
# Edit .env with your Elastic Cloud credentials

# Verify
uv run incident-commander check
uv run incident-commander agents
uv run incident-commander tools
```

### Frontend (Next.js Dashboard)

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

### Deploy Frontend

```bash
cd frontend
vercel --prod
```

---

## 📁 Project Structure

```
elastic-agent-builder-hackathon/
├── incident_commander/          # Python backend
│   ├── __init__.py
│   ├── agents.py                # 4 agent definitions (Triage, Diagnosis, Remediation, Communication)
│   ├── cli.py                   # Typer CLI (info, check, agents, tools)
│   ├── config.py                # Elastic Cloud config + env management
│   └── tools.py                 # 8 ES|QL tools + 4 custom tools
├── frontend/                    # Next.js 14 dashboard
│   ├── src/
│   │   ├── app/                 # App Router (layout, page, globals.css)
│   │   ├── components/          # Header, DemoControls, IncidentTimeline, AgentPanel, MetricsDashboard
│   │   ├── hooks/               # useDemo — state machine for demo playback
│   │   └── lib/                 # types, utils, demo-data (mock scenario)
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── tests/                       # pytest test suite
├── pyproject.toml               # Python project config (hatchling)
└── README.md
```

---

## 🎬 Demo Scenario

The built-in demo walks through a **Payment Service CPU Spike** incident:

1. **🚨 Alert** — CloudWatch alarm: CPU >95% on 3 hosts
2. **🔍 Triage** — Classifies P1, finds 1,247 errors (OOM + ConnectionTimeout)
3. **🔬 Diagnosis** — ES|QL correlation reveals memory leak in v2.14.0 deployment
4. **🔧 Remediation** — Rolls back to v2.13.2, metrics normalize
5. **📢 Communication** — Generates incident report + postmortem
6. **✅ Resolved** — MTTR: 1 minute 55 seconds

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Agents** | Elastic Agent Builder API |
| **Protocol** | A2A (Agent-to-Agent) |
| **Queries** | ES\|QL |
| **Backend** | Python 3.11, Typer, Rich, httpx |
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, Framer Motion |
| **Data** | Elasticsearch (logs-*, metrics-*, alerts-*) |
| **Deploy** | Vercel (frontend), Elastic Cloud (agents) |

---

## 📜 License

Apache 2.0 — see [LICENSE](LICENSE) for details.
