"""Tests for tool definitions."""

from incident_commander.tools import (
    ALL_TOOLS,
    CUSTOM_TOOLS,
    ESQL_TOOLS,
    get_all_tool_definitions,
)


VALID_TOOL_TYPES = {"esql", "custom"}


def test_all_tools_count():
    """12 tools total: 8 ES|QL + 4 custom."""
    assert len(ALL_TOOLS) == 12


def test_esql_tools_count():
    assert len(ESQL_TOOLS) == 8


def test_custom_tools_count():
    assert len(CUSTOM_TOOLS) == 4


def test_all_tools_are_dicts():
    for tool in ALL_TOOLS:
        assert isinstance(tool, dict)


def test_tool_ids_unique():
    ids = [t["toolId"] for t in ALL_TOOLS]
    assert len(ids) == len(set(ids))


def test_tool_types_valid():
    for tool in ALL_TOOLS:
        assert tool["type"] in VALID_TOOL_TYPES, f"{tool['toolId']} has invalid type {tool['type']}"


def test_esql_tools_have_query():
    for tool in ESQL_TOOLS:
        assert tool["type"] == "esql"
        assert "esqlQuery" in tool["configuration"]
        assert len(tool["configuration"]["esqlQuery"]) > 10


def test_custom_tools_have_url():
    for tool in CUSTOM_TOOLS:
        assert tool["type"] == "custom"
        assert "url" in tool["configuration"]
        assert "method" in tool["configuration"]


def test_all_tools_have_descriptions():
    for tool in ALL_TOOLS:
        assert tool["description"]
        assert len(tool["description"]) > 10


def test_all_tool_ids_namespaced():
    for tool in ALL_TOOLS:
        assert tool["toolId"].startswith("incident_cmd.")


def test_get_all_tool_definitions_returns_copy():
    defs = get_all_tool_definitions()
    assert len(defs) == 12
    assert defs is not ALL_TOOLS  # should be a copy
