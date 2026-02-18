# Architecture

## Overview

This project builds a multi-step AI agent using **Elastic Agent Builder** that combines:

- **Custom Agents** — domain-specific reasoning with tailored system prompts
- **ES|QL Tools** — structured queries over Elasticsearch data
- **Index Search Tools** — semantic/hybrid search over document indices
- **Workflow Tools** — trigger Elastic Workflows for multi-step automation
- **MCP Server** — expose agent capabilities to external AI clients (Claude, Cursor, etc.)
- **A2A Protocol** — agent-to-agent communication for multi-agent orchestration

## Agent Builder Components

```
┌─────────────────────────────────────────────────┐
│                  External Clients                │
│         (Claude, Cursor, Custom Apps)            │
└──────────┬──────────────────┬───────────────────┘
           │ MCP              │ A2A
┌──────────▼──────────────────▼───────────────────┐
│              Elastic Agent Builder               │
│  ┌─────────────────────────────────────────────┐ │
│  │            Custom Agent(s)                  │ │
│  │  • System prompt / instructions             │ │
│  │  • Tool selection & reasoning               │ │
│  │  • Multi-step execution loop                │ │
│  └──────────┬──────────────────────────────────┘ │
│             │ invokes                            │
│  ┌──────────▼──────────────────────────────────┐ │
│  │              Tools                          │ │
│  │  ┌──────────┐ ┌──────────┐ ┌─────────────┐ │ │
│  │  │ ES|QL    │ │ Index    │ │ Workflow     │ │ │
│  │  │ Tools    │ │ Search   │ │ Tools        │ │ │
│  │  └────┬─────┘ └────┬─────┘ └──────┬──────┘ │ │
│  └───────┼─────────────┼──────────────┼────────┘ │
└──────────┼─────────────┼──────────────┼──────────┘
           │             │              │
┌──────────▼─────────────▼──────────────▼──────────┐
│              Elasticsearch (Serverless)           │
│  • Indices with domain data                      │
│  • Vector embeddings (semantic search)           │
│  • ES|QL query engine                            │
│  • Elastic Workflows                             │
└──────────────────────────────────────────────────┘
```

## Key Design Decisions

1. **Agent Builder Native** — all agent logic lives in Elastic's platform, not in external frameworks
2. **Tool-First** — agents are equipped with specific tools rather than relying on prompt engineering
3. **ES|QL for Precision** — structured queries for analytics and aggregations
4. **Hybrid Search** — combining keyword + semantic search for best retrieval
5. **Workflow Integration** — multi-step actions via Elastic Workflows for reliability

## Programmatic Access

### Kibana REST API
Direct API calls for agent management and chat interactions.

### MCP Server
Model Context Protocol endpoint — allows external AI tools (Claude Desktop, Cursor) to use agent tools.

### A2A Server
Agent-to-Agent protocol — enables other agents to discover and communicate with our agent.

## Data Flow

1. **Ingest** → Data loaded into Elasticsearch indices via bulk API
2. **Index** → Mappings configured for optimal search (semantic_text, keyword, etc.)
3. **Tool Registration** → ES|QL and search tools registered pointing to indices
4. **Agent Creation** → Custom agent created with tools and system prompt
5. **Interaction** → Users/agents interact via Chat UI, API, MCP, or A2A
