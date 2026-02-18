"use client";

import { RECENT_INCIDENTS } from "@/lib/mock-data";
import { cn, formatDate, severityColor } from "@/lib/utils";
import { Clock, CheckCircle2 } from "lucide-react";

export function RecentIncidents() {
  return (
    <div className="card">
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Recent Incidents
      </h2>
      <div className="space-y-3">
        {RECENT_INCIDENTS.map((incident) => (
          <div
            key={incident.id}
            className="rounded-lg border border-gray-800 bg-gray-950/50 p-3 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-start justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className={cn("badge text-[10px]", severityColor(incident.severity))}>
                  {incident.severity}
                </span>
                <span className="text-sm font-medium truncate max-w-[200px]">
                  {incident.title}
                </span>
              </div>
              <span className="badge badge-resolved text-[10px]">
                <CheckCircle2 className="w-2.5 h-2.5" />
                resolved
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>{incident.id}</span>
              <span>{incident.service}</span>
              <span>{formatDate(incident.startedAt)}</span>
              {incident.mttrMinutes && (
                <span className="flex items-center gap-1 text-emerald-500">
                  <Clock className="w-3 h-3" />
                  {incident.mttrMinutes}m
                </span>
              )}
            </div>
            {incident.rootCause && (
              <p className="text-xs text-gray-600 mt-1.5 truncate">
                {incident.rootCause}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
