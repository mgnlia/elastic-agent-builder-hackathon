# Elastic Agent Builder — Research Notes

> Compiled from official docs, blog series, and hackathon resources.

## What is Agent Builder?

Agent Builder is a native AI layer in Elasticsearch that provides a framework for building
context-driven AI agents. It integrates directly into the Elastic Stack — no external
orchestration frameworks needed.

**Key value prop:** Agents get the best possible context from Elasticsearch's search
capabilities (hybrid search, vector search, ES|QL analytics) and can take actions via
Elastic Workflows.

## Core Concepts

### Agents
- **Default Agent**: Built-in conversational agent in Kibana, works out of the box
- **Custom Agents**: Created via API with custom system prompts, tool sets, and model config
- **Built-in Agents**: Pre-configured agents for specific Elastic use cases

Agent lifecycle:
1. Interpret user input/objective
2. Select the right tool and arguments
3. Reason over tool response
4. Decide: return result or invoke another tool

### Tools (6 types)

1. **Built-in Tools**: Pre-packaged (get_indexes, get_mappings, etc.)
2. **Custom Tools**: Developer-defined tools with custom logic
3. **ES|QL Tools**: Execute ES|QL queries — great for analytics, aggregations, filtering
4. **Index Search Tools**: Search specific indices with configurable query fields
5. **MCP Tools**: Tools exposed via Model Context Protocol
6. **Workflow Tools**: Trigger Elastic Workflows for multi-step automation

### ES|QL (Elasticsearch Query Language)
- Piped query language: `FROM index | WHERE condition | STATS agg BY field`
- Great for structured analytics, aggregations, filtering
- Agents can generate ES|QL dynamically based on user questions
- Tools can have templated ES|QL with parameters

### Elastic Workflows
- Visual/declarative multi-step automation
- Triggers: manual, scheduled, alert-based
- Steps: Elasticsearch actions, Kibana actions, external HTTP, if/foreach/wait
- Agents can trigger workflows as tools → enables reliable multi-step actions

## Programmatic Access (3 channels)

### 1. Kibana REST API
- Direct HTTP API for CRUD on agents, tools, conversations
- Stateful conversations via `conversation_id`
- Auth: API key in `Authorization` header + `kbn-xsrf: true`

### 2. MCP Server (Model Context Protocol)
- Built-in MCP endpoint for each agent
- Allows external AI tools (Claude Desktop, Cursor, etc.) to use agent's tools
- Exposes tools as MCP-compatible tool definitions
- URL format: `{kibana_url}/api/ai_assistant/agents/{agent_id}/mcp`

### 3. A2A Server (Agent-to-Agent Protocol)
- Google's Agent-to-Agent protocol support
- Allows other agents to discover capabilities and send tasks
- Enables multi-agent architectures
- Agent card published at well-known endpoint

## Hackathon Requirements

### Must Have
- Multi-step AI agent using Agent Builder
- Combines reasoning model + one or more tools (Workflows, Search, ES|QL)
- Automates real-world tasks
- Public GitHub repo with OSI-approved license (Apache 2.0 ✓)

### Submission
- ~400 word description (problem, features used, likes/challenges)
- ~3 minute demo video
- Public code repository URL
- Bonus: social media post tagging @elastic_devs / @elastic

### Judging Criteria
- **Technical Execution (30%)**: Quality code, leverages Agent Builder + ES properly
- **Potential Impact & Wow Factor (30%)**: Useful, significant problem, novel/original
- **Demo (30%)**: Clear problem definition, effective presentation
- **Community (10%)**: Social sharing, documentation quality

### Prizes
- 1st: $10,000
- 2nd: $5,000
- 3rd: $3,000
- 4x Creative Awards: $500 each

### Timeline
- Deadline: Feb 27, 2026 @ 1:00pm EST
- Trial: 2 weeks, no extensions — time carefully!

## Key Resources
- [Agent Builder Docs](https://www.elastic.co/docs/explore-analyze/ai-features/elastic-agent-builder)
- [Blog Series: Context-Aware AI Agentic Workflows](https://www.elastic.co/search-labs/blog/series/context-aware-ai-agentic-workflows-with-elastic)
- [Elastic Workflows Docs](https://www.elastic.co/docs/explore-analyze/workflows)
- [Hackathon DevPost](https://elasticsearch.devpost.com/)
- [Example: A2A Agent Framework](https://github.com/elastic/elasticsearch-labs/tree/main/supporting-blog-content/agent-builder-a2a-agent-framework)
- [Example: IT Request Automation](https://github.com/elastic/elasticsearch-labs/tree/main/supporting-blog-content/building-actionable-ai-automating-it-requests-with-agent-builder-and-one-workflow)
- [Hackathon Slack: #hackathon-agent-builder](https://elasticstack.slack.com/)

## Strategic Observations

### High-scoring approaches (based on judging criteria):
1. **Tool-driven agents** that actively choose between ES|QL, search, and workflows
2. **Multi-agent setups** using A2A for plan-execute-verify patterns
3. **Domain-specific** agents solving a clear, real problem (not generic chatbots)
4. **Measurable impact** — quantify time saved, steps removed, errors reduced
5. **Workflow integration** — agents that take reliable actions, not just answer questions
6. **MCP exposure** — show the agent working from Claude/Cursor for extra wow factor

### What judges will look for:
- Does the agent actually DO something (not just chat)?
- Are multiple tools used intelligently?
- Is the code clean and well-documented?
- Is the demo compelling with a clear problem→solution narrative?
