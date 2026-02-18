"""Sample observability data for demonstrating the Incident Commander.

Generates realistic logs and metrics that simulate a production incident:
  - Normal baseline → Error spike → CPU anomaly → Service degradation → Resolution
"""

from __future__ import annotations

import random
from datetime import datetime, timedelta, timezone

SERVICES = ["api-gateway", "user-service", "payment-service", "inventory-service", "notification-service"]
HOSTS = ["prod-node-01", "prod-node-02", "prod-node-03", "prod-node-04"]
ERROR_TYPES = ["NullPointerException", "ConnectionTimeoutException", "OutOfMemoryError", "DatabaseConnectionError", "RateLimitExceeded"]

LOG_INDEX = "logs-incident-demo"
METRICS_INDEX = "metrics-incident-demo"


def _ts(minutes_ago: int) -> str:
    """ISO timestamp for N minutes ago."""
    dt = datetime.now(timezone.utc) - timedelta(minutes=minutes_ago)
    return dt.isoformat()


def generate_log_docs(count: int = 200) -> list[dict]:
    """Generate synthetic log documents simulating an incident timeline."""
    docs = []

    for i in range(count):
        minutes_ago = random.randint(0, 120)
        service = random.choice(SERVICES)
        host = random.choice(HOSTS)

        # Simulate incident: payment-service errors spike 20-40 min ago
        if 20 <= minutes_ago <= 40 and service == "payment-service":
            level = random.choice(["error", "critical", "error", "error"])
            error_type = random.choice(["DatabaseConnectionError", "ConnectionTimeoutException"])
            message = f"{error_type}: Failed to connect to database replica on {host}"
        elif 15 <= minutes_ago <= 45 and service == "api-gateway":
            level = random.choice(["error", "warn", "warn"])
            error_type = "ConnectionTimeoutException"
            message = f"Upstream timeout: payment-service did not respond within 30s"
        elif minutes_ago <= 10:
            # Post-remediation: mostly healthy
            level = random.choice(["info", "info", "info", "debug"])
            error_type = None
            message = f"Request processed successfully in {random.randint(50, 200)}ms"
        else:
            level = random.choice(["info", "info", "info", "debug", "warn"])
            error_type = random.choice(ERROR_TYPES) if level == "warn" else None
            message = (
                f"Request processed in {random.randint(100, 500)}ms"
                if level in ("info", "debug")
                else f"{error_type}: Transient error on {host}"
            )

        doc = {
            "@timestamp": _ts(minutes_ago),
            "service": {"name": service},
            "host": {"name": host},
            "log": {"level": level},
            "message": message,
        }
        if error_type:
            doc["error"] = {"type": error_type}

        # Add deployment event
        if i % 50 == 0 and minutes_ago > 35:
            doc["event"] = {"action": "deployment"}
            doc["message"] = f"Deployed {service} v2.{random.randint(1,9)}.{random.randint(0,99)} to {host}"

        docs.append(doc)

    return docs


def generate_metric_docs(count: int = 150) -> list[dict]:
    """Generate synthetic metric documents simulating resource pressure."""
    docs = []

    for _ in range(count):
        minutes_ago = random.randint(0, 120)
        service = random.choice(SERVICES)
        host = random.choice(HOSTS)

        # Simulate CPU spike on prod-node-02 during incident window
        if 15 <= minutes_ago <= 45 and host == "prod-node-02":
            cpu = round(random.uniform(0.88, 0.99), 4)
            memory = round(random.uniform(0.80, 0.92), 4)
            latency = random.randint(800, 3000)
        elif 15 <= minutes_ago <= 45 and service == "payment-service":
            cpu = round(random.uniform(0.70, 0.95), 4)
            memory = round(random.uniform(0.75, 0.88), 4)
            latency = random.randint(500, 2000)
        else:
            cpu = round(random.uniform(0.15, 0.65), 4)
            memory = round(random.uniform(0.40, 0.70), 4)
            latency = random.randint(50, 300)

        disk = round(random.uniform(0.50, 0.85), 4)
        if host == "prod-node-03":
            disk = round(random.uniform(0.88, 0.96), 4)

        docs.append({
            "@timestamp": _ts(minutes_ago),
            "service": {"name": service},
            "host": {"name": host},
            "system": {
                "cpu": {"total": {"pct": cpu}},
                "memory": {"used": {"pct": memory}},
                "filesystem": {
                    "used": {"pct": disk},
                    "mount_point": "/",
                },
            },
            "http": {
                "server": {
                    "request": {"duration": latency},
                },
            },
        })

    return docs


LOG_MAPPINGS = {
    "properties": {
        "@timestamp": {"type": "date"},
        "service.name": {"type": "keyword"},
        "host.name": {"type": "keyword"},
        "log.level": {"type": "keyword"},
        "message": {"type": "text"},
        "error.type": {"type": "keyword"},
        "event.action": {"type": "keyword"},
    }
}

METRICS_MAPPINGS = {
    "properties": {
        "@timestamp": {"type": "date"},
        "service.name": {"type": "keyword"},
        "host.name": {"type": "keyword"},
        "system.cpu.total.pct": {"type": "float"},
        "system.memory.used.pct": {"type": "float"},
        "system.filesystem.used.pct": {"type": "float"},
        "system.filesystem.mount_point": {"type": "keyword"},
        "http.server.request.duration": {"type": "integer"},
    }
}
