"""Configuration management for Elastic Incident Commander.

Uses python-dotenv (no pydantic-settings dependency).
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

from dotenv import load_dotenv

# Load .env from project root if present
_env_path = Path(__file__).resolve().parent.parent / ".env"
if _env_path.exists():
    load_dotenv(_env_path)


@dataclass
class Settings:
    """Application settings loaded from environment variables."""

    # Elastic Cloud
    elastic_cloud_id: str = field(default_factory=lambda: os.getenv("ELASTIC_CLOUD_ID", ""))
    elastic_api_key: str = field(default_factory=lambda: os.getenv("ELASTIC_API_KEY", ""))

    # Kibana / Agent Builder API
    kibana_url: str = field(default_factory=lambda: os.getenv("KIBANA_URL", ""))
    kibana_api_key: str = field(default_factory=lambda: os.getenv("KIBANA_API_KEY", ""))

    # LLM connector configured in Kibana
    llm_connector_id: str = field(default_factory=lambda: os.getenv("LLM_CONNECTOR_ID", ""))

    # Agent Builder resources (populated after creation)
    agent_id: str = field(default_factory=lambda: os.getenv("AGENT_ID", ""))
    mcp_server_url: str = field(default_factory=lambda: os.getenv("MCP_SERVER_URL", ""))
    a2a_server_url: str = field(default_factory=lambda: os.getenv("A2A_SERVER_URL", ""))

    @property
    def kibana_headers(self) -> dict[str, str]:
        """Return standard headers for Kibana API requests."""
        return {
            "kbn-xsrf": "true",
            "Content-Type": "application/json",
            "Authorization": f"ApiKey {self.kibana_api_key}",
        }


settings = Settings()
