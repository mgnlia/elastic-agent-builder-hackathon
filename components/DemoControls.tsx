"use client";

import { motion } from "framer-motion";
import { DemoPhase } from "@/lib/types";

interface DemoControlsProps {
  phase: DemoPhase;
  isPlaying: boolean;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

export default function DemoControls({
  phase,
  isPlaying,
  speed,
  onPlay,
  onPause,
  onReset,
  onSpeedChange,
}: DemoControlsProps) {
  const speeds = [0.5, 1, 2, 3];

  return (
    <motion.div
      className="flex items-center gap-4 p-4 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center gap-2">
        {phase === "resolved" ? (
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-sm transition-all"
          >
            <span>↺</span> Replay
          </button>
        ) : (
          <>
            <motion.button
              onClick={isPlaying ? onPause : onPlay}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
              style={{
                background: isPlaying
                  ? "linear-gradient(135deg, #f97316, #ef4444)"
                  : "linear-gradient(135deg, #06b6d4, #3b82f6)",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? (
                <>
                  <span>⏸</span> Pause
                </>
              ) : (
                <>
                  <span>▶</span> {phase === "idle" ? "Start Demo" : "Resume"}
                </>
              )}
            </motion.button>

            {phase !== "idle" && (
              <button
                onClick={onReset}
                className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-sm transition-all"
              >
                ↺
              </button>
            )}
          </>
        )}
      </div>

      <div className="h-8 w-px bg-slate-700" />

      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 font-medium">Speed:</span>
        {speeds.map((s) => (
          <button
            key={s}
            onClick={() => onSpeedChange(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              speed === s
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                : "bg-slate-800 text-slate-400 hover:text-white border border-transparent"
            }`}
          >
            {s}x
          </button>
        ))}
      </div>

      <div className="h-8 w-px bg-slate-700" />

      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span className="font-medium">Scenario:</span>
        <span className="text-slate-300">Payment Service CPU Spike</span>
      </div>
    </motion.div>
  );
}
