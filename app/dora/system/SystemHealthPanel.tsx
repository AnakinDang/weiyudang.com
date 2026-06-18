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
import type { publicSystemBoundaries, publicSystemEvents, publicSystemStatus } from "@/lib/dora-office";

type PublicSystemStatus = (typeof publicSystemStatus)[number];
type PublicSystemEvent = (typeof publicSystemEvents)[number];
type PublicSystemBoundary = (typeof publicSystemBoundaries)[number];

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

function systemToneClass(item: Pick<PublicSystemStatus | PublicSystemEvent, "tone">) {
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

export function SystemHealthPanel({
  statuses,
  events,
  boundaries
}: {
  statuses: readonly PublicSystemStatus[];
  events: readonly PublicSystemEvent[];
  boundaries: readonly PublicSystemBoundary[];
}) {
  const primaryStatus = statuses[0];
  const previewStatuses = statuses.slice(0, 6);

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
          {statuses.map((status, index) => {
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
        {statuses.map((item) => {
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
            {events.map((event) => (
              <article key={`${event.time}-${event.label}`} className={`dora-system-event ${systemToneClass(event)}`}>
                <span className="dora-system-event-window">{event.time}</span>
                <span aria-hidden="true" />
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
