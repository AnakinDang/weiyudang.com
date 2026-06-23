"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2, Radio, ShieldCheck, Target } from "lucide-react";
import {
  DORA_LIVE_BRIDGE_URL,
  DORA_RELAY_HEALTH_URL,
  DORA_RELAY_WS_URL,
  formatPublicEventDateTime,
  type PublicDoraEvent
} from "@/lib/dora-office";
import { mergeLiveEvents, normalizeRelayEvent, normalizeRelayHealth, type DoraRelayHealth } from "@/lib/dora-live-relay";

type ConnectionState = "checking" | "connected" | "live" | "fallback";

export type DoraOfficeBridgeEvent = Pick<
  PublicDoraEvent,
  "event_id" | "created_at" | "event_type" | "agent" | "state" | "severity" | "title"
>;

const HEALTH_POLL_MS = 30_000;
const RELAY_FALLBACK_MS = 4_500;
const RELAY_RECONNECT_BASE_MS = 5_000;
const RELAY_RECONNECT_MAX_MS = 60_000;

type DoraOfficeLiveBridgeProps = {
  fallbackEvents: DoraOfficeBridgeEvent[];
  boundaryItems: readonly string[];
};

function useDoraOfficeLiveEvents() {
  const [connection, setConnection] = useState<ConnectionState>("checking");
  const [health, setHealth] = useState<DoraRelayHealth | null>(null);
  const [events, setEvents] = useState<PublicDoraEvent[]>([]);

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

function visibleLiveEvents(liveEvents: PublicDoraEvent[]) {
  return liveEvents.filter(
    (event) => !(event.event_type === "system" && event.severity === "normal" && /^(System health|Heartbeat)$/.test(event.title))
  );
}

function displayEvents(liveEvents: PublicDoraEvent[], fallbackEvents: PublicDoraEvent[]) {
  const visible = visibleLiveEvents(liveEvents);
  return visible.length > 0 ? visible : fallbackEvents;
}

function focusEvent(events: PublicDoraEvent[]) {
  return events.find((event) => event.event_type !== "system") ?? events[0] ?? null;
}

function modeLabel(connection: ConnectionState, liveEvents: PublicDoraEvent[]) {
  if (connection === "live") return "Live relay";
  if (connection === "connected") return "Live relay · awaiting events";
  if (connection === "checking") return "Checking relay";
  if (liveEvents.length > 0) return "Demo replay · relay reconnecting";
  return "Demo replay";
}

function activityModeLabel(connection: ConnectionState, liveEvents: PublicDoraEvent[], hasVisibleLiveActivity: boolean) {
  if (connection === "live" && hasVisibleLiveActivity) return "Live relay";
  if (connection === "live" || connection === "connected") return "Live relay · demo activity";
  if (liveEvents.length > 0) return "Demo replay · relay reconnecting";
  if (connection === "checking") return "Checking relay";
  return "Demo replay";
}

function freshnessLabel(liveEvents: PublicDoraEvent[]) {
  if (liveEvents.length === 0) return "Demo snapshot";
  return `Last event: ${formatPublicEventDateTime(liveEvents[0].created_at)}`;
}

function replayBufferLabel(health: DoraRelayHealth | null) {
  if (!health) return "Sanitized only";
  return health.buffered > 0 ? "Public relay healthy" : "Public relay idle";
}

export function DoraOfficeLiveBridge({ fallbackEvents, boundaryItems }: DoraOfficeLiveBridgeProps) {
  const live = useDoraOfficeLiveEvents();
  const events = useMemo(() => displayEvents(live.events, fallbackEvents), [fallbackEvents, live.events]);
  const hasVisibleLiveActivity = useMemo(() => visibleLiveEvents(live.events).length > 0, [live.events]);
  const currentFocus = focusEvent(events);
  const bridgeHost = DORA_LIVE_BRIDGE_URL.replace(/^https?:\/\//, "");
  const currentMode = modeLabel(live.connection, live.events);
  const activityMode = activityModeLabel(live.connection, live.events, hasVisibleLiveActivity);
  const isLive = live.connection === "live" || live.connection === "connected";
  const heartbeatRows = [
    { label: "Relay mode", value: currentMode },
    { label: "Public schema", value: "Closed allowlist" },
    { label: "Event freshness", value: freshnessLabel(live.events) },
    {
      label: "Replay buffer",
      value: replayBufferLabel(live.health)
    }
  ];

  return (
    <>
      <aside className="dora-office-product-command-rail" aria-label="Office Live public context">
        <section className="dora-office-product-command-card">
          <Target size={20} aria-hidden />
          <h2>Current Focus</h2>
          <strong>{currentFocus?.title ?? "Demo snapshot"}</strong>
          <p>{hasVisibleLiveActivity ? "Live public relay event mapped through the native site allowlist." : "Public-safe activity snapshot with live relay heartbeat shown below."}</p>
          <dl>
            <div>
              <dt>Led by</dt>
              <dd>{currentFocus?.agent ?? "Doraemon"}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{currentFocus?.state ?? "Demo"}</dd>
            </div>
          </dl>
        </section>

        <section className="dora-office-product-command-card">
          <ShieldCheck size={20} aria-hidden />
          <h2>Public Boundary</h2>
          <ul>
            {boundaryItems.slice(0, 4).map((item) => (
              <li key={item}>
                <CheckCircle2 size={13} aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="dora-office-product-command-card">
          <Radio size={20} aria-hidden />
          <h2>System Heartbeat</h2>
          <dl>
            {heartbeatRows.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="dora-office-product-command-card dora-office-product-bridge-card">
          <ArrowUpRight size={20} aria-hidden />
          <h2>Full-screen bridge</h2>
          <p>The native routes are primary. The visualizer remains available when the stage needs more room.</p>
          <a
            href={DORA_LIVE_BRIDGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open full-screen visualizer ${bridgeHost} in a new tab`}
            className="link-focus"
          >
            {bridgeHost}
            <ArrowUpRight size={13} aria-hidden />
          </a>
        </section>
      </aside>

      <section className="dora-office-product-livebar" aria-label="Recent public-safe Doraemon Office activity">
        <div className="dora-office-product-livebar-head">
          <span aria-hidden className={isLive ? "is-live" : undefined} />
          <strong>Recent public activity</strong>
          <small>{activityMode} · Newest first</small>
        </div>
        <ol>
          {events.slice(0, 5).map((event) => (
            <li key={event.event_id}>
              <time dateTime={event.created_at}>{formatPublicEventDateTime(event.created_at)}</time>
              <strong>{event.agent}</strong>
              <span>{event.title}</span>
            </li>
          ))}
        </ol>
        <Link href="/dora/activity" className="link-focus dora-office-product-livebar-link">
          View all
          <ArrowRight size={14} aria-hidden />
        </Link>
      </section>

      <div className="sr-only" aria-live="polite">
        Doraemon Office public relay mode: {currentMode}.
      </div>
    </>
  );
}
