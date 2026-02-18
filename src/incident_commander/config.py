"""Configuration management for Elastic Incident Commander."""

import os
from dataclasses import dataclass

from dotenv import load_dotenv

load_dotenv()


@dataclass
class ElasticConfig:
    """Elastic Cloud connection configuration."""

    cloud_id: str = os.getenv("ELASTIC_CLOUD_ID", "")
    api_key: str = os.getenv("ELASTIC_API_KEY", "")
    kibana_url: str = os.getenv("KIBANA_URL", "")
    kibana_api_key: str = os.getenv("KIBANA_API_KEY", "")

    @property
    def agent_builder_base_url(self) -> str:
        """Base URL for Agent Builder API endpoints."""
        return f"{self.kibana_url}/api/agent_builder"

    def validate(self) -> list[str]:
        """Return list of missing required config values."""
        missing = []
        if not self.cloud_id:
            missing.append("ELASTIC_CLOUD_ID")
        if not self.api_key:
            missing.append("ELASTIC_API_KEY")
        if not self.kibana_url:
            missing.append("KIBANA_URL")
        if not self.kibana_api_key:
            missing.append("KIBANA_API_KEY")
        return missing


config = ElasticConfig()
