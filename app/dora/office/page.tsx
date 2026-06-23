import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CheckSquare,
  Eye,
  Globe2,
  LockKeyhole,
  ShieldCheck,
  Target
} from "lucide-react";
import { DoraemonMark } from "@/components/DoraemonMark";
import { DoraOfficeLiveBridge, type DoraOfficeBridgeEvent } from "@/components/DoraOfficeLiveBridge";
import { DoraOfficeRouteDock } from "@/components/DoraOfficeRouteDock";
import { SiteChrome } from "@/components/SiteChrome";
import { StatusBadge } from "@/components/StatusBadge";
import {
  getRecentPublicDoraEvents,
  publicDoraTaskStats,
  publicSchedules,
  type PublicDoraEvent
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

function clientSafeEvent(event: PublicDoraEvent): DoraOfficeBridgeEvent {
  return {
    event_id: event.event_id,
    created_at: event.created_at,
    event_type: event.event_type,
    agent: event.agent,
    state: event.state,
    severity: event.severity,
    title: event.title
  };
}

export default function DoraOfficePage() {
  const agents = getPublicAgents();
  const stageAgents = agents.filter((agent) => agent.publicId !== "agent_dora").slice(0, MAX_STAGE_AGENTS);
  const recentEvents = getRecentPublicDoraEvents(5);
  const stripEvents = recentEvents.slice(0, 5).map(clientSafeEvent);
  const nextSchedule = publicSchedules[0];
  const currentFocusEvent = recentEvents[0];

  return (
    <SiteChrome headerVariant="doraemon" headerActiveHref="/dora">
      <div className="dora-office-landing dora-office-product-landing">
        <div className="dora-office-route-dock-wrap">
          <DoraOfficeRouteDock active="/dora/office" />
        </div>
        <section className="dora-office-product-hero" aria-labelledby="dora-office-title">
          <div className="container dora-office-product-shell" id="live-dashboard">
            <div className="dora-office-product-copy">
              <h1 id="dora-office-title" aria-label="Doraemon Office">
                <span>Doraemon</span>
                <span>Office</span>
              </h1>
              <p>
                The native public office overview: sanitized activity, MiniDora presence, operating rhythm, and system
                posture inside weiyudang.com.
              </p>
              <div className="dora-office-product-actions">
                <Link href="/dora/activity" className="link-focus dora-office-product-primary">
                  View Activity
                  <ArrowRight size={16} aria-hidden />
                </Link>
                <Link href="/dora/team" className="link-focus dora-office-product-secondary">
                  Meet the Team
                  <ArrowRight size={16} aria-hidden />
                </Link>
              </div>
              <div className="dora-office-product-posture" aria-label="Doraemon Office public posture">
                <StatusBadge tone="normal">Native route</StatusBadge>
                <StatusBadge tone="info">Live/demo relay</StatusBadge>
                <StatusBadge tone="private">Read-only</StatusBadge>
              </div>
            </div>

            <div
              className="dora-office-product-stage"
              aria-label="Public Doraemon Office stage with sanitized MiniDora state"
            >
              <Image
                src="/visuals/doraemon-office-command-room-v2.png"
                alt=""
                width={1536}
                height={1024}
                priority
                quality={85}
                sizes="(max-width: 720px) 200vw, (max-width: 1180px) 100vw, 62vw"
              />

              <div className="dora-office-product-panel">
                <strong>Public Office</strong>
                <p>Doraemon coordinates visible state while task names, prompt bodies, memory records, and controls stay out.</p>
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

            <DoraOfficeLiveBridge fallbackEvents={stripEvents} boundaryItems={publicBoundaryItems} />
          </div>
        </section>

        <section className="dora-office-product-details" aria-label="Doraemon Office public dashboard details">
          <div className="container dora-office-product-detail-head">
            <h2>Public operating view</h2>
            <p>
              The office now starts inside the site. Activity feed, team presence, cadence summary, schedules, and
              system posture stay public-safe and read-only.
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
                  <p>Public cadence only. No cron strings or prompt bodies.</p>
                </section>
              </div>
            </div>
          </div>
        </section>
      </div>
    </SiteChrome>
  );
}
