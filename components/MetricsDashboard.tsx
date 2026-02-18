"use client";

import { motion } from "framer-motion";
import { DemoPhase } from "@/lib/types";
import { METRICS } from "@/lib/demo-data";

interface MetricsDashboardProps {
  phase: DemoPhase;
}

function MetricBar({
  label,
  manual,
  automated,
  unit,
  index,
  show,
}: {
  label: string;
  manual: number;
  automated: number;
  unit: string;
  index: number;
  show: boolean;
}) {
  const improvement = Math.round(((manual - automated) / manual) * 100);
  const maxVal = Math.max(manual, automated);

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: show ? 1 : 0.3, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">{label}</span>
        {show && (
          <motion.span
            className="text-xs font-bold text-emerald-400"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            ↓{improvement}%
          </motion.span>
        )}
      </div>

      {/* Manual bar */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 w-16">Manual</span>
          <div className="flex-1 h-5 bg-slate-800 rounded-md overflow-hidden relative">
            <motion.div
              className="h-full rounded-md bg-gradient-to-r from-red-500/70 to-orange-500/70"
              initial={{ width: 0 }}
              animate={{ width: show ? `${(manual / maxVal) * 100}%` : 0 }}
              transition={{ delay: index * 0.1 + 0.2, duration: 0.8, ease: "easeOut" }}
            />
            {show && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-white">
                {manual} {unit}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 w-16">AI Agents</span>
          <div className="flex-1 h-5 bg-slate-800 rounded-md overflow-hidden relative">
            <motion.div
              className="h-full rounded-md bg-gradient-to-r from-cyan-500/70 to-emerald-500/70"
              initial={{ width: 0 }}
              animate={{
                width: show ? `${(automated / maxVal) * 100}%` : 0,
              }}
              transition={{ delay: index * 0.1 + 0.4, duration: 0.8, ease: "easeOut" }}
            />
            {show && (
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-white">
                {automated} {unit}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function MetricsDashboard({ phase }: MetricsDashboardProps) {
  const showMetrics = phase === "resolved";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">📊</span>
            <h2 className="text-sm font-bold text-white">MTTR Metrics</h2>
          </div>
          <span className="text-xs text-slate-500">Manual vs AI Agents</span>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Hero metric */}
        <motion.div
          className="text-center p-6 rounded-xl border border-slate-800 bg-slate-950/50"
          animate={{
            borderColor: showMetrics ? "rgba(16, 185, 129, 0.3)" : "rgb(30 41 59)",
            backgroundColor: showMetrics ? "rgba(16, 185, 129, 0.05)" : "rgba(2, 6, 23, 0.5)",
          }}
        >
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">
            MTTR Improvement
          </div>
          <motion.div
            className="text-4xl font-black"
            style={{
              background: "linear-gradient(135deg, #06b6d4, #10b981)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: showMetrics ? 1 : 0.3 }}
          >
            {showMetrics ? "95.7%" : "—"}
          </motion.div>
          <div className="text-xs text-slate-500 mt-1">
            {showMetrics ? "45 min → 1m 55s" : "Waiting for resolution..."}
          </div>
        </motion.div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Agents Used", value: showMetrics ? "4" : "—", icon: "🤖" },
            { label: "Tools Called", value: showMetrics ? "14" : "—", icon: "🔧" },
            { label: "Human Input", value: showMetrics ? "Zero" : "—", icon: "👤" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              className="p-3 rounded-lg border border-slate-800 bg-slate-950/50 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: showMetrics ? 1 : 0.4, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-lg mb-1">{item.icon}</div>
              <div className="text-lg font-bold text-white">{item.value}</div>
              <div className="text-[10px] text-slate-500">{item.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Metric bars */}
        <div className="space-y-4">
          {METRICS.map((metric, i) => (
            <MetricBar
              key={metric.label}
              label={metric.label}
              manual={metric.manual}
              automated={metric.automated}
              unit={metric.unit}
              index={i}
              show={showMetrics}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
