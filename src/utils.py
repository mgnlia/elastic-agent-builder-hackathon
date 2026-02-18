"""Shared utilities."""

from __future__ import annotations

import logging
import sys

from rich.console import Console
from rich.logging import RichHandler

console = Console()


def setup_logging(level: str = "INFO") -> logging.Logger:
    """Configure structured logging with Rich."""
    logging.basicConfig(
        level=level,
        format="%(message)s",
        datefmt="[%X]",
        handlers=[RichHandler(console=console, rich_tracebacks=True)],
    )
    logger = logging.getLogger("elastic-agent")
    return logger


def fatal(msg: str) -> None:
    """Print error and exit."""
    console.print(f"[bold red]ERROR:[/] {msg}", style="red")
    sys.exit(1)
