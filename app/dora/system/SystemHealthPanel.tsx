"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowRight,
  Database,
  Eye,
  LockKeyhole,
  Radio,
  RefreshCw,
  ShieldCheck,
  Signal,
  TimerReset
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import {
  DORA_RELAY_HEALTH_URL,
  publicSystemToneClasses,
  type publicSystemBoundaries,
  type publicSystemEvents,
  type publicSystemStatus
} from "@/lib/dora-office";

type PublicSystemStatus = (typeof publicSystemStatus)[number];
type PublicSystemEvent = (typeof publicSystemEvents)[number];
type PublicSystemBoundary = (typeof publicSystemBoundaries)[number];
type PublicSystemTone = PublicSystemStatus["tone"] | PublicSystemEvent["tone"];
type HealthFilter = "all" | PublicSystemTone;
type DisplaySystemStatus = Omit<PublicSystemStatus, "value" | "detail" | "tone"> & {
  value: string;
  detail: string;
  tone: PublicSystemTone;
};
type DisplaySystemEvent = {
  time: string;
  label: string;
  state: string;
  tone: PublicSystemTone;
  detail: string;
};

type RelayHealth = {
  viewers: number;
  buffered: number;
  seen: number;
  hasRegistry: boolean;
};

type RelayProbe =
  | { state: "checking"; checkedLabel: string; health: null }
  | { state: "live"; checkedLabel: string; health: RelayHealth }
  | { state: "fallback"; checkedLabel: string; health: null };

const statusIcons = {
  "Relay mode": Radio,
  "Public schema": ShieldCheck,
  "Event freshness": TimerReset,
  "Replay buffer": RefreshCw
} as const satisfies Record<PublicSystemStatus["label"], LucideIcon>;

const toneFilterLabels = {
  normal: "OK",
  info: "Info",
  private: "Private"
} as const satisfies Record<PublicSystemTone, string>;

const toneFilters = [
  { value: "all" as const, label: "All" },
  { value: "normal" as const, label: "OK" },
  { value: "info" as const, label: "Info" },
  { value: "private" as const, label: "Private" }
] as const satisfies readonly { value: HealthFilter; label: string }[];

function systemToneClass(item: { tone: PublicSystemTone }) {
  return publicSystemToneClasses[item.tone];
}

function readCount(value: unknown) {
  if (!Number.isInteger(value)) {
    return null;
  }

  const count = value as number;
  return count >= 0 ? count : null;
}

function parseRelayHealth(payload: unknown): RelayHealth | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const body = payload as Record<string, unknown>;
  if (body["status"] !== "ok") {
    return null;
  }

  const viewers = readCount(body["viewers"]);
  const buffered = readCount(body["buffered"]);
  const seen = readCount(body["seen"]);
  const hasRegistry = body["has_registry"];

  if (viewers === null || buffered === null || seen === null || typeof hasRegistry !== "boolean") {
    return null;
  }

  return { viewers, buffered, seen, hasRegistry };
}

function applyRelayProbe(statuses: readonly PublicSystemStatus[], probe: RelayProbe): DisplaySystemStatus[] {
  if (probe.state !== "live") {
    return statuses.map((status) => ({ ...status }));
  }

  const relayStatusOverlays = {
    "Relay mode": (status: PublicSystemStatus) => ({
      ...status,
      value: "Live relay",
      tone: "normal" as const,
      detail: "The public relay health endpoint responded with an OK posture and safe aggregate counters."
    }),
    "Public schema": (status: PublicSystemStatus) => ({
      ...status,
      value: probe.health.hasRegistry ? "Registry snapshot OK" : "Registry pending",
      detail: probe.health.hasRegistry
        ? "The relay has a sanitized public registry snapshot available."
        : "The relay is live, but the public registry snapshot is not ready yet."
    }),
    "Event freshness": (status: PublicSystemStatus) => ({
      ...status,
      value: `${probe.health.buffered} public events`,
      detail: "The relay publishes a safe replay-buffer count as the public freshness proxy."
    }),
    "Replay buffer": (status: PublicSystemStatus) => ({
      ...status,
      value: probe.health.seen >= probe.health.buffered ? "Dedupe aligned" : "Dedupe watching",
      detail: `${probe.health.buffered} sanitized replay entries and ${probe.health.seen} recent dedupe markers are visible as counts only.`
    })
  } as const satisfies Record<PublicSystemStatus["label"], (status: PublicSystemStatus) => DisplaySystemStatus>;

  return statuses.map((status) => relayStatusOverlays[status.label](status));
}

function relayProbeEvent(probe: RelayProbe): DisplaySystemEvent {
  if (probe.state === "live") {
    return {
      time: "Live",
      label: "Relay health probe",
      state: "OK",
      tone: "normal",
      detail: "The public health endpoint responded with safe counters only."
    };
  }

  if (probe.state === "checking") {
    return {
      time: "Check",
      label: "Relay health probe",
      state: "Checking",
      tone: "info",
      detail: "The browser is checking the public relay health endpoint."
    };
  }

  return {
    time: "Fallback",
    label: "Relay health probe",
    state: "Demo",
    tone: "info",
    detail: "Live relay health is unavailable here, so the page keeps its static public snapshot."
  };
}

export function SystemHealthPanel({
  statuses,
  events,
  boundaries
}: {
  statuses: readonly PublicSystemStatus[];
  events: readonly PublicSystemEvent[];
  boundaries: readonly PublicSystemBoundary[];
}) {
  const [relayProbe, setRelayProbe] = useState<RelayProbe>({
    state: "checking",
    checkedLabel: "Checking",
    health: null
  });
  const [toneFilter, setToneFilter] = useState<HealthFilter>("all");

  const displayStatuses = useMemo(() => applyRelayProbe(statuses, relayProbe), [relayProbe, statuses]);
  const displayEvents = useMemo(() => [relayProbeEvent(relayProbe), ...events], [events, relayProbe]);
  const filteredStatuses = useMemo(
    () => (toneFilter === "all" ? displayStatuses : displayStatuses.filter((status) => status.tone === toneFilter)),
    [displayStatuses, toneFilter]
  );
  const safeCounterText = relayProbe.health
    ? `${relayProbe.health.buffered} buffered / ${relayProbe.health.seen} seen`
    : "Safe snapshot";
  const activeFilterLabels = [
    { key: "state", label: toneFilter === "all" ? "All public signals" : toneFilterLabels[toneFilter] },
    { key: "privacy", label: "No private details" },
    { key: "mode", label: "Display-only" }
  ];

  useEffect(() => {
    const controller = new AbortController();

    async function checkRelay() {
      try {
        const response = await fetch(DORA_RELAY_HEALTH_URL, {
          cache: "no-store",
          credentials: "omit",
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error("relay health unavailable");
        }

        const health = parseRelayHealth(await response.json());
        if (!health) {
          throw new Error("relay health shape mismatch");
        }

        setRelayProbe({ state: "live", checkedLabel: "Checked just now", health });
      } catch {
        if (!controller.signal.aborted) {
          setRelayProbe({ state: "fallback", checkedLabel: "Fallback active", health: null });
        }
      }
    }

    void checkRelay();

    return () => controller.abort();
  }, []);

  return (
    <div className="dora-system dora-system-register">
      <section className="dora-system-controls" aria-label="System health filters">
        <div>
          <div className="dora-system-controls-head">
            <div>
              <strong>Filter public health</strong>
              <p>Every control filters sanitized health posture only.</p>
            </div>
            <span aria-live="polite" aria-atomic="true">
              {filteredStatuses.length} shown
            </span>
          </div>

          <div className="dora-system-filter-group" role="group" aria-label="Public health tone filters">
            {toneFilters.map((item) => (
              <button
                key={item.value}
                type="button"
                className={toneFilter === item.value ? "is-active" : ""}
                aria-pressed={toneFilter === item.value}
                onClick={() => setToneFilter(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <ul className="dora-system-active-filters" aria-label="Current public health guarantees">
            {activeFilterLabels.map((item) => (
              <li key={item.key}>{item.label}</li>
            ))}
          </ul>
        </div>
      </section>

      <div className="dora-system-register-layout">
        <section className="dora-system-status-board" aria-labelledby="dora-system-status-title">
          <div className="dora-system-section-heading">
            <div>
              <h3 id="dora-system-status-title">Public health checks</h3>
              <p>Coarse relay posture, schema state, freshness, and replay health only.</p>
            </div>
            <Database size={22} aria-hidden />
          </div>

          <div className="dora-system-status-list">
            {filteredStatuses.length === 0 ? (
              <article className="dora-system-empty" aria-live="polite">
                <Eye size={18} aria-hidden />
                <div>
                  <h4>No public health check matches this filter</h4>
                  <p>Try a broader signal. Private operational detail remains hidden.</p>
                </div>
                <button type="button" onClick={() => setToneFilter("all")}>
                  Show all
                </button>
              </article>
            ) : (
              filteredStatuses.map((item) => {
                const Icon = statusIcons[item.label];

                return (
                  <article key={item.label} className={`dora-system-status-row ${systemToneClass(item)}`}>
                    <span className="dora-system-status-icon">
                      <Icon size={20} aria-hidden />
                    </span>
                    <div className="dora-system-status-main">
                      <div>
                        <h4>{item.label}</h4>
                        <StatusBadge tone={item.tone}>{toneFilterLabels[item.tone]}</StatusBadge>
                      </div>
                      <strong>{item.value}</strong>
                      <p>{item.detail}</p>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>

        <aside className="dora-system-side" aria-label="System health boundary and bridges">
          <section className="dora-system-stream-card" aria-label="Public health stream">
            <div className="dora-system-section-heading">
              <div>
                <h3>Public health stream</h3>
                <p>Fixed labels for safe system posture, not operational detail.</p>
              </div>
              <Signal size={21} aria-hidden />
            </div>

            <div className="dora-system-event-list">
              {displayEvents.map((event) => (
                <article key={`${event.time}-${event.label}`} className={`dora-system-event ${systemToneClass(event)}`}>
                  <span className="dora-system-event-window">{event.time}</span>
                  <span className="dora-system-event-dot" aria-hidden="true" />
                  <div>
                    <h4>{event.label}</h4>
                    <p>{event.detail}</p>
                  </div>
                  <StatusBadge tone={event.tone}>{event.state}</StatusBadge>
                </article>
              ))}
            </div>
          </section>

          <section className="dora-system-boundary-card" aria-label="System boundary">
            <div className="dora-system-section-heading">
              <div>
                <h3>System boundary</h3>
                <p>Health is public. Operations stay private.</p>
              </div>
              <ShieldCheck size={21} aria-hidden />
            </div>
            <ul>
              {boundaries.map((rule) => (
                <li key={rule}>
                  <ShieldCheck size={16} aria-hidden />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={`dora-system-probe-card ${relayProbe.state === "live" ? "is-normal" : "is-info"}`} aria-label="Live relay probe">
            <div className="dora-system-probe-heading">
              <Radio size={20} aria-hidden />
              <div>
                <strong>Live relay probe</strong>
                <p>{relayProbe.checkedLabel}</p>
              </div>
              <StatusBadge tone={relayProbe.state === "live" ? "normal" : "info"}>
                {relayProbe.state === "live" ? "Live" : relayProbe.state === "checking" ? "Checking" : "Fallback"}
              </StatusBadge>
            </div>
            <p className="dora-system-probe-copy">
              Reads only the public health summary. Private operational detail is not rendered.
            </p>
            <dl>
              <div>
                <dt>Counters</dt>
                <dd>{safeCounterText}</dd>
              </div>
              <div>
                <dt>Registry</dt>
                <dd>{relayProbe.health ? (relayProbe.health.hasRegistry ? "ready" : "pending") : "fallback"}</dd>
              </div>
              <div>
                <dt>Viewers</dt>
                <dd>{relayProbe.health ? relayProbe.health.viewers : "not shown"}</dd>
              </div>
            </dl>
          </section>

          <section className="dora-system-owner-card" aria-label="Owner operations boundary">
            <LockKeyhole size={20} aria-hidden />
            <strong>Owner cockpit</strong>
            <p>Owner-only operations stay behind authenticated access.</p>
          </section>

          <section className="dora-system-link-card" aria-label="Activity bridge">
            <Activity size={20} aria-hidden />
            <strong>Activity bridge</strong>
            <p>Open the public activity feed for the latest sanitized system labels.</p>
            <Link href="/dora/activity" className="link-focus">
              View Activity
              <ArrowRight size={15} aria-hidden />
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
