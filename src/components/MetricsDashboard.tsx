"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Phase, METRICS, AGENTS } from "@/data/scenario";

interface MetricsDashboardProps {
  phase: Phase;
  elapsedTime: number;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}m ${s}s`;
}

export default function MetricsDashboard({ phase, elapsedTime }: MetricsDashboardProps) {
  const isResolved = phase === "resolved";
  const isActive = phase !== "idle";
  const reductionPercent = isResolved ? METRICS.reduction : isActive ? Math.min(((elapsedTime / METRICS.manual.mttr) * 100), 99) : 0;

  return (
    <div className="space-y-4 h-full">
      {/* MTTR Comparison Card */}
      <div className="rounded-xl bg-surface-1 border border-surface-3 overflow-hidden">
        <div className="px-4 py-3 border-b border-surface-3 bg-surface-2/50">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-elastic-yellow animate-pulse" />
            <h2 className="text-xs font-mono font-semibold text-gray-300 tracking-wider uppercase">
              MTTR Comparison
            </h2>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Manual */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Manual Response</span>
              <span className="text-xs font-mono font-bold text-red-400">{METRICS.manual.label}</span>
            </div>
            <div className="h-3 rounded-full bg-surface-3 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400 w-full" />
            </div>
          </div>

          {/* Automated */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">AI Automated</span>
              <span className="text-xs font-mono font-bold text-elastic-teal">
                {isActive ? formatTime(elapsedTime) : "—"}
              </span>
            </div>
            <div className="h-3 rounded-full bg-surface-3 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-elastic-teal to-emerald-400"
                initial={{ width: "0%" }}
                animate={{ width: isActive ? `${Math.min((elapsedTime / METRICS.manual.mttr) * 100, 100)}%` : "0%" }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Reduction badge */}
          <AnimatePresence>
            {isResolved && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="flex items-center justify-center p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400 font-mono">
                    {METRICS.reduction}%
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400/70 uppercase tracking-wider">
                    MTTR Reduction
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Agent Performance Card */}
      <div className="rounded-xl bg-surface-1 border border-surface-3 overflow-hidden">
        <div className="px-4 py-3 border-b border-surface-3 bg-surface-2/50">
          <h2 className="text-xs font-mono font-semibold text-gray-300 tracking-wider uppercase">
            Agent Performance
          </h2>
        </div>
        <div className="p-3 space-y-2">
          {AGENTS.map((agent) => {
            const agentPhases: Record<string, Phase> = {
              triage: "triage",
              diagnosis: "diagnosis",
              remediation: "remediation",
              communication: "communication",
            };
            const agentPhase = agentPhases[agent.id];
            const phaseOrder = ["idle", "alert", "triage", "diagnosis", "remediation", "communication", "resolved"];
            const currentIdx = phaseOrder.indexOf(phase);
            const agentIdx = phaseOrder.indexOf(agentPhase);
            const isDone = currentIdx > agentIdx;
            const isRunning = phase === agentPhase;

            return (
              <div
                key={agent.id}
                className={`flex items-center justify-between p-2 rounded-lg border transition-all duration-300 ${
                  isRunning
                    ? `${agent.bgColor} ${agent.borderColor}`
                    : isDone
                    ? "bg-surface-2/30 border-surface-3/50"
                    : "bg-surface-2/20 border-surface-3/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{agent.icon}</span>
                  <div>
                    <span className={`text-[11px] font-mono font-semibold ${isRunning ? agent.color : isDone ? "text-gray-400" : "text-gray-600"}`}>
                      {agent.name}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono ${isDone ? "text-gray-500" : "text-gray-600"}`}>
                    {agent.duration}s
                  </span>
                  {isDone ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-400">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </motion.div>
                  ) : isRunning ? (
                    <motion.div
                      className={`w-4 h-4 rounded-full ${agent.dotColor}/30 flex items-center justify-center`}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <div className={`w-2 h-2 rounded-full ${agent.dotColor}`} />
                    </motion.div>
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-surface-4/50" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="rounded-xl bg-surface-1 border border-surface-3 overflow-hidden">
        <div className="px-4 py-3 border-b border-surface-3 bg-surface-2/50">
          <h2 className="text-xs font-mono font-semibold text-gray-300 tracking-wider uppercase">
            Incident Stats
          </h2>
        </div>
        <div className="p-3 grid grid-cols-2 gap-2">
          {[
            { label: "Severity", value: isActive ? "P1 — Critical" : "—", color: isActive ? "text-red-400" : "text-gray-600" },
            { label: "Errors", value: isActive ? "1,247" : "—", color: isActive ? "text-elastic-pink" : "text-gray-600" },
            { label: "Hosts", value: isActive ? "3" : "—", color: isActive ? "text-elastic-orange" : "text-gray-600" },
            { label: "Root Cause", value: phase === "diagnosis" || phase === "remediation" || phase === "communication" || phase === "resolved" ? "v2.14.0" : "—", color: "text-elastic-blue" },
          ].map((stat) => (
            <div key={stat.label} className="p-2 rounded-lg bg-surface-2/30 border border-surface-3/30">
              <div className="text-[9px] font-mono text-gray-600 uppercase tracking-wider">
                {stat.label}
              </div>
              <div className={`text-xs font-mono font-bold mt-0.5 ${stat.color}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack Badge */}
      <div className="rounded-xl bg-surface-1 border border-surface-3 p-3">
        <div className="text-[9px] font-mono text-gray-600 uppercase tracking-wider mb-2">
          Architecture
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["Elastic Agent Builder", "A2A Protocol", "ES|QL", "Elasticsearch", "CloudWatch", "Next.js 14"].map((tech) => (
            <span
              key={tech}
              className="text-[9px] font-mono text-gray-500 bg-surface-3/50 px-2 py-0.5 rounded-md border border-surface-4/50"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
