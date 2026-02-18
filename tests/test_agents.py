"""Tests for agent definitions."""

from incident_commander.agents import (
    ALL_AGENTS,
    COMMUNICATION_AGENT,
    DIAGNOSIS_AGENT,
    REMEDIATION_AGENT,
    TRIAGE_AGENT,
    get_agent_by_id,
    get_all_agent_definitions,
)


def test_all_agents_count():
    """There should be exactly 4 agents."""
    assert len(ALL_AGENTS) == 4


def test_all_agents_are_dicts():
    for agent in ALL_AGENTS:
        assert isinstance(agent, dict)


def test_agent_ids_unique():
    ids = [a["agentId"] for a in ALL_AGENTS]
    assert len(ids) == len(set(ids))


def test_agent_names_unique():
    names = [a["displayName"] for a in ALL_AGENTS]
    assert len(names) == len(set(names))


def test_triage_agent_has_tools():
    assert len(TRIAGE_AGENT["tools"]) >= 1
    assert "incident_cmd.error_rate_spike" in TRIAGE_AGENT["tools"]


def test_diagnosis_agent_has_all_esql_tools():
    tools = DIAGNOSIS_AGENT["tools"]
    assert len(tools) == 8
    assert "incident_cmd.cpu_anomaly" in tools
    assert "incident_cmd.log_correlation" in tools


def test_remediation_agent_has_action_tools():
    tools = REMEDIATION_AGENT["tools"]
    assert "incident_cmd.restart_service" in tools
    assert "incident_cmd.rollback_deployment" in tools


def test_communication_agent_has_tools():
    assert len(COMMUNICATION_AGENT["tools"]) >= 1


def test_all_agents_have_instructions():
    for agent in ALL_AGENTS:
        assert agent["instructions"]
        assert len(agent["instructions"]) > 20


def test_all_agents_have_tools():
    for agent in ALL_AGENTS:
        assert len(agent["tools"]) >= 1


def test_get_agent_by_id_found():
    agent = get_agent_by_id("incident_cmd_triage")
    assert agent is not None
    assert agent["displayName"] == "Triage Agent"


def test_get_agent_by_id_not_found():
    assert get_agent_by_id("nonexistent") is None


def test_get_all_agent_definitions_returns_copy():
    defs = get_all_agent_definitions()
    assert len(defs) == 4
    assert defs is not ALL_AGENTS  # should be a copy
