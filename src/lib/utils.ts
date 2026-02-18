import { DemoPhase } from "./types";

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

export function getPhaseIndex(phase: DemoPhase): number {
  const phases: DemoPhase[] = [
    "idle",
    "alert",
    "triage",
    "diagnosis",
    "remediation",
    "communication",
    "resolved",
  ];
  return phases.indexOf(phase);
}

export function phaseToColor(phase: DemoPhase): string {
  switch (phase) {
    case "alert":
      return "#FF6C2F";
    case "triage":
      return "#F04E98";
    case "diagnosis":
      return "#0077CC";
    case "remediation":
      return "#00BFB3";
    case "communication":
      return "#FEC514";
    case "resolved":
      return "#00BFB3";
    default:
      return "#64748b";
  }
}
