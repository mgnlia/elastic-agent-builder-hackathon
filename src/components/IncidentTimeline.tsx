"use client";

import { useEffect, useRef } from "react";
import type { TimelineEvent, AgentId } from "@/lib/types";
import { formatTime, severityBadge, agentColor } from "@/lib/utils";
import {
  AlertTriangle,
  Search,
  Microscope,
  Wrench,
  Megaphone,
  CheckCircle2,
  Terminal,
  Database,
} from "lucide-react";

function PhaseIcon({ phase, agent }: { phase: string; agent?: AgentId }) {
  const iconClass = "w-5 h-5";
  switch (phase) {
    case "alert":
      return <AlertTriangle className={`${iconClass} text-elastic-red`} />;
    case "triage":
      return <Search className={`${iconClass} text-elastic-blue`} />;
    case "diagnosis":
      return <Microscope className={`${iconClass} text-elastic-accent`} />;
    case "remediation":
      return <Wrench className={`${iconClass} text-elastic-orange`} />;
    case "communication":
      return <Megaphone className={`${iconClass} text-elastic-purple`} />;
    case "resolved":
      return <CheckCircle2 className={`${iconClass} text-elastic-green`} />;
    default:
      return <Database className={`${iconClass} text-elastic-muted`} />;
  }
}

function phaseLineColor(phase: string): string {
  switch (phase) {
    case "alert":
      return "bg-elastic-red/40";
    case "triage":
      return "bg-elastic-blue/40";
    case "diagnosis":
      return "bg-elastic-accent/40";
    case "remediation":
      return "bg-elastic-orange/40";
    case "communication":
      return "bg-elastic-purple/40";
    case "resolved":
      return "bg-elastic-green/40";
    default:
      return "bg-elastic-border";
  }
}

interface IncidentTimelineProps {
  events: TimelineEvent[];
  currentStep: number;
}

export function IncidentTimeline({ events, currentStep }: IncidentTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastEventRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastEventRef.current) {
      lastEventRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [events.length]);

  return (
    <div className="card h-full flex flex-col">
      <div className="card-header flex-shrink-0">
        <h2 className="card-title flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-elastic-red" />
          Incident Timeline
        </h2>
        <span className="text-xs text-elastic-muted">
          {events.length} events
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-0 min-h-0 pr-1"
      >
        {events.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-elastic-muted">
            <AlertTriangle className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-sm">Start the demo to see the incident timeline</p>
          </div>
        )}

        {events.map((event, idx) => {
          const isLast = idx === events.length - 1;
          const isNew = idx === currentStep - 1;

          return (
            <div
              key={event.id}
              ref={isLast ? lastEventRef : undefined}
              className={`relative pl-8 pb-4 ${
                isNew ? "animate-slide-up" : ""
              }`}
            >
              {/* Timeline line */}
              {!isLast && (
                <div
                  className={`absolute left-[15px] top-8 bottom-0 w-0.5 ${phaseLineColor(
                    event.phase
                  )}`}
                />
              )}

              {/* Timeline dot */}
              <div
                className={`absolute left-[8px] top-1.5 w-[15px] h-[15px] rounded-full border-2 flex items-center justify-center ${
                  event.phase === "resolved"
                    ? "bg-elastic-green/20 border-elastic-green"
                    : event.phase === "alert"
                    ? "bg-elastic-red/20 border-elastic-red"
                    : "bg-elastic-card border-elastic-border"
                } ${isNew ? "ring-2 ring-elastic-accent/50 ring-offset-1 ring-offset-elastic-card" : ""}`}
              >
                <div
                  className={`w-[5px] h-[5px] rounded-full ${
                    event.phase === "resolved"
                      ? "bg-elastic-green"
                      : event.phase === "alert"
                      ? "bg-elastic-red"
                      : "bg-elastic-accent"
                  }`}
                />
              </div>

              {/* Content */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-elastic-muted font-mono">
                    {formatTime(event.timestamp)}
                  </span>
                  {event.severity && (
                    <span className={`badge ${severityBadge(event.severity)}`}>
                      {event.severity}
                    </span>
                  )}
                  {event.agent && (
                    <span
                      className="badge"
                      style={{
                        backgroundColor: `${agentColor(event.agent)}20`,
                        color: agentColor(event.agent),
                      }}
                    >
                      {event.agent}
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-semibold text-elastic-text">
                  {event.title}
                </h4>

                <p className="text-xs text-elastic-muted leading-relaxed">
                  {event.description}
                </p>

                {/* ES|QL Query */}
                {event.esqlQuery && (
                  <div className="mt-2 bg-elastic-darker rounded-lg border border-elastic-border overflow-hidden">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-elastic-border bg-elastic-dark/50">
                      <Terminal className="w-3 h-3 text-elastic-accent" />
                      <span className="text-[10px] font-medium text-elastic-accent uppercase tracking-wider">
                        ES|QL
                      </span>
                    </div>
                    <pre className="px-3 py-2 text-[11px] text-elastic-green/90 font-mono overflow-x-auto whitespace-pre-wrap">
                      {event.esqlQuery}
                    </pre>
                  </div>
                )}

                {/* Result */}
                {event.result && (
                  <div className="mt-1.5 px-3 py-2 bg-elastic-darker/60 rounded-lg border border-elastic-border/50">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Database className="w-3 h-3 text-elastic-yellow" />
                      <span className="text-[10px] font-medium text-elastic-yellow uppercase tracking-wider">
                        Result
                      </span>
                    </div>
                    <p className="text-xs text-elastic-text/80 font-mono">
                      {event.result}
                    </p>
                  </div>
                )}

                {/* Duration */}
                {event.durationMs && (
                  <div className="flex items-center gap-1 text-[10px] text-elastic-muted">
                    <span>⏱</span>
                    <span>
                      {event.durationMs < 1000
                        ? `${event.durationMs}ms`
                        : `${(event.durationMs / 1000).toFixed(1)}s`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
