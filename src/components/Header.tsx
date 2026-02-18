"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Phase } from "@/data/scenario";

interface HeaderProps {
  phase: Phase;
  elapsedTime: number;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

const phaseLabels: Record<Phase, string> = {
  idle: "STANDBY",
  alert: "ALERT DETECTED",
  triage: "TRIAGE IN PROGRESS",
  diagnosis: "DIAGNOSIS IN PROGRESS",
  remediation: "REMEDIATION IN PROGRESS",
  communication: "GENERATING REPORT",
  resolved: "INCIDENT RESOLVED",
};

const phaseColors: Record<Phase, string> = {
  idle: "text-gray-500",
  alert: "text-red-400",
  triage: "text-accent-triage",
  diagnosis: "text-accent-diagnosis",
  remediation: "text-accent-remediation",
  communication: "text-accent-communication",
  resolved: "text-emerald-400",
};

const phaseDotColors: Record<Phase, string> = {
  idle: "bg-gray-600",
  alert: "bg-red-500",
  triage: "bg-accent-triage",
  diagnosis: "bg-accent-diagnosis",
  remediation: "bg-accent-remediation",
  communication: "bg-accent-communication",
  resolved: "bg-emerald-400",
};

export default function Header({ phase, elapsedTime }: HeaderProps) {
  return (
    <header className="border-b border-surface-3 bg-surface-1/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-elastic-teal to-elastic-blue flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            {phase !== "idle" && phase !== "resolved" && (
              <motion.div
                className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${phaseDotColors[phase]}`}
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-gray-100">
              Elastic Incident Commander
            </h1>
            <p className="text-[10px] font-mono text-gray-500 tracking-wider uppercase">
              Multi-Agent A2A Orchestration
            </p>
          </div>
        </div>

        {/* Center: Phase Status */}
        <div className="hidden sm:flex items-center gap-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2"
            >
              <span className={`w-2 h-2 rounded-full ${phaseDotColors[phase]} ${phase !== "idle" && phase !== "resolved" ? "animate-pulse" : ""}`} />
              <span className={`text-xs font-mono font-semibold tracking-wider ${phaseColors[phase]}`}>
                {phaseLabels[phase]}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Timer + Elastic badge */}
        <div className="flex items-center gap-4">
          <div className="font-mono text-lg tabular-nums tracking-wider text-gray-300">
            <span className="text-gray-600 text-xs mr-1.5">MTTR</span>
            {formatTime(elapsedTime)}
          </div>
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-3/50 border border-surface-4">
            <span className="text-[10px] font-mono text-elastic-teal">
              Powered by
            </span>
            <span className="text-[10px] font-mono font-bold text-gray-300">
              Elastic
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {phase !== "idle" && (
        <div className="h-[2px] bg-surface-3">
          <motion.div
            className="h-full bg-gradient-to-r from-accent-triage via-accent-diagnosis via-accent-remediation to-accent-communication"
            initial={{ width: "0%" }}
            animate={{ width: `${Math.min((elapsedTime / 115) * 100, 100)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}
    </header>
  );
}
