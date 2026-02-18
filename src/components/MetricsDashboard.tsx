"use client";

import { motion } from "framer-motion";
import { DemoPhase } from "@/lib/types";
import { METRICS } from "@/lib/demo-data";

interface MetricsDashboardProps {
  phase: DemoPhase;
  elapsedTime: number;
}

function MetricBar({
  label,
  manual,
  automated,
  unit,
  index,
  showAutomated,
}: {
  label: string;
  manual: number;
  automated: number;
  unit: string;
  index: number;
  showAutomated: boolean;
}) {
  const reduction = ((manual - automated) / manual) * 100;
  const manualWidth = 100;
  const autoWidth = (automated / manual) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-300 font-medium">{label}</span>
        {showAutomated && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[10px] font-mono text-elastic-teal"
          >
            -{reduction.toFixed(1)}%
          </motion.span>
        )}
      </div>

      {/* Manual bar */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-gray-500 w-16">Manual</span>
          <div className="flex-1 h-3 rounded-full bg-surface-3 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-red-500/60 to-red-400/60"
              initial={{ width: "0%" }}
              animate={{ width: `${manualWidth}%` }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            />
          </div>
          <span className="text-[10px] font-mono text-gray-400 w-14 text-right">
            {manual} {unit}
          </span>
        </div>

        {/* Automated bar */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-gray-500 w-16">Auto</span>
          <div className="flex-1 h-3 rounded-full bg-surface-3 overflow-hidden">
            {showAutomated && (
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-elastic-teal/80 to-elastic-teal/60"
                initial={{ width: "0%" }}
                animate={{ width: `${Math.max(autoWidth, 2)}%` }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
              />
            )}
          </div>
          <span className="text-[10px] font-mono text-elastic-teal w-14 text-right">
            {showAutomated
              ? `${automated < 1 ? (automated * 60).toFixed(0) + "s" : automated.toFixed(1) + " " + unit}`
              : "—"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function MetricsDashboard({
  phase,
  elapsedTime,
}: MetricsDashboardProps) {
  const showAutomated = phase === "resolved";
  const isActive = phase !== "idle";

  return (
    <div className="bg-surface-1 border border-surface-3 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
          MTTR Metrics
        </h2>
        <span className="text-xs font-mono text-gray-500">
          Mean Time to Resolution
        </span>
      </div>

      {/* Hero Metric */}
      <div className="relative mb-6 p-5 rounded-xl bg-surface-2 border border-surface-4 overflow-hidden">
        {showAutomated && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-elastic-teal/5 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}

        <div className="relative flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-1">
              {showAutomated ? "Automated MTTR" : "Manual MTTR (Industry Avg)"}
            </p>
            <div className="flex items-baseline gap-2">
              {showAutomated ? (
                <>
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-4xl font-bold text-elastic-teal font-mono"
                  >
                    1:55
                  </motion.span>
                  <span className="text-sm text-gray-400">min</span>
                </>
              ) : (
                <>
                  <span className="text-4xl font-bold text-red-400 font-mono">
                    45:00
                  </span>
                  <span className="text-sm text-gray-400">min</span>
                </>
              )}
            </div>
          </div>

          {showAutomated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-right"
            >
              <div className="text-3xl font-bold text-elastic-teal font-mono">
                95.7%
              </div>
              <div className="text-xs text-gray-400">reduction</div>
            </motion.div>
          )}
        </div>

        {/* Comparison visualization */}
        {showAutomated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 flex items-center gap-3"
          >
            <div className="flex-1">
              <div className="h-2 rounded-full bg-red-500/30 w-full" />
              <span className="text-[9px] font-mono text-gray-500 mt-1 block">
                45 min manual
              </span>
            </div>
            <span className="text-gray-600 text-xs">→</span>
            <div className="w-[4.3%] min-w-[12px]">
              <div className="h-2 rounded-full bg-elastic-teal" />
              <span className="text-[9px] font-mono text-elastic-teal mt-1 block whitespace-nowrap">
                1m 55s
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Breakdown */}
      <div className="space-y-4">
        {METRICS.map((metric, i) => (
          <MetricBar
            key={metric.label}
            label={metric.label}
            manual={metric.manual}
            automated={metric.automated}
            unit={metric.unit}
            index={i}
            showAutomated={showAutomated}
          />
        ))}
      </div>

      {/* Agent Summary */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-5 pt-4 border-t border-surface-4"
        >
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: "🔍", label: "Triage", time: "14s", color: "#F04E98" },
              { icon: "🔬", label: "Diagnosis", time: "30s", color: "#0077CC" },
              { icon: "🔧", label: "Remediation", time: "30s", color: "#00BFB3" },
              { icon: "📢", label: "Comms", time: "20s", color: "#FEC514" },
            ].map((agent) => (
              <div
                key={agent.label}
                className="text-center p-2 rounded-lg bg-surface-2"
              >
                <span className="text-lg">{agent.icon}</span>
                <div
                  className="text-[10px] font-mono mt-1"
                  style={{ color: agent.color }}
                >
                  {agent.time}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
