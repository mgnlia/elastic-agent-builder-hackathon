"""Agent definitions for the Incident Commander system.

Four specialized agents orchestrated via A2A protocol:
  1. Triage Agent — Classifies incoming alerts, assigns severity, routes to specialists
  2. Diagnosis Agent — Correlates logs/metrics via ES|QL, identifies root cause
  3. Remediation Agent — Executes fix actions via custom tools + workflows
  4. Communication Agent — Generates incident reports, status updates, postmortems
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass
class AgentDefinition:
    """Definition for an Agent Builder agent."""

    name: str
    description: str
    system_prompt: str
    tool_names: list[str]


TRIAGE_AGENT = AgentDefinition(
    name="Triage Agent",
    description="Classifies incoming alerts by severity and routes to the appropriate specialist agent.",
    system_prompt=(
        "You are the Triage Agent for the Incident Commander system. "
        "When you receive an alert or incident notification, you must: "
        "1) Classify severity (P1-Critical, P2-High, P3-Medium, P4-Low) based on impact and urgency. "
        "2) Identify affected services using the service catalog search tool. "
        "3) Route to the Diagnosis Agent with a structured triage summary. "
        "Always include: alert source, affected service(s), severity, initial impact assessment."
    ),
    tool_names=["search_service_catalog", "search_recent_alerts"],
)

DIAGNOSIS_AGENT = AgentDefinition(
    name="Diagnosis Agent",
    description="Correlates logs and metrics using ES|QL to identify incident root cause.",
    system_prompt=(
        "You are the Diagnosis Agent for the Incident Commander system. "
        "When you receive a triage summary, you must: "
        "1) Run ES|QL queries to correlate error logs with the incident timeframe. "
        "2) Check CPU/memory/latency metrics for anomalies. "
        "3) Identify the root cause and affected components. "
        "4) Pass diagnosis to the Remediation Agent with specific fix recommendations. "
        "Always show your ES|QL queries and explain the correlation logic."
    ),
    tool_names=["esql_error_correlation", "esql_metric_anomaly", "esql_latency_check"],
)

REMEDIATION_AGENT = AgentDefinition(
    name="Remediation Agent",
    description="Executes remediation actions based on diagnosis — restarts, scales, rolls back.",
    system_prompt=(
        "You are the Remediation Agent for the Incident Commander system. "
        "When you receive a diagnosis with fix recommendations, you must: "
        "1) Select the appropriate remediation action (restart, scale, rollback, config change). "
        "2) Execute the action using the available workflow tools. "
        "3) Verify the fix by checking post-action metrics. "
        "4) Report results to the Communication Agent. "
        "Always explain what action you took and why. Prioritize safety — prefer rollback over restart."
    ),
    tool_names=["workflow_restart_service", "workflow_scale_service", "workflow_rollback_deploy"],
)

COMMUNICATION_AGENT = AgentDefinition(
    name="Communication Agent",
    description="Generates incident reports, status updates, and postmortem documents.",
    system_prompt=(
        "You are the Communication Agent for the Incident Commander system. "
        "When you receive remediation results, you must: "
        "1) Generate a concise incident status update for stakeholders. "
        "2) Create a timeline of events (alert → triage → diagnosis → fix → verification). "
        "3) Draft a postmortem with root cause, impact, resolution, and action items. "
        "Format output in clear markdown. Include MTTR (Mean Time To Resolution)."
    ),
    tool_names=["search_incident_history"],
)

ALL_AGENTS = [TRIAGE_AGENT, DIAGNOSIS_AGENT, REMEDIATION_AGENT, COMMUNICATION_AGENT]
