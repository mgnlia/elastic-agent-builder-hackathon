"""CLI entry-point for the DevOps Incident Commander.

Usage:
    incident-commander --help
    incident-commander info
"""

from __future__ import annotations

import typer
from rich import print as rprint

from .agents import ALL_AGENTS
from .tools import ALL_TOOLS

app = typer.Typer(help="DevOps Incident Commander — Elastic Agent Builder hackathon entry")


@app.command()
def info() -> None:
    """Print summary of registered agents and tools."""
    rprint(f"[bold green]Incident Commander[/bold green] v0.1.0")
    rprint(f"  Agents: {len(ALL_AGENTS)}")
    rprint(f"  Tools:  {len(ALL_TOOLS)} (ES|QL + custom)")
    rprint()
    for agent in ALL_AGENTS:
        tool_count = len(agent.get("tools", []))
        rprint(f"  • [cyan]{agent['displayName']}[/cyan] — {tool_count} tools")


if __name__ == "__main__":
    app()
