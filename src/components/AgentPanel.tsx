"use client";

import type { Agent, A2AMessage, AgentId } from "@/lib/types";
import { agentColor, agentBgClass, formatTime } from "@/lib/utils";
import {
  Search,
  Microscope,
  Wrench,
  Megaphone,
  ArrowRight,
  MessageSquare,
  Cpu,
  Zap,
} from "lucide-react";

function AgentIcon({ id, className }: { id: AgentId; className?: string }) {
  const cls = className || "w-5 h-5";
  switch (id) {
    case "triage":
      return <Search className={cls} />;
    case "diagnosis":
      return <Microscope className={cls} />;
    case "remediation":
      return <Wrench className={cls} />;
    case "communication":
      return <Megaphone className={cls} />;
  }
}

function StatusDot({ status }: { status: string }) {
  if (status === "active" || status === "processing") {
    return (
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-elastic-accent opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-elastic-accent" />
      </span>
    );
  }
  if (status === "complete") {
    return <span className="inline-flex rounded-full h-2.5 w-2.5 bg-elastic-green" />;
  }
  if (status === "error") {
    return <span className="inline-flex rounded-full h-2.5 w-2.5 bg-elastic-red" />;
  }
  return <span className="inline-flex rounded-full h-2.5 w-2.5 bg-elastic-muted/40" />;
}

interface AgentCardProps {
  agent: Agent;
}

function AgentCard({ agent }: AgentCardProps) {
  const isActive = agent.status === "active" || agent.status === "processing";

  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-300 ${agentBgClass(
        agent.id
      )} ${isActive ? "agent-processing" : ""} ${
        agent.status === "complete" ? "opacity-80" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${agentColor(agent.id)}30` }}
          >
            <AgentIcon
              id={agent.id}
              className="w-4 h-4"
            />
          </div>
          <div>
            <h4 className="text-sm font-semibold" style={{ color: agentColor(agent.id) }}>
              {agent.name}
            </h4>
            <p className="text-[10px] text-elastic-muted">{agent.tools.length} tools</p>
          </div>
        </div>
        <StatusDot status={agent.status} />
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="bg-elastic-darker/40 rounded-lg px-2 py-1.5 text-center">
          <p className="text-lg font-bold text-elastic-text">{agent.messagesProcessed}</p>
          <p className="text-[10px] text-elastic-muted">Messages</p>
        </div>
        <div className="bg-elastic-darker/40 rounded-lg px-2 py-1.5 text-center">
          <p className="text-lg font-bold text-elastic-text">
            {agent.avgResponseTime > 0
              ? `${(agent.avgResponseTime / 1000).toFixed(1)}s`
              : "—"}
          </p>
          <p className="text-[10px] text-elastic-muted">Avg Time</p>
        </div>
      </div>
    </div>
  );
}

function MessageTypeIcon({ type }: { type: string }) {
  switch (type) {
    case "handoff":
      return <ArrowRight className="w-3 h-3 text-elastic-accent" />;
    case "query":
      return <Cpu className="w-3 h-3 text-elastic-blue" />;
    case "action":
      return <Zap className="w-3 h-3 text-elastic-orange" />;
    case "result":
      return <MessageSquare className="w-3 h-3 text-elastic-green" />;
    case "report":
      return <MessageSquare className="w-3 h-3 text-elastic-purple" />;
    default:
      return <MessageSquare className="w-3 h-3 text-elastic-muted" />;
  }
}

interface AgentPanelProps {
  agents: Agent[];
  messages: A2AMessage[];
}

export function AgentPanel({ agents, messages }: AgentPanelProps) {
  return (
    <div className="card h-full flex flex-col">
      <div className="card-header flex-shrink-0">
        <h2 className="card-title flex items-center gap-2">
          <Cpu className="w-5 h-5 text-elastic-accent" />
          Agent Activity
        </h2>
        <span className="text-xs text-elastic-muted">A2A Protocol</span>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 flex-shrink-0">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      {/* A2A Message Flow */}
      <div className="flex-shrink-0 mb-2">
        <h3 className="text-xs font-semibold text-elastic-muted uppercase tracking-wider flex items-center gap-1.5">
          <MessageSquare className="w-3 h-3" />
          A2A Message Flow
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 min-h-0 pr-1">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-24 text-elastic-muted">
            <MessageSquare className="w-6 h-6 mb-1 opacity-40" />
            <p className="text-xs">No messages yet</p>
          </div>
        )}

        {messages.map((msg, idx) => {
          const isNew = idx === messages.length - 1;
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2 px-3 py-2 rounded-lg bg-elastic-darker/60 border border-elastic-border/30 ${
                isNew ? "animate-slide-in" : ""
              }`}
            >
              <MessageTypeIcon type={msg.type} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span
                    className="text-[10px] font-semibold"
                    style={{
                      color:
                        msg.from === "alert"
                          ? "#F04E98"
                          : agentColor(msg.from as AgentId),
                    }}
                  >
                    {msg.from === "alert" ? "ALERT" : msg.from}
                  </span>
                  <ArrowRight className="w-2.5 h-2.5 text-elastic-muted" />
                  <span
                    className="text-[10px] font-semibold"
                    style={{ color: agentColor(msg.to) }}
                  >
                    {msg.to}
                  </span>
                  <span className="text-[10px] text-elastic-muted ml-auto">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                <p className="text-[11px] text-elastic-text/80 leading-relaxed">
                  {msg.summary}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
