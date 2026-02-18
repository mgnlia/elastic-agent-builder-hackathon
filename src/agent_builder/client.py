"""Elasticsearch and Kibana Agent Builder client wrappers."""

from __future__ import annotations

import httpx
from elasticsearch import Elasticsearch

from agent_builder.config import settings


def get_es_client() -> Elasticsearch:
    """Create an Elasticsearch client from environment settings."""
    if not settings.is_configured:
        raise RuntimeError(
            "Elastic Cloud credentials not configured. "
            "Set ELASTIC_CLOUD_ID and ELASTIC_API_KEY in .env"
        )
    return Elasticsearch(
        cloud_id=settings.elastic_cloud_id,
        api_key=settings.elastic_api_key,
    )


class AgentBuilderClient:
    """HTTP client for Kibana Agent Builder APIs.

    Wraps the Kibana REST APIs for:
    - Creating/managing custom agents
    - Creating/managing tools (ES|QL, index search, MCP, workflow)
    - Querying agents (chat)
    - Accessing A2A and MCP server endpoints
    """

    def __init__(self, kibana_url: str | None = None, api_key: str | None = None) -> None:
        self.kibana_url = (kibana_url or settings.kibana_url).rstrip("/")
        self.api_key = api_key or settings.elastic_api_key
        self._http = httpx.AsyncClient(
            base_url=self.kibana_url,
            headers={
                "Authorization": f"ApiKey {self.api_key}",
                "Content-Type": "application/json",
                "kbn-xsrf": "true",
            },
            timeout=60.0,
        )

    # ── Agent CRUD ──────────────────────────────────────────────

    async def list_agents(self) -> dict:
        """List all custom agents."""
        resp = await self._http.get("/api/agent_builder/agents")
        resp.raise_for_status()
        return resp.json()

    async def create_agent(
        self,
        name: str,
        description: str,
        instructions: str,
        tools: list[str] | None = None,
        model: str | None = None,
    ) -> dict:
        """Create a custom agent via Kibana API."""
        payload: dict = {
            "name": name,
            "description": description,
            "configuration": {
                "instructions": instructions,
            },
        }
        if tools:
            payload["configuration"]["tools"] = tools
        if model:
            payload["configuration"]["model"] = model
        resp = await self._http.post("/api/agent_builder/agents", json=payload)
        resp.raise_for_status()
        return resp.json()

    async def get_agent(self, agent_id: str) -> dict:
        """Get agent details."""
        resp = await self._http.get(f"/api/agent_builder/agents/{agent_id}")
        resp.raise_for_status()
        return resp.json()

    async def delete_agent(self, agent_id: str) -> None:
        """Delete an agent."""
        resp = await self._http.delete(f"/api/agent_builder/agents/{agent_id}")
        resp.raise_for_status()

    # ── Chat / Query ────────────────────────────────────────────

    async def chat(
        self,
        message: str,
        agent_id: str | None = None,
        conversation_id: str | None = None,
    ) -> dict:
        """Send a message to an agent and get a response."""
        payload: dict = {"message": message}
        if agent_id:
            payload["agent_id"] = agent_id
        if conversation_id:
            payload["conversation_id"] = conversation_id
        resp = await self._http.post("/api/agent_builder/chat", json=payload)
        resp.raise_for_status()
        return resp.json()

    # ── Tool CRUD ───────────────────────────────────────────────

    async def list_tools(self) -> dict:
        """List all custom tools."""
        resp = await self._http.get("/api/agent_builder/tools")
        resp.raise_for_status()
        return resp.json()

    async def create_esql_tool(
        self,
        name: str,
        description: str,
        esql_query: str,
        parameters: list[dict] | None = None,
    ) -> dict:
        """Create an ES|QL tool."""
        payload: dict = {
            "name": name,
            "description": description,
            "type": "esql",
            "configuration": {
                "query": esql_query,
            },
        }
        if parameters:
            payload["configuration"]["parameters"] = parameters
        resp = await self._http.post("/api/agent_builder/tools", json=payload)
        resp.raise_for_status()
        return resp.json()

    async def create_index_search_tool(
        self,
        name: str,
        description: str,
        index_pattern: str,
    ) -> dict:
        """Create an index search tool."""
        payload = {
            "name": name,
            "description": description,
            "type": "index_search",
            "configuration": {
                "index_pattern": index_pattern,
            },
        }
        resp = await self._http.post("/api/agent_builder/tools", json=payload)
        resp.raise_for_status()
        return resp.json()

    async def create_workflow_tool(
        self,
        name: str,
        description: str,
        workflow_id: str,
    ) -> dict:
        """Create a workflow tool that triggers an Elastic Workflow."""
        payload = {
            "name": name,
            "description": description,
            "type": "workflow",
            "configuration": {
                "workflow_id": workflow_id,
            },
        }
        resp = await self._http.post("/api/agent_builder/tools", json=payload)
        resp.raise_for_status()
        return resp.json()

    async def create_mcp_tool(
        self,
        name: str,
        description: str,
        mcp_server_url: str,
    ) -> dict:
        """Create an MCP tool connecting to an external MCP server."""
        payload = {
            "name": name,
            "description": description,
            "type": "mcp",
            "configuration": {
                "url": mcp_server_url,
            },
        }
        resp = await self._http.post("/api/agent_builder/tools", json=payload)
        resp.raise_for_status()
        return resp.json()

    # ── A2A ─────────────────────────────────────────────────────

    async def a2a_send_task(
        self,
        agent_id: str,
        message: str,
    ) -> dict:
        """Send a task to an agent via A2A protocol."""
        a2a_url = settings.agent_builder_a2a_url or f"{self.kibana_url}/api/agent_builder/a2a"
        payload = {
            "jsonrpc": "2.0",
            "method": "tasks/send",
            "params": {
                "id": agent_id,
                "message": {
                    "role": "user",
                    "parts": [{"type": "text", "text": message}],
                },
            },
        }
        resp = await self._http.post(a2a_url, json=payload)
        resp.raise_for_status()
        return resp.json()

    # ── MCP ─────────────────────────────────────────────────────

    async def mcp_list_tools(self) -> dict:
        """List tools exposed by the Agent Builder MCP server."""
        mcp_url = settings.agent_builder_mcp_url or f"{self.kibana_url}/api/agent_builder/mcp"
        payload = {
            "jsonrpc": "2.0",
            "method": "tools/list",
            "id": 1,
        }
        resp = await self._http.post(mcp_url, json=payload)
        resp.raise_for_status()
        return resp.json()

    async def mcp_call_tool(self, tool_name: str, arguments: dict) -> dict:
        """Call a tool via the Agent Builder MCP server."""
        mcp_url = settings.agent_builder_mcp_url or f"{self.kibana_url}/api/agent_builder/mcp"
        payload = {
            "jsonrpc": "2.0",
            "method": "tools/call",
            "params": {
                "name": tool_name,
                "arguments": arguments,
            },
            "id": 2,
        }
        resp = await self._http.post(mcp_url, json=payload)
        resp.raise_for_status()
        return resp.json()

    async def close(self) -> None:
        """Close the HTTP client."""
        await self._http.aclose()
