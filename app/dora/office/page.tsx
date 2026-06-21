import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  CheckSquare,
  Eye,
  Globe2,
  Home,
  LockKeyhole,
  Radio,
  Server,
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
  doraOfficeRoutes,
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

function officeAgentClass(index: number) {
  return `dora-office-stage-agent dora-office-stage-agent-${index + 1}`;
}

function officeRouteIcon(href: string) {
  switch (href) {
    case "/dora":
      return Home;
    case "/dora/office":
      return Radio;
    case "/dora/activity":
      return Activity;
    case "/dora/team":
      return Users;
    case "/dora/tasks":
      return CheckSquare;
    case "/dora/schedules":
      return CalendarClock;
    case "/dora/knowledge":
      return BookOpen;
    case "/dora/system":
      return Server;
    default:
      return Sparkles;
  }
}

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
      <div className="dora-office-landing">
        <div className="dora-office-route-dock-wrap">
          <DoraOfficeRouteDock active="/dora/office" />
        </div>
        <section className="dora-office-dashboard-hero" aria-labelledby="dora-office-title">
          <div className="container dora-office-dashboard-shell">
            <aside className="dora-office-dashboard-nav" aria-label="Doraemon Office navigation">
              <div className="dora-office-dashboard-brand">
                <DoraemonMark />
                <div>
                  <strong>Doraemon Office</strong>
                  <StatusBadge tone="info">Public window</StatusBadge>
                </div>
              </div>

              <nav>
                {doraOfficeRoutes.map((route) => {
                  const Icon = officeRouteIcon(route.href);
                  const isActive = route.href === "/dora/office";

                  return (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={`link-focus dora-office-dashboard-nav-link${isActive ? " is-active" : ""}`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Icon size={18} aria-hidden />
                      {route.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="dora-office-dashboard-nav-note">
                <Eye size={18} aria-hidden />
                <strong>Public Window</strong>
                <span>Sanitized. Demo-safe. Read-only.</span>
                <Link href="/dora/system" className="link-focus">
                  Boundary details
                  <ArrowRight size={14} aria-hidden />
                </Link>
              </div>
            </aside>

            <div className="dora-office-dashboard-main" id="live-dashboard">
              <header className="dora-office-dashboard-head">
                <div>
                  <p className="dora-office-dashboard-pretitle">Doraemon Office · Public Command Room</p>
                  <h1 id="dora-office-title">Office Live</h1>
                  <p>A public-safe command room for Doraemon and the MiniDoras.</p>
                </div>
                <div className="dora-office-dashboard-actions">
                  <div className="dora-office-dashboard-badges">
                    <StatusBadge tone="info">Demo fallback</StatusBadge>
                    <StatusBadge tone="private">Read-only</StatusBadge>
                  </div>
                  <a
                    href={DORA_LIVE_BRIDGE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open larger visualizer ${liveBridgeHost} in a new tab`}
                    className="link-focus dora-office-dashboard-open-link"
                  >
                    Open visualizer
                    <ArrowUpRight size={14} aria-hidden />
                  </a>
                </div>
              </header>

              <section
                className="dora-office-stage-panel dora-office-dashboard-stage-panel"
                aria-label="Public Doraemon Office stage with sanitized MiniDora state"
              >
                <div className="dora-office-portal-art" aria-hidden="true">
                  <Image
                    src="/visuals/doraemon-office-command-room-v2.png"
                    alt=""
                    width={1536}
                    height={1024}
                    priority
                    quality={85}
                    sizes="(max-width: 900px) 100vw, 52vw"
                  />
                </div>

                <div className="dora-office-stage-core-card" aria-hidden="true">
                  <DoraemonMark />
                  <strong>Doraemon Office</strong>
                  <span>Public-safe · Read-only</span>
                  <i />
                </div>

                <div className="dora-office-stage-agents">
                  {stageAgents.map((agent, index) => (
                    <div key={agent.publicId} className={officeAgentClass(index)} title={agent.displayName}>
                      <span>
                        <DoraemonMark />
                      </span>
                      <strong>{agent.stageName}</strong>
                      <small>{agent.stateLabel}</small>
                    </div>
                  ))}
                </div>
              </section>

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
