"""Sample observability data generator for demo purposes.

Generates realistic logs and metrics data to ingest into Elasticsearch
so the ES|QL tools have data to query during demos.
"""

from __future__ import annotations

import random
from datetime import datetime, timedelta, timezone
from typing import Any

SERVICES = [
    {"name": "api-gateway", "environment": "production", "version": "2.4.1"},
    {"name": "user-service", "environment": "production", "version": "1.8.3"},
    {"name": "payment-service", "environment": "production", "version": "3.1.0"},
    {"name": "inventory-service", "environment": "production", "version": "2.0.5"},
    {"name": "notification-service", "environment": "production", "version": "1.3.2"},
    {"name": "search-service", "environment": "production", "version": "4.2.0"},
]

HOSTS = [
    "prod-node-01",
    "prod-node-02",
    "prod-node-03",
    "prod-node-04",
    "prod-node-05",
    "prod-node-06",
]

ERROR_TYPES = [
    "NullPointerException",
    "OutOfMemoryError",
    "ConnectionTimeoutException",
    "DatabaseConnectionError",
    "RateLimitExceeded",
    "AuthenticationFailure",
    "ServiceUnavailable",
    "connection_timeout",
    "dns_failure",
    "connection_refused",
]

ERROR_MESSAGES = [
    "Failed to connect to downstream service",
    "Request timeout after 30000ms",
    "Out of memory: Java heap space",
    "Connection pool exhausted",
    "Circuit breaker opened for payment-service",
    "Database query timeout exceeded 5s threshold",
    "SSL handshake failed with upstream",
    "Rate limit exceeded: 1000 req/s",
    "Authentication token expired",
    "Service health check failed",
]

LOG_LEVELS = ["debug", "info", "warn", "error", "critical", "fatal"]


def _now() -> datetime:
    return datetime.now(timezone.utc)


def generate_log_docs(
    count: int = 500,
    incident_service: str = "payment-service",
    time_window_minutes: int = 60,
) -> list[dict[str, Any]]:
    """Generate sample log documents with a realistic incident pattern.

    Creates a mix of normal logs and an error spike for the incident_service.
    """
    docs: list[dict[str, Any]] = []
    now = _now()

    for i in range(count):
        minutes_ago = random.uniform(0, time_window_minutes)
        timestamp = now - timedelta(minutes=minutes_ago)
        service = random.choice(SERVICES)
        host = random.choice(HOSTS)

        # Create incident pattern: payment-service has elevated errors
        if service["name"] == incident_service and random.random() < 0.6:
            level = random.choice(["error", "critical", "fatal"])
            error_type = random.choice(ERROR_TYPES[:7])
            error_msg = random.choice(ERROR_MESSAGES[:6])
        elif random.random() < 0.08:
            level = random.choice(["error", "warn"])
            error_type = random.choice(ERROR_TYPES)
            error_msg = random.choice(ERROR_MESSAGES)
        else:
            level = random.choice(["info", "debug"])
            error_type = None
            error_msg = None

        doc: dict[str, Any] = {
            "@timestamp": timestamp.isoformat(),
            "log": {"level": level},
            "message": error_msg or f"Normal operation for {service['name']}",
            "service": {
                "name": service["name"],
                "environment": service["environment"],
                "version": service["version"],
            },
            "host": {"name": host},
            "event": {"category": "process"},
        }

        if error_type:
            doc["error"] = {"type": error_type, "message": error_msg}

        if random.random() < 0.15:
            doc["http"] = {
                "response": {
                    "status_code": random.choice([500, 502, 503, 504])
                }
            }
            doc["destination"] = {"address": f"{random.choice(SERVICES)['name']}.internal"}

        docs.append(doc)

    return docs


def generate_metric_docs(
    count: int = 300,
    incident_host: str = "prod-node-03",
    time_window_minutes: int = 60,
) -> list[dict[str, Any]]:
    """Generate sample metric documents with a realistic resource spike.

    Creates a mix of normal metrics and CPU/memory spikes on the incident_host.
    """
    docs: list[dict[str, Any]] = []
    now = _now()

    for i in range(count):
        minutes_ago = random.uniform(0, time_window_minutes)
        timestamp = now - timedelta(minutes=minutes_ago)
        service = random.choice(SERVICES)
        host = random.choice(HOSTS)

        # Create incident pattern: prod-node-03 has high CPU/memory
        if host == incident_host:
            cpu_pct = random.uniform(0.85, 0.99)
            mem_pct = random.uniform(0.80, 0.95)
            latency = random.uniform(800, 3000)
        else:
            cpu_pct = random.uniform(0.10, 0.60)
            mem_pct = random.uniform(0.30, 0.70)
            latency = random.uniform(50, 400)

        doc: dict[str, Any] = {
            "@timestamp": timestamp.isoformat(),
            "service": {
                "name": service["name"],
                "environment": service["environment"],
            },
            "host": {"name": host},
            "system": {
                "cpu": {"total": {"pct": round(cpu_pct, 4)}},
                "memory": {"used": {"pct": round(mem_pct, 4)}},
            },
            "http": {
                "server": {
                    "request": {"duration": round(latency, 2)}
                }
            },
        }

        docs.append(doc)

    return docs


def generate_deployment_docs(
    count: int = 5,
    time_window_hours: int = 2,
) -> list[dict[str, Any]]:
    """Generate sample deployment event documents."""
    docs: list[dict[str, Any]] = []
    now = _now()

    for i in range(count):
        hours_ago = random.uniform(0, time_window_hours)
        timestamp = now - timedelta(hours=hours_ago)
        service = random.choice(SERVICES)

        doc: dict[str, Any] = {
            "@timestamp": timestamp.isoformat(),
            "event": {"category": "configuration"},
            "tags": "deployment",
            "message": f"Deployed {service['name']} version {service['version']}",
            "service": {
                "name": service["name"],
                "version": service["version"],
                "environment": service["environment"],
            },
            "host": {"name": random.choice(HOSTS)},
            "log": {"level": "info"},
        }

        docs.append(doc)

    return docs


def generate_all_sample_data() -> dict[str, list[dict[str, Any]]]:
    """Generate all sample data for the demo."""
    return {
        "logs-demo": generate_log_docs() + generate_deployment_docs(),
        "metrics-demo": generate_metric_docs(),
    }
