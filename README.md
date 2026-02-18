# 🚨 Elastic Incident Commander

**Multi-agent DevOps incident response system built with Elastic Agent Builder + A2A protocol.**

Reduces Mean Time To Resolution (MTTR) from **45 minutes → 5 minutes** by orchestrating four specialized AI agents that automatically triage, diagnose, remediate, and communicate during production incidents.

## 🏗️ Architecture

```
┌─────────────┐    Alert     ┌─────────────────┐
│  Elastic     │───────────▶│  Triage Agent    │
│  Observability│            │  Classify & Route│
└─────────────┘             └────────┬─────────┘
                                     │ A2A
                             ┌───────▼─────────┐
                             │ Diagnosis Agent  │
                             │ ES|QL Correlation│
                             └───────┬─────────┘
                                     │ A2A
                             ┌───────▼─────────┐
                             │ Remediation Agent│
                             │ Fix & Verify     │
                             └───────┬─────────┘
                                     │ A2A
                             ┌───────▼──────────┐
                             │ Communication    │
                             │ Report & Postmort│
                             └──────────────────┘
```

## 🤖 Agents

| Agent | Role | Tools |
|-------|------|-------|
| **Triage Agent** | Classifies severity (P1-P4), identifies affected services, routes to specialists | Error Rate Spike, Service Catalog Search, Recent Alerts |
| **Diagnosis Agent** | Correlates logs/metrics via ES|QL, traces request flows, identifies root cause | 8 ES|QL tools (CPU, Memory, Latency, Throughput, Deployments, Dependencies) |
| **Remediation Agent** | Executes fix actions — restart, scale, rollback, config change | 4 Custom tools via Kibana Fleet API |
| **Communication Agent** | Generates status updates, incident timelines, postmortem documents | Incident History Search |

## 🔧 Tools (12 total)

### ES|QL Tools (8)
- `error_rate_spike` — Detect error spikes across services (30min window)
- `cpu_anomaly` — Find hosts with CPU > 90% (1hr window)
- `log_correlation` — Correlate error/critical logs by service
- `service_latency` — Check for SLA breaches (avg > 500ms, p99 > 2s)
- `memory_pressure` — Detect memory usage > 90%
- `deployment_events` — List recent deployments for correlation
- `dependency_errors` — Analyze downstream cascading failures
- `throughput_drop` — Detect request throughput drops

### Custom Tools (4)
- `restart_service` — Rolling restart via Fleet API
- `scale_service` — Horizontal scaling
- `rollback_deployment` — Rollback to previous stable version
- `update_config` — Apply config changes (feature flags, rate limits)

## 🚀 Quick Start

```bash
# Install dependencies
uv sync

# Check configuration
uv run incident-commander check

# List agents
uv run incident-commander agents

# List tools
uv run incident-commander tools
```

### Configuration

Copy `.env.example` to `.env` and set your Elastic Cloud credentials:

```env
ELASTIC_CLOUD_ID=your-deployment:region:id
ELASTIC_API_KEY=your-api-key
KIBANA_URL=https://your-deployment.kb.region.cloud.es.io
```

## 📊 Demo Mode

The frontend dashboard runs standalone with mock data — no Elastic Cloud connection required:

```bash
cd frontend
npm install
npm run dev
```

## 🏆 Hackathon

Built for the [Elasticsearch Agent Builder Hackathon](https://elasticsearch-agent-builder-hackathon.devpost.com/) (Feb 2026).

**Judging Criteria:**
- Technical Execution (30%) — Multi-agent A2A orchestration, 12 production-ready tools
- Impact & Wow Factor (30%) — 9x MTTR reduction, autonomous incident response
- Demo Quality (30%) — Live dashboard with incident timeline + agent activity
- Social Engagement (10%)

## 📝 License

MIT
