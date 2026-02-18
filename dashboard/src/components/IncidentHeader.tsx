"use client";

import { cn } from "@/lib/cn";
import type { IncidentState } from "@/lib/types";

const phaseLabels: Record<IncidentState["phase"], string> = {
  alert_received: "Alert Received",
  triaging: "Triaging",
  diagnosing: "Diagnosing",
  remediating: "Remediating",
  communicating: "Communicating",
  resolved: "✅ Resolved",
};

const phaseColors: Record<IncidentState["phase"], string> = {
  alert_received: "text-red-400",
  triaging: "text-pink-400",
  diagnosing: "text-blue-400",
  remediating: "text-teal-400",
  communicating: "text-yellow-400",
  resolved: "text-emerald-400",
};

interface IncidentHeaderProps {
  incident: IncidentState;
  elapsedSeconds: number;
}

export default function IncidentHeader({
  incident,
  elapsedSeconds,
}: IncidentHeaderProps) {
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const elapsed = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-xl font-bold">🚨 Incident Commander</h1>
          <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400 font-bold">
            {incident.severity}
          </span>
          <span className={cn("text-sm font-medium", phaseColors[incident.phase])}>
            {phaseLabels[incident.phase]}
          </span>
        </div>
        <p className="text-sm text-gray-400">{incident.title}</p>
      </div>

      <div className="text-right">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-gray-500">
            Incident
          </span>
          <span className="text-sm font-mono text-gray-300">{incident.id}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] uppercase tracking-wider text-gray-500">
            Elapsed
          </span>
          <span
            className={cn(
              "text-lg font-mono font-bold tabular-nums",
              incident.phase === "resolved" ? "text-emerald-400" : "text-gray-200"
            )}
          >
            {elapsed}
          </span>
        </div>
      </div>
    </div>
  );
}
