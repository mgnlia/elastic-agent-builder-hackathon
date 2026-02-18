"use client";

import { cn } from "@/lib/cn";
import type { TimelineEvent, AgentRole } from "@/lib/types";

const agentColors: Record<AgentRole, string> = {
  triage: "bg-pink-500",
  diagnosis: "bg-blue-500",
  remediation: "bg-teal-500",
  communication: "bg-yellow-500",
};

const agentIcons: Record<AgentRole, string> = {
  triage: "🔍",
  diagnosis: "🔬",
  remediation: "🔧",
  communication: "📢",
};

interface TimelineProps {
  events: TimelineEvent[];
  currentIndex: number;
}

export default function Timeline({ events, currentIndex }: TimelineProps) {
  return (
    <div className="space-y-0">
      {events.map((event, i) => {
        const isActive = i === currentIndex;
        const isPast = i < currentIndex;
        const isFuture = i > currentIndex;

        return (
          <div
            key={event.id}
            className={cn(
              "relative pl-10 pb-4 transition-all duration-300",
              isFuture && "opacity-30"
            )}
          >
            {/* Connector line */}
            {i < events.length - 1 && (
              <div
                className={cn(
                  "absolute left-[15px] top-8 w-0.5 h-full",
                  isPast ? "bg-gray-600" : "bg-gray-800"
                )}
              />
            )}

            {/* Dot */}
            <div
              className={cn(
                "absolute left-2 top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px]",
                isActive && "ring-2 ring-elastic-teal ring-offset-2 ring-offset-gray-950",
                agentColors[event.agent]
              )}
            >
              {agentIcons[event.agent]}
            </div>

            {/* Content */}
            <div
              className={cn(
                "rounded-lg p-3 transition-all duration-300",
                isActive
                  ? "bg-gray-800/80 border border-gray-600"
                  : isPast
                  ? "bg-gray-900/50"
                  : "bg-gray-900/20"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-gray-300">
                  {event.action}
                </span>
                {event.toolUsed && (
                  <span className="px-1.5 py-0.5 text-[10px] rounded bg-elastic-blue/20 text-elastic-blue font-mono">
                    {event.toolUsed}
                  </span>
                )}
                {event.severity && (
                  <span
                    className={cn(
                      "px-1.5 py-0.5 text-[10px] rounded font-bold",
                      event.severity === "P1"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-orange-500/20 text-orange-400"
                    )}
                  >
                    {event.severity}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                {event.detail}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
