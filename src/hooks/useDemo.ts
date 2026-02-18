"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { DemoState, Agent, AgentId } from "@/lib/types";
import {
  createInitialDemoState,
  DEMO_TIMELINE,
  DEMO_MESSAGES,
  DEMO_METRICS,
  STEP_DELAYS,
} from "@/lib/demo-data";

function getActiveAgent(step: number): AgentId | null {
  if (step <= 0 || step > DEMO_TIMELINE.length) return null;
  return DEMO_TIMELINE[step - 1].agent || null;
}

function updateAgentStatuses(agents: Agent[], step: number): Agent[] {
  const event = step > 0 ? DEMO_TIMELINE[step - 1] : null;
  const currentAgent = event?.agent;

  // Determine which agents have been seen
  const seenAgents = new Set<AgentId>();
  for (let i = 0; i < step; i++) {
    const a = DEMO_TIMELINE[i].agent;
    if (a) seenAgents.add(a);
  }

  return agents.map((agent) => {
    if (agent.id === currentAgent) {
      return {
        ...agent,
        status: "active" as const,
        messagesProcessed: agent.messagesProcessed + 1,
        avgResponseTime: event?.durationMs || agent.avgResponseTime || 2500,
      };
    }
    if (seenAgents.has(agent.id) && agent.id !== currentAgent) {
      return { ...agent, status: "complete" as const };
    }
    return { ...agent, status: "idle" as const };
  });
}

export function useDemo() {
  const [state, setState] = useState<DemoState>(createInitialDemoState);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stepRef = useRef(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const advanceStep = useCallback(() => {
    setState((prev) => {
      const nextStep = prev.currentStep + 1;
      if (nextStep > DEMO_TIMELINE.length) {
        return {
          ...prev,
          isRunning: false,
          isPaused: false,
        };
      }

      const event = DEMO_TIMELINE[nextStep - 1];
      const messagesUpToNow = DEMO_MESSAGES.filter(
        (m) => m.timestamp <= event.timestamp
      );

      return {
        ...prev,
        currentStep: nextStep,
        incident: {
          ...prev.incident,
          phase: event.phase,
          timeline: DEMO_TIMELINE.slice(0, nextStep),
          messages: messagesUpToNow,
          ...(event.phase === "resolved"
            ? { resolvedTime: event.timestamp }
            : {}),
        },
        agents: updateAgentStatuses(prev.agents, nextStep),
      };
    });
    stepRef.current += 1;
  }, []);

  const scheduleNext = useCallback(
    (step: number, speed: number) => {
      if (step >= DEMO_TIMELINE.length) return;
      const delay = (STEP_DELAYS[step] || 3000) / speed;
      timerRef.current = setTimeout(() => {
        advanceStep();
        scheduleNext(step + 1, speed);
      }, delay);
    },
    [advanceStep]
  );

  const start = useCallback(() => {
    clearTimer();
    const initial = createInitialDemoState();
    setState({ ...initial, isRunning: true, isPaused: false });
    stepRef.current = 0;

    // Immediately show first event, then schedule rest
    setTimeout(() => {
      setState((prev) => {
        const event = DEMO_TIMELINE[0];
        return {
          ...prev,
          currentStep: 1,
          incident: {
            ...prev.incident,
            phase: event.phase,
            timeline: [event],
            messages: DEMO_MESSAGES.filter(
              (m) => m.timestamp <= event.timestamp
            ),
          },
          agents: updateAgentStatuses(prev.agents, 1),
        };
      });
      stepRef.current = 1;
      scheduleNext(1, 1);
    }, 500);
  }, [clearTimer, scheduleNext]);

  const pause = useCallback(() => {
    clearTimer();
    setState((prev) => ({ ...prev, isPaused: true }));
  }, [clearTimer]);

  const resume = useCallback(() => {
    setState((prev) => {
      const updated = { ...prev, isPaused: false };
      scheduleNext(prev.currentStep, prev.speed);
      return updated;
    });
  }, [scheduleNext]);

  const reset = useCallback(() => {
    clearTimer();
    stepRef.current = 0;
    setState(createInitialDemoState());
  }, [clearTimer]);

  const stepForward = useCallback(() => {
    clearTimer();
    advanceStep();
    setState((prev) => ({
      ...prev,
      isRunning: true,
      isPaused: true,
    }));
  }, [clearTimer, advanceStep]);

  const setSpeed = useCallback(
    (speed: number) => {
      setState((prev) => {
        if (prev.isRunning && !prev.isPaused) {
          clearTimer();
          scheduleNext(prev.currentStep, speed);
        }
        return { ...prev, speed };
      });
    },
    [clearTimer, scheduleNext]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    state,
    start,
    pause,
    resume,
    reset,
    stepForward,
    setSpeed,
  };
}
