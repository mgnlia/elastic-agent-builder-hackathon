"""Tool definitions for the Incident Commander agents.

Pre-written ES|QL queries and custom tool specs for Agent Builder.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass
class ToolDefinition:
    """Definition for an Agent Builder tool."""

    name: str
    description: str
    tool_type: str  # "esql" | "index_search" | "custom" | "workflow"
    config: dict


# ── ES|QL Tools ─────────────────────────────────────────────────────────

ESQL_ERROR_CORRELATION = ToolDefinition(
    name="esql_error_correlation",
    description="Correlate error logs within a time window to identify error patterns by service.",
    tool_type="esql",
    config={
        "query": (
            'FROM logs-* '
            '| WHERE @timestamp >= NOW() - 30 MINUTES '
            '| WHERE log.level IN ("error", "critical") '
            '| STATS error_count = COUNT(*) BY service.name, error.type '
            '| SORT error_count DESC '
            '| LIMIT 20'
        ),
    },
)

ESQL_METRIC_ANOMALY = ToolDefinition(
    name="esql_metric_anomaly",
    description="Detect CPU and memory anomalies across hosts in the last hour.",
    tool_type="esql",
    config={
        "query": (
            'FROM metrics-* '
            '| WHERE @timestamp >= NOW() - 1 HOUR '
            '| STATS max_cpu = MAX(system.cpu.total.pct), '
            '        max_mem = MAX(system.memory.used.pct) '
            '  BY host.name '
            '| WHERE max_cpu > 0.9 OR max_mem > 0.9 '
            '| SORT max_cpu DESC'
        ),
    },
)

ESQL_LATENCY_CHECK = ToolDefinition(
    name="esql_latency_check",
    description="Check service latency for SLA breaches in the last 30 minutes.",
    tool_type="esql",
    config={
        "query": (
            'FROM metrics-* '
            '| WHERE @timestamp >= NOW() - 30 MINUTES '
            '| STATS avg_latency = AVG(http.server.request.duration), '
            '        p99_latency = PERCENTILE(http.server.request.duration, 99) '
            '  BY service.name '
            '| WHERE avg_latency > 500 OR p99_latency > 2000 '
            '| SORT avg_latency DESC'
        ),
    },
)

# ── Index Search Tools ──────────────────────────────────────────────────

SEARCH_SERVICE_CATALOG = ToolDefinition(
    name="search_service_catalog",
    description="Search the service catalog to identify service owners, dependencies, and runbooks.",
    tool_type="index_search",
    config={
        "index": "service-catalog",
        "fields": ["service.name", "service.owner", "service.dependencies", "service.runbook_url"],
    },
)

SEARCH_RECENT_ALERTS = ToolDefinition(
    name="search_recent_alerts",
    description="Search recent alerts to find related or duplicate incidents.",
    tool_type="index_search",
    config={
        "index": "alerts-*",
        "fields": ["alert.name", "alert.severity", "alert.source", "service.name", "@timestamp"],
    },
)

SEARCH_INCIDENT_HISTORY = ToolDefinition(
    name="search_incident_history",
    description="Search past incidents for similar patterns and prior resolutions.",
    tool_type="index_search",
    config={
        "index": "incidents-*",
        "fields": [
            "incident.id", "incident.title", "incident.root_cause",
            "incident.resolution", "incident.mttr_minutes",
        ],
    },
)

# ── Workflow Tools ──────────────────────────────────────────────────────

WORKFLOW_RESTART_SERVICE = ToolDefinition(
    name="workflow_restart_service",
    description="Trigger a service restart workflow for a specified service.",
    tool_type="workflow",
    config={"workflow_id": "restart-service", "params": ["service_name", "reason"]},
)

WORKFLOW_SCALE_SERVICE = ToolDefinition(
    name="workflow_scale_service",
    description="Trigger a horizontal scaling workflow to add instances.",
    tool_type="workflow",
    config={"workflow_id": "scale-service", "params": ["service_name", "target_replicas"]},
)

WORKFLOW_ROLLBACK_DEPLOY = ToolDefinition(
    name="workflow_rollback_deploy",
    description="Trigger a deployment rollback to the previous stable version.",
    tool_type="workflow",
    config={"workflow_id": "rollback-deploy", "params": ["service_name", "target_version"]},
)


ALL_TOOLS = [
    ESQL_ERROR_CORRELATION,
    ESQL_METRIC_ANOMALY,
    ESQL_LATENCY_CHECK,
    SEARCH_SERVICE_CATALOG,
    SEARCH_RECENT_ALERTS,
    SEARCH_INCIDENT_HISTORY,
    WORKFLOW_RESTART_SERVICE,
    WORKFLOW_SCALE_SERVICE,
    WORKFLOW_ROLLBACK_DEPLOY,
]
