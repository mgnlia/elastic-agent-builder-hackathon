"""Model Context Protocol (MCP) helpers.

Elastic Agent Builder exposes an MCP server that external AI clients
(Claude, Cursor, etc.) can connect to. This module provides helpers
for both consuming the Elastic MCP server and creating custom MCP
tools that agents can use.

Key MCP operations:
- tools/list: Discover available tools
- tools/call: Execute a tool
- resources/list: List available data resources
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

import httpx


@dataclass
class MCPToolDefinition:
    """Definition of a custom MCP tool to register with Agent Builder."""

    name: str
    description: str
    input_schema: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "description": self.description,
            "inputSchema": self.input_schema,
        }


class MCPClient:
    """Client for interacting with Elastic Agent Builder's MCP server."""

    def __init__(self, mcp_url: str, api_key: str) -> None:
        self.mcp_url = mcp_url.rstrip("/")
        self._http = httpx.AsyncClient(
            headers={
                "Authorization": f"ApiKey {api_key}",
                "Content-Type": "application/json",
            },
            timeout=60.0,
        )
        self._request_id = 0

    def _next_id(self) -> int:
        self._request_id += 1
        return self._request_id

    async def list_tools(self) -> dict:
        """List tools exposed by the MCP server."""
        payload = {
            "jsonrpc": "2.0",
            "method": "tools/list",
            "id": self._next_id(),
        }
        resp = await self._http.post(self.mcp_url, json=payload)
        resp.raise_for_status()
        return resp.json()

    async def call_tool(self, name: str, arguments: dict[str, Any] | None = None) -> dict:
        """Call a tool on the MCP server."""
        payload = {
            "jsonrpc": "2.0",
            "method": "tools/call",
            "params": {
                "name": name,
                "arguments": arguments or {},
            },
            "id": self._next_id(),
        }
        resp = await self._http.post(self.mcp_url, json=payload)
        resp.raise_for_status()
        return resp.json()

    async def list_resources(self) -> dict:
        """List resources exposed by the MCP server."""
        payload = {
            "jsonrpc": "2.0",
            "method": "resources/list",
            "id": self._next_id(),
        }
        resp = await self._http.post(self.mcp_url, json=payload)
        resp.raise_for_status()
        return resp.json()

    async def close(self) -> None:
        await self._http.aclose()
