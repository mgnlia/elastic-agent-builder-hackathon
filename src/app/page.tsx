"use client";

import { useDemo } from "@/hooks/useDemo";
import Header from "@/components/Header";
import DemoControls from "@/components/DemoControls";
import IncidentTimeline from "@/components/IncidentTimeline";
import AgentPanel from "@/components/AgentPanel";
import MetricsDashboard from "@/components/MetricsDashboard";
import { motion } from "framer-motion";

export default function Home() {
  const { state, play, pause, reset, setSpeed } = useDemo();

  return (
    <div className="min-h-screen bg-surface-0 bg-grid flex flex-col">
      <Header phase={state.phase} elapsedTime={state.elapsedTime} />

      <main className="flex-1 max-w-[1600px] mx-auto w-full px-4 sm:px-6 py-5">
        {/* Demo Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5"
        >
          <DemoControls
            phase={state.phase}
            isPlaying={state.isPlaying}
            speed={state.speed}
            onPlay={play}
            onPause={pause}
            onReset={reset}
            onSetSpeed={setSpeed}
          />
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Timeline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-4 lg:h-[calc(100vh-280px)]"
          >
            <IncidentTimeline
              events={state.events}
              currentPhase={state.phase}
            />
          </motion.div>

          {/* Center: Agent Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-5 lg:h-[calc(100vh-280px)]"
          >
            <AgentPanel
              activeAgent={state.activeAgent}
              messages={state.messages}
              phase={state.phase}
            />
          </motion.div>

          {/* Right: Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <MetricsDashboard
              phase={state.phase}
              elapsedTime={state.elapsedTime}
            />
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-3 bg-surface-1/50 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between">
          <p className="text-[11px] font-mono text-gray-600">
            Built for the{" "}
            <a
              href="https://elasticsearch-agent-builder-hackathon.devpost.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-elastic-teal/60 hover:text-elastic-teal transition-colors"
            >
              Elastic Agent Builder Hackathon
            </a>
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-mono text-gray-600">
              Elastic Agent Builder + A2A Protocol
            </span>
            <span className="text-[11px] font-mono text-gray-600">
              Next.js 14 • TypeScript • Tailwind CSS
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
