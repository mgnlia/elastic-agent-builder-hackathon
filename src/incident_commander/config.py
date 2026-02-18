"""Configuration management for Elastic Incident Commander."""

from __future__ import annotations

import os
from dataclasses import dataclass, field

from dotenv import load_dotenv

load_dotenv()


@dataclass
class Settings:
    """Elastic Cloud connection and agent configuration.

    All values default to environment variables, falling back to empty strings
    so the app can start without credentials (for testing / local dev).
    """

    elastic_cloud_id: str = field(default_factory=lambda: os.getenv("ELASTIC_CLOUD_ID", ""))
    elastic_api_key: str = field(default_factory=lambda: os.getenv("ELASTIC_API_KEY", ""))
    kibana_url: str = field(default_factory=lambda: os.getenv("KIBANA_URL", ""))
    kibana_api_key: str = field(default_factory=lambda: os.getenv("KIBANA_API_KEY", ""))
    llm_connector_id: str = field(default_factory=lambda: os.getenv("LLM_CONNECTOR_ID", ""))
    agent_id: str = field(default_factory=lambda: os.getenv("AGENT_ID", ""))
    mcp_server_url: str = field(default_factory=lambda: os.getenv("MCP_SERVER_URL", ""))
    a2a_server_url: str = field(default_factory=lambda: os.getenv("A2A_SERVER_URL", ""))

    @property
    def agent_builder_base_url(self) -> str:
        """Base URL for Agent Builder API endpoints."""
        return f"{self.kibana_url}/api/agent_builder"

    @property
    def kibana_headers(self) -> dict[str, str]:
        """Standard headers for Kibana API requests."""
        return {
            "Authorization": f"ApiKey {self.kibana_api_key}",
            "kbn-xsrf": "true",
            "Content-Type": "application/json",
        }

    def validate(self) -> list[str]:
        """Return list of missing required config values."""
        required = {
            "ELASTIC_CLOUD_ID": self.elastic_cloud_id,
            "ELASTIC_API_KEY": self.elastic_api_key,
            "KIBANA_URL": self.kibana_url,
            "KIBANA_API_KEY": self.kibana_api_key,
        }
        return [k for k, v in required.items() if not v]


# Module-level singleton
settings = Settings()
