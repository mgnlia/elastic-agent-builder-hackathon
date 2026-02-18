import type {
  Agent,
  AgentRole,
  IncidentState,
  TimelineEvent,
  A2AMessage,
  MetricsSnapshot,
} from "./types";

// ── Agent definitions ──────────────────────────────────────────────────────

export const AGENTS: Agent[] = [
  {
    id: "incident_cmd_triage",
    name: "Triage Agent",
    role: "triage",
    status: "idle",
    icon: "🔍",
    tools: ["error_rate_spike", "log_correlation", "network_errors"],
    description: "Classifies alerts, assigns severity, routes to specialists",
    color: "#F04E98",
  },
  {
    id: "incident_cmd_diagnosis",
    name: "Diagnosis Agent",
    role: "diagnosis",
    status: "idle",
    icon: "🔬",
    tools: [
      "error_rate_spike",
      "cpu_anomaly",
      "log_correlation",
      "service_latency",
      "memory_pressure",
      "disk_usage",
      "recent_deployments",
      "network_errors",
    ],
    description: "Correlates logs & metrics via ES|QL to find root cause",
    color: "#0077CC",
  },
  {
    id: "incident_cmd_remediation",
    name: "Remediation Agent",
    role: "remediation",
    status: "idle",
    icon: "🔧",
    tools: [
      "restart_service",
      "scale_service",
      "rollback_deployment",
      "drain_node",
    ],
    description: "Executes fixes — restart, scale, rollback, drain",
    color: "#00BFB3",
  },
  {
    id: "incident_cmd_communication",
    name: "Communication Agent",
    role: "communication",
    status: "idle",
    icon: "📢",
    tools: ["error_rate_spike", "log_correlation"],
    description: "Generates status updates, timelines, postmortems",
    color: "#FEC514",
  },
];

// ── Demo scenario: payment-service CPU spike after bad deploy ──────────────

const BASE_TIME = Date.now();
const sec = (s: number) => BASE_TIME + s * 1000;

export const DEMO_TIMELINE: TimelineEvent[] = [
  {
    id: "t1",
    timestamp: sec(0),
    agent: "triage",
    action: "Alert received",
    detail:
      'PagerDuty alert: "payment-service error rate >5% for 3 consecutive minutes"',
    severity: "P1",
  },
  {
    id: "t2",
    timestamp: sec(3),
    agent: "triage",
    action: "Running ES|QL: error_rate_spike",
    detail:
      "Querying logs-* for error rate spikes across services (30 min window)",
    toolUsed: "error_rate_spike",
  },
  {
    id: "t3",
    timestamp: sec(8),
    agent: "triage",
    action: "Running ES|QL: log_correlation",
    detail:
      "Correlating error/critical logs by service and error type",
    toolUsed: "log_correlation",
  },
  {
    id: "t4",
    timestamp: sec(14),
    agent: "triage",
    action: "Severity classified: P1 Critical",
    detail:
      "payment-service: 847 errors in 5 min, 62% of transactions failing. Blast radius: checkout, refunds, subscriptions.",
    severity: "P1",
  },
  {
    id: "t5",
    timestamp: sec(18),
    agent: "triage",
    action: "Routing to Diagnosis Agent via A2A",
    detail:
      "Structured handoff: service=payment-service, severity=P1, error_type=OutOfMemoryError",
  },
  {
    id: "t6",
    timestamp: sec(22),
    agent: "diagnosis",
    action: "Running ES|QL: cpu_anomaly",
    detail:
      "Checking CPU across all payment-service hosts (15 min window)",
    toolUsed: "cpu_anomaly",
  },
  {
    id: "t7",
    timestamp: sec(27),
    agent: "diagnosis",
    action: "Running ES|QL: memory_pressure",
    detail:
      "Checking memory usage — payment-svc-03: 97.2% memory, payment-svc-01: 94.8%",
    toolUsed: "memory_pressure",
  },
  {
    id: "t8",
    timestamp: sec(33),
    agent: "diagnosis",
    action: "Running ES|QL: recent_deployments",
    detail:
      'Found deployment event: payment-service v2.14.0 → v2.15.0 deployed 47 minutes ago by CI/CD pipeline "deploy-prod-payments"',
    toolUsed: "recent_deployments",
  },
  {
    id: "t9",
    timestamp: sec(40),
    agent: "diagnosis",
    action: "Running ES|QL: service_latency",
    detail:
      "payment-service avg latency: 2,340ms (normal: 180ms). 13x degradation correlates with deploy timestamp.",
    toolUsed: "service_latency",
  },
  {
    id: "t10",
    timestamp: sec(48),
    agent: "diagnosis",
    action: "Root cause identified (HIGH confidence)",
    detail:
      "Memory leak in payment-service v2.15.0 causing OOM errors. Deployed 47 min ago. Recommend: rollback to v2.14.0, then scale to handle backlog.",
  },
  {
    id: "t11",
    timestamp: sec(52),
    agent: "diagnosis",
    action: "Routing to Remediation Agent via A2A",
    detail:
      "Handoff: root_cause=memory_leak, action=rollback+scale, target=payment-service, version=v2.14.0",
  },
  {
    id: "t12",
    timestamp: sec(58),
    agent: "remediation",
    action: "Executing: rollback_deployment",
    detail:
      "Rolling back payment-service from v2.15.0 → v2.14.0 across 4 hosts",
    toolUsed: "rollback_deployment",
  },
  {
    id: "t13",
    timestamp: sec(72),
    agent: "remediation",
    action: "Executing: scale_service",
    detail:
      "Scaling payment-service from 4 → 8 replicas to drain request backlog",
    toolUsed: "scale_service",
  },
  {
    id: "t14",
    timestamp: sec(85),
    agent: "remediation",
    action: "Verifying fix: error_rate_spike",
    detail:
      "Error rate dropping: 5.2% → 1.1% → 0.3%. Memory usage normalizing across all hosts.",
    toolUsed: "error_rate_spike",
  },
  {
    id: "t15",
    timestamp: sec(95),
    agent: "remediation",
    action: "Remediation complete ✓",
    detail:
      "payment-service stable on v2.14.0. Error rate: 0.1%. Latency: 195ms. Scaling back to 4 replicas in 15 min.",
  },
  {
    id: "t16",
    timestamp: sec(100),
    agent: "remediation",
    action: "Routing to Communication Agent via A2A",
    detail:
      "Handoff: status=resolved, actions_taken=[rollback, scale], mttr=4m12s",
  },
  {
    id: "t17",
    timestamp: sec(105),
    agent: "communication",
    action: "Generating incident report",
    detail:
      "Compiling timeline, root cause analysis, and remediation steps into structured postmortem.",
  },
  {
    id: "t18",
    timestamp: sec(115),
    agent: "communication",
    action: "Status update posted",
    detail:
      "✅ RESOLVED: payment-service P1 incident. Root cause: memory leak in v2.15.0. Fix: rollback to v2.14.0. MTTR: 4 min 12 sec (prev avg: 47 min).",
  },
  {
    id: "t19",
    timestamp: sec(120),
    agent: "communication",
    action: "Postmortem generated",
    detail:
      "Full postmortem with timeline, 5-whys analysis, and 3 action items published to incident channel.",
  },
];

export const DEMO_MESSAGES: A2AMessage[] = [
  {
    id: "m1",
    from: "triage",
    to: "diagnosis",
    content:
      "P1 INCIDENT: payment-service — 847 errors/5min, OutOfMemoryError, 62% transaction failure rate. Affected: checkout, refunds, subscriptions.",
    timestamp: sec(18),
    toolUsed: "error_rate_spike",
  },
  {
    id: "m2",
    from: "diagnosis",
    to: "remediation",
    content:
      "ROOT CAUSE (HIGH): Memory leak in payment-service v2.15.0 (deployed 47min ago). OOM killing pods. RECOMMEND: 1) Rollback to v2.14.0, 2) Scale to 8 replicas for backlog.",
    timestamp: sec(52),
    toolUsed: "recent_deployments",
  },
  {
    id: "m3",
    from: "remediation",
    to: "communication",
    content:
      "RESOLVED: Rolled back payment-service v2.15.0→v2.14.0, scaled 4→8 replicas. Error rate 0.1%, latency 195ms. MTTR: 4m12s.",
    timestamp: sec(100),
    toolUsed: "rollback_deployment",
  },
  {
    id: "m4",
    from: "communication",
    to: "triage",
    content:
      "POSTMORTEM PUBLISHED: INC-2026-0218. 5-whys complete. Action items: 1) Add memory limit alerts, 2) Canary deploy for payment-service, 3) Load test v2.15.0 fix.",
    timestamp: sec(120),
  },
];

export const DEMO_METRICS: MetricsSnapshot = {
  mttrBefore: 47,
  mttrAfter: 4.2,
  stepsAutomated: 11,
  stepsTotal: 14,
  errorRate: [
    { time: "-30m", value: 0.1 },
    { time: "-25m", value: 0.2 },
    { time: "-20m", value: 0.3 },
    { time: "-15m", value: 1.2 },
    { time: "-10m", value: 3.8 },
    { time: "-5m", value: 5.2 },
    { time: "0m", value: 5.4 },
    { time: "+2m", value: 3.1 },
    { time: "+4m", value: 1.1 },
    { time: "+5m", value: 0.3 },
    { time: "+7m", value: 0.1 },
    { time: "+10m", value: 0.1 },
  ],
  cpuUsage: [
    { time: "-30m", value: 32 },
    { time: "-25m", value: 35 },
    { time: "-20m", value: 41 },
    { time: "-15m", value: 58 },
    { time: "-10m", value: 76 },
    { time: "-5m", value: 91 },
    { time: "0m", value: 94 },
    { time: "+2m", value: 87 },
    { time: "+4m", value: 62 },
    { time: "+5m", value: 45 },
    { time: "+7m", value: 38 },
    { time: "+10m", value: 33 },
  ],
};

export function createDemoIncident(): IncidentState {
  return {
    id: "INC-2026-0218",
    title: "payment-service P1: OutOfMemoryError after v2.15.0 deploy",
    severity: "P1",
    phase: "alert_received",
    startTime: BASE_TIME,
    affectedService: "payment-service",
    rootCause: "",
    timeline: [],
    messages: [],
    agents: {
      triage: "idle",
      diagnosis: "idle",
      remediation: "idle",
      communication: "idle",
    },
  };
}

// Returns the phase and agent statuses for a given timeline step index
export function getPhaseForStep(
  stepIndex: number
): { phase: IncidentState["phase"]; agents: IncidentState["agents"] } {
  if (stepIndex < 0)
    return {
      phase: "alert_received",
      agents: {
        triage: "idle",
        diagnosis: "idle",
        remediation: "idle",
        communication: "idle",
      },
    };

  const step = DEMO_TIMELINE[stepIndex];
  const agentStatuses: IncidentState["agents"] = {
    triage: "idle",
    diagnosis: "idle",
    remediation: "idle",
    communication: "idle",
  };

  // Mark completed agents
  const seen = new Set<AgentRole>();
  for (let i = 0; i <= stepIndex; i++) {
    seen.add(DEMO_TIMELINE[i].agent);
  }

  // Current agent is active, previous are complete
  const phases: AgentRole[] = ["triage", "diagnosis", "remediation", "communication"];
  for (const role of phases) {
    if (role === step.agent) {
      agentStatuses[role] = "active";
    } else if (seen.has(role) && phases.indexOf(role) < phases.indexOf(step.agent)) {
      agentStatuses[role] = "complete";
    }
  }

  let phase: IncidentState["phase"];
  switch (step.agent) {
    case "triage":
      phase = "triaging";
      break;
    case "diagnosis":
      phase = "diagnosing";
      break;
    case "remediation":
      phase = "remediating";
      break;
    case "communication":
      phase = stepIndex >= DEMO_TIMELINE.length - 1 ? "resolved" : "communicating";
      break;
    default:
      phase = "alert_received";
  }

  return { phase, agents: agentStatuses };
}
