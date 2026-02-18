export type AgentId = "triage" | "diagnosis" | "remediation" | "communication";

export type Severity = "P1" | "P2" | "P3" | "P4";

export type DemoPhase =
  | "idle"
  | "alert"
  | "triage"
  | "diagnosis"
  | "remediation"
  | "communication"
  | "resolved";

export interface Agent {
  id: AgentId;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  tools: string[];
  avgTime: number; // seconds
}

export interface TimelineEvent {
  id: string;
  phase: DemoPhase;
  timestamp: string;
  title: string;
  description: string;
  details?: string[];
  agentId?: AgentId;
  esqlQuery?: string;
  duration?: number; // seconds
  icon: string;
}

export interface A2AMessage {
  id: string;
  from: AgentId | "system";
  to: AgentId | "system";
  content: string;
  timestamp: string;
  type: "request" | "response" | "alert" | "handoff";
}

export interface MetricComparison {
  label: string;
  manual: number;
  automated: number;
  unit: string;
}

export interface DemoState {
  phase: DemoPhase;
  isPlaying: boolean;
  speed: number; // 1x, 2x, 4x
  currentEventIndex: number;
  elapsedTime: number;
  events: TimelineEvent[];
  messages: A2AMessage[];
  activeAgent: AgentId | null;
}
