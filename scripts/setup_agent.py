#!/usr/bin/env python3
"""Setup script — creates the agent and tools in Elastic Agent Builder.

Usage:
    uv run python scripts/setup_agent.py
"""

from __future__ import annotations

import asyncio
import sys

sys.path.insert(0, ".")

from src.agent_builder import AgentBuilderClient
from src.utils import console, setup_logging

logger = setup_logging()


async def main() -> None:
    """Create the agent and register tools."""
    client = AgentBuilderClient()

    console.print("[bold cyan]Setting up Elastic Agent Builder...[/]")

    # TODO: Replace with actual agent configuration once concept is finalized
    # This is a placeholder that will be updated with the specific agent
    # design from the research/concept phase.

    console.print("[yellow]⚠ Agent configuration pending — waiting for concept brief.[/]")
    console.print()
    console.print("[dim]Available operations:[/]")
    console.print("  • create_agent — custom agent with system prompt + tools")
    console.print("  • create_esql_tool — ES|QL query tool")
    console.print("  • create_index_search_tool — index search tool")
    console.print("  • create_workflow_tool — workflow trigger tool")
    console.print("  • get_mcp_server_info — MCP endpoint for external clients")
    console.print("  • get_a2a_server_info — A2A endpoint for agent-to-agent")
    console.print()
    console.print("[bold green]Scaffold ready. Configure .env and run after concept is defined.[/]")


if __name__ == "__main__":
    asyncio.run(main())
