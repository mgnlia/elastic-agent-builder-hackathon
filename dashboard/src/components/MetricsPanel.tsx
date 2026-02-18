"use client";

import type { MetricsSnapshot } from "@/lib/types";

interface MetricsPanelProps {
  metrics: MetricsSnapshot;
  isResolved: boolean;
}

function MiniChart({
  data,
  color,
  label,
  unit,
}: {
  data: { time: string; value: number }[];
  color: string;
  label: string;
  unit: string;
}) {
  const max = Math.max(...data.map((d) => d.value));
  const barWidth = 100 / data.length;

  return (
    <div className="rounded-lg bg-gray-800/50 border border-gray-700 p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-xs text-gray-500">{unit}</span>
      </div>
      <div className="flex items-end gap-0.5 h-16">
        {data.map((d, i) => (
          <div
            key={i}
            className="flex-1 rounded-t transition-all duration-500"
            style={{
              height: `${(d.value / max) * 100}%`,
              backgroundColor: color,
              opacity: d.value > max * 0.7 ? 1 : 0.6,
            }}
            title={`${d.time}: ${d.value}${unit}`}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[9px] text-gray-600">{data[0]?.time}</span>
        <span className="text-[9px] text-gray-600">
          {data[data.length - 1]?.time}
        </span>
      </div>
    </div>
  );
}

export default function MetricsPanel({ metrics, isResolved }: MetricsPanelProps) {
  const mttrReduction = Math.round(
    ((metrics.mttrBefore - metrics.mttrAfter) / metrics.mttrBefore) * 100
  );
  const automationRate = Math.round(
    (metrics.stepsAutomated / metrics.stepsTotal) * 100
  );

  return (
    <div className="space-y-4">
      {/* MTTR Comparison */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-gray-800/50 border border-gray-700 p-4 text-center">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
            MTTR Before
          </p>
          <p className="text-2xl font-bold text-red-400">
            {metrics.mttrBefore}
            <span className="text-sm text-gray-500 ml-1">min</span>
          </p>
          <p className="text-[10px] text-gray-600">Manual triage + escalation</p>
        </div>
        <div className="rounded-lg bg-gray-800/50 border border-gray-700 p-4 text-center">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
            MTTR After
          </p>
          <p className="text-2xl font-bold text-emerald-400">
            {metrics.mttrAfter}
            <span className="text-sm text-gray-500 ml-1">min</span>
          </p>
          <p className="text-[10px] text-gray-600">Incident Commander</p>
        </div>
      </div>

      {/* Impact Stats */}
      {isResolved && (
        <div className="grid grid-cols-2 gap-3 animate-fade-in">
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-center">
            <p className="text-2xl font-bold text-emerald-400">{mttrReduction}%</p>
            <p className="text-[10px] text-gray-400">MTTR Reduction</p>
          </div>
          <div className="rounded-lg bg-blue-500/10 border border-blue-500/30 p-3 text-center">
            <p className="text-2xl font-bold text-blue-400">{automationRate}%</p>
            <p className="text-[10px] text-gray-400">Steps Automated</p>
          </div>
        </div>
      )}

      {/* Charts */}
      <MiniChart
        data={metrics.errorRate}
        color="#EF4444"
        label="Error Rate"
        unit="%"
      />
      <MiniChart
        data={metrics.cpuUsage}
        color="#F97316"
        label="CPU Usage"
        unit="%"
      />
    </div>
  );
}
