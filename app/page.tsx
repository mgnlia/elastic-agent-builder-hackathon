'use client';

import { useState, useEffect } from 'react';
import { Shield, TrendingUp, Zap, AlertTriangle, Github, ExternalLink } from 'lucide-react';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                AI Liquidation Prevention Agent
              </h1>
            </div>
            <a
              href="https://github.com/mgnlia/liquidation-prevention-agent"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              <Github className="w-5 h-5" />
              <span className="font-medium">View on GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full mb-6">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-semibold">HackMoney 2026 Project</span>
          </div>
          
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Never Get Liquidated Again
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            An autonomous AI agent that monitors your DeFi positions 24/7 and automatically rebalances 
            before liquidation strikes. Powered by Claude AI and flash loans.
          </p>

          <div className="flex items-center justify-center gap-4">
            <a
              href="https://github.com/mgnlia/liquidation-prevention-agent#quick-start"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Get Started
            </a>
            <a
              href="https://github.com/mgnlia/liquidation-prevention-agent#demo"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:border-blue-600 dark:hover:border-blue-400 transition-colors"
            >
              Watch Demo
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-4xl font-bold text-blue-600 mb-2">$2B+</div>
            <div className="text-gray-600 dark:text-gray-300">DeFi liquidations in 2023</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
            <div className="text-gray-600 dark:text-gray-300">Automated monitoring</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-4xl font-bold text-purple-600 mb-2">5-10%</div>
            <div className="text-gray-600 dark:text-gray-300">Saved in penalties</div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="AI-Powered Protection"
            description="Claude AI analyzes market conditions and predicts liquidation risk before it happens"
            color="blue"
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="Flash Loan Rebalancing"
            description="Uses Aave flash loans to rebalance positions with zero upfront capital"
            color="yellow"
          />
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Multi-Protocol Support"
            description="Works with Aave V3 and Compound V3 on multiple chains"
            color="green"
          />
          <FeatureCard
            icon={<AlertTriangle className="w-8 h-8" />}
            title="Real-Time Alerts"
            description="Get notified instantly when your health factor drops below safe levels"
            color="red"
          />
          <FeatureCard
            icon={<ExternalLink className="w-8 h-8" />}
            title="The Graph Integration"
            description="Efficient on-chain data indexing for fast position tracking"
            color="purple"
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="Non-Custodial"
            description="You maintain full control of your funds at all times"
            color="indigo"
          />
        </div>

        {/* How It Works */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 mb-16">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            How It Works
          </h3>
          
          <div className="space-y-6">
            <Step
              number={1}
              title="Monitor Positions"
              description="The AI agent continuously monitors your DeFi positions across Aave and Compound using The Graph subgraphs"
            />
            <Step
              number={2}
              title="Analyze Risk"
              description="Claude AI analyzes your health factor, market volatility, and liquidation thresholds to predict risk"
            />
            <Step
              number={3}
              title="Execute Rebalancing"
              description="When risk is detected, the agent automatically executes a flash loan strategy to rebalance your position"
            />
            <Step
              number={4}
              title="Stay Protected"
              description="Your position is maintained at a safe health factor, avoiding costly liquidation penalties"
            />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Protect Your DeFi Positions?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join the future of automated DeFi risk management
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://github.com/mgnlia/liquidation-prevention-agent"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              View Documentation
            </a>
            <a
              href="https://github.com/mgnlia/liquidation-prevention-agent#deployment"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Deploy Now
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="mb-2">Built for HackMoney 2026</p>
            <p className="text-sm">
              Powered by Claude AI • Aave V3 • Compound V3 • The Graph • Next.js
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  const colorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    green: 'text-green-600 dark:text-green-400',
    red: 'text-red-600 dark:text-red-400',
    purple: 'text-purple-600 dark:text-purple-400',
    indigo: 'text-indigo-600 dark:text-indigo-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
      <div className={`${colorClasses[color as keyof typeof colorClasses]} mb-4`}>
        {icon}
      </div>
      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h4>
      <p className="text-gray-600 dark:text-gray-300">
        {description}
      </p>
    </div>
  );
}

function Step({ number, title, description }: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
        {number}
      </div>
      <div className="flex-1">
        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h4>
        <p className="text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </div>
    </div>
  );
}
