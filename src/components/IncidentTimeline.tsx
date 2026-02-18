"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TimelineEvent, DemoPhase } from "@/lib/types";
import { phaseToColor } from "@/lib/utils";
import { useState } from "react";

interface IncidentTimelineProps {
  events: TimelineEvent[];
  currentPhase: DemoPhase;
}

function EventCard({ event, index }: { event: TimelineEvent; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const color = phaseToColor(event.phase);

  return (
    <motion.div
      initial={{ opacity: 0, x: -30, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative pl-8"
    >
      {/* Timeline dot */}
      <motion.div
        className="absolute left-0 top-3 w-4 h-4 rounded-full border-2"
        style={{ borderColor: color, backgroundColor: `${color}30` }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, delay: index * 0.05 }}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: color }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Line */}
      <div
        className="absolute left-[7px] top-7 bottom-0 w-0.5"
        style={{ backgroundColor: `${color}20` }}
      />

      {/* Card */}
      <div
        className="bg-surface-2 border rounded-xl p-4 mb-3 cursor-pointer hover:bg-surface-3/50 transition-all"
        style={{ borderColor: `${color}20` }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color}15`, color }}>
                {event.timestamp}
              </span>
              {event.duration && event.duration > 0 && (
                <span className="text-xs font-mono text-gray-500">
                  {event.duration}s
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-white">{event.title}</h3>
            <p className="text-xs text-gray-400 mt-1">{event.description}</p>
          </div>
          <motion.span
            className="text-gray-500 text-xs mt-1 flex-shrink-0"
            animate={{ rotate: expanded ? 180 : 0 }}
          >
            ▼
          </motion.span>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {event.details && (
                <ul className="mt-3 space-y-1 border-t border-surface-4 pt-3">
                  {event.details.map((detail, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="text-xs text-gray-300 font-mono flex items-start gap-2"
                    >
                      <span className="text-gray-600 mt-0.5">›</span>
                      <span>{detail}</span>
                    </motion.li>
                  ))}
                </ul>
              )}

              {event.esqlQuery && (
                <div className="mt-3 border-t border-surface-4 pt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono text-elastic-teal uppercase tracking-wider">
                      ES|QL Query
                    </span>
                  </div>
                  <pre className="text-[11px] font-mono text-gray-300 bg-surface-0 rounded-lg p-3 overflow-x-auto whitespace-pre leading-relaxed">
                    {event.esqlQuery}
                  </pre>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function IncidentTimeline({
  events,
  currentPhase,
}: IncidentTimelineProps) {
  return (
    <div className="bg-surface-1 border border-surface-3 rounded-2xl p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
          Incident Timeline
        </h2>
        <span className="text-xs font-mono text-gray-500">
          {events.length} events
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {events.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-3xl mb-3 opacity-30">🎬</div>
              <p className="text-sm text-gray-500">
                Start the demo to see the incident timeline
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-0">
            <AnimatePresence>
              {events.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </AnimatePresence>

            {/* Active indicator */}
            {currentPhase !== "idle" && currentPhase !== "resolved" && (
              <motion.div
                className="pl-8 relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="absolute left-0 top-2 w-4 h-4 rounded-full border-2 border-surface-4"
                  animate={{
                    borderColor: [
                      phaseToColor(currentPhase),
                      `${phaseToColor(currentPhase)}50`,
                      phaseToColor(currentPhase),
                    ],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <div className="flex items-center gap-2 py-2">
                  <motion.div
                    className="flex gap-1"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                  </motion.div>
                  <span className="text-xs text-gray-500 font-mono">
                    Processing...
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
