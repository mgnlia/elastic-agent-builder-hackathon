"use client";

import { MTTR_COMPARISON } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Timer, Zap } from "lucide-react";

export function MTTRComparison() {
  const { before, after } = MTTR_COMPARISON;
  const improvement = Math.round(
    ((before.avgMinutes - after.avgMinutes) / before.avgMinutes) * 100
  );

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          MTTR Comparison
        </h2>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <Zap className="w-3 h-3 text-emerald-400" />
          <span className="text-xs font-bold text-emerald-400">
            {improvement}% faster
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Before */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Timer className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-red-400">
              {before.label}
            </span>
          </div>
          <p className="text-3xl font-bold text-red-400 mb-4">
            {before.avgMinutes}
            <span className="text-sm font-normal text-gray-500 ml-1">min</span>
          </p>
          <div className="space-y-2">
            {before.steps.map((step) => (
              <div key={step.step} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400"
                      style={{
                        width: `${(step.minutes / before.avgMinutes) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <span className="text-[10px] text-gray-500 w-8 text-right font-mono">
                  {step.minutes}m
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 space-y-1">
            {before.steps.map((step) => (
              <p key={step.step} className="text-[10px] text-gray-600 truncate">
                {step.step}
              </p>
            ))}
          </div>
        </div>

        {/* After */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">
              {after.label}
            </span>
          </div>
          <p className="text-3xl font-bold text-emerald-400 mb-4">
            {after.avgMinutes}
            <span className="text-sm font-normal text-gray-500 ml-1">min</span>
          </p>
          <div className="space-y-2">
            {after.steps.map((step) => (
              <div key={step.step} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                      style={{
                        width: `${(step.minutes / after.avgMinutes) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <span className="text-[10px] text-gray-500 w-8 text-right font-mono">
                  {step.minutes}m
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 space-y-1">
            {after.steps.map((step) => (
              <p key={step.step} className="text-[10px] text-gray-600 truncate">
                {step.step}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
