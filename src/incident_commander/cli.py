"""CLI entry point for Elastic Incident Commander."""

from __future__ import annotations

import typer
from rich.console import Console
from rich.table import Table

from incident_commander.config import config

app = typer.Typer(name="incident-commander", help="DevOps Incident Commander — AI-powered incident response")
console = Console()


@app.command()
def check() -> None:
    """Verify Elastic Cloud connection and configuration."""
    missing = config.validate()
    if missing:
        console.print(f"[red]Missing config: {', '.join(missing)}[/red]")
        console.print("Copy .env.example to .env and fill in your Elastic Cloud credentials.")
        raise typer.Exit(1)
    console.print("[green]✓ Configuration valid[/green]")
    console.print(f"  Kibana URL: {config.kibana_url}")


@app.command()
def agents() -> None:
    """List configured Incident Commander agents."""
    from incident_commander.agents import ALL_AGENTS

    table = Table(title="Incident Commander Agents")
    table.add_column("Agent", style="cyan")
    table.add_column("Description", style="white")
    table.add_column("Tools", style="green")

    for agent in ALL_AGENTS:
        table.add_row(agent.name, agent.description, ", ".join(agent.tool_names))

    console.print(table)


@app.command()
def tools() -> None:
    """List all available tools."""
    from incident_commander.tools import ALL_TOOLS

    table = Table(title="Available Tools")
    table.add_column("Name", style="cyan")
    table.add_column("Type", style="yellow")
    table.add_column("Description", style="white")

    for tool in ALL_TOOLS:
        table.add_row(tool.name, tool.tool_type, tool.description)

    console.print(table)


if __name__ == "__main__":
    app()
