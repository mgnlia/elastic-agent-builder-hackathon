"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect } from "react";
import { AgentId, AgentMessage, Phase, AGENTS } from "@/data/scenario";

interface AgentPanelProps {
  activeAgent: AgentId | null;
  messages: AgentMessage[];
  phase: Phase;
}

const agentColorMap: Record<string, string> = {
  triage: "text-accent-triage",
  diagnosis: "text-accent-diagnosis",
  remediation: "text-accent-remediation",
  communication: "text-accent-communication",
  system: "text-gray-500",
};

const agentBgMap: Record<string, string> = {
  triage: "bg-accent-triage",
  diagnosis: "bg-accent-diagnosis",
  remediation: "bg-accent-remediation",
  communication: "bg-accent-communication",
  system: "bg-gray-600",
};

const agentNames: Record<string, string> = {
  triage: "Triage",
  diagnosis: "Diagnosis",
  remediation: "Remediation",
  communication: "Comms",
  system: "System",
};

const messageTypeStyles: Record<string, string> = {
  alert: "border-l-red-500 bg-red-500/5",
  request: "border-l-gray-600 bg-surface-2/50",
  response: "border-l-elastic-teal/50 bg-elastic-teal/5",
  handoff: "border-l-elastic-yellow/50 bg-elastic-yellow/5",
};

export default function AgentPanel({ activeAgent, messages, phase }: AgentPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  return (
    <div className="h-full flex flex-col rounded-xl bg-surface-1 border border-surface-3 overflow-hidden">
      {/* Panel header */}
      <div className="px-4 py-3 border-b border-surface-3 bg-surface-2/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-elastic-blue animate-pulse" />
            <h2 className="text-xs font-mono font-semibold text-gray-300 tracking-wider uppercase">
              Agent Network — A2A Protocol
            </h2>
          </div>
          <span className="text-[10px] font-mono text-gray-600">
            {messages.length} messages
          </span>
        </div>

        {/* Agent cards row */}
        <div className="grid grid-cols-4 gap-2">
          {AGENTS.map((agent) => {
            const isActive = activeAgent === agent.id;
            const isPast = phase !== "idle" && (() => {
              const order = ["triage", "diagnosis", "remediation", "communication"];
              const activeIdx = activeAgent ? order.indexOf(activeAgent) : -1;
              const thisIdx = order.indexOf(agent.id);
              return thisIdx < activeIdx || phase === "resolved";
            })();

            return (
              <motion.div
                key={agent.id}
                animate={isActive ? { scale: [1, 1.02, 1] } : {}}
                transition={isActive ? { duration: 2, repeat: Infinity } : {}}
                className={`relative p-2 rounded-lg border transition-all duration-300 ${
                  isActive
                    ? `${agent.bgColor} ${agent.borderColor} ring-1 ${agent.borderColor}`
                    : isPast
                    ? "bg-surface-2/50 border-surface-3 opacity-60"
                    : "bg-surface-2/30 border-surface-3/50"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-sm">{agent.icon}</span>
                  <span className={`text-[10px] font-mono font-bold truncate ${isActive ? agent.color : "text-gray-400"}`}>
                    {agent.name.split(" ")[0]}
                  </span>
                </div>
                <p className="text-[9px] font-mono text-gray-600 truncate">
                  {agent.role.split(" ").slice(0, 3).join(" ")}
                </p>

                {/* Status dot */}
                <div className="absolute top-1.5 right-1.5">
                  {isActive ? (
                    <motion.div
                      className={`w-2 h-2 rounded-full ${agent.dotColor}`}
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  ) : isPast ? (
                    <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-surface-4" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Message feed */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-600">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-2 opacity-40">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p className="text-xs font-mono">No agent messages yet</p>
            <p className="text-[10px] font-mono mt-1">A2A protocol messages will appear here</p>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`border-l-2 rounded-r-lg p-2.5 ${messageTypeStyles[msg.type] || "border-l-surface-4 bg-surface-2/30"}`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${agentBgMap[msg.from]}`} />
                  <span className={`text-[10px] font-mono font-bold ${agentColorMap[msg.from]}`}>
                    {agentNames[msg.from]}
                  </span>
                  {msg.type === "handoff" && (
                    <>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-elastic-yellow">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                      <span className={`text-[10px] font-mono font-bold ${agentColorMap[msg.to]}`}>
                        {agentNames[msg.to]}
                      </span>
                    </>
                  )}
                  {msg.type === "handoff" && (
                    <span className="text-[8px] font-mono font-bold text-elastic-yellow bg-elastic-yellow/10 px-1 py-0.5 rounded ml-1">
                      A2A
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-mono text-gray-600">{msg.timestamp}</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed font-mono">
                {msg.content}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
