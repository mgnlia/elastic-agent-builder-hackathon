"""CLI entry-point for the DevOps Incident Commander.

Usage:
    incident-commander --help
    incident-commander info
    incident-commander agents
    incident-commander tools
    incident-commander check
"""

from __future__ import annotations

import typer
from rich import print as rprint
from rich.console import Console
from rich.table import Table

from .agents import ALL_AGENTS
from .config import settings
from .tools import ALL_TOOLS

app = typer.Typer(help="DevOps Incident Commander — Elastic Agent Builder hackathon entry")
console = Console()


@app.command()
def info() -> None:
    """Print summary of registered agents and tools."""
    rprint("[bold green]Incident Commander[/bold green] v0.1.0")
    rprint(f"  Agents: {len(ALL_AGENTS)}")
    rprint(f"  Tools:  {len(ALL_TOOLS)} (ES|QL + custom)")
    rprint()
    for agent in ALL_AGENTS:
        tool_count = len(agent.get("tools", []))
        rprint(f"  • [cyan]{agent['displayName']}[/cyan] — {tool_count} tools")


@app.command()
def agents() -> None:
    """List configured Incident Commander agents."""
    table = Table(title="Incident Commander Agents")
    table.add_column("Agent", style="cyan")
    table.add_column("Description", style="white")
    table.add_column("Tools", style="green")

    for agent in ALL_AGENTS:
        table.add_row(
            agent["displayName"],
            agent["displayDescription"],
            ", ".join(agent.get("tools", [])),
        )

    console.print(table)


@app.command()
def tools() -> None:
    """List all available tools."""
    table = Table(title="Available Tools")
    table.add_column("Tool ID", style="cyan")
    table.add_column("Type", style="yellow")
    table.add_column("Description", style="white")

    for tool in ALL_TOOLS:
        table.add_row(tool["toolId"], tool["type"], tool["description"])

    console.print(table)


@app.command()
def check() -> None:
    """Verify Elastic Cloud configuration."""
    missing: list[str] = []
    if not settings.elastic_cloud_id:
        missing.append("ELASTIC_CLOUD_ID")
    if not settings.elastic_api_key:
        missing.append("ELASTIC_API_KEY")
    if not settings.kibana_url:
        missing.append("KIBANA_URL")
    if not settings.kibana_api_key:
        missing.append("KIBANA_API_KEY")

    if missing:
        console.print(f"[red]Missing config: {', '.join(missing)}[/red]")
        console.print("Copy .env.example to .env and fill in your Elastic Cloud credentials.")
        raise typer.Exit(1)
    console.print("[green]✓ Configuration valid[/green]")
    console.print(f"  Kibana URL: {settings.kibana_url}")


if __name__ == "__main__":
    app()
