import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Severity, AgentId, IncidentPhase } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(ms: number): string {
  const date = new Date(ms);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

export function formatRelativeTime(ms: number, now: number): string {
  const diff = now - ms;
  if (diff < 1000) return "just now";
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  return `${Math.floor(diff / 3600000)}h ago`;
}

export function severityColor(severity: Severity): string {
  switch (severity) {
    case "P1": return "text-elastic-red";
    case "P2": return "text-elastic-orange";
    case "P3": return "text-elastic-yellow";
    case "P4": return "text-elastic-green";
  }
}

export function severityBadge(severity: Severity): string {
  switch (severity) {
    case "P1": return "badge-critical";
    case "P2": return "badge-high";
    case "P3": return "badge-medium";
    case "P4": return "badge-low";
  }
}

export function agentColor(agent: AgentId): string {
  switch (agent) {
    case "triage": return "#0077CC";
    case "diagnosis": return "#00BFB3";
    case "remediation": return "#F5A623";
    case "communication": return "#B298DC";
  }
}

export function agentBgClass(agent: AgentId): string {
  switch (agent) {
    case "triage": return "bg-elastic-blue/20 border-elastic-blue/40";
    case "diagnosis": return "bg-elastic-accent/20 border-elastic-accent/40";
    case "remediation": return "bg-elastic-orange/20 border-elastic-orange/40";
    case "communication": return "bg-elastic-purple/20 border-elastic-purple/40";
  }
}

export function phaseLabel(phase: IncidentPhase): string {
  switch (phase) {
    case "alert": return "Alert Received";
    case "triage": return "Triage";
    case "diagnosis": return "Diagnosis";
    case "remediation": return "Remediation";
    case "communication": return "Communication";
    case "resolved": return "Resolved";
  }
}

export function phaseAgent(phase: IncidentPhase): AgentId | undefined {
  switch (phase) {
    case "triage": return "triage";
    case "diagnosis": return "diagnosis";
    case "remediation": return "remediation";
    case "communication": return "communication";
    default: return undefined;
  }
}
