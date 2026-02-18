"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { DemoPhase, DemoState, TimelineEvent, A2AMessage, AgentId } from "@/lib/types";
import { TIMELINE_EVENTS, A2A_MESSAGES } from "@/lib/demo-data";

const PHASE_ORDER: DemoPhase[] = [
  "idle",
  "alert",
  "triage",
  "diagnosis",
  "remediation",
  "communication",
  "resolved",
];

// Cumulative message indices for each phase
const PHASE_MESSAGE_COUNTS: Record<DemoPhase, number> = {
  idle: 0,
  alert: 1,
  triage: 2,
  diagnosis: 5,
  remediation: 8,
  communication: 10,
  resolved: 11,
};

const PHASE_DURATIONS: Record<DemoPhase, number> = {
  idle: 0,
  alert: 2000,
  triage: 4000,
  diagnosis: 5000,
  remediation: 5000,
  communication: 4000,
  resolved: 0,
};

const PHASE_TO_AGENT: Record<DemoPhase, AgentId | null> = {
  idle: null,
  alert: null,
  triage: "triage",
  diagnosis: "diagnosis",
  remediation: "remediation",
  communication: "communication",
  resolved: null,
};

export function useDemo() {
  const [state, setState] = useState<DemoState>({
    phase: "idle",
    isPlaying: false,
    speed: 1,
    currentEventIndex: -1,
    elapsedTime: 0,
    events: [],
    messages: [],
    activeAgent: null,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const elapsedRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (elapsedRef.current) {
      clearInterval(elapsedRef.current);
      elapsedRef.current = null;
    }
  }, []);

  const advancePhase = useCallback(() => {
    setState((prev) => {
      const currentIdx = PHASE_ORDER.indexOf(prev.phase);
      if (currentIdx >= PHASE_ORDER.length - 1) {
        return { ...prev, isPlaying: false };
      }

      const nextPhase = PHASE_ORDER[currentIdx + 1];
      const eventIdx = currentIdx; // events are 0-indexed starting from alert
      const newEvents =
        eventIdx >= 0 && eventIdx < TIMELINE_EVENTS.length
          ? [...prev.events, TIMELINE_EVENTS[eventIdx]]
          : prev.events;

      const msgCount = PHASE_MESSAGE_COUNTS[nextPhase];
      const newMessages = A2A_MESSAGES.slice(0, msgCount);

      return {
        ...prev,
        phase: nextPhase,
        currentEventIndex: eventIdx,
        events: newEvents,
        messages: newMessages,
        activeAgent: PHASE_TO_AGENT[nextPhase],
      };
    });
  }, []);

  // Schedule next phase advance
  useEffect(() => {
    if (!state.isPlaying || state.phase === "resolved") {
      if (state.phase === "resolved") {
        setState((prev) => ({ ...prev, isPlaying: false }));
      }
      return;
    }

    const duration = PHASE_DURATIONS[state.phase] / state.speed;
    if (duration > 0) {
      timerRef.current = setTimeout(advancePhase, duration);
    } else {
      // For idle, advance immediately
      timerRef.current = setTimeout(advancePhase, 500 / state.speed);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [state.phase, state.isPlaying, state.speed, advancePhase]);

  // Elapsed time counter
  useEffect(() => {
    if (state.isPlaying && state.phase !== "idle" && state.phase !== "resolved") {
      elapsedRef.current = setInterval(() => {
        setState((prev) => ({
          ...prev,
          elapsedTime: prev.elapsedTime + 0.1,
        }));
      }, 100 / state.speed);
    } else {
      if (elapsedRef.current) {
        clearInterval(elapsedRef.current);
        elapsedRef.current = null;
      }
    }

    return () => {
      if (elapsedRef.current) clearInterval(elapsedRef.current);
    };
  }, [state.isPlaying, state.phase, state.speed]);

  const play = useCallback(() => {
    setState((prev) => {
      if (prev.phase === "resolved") {
        return prev; // Don't restart
      }
      return { ...prev, isPlaying: true };
    });
  }, []);

  const pause = useCallback(() => {
    clearTimers();
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, [clearTimers]);

  const reset = useCallback(() => {
    clearTimers();
    setState({
      phase: "idle",
      isPlaying: false,
      speed: 1,
      currentEventIndex: -1,
      elapsedTime: 0,
      events: [],
      messages: [],
      activeAgent: null,
    });
  }, [clearTimers]);

  const setSpeed = useCallback((speed: number) => {
    setState((prev) => ({ ...prev, speed }));
  }, []);

  const skipToPhase = useCallback(
    (targetPhase: DemoPhase) => {
      clearTimers();
      const targetIdx = PHASE_ORDER.indexOf(targetPhase);
      const events = TIMELINE_EVENTS.slice(0, targetIdx);
      const msgCount = PHASE_MESSAGE_COUNTS[targetPhase];
      const messages = A2A_MESSAGES.slice(0, msgCount);

      setState((prev) => ({
        ...prev,
        phase: targetPhase,
        currentEventIndex: targetIdx - 1,
        events,
        messages,
        activeAgent: PHASE_TO_AGENT[targetPhase],
        isPlaying: false,
      }));
    },
    [clearTimers]
  );

  return {
    state,
    play,
    pause,
    reset,
    setSpeed,
    skipToPhase,
  };
}
