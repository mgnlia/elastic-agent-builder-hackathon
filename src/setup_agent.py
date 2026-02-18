"""Programmatic setup: create tools + agent via Kibana API.

Run this once to provision the Agent Builder resources in your Elastic Cloud
Serverless project. Idempotent — safe to re-run (uses PUT).
"""

from __future__ import annotations

import logging

from rich.console import Console

from .config import get_settings
from .elastic_client import AgentBuilderClient

logger = logging.getLogger(__name__)
console = Console()


def setup_tools(client: AgentBuilderClient) -> list[str]:
    """Create the project's ES|QL and search tools. Returns list of tool IDs."""
    tool_ids: list[str] = []

    # ── Example ES|QL tool (placeholder — will be customized per concept) ───
    tool_id = "hackathon.sample_esql"
    client.create_tool(
        tool_id=tool_id,
        description="Sample ES|QL query tool — placeholder for hackathon concept.",
        tool_type="esql",
        esql="FROM sample-index | LIMIT 10",
    )
    tool_ids.append(tool_id)
    console.print(f"  [green]✓[/] Tool: {tool_id}")

    return tool_ids


def setup_agent(client: AgentBuilderClient, tool_ids: list[str]) -> str:
    """Create the hackathon's custom agent. Returns agent ID."""
    agent_id = "hackathon_agent"
    client.create_agent(
        agent_id=agent_id,
        display_name="Hackathon Agent",
        instructions=(
            "You are an intelligent assistant built for the Elasticsearch Agent Builder Hackathon. "
            "Use the tools available to you to answer user questions by querying Elasticsearch data. "
            "Always explain your reasoning and which tools you used."
        ),
        tool_ids=tool_ids,
        description="Multi-step AI agent for the Elasticsearch Agent Builder Hackathon.",
    )
    console.print(f"  [green]✓[/] Agent: {agent_id}")
    return agent_id


def main() -> None:
    """Run full setup."""
    settings = get_settings()
    client = AgentBuilderClient(settings)

    console.print("\n[bold]Setting up Agent Builder resources...[/]\n")

    try:
        tool_ids = setup_tools(client)
        agent_id = setup_agent(client, tool_ids)
        console.print(f"\n[bold green]Done![/] Agent '{agent_id}' ready with {len(tool_ids)} tools.")
        console.print(f"  Chat via API: POST {client.kibana_url}/api/agent_builder/chat/{agent_id}")
        console.print(f"  A2A endpoint: {client.a2a_url}")
        console.print(f"  MCP endpoint: {client.mcp_url}")
    finally:
        client.close()


if __name__ == "__main__":
    main()
