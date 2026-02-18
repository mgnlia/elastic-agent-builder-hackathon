"use client";

import { motion } from "framer-motion";
import { DemoPhase } from "@/lib/types";
import { formatDuration, phaseToColor } from "@/lib/utils";

interface HeaderProps {
  phase: DemoPhase;
  elapsedTime: number;
}

export default function Header({ phase, elapsedTime }: HeaderProps) {
  const isActive = phase !== "idle";
  const isResolved = phase === "resolved";

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl font-bold shadow-lg shadow-cyan-500/20">
              ⚡
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">
                Elastic Incident Commander
              </h1>
              <p className="text-xs text-slate-400">
                Multi-Agent A2A Incident Response
              </p>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center gap-6">
          {isActive && (
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="text-sm text-slate-400">Elapsed:</div>
              <div className="font-mono text-lg font-bold text-white tabular-nums">
                {formatDuration(elapsedTime)}
              </div>
            </motion.div>
          )}

          <motion.div
            className="flex items-center gap-2 px-4 py-2 rounded-full border"
            style={{
              borderColor: isActive ? phaseToColor(phase) : "rgb(51 65 85)",
              backgroundColor: isActive
                ? `${phaseToColor(phase)}15`
                : "transparent",
            }}
            animate={{
              borderColor: isActive ? phaseToColor(phase) : "rgb(51 65 85)",
            }}
          >
            {isActive && !isResolved && (
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: phaseToColor(phase) }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
            {isResolved && (
              <span className="text-sm">✅</span>
            )}
            <span
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: isActive ? phaseToColor(phase) : "#94a3b8" }}
            >
              {phase === "idle" ? "Standby" : phase}
            </span>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
