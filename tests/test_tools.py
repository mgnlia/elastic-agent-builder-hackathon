"""Tests for tool definitions."""

from incident_commander.tools import (
    ALL_TOOLS,
    ToolDefinition,
)


VALID_TOOL_TYPES = {"esql", "index_search", "workflow", "custom"}


def test_all_tools_count():
    assert len(ALL_TOOLS) == 9


def test_all_tools_are_definitions():
    for tool in ALL_TOOLS:
        assert isinstance(tool, ToolDefinition)


def test_tool_names_unique():
    names = [t.name for t in ALL_TOOLS]
    assert len(names) == len(set(names))


def test_tool_types_valid():
    for tool in ALL_TOOLS:
        assert tool.tool_type in VALID_TOOL_TYPES, f"{tool.name} has invalid type {tool.tool_type}"


def test_esql_tools_have_query():
    esql_tools = [t for t in ALL_TOOLS if t.tool_type == "esql"]
    assert len(esql_tools) == 3
    for tool in esql_tools:
        assert "query" in tool.config
        assert len(tool.config["query"]) > 10


def test_search_tools_have_index():
    search_tools = [t for t in ALL_TOOLS if t.tool_type == "index_search"]
    assert len(search_tools) == 3
    for tool in search_tools:
        assert "index" in tool.config
        assert "fields" in tool.config


def test_workflow_tools_have_workflow_id():
    wf_tools = [t for t in ALL_TOOLS if t.tool_type == "workflow"]
    assert len(wf_tools) == 3
    for tool in wf_tools:
        assert "workflow_id" in tool.config
        assert "params" in tool.config


def test_all_tools_have_descriptions():
    for tool in ALL_TOOLS:
        assert tool.description
        assert len(tool.description) > 10
