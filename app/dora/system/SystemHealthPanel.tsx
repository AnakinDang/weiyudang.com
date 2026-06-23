"use client";

import { useMemo, useState } from "react";
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
import { publicSystemToneClasses } from "@/lib/dora-public-client";
import type { DoraRelayHealth } from "@/lib/dora-live-relay";
import { freshnessLabel, useDoraLiveEvents, visibleLiveEvents, type DoraConnectionState } from "@/lib/use-dora-live";
import type { publicSystemBoundaries, publicSystemEvents, publicSystemStatus } from "@/lib/dora-office";

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

type ProbeMode = "live" | "checking" | "fallback";

function isRelayConnected(connection: DoraConnectionState) {
  return connection === "live" || connection === "connected";
}

// Overlay live, public-safe posture onto the static demo statuses. `health` is
// the single source of truth (non-null only when the relay is connected AND the
// health endpoint responded), so the overlay never disagrees with the probe
// card. Only coarse labels cross the boundary — never raw viewers/buffered/seen.
function applyRelayOverlay(
  statuses: readonly PublicSystemStatus[],
  health: DoraRelayHealth | null,
  lastEventFreshness: string
): DisplaySystemStatus[] {
  if (!health) {
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
      value: health.hasRegistry ? "Registry snapshot OK" : "Registry pending",
      detail: health.hasRegistry
        ? "The relay has a sanitized public registry snapshot available."
        : "The relay is live, but the public registry snapshot is not ready yet."
    }),
    "Event freshness": (status: PublicSystemStatus) => ({
      ...status,
      value: lastEventFreshness,
      tone: lastEventFreshness === "Awaiting public signal" ? ("info" as const) : ("normal" as const),
      detail: "Freshness is derived from the public event stream without exposing event-rate counters."
    }),
    "Replay buffer": (status: PublicSystemStatus) => ({
      ...status,
      value: health.seen >= health.buffered ? "Dedupe aligned" : "Dedupe watching",
      detail: "Replay and dedupe posture are summarized without publishing raw counter values."
    })
  } as const satisfies Record<PublicSystemStatus["label"], (status: PublicSystemStatus) => DisplaySystemStatus>;

  return statuses.map((status) => relayStatusOverlays[status.label](status));
}

function relayProbeEvent(mode: ProbeMode): DisplaySystemEvent {
  if (mode === "live") {
    return {
      time: "Live",
      label: "Relay health probe",
      state: "OK",
      tone: "normal",
      detail: "The public health endpoint responded with safe counters only."
    };
  }

  if (mode === "checking") {
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

function probeBadgeLabel(mode: ProbeMode) {
  if (mode === "live") return "Live";
  if (mode === "checking") return "Checking";
  return "Fallback";
}

function probeCheckedLabel(mode: ProbeMode) {
  if (mode === "live") return "Live relay connected";
  if (mode === "checking") return "Checking relay";
  return "Fallback active";
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
  const live = useDoraLiveEvents();
  const [toneFilter, setToneFilter] = useState<HealthFilter>("all");

  const connected = isRelayConnected(live.connection);
  // Single source of truth: treat health as live only when the socket is
  // connected AND the health endpoint responded. The probe card, the health
  // fields, and the status-board overlay all derive from this, so they can
  // never disagree (e.g. a "Live" badge over a "fallback" body).
  const liveHealth = connected ? live.health : null;
  const isLive = liveHealth !== null;
  const probeMode: ProbeMode = isLive ? "live" : live.connection === "fallback" ? "fallback" : "checking";

  const visibleEvents = useMemo(() => visibleLiveEvents(live.events), [live.events]);
  const lastEventFreshness = useMemo(
    () => (visibleEvents.length > 0 ? freshnessLabel(visibleEvents) : isLive ? "Awaiting public signal" : "Demo snapshot"),
    [isLive, visibleEvents]
  );
  const displayStatuses = useMemo(
    () => applyRelayOverlay(statuses, liveHealth, lastEventFreshness),
    [lastEventFreshness, liveHealth, statuses]
  );
  const displayEventList = useMemo(
    () => [relayProbeEvent(probeMode), ...events],
    [events, probeMode]
  );
  const filteredStatuses = useMemo(
    () => (toneFilter === "all" ? displayStatuses : displayStatuses.filter((status) => status.tone === toneFilter)),
    [displayStatuses, toneFilter]
  );
  const safeCounterText = liveHealth ? "Public relay healthy" : "Safe snapshot";
  const activeFilterLabels = [
    { key: "state", label: toneFilter === "all" ? "All public signals" : toneFilterLabels[toneFilter] },
    { key: "privacy", label: "No private details" },
    { key: "mode", label: "Display-only" }
  ];

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
              {displayEventList.map((event) => (
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

          <section className={`dora-system-probe-card ${isLive ? "is-normal" : "is-info"}`} aria-label="Live relay probe">
            <div className="dora-system-probe-heading">
              <Radio size={20} aria-hidden />
              <div>
                <strong>Live relay probe</strong>
                <p>{probeCheckedLabel(probeMode)}</p>
              </div>
              <StatusBadge tone={isLive ? "normal" : "info"}>{probeBadgeLabel(probeMode)}</StatusBadge>
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
                <dd>{liveHealth ? (liveHealth.hasRegistry ? "ready" : "pending") : "fallback"}</dd>
              </div>
              <div>
                <dt>Presence</dt>
                <dd>{liveHealth ? "Public relay active" : "not shown"}</dd>
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
