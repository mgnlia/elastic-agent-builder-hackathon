"use client";

import { Header } from "@/components/Header";
import { DemoControls } from "@/components/DemoControls";
import { IncidentTimeline } from "@/components/IncidentTimeline";
import { AgentPanel } from "@/components/AgentPanel";
import { MetricsDashboard } from "@/components/MetricsDashboard";
import { useDemo } from "@/hooks/useDemo";

export default function Home() {
  const { state, start, pause, resume, reset, stepForward, setSpeed } =
    useDemo();

  const isResolved = state.incident.phase === "resolved";

  return (
    <div className="min-h-screen bg-elastic-darker text-elastic-text">
      <Header
        incidentId={state.incident.id}
        phase={state.incident.phase}
        isRunning={state.isRunning}
      />

      <main className="max-w-[1920px] mx-auto px-6 py-4">
        {/* Demo Controls */}
        <div className="mb-4">
          <DemoControls
            isRunning={state.isRunning}
            isPaused={state.isPaused}
            currentStep={state.currentStep}
            totalSteps={state.totalSteps}
            speed={state.speed}
            onStart={start}
            onPause={pause}
            onResume={resume}
            onReset={reset}
            onSpeedChange={setSpeed}
            onStepForward={stepForward}
          />
        </div>

        {/* Main Grid: Timeline | Agents | Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4" style={{ height: "calc(100vh - 200px)" }}>
          {/* Timeline — left column */}
          <div className="lg:col-span-4 overflow-hidden">
            <IncidentTimeline
              events={state.incident.timeline}
              currentStep={state.currentStep}
            />
          </div>

          {/* Agent Panel — center */}
          <div className="lg:col-span-4 overflow-hidden">
            <AgentPanel
              agents={state.agents}
              messages={state.incident.messages}
            />
          </div>

          {/* Metrics — right column */}
          <div className="lg:col-span-4 overflow-y-auto">
            <MetricsDashboard
              metrics={state.metrics}
              incident={state.incident}
              isResolved={isResolved}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-6 py-4 border-t border-elastic-border text-center">
          <p className="text-xs text-elastic-muted">
            Built with{" "}
            <span className="text-elastic-accent font-medium">
              Elastic Agent Builder
            </span>{" "}
            ×{" "}
            <span className="text-elastic-blue font-medium">
              A2A Protocol
            </span>{" "}
            — Elasticsearch Agent Builder Hackathon 2026
          </p>
        </footer>
      </main>
    </div>
  );
}
