"""CLI entry-point for the agent builder hackathon project."""

from __future__ import annotations

import typer
from rich.console import Console

app = typer.Typer(
    name="agent",
    help="Elastic Agent Builder Hackathon CLI",
    no_args_is_help=True,
)
console = Console()


@app.command()
def info() -> None:
    """Show project info and connection status."""
    from agent_builder.config import settings

    console.print("[bold]Elastic Agent Builder Hackathon[/bold]")
    console.print(f"  Elastic URL : {settings.elastic_url or settings.elastic_cloud_id or '(not set)'}")
    console.print(f"  Kibana URL  : {settings.kibana_url or '(not set)'}")
    console.print(f"  Log Level   : {settings.log_level}")


@app.command()
def health() -> None:
    """Check Elasticsearch cluster health."""
    from agent_builder.elastic_client import get_es_client

    try:
        es = get_es_client()
        health_resp = es.cluster.health()
        console.print(f"[green]Cluster:[/green] {health_resp['cluster_name']}")
        console.print(f"[green]Status:[/green]  {health_resp['status']}")
        console.print(f"[green]Nodes:[/green]   {health_resp['number_of_nodes']}")
    except Exception as exc:
        console.print(f"[red]Connection failed:[/red] {exc}")
        raise typer.Exit(code=1) from exc


if __name__ == "__main__":
    app()
