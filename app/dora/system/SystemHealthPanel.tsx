import Link from "next/link";
import Image from "next/image";
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

function DoraemonMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 72 72" aria-hidden="true" focusable="false">
      <circle cx="36" cy="34" r="25" fill="currentColor" opacity="0.12" />
      <circle cx="36" cy="32" r="20" fill="#ffffff" stroke="currentColor" strokeWidth="2.2" />
      <ellipse cx="30" cy="24" rx="4.2" ry="6.8" fill="#ffffff" stroke="currentColor" strokeWidth="1.8" />
      <ellipse cx="42" cy="24" rx="4.2" ry="6.8" fill="#ffffff" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="31.4" cy="25.5" r="1.45" fill="currentColor" />
      <circle cx="40.6" cy="25.5" r="1.45" fill="currentColor" />
      <circle cx="36" cy="32" r="3.4" fill="currentColor" />
      <path d="M36 35.6v14.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M25.5 41.2c5.4 6.2 15.6 6.2 21 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M21 32.8h10M21.4 38.2l9.2-2.1M51 32.8H41M50.6 38.2l-9.2-2.1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path d="M25.5 53h21" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="36" cy="56" r="5.2" fill="#f4b740" stroke="#ffffff" strokeWidth="2" />
    </svg>
  );
}

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
        <Image
          className="dora-system-hero-art"
          src="/visuals/doraemon-office-command-room-v2.png"
          alt=""
          width={1536}
          height={1024}
          sizes="72vw"
        />
        <div className="dora-system-hero-copy">
          <p>
            <span>System health.</span>
            <span>Safe signal only.</span>
          </p>
          <small>Mode, schema posture, freshness, and replay health without private infrastructure detail.</small>
        </div>

        <div className="dora-system-hero-boundary-card">
          <div>
            <Eye size={17} aria-hidden />
            <strong>Public posture</strong>
            <span>Safe health labels</span>
          </div>
          <div>
            <LockKeyhole size={17} aria-hidden />
            <strong>Private internals</strong>
            <span>Diagnostics hidden</span>
          </div>
        </div>

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

        <div className="dora-system-hero-boundary">
          <span>
            <Eye size={15} aria-hidden />
            Public posture
          </span>
          <span>
            <LockKeyhole size={15} aria-hidden />
            Internals private
          </span>
          <span>
            <ShieldCheck size={15} aria-hidden />
            Read-only
          </span>
        </div>

        <div className="dora-system-hero-signal-strip" aria-label="Public system health preview">
          <div>
            <span aria-hidden />
            <strong>Health rail</strong>
          </div>
          <ol role="list">
            {previewStatuses.map((status) => (
              <li key={status.label} aria-label={`${status.label}: ${status.value}`}>
                <span>{status.label}</span>
                <strong>{status.value}</strong>
                <small>public-safe</small>
              </li>
            ))}
          </ol>
        </div>
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
