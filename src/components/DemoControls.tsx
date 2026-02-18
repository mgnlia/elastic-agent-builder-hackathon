"use client";

import { motion, AnimatePresence } from "framer-motion";
import { DemoPhase } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DemoControlsProps {
  phase: DemoPhase;
  isPlaying: boolean;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSetSpeed: (speed: number) => void;
}

const PHASES: { id: DemoPhase; label: string; icon: string; color: string }[] = [
  { id: "alert", label: "Alert", icon: "🚨", color: "#FF6C2F" },
  { id: "triage", label: "Triage", icon: "🔍", color: "#F04E98" },
  { id: "diagnosis", label: "Diagnosis", icon: "🔬", color: "#0077CC" },
  { id: "remediation", label: "Remediation", icon: "🔧", color: "#00BFB3" },
  { id: "communication", label: "Comms", icon: "📢", color: "#FEC514" },
  { id: "resolved", label: "Resolved", icon: "✅", color: "#00BFB3" },
];

export default function DemoControls({
  phase,
  isPlaying,
  speed,
  onPlay,
  onPause,
  onReset,
  onSetSpeed,
}: DemoControlsProps) {
  const currentPhaseIdx = PHASES.findIndex((p) => p.id === phase);

  return (
    <div className="bg-surface-1 border border-surface-3 rounded-2xl p-5">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
            Demo Scenario
          </h2>
          <p className="text-xs text-gray-500 mt-0.5 font-mono">
            Payment Service CPU Spike
          </p>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 4].map((s) => (
            <button
              key={s}
              onClick={() => onSetSpeed(s)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-mono transition-all",
                speed === s
                  ? "bg-elastic-teal/20 text-elastic-teal border border-elastic-teal/30"
                  : "bg-surface-3 text-gray-400 border border-transparent hover:border-surface-4"
              )}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Phase Progress */}
      <div className="relative mb-5">
        {/* Track */}
        <div className="flex items-center gap-1">
          {PHASES.map((p, i) => {
            const isCompleted = i < currentPhaseIdx;
            const isActive = p.id === phase;
            const isFuture = i > currentPhaseIdx;

            return (
              <div key={p.id} className="flex-1 flex items-center">
                <motion.div
                  className={cn(
                    "relative flex items-center justify-center w-full rounded-lg py-2 px-1 transition-all border",
                    isActive
                      ? "border-opacity-50 bg-opacity-20"
                      : isCompleted
                      ? "border-opacity-30 bg-opacity-10"
                      : "border-surface-4 bg-surface-2"
                  )}
                  style={{
                    borderColor: isActive || isCompleted ? p.color : undefined,
                    backgroundColor:
                      isActive || isCompleted ? `${p.color}15` : undefined,
                  }}
                  animate={isActive ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <span className="text-sm mr-1">{p.icon}</span>
                  <span
                    className={cn(
                      "text-[10px] font-mono hidden lg:inline",
                      isActive
                        ? "text-white"
                        : isCompleted
                        ? "text-gray-300"
                        : "text-gray-500"
                    )}
                  >
                    {p.label}
                  </span>

                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-lg"
                      style={{ boxShadow: `0 0 15px ${p.color}20` }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>

                {i < PHASES.length - 1 && (
                  <div
                    className={cn(
                      "w-2 h-0.5 flex-shrink-0",
                      isCompleted ? "bg-gray-500" : "bg-surface-4"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <AnimatePresence mode="wait">
          {phase === "idle" || phase === "resolved" ? (
            <motion.button
              key="start"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => {
                if (phase === "resolved") {
                  onReset();
                  setTimeout(onPlay, 100);
                } else {
                  onPlay();
                }
              }}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-elastic-teal to-elastic-blue text-white font-semibold text-sm tracking-wide hover:shadow-lg hover:shadow-elastic-teal/20 transition-all"
            >
              {phase === "resolved" ? "▶ Replay Demo" : "▶ Start Demo"}
            </motion.button>
          ) : (
            <motion.div
              key="controls"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex-1 flex gap-2"
            >
              <button
                onClick={isPlaying ? onPause : onPlay}
                className={cn(
                  "flex-1 py-3 rounded-xl font-semibold text-sm tracking-wide transition-all",
                  isPlaying
                    ? "bg-elastic-orange/20 text-elastic-orange border border-elastic-orange/30 hover:bg-elastic-orange/30"
                    : "bg-elastic-teal/20 text-elastic-teal border border-elastic-teal/30 hover:bg-elastic-teal/30"
                )}
              >
                {isPlaying ? "⏸ Pause" : "▶ Resume"}
              </button>
              <button
                onClick={onReset}
                className="px-4 py-3 rounded-xl bg-surface-3 text-gray-400 text-sm hover:bg-surface-4 transition-all border border-surface-4"
              >
                ↺ Reset
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
