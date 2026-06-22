import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  CheckSquare,
  Eye,
  Globe2,
  LockKeyhole,
  Radio,
  ShieldCheck,
  Sparkles,
  Target,
  Users
} from "lucide-react";
import { DoraemonMark } from "@/components/DoraemonMark";
import { DoraOfficeRouteDock } from "@/components/DoraOfficeRouteDock";
import { SiteChrome } from "@/components/SiteChrome";
import { StatusBadge } from "@/components/StatusBadge";
import {
  DORA_LIVE_BRIDGE_URL,
  formatPublicEventDateTime,
  getRecentPublicDoraEvents,
  publicDoraTaskStats,
  publicSchedules,
  publicSystemStatus
} from "@/lib/dora-office";
import { getPublicAgents } from "@/lib/public-agents";

const MAX_STAGE_AGENTS = 7;

export const metadata: Metadata = {
  title: "Doraemon Office",
  description: "The public live/demo Doraemon Office view without private task names, prompts, accounts, or controls."
};

const publicBoundaryItems = [
  "No private tasks or notes",
  "No prompts or workflows",
  "No accounts or credentials",
  "No trading or execution",
  "Research-only. Not an order, recommendation, or execution system."
] as const;

export default function DoraOfficePage() {
  const agents = getPublicAgents();
  const stageAgents = agents.filter((agent) => agent.publicId !== "agent_dora").slice(0, MAX_STAGE_AGENTS);
  const recentEvents = getRecentPublicDoraEvents(5);
  const stripEvents = recentEvents.slice(0, 5);
  const nextSchedule = publicSchedules[0];
  const currentFocusEvent = recentEvents[0];
  const heartbeatItems = publicSystemStatus.slice(0, 3);
  const liveBridgeHost = DORA_LIVE_BRIDGE_URL.replace(/^https?:\/\//, "");

  return (
    <SiteChrome headerVariant="doraemon" headerActiveHref="/dora">
      <div className="dora-office-landing dora-office-product-landing">
        <div className="dora-office-route-dock-wrap">
          <DoraOfficeRouteDock active="/dora/office" />
        </div>
        <section className="dora-office-product-hero" aria-labelledby="dora-office-title">
          <div className="container dora-office-product-shell" id="live-dashboard">
            <div className="dora-office-product-copy">
              <h1 id="dora-office-title">
                <span>Doraemon</span>
                <span>Office</span>
              </h1>
              <p>
                A public-safe command room where Doraemon coordinates, MiniDoras work, and Weiyu keeps the final
                authority.
              </p>
              <div className="dora-office-product-actions">
                <a
                  href={DORA_LIVE_BRIDGE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open larger visualizer ${liveBridgeHost} in a new tab`}
                  className="link-focus dora-office-product-primary"
                >
                  Open visualizer
                  <ArrowUpRight size={16} aria-hidden />
                </a>
                <Link href="/dora/activity" className="link-focus dora-office-product-secondary">
                  View Activity
                  <ArrowRight size={16} aria-hidden />
                </Link>
              </div>
              <div className="dora-office-product-posture" aria-label="Doraemon Office public posture">
                <StatusBadge tone="info">Demo replay</StatusBadge>
                <StatusBadge tone="private">Read-only</StatusBadge>
                <StatusBadge tone="normal">Public schema</StatusBadge>
              </div>
            </div>

            <div
              className="dora-office-product-stage"
              aria-label="Public Doraemon Office stage with sanitized MiniDora state"
            >
              <Image
                src="/visuals/doraemon-office-doorway-v3.png"
                alt=""
                width={1586}
                height={992}
                priority
                quality={95}
                sizes="(max-width: 1180px) 100vw, 62vw"
              />

              <div className="dora-office-product-panel">
                <strong>Doraemon Office</strong>
                <p>A personal AI command room built for thinking, creating, and long-term impact.</p>
                <div>
                  <LockKeyhole size={16} aria-hidden />
                  <span>Private Area</span>
                  <small>Owner-only</small>
                </div>
                <div>
                  <Eye size={16} aria-hidden />
                  <span>Public Window</span>
                  <small>Sanitized. Demo-safe. Read-only.</small>
                </div>
              </div>

              <div className="dora-office-product-focus">
                <Target size={18} aria-hidden />
                <span>Current focus</span>
                <strong>{currentFocusEvent?.title ?? "Demo snapshot"}</strong>
              </div>

              <div className="dora-office-product-agent-ring" aria-hidden="true">
                {stageAgents.slice(0, 5).map((agent) => (
                  <span key={agent.publicId}>
                    <DoraemonMark />
                    <small>{agent.stageName}</small>
                  </span>
                ))}
              </div>
              <ul className="sr-only">
                {stageAgents.slice(0, 5).map((agent) => (
                  <li key={agent.publicId}>
                    {agent.displayName}: {agent.stateLabel}
                  </li>
                ))}
              </ul>
            </div>

            <section className="dora-office-product-livebar" aria-label="Recent public-safe Doraemon Office activity">
              <div className="dora-office-product-livebar-head">
                <span aria-hidden />
                <strong>Recent public activity</strong>
                <small>Demo replay · Newest first</small>
              </div>
              <ol>
                {stripEvents.map((event) => (
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
          </div>
        </section>

        <section className="dora-office-product-details" aria-label="Doraemon Office public dashboard details">
          <div className="container dora-office-product-detail-head">
            <h2>Public operating view</h2>
            <p>
              The stage stays readable first. The dashboard below keeps activity, posture, rhythm, and boundary state
              public-safe.
            </p>
          </div>
          <div className="container dora-office-product-detail-grid">
            <div className="dora-office-product-maincards">
              <div className="dora-office-dashboard-safety-row" aria-label="Public Office safety posture">
                <div>
                  <ShieldCheck size={18} aria-hidden />
                  <strong>Public-safe</strong>
                  <span>Sanitized view</span>
                </div>
                <div>
                  <Eye size={18} aria-hidden />
                  <strong>Demo replay</strong>
                  <span>Fixed snapshot</span>
                </div>
                <div>
                  <LockKeyhole size={18} aria-hidden />
                  <strong>Read-only</strong>
                  <span>No execution</span>
                </div>
                <div>
                  <Globe2 size={18} aria-hidden />
                  <strong>Safe by design</strong>
                  <span>Privacy first</span>
                </div>
              </div>

              <div className="dora-office-dashboard-operations">
                <section
                  className="dora-office-live-strip dora-office-dashboard-live-strip"
                  aria-label="Recent public-safe Doraemon Office activity"
                >
                  <div>
                    <span aria-hidden />
                    <strong>Recent public activity</strong>
                    <small>Demo fallback · Newest first</small>
                  </div>
                  <ol>
                    {stripEvents.map((event) => (
                      <li key={event.event_id}>
                        <time dateTime={event.created_at}>{formatPublicEventDateTime(event.created_at)}</time>
                        <strong>{event.agent}</strong>
                        <span>{event.title}</span>
                      </li>
                    ))}
                  </ol>
                  <Link href="/dora/activity" className="link-focus dora-office-dashboard-card-link">
                    View all activity
                    <ArrowRight size={14} aria-hidden />
                  </Link>
                </section>

                <section className="dora-office-dashboard-task-card" aria-label="Public task posture">
                  <CheckSquare size={20} aria-hidden />
                  <h2>Task posture</h2>
                  <div className="dora-office-dashboard-stat-row">
                    {publicDoraTaskStats.map((stat) => (
                      <div key={stat.label}>
                        <strong>{stat.value}</strong>
                        <span>{stat.label}</span>
                      </div>
                  ))}
                  </div>
                  <p>All tasks are read-only in the public window.</p>
                </section>

                <section className="dora-office-dashboard-rhythm-card" aria-label="Next public operating rhythm">
                  <CalendarClock size={20} aria-hidden />
                  <h2>Next rhythm</h2>
                  <div className="dora-office-dashboard-rhythm">
                    <span>{nextSchedule.name}</span>
                    <strong>{nextSchedule.next}</strong>
                  </div>
                  <p>Public cadence only. No cron strings or private prompts.</p>
                </section>
              </div>
            </div>

            <aside className="dora-office-dashboard-rail" aria-label="Office Live public context">
              <section>
                <Target size={22} aria-hidden />
                <h2>Current Focus</h2>
                <strong>{currentFocusEvent?.title ?? "Demo snapshot"}</strong>
                <p>Public-safe attention state from the demo replay buffer.</p>
                <dl>
                  <div>
                    <dt>Led by</dt>
                    <dd>{currentFocusEvent?.agent ?? "Doraemon"}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>{currentFocusEvent?.state ?? "Demo"}</dd>
                  </div>
                  <div>
                    <dt>Freshness</dt>
                    <dd>Demo snapshot</dd>
                  </div>
                </dl>
                <Link href="/dora/activity" className="link-focus dora-office-text-link">
                  View in Activity
                  <ArrowRight size={15} aria-hidden />
                </Link>
              </section>

              <section>
                <ShieldCheck size={22} aria-hidden />
                <h2>Public Boundary</h2>
                <ul>
                  {publicBoundaryItems.slice(0, 4).map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={14} aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/dora/system" className="link-focus dora-office-text-link">
                  Learn more
                  <ArrowRight size={15} aria-hidden />
                </Link>
              </section>

              <section>
                <Radio size={22} aria-hidden />
                <h2>System Heartbeat</h2>
                <dl>
                  {heartbeatItems.map((item) => (
                    <div key={item.label}>
                      <dt>{item.label}</dt>
                      <dd>{item.value}</dd>
                    </div>
                  ))}
                </dl>
                <Link href="/dora/system" className="link-focus dora-office-text-link">
                  System status
                  <ArrowRight size={15} aria-hidden />
                </Link>
              </section>
            </aside>
          </div>
        </section>
      </div>
    </SiteChrome>
  );
}
