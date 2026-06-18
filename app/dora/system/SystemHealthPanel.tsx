"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CheckCircle2,
  Database,
  Eye,
  LockKeyhole,
  Radio,
  RefreshCw,
  ShieldCheck,
  Signal,
  Sparkles,
  TimerReset
} from "lucide-react";
import { DoraemonMark } from "@/components/DoraemonMark";
import {
  DoraOfficeHeroArt,
  DoraOfficeHeroBoundaryCard,
  DoraOfficeHeroBoundaryStrip,
  DoraOfficeHeroCopy,
  DoraOfficeHeroSignalRail
} from "@/components/DoraOfficeHero";
import { StatusBadge } from "@/components/StatusBadge";
import { DORA_RELAY_HEALTH_URL, type publicSystemBoundaries, type publicSystemEvents, type publicSystemStatus } from "@/lib/dora-office";

type PublicSystemStatus = (typeof publicSystemStatus)[number];
type PublicSystemEvent = (typeof publicSystemEvents)[number];
type PublicSystemBoundary = (typeof publicSystemBoundaries)[number];
type PublicSystemTone = PublicSystemStatus["tone"] | PublicSystemEvent["tone"];
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
  "Event freshness": Signal,
  "Replay buffer": Database
} as const satisfies Record<PublicSystemStatus["label"], LucideIcon>;

const lensIcons = {
  "Relay mode": Radio,
  "Public schema": ShieldCheck,
  "Event freshness": TimerReset,
  "Replay buffer": RefreshCw
} as const satisfies Record<PublicSystemStatus["label"], LucideIcon>;

function systemToneClass(item: { tone: PublicSystemTone }) {
  switch (item.tone) {
    case "normal":
      return "is-normal";
    case "private":
      return "is-private";
    case "info":
      return "is-info";
    default: {
      const exhaustiveTone: never = item.tone;
      return exhaustiveTone;
    }
  }
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
  const displayStatuses = useMemo(() => applyRelayProbe(statuses, relayProbe), [relayProbe, statuses]);
  const displayEvents = useMemo(() => [relayProbeEvent(relayProbe), ...events], [events, relayProbe]);
  const primaryStatus = displayStatuses[0];
  const previewStatuses = displayStatuses.slice(0, 6);

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
    <div className="dora-system">
      <section className="dora-system-hero" aria-label="Public Doraemon Office health lens">
        <DoraOfficeHeroArt className="dora-system-hero-art" />
        <DoraOfficeHeroCopy
          className="dora-system-hero-copy"
          lines={["System health.", "Safe signal only."]}
          summary="Mode, schema posture, freshness, and replay health without private infrastructure detail."
        />

        <DoraOfficeHeroBoundaryCard
          className="dora-system-hero-boundary-card"
          items={[
            { icon: Eye, title: "Public posture", detail: "Safe health labels" },
            { icon: LockKeyhole, title: "Private internals", detail: "Diagnostics hidden" }
          ]}
        />

        <div className="dora-system-lens" aria-hidden="true">
          <div className="dora-system-lens-ring dora-system-lens-ring-outer" />
          <div className="dora-system-lens-ring dora-system-lens-ring-middle" />
          <div className="dora-system-lens-ring dora-system-lens-ring-inner" />
          <div className="dora-system-lens-core">
            <DoraemonMark />
            <strong>Public health</strong>
            <span>{primaryStatus.value}</span>
          </div>
          {/* The health lens is intentionally tuned for the four public status categories in the System contract. */}
          {displayStatuses.map((status, index) => {
            const Icon = lensIcons[status.label];

            return (
              <div key={status.label} className={`dora-system-lens-node dora-system-lens-node-${index + 1}`}>
                <span className={systemToneClass(status)}>
                  <Icon size={15} aria-hidden />
                </span>
                <strong>{status.label}</strong>
                <small>{status.value}</small>
              </div>
            );
          })}
        </div>

        <DoraOfficeHeroBoundaryStrip
          className="dora-system-hero-boundary"
          items={[
            { icon: Eye, label: "Public posture" },
            { icon: LockKeyhole, label: "Internals private" },
            { icon: ShieldCheck, label: "Read-only" }
          ]}
        />

        <DoraOfficeHeroSignalRail
          className="dora-system-hero-signal-strip"
          ariaLabel="Public system health preview"
          label="Health rail"
          items={previewStatuses.map((status) => ({
            key: status.label,
            ariaLabel: `${status.label}: ${status.value}`,
            meta: status.label,
            title: status.value,
            detail: "public-safe"
          }))}
        />
      </section>

      <section className="dora-system-status-grid" aria-label="Public system status">
        {displayStatuses.map((item) => {
          const Icon = statusIcons[item.label];

          return (
            <article key={item.label} className={`dora-system-status-card ${systemToneClass(item)}`}>
              <div>
                <span className="dora-system-status-icon">
                  <Icon size={20} aria-hidden />
                </span>
                <StatusBadge tone={item.tone}>public-safe</StatusBadge>
              </div>
              <p>{item.label}</p>
              <h2>{item.value}</h2>
              <small>{item.detail}</small>
            </article>
          );
        })}
      </section>

      <div className="dora-system-layout">
        <section className="dora-system-events" aria-labelledby="dora-system-events-title">
          <div className="dora-system-section-heading">
            <div>
              <h2 id="dora-system-events-title">Public health stream</h2>
              <p>Fixed labels for the latest safe system posture, not operational detail.</p>
            </div>
            <Signal size={22} aria-hidden />
          </div>

          <div className="dora-system-event-list">
            {displayEvents.map((event) => (
              <article key={`${event.time}-${event.label}`} className={`dora-system-event ${systemToneClass(event)}`}>
                <span className="dora-system-event-window">{event.time}</span>
                <span className="dora-system-event-dot" aria-hidden="true" />
                <div>
                  <h3>{event.label}</h3>
                  <p>{event.detail}</p>
                </div>
                <StatusBadge tone={event.tone}>{event.state}</StatusBadge>
              </article>
            ))}
          </div>
        </section>

        <aside className="dora-system-side" aria-label="System boundary and bridges">
          <section className="dora-system-boundary-card">
            <div className="dora-system-section-heading">
              <div>
                <h2>System boundary</h2>
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

          <section className="dora-system-owner-card">
            <Sparkles size={20} aria-hidden />
            <strong>Owner cockpit</strong>
            <p>Repair and diagnostic actions stay behind authenticated owner access.</p>
          </section>

          <section className={`dora-system-probe-card ${relayProbe.state === "live" ? "is-normal" : "is-info"}`}>
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
              Reads only the public health summary from the relay. Server names, raw events, task titles, paths, ports,
              and diagnostics are not rendered.
            </p>
            <dl>
              <div>
                <dt>Buffered</dt>
                <dd>{relayProbe.health ? relayProbe.health.buffered : "safe snapshot"}</dd>
              </div>
              <div>
                <dt>Dedupe</dt>
                <dd>{relayProbe.health ? relayProbe.health.seen : "hidden"}</dd>
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

          <section className="dora-system-link-card">
            <Radio size={20} aria-hidden />
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
