"use client";

import { useDemo } from "@/hooks/useDemo";
import Header from "@/components/Header";
import DemoControls from "@/components/DemoControls";
import PhaseProgress from "@/components/PhaseProgress";
import IncidentTimeline from "@/components/IncidentTimeline";
import AgentPanel from "@/components/AgentPanel";
import MetricsDashboard from "@/components/MetricsDashboard";

export default function Home() {
  const { state, play, pause, reset, setSpeed } = useDemo();

  return (
    <div className="min-h-screen flex flex-col">
      <Header phase={state.phase} elapsedTime={state.elapsedTime} />

      <main className="flex-1 max-w-[1600px] mx-auto w-full px-6 py-6 space-y-5">
        {/* Controls */}
        <DemoControls
          phase={state.phase}
          isPlaying={state.isPlaying}
          speed={state.speed}
          onPlay={play}
          onPause={pause}
          onReset={reset}
          onSpeedChange={setSpeed}
        />

        {/* Phase Progress */}
        <PhaseProgress phase={state.phase} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Timeline - Left */}
          <div className="lg:col-span-5">
            <IncidentTimeline events={state.events} />
          </div>

          {/* Agent Panel - Center */}
          <div className="lg:col-span-4">
            <AgentPanel
              activeAgent={state.activeAgent}
              messages={state.messages}
            />
          </div>

          {/* Metrics - Right */}
          <div className="lg:col-span-3">
            <MetricsDashboard phase={state.phase} />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-6 border-t border-slate-800/50">
          <p className="text-xs text-slate-600">
            Built for the{" "}
            <span className="text-cyan-500 font-semibold">
              Elastic Agent Builder Hackathon
            </span>{" "}
            — Multi-agent incident response using A2A protocol, ES|QL, and
            Elastic Observability
          </p>
        </footer>
      </main>
    </div>
  );
}
