"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Phase,
  AgentId,
  PHASE_ORDER,
  TIMELINE_EVENTS,
  AGENT_MESSAGES,
  TimelineEvent,
  AgentMessage,
} from "@/data/scenario";

export interface DemoState {
  phase: Phase;
  isPlaying: boolean;
  speed: number;
  elapsedTime: number;       // seconds
  events: TimelineEvent[];   // visible events so far
  messages: AgentMessage[];  // visible messages so far
  activeAgent: AgentId | null;
}

// Timestamps mapped to seconds
function parseTimestamp(ts: string): number {
  const [min, sec] = ts.split(":").map(Number);
  return min * 60 + sec;
}

function getPhaseForTime(elapsed: number): Phase {
  if (elapsed < 0) return "idle";
  if (elapsed < 2) return "alert";
  if (elapsed < 16) return "triage";       // 2 + 14
  if (elapsed < 46) return "diagnosis";    // 16 + 30
  if (elapsed < 76) return "remediation";  // 46 + 30
  if (elapsed < 96) return "communication"; // 76 + 20
  return "resolved";
}

function getActiveAgent(phase: Phase): AgentId | null {
  switch (phase) {
    case "triage": return "triage";
    case "diagnosis": return "diagnosis";
    case "remediation": return "remediation";
    case "communication": return "communication";
    default: return null;
  }
}

const TOTAL_DURATION = 120; // 2 minutes total demo

export function useDemo() {
  const [state, setState] = useState<DemoState>({
    phase: "idle",
    isPlaying: false,
    speed: 1,
    elapsedTime: 0,
    events: [],
    messages: [],
    activeAgent: null,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const elapsedRef = useRef(0);
  const speedRef = useRef(1);

  // Keep speedRef in sync
  useEffect(() => {
    speedRef.current = state.speed;
  }, [state.speed]);

  const tick = useCallback(() => {
    elapsedRef.current += 0.1 * speedRef.current;
    const elapsed = elapsedRef.current;

    if (elapsed >= TOTAL_DURATION) {
      // Demo complete
      elapsedRef.current = TOTAL_DURATION;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setState((prev) => ({
        ...prev,
        phase: "resolved",
        isPlaying: false,
        elapsedTime: TOTAL_DURATION,
        events: TIMELINE_EVENTS,
        messages: AGENT_MESSAGES,
        activeAgent: null,
      }));
      return;
    }

    const phase = getPhaseForTime(elapsed);
    const activeAgent = getActiveAgent(phase);

    // Filter events/messages visible at current time
    const visibleEvents = TIMELINE_EVENTS.filter(
      (e) => parseTimestamp(e.timestamp) <= elapsed
    );
    const visibleMessages = AGENT_MESSAGES.filter(
      (m) => parseTimestamp(m.timestamp) <= elapsed
    );

    setState((prev) => ({
      ...prev,
      phase,
      elapsedTime: Math.round(elapsed * 10) / 10,
      events: visibleEvents,
      messages: visibleMessages,
      activeAgent,
    }));
  }, []);

  const play = useCallback(() => {
    if (intervalRef.current) return;

    // If at end, reset first
    if (elapsedRef.current >= TOTAL_DURATION) {
      elapsedRef.current = 0;
    }

    setState((prev) => ({ ...prev, isPlaying: true }));
    intervalRef.current = setInterval(tick, 100);
  }, [tick]);

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    elapsedRef.current = 0;
    setState({
      phase: "idle",
      isPlaying: false,
      speed: speedRef.current,
      elapsedTime: 0,
      events: [],
      messages: [],
      activeAgent: null,
    });
  }, []);

  const setSpeed = useCallback((speed: number) => {
    speedRef.current = speed;
    setState((prev) => ({ ...prev, speed }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { state, play, pause, reset, setSpeed };
}
