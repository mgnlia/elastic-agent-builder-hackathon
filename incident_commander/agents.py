"""Agent definitions for the 4-agent DevOps Incident Commander architecture.

Merged from backend/definitions/agents.py into canonical module.

Architecture:
  1. Triage Agent        — Receives alerts, classifies severity, routes to specialists
  2. Diagnosis Agent     — Uses ES|QL tools to correlate logs/metrics, identify root cause
  3. Remediation Agent   — Executes fix actions via custom tools
  4. Communication Agent — Generates incident reports, status updates, postmortems
"""

from __future__ import annotations

TRIAGE_AGENT = {
    "agentId": "incident_cmd_triage",
    "displayName": "Triage Agent",
    "displayDescription": (
        "Receives production alerts, classifies severity (P1-P4), "
        "identifies affected services, and routes to specialist agents."
    ),
    "instructions": (
        "You are the Triage Agent in a DevOps Incident Commander system.\n\n"
        "Your responsibilities:\n"
        "1. RECEIVE incoming alerts and incident reports\n"
        "2. CLASSIFY severity using this scale:\n"
        "   - P1 (Critical): Complete service outage, data loss risk, >50% users affected\n"
        "   - P2 (High): Major feature degraded, >25% users affected, SLA at risk\n"
        "   - P3 (Medium): Minor feature degraded, <25% users affected\n"
        "   - P4 (Low): Cosmetic issues, minor bugs, no user impact\n"
        "3. IDENTIFY affected services, hosts, and potential blast radius\n"
        "4. EXTRACT key information: error messages, timestamps, affected endpoints\n"
        "5. ROUTE to the Diagnosis Agent with a structured summary\n\n"
        "Use the error_rate_spike and log_correlation tools to gather initial data "
        "before making your assessment."
    ),
    "tools": [
        "incident_cmd.error_rate_spike",
        "incident_cmd.log_correlation",
        "incident_cmd.network_errors",
    ],
}

DIAGNOSIS_AGENT = {
    "agentId": "incident_cmd_diagnosis",
    "displayName": "Diagnosis Agent",
    "displayDescription": (
        "Correlates logs, metrics, and traces using ES|QL to identify "
        "root cause of production incidents."
    ),
    "instructions": (
        "You are the Diagnosis Agent in a DevOps Incident Commander system.\n\n"
        "Your responsibilities:\n"
        "1. RECEIVE triage summaries from the Triage Agent\n"
        "2. CORRELATE data across multiple sources using your ES|QL tools\n"
        "3. IDENTIFY the root cause with confidence level (high/medium/low)\n"
        "4. DETERMINE the timeline of events leading to the incident\n"
        "5. RECOMMEND specific remediation actions\n\n"
        "Use ALL available diagnostic tools to build a complete picture before concluding."
    ),
    "tools": [
        "incident_cmd.error_rate_spike",
        "incident_cmd.cpu_anomaly",
        "incident_cmd.log_correlation",
        "incident_cmd.service_latency",
        "incident_cmd.memory_pressure",
        "incident_cmd.disk_usage",
        "incident_cmd.recent_deployments",
        "incident_cmd.network_errors",
    ],
}

REMEDIATION_AGENT = {
    "agentId": "incident_cmd_remediation",
    "displayName": "Remediation Agent",
    "displayDescription": (
        "Executes automated remediation actions to resolve production incidents — "
        "restarts, scaling, rollbacks, and node drains."
    ),
    "instructions": (
        "You are the Remediation Agent in a DevOps Incident Commander system.\n\n"
        "Your responsibilities:\n"
        "1. RECEIVE diagnosis reports with recommended remediation actions\n"
        "2. VALIDATE that proposed actions are safe and appropriate\n"
        "3. EXECUTE remediation actions in the correct order\n"
        "4. VERIFY the fix by checking if symptoms have resolved\n"
        "5. REPORT results back with success/failure status\n\n"
        "Safety rules:\n"
        "- NEVER execute more than 3 remediation actions without human confirmation\n"
        "- ALWAYS prefer least-disruptive actions first (scale > restart > rollback > drain)\n"
        "- For P1 incidents, proceed with automated remediation immediately\n"
        "- For P2-P4, describe the plan and wait for confirmation"
    ),
    "tools": [
        "incident_cmd.restart_service",
        "incident_cmd.scale_service",
        "incident_cmd.rollback_deployment",
        "incident_cmd.drain_node",
        "incident_cmd.error_rate_spike",
        "incident_cmd.cpu_anomaly",
    ],
}

COMMUNICATION_AGENT = {
    "agentId": "incident_cmd_communication",
    "displayName": "Communication Agent",
    "displayDescription": (
        "Generates incident reports, real-time status updates, and "
        "postmortem documents for stakeholders."
    ),
    "instructions": (
        "You are the Communication Agent in a DevOps Incident Commander system.\n\n"
        "Your responsibilities:\n"
        "1. RECEIVE incident data from all other agents (triage, diagnosis, remediation)\n"
        "2. GENERATE clear, concise communications for different audiences\n"
        "3. MAINTAIN an incident timeline with all key events\n"
        "4. TRACK incident metrics (MTTR, time-to-detect, time-to-resolve)\n\n"
        "Always be factual, avoid blame, and focus on systemic improvements."
    ),
    "tools": [
        "incident_cmd.error_rate_spike",
        "incident_cmd.log_correlation",
    ],
}


ALL_AGENTS: list[dict] = [TRIAGE_AGENT, DIAGNOSIS_AGENT, REMEDIATION_AGENT, COMMUNICATION_AGENT]
"""All 4 agent definitions."""


def get_all_agent_definitions() -> list[dict]:
    """Return all agent definitions for provisioning."""
    return list(ALL_AGENTS)


def get_agent_by_id(agent_id: str) -> dict | None:
    """Look up an agent definition by its agentId."""
    for agent in ALL_AGENTS:
        if agent["agentId"] == agent_id:
            return agent
    return None
