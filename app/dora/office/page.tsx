import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  ClipboardList,
  Eye,
  Info,
  LockKeyhole,
  MonitorPlay,
  Radio,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { DoraemonMark } from "@/components/DoraemonMark";
import { DoraOfficeShell } from "@/components/DoraOfficeShell";
import { StatusBadge } from "@/components/StatusBadge";
import {
  DORA_LIVE_BRIDGE_URL,
  formatPublicEventTime,
  getRecentPublicDoraEvents,
  publicSchedules
} from "@/lib/dora-office";
import { getPublicAgents } from "@/lib/public-agents";

// Keep this in sync with the seven .dora-office-stage-agent-N visual slots.
const MAX_STAGE_AGENTS = 7;

export const metadata: Metadata = {
  title: "Doraemon Office",
  description: "The public live/demo Doraemon Office view without private task names, prompts, accounts, or controls."
};

const focusItems = [
  {
    title: "Research sprint",
    summary: "Exploring long-term public problems.",
    icon: Sparkles
  },
  {
    title: "Knowledge build",
    summary: "Structuring public knowledge.",
    icon: ClipboardList
  },
  {
    title: "Public schema",
    summary: "Keeping visibility sanitized.",
    icon: ShieldCheck
  }
] as const;

const quickLinks = [
  {
    title: "Public relay",
    summary: "A read-only broadcast of sanitized Doraemon Office activity.",
    href: "/dora/activity",
    icon: Radio,
    external: false,
    tags: ["display-only", "public schema"]
  },
  {
    title: "Live bridge",
    summary: "Open the visualizer bridge when a larger stage is useful.",
    href: DORA_LIVE_BRIDGE_URL,
    icon: MonitorPlay,
    external: true,
    tags: ["linked", "read-only"]
  },
  {
    title: "Next rhythm",
    summary: "Coarse operating cadence, never cron strings or private prompts.",
    href: "/dora/schedules",
    icon: CalendarClock,
    external: false,
    tags: ["daily rhythm", "safe cadence"]
  },
  {
    title: "Boundary",
    summary: "Owner-only spaces, tasks, prompts, and accounts stay private.",
    href: "/dora/system",
    icon: ShieldCheck,
    external: false,
    tags: ["sanitized", "display-only"]
  }
] as const;

function officeAgentClass(index: number) {
  return `dora-office-stage-agent dora-office-stage-agent-${index + 1}`;
}

export default function DoraOfficePage() {
  const liveBridgeHost = DORA_LIVE_BRIDGE_URL.replace(/^https?:\/\//, "");
  const agents = getPublicAgents();
  const stageAgents = agents.filter((agent) => agent.publicId !== "agent_dora").slice(0, MAX_STAGE_AGENTS);
  const recentEvents = getRecentPublicDoraEvents(5);
  const nextSchedule = publicSchedules[0];

  return (
    <DoraOfficeShell
      active="/dora/office"
      title="Office Live"
      summary="A public-safe command room where Doraemon coordinates, MiniDoras work, and Weiyu stays owner-in-the-loop."
      showBoundaryStrip
    >
      <div className="dora-office-live-page">
        <div className="dora-office-live-dashboard">
          <div className="dora-office-live-main">
            <div className="dora-office-live-mode-row" aria-label="Office Live mode">
              <span className="dora-office-live-mode">
                <span aria-hidden />
                Live bridge linked
              </span>
              <span className="dora-office-live-mode dora-office-live-mode-secondary">
                <span aria-hidden />
                Demo fallback ready
              </span>
            </div>

            <section
              className="dora-office-stage-panel"
              aria-label="Public Doraemon Office stage with sanitized MiniDora state"
            >
              <div className="dora-office-portal-art" aria-hidden="true">
                <Image
                  src="/visuals/doraemon-office-command-room-v2.png"
                  alt=""
                  width={1536}
                  height={1024}
                  priority
                  quality={95}
                  sizes="(max-width: 900px) 100vw, 76vw"
                />
                <div className="dora-office-stage-boundary">
                  <div>
                    <LockKeyhole size={18} aria-hidden />
                    <strong>Private area</strong>
                    <span>Owner-only</span>
                  </div>
                  <div>
                    <Eye size={18} aria-hidden />
                    <strong>Public window</strong>
                    <span>Sanitized. Real-time. Safe.</span>
                  </div>
                  <small>display-only</small>
                </div>
              </div>

              <div className="dora-office-stage-agents">
                {stageAgents.map((agent, index) => (
                  <div key={agent.publicId} className={officeAgentClass(index)}>
                    <span>
                      <DoraemonMark />
                    </span>
                    <strong>{agent.stageName}</strong>
                    <small>{agent.role}</small>
                  </div>
                ))}
              </div>
            </section>

            <div className="dora-office-owner-note">
              <Info size={16} aria-hidden />
              <span>Weiyu stays owner-in-the-loop. Direction, reviews, and decisions remain human-bounded.</span>
            </div>
          </div>

          <div className="dora-office-live-side">
            <section className="dora-office-side-card">
              <div className="dora-office-card-title">
                <Sparkles size={21} aria-hidden />
                <h2>Current focus</h2>
              </div>
              <div className="dora-office-focus-list">
                {focusItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article key={item.title}>
                      <span>
                        <Icon size={17} aria-hidden />
                      </span>
                      <div>
                        <strong>{item.title}</strong>
                        <p>{item.summary}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
              <StatusBadge tone="warning">Research-only</StatusBadge>
            </section>

            <section className="dora-office-side-card">
              <div className="dora-office-card-title">
                <Radio size={21} aria-hidden />
                <h2>Recent activity</h2>
                <Link href="/dora/activity" className="link-focus">
                  View all
                </Link>
              </div>
              <div className="dora-office-activity-list">
                {recentEvents.map((event) => (
                  <article key={event.event_id}>
                    <time>{formatPublicEventTime(event.created_at)}</time>
                    <DoraemonMark />
                    <div>
                      <strong>{event.agent}</strong>
                      <p>{event.title}</p>
                    </div>
                    <span className={`dora-office-activity-dot dora-office-activity-dot-${event.severity}`} aria-hidden />
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="dora-office-metrics">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            const content = (
              <>
                <Icon size={28} aria-hidden />
                <h2>{item.title}</h2>
                <p>{item.title === "Next rhythm" ? `${nextSchedule.name}: ${item.summary}` : item.summary}</p>
                <div>
                  {item.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </>
            );

            return item.external ? (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${liveBridgeHost} in a new tab`}
                className="link-focus dora-office-metric-card"
              >
                {content}
              </a>
            ) : (
              <Link key={item.title} href={item.href} className="link-focus dora-office-metric-card">
                {content}
              </Link>
            );
          })}
        </div>

        <div className="dora-office-more">
          <Link href="/dora/tasks" className="link-focus">
            Open sanitized tasks
            <ArrowRight size={15} aria-hidden />
          </Link>
          <Link href="/dora/team" className="link-focus">
            Explore Team Agents
            <ArrowRight size={15} aria-hidden />
          </Link>
        </div>
      </div>
    </DoraOfficeShell>
  );
}
