"""Tests for configuration module."""

from incident_commander.config import ElasticConfig


def test_config_defaults():
    cfg = ElasticConfig(cloud_id="", api_key="", kibana_url="", kibana_api_key="")
    assert cfg.cloud_id == ""
    assert cfg.api_key == ""


def test_config_validate_all_missing():
    cfg = ElasticConfig(cloud_id="", api_key="", kibana_url="", kibana_api_key="")
    missing = cfg.validate()
    assert len(missing) == 4
    assert "ELASTIC_CLOUD_ID" in missing
    assert "ELASTIC_API_KEY" in missing


def test_config_validate_all_present():
    cfg = ElasticConfig(
        cloud_id="test:cloud:id",
        api_key="test-key",
        kibana_url="https://test.kb.elastic.co",
        kibana_api_key="test-kb-key",
    )
    assert cfg.validate() == []


def test_agent_builder_base_url():
    cfg = ElasticConfig(
        cloud_id="x",
        api_key="x",
        kibana_url="https://test.kb.elastic.co",
        kibana_api_key="x",
    )
    assert cfg.agent_builder_base_url == "https://test.kb.elastic.co/api/agent_builder"
