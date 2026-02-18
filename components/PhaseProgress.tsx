"use client";

import { motion } from "framer-motion";
import { DemoPhase } from "@/lib/types";
import { phaseToColor, getPhaseIndex } from "@/lib/utils";

interface PhaseProgressProps {
  phase: DemoPhase;
}

const PHASES: { id: DemoPhase; label: string; icon: string }[] = [
  { id: "alert", label: "Alert", icon: "🚨" },
  { id: "triage", label: "Triage", icon: "🔍" },
  { id: "diagnosis", label: "Diagnosis", icon: "🔬" },
  { id: "remediation", label: "Remediation", icon: "🔧" },
  { id: "communication", label: "Comms", icon: "📢" },
  { id: "resolved", label: "Resolved", icon: "✅" },
];

export default function PhaseProgress({ phase }: PhaseProgressProps) {
  const currentIdx = getPhaseIndex(phase);

  return (
    <motion.div
      className="flex items-center gap-1 p-4 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {PHASES.map((p, i) => {
        const phaseIdx = getPhaseIndex(p.id);
        const isCompleted = currentIdx > phaseIdx;
        const isCurrent = currentIdx === phaseIdx;
        const isPending = currentIdx < phaseIdx;

        return (
          <div key={p.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <motion.div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm relative"
                style={{
                  backgroundColor: isCompleted
                    ? `${phaseToColor(p.id)}25`
                    : isCurrent
                    ? `${phaseToColor(p.id)}20`
                    : "rgb(30 41 59)",
                  border: `1.5px solid ${
                    isCompleted || isCurrent
                      ? phaseToColor(p.id)
                      : "rgb(51 65 85)"
                  }`,
                }}
                animate={
                  isCurrent
                    ? {
                        boxShadow: [
                          `0 0 0px ${phaseToColor(p.id)}`,
                          `0 0 12px ${phaseToColor(p.id)}50`,
                          `0 0 0px ${phaseToColor(p.id)}`,
                        ],
                      }
                    : {}
                }
                transition={
                  isCurrent ? { duration: 2, repeat: Infinity } : {}
                }
              >
                {p.icon}
              </motion.div>
              <span
                className="text-[10px] mt-1 font-medium"
                style={{
                  color: isCompleted || isCurrent
                    ? phaseToColor(p.id)
                    : "rgb(100 116 139)",
                }}
              >
                {p.label}
              </span>
            </div>

            {i < PHASES.length - 1 && (
              <div className="w-full h-[2px] bg-slate-700 mx-1 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${phaseToColor(
                      p.id
                    )}, ${phaseToColor(PHASES[i + 1].id)})`,
                  }}
                  initial={{ width: "0%" }}
                  animate={{
                    width: isCompleted ? "100%" : isCurrent ? "50%" : "0%",
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}
          </div>
        );
      })}
    </motion.div>
  );
}
