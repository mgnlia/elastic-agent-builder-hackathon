"""Tests for the AgentBuilderClient (unit-level, no live Elastic needed)."""

from __future__ import annotations

from unittest.mock import MagicMock, patch

import pytest

from src.config import Settings
from src.elastic_client import AgentBuilderClient


@pytest.fixture
def mock_settings() -> Settings:
    return Settings(
        elasticsearch_url="https://test.es.example.com:443",
        elastic_api_key="fake-key",
    )  # type: ignore[call-arg]


@pytest.fixture
def client(mock_settings: Settings) -> AgentBuilderClient:
    return AgentBuilderClient(mock_settings)


def test_a2a_url(client: AgentBuilderClient):
    assert client.a2a_url.endswith("/api/agent_builder/a2a")


def test_mcp_url(client: AgentBuilderClient):
    assert client.mcp_url.endswith("/api/agent_builder/mcp")


def test_kibana_url_derived(client: AgentBuilderClient):
    assert ".kb." in client.kibana_url
