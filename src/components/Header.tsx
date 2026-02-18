"use client";

import { Activity, Zap, Shield } from "lucide-react";

interface HeaderProps {
  incidentId?: string;
  phase?: string;
  isRunning: boolean;
}

export function Header({ incidentId, phase, isRunning }: HeaderProps) {
  return (
    <header className="border-b border-elastic-border bg-elastic-dark/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-[1920px] mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-elastic-accent" />
            <h1 className="text-xl font-bold tracking-tight">
              <span className="text-elastic-accent">Incident</span>{" "}
              <span className="text-elastic-text">Commander</span>
            </h1>
          </div>
          <div className="h-6 w-px bg-elastic-border mx-2" />
          <span className="text-sm text-elastic-muted">
            Elastic Agent Builder × A2A Protocol
          </span>
        </div>

        <div className="flex items-center gap-4">
          {incidentId && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-elastic-card rounded-lg border border-elastic-border">
              <span className="text-xs text-elastic-muted">Incident</span>
              <span className="text-sm font-mono font-semibold text-elastic-text">
                {incidentId}
              </span>
            </div>
          )}

          {isRunning && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-elastic-red/10 rounded-lg border border-elastic-red/30">
              <Activity className="w-4 h-4 text-elastic-red animate-pulse" />
              <span className="text-sm font-medium text-elastic-red">LIVE</span>
            </div>
          )}

          {!isRunning && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-elastic-accent/10 rounded-lg border border-elastic-accent/30">
              <Zap className="w-4 h-4 text-elastic-accent" />
              <span className="text-sm font-medium text-elastic-accent">
                DEMO
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
