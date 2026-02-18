"""Configuration management for Elastic Agent Builder project."""

from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment / .env file."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Elastic Cloud
    elastic_cloud_id: str = ""
    elastic_api_key: str = ""

    # Kibana / Agent Builder API
    kibana_url: str = ""
    kibana_api_key: str = ""

    # LLM connector configured in Kibana
    llm_connector_id: str = ""

    # Agent Builder resources (populated after creation)
    agent_id: str = ""
    mcp_server_url: str = ""
    a2a_server_url: str = ""

    @property
    def kibana_headers(self) -> dict[str, str]:
        """Return standard headers for Kibana API requests."""
        return {
            "kbn-xsrf": "true",
            "Content-Type": "application/json",
            "Authorization": f"ApiKey {self.kibana_api_key}",
        }


settings = Settings()
