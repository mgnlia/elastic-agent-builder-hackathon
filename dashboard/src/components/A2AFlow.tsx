"use client";

import { cn } from "@/lib/cn";
import type { A2AMessage, AgentRole } from "@/lib/types";

const agentLabels: Record<AgentRole, { name: string; icon: string; color: string }> = {
  triage: { name: "Triage", icon: "🔍", color: "text-pink-400" },
  diagnosis: { name: "Diagnosis", icon: "🔬", color: "text-blue-400" },
  remediation: { name: "Remediation", icon: "🔧", color: "text-teal-400" },
  communication: { name: "Communication", icon: "📢", color: "text-yellow-400" },
};

interface A2AFlowProps {
  messages: A2AMessage[];
}

export default function A2AFlow({ messages }: A2AFlowProps) {
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-600 text-sm">
        Waiting for A2A messages…
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((msg, i) => {
        const from = agentLabels[msg.from];
        const to = agentLabels[msg.to];
        return (
          <div
            key={msg.id}
            className="animate-slide-in rounded-lg bg-gray-800/60 border border-gray-700 p-3"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">{from.icon}</span>
              <span className={cn("text-xs font-semibold", from.color)}>
                {from.name}
              </span>
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
              <span className="text-sm">{to.icon}</span>
              <span className={cn("text-xs font-semibold", to.color)}>
                {to.name}
              </span>
              {msg.toolUsed && (
                <span className="ml-auto px-1.5 py-0.5 text-[10px] rounded bg-elastic-blue/20 text-elastic-blue font-mono">
                  via {msg.toolUsed}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-300 font-mono leading-relaxed">
              {msg.content}
            </p>
          </div>
        );
      })}
    </div>
  );
}
