#!/usr/bin/env python3
"""Quick connectivity check for Elastic Cloud.

Usage:
    uv run python scripts/check_connection.py
"""

from __future__ import annotations

import sys

sys.path.insert(0, ".")

from src.elastic_client import check_connection
from src.utils import console, fatal, setup_logging

setup_logging()


def main() -> None:
    """Test Elasticsearch connectivity."""
    console.print("[bold cyan]Checking Elasticsearch connection...[/]")
    try:
        info = check_connection()
        console.print(f"[bold green]✓ Connected![/]")
        console.print(f"  Cluster: {info.get('cluster_name', 'N/A')}")
        console.print(f"  Version: {info.get('version', {}).get('number', 'N/A')}")
        console.print(f"  UUID:    {info.get('cluster_uuid', 'N/A')}")
    except Exception as e:
        fatal(f"Connection failed: {e}")


if __name__ == "__main__":
    main()
