"""Pre-written ES|QL tool definitions and custom tools for incident management.

Research finding: LLMs struggle with ES|QL generation — all queries are pre-written.
"""

from __future__ import annotations

# ── ES|QL Tools ─────────────────────────────────────────────────────────────

ESQL_TOOLS: list[dict] = [
    {
        "toolId": "incident_cmd.error_rate_spike",
        "type": "esql",
        "description": (
            "Detect error rate spikes across services in the last N minutes. "
            "Returns error counts bucketed by 5-minute intervals per service."
        ),
        "configuration": {
            "esqlQuery": (
                "FROM logs-* "
                "| WHERE @timestamp >= NOW() - 30 MINUTES "
                "| WHERE log.level IN (\"error\", \"critical\", \"fatal\") "
                "| STATS error_count = COUNT(*) BY service.name, "
                "  bucket = DATE_TRUNC(5 minutes, @timestamp) "
                "| SORT bucket DESC, error_count DESC "
                "| LIMIT 50"
            ),
        },
    },
    {
        "toolId": "incident_cmd.cpu_anomaly",
        "type": "esql",
        "description": (
            "Find hosts with CPU usage exceeding 90% in the last 15 minutes. "
            "Returns max CPU percentage per host per minute."
        ),
        "configuration": {
            "esqlQuery": (
                "FROM metrics-* "
                "| WHERE @timestamp >= NOW() - 15 MINUTES "
                "| WHERE system.cpu.total.pct IS NOT NULL "
                "| STATS max_cpu = MAX(system.cpu.total.pct) BY host.name, "
                "  bucket = DATE_TRUNC(1 minute, @timestamp) "
                "| WHERE max_cpu > 0.9 "
                "| SORT max_cpu DESC "
                "| LIMIT 50"
            ),
        },
    },
    {
        "toolId": "incident_cmd.log_correlation",
        "type": "esql",
        "description": (
            "Correlate error and critical logs from the last 30 minutes. "
            "Groups by service and error type to identify patterns."
        ),
        "configuration": {
            "esqlQuery": (
                "FROM logs-* "
                "| WHERE @timestamp >= NOW() - 30 MINUTES "
                "| WHERE log.level IN (\"error\", \"critical\") "
                "| STATS count = COUNT(*) BY service.name, error.type "
                "| SORT count DESC "
                "| LIMIT 50"
            ),
        },
    },
    {
        "toolId": "incident_cmd.service_latency",
        "type": "esql",
        "description": (
            "Identify services with high request latency (>500ms average) "
            "in the last 15 minutes."
        ),
        "configuration": {
            "esqlQuery": (
                "FROM metrics-* "
                "| WHERE @timestamp >= NOW() - 15 MINUTES "
                "| WHERE http.server.request.duration IS NOT NULL "
                "| STATS avg_latency = AVG(http.server.request.duration) BY service.name, "
                "  bucket = DATE_TRUNC(1 minute, @timestamp) "
                "| WHERE avg_latency > 500 "
                "| SORT avg_latency DESC "
                "| LIMIT 50"
            ),
        },
    },
    {
        "toolId": "incident_cmd.memory_pressure",
        "type": "esql",
        "description": (
            "Detect hosts with memory usage above 85% in the last 15 minutes."
        ),
        "configuration": {
            "esqlQuery": (
                "FROM metrics-* "
                "| WHERE @timestamp >= NOW() - 15 MINUTES "
                "| WHERE system.memory.used.pct IS NOT NULL "
                "| STATS max_mem = MAX(system.memory.used.pct) BY host.name, "
                "  bucket = DATE_TRUNC(1 minute, @timestamp) "
                "| WHERE max_mem > 0.85 "
                "| SORT max_mem DESC "
                "| LIMIT 50"
            ),
        },
    },
    {
        "toolId": "incident_cmd.disk_usage",
        "type": "esql",
        "description": (
            "Find hosts with disk usage above 90%."
        ),
        "configuration": {
            "esqlQuery": (
                "FROM metrics-* "
                "| WHERE @timestamp >= NOW() - 15 MINUTES "
                "| WHERE system.filesystem.used.pct IS NOT NULL "
                "| STATS max_disk = MAX(system.filesystem.used.pct) BY host.name, system.filesystem.mount_point "
                "| WHERE max_disk > 0.9 "
                "| SORT max_disk DESC "
                "| LIMIT 50"
            ),
        },
    },
    {
        "toolId": "incident_cmd.recent_deployments",
        "type": "esql",
        "description": (
            "List recent deployment events from the last 2 hours to correlate with incidents."
        ),
        "configuration": {
            "esqlQuery": (
                "FROM logs-* "
                "| WHERE @timestamp >= NOW() - 2 HOURS "
                "| WHERE event.action == \"deployment\" OR message LIKE \"*deploy*\" "
                "| SORT @timestamp DESC "
                "| LIMIT 20"
            ),
        },
    },
    {
        "toolId": "incident_cmd.network_errors",
        "type": "esql",
        "description": (
            "Detect network connectivity issues — connection timeouts, refused connections, DNS failures."
        ),
        "configuration": {
            "esqlQuery": (
                "FROM logs-* "
                "| WHERE @timestamp >= NOW() - 30 MINUTES "
                "| WHERE message LIKE \"*connection*refused*\" "
                "  OR message LIKE \"*timeout*\" "
                "  OR message LIKE \"*dns*\" "
                "  OR message LIKE \"*ECONNREFUSED*\" "
                "| STATS count = COUNT(*) BY service.name, host.name "
                "| SORT count DESC "
                "| LIMIT 50"
            ),
        },
    },
]

# ── Custom Tools (for remediation actions) ──────────────────────────────────

CUSTOM_TOOLS: list[dict] = [
    {
        "toolId": "incident_cmd.restart_service",
        "type": "custom",
        "description": (
            "Simulate restarting a service on a given host. "
            "In production, this would trigger a webhook to your orchestration platform. "
            "Parameters: service_name (string), host_name (string)."
        ),
        "configuration": {
            "url": "https://httpbin.org/post",
            "method": "POST",
            "headers": {"Content-Type": "application/json"},
            "body": '{"action": "restart_service", "service": "{{service_name}}", "host": "{{host_name}}"}',
        },
    },
    {
        "toolId": "incident_cmd.scale_service",
        "type": "custom",
        "description": (
            "Simulate scaling a service horizontally by adding replicas. "
            "Parameters: service_name (string), replicas (number)."
        ),
        "configuration": {
            "url": "https://httpbin.org/post",
            "method": "POST",
            "headers": {"Content-Type": "application/json"},
            "body": '{"action": "scale_service", "service": "{{service_name}}", "replicas": "{{replicas}}"}',
        },
    },
    {
        "toolId": "incident_cmd.rollback_deployment",
        "type": "custom",
        "description": (
            "Simulate rolling back a service to its previous deployment version. "
            "Parameters: service_name (string), target_version (string)."
        ),
        "configuration": {
            "url": "https://httpbin.org/post",
            "method": "POST",
            "headers": {"Content-Type": "application/json"},
            "body": '{"action": "rollback", "service": "{{service_name}}", "version": "{{target_version}}"}',
        },
    },
    {
        "toolId": "incident_cmd.drain_node",
        "type": "custom",
        "description": (
            "Simulate draining a Kubernetes node to move workloads off a failing host. "
            "Parameters: node_name (string)."
        ),
        "configuration": {
            "url": "https://httpbin.org/post",
            "method": "POST",
            "headers": {"Content-Type": "application/json"},
            "body": '{"action": "drain_node", "node": "{{node_name}}"}',
        },
    },
]


def get_all_tool_definitions() -> list[dict]:
    """Return all tool definitions for provisioning."""
    return ESQL_TOOLS + CUSTOM_TOOLS
