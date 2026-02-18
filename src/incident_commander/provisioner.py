"""Provisioner — create agents and tools in Elastic Agent Builder.

Reads definitions from agents.py / tools.py and provisions them via the API.
Returns a mapping of names → IDs for the orchestrator.
"""

from __future__ import annotations

from typing import Any

from rich.console import Console

from incident_commander.agents import ALL_AGENTS, AgentDefinition
from incident_commander.elastic_client import AgentBuilderClient
from incident_commander.tools import ALL_TOOLS, ToolDefinition

console = Console()


async def provision_tools(client: AgentBuilderClient) -> dict[str, str]:
    """Create all tool definitions in Agent Builder.

    Returns:
        Mapping of tool name → Agent Builder tool ID.
    """
    tool_ids: dict[str, str] = {}

    # Check existing tools to avoid duplicates
    existing = await client.list_tools()
    existing_names = {t.get("name"): t.get("id") for t in existing}

    for tool_def in ALL_TOOLS:
        if tool_def.name in existing_names:
            tool_ids[tool_def.name] = existing_names[tool_def.name]
            console.print(f"  [dim]Tool '{tool_def.name}' already exists → {tool_ids[tool_def.name]}[/dim]")
            continue

        result = await client.create_tool(tool_def.to_api_payload())
        tool_id = result.get("id", result.get("_id", ""))
        tool_ids[tool_def.name] = tool_id
        console.print(f"  [green]✓ Created tool '{tool_def.name}' → {tool_id}[/green]")

    return tool_ids


async def provision_agents(
    client: AgentBuilderClient, tool_ids: dict[str, str]
) -> dict[str, str]:
    """Create all agent definitions in Agent Builder.

    Args:
        client: Agent Builder API client.
        tool_ids: Mapping of tool name → tool ID (from provision_tools).

    Returns:
        Mapping of agent role key → Agent Builder agent ID.
        Keys: "triage", "diagnosis", "remediation", "communication"
    """
    agent_ids: dict[str, str] = {}
    role_keys = ["triage", "diagnosis", "remediation", "communication"]

    # Check existing agents
    existing = await client.list_agents()
    existing_names = {a.get("name"): a.get("id") for a in existing}

    for agent_def, role_key in zip(ALL_AGENTS, role_keys):
        if agent_def.name in existing_names:
            agent_ids[role_key] = existing_names[agent_def.name]
            console.print(
                f"  [dim]Agent '{agent_def.name}' already exists → {agent_ids[role_key]}[/dim]"
            )
            continue

        payload = agent_def.to_api_payload(tool_ids=tool_ids)
        result = await client.create_agent(payload)
        agent_id = result.get("id", result.get("_id", ""))
        agent_ids[role_key] = agent_id
        console.print(f"  [green]✓ Created agent '{agent_def.name}' → {agent_id}[/green]")

    return agent_ids


async def provision_all(client: AgentBuilderClient) -> dict[str, str]:
    """Provision all tools and agents. Returns agent_ids mapping."""
    console.print("\n[bold]Provisioning tools...[/bold]")
    tool_ids = await provision_tools(client)

    console.print(f"\n[bold]Provisioning agents...[/bold]")
    agent_ids = await provision_agents(client, tool_ids)

    console.print(f"\n[bold green]✓ All resources provisioned[/bold green]")
    console.print(f"  Tools: {len(tool_ids)}")
    console.print(f"  Agents: {len(agent_ids)}")

    return agent_ids
