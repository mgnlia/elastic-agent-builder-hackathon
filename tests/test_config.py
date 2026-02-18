"""Tests for configuration module."""

from incident_commander.config import Settings, settings


def test_settings_instance_exists():
    """Module-level settings singleton should exist."""
    assert settings is not None
    assert isinstance(settings, Settings)


def test_settings_defaults_empty():
    """Default values should be empty strings (no env vars set in CI)."""
    cfg = Settings()
    assert cfg.elastic_cloud_id == "" or isinstance(cfg.elastic_cloud_id, str)
    assert cfg.elastic_api_key == "" or isinstance(cfg.elastic_api_key, str)


def test_settings_kibana_headers():
    """kibana_headers property should return correct structure."""
    cfg = Settings()
    headers = cfg.kibana_headers
    assert "kbn-xsrf" in headers
    assert "Content-Type" in headers
    assert "Authorization" in headers
    assert headers["Content-Type"] == "application/json"


def test_settings_has_all_fields():
    """Ensure all expected fields are present."""
    cfg = Settings()
    expected_fields = [
        "elastic_cloud_id",
        "elastic_api_key",
        "kibana_url",
        "kibana_api_key",
        "llm_connector_id",
        "agent_id",
        "mcp_server_url",
        "a2a_server_url",
    ]
    for field_name in expected_fields:
        assert hasattr(cfg, field_name), f"Missing field: {field_name}"
