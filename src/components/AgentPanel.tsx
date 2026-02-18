"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Agent, A2AMessage, AgentId, DemoPhase } from "@/lib/types";
import { AGENTS } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

interface AgentPanelProps {
  activeAgent: AgentId | null;
  messages: A2AMessage[];
  phase: DemoPhase;
}

function AgentCard({
  agent,
  isActive,
  phase,
}: {
  agent: Agent;
  isActive: boolean;
  phase: DemoPhase;
}) {
  return (
    <motion.div
      layout
      className={cn(
        "relative rounded-xl border p-4 transition-all",
        isActive ? "bg-opacity-20" : "bg-surface-2 border-surface-4"
      )}
      style={
        isActive
          ? {
              backgroundColor: `${agent.color}10`,
              borderColor: `${agent.color}40`,
              boxShadow: `0 0 30px ${agent.color}10`,
            }
          : {}
      }
      animate={isActive ? { scale: [1, 1.01, 1] } : { scale: 1 }}
      transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
    >
      {/* Active glow ring */}
      {isActive && (
        <motion.div
          className="absolute -inset-px rounded-xl"
          style={{ border: `1px solid ${agent.color}` }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <div className="flex items-start gap-3">
        <div className="relative">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
            style={{ backgroundColor: `${agent.color}20` }}
          >
            {agent.icon}
          </div>
          {isActive && (
            <motion.div
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full"
              style={{ backgroundColor: agent.color }}
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white truncate">
              {agent.name}
            </h3>
            {isActive && (
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${agent.color}20`,
                  color: agent.color,
                }}
              >
                ACTIVE
              </motion.span>
            )}
          </div>
          <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
            {agent.description}
          </p>
        </div>
      </div>

      {/* Tools */}
      <div className="mt-3 flex flex-wrap gap-1">
        {agent.tools.map((tool) => (
          <span
            key={tool}
            className={cn(
              "text-[9px] font-mono px-1.5 py-0.5 rounded-md",
              isActive
                ? "bg-surface-3 text-gray-300"
                : "bg-surface-3/50 text-gray-500"
            )}
          >
            {tool}
          </span>
        ))}
      </div>

      {/* Timing */}
      <div className="mt-2 flex items-center gap-2">
        <div className="flex-1 h-1 rounded-full bg-surface-4 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: agent.color }}
            initial={{ width: "0%" }}
            animate={{ width: isActive ? "100%" : "0%" }}
            transition={{
              duration: isActive ? agent.avgTime / 4 : 0.3,
              ease: "linear",
            }}
          />
        </div>
        <span className="text-[10px] font-mono text-gray-500">
          {agent.avgTime}s
        </span>
      </div>
    </motion.div>
  );
}

function MessageBubble({
  message,
  index,
}: {
  message: A2AMessage;
  index: number;
}) {
  const fromAgent = AGENTS.find((a) => a.id === message.from);
  const toAgent = AGENTS.find((a) => a.id === message.to);
  const color = fromAgent?.color || "#64748b";

  const typeStyles: Record<string, { bg: string; label: string }> = {
    alert: { bg: "bg-red-500/10 border-red-500/20", label: "ALERT" },
    handoff: { bg: "bg-elastic-teal/10 border-elastic-teal/20", label: "A2A HANDOFF" },
    request: { bg: "bg-elastic-blue/10 border-elastic-blue/20", label: "REQUEST" },
    response: { bg: "bg-surface-3 border-surface-4", label: "RESPONSE" },
  };

  const style = typeStyles[message.type] || typeStyles.response;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className={cn("rounded-lg border p-3", style.bg)}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-xs font-mono" style={{ color }}>
          {fromAgent?.icon || "⚡"}{" "}
          {message.from === "system" ? "System" : fromAgent?.name}
        </span>
        <span className="text-gray-600 text-xs">→</span>
        <span className="text-xs font-mono text-gray-400">
          {toAgent?.icon || "⚡"}{" "}
          {message.to === "system" ? "System" : toAgent?.name}
        </span>
        <span className="ml-auto text-[9px] font-mono text-gray-600 uppercase tracking-wider">
          {style.label}
        </span>
      </div>
      <p className="text-xs text-gray-300 leading-relaxed">{message.content}</p>
      <span className="text-[10px] font-mono text-gray-600 mt-1 block">
        {message.timestamp}
      </span>
    </motion.div>
  );
}

export default function AgentPanel({
  activeAgent,
  messages,
  phase,
}: AgentPanelProps) {
  return (
    <div className="bg-surface-1 border border-surface-3 rounded-2xl p-5 h-full flex flex-col">
      {/* Agent Grid */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
          Agent Network
        </h2>
        <span className="text-xs font-mono text-gray-500">A2A Protocol</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {AGENTS.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            isActive={activeAgent === agent.id}
            phase={phase}
          />
        ))}
      </div>

      {/* A2A Message Flow */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          A2A Message Flow
        </h3>
        <span className="text-[10px] font-mono text-gray-600">
          {messages.length} messages
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-xs text-gray-600 font-mono">
              Waiting for agent activity...
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((msg, i) => (
              <MessageBubble key={msg.id} message={msg} index={i} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
