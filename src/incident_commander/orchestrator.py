"""Incident Commander orchestrator — A2A multi-agent pipeline.

Implements the core incident response flow:
  Alert → Triage → Diagnosis → Remediation → Communication
"""

from __future__ import annotations

import asyncio
import json
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Any

from rich.console import Console

from incident_commander.elastic_client import AgentBuilderClient

console = Console()


class Severity(str, Enum):
    """Incident severity levels."""

    P1_CRITICAL = "P1-Critical"
    P2_HIGH = "P2-High"
    P3_MEDIUM = "P3-Medium"
    P4_LOW = "P4-Low"


class IncidentPhase(str, Enum):
    """Incident lifecycle phases."""

    ALERT_RECEIVED = "alert_received"
    TRIAGE = "triage"
    DIAGNOSIS = "diagnosis"
    REMEDIATION = "remediation"
    COMMUNICATION = "communication"
    RESOLVED = "resolved"


@dataclass
class IncidentEvent:
    """A single event in the incident timeline."""

    timestamp: str
    phase: IncidentPhase
    agent: str
    summary: str
    details: dict[str, Any] = field(default_factory=dict)


@dataclass
class Incident:
    """Tracks the full lifecycle of an incident."""

    id: str
    title: str
    alert_payload: dict[str, Any]
    severity: Severity | None = None
    phase: IncidentPhase = IncidentPhase.ALERT_RECEIVED
    timeline: list[IncidentEvent] = field(default_factory=list)
    root_cause: str = ""
    remediation_action: str = ""
    postmortem: str = ""
    started_at: str = field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
    resolved_at: str | None = None

    def add_event(self, phase: IncidentPhase, agent: str, summary: str, **details: Any) -> None:
        """Record a timeline event."""
        self.timeline.append(
            IncidentEvent(
                timestamp=datetime.now(timezone.utc).isoformat(),
                phase=phase,
                agent=agent,
                summary=summary,
                details=details,
            )
        )
        self.phase = phase

    @property
    def mttr_seconds(self) -> float | None:
        """Mean Time To Resolution in seconds, or None if unresolved."""
        if not self.resolved_at:
            return None
        start = datetime.fromisoformat(self.started_at)
        end = datetime.fromisoformat(self.resolved_at)
        return (end - start).total_seconds()

    def to_dict(self) -> dict[str, Any]:
        """Serialize incident to dict."""
        return {
            "id": self.id,
            "title": self.title,
            "severity": self.severity.value if self.severity else None,
            "phase": self.phase.value,
            "root_cause": self.root_cause,
            "remediation_action": self.remediation_action,
            "mttr_seconds": self.mttr_seconds,
            "started_at": self.started_at,
            "resolved_at": self.resolved_at,
            "timeline": [
                {
                    "timestamp": e.timestamp,
                    "phase": e.phase.value,
                    "agent": e.agent,
                    "summary": e.summary,
                }
                for e in self.timeline
            ],
        }


class IncidentOrchestrator:
    """Orchestrates the multi-agent incident response pipeline.

    Uses A2A protocol to route tasks between agents:
      Triage → Diagnosis → Remediation → Communication
    """

    def __init__(self, client: AgentBuilderClient, agent_ids: dict[str, str]) -> None:
        """Initialize orchestrator.

        Args:
            client: Agent Builder API client.
            agent_ids: Mapping of agent name → Agent Builder agent ID.
                       Expected keys: "triage", "diagnosis", "remediation", "communication"
        """
        self.client = client
        self.agent_ids = agent_ids

    async def handle_alert(self, alert: dict[str, Any]) -> Incident:
        """Process an alert through the full incident pipeline.

        Args:
            alert: Raw alert payload (from Elastic alerting or external source).

        Returns:
            Completed Incident with full timeline.
        """
        incident_id = f"INC-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}"
        title = alert.get("title", alert.get("alert.name", "Unknown Alert"))

        incident = Incident(id=incident_id, title=title, alert_payload=alert)
        incident.add_event(
            IncidentPhase.ALERT_RECEIVED,
            "system",
            f"Alert received: {title}",
        )

        console.print(f"\n[bold red]🚨 {incident_id}: {title}[/bold red]")

        # Phase 1: Triage
        triage_result = await self._run_triage(incident)

        # Phase 2: Diagnosis
        diagnosis_result = await self._run_diagnosis(incident, triage_result)

        # Phase 3: Remediation
        remediation_result = await self._run_remediation(incident, diagnosis_result)

        # Phase 4: Communication
        await self._run_communication(incident, remediation_result)

        # Mark resolved
        incident.resolved_at = datetime.now(timezone.utc).isoformat()
        incident.phase = IncidentPhase.RESOLVED
        console.print(
            f"\n[bold green]✅ {incident_id} resolved in "
            f"{incident.mttr_seconds:.0f}s[/bold green]"
        )

        return incident

    async def _run_triage(self, incident: Incident) -> dict[str, Any]:
        """Route alert to Triage Agent for classification."""
        console.print("[cyan]→ Triage Agent: classifying...[/cyan]")

        task_payload = {
            "jsonrpc": "2.0",
            "method": "tasks/send",
            "params": {
                "id": f"{incident.id}-triage",
                "message": {
                    "role": "user",
                    "parts": [
                        {
                            "type": "text",
                            "text": (
                                f"Classify this alert and identify affected services:\n"
                                f"{json.dumps(incident.alert_payload, indent=2)}"
                            ),
                        }
                    ],
                },
            },
        }

        result = await self.client.send_a2a_task(task_payload)

        # Extract severity from response
        severity_str = _extract_field(result, "severity", "P3-Medium")
        try:
            incident.severity = Severity(severity_str)
        except ValueError:
            incident.severity = Severity.P3_MEDIUM

        incident.add_event(
            IncidentPhase.TRIAGE,
            "Triage Agent",
            f"Classified as {incident.severity.value}",
            result=result,
        )

        console.print(f"  [yellow]Severity: {incident.severity.value}[/yellow]")
        return result

    async def _run_diagnosis(
        self, incident: Incident, triage_result: dict[str, Any]
    ) -> dict[str, Any]:
        """Route triage summary to Diagnosis Agent for root cause analysis."""
        console.print("[cyan]→ Diagnosis Agent: correlating logs/metrics...[/cyan]")

        task_payload = {
            "jsonrpc": "2.0",
            "method": "tasks/send",
            "params": {
                "id": f"{incident.id}-diagnosis",
                "message": {
                    "role": "user",
                    "parts": [
                        {
                            "type": "text",
                            "text": (
                                f"Incident {incident.id} ({incident.severity.value if incident.severity else 'unknown'}).\n"
                                f"Triage summary: {json.dumps(triage_result, default=str)}\n"
                                "Run ES|QL queries to identify root cause."
                            ),
                        }
                    ],
                },
            },
        }

        result = await self.client.send_a2a_task(task_payload)
        incident.root_cause = _extract_field(result, "root_cause", "Under investigation")

        incident.add_event(
            IncidentPhase.DIAGNOSIS,
            "Diagnosis Agent",
            f"Root cause: {incident.root_cause}",
            result=result,
        )

        console.print(f"  [magenta]Root cause: {incident.root_cause}[/magenta]")
        return result

    async def _run_remediation(
        self, incident: Incident, diagnosis_result: dict[str, Any]
    ) -> dict[str, Any]:
        """Route diagnosis to Remediation Agent for automated fix."""
        console.print("[cyan]→ Remediation Agent: executing fix...[/cyan]")

        task_payload = {
            "jsonrpc": "2.0",
            "method": "tasks/send",
            "params": {
                "id": f"{incident.id}-remediation",
                "message": {
                    "role": "user",
                    "parts": [
                        {
                            "type": "text",
                            "text": (
                                f"Incident {incident.id}: root cause is '{incident.root_cause}'.\n"
                                f"Diagnosis details: {json.dumps(diagnosis_result, default=str)}\n"
                                "Select and execute the appropriate remediation action."
                            ),
                        }
                    ],
                },
            },
        }

        result = await self.client.send_a2a_task(task_payload)
        incident.remediation_action = _extract_field(result, "action", "Manual review required")

        incident.add_event(
            IncidentPhase.REMEDIATION,
            "Remediation Agent",
            f"Action: {incident.remediation_action}",
            result=result,
        )

        console.print(f"  [green]Action: {incident.remediation_action}[/green]")
        return result

    async def _run_communication(
        self, incident: Incident, remediation_result: dict[str, Any]
    ) -> dict[str, Any]:
        """Route results to Communication Agent for reporting."""
        console.print("[cyan]→ Communication Agent: generating report...[/cyan]")

        timeline_summary = "\n".join(
            f"  [{e.timestamp}] {e.agent}: {e.summary}" for e in incident.timeline
        )

        task_payload = {
            "jsonrpc": "2.0",
            "method": "tasks/send",
            "params": {
                "id": f"{incident.id}-communication",
                "message": {
                    "role": "user",
                    "parts": [
                        {
                            "type": "text",
                            "text": (
                                f"Generate incident report for {incident.id}:\n"
                                f"Title: {incident.title}\n"
                                f"Severity: {incident.severity.value if incident.severity else 'unknown'}\n"
                                f"Root cause: {incident.root_cause}\n"
                                f"Remediation: {incident.remediation_action}\n"
                                f"Timeline:\n{timeline_summary}\n"
                                "Create a status update and postmortem."
                            ),
                        }
                    ],
                },
            },
        }

        result = await self.client.send_a2a_task(task_payload)
        incident.postmortem = _extract_field(result, "postmortem", "")

        incident.add_event(
            IncidentPhase.COMMUNICATION,
            "Communication Agent",
            "Incident report generated",
            result=result,
        )

        console.print("  [blue]Report generated ✓[/blue]")
        return result


def _extract_field(result: dict[str, Any], field: str, default: str = "") -> str:
    """Best-effort extraction of a field from an A2A task result."""
    # A2A responses may nest data differently; try common paths
    if isinstance(result, dict):
        # Direct field
        if field in result:
            return str(result[field])
        # Nested in result
        inner = result.get("result", result.get("data", {}))
        if isinstance(inner, dict) and field in inner:
            return str(inner[field])
        # Search in message parts text
        parts = (
            result.get("result", {})
            .get("message", {})
            .get("parts", [])
        )
        for part in parts:
            text = part.get("text", "")
            if field.lower() in text.lower():
                return text[:200]
    return default


async def demo_run(client: AgentBuilderClient, agent_ids: dict[str, str]) -> Incident:
    """Run a demo incident through the pipeline with a sample alert."""
    sample_alert = {
        "title": "High error rate on payment-service",
        "alert.name": "error_rate_spike",
        "alert.severity": "critical",
        "service.name": "payment-service",
        "source": "elastic-alerting",
        "error_rate": 15.2,
        "threshold": 5.0,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    orchestrator = IncidentOrchestrator(client=client, agent_ids=agent_ids)
    return await orchestrator.handle_alert(sample_alert)
