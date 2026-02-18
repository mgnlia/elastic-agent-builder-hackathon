"""Tests for agent definitions."""

from incident_commander.agents import (
    ALL_AGENTS,
    COMMUNICATION_AGENT,
    DIAGNOSIS_AGENT,
    REMEDIATION_AGENT,
    TRIAGE_AGENT,
    AgentDefinition,
)


def test_all_agents_count():
    assert len(ALL_AGENTS) == 4


def test_all_agents_are_definitions():
    for agent in ALL_AGENTS:
        assert isinstance(agent, AgentDefinition)


def test_agent_names_unique():
    names = [a.name for a in ALL_AGENTS]
    assert len(names) == len(set(names))


def test_triage_agent_has_search_tools():
    assert "search_service_catalog" in TRIAGE_AGENT.tool_names
    assert "search_recent_alerts" in TRIAGE_AGENT.tool_names


def test_diagnosis_agent_has_esql_tools():
    for tool in DIAGNOSIS_AGENT.tool_names:
        assert tool.startswith("esql_")


def test_remediation_agent_has_workflow_tools():
    for tool in REMEDIATION_AGENT.tool_names:
        assert tool.startswith("workflow_")


def test_communication_agent_has_search_tools():
    assert "search_incident_history" in COMMUNICATION_AGENT.tool_names


def test_all_agents_have_system_prompts():
    for agent in ALL_AGENTS:
        assert agent.system_prompt
        assert len(agent.system_prompt) > 20


def test_all_agents_have_tools():
    for agent in ALL_AGENTS:
        assert len(agent.tool_names) >= 1
