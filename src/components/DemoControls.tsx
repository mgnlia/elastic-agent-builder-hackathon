"use client";

import { Play, Pause, RotateCcw, FastForward, SkipForward } from "lucide-react";

interface DemoControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onStepForward: () => void;
}

export function DemoControls({
  isRunning,
  isPaused,
  currentStep,
  totalSteps,
  speed,
  onStart,
  onPause,
  onResume,
  onReset,
  onSpeedChange,
  onStepForward,
}: DemoControlsProps) {
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;
  const isComplete = currentStep >= totalSteps;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-elastic-muted uppercase tracking-wider">
          Demo Controls
        </h3>
        <span className="text-xs text-elastic-muted">
          Step {currentStep}/{totalSteps}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-elastic-darker rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-elastic-blue to-elastic-accent rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center gap-2">
        {/* Play / Pause */}
        {!isRunning ? (
          <button
            onClick={onStart}
            className="btn-accent flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            {isComplete ? "Replay" : "Start Demo"}
          </button>
        ) : isPaused ? (
          <button
            onClick={onResume}
            className="btn-accent flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Resume
          </button>
        ) : (
          <button
            onClick={onPause}
            className="btn-secondary flex items-center gap-2"
          >
            <Pause className="w-4 h-4" />
            Pause
          </button>
        )}

        {/* Step forward */}
        <button
          onClick={onStepForward}
          disabled={isComplete}
          className="btn-secondary flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          className="btn-secondary flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Speed controls */}
        <div className="ml-auto flex items-center gap-1">
          <FastForward className="w-4 h-4 text-elastic-muted mr-1" />
          {[1, 2, 5].map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                speed === s
                  ? "bg-elastic-accent text-elastic-darker"
                  : "bg-elastic-darker text-elastic-muted hover:text-elastic-text"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
