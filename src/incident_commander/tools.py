"""Tool definitions for the Incident Commander agents.

Pre-written ES|QL queries and custom tool specs for Agent Builder.
All tool dicts match the Elastic Agent Builder API schema.

8 ES|QL tools + 4 custom tools = 12 total.
"""

from __future__ import annotations

# ── ES|QL Tools (8) ────────────────────────────────────────────────────

ESQL_ERROR_RATE_SPIKE: dict = {
    "toolId": "incident_cmd.error_rate_spike",
    "displayName": "Error Rate Spike",
    "description": "Detect error-rate spikes across services in the last 30 minutes using ES|QL.",
    "type": "esql",
    "configuration": {
        "esqlQuery": (
            'FROM logs-* '
            '| WHERE @timestamp >= NOW() - 30 MINUTES '
            '| WHERE log.level IN ("error", "critical") '
            '| STATS error_count = COUNT(*) BY service.name, error.type '
            '| SORT error_count DESC '
            '| LIMIT 20'
        ),
    },
}

ESQL_CPU_ANOMALY: dict = {
    "toolId": "incident_cmd.cpu_anomaly",
    "displayName": "CPU Anomaly Detection",
    "description": "Find hosts with CPU usage above 90% in the last hour.",
    "type": "esql",
    "configuration": {
        "esqlQuery": (
            'FROM metrics-* '
            '| WHERE @timestamp >= NOW() - 1 HOUR '
            '| STATS max_cpu = MAX(system.cpu.total.pct) BY host.name '
            '| WHERE max_cpu > 0.9 '
            '| SORT max_cpu DESC'
        ),
    },
}

ESQL_LOG_CORRELATION: dict = {
    "toolId": "incident_cmd.log_correlation",
    "displayName": "Log Correlation",
    "description": "Correlate error and critical logs by service and error type in the last 30 minutes.",
    "type": "esql",
    "configuration": {
        "esqlQuery": (
            'FROM logs-* '
            '| WHERE @timestamp >= NOW() - 30 MINUTES '
            '| WHERE log.level IN ("error", "critical") '
            '| STATS count = COUNT(*) BY service.name, error.type '
            '| SORT count DESC'
        ),
    },
}

ESQL_SERVICE_LATENCY: dict = {
    "toolId": "incident_cmd.service_latency",
    "displayName": "Service Latency Check",
    "description": "Check service request latency for SLA breaches (avg > 500ms or p99 > 2s).",
    "type": "esql",
    "configuration": {
        "esqlQuery": (
            'FROM metrics-* '
            '| WHERE @timestamp >= NOW() - 30 MINUTES '
            '| STATS avg_latency = AVG(http.server.request.duration), '
            '        p99_latency = PERCENTILE(http.server.request.duration, 99) '
            '  BY service.name '
            '| WHERE avg_latency > 500 OR p99_latency > 2000 '
            '| SORT avg_latency DESC'
        ),
    },
}

ESQL_MEMORY_PRESSURE: dict = {
    "toolId": "incident_cmd.memory_pressure",
    "displayName": "Memory Pressure Detection",
    "description": "Detect hosts with memory usage above 90% in the last hour.",
    "type": "esql",
    "configuration": {
        "esqlQuery": (
            'FROM metrics-* '
            '| WHERE @timestamp >= NOW() - 1 HOUR '
            '| STATS max_mem = MAX(system.memory.used.pct) BY host.name '
            '| WHERE max_mem > 0.9 '
            '| SORT max_mem DESC'
        ),
    },
}

ESQL_DEPLOYMENT_EVENTS: dict = {
    "toolId": "incident_cmd.deployment_events",
    "displayName": "Recent Deployment Events",
    "description": "List recent deployment events to correlate with incident timeline.",
    "type": "esql",
    "configuration": {
        "esqlQuery": (
            'FROM logs-* '
            '| WHERE @timestamp >= NOW() - 2 HOURS '
            '| WHERE event.category == "deployment" '
            '| STATS deploy_count = COUNT(*) BY service.name, event.action '
            '| SORT deploy_count DESC'
        ),
    },
}

ESQL_DEPENDENCY_ERRORS: dict = {
    "toolId": "incident_cmd.dependency_errors",
    "displayName": "Dependency Error Analysis",
    "description": "Analyze downstream dependency errors to find cascading failures.",
    "type": "esql",
    "configuration": {
        "esqlQuery": (
            'FROM logs-* '
            '| WHERE @timestamp >= NOW() - 30 MINUTES '
            '| WHERE log.level == "error" AND destination.address IS NOT NULL '
            '| STATS err_count = COUNT(*) BY source.service.name, destination.address '
            '| SORT err_count DESC '
            '| LIMIT 20'
        ),
    },
}

ESQL_THROUGHPUT_DROP: dict = {
    "toolId": "incident_cmd.throughput_drop",
    "displayName": "Throughput Drop Detection",
    "description": "Detect significant drops in request throughput across services.",
    "type": "esql",
    "configuration": {
        "esqlQuery": (
            'FROM metrics-* '
            '| WHERE @timestamp >= NOW() - 1 HOUR '
            '| STATS req_count = COUNT(*) BY service.name '
            '| SORT req_count ASC '
            '| LIMIT 10'
        ),
    },
}

ESQL_TOOLS: list[dict] = [
    ESQL_ERROR_RATE_SPIKE,
    ESQL_CPU_ANOMALY,
    ESQL_LOG_CORRELATION,
    ESQL_SERVICE_LATENCY,
    ESQL_MEMORY_PRESSURE,
    ESQL_DEPLOYMENT_EVENTS,
    ESQL_DEPENDENCY_ERRORS,
    ESQL_THROUGHPUT_DROP,
]

# ── Custom Tools (4) ───────────────────────────────────────────────────

CUSTOM_RESTART_SERVICE: dict = {
    "toolId": "incident_cmd.restart_service",
    "displayName": "Restart Service",
    "description": "Trigger a rolling restart for a specified service to recover from transient failures.",
    "type": "custom",
    "configuration": {
        "url": "{{KIBANA_URL}}/api/fleet/agents/actions",
        "method": "POST",
        "body": {
            "action": "restart",
            "params": ["service_name", "reason"],
        },
    },
}

CUSTOM_SCALE_SERVICE: dict = {
    "toolId": "incident_cmd.scale_service",
    "displayName": "Scale Service",
    "description": "Trigger horizontal scaling to add more instances for a service under load.",
    "type": "custom",
    "configuration": {
        "url": "{{KIBANA_URL}}/api/fleet/agents/actions",
        "method": "POST",
        "body": {
            "action": "scale",
            "params": ["service_name", "target_replicas"],
        },
    },
}

CUSTOM_ROLLBACK_DEPLOYMENT: dict = {
    "toolId": "incident_cmd.rollback_deployment",
    "displayName": "Rollback Deployment",
    "description": "Roll back to the previous stable deployment version for a service.",
    "type": "custom",
    "configuration": {
        "url": "{{KIBANA_URL}}/api/fleet/agents/actions",
        "method": "POST",
        "body": {
            "action": "rollback",
            "params": ["service_name", "target_version"],
        },
    },
}

CUSTOM_UPDATE_CONFIG: dict = {
    "toolId": "incident_cmd.update_config",
    "displayName": "Update Configuration",
    "description": "Apply a configuration change to a service (e.g. feature flag, rate limit).",
    "type": "custom",
    "configuration": {
        "url": "{{KIBANA_URL}}/api/fleet/agents/actions",
        "method": "POST",
        "body": {
            "action": "config_update",
            "params": ["service_name", "config_key", "config_value"],
        },
    },
}

CUSTOM_TOOLS: list[dict] = [
    CUSTOM_RESTART_SERVICE,
    CUSTOM_SCALE_SERVICE,
    CUSTOM_ROLLBACK_DEPLOYMENT,
    CUSTOM_UPDATE_CONFIG,
]

# ── Index Search Tools (used by Triage + Communication) ────────────────

SEARCH_SERVICE_CATALOG: dict = {
    "toolId": "incident_cmd.search_service_catalog",
    "displayName": "Search Service Catalog",
    "description": "Search the service catalog to identify service owners, dependencies, and runbooks.",
    "type": "esql",
    "configuration": {
        "esqlQuery": (
            'FROM service-catalog '
            '| KEEP service.name, service.owner, service.dependencies, service.runbook_url '
            '| LIMIT 50'
        ),
    },
}

SEARCH_RECENT_ALERTS: dict = {
    "toolId": "incident_cmd.search_recent_alerts",
    "displayName": "Search Recent Alerts",
    "description": "Search recent alerts to find related or duplicate incidents.",
    "type": "esql",
    "configuration": {
        "esqlQuery": (
            'FROM alerts-* '
            '| WHERE @timestamp >= NOW() - 24 HOURS '
            '| KEEP alert.name, alert.severity, alert.source, service.name, @timestamp '
            '| SORT @timestamp DESC '
            '| LIMIT 50'
        ),
    },
}

SEARCH_INCIDENT_HISTORY: dict = {
    "toolId": "incident_cmd.search_incident_history",
    "displayName": "Search Incident History",
    "description": "Search past incidents for similar patterns and prior resolutions.",
    "type": "esql",
    "configuration": {
        "esqlQuery": (
            'FROM incidents-* '
            '| KEEP incident.id, incident.title, incident.root_cause, '
            '       incident.resolution, incident.mttr_minutes '
            '| SORT incident.mttr_minutes ASC '
            '| LIMIT 20'
        ),
    },
}

# Note: search tools use esql type to keep everything in ES|QL land.
# They are conceptually "search" but implemented as ES|QL queries.

ALL_TOOLS: list[dict] = ESQL_TOOLS + CUSTOM_TOOLS


def get_all_tool_definitions() -> list[dict]:
    """Return a copy of all tool definitions."""
    return list(ALL_TOOLS)
