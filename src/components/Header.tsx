"use client";

import { Shield, Zap } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-gray-800 bg-gray-900/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-elastic-blue/20">
              <Shield className="w-5 h-5 text-elastic-blue" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Incident Commander
              </h1>
              <p className="text-xs text-gray-500">
                Multi-Agent DevOps Response • Elastic Agent Builder
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium text-emerald-400">
                Demo Mode
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-800 text-xs text-gray-400">
              <Zap className="w-3 h-3" />
              4 Agents Online
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
