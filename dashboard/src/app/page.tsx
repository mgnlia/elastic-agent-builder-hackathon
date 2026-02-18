"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import AgentCard from "@/components/AgentCard";
import Timeline from "@/components/Timeline";
import A2AFlow from "@/components/A2AFlow";
import MetricsPanel from "@/components/MetricsPanel";
import IncidentHeader from "@/components/IncidentHeader";
import {
  AGENTS,
  DEMO_TIMELINE,
  DEMO_MESSAGES,
  DEMO_METRICS,
  createDemoIncident,
  getPhaseForStep,
} from "@/lib/demo-scenario";
import type { IncidentState, A2AMessage } from "@/lib/types";

export default function DashboardPage() {
  const [incident, setIncident] = useState<IncidentState>(createDemoIncident);
  const [currentStep, setCurrentStep] = useState(-1);
  const [visibleMessages, setVisibleMessages] = useState<A2AMessage[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<1 | 2 | 4>(1);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timelineEndRef = useRef<HTMLDivElement>(null);

  const totalSteps = DEMO_TIMELINE.length;

  // Advance one step
  const advanceStep = useCallback(() => {
    setCurrentStep((prev) => {
      const next = prev + 1;
      if (next >= totalSteps) {
        setIsPlaying(false);
        return prev;
      }

      const { phase, agents } = getPhaseForStep(next);
      const timelineSlice = DEMO_TIMELINE.slice(0, next + 1);

      // Check if this step triggers an A2A message
      const stepTime = DEMO_TIMELINE[next].timestamp;
      const newMessages = DEMO_MESSAGES.filter(
        (m) => m.timestamp <= stepTime
      );

      setVisibleMessages(newMessages);
      setIncident((inc) => ({
        ...inc,
        phase,
        agents,
        timeline: timelineSlice,
        messages: newMessages,
        rootCause:
          next >= 9
            ? "Memory leak in payment-service v2.15.0"
            : inc.rootCause,
        resolveTime: phase === "resolved" ? Date.now() : undefined,
        mttr: phase === "resolved" ? 4.2 : undefined,
      }));

      return next;
    });
  }, [totalSteps]);

  // Auto-play timer
  useEffect(() => {
    if (isPlaying) {
      const interval = 2000 / speed;
      timerRef.current = setInterval(advanceStep, interval);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isPlaying, speed, advanceStep]);

  // Elapsed time counter
  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000 / speed);
      return () => clearInterval(timer);
    }
  }, [isPlaying, speed]);

  // Auto-scroll timeline
  useEffect(() => {
    timelineEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentStep]);

  const handlePlay = () => {
    if (currentStep >= totalSteps - 1) {
      // Reset
      setCurrentStep(-1);
      setIncident(createDemoIncident());
      setVisibleMessages([]);
      setElapsedSeconds(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => setIsPlaying(false);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(-1);
    setIncident(createDemoIncident());
    setVisibleMessages([]);
    setElapsedSeconds(0);
  };

  const handleStepForward = () => {
    if (!isPlaying && currentStep < totalSteps - 1) {
      advanceStep();
      setElapsedSeconds((s) => s + 7);
    }
  };

  const isResolved = incident.phase === "resolved";

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-6">
      <div className="max-w-[1400px] mx-auto">
        <IncidentHeader incident={incident} elapsedSeconds={elapsedSeconds} />

        {/* Demo Controls */}
        <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-gray-900/50 border border-gray-800">
          <span className="text-[10px] uppercase tracking-wider text-gray-500 mr-2">
            Demo Mode
          </span>

          {!isPlaying ? (
            <button
              onClick={handlePlay}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-elastic-teal text-gray-950 hover:bg-elastic-teal/90 transition"
            >
              {currentStep >= totalSteps - 1 ? "⟳ Replay" : "▶ Play"}
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-yellow-500 text-gray-950 hover:bg-yellow-400 transition"
            >
              ⏸ Pause
            </button>
          )}

          <button
            onClick={handleStepForward}
            disabled={isPlaying || currentStep >= totalSteps - 1}
            className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600 transition disabled:opacity-30"
          >
            ⏭ Step
          </button>

          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600 transition"
          >
            ↺ Reset
          </button>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-[10px] text-gray-500">Speed:</span>
            {([1, 2, 4] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-1 text-[10px] rounded ${
                  speed === s
                    ? "bg-elastic-blue text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {s}x
              </button>
            ))}
            <span className="ml-3 text-xs text-gray-500 font-mono">
              Step {Math.max(0, currentStep + 1)}/{totalSteps}
            </span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Agent Cards */}
          <div className="lg:col-span-3 space-y-3">
            <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-2">
              Agent Status
            </h2>
            {AGENTS.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                status={incident.agents[agent.role]}
                currentAction={
                  incident.agents[agent.role] === "active"
                    ? DEMO_TIMELINE[currentStep]?.action
                    : undefined
                }
              />
            ))}
          </div>

          {/* Center: Timeline */}
          <div className="lg:col-span-5">
            <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-2">
              Incident Timeline
            </h2>
            <div className="max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
              <Timeline events={DEMO_TIMELINE} currentIndex={currentStep} />
              <div ref={timelineEndRef} />
            </div>
          </div>

          {/* Right: A2A Messages + Metrics */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                A2A Protocol Messages
              </h2>
              <div className="max-h-80 overflow-y-auto">
                <A2AFlow messages={visibleMessages} />
              </div>
            </div>

            <div>
              <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                Impact Metrics
              </h2>
              <MetricsPanel metrics={DEMO_METRICS} isResolved={isResolved} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between text-[10px] text-gray-600">
          <span>
            Built with{" "}
            <a
              href="https://www.elastic.co/docs/explore-analyze/ai-features/elastic-agent-builder"
              className="text-elastic-blue hover:underline"
              target="_blank"
            >
              Elastic Agent Builder
            </a>{" "}
            · ES|QL · A2A Protocol · Custom Tools
          </span>
          <span>Elasticsearch Agent Builder Hackathon 2026</span>
        </div>
      </div>
    </div>
  );
}
