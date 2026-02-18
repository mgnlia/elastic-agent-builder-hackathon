"""Workflow helpers for Elastic Workflows integration with Agent Builder.

Elastic Workflows are multi-step automation pipelines triggered manually,
on schedule, or by alerts. Workflow tools let agents trigger these workflows
as part of their reasoning loop.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Any


class TriggerType(str, Enum):
    MANUAL = "manual"
    SCHEDULED = "scheduled"
    ALERT = "alert"


class StepType(str, Enum):
    # Action steps
    ELASTICSEARCH = "elasticsearch"
    KIBANA = "kibana"
    EXTERNAL = "external"
    # Flow control
    IF = "if"
    FOREACH = "foreach"
    WAIT = "wait"


@dataclass
class WorkflowStep:
    """A single step in an Elastic Workflow."""

    name: str
    type: StepType
    configuration: dict[str, Any] = field(default_factory=dict)
    description: str = ""

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "type": self.type.value,
            "description": self.description,
            "configuration": self.configuration,
        }


@dataclass
class WorkflowDefinition:
    """Blueprint for an Elastic Workflow that can be triggered by agents."""

    name: str
    description: str
    trigger_type: TriggerType = TriggerType.MANUAL
    steps: list[WorkflowStep] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "description": self.description,
            "trigger": {"type": self.trigger_type.value},
            "steps": [s.to_dict() for s in self.steps],
        }


# ── Pre-built workflow templates ────────────────────────────────

def incident_triage_workflow() -> WorkflowDefinition:
    """Template: Incident triage workflow.

    1. Query recent error logs
    2. Check if error rate exceeds threshold
    3. If yes, create an incident summary and index it
    """
    return WorkflowDefinition(
        name="incident_triage",
        description="Automatically triage incidents by analyzing error logs and creating summaries.",
        trigger_type=TriggerType.MANUAL,
        steps=[
            WorkflowStep(
                name="query_errors",
                type=StepType.ELASTICSEARCH,
                description="Query recent error logs from the last hour",
                configuration={
                    "action": "esql",
                    "query": (
                        'FROM logs-* '
                        '| WHERE log.level == "error" AND @timestamp >= NOW() - 1 hour '
                        '| STATS error_count = COUNT(*) BY service.name'
                    ),
                },
            ),
            WorkflowStep(
                name="check_threshold",
                type=StepType.IF,
                description="Check if any service has more than 100 errors",
                configuration={
                    "condition": "{{query_errors.error_count}} > 100",
                },
            ),
            WorkflowStep(
                name="create_summary",
                type=StepType.ELASTICSEARCH,
                description="Index an incident summary document",
                configuration={
                    "action": "index",
                    "index": "incidents",
                    "document": {
                        "title": "High error rate detected",
                        "service": "{{query_errors.service.name}}",
                        "error_count": "{{query_errors.error_count}}",
                        "timestamp": "{{now}}",
                        "status": "open",
                    },
                },
            ),
        ],
    )


def data_quality_check_workflow() -> WorkflowDefinition:
    """Template: Data quality check workflow.

    1. Run ES|QL aggregation to detect anomalies
    2. For each anomaly, log a finding
    """
    return WorkflowDefinition(
        name="data_quality_check",
        description="Run periodic data quality checks and log findings.",
        trigger_type=TriggerType.SCHEDULED,
        steps=[
            WorkflowStep(
                name="check_nulls",
                type=StepType.ELASTICSEARCH,
                description="Find fields with high null rates",
                configuration={
                    "action": "esql",
                    "query": (
                        "FROM data-* "
                        "| STATS null_count = COUNT(*) - COUNT(important_field) BY _index "
                        "| WHERE null_count > 0 "
                        "| SORT null_count DESC "
                        "| LIMIT 20"
                    ),
                },
            ),
            WorkflowStep(
                name="log_findings",
                type=StepType.FOREACH,
                description="Index a quality finding for each result",
                configuration={
                    "items": "{{check_nulls.results}}",
                    "step": {
                        "action": "index",
                        "index": "data-quality-findings",
                        "document": {
                            "index_name": "{{item._index}}",
                            "null_count": "{{item.null_count}}",
                            "checked_at": "{{now}}",
                        },
                    },
                },
            ),
        ],
    )
