"""Elastic Agent Builder API client."""

from __future__ import annotations

import httpx

from incident_commander.config import ElasticConfig, config as default_config


class AgentBuilderClient:
    """Client for Elastic Agent Builder Kibana APIs."""

    def __init__(self, cfg: ElasticConfig | None = None) -> None:
        self.cfg = cfg or default_config
        self._http = httpx.AsyncClient(
            base_url=self.cfg.agent_builder_base_url,
            headers={
                "Authorization": f"ApiKey {self.cfg.kibana_api_key}",
                "kbn-xsrf": "true",
                "Content-Type": "application/json",
            },
            timeout=30.0,
        )

    # ── Agents ──────────────────────────────────────────────────────────

    async def list_agents(self) -> list[dict]:
        resp = await self._http.get("/agents")
        resp.raise_for_status()
        return resp.json()

    async def create_agent(self, name: str, description: str, **kwargs) -> dict:
        payload = {"name": name, "description": description, **kwargs}
        resp = await self._http.post("/agents", json=payload)
        resp.raise_for_status()
        return resp.json()

    async def get_agent(self, agent_id: str) -> dict:
        resp = await self._http.get(f"/agents/{agent_id}")
        resp.raise_for_status()
        return resp.json()

    # ── Tools ───────────────────────────────────────────────────────────

    async def list_tools(self) -> list[dict]:
        resp = await self._http.get("/tools")
        resp.raise_for_status()
        return resp.json()

    async def create_tool(self, name: str, tool_type: str, **kwargs) -> dict:
        payload = {"name": name, "type": tool_type, **kwargs}
        resp = await self._http.post("/tools", json=payload)
        resp.raise_for_status()
        return resp.json()

    async def execute_tool(self, tool_id: str, params: dict | None = None) -> dict:
        resp = await self._http.post(f"/tools/{tool_id}/execute", json=params or {})
        resp.raise_for_status()
        return resp.json()

    # ── Conversations & Chat ────────────────────────────────────────────

    async def list_conversations(self) -> list[dict]:
        resp = await self._http.get("/conversations")
        resp.raise_for_status()
        return resp.json()

    async def send_message(self, conversation_id: str, message: str) -> dict:
        resp = await self._http.post(
            f"/conversations/{conversation_id}/messages",
            json={"message": message},
        )
        resp.raise_for_status()
        return resp.json()

    # ── A2A (Agent-to-Agent) ────────────────────────────────────────────

    async def send_a2a_task(self, task: dict) -> dict:
        resp = await self._http.post("/a2a", json=task)
        resp.raise_for_status()
        return resp.json()

    async def get_agent_card(self) -> dict:
        resp = await self._http.get("/a2a/agent-card")
        resp.raise_for_status()
        return resp.json()

    # ── Cleanup ─────────────────────────────────────────────────────────

    async def close(self) -> None:
        await self._http.aclose()
