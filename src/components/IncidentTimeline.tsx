"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect } from "react";
import { Phase, TimelineEvent } from "@/data/scenario";

interface IncidentTimelineProps {
  events: TimelineEvent[];
  currentPhase: Phase;
}

const iconMap: Record<string, JSX.Element> = {
  alert: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  search: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  cpu: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  ),
  code: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  rollback: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  ),
  check: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  report: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  shield: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
};

const phaseLineColors: Record<string, string> = {
  alert: "border-red-500/50",
  triage: "border-accent-triage/50",
  diagnosis: "border-accent-diagnosis/50",
  remediation: "border-accent-remediation/50",
  communication: "border-accent-communication/50",
  resolved: "border-emerald-500/50",
};

const phaseIconBg: Record<string, string> = {
  alert: "bg-red-500/20 text-red-400",
  triage: "bg-accent-triage/20 text-accent-triage",
  diagnosis: "bg-accent-diagnosis/20 text-accent-diagnosis",
  remediation: "bg-accent-remediation/20 text-accent-remediation",
  communication: "bg-accent-communication/20 text-accent-communication",
  resolved: "bg-emerald-500/20 text-emerald-400",
};

export default function IncidentTimeline({ events, currentPhase }: IncidentTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events.length]);

  return (
    <div className="h-full flex flex-col rounded-xl bg-surface-1 border border-surface-3 overflow-hidden">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-3 bg-surface-2/50">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-elastic-teal animate-pulse" />
          <h2 className="text-xs font-mono font-semibold text-gray-300 tracking-wider uppercase">
            Incident Timeline
          </h2>
        </div>
        <span className="text-[10px] font-mono text-gray-600">
          {events.length} events
        </span>
      </div>

      {/* Events list */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-0">
        {events.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-600">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-2 opacity-40">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <p className="text-xs font-mono">Waiting for incident...</p>
            <p className="text-[10px] font-mono mt-1">Press START DEMO to begin</p>
          </div>
        )}

        <AnimatePresence>
          {events.map((event, idx) => {
            const isLast = idx === events.length - 1;
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative flex gap-3"
              >
                {/* Timeline line + dot */}
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${phaseIconBg[event.phase] || "bg-surface-3 text-gray-500"} ${isLast ? "ring-2 ring-offset-1 ring-offset-surface-1" : ""}`}
                    style={isLast ? { ringColor: "currentColor" } : {}}
                  >
                    {iconMap[event.icon]}
                  </div>
                  {idx < events.length - 1 && (
                    <div className={`w-px flex-1 min-h-[16px] border-l-2 border-dashed ${phaseLineColors[event.phase] || "border-surface-4"} my-1`} />
                  )}
                </div>

                {/* Content */}
                <div className={`flex-1 pb-3 ${isLast ? "" : ""}`}>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`text-xs font-semibold leading-tight ${isLast ? "text-gray-100" : "text-gray-300"}`}>
                      {event.title}
                    </h3>
                    <span className="text-[10px] font-mono text-gray-600 shrink-0 mt-0.5">
                      {event.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                    {event.detail}
                  </p>
                  {event.durationLabel && (
                    <span className="inline-block mt-1.5 text-[9px] font-mono font-semibold text-gray-600 bg-surface-3 px-1.5 py-0.5 rounded">
                      ⏱ {event.durationLabel}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
