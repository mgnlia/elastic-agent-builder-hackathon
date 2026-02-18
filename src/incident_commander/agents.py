"""Agent definitions for the Incident Commander system.

Four specialized agents orchestrated via A2A protocol:
  1. Triage Agent — Classifies incoming alerts, assigns severity, routes to specialists
  2. Diagnosis Agent — Correlates logs/metrics via ES|QL, identifies root cause
  3. Remediation Agent — Executes fix actions via custom tools + workflows
  4. Communication Agent — Generates incident reports, status updates, postmortems

Each agent is defined as a dict matching the Elastic Agent Builder API schema.
"""

from __future__ import annotations


TRIAGE_AGENT: dict = {
    "agentId": "incident_cmd_triage",
    "displayName": "Triage Agent",
    "description": (
        "Classifies incoming alerts by severity and routes to the appropriate specialist agent."
    ),
    "instructions": (
        "You are the Triage Agent for the Incident Commander system. "
        "When you receive an alert or incident notification, you must: "
        "1) Classify severity (P1-Critical, P2-High, P3-Medium, P4-Low) based on impact and urgency. "
        "2) Identify affected services using the service catalog search tool. "
        "3) Check for recent similar alerts to avoid duplicate investigations. "
        "4) Route to the Diagnosis Agent with a structured triage summary. "
        "Always include: alert source, affected service(s), severity, initial impact assessment."
    ),
    "tools": [
        "incident_cmd.error_rate_spike",
        "incident_cmd.search_service_catalog",
        "incident_cmd.search_recent_alerts",
    ],
}

DIAGNOSIS_AGENT: dict = {
    "agentId": "incident_cmd_diagnosis",
    "displayName": "Diagnosis Agent",
    "description": (
        "Correlates logs and metrics using ES|QL to identify incident root cause."
    ),
    "instructions": (
        "You are the Diagnosis Agent for the Incident Commander system. "
        "When you receive a triage summary, you must: "
        "1) Run ES|QL queries to correlate error logs with the incident timeframe. "
        "2) Check CPU/memory/latency metrics for anomalies. "
        "3) Trace request flows to identify the failing component. "
        "4) Identify the root cause and affected components. "
        "5) Pass diagnosis to the Remediation Agent with specific fix recommendations. "
        "Always show your ES|QL queries and explain the correlation logic."
    ),
    "tools": [
        "incident_cmd.error_rate_spike",
        "incident_cmd.cpu_anomaly",
        "incident_cmd.log_correlation",
        "incident_cmd.service_latency",
        "incident_cmd.memory_pressure",
        "incident_cmd.deployment_events",
        "incident_cmd.dependency_errors",
        "incident_cmd.throughput_drop",
    ],
}

REMEDIATION_AGENT: dict = {
    "agentId": "incident_cmd_remediation",
    "displayName": "Remediation Agent",
    "description": (
        "Executes remediation actions based on diagnosis — restarts, scales, rolls back."
    ),
    "instructions": (
        "You are the Remediation Agent for the Incident Commander system. "
        "When you receive a diagnosis with fix recommendations, you must: "
        "1) Select the appropriate remediation action (restart, scale, rollback, config change). "
        "2) Execute the action using the available custom tools. "
        "3) Verify the fix by checking post-action metrics. "
        "4) Report results to the Communication Agent. "
        "Always explain what action you took and why. Prioritize safety — prefer rollback over restart."
    ),
    "tools": [
        "incident_cmd.restart_service",
        "incident_cmd.scale_service",
        "incident_cmd.rollback_deployment",
        "incident_cmd.update_config",
    ],
}

COMMUNICATION_AGENT: dict = {
    "agentId": "incident_cmd_communication",
    "displayName": "Communication Agent",
    "description": (
        "Generates incident reports, status updates, and postmortem documents."
    ),
    "instructions": (
        "You are the Communication Agent for the Incident Commander system. "
        "When you receive remediation results, you must: "
        "1) Generate a concise incident status update for stakeholders. "
        "2) Create a timeline of events (alert → triage → diagnosis → fix → verification). "
        "3) Draft a postmortem with root cause, impact, resolution, and action items. "
        "Format output in clear markdown. Include MTTR (Mean Time To Resolution)."
    ),
    "tools": [
        "incident_cmd.search_incident_history",
    ],
}

ALL_AGENTS: list[dict] = [TRIAGE_AGENT, DIAGNOSIS_AGENT, REMEDIATION_AGENT, COMMUNICATION_AGENT]


def get_agent_by_id(agent_id: str) -> dict | None:
    """Look up an agent definition by its agentId. Returns None if not found."""
    for agent in ALL_AGENTS:
        if agent["agentId"] == agent_id:
            return agent
    return None


def get_all_agent_definitions() -> list[dict]:
    """Return a copy of all agent definitions."""
    return list(ALL_AGENTS)
