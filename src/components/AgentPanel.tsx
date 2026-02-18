"use client";

import { AGENTS } from "@/lib/mock-data";
import { cn, agentBgClass } from "@/lib/utils";
import { CheckCircle, Wrench } from "lucide-react";

export function AgentPanel() {
  return (
    <div className="card">
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Agent Activity — A2A Protocol
      </h2>
      <div className="space-y-3">
        {AGENTS.map((agent) => (
          <div
            key={agent.id}
            className="rounded-lg border border-gray-800 bg-gray-950/50 p-4 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    agent.status === "active"
                      ? "bg-blue-500 animate-pulse"
                      : agent.status === "completed"
                      ? "bg-emerald-500"
                      : "bg-gray-600"
                  )}
                />
                <span className="font-medium text-sm">{agent.name}</span>
              </div>
              <span
                className={cn(
                  "badge",
                  agentBgClass(agent.role)
                )}
              >
                {agent.status === "completed" && (
                  <CheckCircle className="w-3 h-3" />
                )}
                {agent.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-3">{agent.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {agent.toolsUsed.map((tool) => (
                <span
                  key={tool}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-800 text-xs text-gray-400"
                >
                  <Wrench className="w-2.5 h-2.5" />
                  {tool}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* A2A Message Flow */}
      <div className="mt-4 pt-4 border-t border-gray-800">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          A2A Message Flow
        </h3>
        <div className="flex items-center justify-between px-2">
          {AGENTS.map((agent, i) => (
            <div key={agent.id} className="flex items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full text-xs font-bold",
                  agentBgClass(agent.role)
                )}
              >
                {agent.role[0].toUpperCase()}
              </div>
              {i < AGENTS.length - 1 && (
                <div className="flex items-center mx-1">
                  <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-gray-600 to-gray-700" />
                  <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-gray-600" />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between px-2 mt-1">
          {AGENTS.map((agent) => (
            <span key={agent.id} className="text-[10px] text-gray-600 text-center w-10">
              {agent.role.charAt(0).toUpperCase() + agent.role.slice(1)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
