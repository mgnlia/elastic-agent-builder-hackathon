"use client";

import { METRICS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp, Minus, Clock, AlertTriangle, Bot, Activity } from "lucide-react";

const ICONS = [Clock, AlertTriangle, Bot, Activity];

export function MetricsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {METRICS.map((metric, i) => {
        const Icon = ICONS[i];
        return (
          <div key={metric.label} className="card group hover:border-gray-700 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800 group-hover:bg-gray-700 transition-colors">
                <Icon className="w-5 h-5 text-gray-400" />
              </div>
              {metric.change && (
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
                    metric.changeType === "positive" &&
                      "bg-emerald-500/10 text-emerald-400",
                    metric.changeType === "negative" &&
                      "bg-red-500/10 text-red-400",
                    metric.changeType === "neutral" &&
                      "bg-gray-500/10 text-gray-400"
                  )}
                >
                  {metric.changeType === "positive" && (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {metric.changeType === "negative" && (
                    <TrendingUp className="w-3 h-3" />
                  )}
                  {metric.changeType === "neutral" && (
                    <Minus className="w-3 h-3" />
                  )}
                  {metric.change}
                </div>
              )}
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold tracking-tight">{metric.value}</p>
              <p className="text-sm text-gray-400 mt-0.5">{metric.label}</p>
              {metric.description && (
                <p className="text-xs text-gray-600 mt-1">{metric.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
