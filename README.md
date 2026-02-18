# 🚨 Elastic Incident Commander

> Multi-agent DevOps incident response system built with [Elastic Agent Builder](https://www.elastic.co/docs/explore-analyze/ai-features/elastic-agent-builder)

**Elasticsearch Agent Builder Hackathon** — [elasticsearch.devpost.com](https://elasticsearch.devpost.com/)

## The Problem

Production incidents cost engineering teams an average of **45 minutes** to resolve (MTTR). Most of that time is spent on manual triage, log correlation, and cross-team communication — not the actual fix.

## The Solution

Incident Commander deploys **4 specialized AI agents** that collaborate via the [A2A (Agent-to-Agent) protocol](https://www.elastic.co/search-labs/blog/agent-builder-a2a-strands-agents-guide) to resolve incidents in under **5 minutes**:

| Agent | Role | Tools |
|-------|------|-------|
| **🔍 Triage** | Classifies alerts, assigns severity, routes to specialists | ES\|QL (error spikes, service catalog, recent alerts) |
| **🔬 Diagnosis** | Correlates logs & metrics via ES\|QL to find root cause | ES\|QL (all 8 queries — errors, CPU, memory, latency, deployments, dependencies, throughput) |
| **🔧 Remediation** | Executes fixes — restart, scale, rollback, config update | Custom tools (4 webhook-based actions) |
| **📢 Communication** | Generates status updates, timelines, postmortems | ES\|QL (incident history search) |

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

# Show system info
uv run incident-commander info

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
│   ├── cli.py               # CLI entry point (info, check, agents, tools)
│   ├── config.py            # Configuration management (dotenv-based)
│   ├── elastic_client.py    # Elastic Agent Builder API client
│   └── tools.py             # Tool definitions — 8 ES|QL + 4 custom (12 total)
├── tests/
│   ├── test_agents.py       # Agent definition tests
│   ├── test_tools.py        # Tool definition tests
│   ├── test_config.py       # Configuration tests
│   └── test_cli.py          # CLI command tests
├── .github/workflows/ci.yml # CI: lint + test + import check
├── pyproject.toml           # Python project config (uv + hatchling)
├── .env.example             # Environment variable template
├── LICENSE                  # Apache 2.0
└── README.md
```

## Tools Reference

### ES|QL Tools (8)

| Tool | Description |
|------|-------------|
| `error_rate_spike` | Detect error-rate spikes across services (30 min window) |
| `cpu_anomaly` | Find hosts with CPU usage > 90% (1 hour window) |
| `log_correlation` | Correlate error/critical logs by service and error type |
| `service_latency` | Check service latency for SLA breaches (avg > 500ms or p99 > 2s) |
| `memory_pressure` | Detect hosts with memory usage > 90% (1 hour window) |
| `deployment_events` | List recent deployment events (2 hour window) |
| `dependency_errors` | Analyze downstream dependency errors for cascading failures |
| `throughput_drop` | Detect significant drops in request throughput |

### Custom Tools (4)

| Tool | Description |
|------|-------------|
| `restart_service` | Trigger a rolling restart for a service |
| `scale_service` | Trigger horizontal scaling (add replicas) |
| `rollback_deployment` | Roll back to previous stable deployment version |
| `update_config` | Apply a configuration change (feature flag, rate limit) |

## License

[Apache 2.0](LICENSE)
