// ── Types ──────────────────────────────────────────────────────────────

export type Severity = "P1" | "P2" | "P3" | "P4";
export type IncidentStatus = "active" | "investigating" | "mitigating" | "resolved";
export type AgentRole = "triage" | "diagnosis" | "remediation" | "communication";

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  status: "idle" | "active" | "completed";
  toolsUsed: string[];
  description: string;
  color: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  agent: AgentRole;
  action: string;
  detail: string;
  toolUsed?: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  status: IncidentStatus;
  service: string;
  startedAt: string;
  resolvedAt?: string;
  mttrMinutes?: number;
  rootCause?: string;
  timeline: TimelineEvent[];
}

export interface MetricCard {
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  description?: string;
}

// ── Agents ─────────────────────────────────────────────────────────────

export const AGENTS: Agent[] = [
  {
    id: "triage",
    name: "Triage Agent",
    role: "triage",
    status: "completed",
    toolsUsed: ["error_rate_spike", "search_service_catalog", "search_recent_alerts"],
    description: "Classifies severity, identifies affected services, routes to specialists",
    color: "#0077CC",
  },
  {
    id: "diagnosis",
    name: "Diagnosis Agent",
    role: "diagnosis",
    status: "completed",
    toolsUsed: [
      "error_rate_spike",
      "cpu_anomaly",
      "log_correlation",
      "service_latency",
      "deployment_events",
    ],
    description: "Correlates logs/metrics via ES|QL, identifies root cause",
    color: "#FF6C2F",
  },
  {
    id: "remediation",
    name: "Remediation Agent",
    role: "remediation",
    status: "completed",
    toolsUsed: ["rollback_deployment", "restart_service"],
    description: "Executes fix actions — restart, scale, rollback, config change",
    color: "#00BFB3",
  },
  {
    id: "communication",
    name: "Communication Agent",
    role: "communication",
    status: "completed",
    toolsUsed: ["search_incident_history"],
    description: "Generates status updates, incident timelines, postmortem documents",
    color: "#9170B8",
  },
];

// ── Demo Incident ──────────────────────────────────────────────────────

export const DEMO_INCIDENT: Incident = {
  id: "INC-2026-0218",
  title: "Payment Service Cascading Failure — 500 Error Spike",
  severity: "P1",
  status: "resolved",
  service: "payment-service",
  startedAt: "2026-02-18T14:23:00Z",
  resolvedAt: "2026-02-18T14:28:12Z",
  mttrMinutes: 5,
  rootCause:
    "Deployment v2.14.3 introduced a connection pool exhaustion bug in payment-service, causing cascading 500 errors to checkout-service and order-service.",
  timeline: [
    {
      id: "t1",
      timestamp: "2026-02-18T14:23:00Z",
      agent: "triage",
      action: "Alert Received",
      detail:
        "Elastic Observability alert: error_rate_spike on payment-service. 847 errors in 5 minutes (baseline: 12).",
      toolUsed: "error_rate_spike",
    },
    {
      id: "t2",
      timestamp: "2026-02-18T14:23:08Z",
      agent: "triage",
      action: "Severity Classification",
      detail:
        "Classified as P1-Critical. Payment service is revenue-critical. 3 downstream services affected. Routing to Diagnosis Agent.",
      toolUsed: "search_service_catalog",
    },
    {
      id: "t3",
      timestamp: "2026-02-18T14:23:15Z",
      agent: "triage",
      action: "Duplicate Check",
      detail: "No similar alerts in last 24 hours. This is a novel incident.",
      toolUsed: "search_recent_alerts",
    },
    {
      id: "t4",
      timestamp: "2026-02-18T14:23:22Z",
      agent: "diagnosis",
      action: "Error Correlation",
      detail:
        'ES|QL: FROM logs-* | WHERE service.name == "payment-service" — Found 847 errors, 92% are ConnectionPoolExhausted.',
      toolUsed: "error_rate_spike",
    },
    {
      id: "t5",
      timestamp: "2026-02-18T14:23:45Z",
      agent: "diagnosis",
      action: "Resource Check",
      detail:
        "CPU at 94% on payment-service-node-3. Memory at 87%. Connection pool at 100% capacity (250/250).",
      toolUsed: "cpu_anomaly",
    },
    {
      id: "t6",
      timestamp: "2026-02-18T14:24:10Z",
      agent: "diagnosis",
      action: "Log Correlation",
      detail:
        "Correlated error logs show ConnectionPoolExhausted started exactly at 14:18:00 — matches deployment v2.14.3 rollout completion.",
      toolUsed: "log_correlation",
    },
    {
      id: "t7",
      timestamp: "2026-02-18T14:24:30Z",
      agent: "diagnosis",
      action: "Latency Analysis",
      detail:
        "Service latency spiked from avg 45ms to 2,340ms. P99 at 8,200ms. SLA breach confirmed.",
      toolUsed: "service_latency",
    },
    {
      id: "t8",
      timestamp: "2026-02-18T14:24:55Z",
      agent: "diagnosis",
      action: "Deployment Correlation",
      detail:
        "Deployment v2.14.3 completed at 14:17:42. Error spike started at 14:18:00 (18s after deploy). Root cause: new connection pool config in v2.14.3 reduced max_connections from 500 to 250.",
      toolUsed: "deployment_events",
    },
    {
      id: "t9",
      timestamp: "2026-02-18T14:25:10Z",
      agent: "diagnosis",
      action: "Root Cause Identified",
      detail:
        "ROOT CAUSE: Deployment v2.14.3 halved connection pool size (500 to 250). Under normal load (300 concurrent), pool exhausts immediately. Recommending rollback to v2.14.2.",
    },
    {
      id: "t10",
      timestamp: "2026-02-18T14:25:30Z",
      agent: "remediation",
      action: "Rollback Initiated",
      detail:
        "Rolling back payment-service from v2.14.3 to v2.14.2 across 4 nodes. ETA: 2 minutes.",
      toolUsed: "rollback_deployment",
    },
    {
      id: "t11",
      timestamp: "2026-02-18T14:27:15Z",
      agent: "remediation",
      action: "Rollback Complete",
      detail:
        "Rollback to v2.14.2 complete on all 4 nodes. Connection pool restored to 500. Restarting affected downstream services.",
      toolUsed: "restart_service",
    },
    {
      id: "t12",
      timestamp: "2026-02-18T14:27:45Z",
      agent: "remediation",
      action: "Verification",
      detail:
        "Post-rollback metrics: error rate 0, latency avg 42ms, CPU 34%, connection pool 120/500. All services healthy.",
    },
    {
      id: "t13",
      timestamp: "2026-02-18T14:28:00Z",
      agent: "communication",
      action: "Status Update Published",
      detail:
        "Incident INC-2026-0218 RESOLVED. MTTR: 5 minutes 12 seconds. Root cause: deployment config error. Rollback applied. No data loss.",
      toolUsed: "search_incident_history",
    },
    {
      id: "t14",
      timestamp: "2026-02-18T14:28:12Z",
      agent: "communication",
      action: "Postmortem Generated",
      detail:
        "Postmortem drafted with 3 action items: (1) Add connection pool size to deployment validation checklist, (2) Set up canary deployment for payment-service, (3) Add connection pool utilization alert at 80% threshold.",
    },
  ],
};

// ── Additional Incidents ───────────────────────────────────────────────

export const RECENT_INCIDENTS: Incident[] = [
  DEMO_INCIDENT,
  {
    id: "INC-2026-0217",
    title: "Checkout Service Memory Leak",
    severity: "P2",
    status: "resolved",
    service: "checkout-service",
    startedAt: "2026-02-17T09:15:00Z",
    resolvedAt: "2026-02-17T09:22:30Z",
    mttrMinutes: 7,
    rootCause: "Memory leak in session cache — unbounded growth under load.",
    timeline: [],
  },
  {
    id: "INC-2026-0215",
    title: "CDN Cache Invalidation Storm",
    severity: "P3",
    status: "resolved",
    service: "cdn-edge",
    startedAt: "2026-02-15T16:45:00Z",
    resolvedAt: "2026-02-15T16:58:00Z",
    mttrMinutes: 13,
    rootCause: "Bulk product update triggered full cache purge instead of selective invalidation.",
    timeline: [],
  },
  {
    id: "INC-2026-0212",
    title: "Database Connection Timeout Spike",
    severity: "P2",
    status: "resolved",
    service: "user-service",
    startedAt: "2026-02-12T11:30:00Z",
    resolvedAt: "2026-02-12T11:38:00Z",
    mttrMinutes: 8,
    rootCause: "Connection pool exhaustion due to slow query on user_preferences table.",
    timeline: [],
  },
];

// ── Metrics ────────────────────────────────────────────────────────────

export const METRICS: MetricCard[] = [
  {
    label: "Mean Time To Resolution",
    value: "5.2 min",
    change: "-89%",
    changeType: "positive",
    description: "vs. 45 min industry average",
  },
  {
    label: "Incidents This Week",
    value: "4",
    change: "-33%",
    changeType: "positive",
    description: "vs. 6 last week",
  },
  {
    label: "Auto-Resolved",
    value: "75%",
    change: "+25%",
    changeType: "positive",
    description: "3 of 4 incidents",
  },
  {
    label: "Agent Actions",
    value: "56",
    change: "+12",
    changeType: "neutral",
    description: "ES|QL queries + remediations",
  },
];

// ── MTTR Comparison Data ───────────────────────────────────────────────

export const MTTR_COMPARISON = {
  before: {
    label: "Manual Response",
    avgMinutes: 45,
    steps: [
      { step: "Alert acknowledged", minutes: 5 },
      { step: "Engineer paged", minutes: 8 },
      { step: "Context gathering", minutes: 12 },
      { step: "Root cause found", minutes: 25 },
      { step: "Fix applied", minutes: 35 },
      { step: "Verification", minutes: 40 },
      { step: "Stakeholders notified", minutes: 45 },
    ],
  },
  after: {
    label: "Incident Commander",
    avgMinutes: 5,
    steps: [
      { step: "Alert received + Triage", minutes: 0.1 },
      { step: "Severity classified", minutes: 0.3 },
      { step: "ES|QL correlation", minutes: 1.0 },
      { step: "Root cause identified", minutes: 2.0 },
      { step: "Rollback executed", minutes: 3.5 },
      { step: "Verification", minutes: 4.5 },
      { step: "Postmortem generated", minutes: 5.0 },
    ],
  },
};
