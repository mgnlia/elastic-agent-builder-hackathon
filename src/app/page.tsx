import { Header } from "@/components/Header";
import { MetricsGrid } from "@/components/MetricsGrid";
import { IncidentTimeline } from "@/components/IncidentTimeline";
import { AgentPanel } from "@/components/AgentPanel";
import { MTTRComparison } from "@/components/MTTRComparison";
import { RecentIncidents } from "@/components/RecentIncidents";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Metrics */}
        <MetricsGrid />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline — 2 cols */}
          <div className="lg:col-span-2 space-y-6">
            <IncidentTimeline />
            <MTTRComparison />
          </div>

          {/* Sidebar — 1 col */}
          <div className="space-y-6">
            <AgentPanel />
            <RecentIncidents />
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-800 pt-6 pb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm text-gray-500">
                Built for the{" "}
                <a
                  href="https://elasticsearch-agent-builder-hackathon.devpost.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-elastic-blue hover:underline"
                >
                  Elasticsearch Agent Builder Hackathon
                </a>
              </p>
              <p className="text-xs text-gray-600 mt-1">
                4 AI agents × 12 tools × A2A protocol — reducing MTTR from 45min to 5min
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/mgnlia/elastic-agent-builder-hackathon"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                GitHub
              </a>
              <span className="text-xs text-gray-700">MIT License</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
