// ── Core Domain Types ──────────────────────────────────────────────────

export type Severity = "P1" | "P2" | "P3" | "P4";
export type AgentId = "triage" | "diagnosis" | "remediation" | "communication";
export type AgentStatus = "idle" | "active" | "processing" | "complete" | "error";
export type IncidentPhase = "alert" | "triage" | "diagnosis" | "remediation" | "communication" | "resolved";

export interface Agent {
  id: AgentId;
  name: string;
  displayName: string;
  icon: string;
  description: string;
  tools: string[];
  status: AgentStatus;
  messagesProcessed: number;
  avgResponseTime: number; // ms
}

export interface A2AMessage {
  id: string;
  timestamp: number;
  from: AgentId | "alert";
  to: AgentId;
  type: "handoff" | "query" | "result" | "action" | "report";
  summary: string;
  payload?: Record<string, unknown>;
  durationMs: number;
}

export interface TimelineEvent {
  id: string;
  timestamp: number;
  phase: IncidentPhase;
  agent?: AgentId;
  title: string;
  description: string;
  tool?: string;
  esqlQuery?: string;
  result?: string;
  severity?: Severity;
  durationMs?: number;
}

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  service: string;
  startTime: number;
  resolvedTime?: number;
  phase: IncidentPhase;
  mttrMinutes?: number;
  rootCause?: string;
  resolution?: string;
  timeline: TimelineEvent[];
  messages: A2AMessage[];
}

export interface MetricsData {
  mttrBefore: number;     // minutes
  mttrAfter: number;      // minutes
  mttrReduction: number;  // percentage
  incidentsResolved: number;
  avgDiagnosisTime: number;   // seconds
  avgRemediationTime: number; // seconds
  agentMessages: number;
  esqlQueriesRun: number;
  automatedActions: number;
}

export interface DemoState {
  isRunning: boolean;
  isPaused: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number; // 1x, 2x, 5x
  incident: Incident;
  agents: Agent[];
  metrics: MetricsData;
}
