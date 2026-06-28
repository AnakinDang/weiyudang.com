"use client";

import { useEffect, useState } from "react";
import {
  DORA_RELAY_HEALTH_URL,
  DORA_RELAY_WS_URL,
  type PublicDoraEventClientView
} from "@/lib/dora-public-client";
import { formatPublicEventDateTime } from "@/lib/dora-public-format";
import {
  mergeLiveEvents,
  normalizeRelayEvent,
  normalizeRelayHealth,
  type DoraRelayHealth
} from "@/lib/dora-live-relay";

// Shared browser-safe live-relay client. Both the public Doraemon Office bridge
// and the /dora entry activity preview consume the same proven health-poll +
// WebSocket state machine so live/demo posture stays consistent and honest.

export type DoraConnectionState = "checking" | "connected" | "live" | "fallback";

const HEALTH_POLL_MS = 30_000;
const RELAY_FALLBACK_MS = 4_500;
const RELAY_RECONNECT_BASE_MS = 5_000;
const RELAY_RECONNECT_MAX_MS = 60_000;

export function useDoraLiveEvents() {
  const [connection, setConnection] = useState<DoraConnectionState>("checking");
  const [health, setHealth] = useState<DoraRelayHealth | null>(null);
  const [events, setEvents] = useState<PublicDoraEventClientView[]>([]);

  useEffect(() => {
    let cancelled = false;
    let currentController: AbortController | null = null;

    async function loadHealth() {
      currentController?.abort();
      currentController = new AbortController();
      try {
        const response = await fetch(DORA_RELAY_HEALTH_URL, {
          cache: "no-store",
          signal: currentController.signal
        });
        if (!response.ok) throw new Error("relay health unavailable");
        const normalized = normalizeRelayHealth(await response.json());
        if (!normalized) throw new Error("relay health shape mismatch");
        if (!cancelled) setHealth(normalized);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        if (!cancelled) setHealth(null);
      }
    }

    void loadHealth();
    const timer = window.setInterval(() => void loadHealth(), HEALTH_POLL_MS);
    return () => {
      cancelled = true;
      currentController?.abort();
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    let closed = false;
    let socket: WebSocket | null = null;
    let fallbackTimer: number | undefined;
    let reconnectTimer: number | undefined;
    let reconnectAttempt = 0;

    function clearTimers() {
      if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
      if (reconnectTimer !== undefined) window.clearTimeout(reconnectTimer);
    }

    function reconnectDelay() {
      return Math.min(RELAY_RECONNECT_BASE_MS * 2 ** reconnectAttempt, RELAY_RECONNECT_MAX_MS);
    }

    function scheduleReconnect() {
      if (closed || reconnectTimer !== undefined) return;
      const delay = reconnectDelay();
      reconnectAttempt += 1;
      reconnectTimer = window.setTimeout(() => {
        reconnectTimer = undefined;
        connect();
      }, delay);
    }

    function markFallback(currentSocket: WebSocket) {
      if (closed) return;
      if (socket !== currentSocket) return;
      if (fallbackTimer !== undefined) {
        window.clearTimeout(fallbackTimer);
        fallbackTimer = undefined;
      }
      setConnection("fallback");
      if (currentSocket.readyState === WebSocket.CONNECTING || currentSocket.readyState === WebSocket.OPEN) {
        currentSocket.close();
      }
      scheduleReconnect();
    }

    function connect() {
      if (closed) return;
      const previousSocket = socket;
      const currentSocket = new WebSocket(DORA_RELAY_WS_URL);
      socket = currentSocket;
      previousSocket?.close();
      setConnection((current) => (current === "live" ? current : "checking"));
      fallbackTimer = window.setTimeout(() => {
        markFallback(currentSocket);
      }, RELAY_FALLBACK_MS);

      currentSocket.addEventListener("open", () => {
        if (closed || socket !== currentSocket) return;
        reconnectAttempt = 0;
        if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
        setConnection((current) => (current === "live" ? current : "connected"));
      });

      currentSocket.addEventListener("message", (message) => {
        if (closed || socket !== currentSocket || typeof message.data !== "string") return;

        try {
          const normalized = normalizeRelayEvent(JSON.parse(message.data));
          if (!normalized) return;
          setEvents((current) => mergeLiveEvents(current, normalized));
          setConnection("live");
        } catch {
          // Ignore malformed public frames; the fallback snapshot remains visible.
        }
      });

      currentSocket.addEventListener("error", () => markFallback(currentSocket));
      currentSocket.addEventListener("close", () => markFallback(currentSocket));
    }

    connect();

    return () => {
      closed = true;
      clearTimers();
      socket?.close();
    };
  }, []);

  return { connection, events, health };
}

export function visibleLiveEvents(liveEvents: PublicDoraEventClientView[]) {
  return liveEvents.filter(
    (event) =>
      !(event.event_type === "system" && event.severity === "normal" && /^(System health|Heartbeat)$/.test(event.title))
  );
}

export function displayEvents(
  liveEvents: PublicDoraEventClientView[],
  fallbackEvents: PublicDoraEventClientView[]
) {
  const visible = visibleLiveEvents(liveEvents);
  return visible.length > 0 ? visible : fallbackEvents;
}

export function focusEvent(events: PublicDoraEventClientView[]) {
  return events.find((event) => event.event_type !== "system") ?? events[0] ?? null;
}

export function modeLabel(connection: DoraConnectionState, liveEvents: PublicDoraEventClientView[]) {
  if (connection === "live") return "Live relay";
  if (connection === "connected") return "Relay connected · awaiting public events";
  if (connection === "checking") return "Checking relay";
  if (liveEvents.length > 0) return "Demo snapshot · relay reconnecting";
  return "Demo replay";
}

export function activityModeLabel(
  connection: DoraConnectionState,
  liveEvents: PublicDoraEventClientView[],
  hasVisibleLiveActivity: boolean
) {
  if (connection === "live" && hasVisibleLiveActivity) return "Live relay";
  if (connection === "live" || connection === "connected") return "Relay connected · demo snapshot";
  if (liveEvents.length > 0) return "Demo snapshot · relay reconnecting";
  if (connection === "checking") return "Checking relay";
  return "Demo replay";
}

export function freshnessLabel(liveEvents: PublicDoraEventClientView[]) {
  if (liveEvents.length === 0) return "Demo snapshot";
  return `Last event: ${formatPublicEventDateTime(liveEvents[0].created_at)}`;
}

export function replayBufferLabel(health: DoraRelayHealth | null) {
  if (!health) return "Sanitized only";
  return health.buffered > 0 ? "Public relay healthy" : "Public relay idle";
}
