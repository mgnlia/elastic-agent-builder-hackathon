"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TimelineEvent } from "@/lib/types";
import { phaseToColor } from "@/lib/utils";

interface IncidentTimelineProps {
  events: TimelineEvent[];
}

export default function IncidentTimeline({ events }: IncidentTimelineProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">📋</span>
          <h2 className="text-sm font-bold text-white">Incident Timeline</h2>
        </div>
        <span className="text-xs text-slate-500 font-mono">{events.length} events</span>
      </div>

      <div className="p-4 max-h-[600px] overflow-y-auto custom-scrollbar">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-600">
            <span className="text-3xl mb-3">⏳</span>
            <p className="text-sm">Waiting for incident...</p>
            <p className="text-xs mt-1">Press Start Demo to begin</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-slate-700 via-slate-700 to-transparent" />

            <AnimatePresence mode="popLayout">
              {events.map((event, idx) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -30, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: "auto" }}
                  transition={{
                    duration: 0.5,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                  className="relative pl-12 pb-6 last:pb-0"
                >
                  {/* Timeline dot */}
                  <motion.div
                    className="absolute left-[12px] top-1 w-[15px] h-[15px] rounded-full border-2 z-10"
                    style={{
                      borderColor: phaseToColor(event.phase),
                      backgroundColor: `${phaseToColor(event.phase)}30`,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                  >
                    {idx === events.length - 1 && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: phaseToColor(event.phase) }}
                        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-500">
                        {event.timestamp}
                      </span>
                      {event.duration !== undefined && event.duration > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                          ~{event.duration}s
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-semibold text-white">
                      {event.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {event.description}
                    </p>

                    {event.details && (
                      <motion.div
                        className="mt-2 p-3 rounded-lg bg-slate-950/70 border border-slate-800"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {event.details.map((detail, i) => (
                          <motion.div
                            key={i}
                            className="text-xs text-slate-400 py-0.5 font-mono"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + i * 0.08 }}
                          >
                            <span className="text-slate-600 mr-2">›</span>
                            {detail}
                          </motion.div>
                        ))}
                      </motion.div>
                    )}

                    {event.esqlQuery && (
                      <motion.div
                        className="mt-2 p-3 rounded-lg border overflow-x-auto"
                        style={{
                          borderColor: `${phaseToColor(event.phase)}30`,
                          backgroundColor: `${phaseToColor(event.phase)}08`,
                        }}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                            style={{
                              color: phaseToColor(event.phase),
                              backgroundColor: `${phaseToColor(event.phase)}20`,
                            }}
                          >
                            ES|QL
                          </span>
                        </div>
                        <pre className="text-[11px] text-slate-300 font-mono whitespace-pre leading-relaxed">
                          {event.esqlQuery}
                        </pre>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
