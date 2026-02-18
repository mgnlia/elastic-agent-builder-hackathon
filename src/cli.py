"""CLI entry-point for the Elastic Agent Builder hackathon project."""

from __future__ import annotations

import logging

import typer
from rich.console import Console
from rich.logging import RichHandler
from rich.panel import Panel

from .config import get_settings
from .elastic_client import AgentBuilderClient

app = typer.Typer(
    name="elastic-agent",
    help="CLI for Elastic Agent Builder hackathon project.",
    no_args_is_help=True,
)
console = Console()


def _setup_logging(level: str = "INFO") -> None:
    logging.basicConfig(
        level=level,
        format="%(message)s",
        handlers=[RichHandler(rich_tracebacks=True)],
    )


def _client() -> AgentBuilderClient:
    settings = get_settings()
    _setup_logging(settings.log_level)
    return AgentBuilderClient(settings)


# ── Commands ────────────────────────────────────────────────────────────


@app.command()
def info() -> None:
    """Show connection info and available agents/tools."""
    client = _client()
    settings = get_settings()

    console.print(Panel.fit(
        f"[bold]Elasticsearch:[/] {settings.elasticsearch_url}\n"
        f"[bold]Kibana:[/] {settings.kibana_url}\n"
        f"[bold]A2A endpoint:[/] {client.a2a_url}\n"
        f"[bold]MCP endpoint:[/] {client.mcp_url}",
        title="Connection Info",
    ))

    try:
        agents = client.list_agents()
        console.print(f"\n[green]Agents ({len(agents)}):[/]")
        for a in agents:
            console.print(f"  • {a.get('id', 'unknown')} — {a.get('display_name', '')}")
    except Exception as exc:
        console.print(f"[red]Could not list agents:[/] {exc}")

    try:
        tools = client.list_tools()
        console.print(f"\n[green]Tools ({len(tools)}):[/]")
        for t in tools:
            console.print(f"  • {t.get('id', 'unknown')} ({t.get('type', '')}) — {t.get('description', '')[:80]}")
    except Exception as exc:
        console.print(f"[red]Could not list tools:[/] {exc}")

    client.close()


@app.command()
def chat(
    agent_id: str = typer.Option("default", help="Agent ID to converse with"),
    message: str = typer.Argument(..., help="Message to send"),
    conversation_id: str | None = typer.Option(None, "--conv", help="Existing conversation ID"),
) -> None:
    """Send a message to an Agent Builder agent."""
    client = _client()
    try:
        result = client.converse(agent_id, message, conversation_id)
        conv_id = result.get("conversation_id", "")
        reply = result.get("message", result.get("content", str(result)))
        console.print(Panel(str(reply), title=f"Agent: {agent_id} | conv: {conv_id}"))
    except Exception as exc:
        console.print(f"[red]Error:[/] {exc}")
    finally:
        client.close()


@app.command()
def list_agents() -> None:
    """List all configured agents."""
    client = _client()
    try:
        for a in client.list_agents():
            console.print(f"  {a.get('id')} — {a.get('display_name', '')}")
    except Exception as exc:
        console.print(f"[red]{exc}[/]")
    finally:
        client.close()


@app.command()
def list_tools() -> None:
    """List all configured tools."""
    client = _client()
    try:
        for t in client.list_tools():
            console.print(f"  {t.get('id')} ({t.get('type', '')}) — {t.get('description', '')[:100]}")
    except Exception as exc:
        console.print(f"[red]{exc}[/]")
    finally:
        client.close()


if __name__ == "__main__":
    app()
