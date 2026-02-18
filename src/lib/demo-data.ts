import { Agent, TimelineEvent, A2AMessage, MetricComparison } from "./types";

export const AGENTS: Agent[] = [
  {
    id: "triage",
    name: "Triage Agent",
    icon: "🔍",
    color: "#F04E98",
    bgColor: "rgba(240, 78, 152, 0.1)",
    borderColor: "rgba(240, 78, 152, 0.3)",
    description: "Classifies severity, identifies affected services, routes to specialists",
    tools: ["error_rate_spike", "search_service_catalog", "search_recent_alerts"],
    avgTime: 14,
  },
  {
    id: "diagnosis",
    name: "Diagnosis Agent",
    icon: "🔬",
    color: "#0077CC",
    bgColor: "rgba(0, 119, 204, 0.1)",
    borderColor: "rgba(0, 119, 204, 0.3)",
    description: "Correlates logs & metrics via ES|QL, identifies root cause",
    tools: [
      "cpu_anomaly",
      "log_correlation",
      "service_latency",
      "memory_pressure",
      "deployment_events",
      "dependency_errors",
      "throughput_drop",
    ],
    avgTime: 30,
  },
  {
    id: "remediation",
    name: "Remediation Agent",
    icon: "🔧",
    color: "#00BFB3",
    bgColor: "rgba(0, 191, 179, 0.1)",
    borderColor: "rgba(0, 191, 179, 0.3)",
    description: "Executes fix actions — rollback, restart, scale, config update",
    tools: ["restart_service", "scale_service", "rollback_deployment", "update_config"],
    avgTime: 30,
  },
  {
    id: "communication",
    name: "Communication Agent",
    icon: "📢",
    color: "#FEC514",
    bgColor: "rgba(254, 197, 20, 0.1)",
    borderColor: "rgba(254, 197, 20, 0.3)",
    description: "Generates incident reports, status updates, and postmortems",
    tools: ["search_incident_history"],
    avgTime: 20,
  },
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: "evt-0",
    phase: "alert",
    timestamp: "14:23:01",
    title: "🚨 CloudWatch Alarm Triggered",
    description: "CPU utilization >95% sustained for 5 minutes on payment-service cluster",
    details: [
      "Host: payment-svc-prod-{1,2,3}",
      "CPU: 97.3%, 96.8%, 95.1%",
      "Memory: 89.2% avg across hosts",
      "Source: CloudWatch → PagerDuty → Incident Commander",
    ],
    icon: "🚨",
    duration: 1,
  },
  {
    id: "evt-1",
    phase: "triage",
    timestamp: "14:23:02",
    title: "🔍 Triage Agent Activated",
    description: "Classifying incident severity and identifying affected services",
    details: [
      "Running error_rate_spike for payment-service...",
      "Found 1,247 errors in last 15 min (12x baseline)",
      "Error types: OutOfMemoryError (847), ConnectionTimeout (400)",
      "Severity: P1 — Critical (user-facing payment failures)",
      "Affected: payment-service, checkout-api, order-processor",
    ],
    agentId: "triage",
    esqlQuery: `FROM logs-payment-service-*
| WHERE @timestamp > NOW() - 15 minutes
  AND log.level IN ("ERROR", "FATAL")
| STATS error_count = COUNT(*) BY error.type
| SORT error_count DESC`,
    icon: "🔍",
    duration: 14,
  },
  {
    id: "evt-2",
    phase: "diagnosis",
    timestamp: "14:23:16",
    title: "🔬 Diagnosis Agent Activated",
    description: "Correlating logs, metrics, and deployments via ES|QL",
    details: [
      "Running cpu_anomaly → 3 hosts above 95th percentile",
      "Running memory_pressure → heap usage 94.7% (critical)",
      "Running log_correlation → OOM errors spike at 14:08",
      "Running deployment_events → v2.14.0 deployed at 14:05",
      "Root cause: Memory leak in payment-service v2.14.0",
      "Correlation: OOM errors began 3 min after v2.14.0 deploy",
    ],
    agentId: "diagnosis",
    esqlQuery: `FROM metrics-system.cpu-*
| WHERE @timestamp > NOW() - 1 hour
  AND host.name LIKE "payment-svc-prod-*"
| EVAL cpu_pct = system.cpu.total.norm.pct * 100
| STATS avg_cpu = AVG(cpu_pct),
        max_cpu = MAX(cpu_pct)
  BY host.name, @timestamp = BUCKET(@timestamp, 1 minute)
| WHERE avg_cpu > 90
| SORT @timestamp DESC`,
    icon: "🔬",
    duration: 30,
  },
  {
    id: "evt-3",
    phase: "remediation",
    timestamp: "14:23:46",
    title: "🔧 Remediation Agent Activated",
    description: "Executing rollback from v2.14.0 to v2.13.2",
    details: [
      "Action: rollback_deployment payment-service v2.13.2",
      "Rolling back host payment-svc-prod-1... ✅",
      "Rolling back host payment-svc-prod-2... ✅",
      "Rolling back host payment-svc-prod-3... ✅",
      "Post-rollback CPU: 34.2%, 31.8%, 29.7% ✅",
      "Post-rollback memory: 52.1% avg ✅",
      "Error rate: 2/min (baseline normal) ✅",
    ],
    agentId: "remediation",
    icon: "🔧",
    duration: 30,
  },
  {
    id: "evt-4",
    phase: "communication",
    timestamp: "14:24:16",
    title: "📢 Communication Agent Activated",
    description: "Generating incident report and postmortem",
    details: [
      "Status: RESOLVED — Payment service restored",
      "Impact: ~3,200 failed transactions over 19 minutes",
      "Root cause: Memory leak in v2.14.0 (PR #1847)",
      "Resolution: Rolled back to v2.13.2",
      "Action items: Fix memory leak, add heap monitoring alert",
      "Postmortem draft sent to #incident-reviews",
    ],
    agentId: "communication",
    icon: "📢",
    duration: 20,
  },
  {
    id: "evt-5",
    phase: "resolved",
    timestamp: "14:24:36",
    title: "✅ Incident Resolved",
    description: "Payment service fully restored — MTTR: 1 minute 55 seconds",
    details: [
      "Total resolution time: 1m 55s",
      "Manual equivalent MTTR: ~45 minutes",
      "Improvement: 95.7% reduction",
      "All 4 agents completed successfully",
      "Zero human intervention required",
    ],
    icon: "✅",
    duration: 0,
  },
];

export const A2A_MESSAGES: A2AMessage[] = [
  {
    id: "msg-0",
    from: "system",
    to: "triage",
    content: "ALERT: CPU >95% on payment-service cluster (3 hosts). Source: CloudWatch.",
    timestamp: "14:23:01",
    type: "alert",
  },
  {
    id: "msg-1",
    from: "triage",
    to: "triage",
    content: "Running error_rate_spike tool... Found 1,247 errors (OOM: 847, ConnTimeout: 400)",
    timestamp: "14:23:05",
    type: "response",
  },
  {
    id: "msg-2",
    from: "triage",
    to: "diagnosis",
    content:
      "HANDOFF: P1 incident — payment-service CPU spike with OOM errors. 3 hosts affected. Investigate root cause.",
    timestamp: "14:23:15",
    type: "handoff",
  },
  {
    id: "msg-3",
    from: "diagnosis",
    to: "diagnosis",
    content: "Running ES|QL correlation: cpu_anomaly → memory_pressure → deployment_events",
    timestamp: "14:23:20",
    type: "response",
  },
  {
    id: "msg-4",
    from: "diagnosis",
    to: "diagnosis",
    content:
      "ROOT CAUSE IDENTIFIED: Memory leak in payment-service v2.14.0 (deployed 14:05). OOM errors began at 14:08.",
    timestamp: "14:23:40",
    type: "response",
  },
  {
    id: "msg-5",
    from: "diagnosis",
    to: "remediation",
    content:
      "HANDOFF: Root cause = memory leak in v2.14.0. Recommend rollback to v2.13.2 (last stable).",
    timestamp: "14:23:45",
    type: "handoff",
  },
  {
    id: "msg-6",
    from: "remediation",
    to: "remediation",
    content: "Executing rollback_deployment: payment-service v2.14.0 → v2.13.2 on 3 hosts...",
    timestamp: "14:23:50",
    type: "response",
  },
  {
    id: "msg-7",
    from: "remediation",
    to: "remediation",
    content: "Rollback complete. CPU: 32% avg, Memory: 52%, Error rate: baseline. All hosts healthy.",
    timestamp: "14:24:10",
    type: "response",
  },
  {
    id: "msg-8",
    from: "remediation",
    to: "communication",
    content:
      "HANDOFF: Incident remediated. Rolled back to v2.13.2. All metrics normalized. Generate report.",
    timestamp: "14:24:15",
    type: "handoff",
  },
  {
    id: "msg-9",
    from: "communication",
    to: "communication",
    content:
      "Generating incident report... Compiling timeline, impact analysis, and postmortem draft.",
    timestamp: "14:24:20",
    type: "response",
  },
  {
    id: "msg-10",
    from: "communication",
    to: "system",
    content:
      "RESOLVED: Incident report published. MTTR: 1m 55s. Postmortem sent to #incident-reviews.",
    timestamp: "14:24:35",
    type: "response",
  },
];

export const METRICS: MetricComparison[] = [
  { label: "Mean Time to Resolution", manual: 45, automated: 1.92, unit: "min" },
  { label: "Detection to Triage", manual: 8, automated: 0.23, unit: "min" },
  { label: "Triage to Diagnosis", manual: 15, automated: 0.5, unit: "min" },
  { label: "Diagnosis to Fix", manual: 18, automated: 0.5, unit: "min" },
  { label: "Fix to Communication", manual: 4, automated: 0.33, unit: "min" },
];

export const PHASE_TIMING: Record<string, number> = {
  idle: 0,
  alert: 1,
  triage: 14,
  diagnosis: 30,
  remediation: 30,
  communication: 20,
  resolved: 0,
};
