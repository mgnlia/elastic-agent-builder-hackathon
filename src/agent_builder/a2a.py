"""Agent-to-Agent (A2A) protocol helpers.

The A2A protocol enables agent-to-agent communication using a JSON-RPC
interface. Elastic Agent Builder exposes an A2A server endpoint that
external agents can call to delegate tasks.

Key concepts:
- tasks/send: Send a task to an Elastic agent
- tasks/get: Check task status
- tasks/cancel: Cancel a running task
- Agent Card: Discovery document describing agent capabilities
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

import httpx


@dataclass
class A2AMessage:
    """A message in the A2A protocol."""

    role: str  # "user" or "agent"
    parts: list[dict[str, Any]] = field(default_factory=list)

    @classmethod
    def text(cls, role: str, content: str) -> A2AMessage:
        return cls(role=role, parts=[{"type": "text", "text": content}])

    def to_dict(self) -> dict:
        return {"role": self.role, "parts": self.parts}


@dataclass
class A2ATask:
    """Represents an A2A task request."""

    task_id: str
    message: A2AMessage
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_send_payload(self) -> dict:
        return {
            "jsonrpc": "2.0",
            "method": "tasks/send",
            "params": {
                "id": self.task_id,
                "message": self.message.to_dict(),
                **self.metadata,
            },
            "id": 1,
        }


class A2AClient:
    """Client for interacting with Elastic Agent Builder's A2A server."""

    def __init__(self, a2a_url: str, api_key: str) -> None:
        self.a2a_url = a2a_url.rstrip("/")
        self._http = httpx.AsyncClient(
            headers={
                "Authorization": f"ApiKey {api_key}",
                "Content-Type": "application/json",
            },
            timeout=60.0,
        )

    async def get_agent_card(self) -> dict:
        """Fetch the A2A agent card (discovery document)."""
        resp = await self._http.get(f"{self.a2a_url}/.well-known/agent.json")
        resp.raise_for_status()
        return resp.json()

    async def send_task(self, task: A2ATask) -> dict:
        """Send a task to the agent."""
        resp = await self._http.post(self.a2a_url, json=task.to_send_payload())
        resp.raise_for_status()
        return resp.json()

    async def get_task(self, task_id: str) -> dict:
        """Get the status of a task."""
        payload = {
            "jsonrpc": "2.0",
            "method": "tasks/get",
            "params": {"id": task_id},
            "id": 2,
        }
        resp = await self._http.post(self.a2a_url, json=payload)
        resp.raise_for_status()
        return resp.json()

    async def cancel_task(self, task_id: str) -> dict:
        """Cancel a running task."""
        payload = {
            "jsonrpc": "2.0",
            "method": "tasks/cancel",
            "params": {"id": task_id},
            "id": 3,
        }
        resp = await self._http.post(self.a2a_url, json=payload)
        resp.raise_for_status()
        return resp.json()

    async def close(self) -> None:
        await self._http.aclose()
