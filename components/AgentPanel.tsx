"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AgentId, A2AMessage } from "@/lib/types";
import { AGENTS } from "@/lib/demo-data";

interface AgentPanelProps {
  activeAgent: AgentId | null;
  messages: A2AMessage[];
}

function AgentCard({
  agent,
  isActive,
}: {
  agent: (typeof AGENTS)[0];
  isActive: boolean;
}) {
  return (
    <motion.div
      className="relative p-3 rounded-xl border transition-all"
      style={{
        borderColor: isActive ? agent.borderColor : "rgb(30 41 59)",
        backgroundColor: isActive ? agent.bgColor : "transparent",
      }}
      animate={{
        borderColor: isActive ? agent.color : "rgb(30 41 59)",
        scale: isActive ? 1.02 : 1,
      }}
      transition={{ duration: 0.3 }}
    >
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{
            background: `radial-gradient(ellipse at center, ${agent.color}10, transparent 70%)`,
          }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <div className="relative flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
          style={{ backgroundColor: `${agent.color}20` }}
        >
          {agent.icon}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-white truncate">
              {agent.name}
            </h3>
            {isActive && (
              <motion.div
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: agent.color }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </div>
          <p className="text-[10px] text-slate-500 truncate">
            {agent.description}
          </p>
        </div>
      </div>

      {isActive && (
        <motion.div
          className="mt-2 flex flex-wrap gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {agent.tools.map((tool) => (
            <span
              key={tool}
              className="text-[9px] px-1.5 py-0.5 rounded font-mono"
              style={{
                color: agent.color,
                backgroundColor: `${agent.color}15`,
              }}
            >
              {tool}
            </span>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

function MessageBubble({ message }: { message: A2AMessage }) {
  const agent =
    message.from !== "system"
      ? AGENTS.find((a) => a.id === message.from)
      : null;
  const color = agent?.color || "#64748b";

  const typeColors: Record<string, string> = {
    alert: "#FF6C2F",
    handoff: "#FEC514",
    request: "#0077CC",
    response: "#00BFB3",
  };

  return (
    <motion.div
      className="p-3 rounded-lg border bg-slate-950/50"
      style={{ borderColor: `${color}30` }}
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-xs">{agent?.icon || "⚙️"}</span>
        <span className="text-[10px] font-bold" style={{ color }}>
          {agent?.name || "System"}
        </span>
        <span className="text-slate-600">→</span>
        <span className="text-[10px] text-slate-400">
          {message.to === "system"
            ? "System"
            : AGENTS.find((a) => a.id === message.to)?.name || message.to}
        </span>
        <span
          className="ml-auto text-[9px] px-1.5 py-0.5 rounded font-bold uppercase"
          style={{
            color: typeColors[message.type] || "#64748b",
            backgroundColor: `${typeColors[message.type] || "#64748b"}15`,
          }}
        >
          {message.type}
        </span>
      </div>
      <p className="text-xs text-slate-300 leading-relaxed">
        {message.content}
      </p>
      <div className="text-[10px] text-slate-600 mt-1 font-mono">
        {message.timestamp}
      </div>
    </motion.div>
  );
}

export default function AgentPanel({ activeAgent, messages }: AgentPanelProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">🤖</span>
            <h2 className="text-sm font-bold text-white">Agent Network</h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            A2A Protocol
          </span>
        </div>
      </div>

      {/* Agent Cards */}
      <div className="p-4 grid grid-cols-2 gap-2 border-b border-slate-800">
        {AGENTS.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            isActive={activeAgent === agent.id}
          />
        ))}
      </div>

      {/* Message Flow */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs">💬</span>
          <h3 className="text-xs font-bold text-slate-400">Message Flow</h3>
          <span className="text-[10px] text-slate-600 font-mono ml-auto">
            {messages.length} messages
          </span>
        </div>

        <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-slate-600 text-xs">
              No messages yet
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
