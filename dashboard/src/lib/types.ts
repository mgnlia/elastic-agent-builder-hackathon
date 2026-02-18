export type Severity = "P1" | "P2" | "P3" | "P4";
export type AgentRole = "triage" | "diagnosis" | "remediation" | "communication";
export type AgentStatus = "idle" | "active" | "complete" | "waiting";
export type IncidentPhase =
  | "alert_received"
  | "triaging"
  | "diagnosing"
  | "remediating"
  | "communicating"
  | "resolved";

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  status: AgentStatus;
  icon: string;
  tools: string[];
  description: string;
  color: string;
}

export interface A2AMessage {
  id: string;
  from: AgentRole;
  to: AgentRole;
  content: string;
  timestamp: number;
  toolUsed?: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: number;
  agent: AgentRole;
  action: string;
  detail: string;
  toolUsed?: string;
  severity?: Severity;
}

export interface IncidentState {
  id: string;
  title: string;
  severity: Severity;
  phase: IncidentPhase;
  startTime: number;
  resolveTime?: number;
  mttr?: number;
  affectedService: string;
  rootCause: string;
  timeline: TimelineEvent[];
  messages: A2AMessage[];
  agents: Record<AgentRole, AgentStatus>;
}

export interface MetricsSnapshot {
  mttrBefore: number; // minutes
  mttrAfter: number;
  stepsAutomated: number;
  stepsTotal: number;
  errorRate: { time: string; value: number }[];
  cpuUsage: { time: string; value: number }[];
}
