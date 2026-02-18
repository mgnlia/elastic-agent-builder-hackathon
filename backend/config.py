"""Configuration management for the Incident Commander."""

import os
from dataclasses import dataclass, field
from dotenv import load_dotenv

load_dotenv()


@dataclass
class ElasticConfig:
    """Elastic Cloud connection settings."""

    es_url: str = field(default_factory=lambda: os.getenv("ES_URL", ""))
    kb_url: str = field(default_factory=lambda: os.getenv("KB_URL", ""))
    api_key: str = field(default_factory=lambda: os.getenv("ES_API_KEY", ""))

    def __post_init__(self):
        if not self.kb_url and self.es_url:
            self.kb_url = self.es_url.replace(".es.", ".kb.")

    @property
    def es_headers(self) -> dict:
        return {
            "Authorization": f"ApiKey {self.api_key}",
            "Content-Type": "application/json",
        }

    @property
    def kb_headers(self) -> dict:
        return {
            "Authorization": f"ApiKey {self.api_key}",
            "Content-Type": "application/json",
            "kbn-xsrf": "true",
            "elastic-api-version": "2023-10-31",
        }


@dataclass
class ServerConfig:
    """API server settings."""

    host: str = field(default_factory=lambda: os.getenv("API_HOST", "0.0.0.0"))
    port: int = field(default_factory=lambda: int(os.getenv("API_PORT", "8000")))
    frontend_url: str = field(
        default_factory=lambda: os.getenv("FRONTEND_URL", "http://localhost:3000")
    )


@dataclass
class Config:
    """Root configuration."""

    elastic: ElasticConfig = field(default_factory=ElasticConfig)
    server: ServerConfig = field(default_factory=ServerConfig)


config = Config()
