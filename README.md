# 🚨 Elastic Incident Commander

> Multi-agent DevOps incident response system built with [Elastic Agent Builder](https://www.elastic.co/docs/explore-analyze/ai-features/elastic-agent-builder)

**Elasticsearch Agent Builder Hackathon** — [elasticsearch.devpost.com](https://elasticsearch.devpost.com/)

## The Problem

Production incidents cost engineering teams an average of **45 minutes** to resolve (MTTR). Most of that time is spent on manual triage, log correlation, and cross-team communication — not the actual fix.

## The Solution

Incident Commander deploys **4 specialized AI agents** that collaborate via the [A2A (Agent-to-Agent) protocol](https://www.elastic.co/search-labs/blog/agent-builder-a2a-strands-agents-guide) to resolve incidents in under **5 minutes**:

| Agent | Role | Tools |
|-------|------|-------|
| **🔍 Triage** | Classifies alerts, assigns severity, routes to specialists | Search (service catalog, recent alerts) |
| **🔬 Diagnosis** | Correlates logs & metrics via ES|QL to find root cause | ES|QL queries (error correlation, metric anomaly, latency) |
| **🔧 Remediation** | Executes fixes — restart, scale, rollback | Workflows (restart, scale, rollback) |
| **📢 Communication** | Generates status updates, timelines, postmortems | Search (incident history) |

### Architecture

```
Alert → [Triage Agent] → severity + routing
              ↓
        [Diagnosis Agent] → root cause via ES|QL
              ↓
        [Remediation Agent] → automated fix via Workflows
              ↓
        [Communication Agent] → status update + postmortem
```

## Tech Stack

- **Elastic Cloud Serverless** — Data platform (logs, metrics, alerts)
- **Elastic Agent Builder** — Agent creation, tool binding, A2A orchestration
- **ES|QL** — Pre-written queries for log/metric correlation
- **Workflows** (Tech Preview) — Automated remediation chains
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
```

## Project Structure

```
├── src/incident_commander/
│   ├── __init__.py          # Package init
│   ├── agents.py            # Agent definitions (Triage, Diagnosis, Remediation, Communication)
│   ├── cli.py               # CLI entry point
│   ├── config.py            # Configuration management
│   ├── elastic_client.py    # Agent Builder API client
│   └── tools.py             # Tool definitions (ES|QL, Search, Workflows)
├── frontend/                # Next.js incident dashboard
├── pyproject.toml           # Python project config (uv)
├── LICENSE                  # Apache 2.0
└── README.md
```

## License

[Apache 2.0](LICENSE)
