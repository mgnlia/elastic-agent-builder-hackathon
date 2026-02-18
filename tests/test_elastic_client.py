"""Tests for the Elastic Agent Builder API client."""

from incident_commander.config import Settings
from incident_commander.elastic_client import AgentBuilderClient


def test_client_instantiates_with_defaults():
    """Client should instantiate without errors using default settings."""
    client = AgentBuilderClient()
    assert client.cfg is not None


def test_client_instantiates_with_custom_settings():
    """Client should accept custom Settings."""
    cfg = Settings(
        kibana_url="https://test.kb.example.com",
        kibana_api_key="test-key-123",
    )
    client = AgentBuilderClient(cfg=cfg)
    assert client.cfg.kibana_url == "https://test.kb.example.com"
    assert client.cfg.kibana_api_key == "test-key-123"


def test_client_base_url():
    """Base URL should be derived from kibana_url."""
    cfg = Settings(kibana_url="https://test.kb.example.com")
    client = AgentBuilderClient(cfg=cfg)
    assert "test.kb.example.com" in str(client._http.base_url)
    assert "agent_builder" in str(client._http.base_url)


def test_client_headers():
    """Client should include required Kibana headers."""
    cfg = Settings(kibana_api_key="test-key-456")
    client = AgentBuilderClient(cfg=cfg)
    headers = dict(client._http.headers)
    assert "kbn-xsrf" in headers
    assert "content-type" in headers
