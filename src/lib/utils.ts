import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return `${diffDays}d ago`;
}

export function severityColor(severity: string): string {
  switch (severity) {
    case "P1":
      return "badge-critical";
    case "P2":
      return "badge-high";
    case "P3":
      return "badge-medium";
    case "P4":
      return "badge-low";
    default:
      return "badge-low";
  }
}

export function agentColor(role: string): string {
  switch (role) {
    case "triage":
      return "#0077CC";
    case "diagnosis":
      return "#FF6C2F";
    case "remediation":
      return "#00BFB3";
    case "communication":
      return "#9170B8";
    default:
      return "#6B7280";
  }
}

export function agentBgClass(role: string): string {
  switch (role) {
    case "triage":
      return "bg-blue-500/20 text-blue-400";
    case "diagnosis":
      return "bg-orange-500/20 text-orange-400";
    case "remediation":
      return "bg-teal-500/20 text-teal-400";
    case "communication":
      return "bg-purple-500/20 text-purple-400";
    default:
      return "bg-gray-500/20 text-gray-400";
  }
}
