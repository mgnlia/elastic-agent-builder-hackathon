"""Tests for configuration module."""

from src.config import Settings


def test_settings_defaults():
    """Settings should have safe defaults when env vars are missing."""
    s = Settings(
        _env_file=None,  # type: ignore[call-arg]
    )
    assert s.elastic_cloud_id == ""
    assert s.elastic_api_key == ""
    assert s.kibana_url == ""


def test_kibana_headers():
    """Headers should include auth and xsrf."""
    s = Settings(
        _env_file=None,  # type: ignore[call-arg]
        kibana_api_key="test-key-123",
    )
    headers = s.kibana_headers
    assert headers["kbn-xsrf"] == "true"
    assert "test-key-123" in headers["Authorization"]
