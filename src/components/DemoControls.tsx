"use client";

import { motion } from "framer-motion";
import { Phase } from "@/data/scenario";

interface DemoControlsProps {
  phase: Phase;
  isPlaying: boolean;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSetSpeed: (speed: number) => void;
}

const SPEEDS = [1, 2, 5, 10];

export default function DemoControls({
  phase,
  isPlaying,
  speed,
  onPlay,
  onPause,
  onReset,
  onSetSpeed,
}: DemoControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface-1 border border-surface-3">
      {/* Left: Play controls */}
      <div className="flex items-center gap-2">
        {/* Play/Pause */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isPlaying ? onPause : onPlay}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${
            isPlaying
              ? "bg-surface-3 text-gray-300 hover:bg-surface-4"
              : "bg-elastic-teal text-surface-0 hover:bg-elastic-teal/90"
          }`}
        >
          {isPlaying ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
              PAUSE
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21" />
              </svg>
              {phase === "idle" ? "START DEMO" : phase === "resolved" ? "REPLAY" : "RESUME"}
            </>
          )}
        </motion.button>

        {/* Reset */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-2 text-gray-400 hover:text-gray-200 hover:bg-surface-3 font-mono text-xs transition-all border border-surface-3"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          RESET
        </motion.button>
      </div>

      {/* Center: Scenario label */}
      <div className="hidden sm:flex items-center gap-2">
        <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wider">Scenario:</span>
        <span className="text-xs font-mono text-gray-300 bg-surface-2 px-2.5 py-1 rounded-md border border-surface-3">
          🔥 Payment Service CPU Spike
        </span>
      </div>

      {/* Right: Speed controls */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-mono text-gray-600 mr-1">SPEED</span>
        {SPEEDS.map((s) => (
          <motion.button
            key={s}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSetSpeed(s)}
            className={`px-2.5 py-1 rounded-md font-mono text-[11px] font-semibold transition-all ${
              speed === s
                ? "bg-elastic-teal/20 text-elastic-teal border border-elastic-teal/40"
                : "bg-surface-2 text-gray-500 hover:text-gray-300 border border-surface-3"
            }`}
          >
            {s}x
          </motion.button>
        ))}
      </div>
    </div>
  );
}
