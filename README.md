# 🚨 Elastic Incident Commander

> Multi-agent DevOps incident response system built with [Elastic Agent Builder](https://www.elastic.co/docs/explore-analyze/ai-features/elastic-agent-builder)

**Elasticsearch Agent Builder Hackathon** — [elasticsearch.devpost.com](https://elasticsearch.devpost.com/)

## The Problem

Production incidents cost engineering teams an average of **45 minutes** to resolve (MTTR). Most of that time is spent on manual triage, log correlation, and cross-team communication — not the actual fix.

## The Solution

Incident Commander deploys **4 specialized AI agents** that collaborate via the [A2A (Agent-to-Agent) protocol](https://www.elastic.co/search-labs/blog/agent-builder-a2a-strands-agents-guide) to resolve incidents in under **5 minutes**:

| Agent | Role | Tools |
|-------|------|-------|
| **🔍 Triage** | Classifies alerts, assigns severity, routes to specialists | ES\|QL (error spikes, log correlation, network errors) |
| **🔬 Diagnosis** | Correlates logs & metrics via ES\|QL to find root cause | ES\|QL (all 8 queries — errors, CPU, memory, latency, disk, deployments) |
| **🔧 Remediation** | Executes fixes — restart, scale, rollback, drain | Custom tools (4 webhook-based actions) |
| **📢 Communication** | Generates status updates, timelines, postmortems | ES\|QL (error spikes, log correlation) |

### Architecture

```
Alert → [Triage Agent] → severity + routing
              ↓
        [Diagnosis Agent] → root cause via ES|QL
              ↓
        [Remediation Agent] → automated fix via Custom Tools
              ↓
        [Communication Agent] → status update + postmortem
```

## Tech Stack

- **Elastic Cloud Serverless** — Data platform (logs, metrics, alerts)
- **Elastic Agent Builder** — Agent creation, tool binding, A2A orchestration
- **ES|QL** — 8 pre-written queries for log/metric correlation
- **Custom Tools** — 4 webhook-based remediation actions
- **Python + uv** — Orchestration layer & CLI
- **Next.js** — Incident dashboard (frontend)

## Quick Start

```bash
# Clone
git clone https://github.com/mgnlia/elastic-agent-builder-hackathon.git
cd elastic-agent-builder-hackathon

# Install dependencies (requires uv)
uv sync

# Configure
cp .env.example .env
# Edit .env with your Elastic Cloud credentials

# Verify setup
uv run incident-commander check

# List agents
uv run incident-commander agents

# List tools
uv run incident-commander tools

# Run tests
uv run pytest tests/ -v
```

## Project Structure

```
├── incident_commander/
│   ├── __init__.py          # Package init
│   ├── agents.py            # Agent definitions (Triage, Diagnosis, Remediation, Communication)
│   ├── cli.py               # CLI entry point (info, agents, tools, check)
│   ├── config.py            # Configuration management (dotenv-based)
│   ├── elastic_client.py    # Elasticsearch client wrapper
│   └── tools.py             # Tool definitions — 8 ES|QL + 4 custom (12 total)
├── tests/
│   ├── test_agents.py       # Agent definition tests
│   ├── test_tools.py        # Tool definition tests
│   ├── test_config.py       # Configuration tests
│   └── test_cli.py          # CLI command tests
├── .github/workflows/ci.yml # CI: lint + test + typecheck
├── pyproject.toml           # Python project config (uv + hatchling)
├── .env.example             # Environment variable template
├── LICENSE                  # Apache 2.0
└── README.md
```

## Tools Reference

### ES|QL Tools (8)

| Tool | Description |
|------|-------------|
| `error_rate_spike` | Detect error rate spikes across services (30 min window) |
| `cpu_anomaly` | Find hosts with CPU > 90% (15 min window) |
| `log_correlation` | Correlate error/critical logs by service and error type |
| `service_latency` | Identify services with avg latency > 500ms |
| `memory_pressure` | Detect hosts with memory > 85% |
| `disk_usage` | Find hosts with disk usage > 90% |
| `recent_deployments` | List deployment events (2 hour window) |
| `network_errors` | Detect connection timeouts, refused, DNS failures |

### Custom Tools (4)

| Tool | Description |
|------|-------------|
| `restart_service` | Restart a service on a given host |
| `scale_service` | Scale a service horizontally (add replicas) |
| `rollback_deployment` | Rollback to previous deployment version |
| `drain_node` | Drain a Kubernetes node |

## License

[Apache 2.0](LICENSE)
