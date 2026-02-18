import type {
  Agent,
  Incident,
  TimelineEvent,
  A2AMessage,
  MetricsData,
  DemoState,
} from "./types";

// ── Agent Definitions ─────────────────────────────────────────────────

export const AGENTS: Agent[] = [
  {
    id: "triage",
    name: "Triage Agent",
    displayName: "🔍 Triage",
    icon: "🔍",
    description:
      "Classifies incoming alerts by severity and routes to the appropriate specialist agent.",
    tools: [
      "error_rate_spike",
      "search_service_catalog",
      "search_recent_alerts",
    ],
    status: "idle",
    messagesProcessed: 0,
    avgResponseTime: 0,
  },
  {
    id: "diagnosis",
    name: "Diagnosis Agent",
    displayName: "🔬 Diagnosis",
    icon: "🔬",
    description:
      "Correlates logs and metrics using ES|QL to identify incident root cause.",
    tools: [
      "error_rate_spike",
      "cpu_anomaly",
      "log_correlation",
      "service_latency",
      "memory_pressure",
      "deployment_events",
      "dependency_errors",
      "throughput_drop",
    ],
    status: "idle",
    messagesProcessed: 0,
    avgResponseTime: 0,
  },
  {
    id: "remediation",
    name: "Remediation Agent",
    displayName: "🔧 Remediation",
    icon: "🔧",
    description:
      "Executes remediation actions based on diagnosis — restarts, scales, rolls back.",
    tools: [
      "restart_service",
      "scale_service",
      "rollback_deployment",
      "update_config",
    ],
    status: "idle",
    messagesProcessed: 0,
    avgResponseTime: 0,
  },
  {
    id: "communication",
    name: "Communication Agent",
    displayName: "📢 Communication",
    icon: "📢",
    description:
      "Generates incident reports, status updates, and postmortem documents.",
    tools: ["search_incident_history"],
    status: "idle",
    messagesProcessed: 0,
    avgResponseTime: 0,
  },
];

// ── Demo Scenario: Payment Service CPU Spike ──────────────────────────

const BASE_TIME = Date.now();
const t = (offsetSec: number) => BASE_TIME + offsetSec * 1000;

export const DEMO_TIMELINE: TimelineEvent[] = [
  {
    id: "evt-1",
    timestamp: t(0),
    phase: "alert",
    title: "🚨 Alert: CPU Spike on payment-service",
    description:
      "CloudWatch alarm triggered: payment-service CPU usage exceeded 95% threshold across 3 hosts for >5 minutes.",
    severity: "P1",
  },
  {
    id: "evt-2",
    timestamp: t(8),
    phase: "triage",
    agent: "triage",
    title: "Triage Agent activated",
    description: "Analyzing alert context and checking for related incidents.",
    tool: "search_recent_alerts",
  },
  {
    id: "evt-3",
    timestamp: t(15),
    phase: "triage",
    agent: "triage",
    title: "Severity classified: P1 — Critical",
    description:
      "Payment service is revenue-critical. 3 hosts affected. Error rate spiking 12x baseline. Classified as P1 with immediate routing to Diagnosis.",
    severity: "P1",
    tool: "error_rate_spike",
    esqlQuery: `FROM logs-*
| WHERE @timestamp >= NOW() - 30 MINUTES
| WHERE log.level IN ("error", "critical")
| STATS error_count = COUNT(*) BY service.name, error.type
| SORT error_count DESC
| LIMIT 20`,
    result:
      "payment-service: 1,247 errors (OutOfMemoryError: 892, ConnectionTimeout: 355)",
  },
  {
    id: "evt-4",
    timestamp: t(22),
    phase: "triage",
    agent: "triage",
    title: "Routing to Diagnosis Agent",
    description:
      "Triage complete. Handing off to Diagnosis Agent with structured summary: P1, payment-service, CPU+memory spike, OOM errors.",
    durationMs: 14000,
  },
  {
    id: "evt-5",
    timestamp: t(25),
    phase: "diagnosis",
    agent: "diagnosis",
    title: "Diagnosis Agent activated",
    description:
      "Running ES|QL correlation queries across logs and metrics indices.",
  },
  {
    id: "evt-6",
    timestamp: t(32),
    phase: "diagnosis",
    agent: "diagnosis",
    title: "CPU anomaly detected on 3 hosts",
    description:
      "All 3 payment-service hosts showing CPU >95%. Spike correlates with deployment event 47 minutes ago.",
    tool: "cpu_anomaly",
    esqlQuery: `FROM metrics-*
| WHERE @timestamp >= NOW() - 1 HOUR
| STATS max_cpu = MAX(system.cpu.total.pct) BY host.name
| WHERE max_cpu > 0.9
| SORT max_cpu DESC`,
    result:
      "pay-host-01: 98.2%, pay-host-02: 96.7%, pay-host-03: 95.1%",
  },
  {
    id: "evt-7",
    timestamp: t(40),
    phase: "diagnosis",
    agent: "diagnosis",
    title: "Memory pressure confirmed",
    description:
      "Memory usage at 94-97% across all hosts. Heap exhaustion causing OOM errors.",
    tool: "memory_pressure",
    esqlQuery: `FROM metrics-*
| WHERE @timestamp >= NOW() - 1 HOUR
| STATS max_mem = MAX(system.memory.used.pct) BY host.name
| WHERE max_mem > 0.9
| SORT max_mem DESC`,
    result: "pay-host-01: 97.3%, pay-host-02: 95.8%, pay-host-03: 94.2%",
  },
  {
    id: "evt-8",
    timestamp: t(48),
    phase: "diagnosis",
    agent: "diagnosis",
    title: "Deployment correlation found",
    description:
      "Deployment v2.14.0 rolled out 47 minutes ago. Memory leak introduced in new connection pooling code.",
    tool: "deployment_events",
    esqlQuery: `FROM logs-*
| WHERE @timestamp >= NOW() - 2 HOURS
| WHERE event.category == "deployment"
| STATS deploy_count = COUNT(*) BY service.name, event.action
| SORT deploy_count DESC`,
    result: "payment-service: deploy v2.14.0 at 14:23 UTC (47 min ago)",
  },
  {
    id: "evt-9",
    timestamp: t(55),
    phase: "diagnosis",
    agent: "diagnosis",
    title: "Root cause identified",
    description:
      "Root cause: Memory leak in payment-service v2.14.0 connection pooling. Connections not released after timeout, causing heap exhaustion → OOM → CPU spike from GC thrashing.",
    durationMs: 30000,
  },
  {
    id: "evt-10",
    timestamp: t(60),
    phase: "remediation",
    agent: "remediation",
    title: "Remediation Agent activated",
    description:
      "Received diagnosis: rollback recommended. Evaluating safest remediation path.",
  },
  {
    id: "evt-11",
    timestamp: t(68),
    phase: "remediation",
    agent: "remediation",
    title: "Rolling back to v2.13.2",
    description:
      "Initiating rollback to last known stable version v2.13.2. Rolling restart to avoid service interruption.",
    tool: "rollback_deployment",
    result: "Rollback initiated: payment-service v2.14.0 → v2.13.2",
  },
  {
    id: "evt-12",
    timestamp: t(90),
    phase: "remediation",
    agent: "remediation",
    title: "Rollback complete — metrics normalizing",
    description:
      "All 3 hosts now running v2.13.2. CPU dropping (95% → 42%), memory stabilizing (97% → 68%). Error rate returning to baseline.",
    durationMs: 30000,
  },
  {
    id: "evt-13",
    timestamp: t(95),
    phase: "communication",
    agent: "communication",
    title: "Communication Agent activated",
    description: "Generating incident report and stakeholder notifications.",
  },
  {
    id: "evt-14",
    timestamp: t(105),
    phase: "communication",
    agent: "communication",
    title: "Incident report generated",
    description:
      "Status update sent to #incidents Slack channel. Postmortem draft created with root cause analysis, timeline, and action items.",
    tool: "search_incident_history",
    result:
      "Similar incident INC-2847 (3 months ago) — same service, different root cause. Added to postmortem context.",
  },
  {
    id: "evt-15",
    timestamp: t(115),
    phase: "resolved",
    title: "✅ Incident Resolved — MTTR: 1m 55s",
    description:
      "Incident fully resolved. Payment-service restored to healthy state. MTTR: 1 minute 55 seconds (vs. 45-minute manual average). Postmortem scheduled.",
    durationMs: 115000,
  },
];

export const DEMO_MESSAGES: A2AMessage[] = [
  {
    id: "msg-1",
    timestamp: t(8),
    from: "alert",
    to: "triage",
    type: "handoff",
    summary: "CloudWatch alarm: payment-service CPU >95% on 3 hosts",
    durationMs: 200,
  },
  {
    id: "msg-2",
    timestamp: t(22),
    from: "triage",
    to: "diagnosis",
    type: "handoff",
    summary:
      "P1 — payment-service: CPU spike + 1,247 errors (OOM + ConnTimeout). 3 hosts affected.",
    durationMs: 350,
  },
  {
    id: "msg-3",
    timestamp: t(30),
    from: "diagnosis",
    to: "diagnosis",
    type: "query",
    summary: "Running ES|QL: cpu_anomaly, memory_pressure, deployment_events",
    durationMs: 1200,
  },
  {
    id: "msg-4",
    timestamp: t(55),
    from: "diagnosis",
    to: "remediation",
    type: "handoff",
    summary:
      "Root cause: memory leak in v2.14.0 connection pooling. Recommend: rollback to v2.13.2.",
    durationMs: 280,
  },
  {
    id: "msg-5",
    timestamp: t(68),
    from: "remediation",
    to: "remediation",
    type: "action",
    summary: "Executing rollback: payment-service v2.14.0 → v2.13.2",
    durationMs: 22000,
  },
  {
    id: "msg-6",
    timestamp: t(90),
    from: "remediation",
    to: "communication",
    type: "handoff",
    summary:
      "Rollback complete. CPU: 95%→42%, Memory: 97%→68%, Errors: baseline. Service healthy.",
    durationMs: 310,
  },
  {
    id: "msg-7",
    timestamp: t(105),
    from: "communication",
    to: "communication",
    type: "report",
    summary:
      "Incident report + postmortem generated. MTTR: 1m 55s. Action items: fix connection pool leak in v2.14.1.",
    durationMs: 8000,
  },
];

export const DEMO_INCIDENT: Incident = {
  id: "INC-3142",
  title: "Payment Service CPU Spike — OOM from Connection Pool Leak",
  severity: "P1",
  service: "payment-service",
  startTime: t(0),
  resolvedTime: t(115),
  phase: "alert",
  mttrMinutes: 1.92,
  rootCause:
    "Memory leak in v2.14.0 connection pooling code — connections not released after timeout, causing heap exhaustion and GC thrashing.",
  resolution:
    "Rolled back to v2.13.2. All metrics normalized within 30 seconds of rollback completion.",
  timeline: DEMO_TIMELINE,
  messages: DEMO_MESSAGES,
};

export const DEMO_METRICS: MetricsData = {
  mttrBefore: 45,
  mttrAfter: 1.92,
  mttrReduction: 95.7,
  incidentsResolved: 47,
  avgDiagnosisTime: 30,
  avgRemediationTime: 30,
  agentMessages: 7,
  esqlQueriesRun: 5,
  automatedActions: 2,
};

export function createInitialDemoState(): DemoState {
  return {
    isRunning: false,
    isPaused: false,
    currentStep: 0,
    totalSteps: DEMO_TIMELINE.length,
    speed: 1,
    incident: { ...DEMO_INCIDENT, phase: "alert", timeline: [], messages: [] },
    agents: AGENTS.map((a) => ({ ...a })),
    metrics: { ...DEMO_METRICS },
  };
}

// Step delays in ms (at 1x speed) — how long to wait before showing each step
export const STEP_DELAYS: number[] = [
  2000, // Alert received
  3000, // Triage activates
  4000, // Severity classified
  3000, // Routing to diagnosis
  2000, // Diagnosis activates
  4000, // CPU anomaly
  4000, // Memory pressure
  4000, // Deployment correlation
  3000, // Root cause
  2000, // Remediation activates
  4000, // Rolling back
  6000, // Rollback complete
  2000, // Communication activates
  4000, // Report generated
  3000, // Resolved
];
