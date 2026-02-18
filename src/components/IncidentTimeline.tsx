"use client";

import { DEMO_INCIDENT } from "@/lib/mock-data";
import { cn, formatTime, agentBgClass, severityColor } from "@/lib/utils";
import { Clock, Wrench, CheckCircle2, AlertOctagon } from "lucide-react";

export function IncidentTimeline() {
  const incident = DEMO_INCIDENT;

  return (
    <div className="card">
      {/* Incident Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("badge", severityColor(incident.severity))}>
              <AlertOctagon className="w-3 h-3" />
              {incident.severity}
            </span>
            <span className="badge badge-resolved">
              <CheckCircle2 className="w-3 h-3" />
              {incident.status}
            </span>
          </div>
          <h2 className="text-lg font-semibold mt-2">{incident.title}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {incident.id} • {incident.service}
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Clock className="w-4 h-4" />
            <span className="text-xl font-bold">{incident.mttrMinutes}m 12s</span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">MTTR</p>
        </div>
      </div>

      {/* Root Cause */}
      {incident.rootCause && (
        <div className="rounded-lg bg-red-500/5 border border-red-500/20 p-3 mb-5">
          <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-1">
            Root Cause
          </p>
          <p className="text-sm text-gray-300">{incident.rootCause}</p>
        </div>
      )}

      {/* Timeline */}
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Incident Timeline
      </h3>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-blue-500/50 via-orange-500/50 via-teal-500/50 to-purple-500/50" />

        <div className="space-y-0">
          {incident.timeline.map((event, i) => (
            <div
              key={event.id}
              className="relative flex gap-4 py-2.5 animate-slide-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Dot */}
              <div className="relative z-10 flex-shrink-0 mt-1">
                <div
                  className={cn(
                    "w-[10px] h-[10px] rounded-full border-2 bg-gray-950",
                    event.agent === "triage" && "border-blue-500",
                    event.agent === "diagnosis" && "border-orange-500",
                    event.agent === "remediation" && "border-teal-500",
                    event.agent === "communication" && "border-purple-500"
                  )}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs text-gray-600 font-mono">
                    {formatTime(event.timestamp)}
                  </span>
                  <span
                    className={cn(
                      "badge text-[10px]",
                      agentBgClass(event.agent)
                    )}
                  >
                    {event.agent}
                  </span>
                  {event.toolUsed && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] text-gray-600">
                      <Wrench className="w-2.5 h-2.5" />
                      {event.toolUsed}
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-200">
                  {event.action}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  {event.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
