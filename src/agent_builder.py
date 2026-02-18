"""Agent Builder API client — create agents, tools, and interact via chat.

Reference: https://www.elastic.co/docs/explore-analyze/ai-features/agent-builder
"""

from __future__ import annotations

from typing import Any

import httpx

from .config import settings


class AgentBuilderClient:
    """Thin wrapper around the Kibana Agent Builder REST APIs."""

    def __init__(self) -> None:
        self.base_url = settings.kibana_url.rstrip("/")
        self.headers = settings.kibana_headers

    # ── Agents ──────────────────────────────────────────────────────────

    async def list_agents(self) -> list[dict[str, Any]]:
        """List all agents."""
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"{self.base_url}/api/ai_assistant/agents",
                headers=self.headers,
            )
            resp.raise_for_status()
            return resp.json()

    async def create_agent(
        self,
        name: str,
        description: str,
        system_prompt: str,
        tools: list[str] | None = None,
        model_connector_id: str | None = None,
    ) -> dict[str, Any]:
        """Create a custom agent.

        Args:
            name: Agent display name.
            description: Short description of what the agent does.
            system_prompt: System-level instructions for the agent.
            tools: List of tool IDs the agent can invoke.
            model_connector_id: LLM connector ID (defaults to settings).
        """
        payload: dict[str, Any] = {
            "name": name,
            "description": description,
            "configuration": {
                "instructions": system_prompt,
                "tools": tools or [],
                "model": model_connector_id or settings.llm_connector_id,
            },
        }
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{self.base_url}/api/ai_assistant/agents",
                headers=self.headers,
                json=payload,
            )
            resp.raise_for_status()
            return resp.json()

    async def chat(
        self,
        agent_id: str,
        message: str,
        conversation_id: str | None = None,
    ) -> dict[str, Any]:
        """Send a message to an agent and get a response.

        Args:
            agent_id: The agent to chat with.
            message: User message text.
            conversation_id: Optional existing conversation to continue.
        """
        payload: dict[str, Any] = {
            "agent_id": agent_id,
            "message": message,
        }
        if conversation_id:
            payload["conversation_id"] = conversation_id

        async with httpx.AsyncClient(timeout=120) as client:
            resp = await client.post(
                f"{self.base_url}/api/ai_assistant/chat",
                headers=self.headers,
                json=payload,
            )
            resp.raise_for_status()
            return resp.json()

    # ── Tools ───────────────────────────────────────────────────────────

    async def create_esql_tool(
        self,
        name: str,
        description: str,
        esql_query: str,
    ) -> dict[str, Any]:
        """Register an ES|QL tool that agents can invoke.

        Args:
            name: Tool name (used as identifier).
            description: What the tool does (shown to the LLM).
            esql_query: The ES|QL query template.
        """
        payload: dict[str, Any] = {
            "name": name,
            "description": description,
            "type": "esql",
            "configuration": {
                "query": esql_query,
            },
        }
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{self.base_url}/api/ai_assistant/tools",
                headers=self.headers,
                json=payload,
            )
            resp.raise_for_status()
            return resp.json()

    async def create_index_search_tool(
        self,
        name: str,
        description: str,
        index: str,
        query_fields: list[str],
    ) -> dict[str, Any]:
        """Register an index search tool.

        Args:
            name: Tool name.
            description: What the tool does.
            index: Elasticsearch index to search.
            query_fields: Fields to search over.
        """
        payload: dict[str, Any] = {
            "name": name,
            "description": description,
            "type": "index_search",
            "configuration": {
                "index": index,
                "query_fields": query_fields,
            },
        }
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{self.base_url}/api/ai_assistant/tools",
                headers=self.headers,
                json=payload,
            )
            resp.raise_for_status()
            return resp.json()

    async def create_workflow_tool(
        self,
        name: str,
        description: str,
        workflow_id: str,
    ) -> dict[str, Any]:
        """Register a workflow tool that triggers an Elastic Workflow.

        Args:
            name: Tool name.
            description: What the tool does.
            workflow_id: ID of the Elastic Workflow to trigger.
        """
        payload: dict[str, Any] = {
            "name": name,
            "description": description,
            "type": "workflow",
            "configuration": {
                "workflow_id": workflow_id,
            },
        }
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{self.base_url}/api/ai_assistant/tools",
                headers=self.headers,
                json=payload,
            )
            resp.raise_for_status()
            return resp.json()

    # ── Programmatic Access ─────────────────────────────────────────────

    async def get_mcp_server_info(self, agent_id: str) -> dict[str, Any]:
        """Get MCP server endpoint info for an agent."""
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"{self.base_url}/api/ai_assistant/agents/{agent_id}/mcp",
                headers=self.headers,
            )
            resp.raise_for_status()
            return resp.json()

    async def get_a2a_server_info(self, agent_id: str) -> dict[str, Any]:
        """Get A2A server endpoint info for an agent."""
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"{self.base_url}/api/ai_assistant/agents/{agent_id}/a2a",
                headers=self.headers,
            )
            resp.raise_for_status()
            return resp.json()
