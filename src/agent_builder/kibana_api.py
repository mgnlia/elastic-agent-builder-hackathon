"""Kibana Agent Builder API client.

Wraps the REST endpoints for managing agents, tools, and conversations
programmatically.

Reference:
  https://www.elastic.co/docs/explore-analyze/ai-features/agent-builder/programmatic-access
"""

from __future__ import annotations

from typing import Any

import httpx

from agent_builder.config import settings


class KibanaAgentAPI:
    """Thin wrapper around Agent Builder Kibana REST APIs."""

    def __init__(
        self,
        base_url: str | None = None,
        api_key: str | None = None,
    ) -> None:
        self.base_url = (base_url or settings.kibana_url).rstrip("/")
        self.api_key = api_key or settings.kibana_api_key
        self._headers = {
            "Authorization": f"ApiKey {self.api_key}",
            "kbn-xsrf": "true",
            "Content-Type": "application/json",
        }

    # ── Agents ────────────────────────────────────────────────────────

    async def list_agents(self) -> list[dict[str, Any]]:
        """List all custom agents."""
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"{self.base_url}/api/agent_builder/agents",
                headers=self._headers,
            )
            resp.raise_for_status()
            return resp.json()  # type: ignore[no-any-return]

    async def create_agent(self, agent_def: dict[str, Any]) -> dict[str, Any]:
        """Create a new custom agent.

        Args:
            agent_def: Agent definition including agent_id, display_name,
                        description, custom_instructions, and tools.
        """
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{self.base_url}/api/agent_builder/agents",
                headers=self._headers,
                json=agent_def,
            )
            resp.raise_for_status()
            return resp.json()  # type: ignore[no-any-return]

    async def get_agent(self, agent_id: str) -> dict[str, Any]:
        """Get a specific agent by ID."""
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"{self.base_url}/api/agent_builder/agents/{agent_id}",
                headers=self._headers,
            )
            resp.raise_for_status()
            return resp.json()  # type: ignore[no-any-return]

    # ── Tools ─────────────────────────────────────────────────────────

    async def list_tools(self) -> list[dict[str, Any]]:
        """List all tools (built-in + custom)."""
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"{self.base_url}/api/agent_builder/tools",
                headers=self._headers,
            )
            resp.raise_for_status()
            return resp.json()  # type: ignore[no-any-return]

    async def create_tool(self, tool_def: dict[str, Any]) -> dict[str, Any]:
        """Create a custom tool (ES|QL, Index Search, MCP, or Workflow)."""
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{self.base_url}/api/agent_builder/tools",
                headers=self._headers,
                json=tool_def,
            )
            resp.raise_for_status()
            return resp.json()  # type: ignore[no-any-return]

    # ── Conversations / Chat ──────────────────────────────────────────

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
                f"{self.base_url}/api/agent_builder/chat",
                headers=self._headers,
                json=payload,
            )
            resp.raise_for_status()
            return resp.json()  # type: ignore[no-any-return]
