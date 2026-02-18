"use client";

import { motion } from "framer-motion";
import { DemoPhase } from "@/lib/types";
import { formatDuration } from "@/lib/utils";

interface HeaderProps {
  phase: DemoPhase;
  elapsedTime: number;
}

export default function Header({ phase, elapsedTime }: HeaderProps) {
  const isActive = phase !== "idle";

  return (
    <header className="relative border-b border-surface-3 bg-surface-1/80 backdrop-blur-xl">
      {/* Scan line effect */}
      {isActive && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-elastic-teal/30 to-transparent"
            animate={{ y: [0, 64] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}

      <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-4">
          <motion.div
            className="relative"
            animate={isActive ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-elastic-teal to-elastic-blue flex items-center justify-center">
              <span className="text-xl">🛡️</span>
            </div>
            {isActive && (
              <motion.div
                className="absolute -inset-1 rounded-xl bg-elastic-teal/20 blur-sm"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>

          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Elastic Incident Commander
            </h1>
            <p className="text-xs text-gray-400 font-mono">
              Multi-Agent A2A Incident Response • Elastic Agent Builder
            </p>
          </div>
        </div>

        {/* Center: Status */}
        <div className="flex items-center gap-6">
          {isActive && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-3 border border-surface-4">
                <motion.div
                  className={`w-2 h-2 rounded-full ${
                    phase === "resolved" ? "bg-green-400" : "bg-elastic-orange"
                  }`}
                  animate={
                    phase !== "resolved"
                      ? { opacity: [1, 0.3, 1] }
                      : {}
                  }
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-sm font-mono text-gray-300 uppercase tracking-wider">
                  {phase === "resolved" ? "Resolved" : phase}
                </span>
              </div>

              <div className="px-3 py-1.5 rounded-full bg-surface-3 border border-surface-4">
                <span className="text-sm font-mono text-elastic-teal">
                  {formatDuration(elapsedTime)}
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right: Badges */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-3/50 border border-surface-4/50">
            <div className="w-1.5 h-1.5 rounded-full bg-elastic-teal animate-pulse" />
            <span className="text-xs font-mono text-gray-400">4 Agents</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-3/50 border border-surface-4/50">
            <span className="text-xs font-mono text-gray-400">12 ES|QL Tools</span>
          </div>
          <a
            href="https://github.com/mgnlia/elastic-agent-builder-hackathon"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-full bg-surface-3/50 border border-surface-4/50 hover:border-elastic-teal/50 transition-colors"
          >
            <span className="text-xs font-mono text-gray-400">GitHub ↗</span>
          </a>
        </div>
      </div>
    </header>
  );
}
