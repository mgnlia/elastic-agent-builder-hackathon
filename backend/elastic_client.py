"""Elastic Agent Builder API client.

Wraps the Kibana REST APIs for managing agents, tools, and conversations,
plus the Elasticsearch APIs for data ingestion and ES|QL queries.
"""

from __future__ import annotations

import httpx
import logging
from typing import Any

from backend.config import config

logger = logging.getLogger(__name__)

DEFAULT_TIMEOUT = 60.0


class ElasticClient:
    """Async client for Elastic Agent Builder + Elasticsearch APIs."""

    def __init__(self):
        self.es_url = config.elastic.es_url.rstrip("/")
        self.kb_url = config.elastic.kb_url.rstrip("/")
        self._client: httpx.AsyncClient | None = None

    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(timeout=DEFAULT_TIMEOUT)
        return self._client

    async def close(self):
        if self._client and not self._client.is_closed:
            await self._client.aclose()

    # ── Elasticsearch APIs ──────────────────────────────────────────

    async def es_request(
        self, method: str, path: str, json: Any = None, params: dict | None = None
    ) -> dict:
        client = await self._get_client()
        url = f"{self.es_url}/{path.lstrip('/')}"
        resp = await client.request(
            method, url, headers=config.elastic.es_headers, json=json, params=params
        )
        resp.raise_for_status()
        return resp.json()

    async def create_index(self, index: str, mappings: dict | None = None) -> dict:
        body = {}
        if mappings:
            body["mappings"] = mappings
        return await self.es_request("PUT", f"/{index}", json=body)

    async def bulk_index(self, index: str, documents: list[dict]) -> dict:
        lines = []
        for doc in documents:
            lines.append({"index": {"_index": index}})
            lines.append(doc)
        # Use ndjson format
        client = await self._get_client()
        url = f"{self.es_url}/_bulk"
        headers = {**config.elastic.es_headers, "Content-Type": "application/x-ndjson"}
        import json as json_mod

        body = "\n".join(json_mod.dumps(line) for line in lines) + "\n"
        resp = await client.post(url, headers=headers, content=body)
        resp.raise_for_status()
        return resp.json()

    async def run_esql(self, query: str, params: list[dict] | None = None) -> dict:
        body: dict[str, Any] = {"query": query}
        if params:
            body["params"] = params
        return await self.es_request("POST", "/_query", json=body)

    async def index_exists(self, index: str) -> bool:
        try:
            client = await self._get_client()
            resp = await client.head(
                f"{self.es_url}/{index}", headers=config.elastic.es_headers
            )
            return resp.status_code == 200
        except Exception:
            return False

    # ── Kibana Agent Builder APIs ───────────────────────────────────

    async def kb_request(
        self, method: str, path: str, json: Any = None, params: dict | None = None
    ) -> dict:
        client = await self._get_client()
        url = f"{self.kb_url}/{path.lstrip('/')}"
        resp = await client.request(
            method, url, headers=config.elastic.kb_headers, json=json, params=params
        )
        resp.raise_for_status()
        return resp.json()

    # ── Tool Management ─────────────────────────────────────────────

    async def list_tools(self) -> list[dict]:
        result = await self.kb_request("GET", "/api/agent_builder/tools")
        return result.get("tools", result) if isinstance(result, dict) else result

    async def create_tool(self, tool_config: dict) -> dict:
        return await self.kb_request("POST", "/api/agent_builder/tools", json=tool_config)

    async def get_tool(self, tool_id: str) -> dict:
        return await self.kb_request("GET", f"/api/agent_builder/tools/{tool_id}")

    async def delete_tool(self, tool_id: str) -> dict:
        return await self.kb_request("DELETE", f"/api/agent_builder/tools/{tool_id}")

    async def execute_tool(self, tool_id: str, params: dict) -> dict:
        return await self.kb_request(
            "POST", f"/api/agent_builder/tools/{tool_id}/_execute", json=params
        )

    # ── Agent Management ────────────────────────────────────────────

    async def list_agents(self) -> list[dict]:
        result = await self.kb_request("GET", "/api/agent_builder/agents")
        return result.get("agents", result) if isinstance(result, dict) else result

    async def create_agent(self, agent_config: dict) -> dict:
        return await self.kb_request("POST", "/api/agent_builder/agents", json=agent_config)

    async def get_agent(self, agent_id: str) -> dict:
        return await self.kb_request("GET", f"/api/agent_builder/agents/{agent_id}")

    async def update_agent(self, agent_id: str, agent_config: dict) -> dict:
        return await self.kb_request(
            "PUT", f"/api/agent_builder/agents/{agent_id}", json=agent_config
        )

    async def delete_agent(self, agent_id: str) -> dict:
        return await self.kb_request("DELETE", f"/api/agent_builder/agents/{agent_id}")

    # ── Chat / Conversation APIs ────────────────────────────────────

    async def send_chat(self, agent_id: str, message: str, conversation_id: str | None = None) -> dict:
        body: dict[str, Any] = {
            "agentId": agent_id,
            "message": message,
        }
        if conversation_id:
            body["conversationId"] = conversation_id
        return await self.kb_request("POST", "/api/agent_builder/chat", json=body)

    async def list_conversations(self) -> list[dict]:
        result = await self.kb_request("GET", "/api/agent_builder/conversations")
        return result.get("conversations", result) if isinstance(result, dict) else result

    async def get_conversation(self, conversation_id: str) -> dict:
        return await self.kb_request(
            "GET", f"/api/agent_builder/conversations/{conversation_id}"
        )

    # ── A2A Protocol ────────────────────────────────────────────────

    async def get_a2a_agent_card(self, agent_id: str) -> dict:
        return await self.kb_request(
            "GET", f"/api/agent_builder/a2a/{agent_id}/.well-known/agent.json"
        )

    async def send_a2a_task(self, agent_id: str, task_payload: dict) -> dict:
        return await self.kb_request(
            "POST", f"/api/agent_builder/a2a/{agent_id}", json=task_payload
        )


# Singleton
elastic_client = ElasticClient()
