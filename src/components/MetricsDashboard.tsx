"use client";

import type { MetricsData, Incident } from "@/lib/types";
import {
  Clock,
  TrendingDown,
  BarChart3,
  MessageSquare,
  Database,
  Zap,
  ArrowDown,
  CheckCircle2,
} from "lucide-react";

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  highlight?: boolean;
  color?: string;
}

function MetricCard({ icon, label, value, subtext, highlight, color }: MetricCardProps) {
  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        highlight
          ? "bg-elastic-accent/10 border-elastic-accent/30"
          : "bg-elastic-card border-elastic-border"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={`${color || "text-elastic-muted"}`}>{icon}</div>
        <span className="text-xs text-elastic-muted uppercase tracking-wider font-medium">
          {label}
        </span>
      </div>
      <p
        className={`text-2xl font-bold ${
          highlight ? "text-elastic-accent" : "text-elastic-text"
        }`}
      >
        {value}
      </p>
      {subtext && (
        <p className="text-[10px] text-elastic-muted mt-1">{subtext}</p>
      )}
    </div>
  );
}

interface MTTRComparisonProps {
  before: number;
  after: number;
  reduction: number;
  isResolved: boolean;
}

function MTTRComparison({ before, after, reduction, isResolved }: MTTRComparisonProps) {
  const afterWidth = Math.max((after / before) * 100, 4);

  return (
    <div className="rounded-xl border border-elastic-border bg-elastic-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-elastic-muted uppercase tracking-wider flex items-center gap-1.5">
          <TrendingDown className="w-3.5 h-3.5 text-elastic-green" />
          MTTR Comparison
        </h3>
        {isResolved && (
          <span className="badge bg-elastic-green/20 text-elastic-green border-elastic-green/30 flex items-center gap-1">
            <ArrowDown className="w-3 h-3" />
            {reduction.toFixed(1)}% reduction
          </span>
        )}
      </div>

      <div className="space-y-3">
        {/* Before */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-elastic-muted">Manual (avg)</span>
            <span className="text-sm font-semibold text-elastic-red">
              {before} min
            </span>
          </div>
          <div className="w-full h-6 bg-elastic-darker rounded-lg overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-elastic-red/60 to-elastic-red/40 rounded-lg flex items-center justify-end pr-2"
              style={{ width: "100%" }}
            >
              <span className="text-[10px] font-bold text-elastic-red">
                45:00
              </span>
            </div>
          </div>
        </div>

        {/* After */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-elastic-muted">
              Incident Commander
            </span>
            <span className="text-sm font-semibold text-elastic-green">
              {isResolved ? `${after.toFixed(1)} min` : "—"}
            </span>
          </div>
          <div className="w-full h-6 bg-elastic-darker rounded-lg overflow-hidden">
            {isResolved && (
              <div
                className="h-full bg-gradient-to-r from-elastic-green/60 to-elastic-green/40 rounded-lg flex items-center justify-end pr-2 transition-all duration-1000"
                style={{ width: `${afterWidth}%` }}
              >
                <span className="text-[10px] font-bold text-elastic-green">
                  1:55
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface MetricsDashboardProps {
  metrics: MetricsData;
  incident: Incident;
  isResolved: boolean;
}

export function MetricsDashboard({
  metrics,
  incident,
  isResolved,
}: MetricsDashboardProps) {
  return (
    <div className="card">
      <div className="card-header mb-4">
        <h2 className="card-title flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-elastic-accent" />
          Performance Metrics
        </h2>
      </div>

      {/* MTTR Comparison */}
      <MTTRComparison
        before={metrics.mttrBefore}
        after={metrics.mttrAfter}
        reduction={metrics.mttrReduction}
        isResolved={isResolved}
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <MetricCard
          icon={<Clock className="w-4 h-4" />}
          label="Diagnosis"
          value={isResolved ? `${metrics.avgDiagnosisTime}s` : "—"}
          subtext="Root cause identification"
          color="text-elastic-accent"
        />
        <MetricCard
          icon={<Zap className="w-4 h-4" />}
          label="Remediation"
          value={isResolved ? `${metrics.avgRemediationTime}s` : "—"}
          subtext="Fix execution time"
          color="text-elastic-orange"
        />
        <MetricCard
          icon={<CheckCircle2 className="w-4 h-4" />}
          label="Status"
          value={isResolved ? "Resolved" : "Active"}
          subtext={
            isResolved
              ? `${incident.id} closed`
              : `${incident.id} in progress`
          }
          highlight={isResolved}
          color={isResolved ? "text-elastic-green" : "text-elastic-red"}
        />
      </div>

      <div className="grid grid-cols-3 gap-3 mt-3">
        <MetricCard
          icon={<MessageSquare className="w-4 h-4" />}
          label="A2A Messages"
          value={incident.messages.length}
          subtext="Inter-agent communication"
          color="text-elastic-blue"
        />
        <MetricCard
          icon={<Database className="w-4 h-4" />}
          label="ES|QL Queries"
          value={metrics.esqlQueriesRun}
          subtext="Log & metric correlation"
          color="text-elastic-purple"
        />
        <MetricCard
          icon={<Zap className="w-4 h-4" />}
          label="Actions"
          value={metrics.automatedActions}
          subtext="Automated remediations"
          color="text-elastic-yellow"
        />
      </div>
    </div>
  );
}
