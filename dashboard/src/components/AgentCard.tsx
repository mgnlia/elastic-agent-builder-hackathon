"use client";

import { cn } from "@/lib/cn";
import type { Agent, AgentStatus } from "@/lib/types";

const statusStyles: Record<AgentStatus, string> = {
  idle: "border-gray-700 bg-gray-900/50",
  active: "border-elastic-teal bg-gray-900 agent-glow",
  complete: "border-green-600 bg-gray-900/80",
  waiting: "border-yellow-600/50 bg-gray-900/30",
};

const statusLabels: Record<AgentStatus, string> = {
  idle: "Standby",
  active: "Active",
  complete: "Done",
  waiting: "Waiting",
};

const statusDot: Record<AgentStatus, string> = {
  idle: "bg-gray-500",
  active: "bg-emerald-400 animate-pulse",
  complete: "bg-green-500",
  waiting: "bg-yellow-500 animate-pulse-slow",
};

interface AgentCardProps {
  agent: Agent;
  status: AgentStatus;
  currentAction?: string;
}

export default function AgentCard({ agent, status, currentAction }: AgentCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border-2 p-4 transition-all duration-500",
        statusStyles[status]
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{agent.icon}</span>
          <div>
            <h3 className="font-semibold text-sm">{agent.name}</h3>
            <p className="text-xs text-gray-400">{agent.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={cn("w-2 h-2 rounded-full", statusDot[status])} />
          <span className="text-xs text-gray-400">{statusLabels[status]}</span>
        </div>
      </div>

      {status === "active" && currentAction && (
        <div className="mt-2 px-3 py-2 rounded-lg bg-gray-800/80 border border-gray-700 animate-fade-in">
          <p className="text-xs text-elastic-teal font-mono">{currentAction}</p>
        </div>
      )}

      <div className="mt-2 flex flex-wrap gap-1">
        {agent.tools.map((tool) => (
          <span
            key={tool}
            className="px-1.5 py-0.5 text-[10px] rounded bg-gray-800 text-gray-400 font-mono"
          >
            {tool}
          </span>
        ))}
      </div>
    </div>
  );
}
