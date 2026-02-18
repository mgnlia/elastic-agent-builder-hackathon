// ── Mock scenario data for the Payment Service CPU Spike incident ──

export type AgentId = "triage" | "diagnosis" | "remediation" | "communication";
export type Phase = "idle" | "alert" | "triage" | "diagnosis" | "remediation" | "communication" | "resolved";

export interface TimelineEvent {
  id: string;
  timestamp: string;       // relative time string
  phase: Phase;
  agent?: AgentId;
  title: string;
  detail: string;
  icon: "alert" | "search" | "cpu" | "code" | "rollback" | "check" | "report" | "shield";
  durationLabel?: string;
}

export interface AgentMessage {
  id: string;
  from: AgentId | "system";
  to: AgentId | "system";
  phase: Phase;
  content: string;
  timestamp: string;
  type: "request" | "response" | "handoff" | "alert";
}

export interface AgentInfo {
  id: AgentId;
  name: string;
  role: string;
  color: string;        // tailwind color class
  bgColor: string;
  borderColor: string;
  dotColor: string;
  icon: string;
  duration: number;      // seconds
}

export const AGENTS: AgentInfo[] = [
  {
    id: "triage",
    name: "Triage Agent",
    role: "Alert Classification & Prioritization",
    color: "text-accent-triage",
    bgColor: "bg-accent-triage/10",
    borderColor: "border-accent-triage/30",
    dotColor: "bg-accent-triage",
    icon: "🔍",
    duration: 14,
  },
  {
    id: "diagnosis",
    name: "Diagnosis Agent",
    role: "Root Cause Analysis via ES|QL",
    color: "text-accent-diagnosis",
    bgColor: "bg-accent-diagnosis/10",
    borderColor: "border-accent-diagnosis/30",
    dotColor: "bg-accent-diagnosis",
    icon: "🧠",
    duration: 30,
  },
  {
    id: "remediation",
    name: "Remediation Agent",
    role: "Automated Rollback & Recovery",
    color: "text-accent-remediation",
    bgColor: "bg-accent-remediation/10",
    borderColor: "border-accent-remediation/30",
    dotColor: "bg-accent-remediation",
    icon: "⚡",
    duration: 30,
  },
  {
    id: "communication",
    name: "Comms Agent",
    role: "Incident Reporting & Notification",
    color: "text-accent-communication",
    bgColor: "bg-accent-communication/10",
    borderColor: "border-accent-communication/30",
    dotColor: "bg-accent-communication",
    icon: "📡",
    duration: 20,
  },
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: "evt-1",
    timestamp: "00:00",
    phase: "alert",
    title: "CloudWatch Alarm Triggered",
    detail: "CPU utilization >95% on 3 payment-service hosts (us-east-1a/b/c). Auto-scaling group saturated.",
    icon: "alert",
  },
  {
    id: "evt-2",
    timestamp: "00:02",
    phase: "triage",
    agent: "triage",
    title: "Alert Ingested — Triage Started",
    detail: "Elastic Agent Builder receives alert via webhook. Triage Agent activated.",
    icon: "search",
    durationLabel: "14s",
  },
  {
    id: "evt-3",
    timestamp: "00:05",
    phase: "triage",
    agent: "triage",
    title: "Classified P1 — Critical",
    detail: "1,247 errors in last 5 min: OutOfMemoryError (834), ConnectionTimeoutException (413). Service: payment-processor.",
    icon: "cpu",
    durationLabel: "14s",
  },
  {
    id: "evt-4",
    timestamp: "00:14",
    phase: "triage",
    agent: "triage",
    title: "Triage Complete → Handoff",
    detail: "P1 classification confirmed. Error correlation package sent to Diagnosis Agent via A2A protocol.",
    icon: "check",
    durationLabel: "14s",
  },
  {
    id: "evt-5",
    timestamp: "00:15",
    phase: "diagnosis",
    agent: "diagnosis",
    title: "Diagnosis Agent Activated",
    detail: "Querying Elasticsearch with ES|QL: correlating deployment events, error spikes, and resource metrics.",
    icon: "search",
    durationLabel: "30s",
  },
  {
    id: "evt-6",
    timestamp: "00:30",
    phase: "diagnosis",
    agent: "diagnosis",
    title: "Root Cause Identified",
    detail: "ES|QL correlation: memory leak introduced in payment-service v2.14.0 (deployed 47min ago). Heap usage 94% → OOM cascade.",
    icon: "code",
    durationLabel: "30s",
  },
  {
    id: "evt-7",
    timestamp: "00:44",
    phase: "diagnosis",
    agent: "diagnosis",
    title: "Diagnosis Complete → Handoff",
    detail: "Root cause: v2.14.0 memory leak. Recommended action: rollback to v2.13.2. Sent to Remediation Agent.",
    icon: "check",
    durationLabel: "30s",
  },
  {
    id: "evt-8",
    timestamp: "00:45",
    phase: "remediation",
    agent: "remediation",
    title: "Remediation Agent Activated",
    detail: "Initiating automated rollback: payment-service v2.14.0 → v2.13.2 across 3 hosts.",
    icon: "rollback",
    durationLabel: "30s",
  },
  {
    id: "evt-9",
    timestamp: "01:00",
    phase: "remediation",
    agent: "remediation",
    title: "Rollback Deployed",
    detail: "v2.13.2 deployed to us-east-1a/b/c. Health checks passing. CPU normalizing: 95% → 42% → 18%.",
    icon: "check",
    durationLabel: "30s",
  },
  {
    id: "evt-10",
    timestamp: "01:15",
    phase: "remediation",
    agent: "remediation",
    title: "Remediation Complete → Handoff",
    detail: "All metrics normalized. Error rate: 0. CPU: 18%. Memory: 54%. Handoff to Communication Agent.",
    icon: "check",
    durationLabel: "30s",
  },
  {
    id: "evt-11",
    timestamp: "01:16",
    phase: "communication",
    agent: "communication",
    title: "Communication Agent Activated",
    detail: "Generating incident report, stakeholder notifications, and postmortem draft.",
    icon: "report",
    durationLabel: "20s",
  },
  {
    id: "evt-12",
    timestamp: "01:30",
    phase: "communication",
    agent: "communication",
    title: "Notifications Sent",
    detail: "Slack: #incidents, #platform-eng. PagerDuty: incident resolved. Jira: INC-4521 updated.",
    icon: "report",
    durationLabel: "20s",
  },
  {
    id: "evt-13",
    timestamp: "01:55",
    phase: "resolved",
    title: "Incident Resolved ✓",
    detail: "Total MTTR: 1 minute 55 seconds. Postmortem generated. All agents returned to standby.",
    icon: "shield",
  },
];

export const AGENT_MESSAGES: AgentMessage[] = [
  {
    id: "msg-1",
    from: "system",
    to: "triage",
    phase: "alert",
    content: "ALERT: CloudWatch alarm — CPU >95% on payment-service (3 hosts)",
    timestamp: "00:00",
    type: "alert",
  },
  {
    id: "msg-2",
    from: "triage",
    to: "system",
    phase: "triage",
    content: "Ingesting alert... querying Elasticsearch for correlated errors",
    timestamp: "00:02",
    type: "response",
  },
  {
    id: "msg-3",
    from: "triage",
    to: "system",
    phase: "triage",
    content: "Found 1,247 errors: OOM (834) + ConnectionTimeout (413). Classifying as P1.",
    timestamp: "00:08",
    type: "response",
  },
  {
    id: "msg-4",
    from: "triage",
    to: "diagnosis",
    phase: "triage",
    content: "A2A Handoff → P1 incident package: error signatures, affected hosts, metric snapshots",
    timestamp: "00:14",
    type: "handoff",
  },
  {
    id: "msg-5",
    from: "diagnosis",
    to: "system",
    phase: "diagnosis",
    content: "Running ES|QL: FROM logs-* | WHERE service.name == \"payment-service\" | STATS count(*) BY error.type",
    timestamp: "00:16",
    type: "response",
  },
  {
    id: "msg-6",
    from: "diagnosis",
    to: "system",
    phase: "diagnosis",
    content: "Correlating deployment events with error spike... found v2.14.0 deployed 47min ago",
    timestamp: "00:25",
    type: "response",
  },
  {
    id: "msg-7",
    from: "diagnosis",
    to: "system",
    phase: "diagnosis",
    content: "Root cause: memory leak in v2.14.0 — heap usage 94%, GC thrashing detected",
    timestamp: "00:35",
    type: "response",
  },
  {
    id: "msg-8",
    from: "diagnosis",
    to: "remediation",
    phase: "diagnosis",
    content: "A2A Handoff → Root cause: v2.14.0 memory leak. Recommend rollback to v2.13.2",
    timestamp: "00:44",
    type: "handoff",
  },
  {
    id: "msg-9",
    from: "remediation",
    to: "system",
    phase: "remediation",
    content: "Initiating rollback: payment-service v2.14.0 → v2.13.2 on 3 hosts",
    timestamp: "00:46",
    type: "response",
  },
  {
    id: "msg-10",
    from: "remediation",
    to: "system",
    phase: "remediation",
    content: "Deploy complete. Running health checks... all endpoints returning 200 OK",
    timestamp: "01:00",
    type: "response",
  },
  {
    id: "msg-11",
    from: "remediation",
    to: "system",
    phase: "remediation",
    content: "Metrics normalized — CPU: 18%, Memory: 54%, Error rate: 0/min",
    timestamp: "01:10",
    type: "response",
  },
  {
    id: "msg-12",
    from: "remediation",
    to: "communication",
    phase: "remediation",
    content: "A2A Handoff → Incident remediated. Rollback successful. Generate report.",
    timestamp: "01:15",
    type: "handoff",
  },
  {
    id: "msg-13",
    from: "communication",
    to: "system",
    phase: "communication",
    content: "Generating incident report and postmortem draft...",
    timestamp: "01:17",
    type: "response",
  },
  {
    id: "msg-14",
    from: "communication",
    to: "system",
    phase: "communication",
    content: "Notifications sent: Slack (#incidents, #platform-eng), PagerDuty (resolved), Jira (INC-4521)",
    timestamp: "01:30",
    type: "response",
  },
  {
    id: "msg-15",
    from: "communication",
    to: "system",
    phase: "resolved",
    content: "✅ Incident INC-4521 RESOLVED — MTTR: 1m 55s — Postmortem: draft ready for review",
    timestamp: "01:55",
    type: "response",
  },
];

// Phase ordering for progression
export const PHASE_ORDER: Phase[] = [
  "idle",
  "alert",
  "triage",
  "diagnosis",
  "remediation",
  "communication",
  "resolved",
];

// Phase durations in seconds (for demo playback)
export const PHASE_DURATIONS: Record<Phase, number> = {
  idle: 0,
  alert: 2,
  triage: 14,
  diagnosis: 30,
  remediation: 30,
  communication: 20,
  resolved: 0,
};

// Metrics data
export const METRICS = {
  manual: {
    mttr: 45 * 60,       // 45 minutes in seconds
    label: "45 min",
    steps: [
      { name: "Alert Detection", duration: "5 min" },
      { name: "On-call Response", duration: "8 min" },
      { name: "Manual Triage", duration: "7 min" },
      { name: "Root Cause Analysis", duration: "12 min" },
      { name: "Remediation", duration: "8 min" },
      { name: "Verification", duration: "3 min" },
      { name: "Communication", duration: "2 min" },
    ],
  },
  automated: {
    mttr: 115,            // 1m 55s
    label: "1m 55s",
    steps: [
      { name: "Alert Ingestion", duration: "2s" },
      { name: "AI Triage", duration: "14s" },
      { name: "AI Diagnosis", duration: "30s" },
      { name: "AI Remediation", duration: "30s" },
      { name: "AI Verification", duration: "19s" },
      { name: "AI Comms", duration: "20s" },
    ],
  },
  reduction: 95.7,
};
