"""ES|QL query helpers and common query templates."""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class ESQLParameter:
    """Typed parameter for ES|QL tool queries."""

    name: str
    description: str
    type: str = "string"  # string | number | boolean | date
    required: bool = True
    default: str | None = None

    def to_dict(self) -> dict:
        d: dict = {
            "name": self.name,
            "description": self.description,
            "type": self.type,
            "required": self.required,
        }
        if self.default is not None:
            d["default"] = self.default
        return d


@dataclass
class ESQLToolTemplate:
    """Template for creating ES|QL tools via the Agent Builder API."""

    name: str
    description: str
    query: str
    parameters: list[ESQLParameter] = field(default_factory=list)

    def to_api_payload(self) -> dict:
        payload: dict = {
            "name": self.name,
            "description": self.description,
            "type": "esql",
            "configuration": {
                "query": self.query,
            },
        }
        if self.parameters:
            payload["configuration"]["parameters"] = [p.to_dict() for p in self.parameters]
        return payload


# ── Pre-built query templates ───────────────────────────────────

def search_logs_by_level(index: str = "logs-*") -> ESQLToolTemplate:
    """Template: search logs filtered by severity level."""
    return ESQLToolTemplate(
        name="search_logs_by_level",
        description=f"Search {index} for log entries filtered by severity level and optional keyword.",
        query=f"FROM {index} | WHERE log.level == ?level | SORT @timestamp DESC | LIMIT ?limit",
        parameters=[
            ESQLParameter(name="level", description="Log severity level (e.g., error, warn, info)"),
            ESQLParameter(
                name="limit",
                description="Maximum number of results",
                type="number",
                required=False,
                default="25",
            ),
        ],
    )


def aggregate_metrics(index: str = "metrics-*") -> ESQLToolTemplate:
    """Template: aggregate metrics over a time range."""
    return ESQLToolTemplate(
        name="aggregate_metrics",
        description=f"Aggregate metrics from {index} with stats by a grouping field.",
        query=(
            f"FROM {index} "
            "| WHERE @timestamp >= ?start_time "
            "| STATS avg_val = AVG(?metric_field), max_val = MAX(?metric_field) BY ?group_by"
        ),
        parameters=[
            ESQLParameter(name="start_time", description="Start time for the query window", type="date"),
            ESQLParameter(name="metric_field", description="Name of the numeric metric field"),
            ESQLParameter(name="group_by", description="Field to group results by"),
        ],
    )


def top_errors(index: str = "logs-*", top_n: int = 10) -> ESQLToolTemplate:
    """Template: find top N most frequent error messages."""
    return ESQLToolTemplate(
        name="top_errors",
        description=f"Find the {top_n} most frequent error messages in {index}.",
        query=(
            f"FROM {index} "
            "| WHERE log.level == \"error\" "
            f"| STATS count = COUNT(*) BY message "
            f"| SORT count DESC "
            f"| LIMIT {top_n}"
        ),
        parameters=[],
    )
