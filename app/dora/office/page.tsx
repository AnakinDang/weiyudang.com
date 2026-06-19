import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  CalendarClock,
  CheckCircle2,
  Eye,
  Globe2,
  GraduationCap,
  Info,
  LockKeyhole,
  Radio,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react";
import { DoraemonMark } from "@/components/DoraemonMark";
import { SiteChrome } from "@/components/SiteChrome";
import { StatusBadge } from "@/components/StatusBadge";
import {
  DORA_LIVE_BRIDGE_URL,
  formatPublicEventDateTime,
  getRecentPublicDoraEvents,
  publicDoraTaskStats,
  publicSchedules
} from "@/lib/dora-office";
import { getPublicAgents } from "@/lib/public-agents";

const MAX_STAGE_AGENTS = 7;

export const metadata: Metadata = {
  title: "Doraemon Office",
  description: "The public live/demo Doraemon Office view without private task names, prompts, accounts, or controls."
};

const officePrinciples = [
  {
    title: "Multi-Agent Team",
    summary: "Specialized MiniDoras coordinate in real time.",
    icon: Users
  },
  {
    title: "Always On, Always Learning",
    summary: "Continuous monitor, analyze, and improve loops.",
    icon: Brain
  },
  {
    title: "Owner in the Loop",
    summary: "Weiyu sets direction. Doraemon executes.",
    icon: ShieldCheck
  },
  {
    title: "Public Window",
    summary: "Selected visibility. Privacy by design.",
    icon: Globe2
  }
] as const;

const publicBoundaryItems = [
  "No private tasks or notes",
  "No prompts or workflows",
  "No accounts or credentials",
  "No trading or execution",
  "Research-only. Not an order, recommendation, or execution system."
] as const;

const publicWindowItems = ["Sanitized activity", "High-level statuses", "Agent presence", "System health"] as const;
const privateAreaItems = ["Owner tasks and notes", "Strategies and playbooks", "Knowledge and data", "Accounts and integrations"] as const;

const projectContext = [
  {
    title: "Personal OS",
    summary: "Doraemon Office is the operating layer of Weiyu's work and thinking.",
    icon: Users
  },
  {
    title: "Built with Discipline",
    summary: "Strong privacy boundary, clean architecture, and clear principles.",
    icon: ShieldCheck
  },
  {
    title: "Open in the Right Way",
    summary: "Share the public window to inspire and build trust, not for attention.",
    icon: GraduationCap
  },
  {
    title: "Long-Term Vision",
    summary: "Better thinking. Better work. More impact over time.",
    icon: Sparkles
  }
] as const;

function officeAgentClass(index: number) {
  return `dora-office-stage-agent dora-office-stage-agent-${index + 1}`;
}

export default function DoraOfficePage() {
  const agents = getPublicAgents();
  const stageAgents = agents.filter((agent) => agent.publicId !== "agent_dora").slice(0, MAX_STAGE_AGENTS);
  const recentEvents = getRecentPublicDoraEvents(5);
  const stripEvents = recentEvents.slice(0, 5);
  const nextSchedule = publicSchedules[0];
  const liveBridgeHost = DORA_LIVE_BRIDGE_URL.replace(/^https?:\/\//, "");

  return (
    <SiteChrome headerVariant="doraemon" headerActiveHref="/dora">
      <div className="dora-office-landing">
        <section className="dora-office-landing-hero" aria-labelledby="dora-office-title">
          <div className="container dora-office-landing-hero-grid">
            <div className="dora-office-landing-copy">
              <h1 id="dora-office-title">
                <span>Doraemon</span>
                {" "}
                Office
              </h1>
              <p>The public window into Weiyu&apos;s personal AI command room.</p>
              <div className="dora-office-landing-rule" aria-hidden />
              <div className="dora-office-landing-actions">
                <a href="#office-command-surface" className="link-focus dora-office-primary-cta">
                  Enter Doraemon Office
                  <ArrowRight size={19} aria-hidden />
                </a>
                <div className="dora-office-secondary-actions">
                  <Link href="/dora/team" className="link-focus dora-office-text-link">
                    Meet the MiniDoras
                    <ArrowRight size={15} aria-hidden />
                  </Link>
                  <Link href="/projects/doraemon-agent-system" className="link-focus dora-office-text-link">
                    Read the project
                    <ArrowRight size={15} aria-hidden />
                  </Link>
                </div>
              </div>
            </div>

            <div className="dora-office-landing-visual" id="live-dashboard">
              <section
                className="dora-office-stage-panel dora-office-landing-stage-panel"
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
                    sizes="(max-width: 900px) 100vw, 58vw"
                  />
                </div>

                <div className="dora-office-landing-stage-note">
                  <strong>Doraemon Office</strong>
                  <p>A personal AI command room built for thinking, creating, and long-term impact.</p>
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

              <section className="dora-office-live-strip dora-office-landing-live-strip" aria-label="Recent public-safe Doraemon Office activity">
                <div>
                  <span aria-hidden />
                  <strong>Live activity (public-safe)</strong>
                  <small>Updated just now</small>
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
              </section>
            </div>
          </div>
        </section>

        <section className="dora-office-landing-section dora-office-does-section" aria-labelledby="dora-office-does-title">
          <div className="container dora-office-does-grid">
            <div className="dora-office-orbit-card" aria-hidden="true">
              <div className="dora-office-orbit-radar">
                <span />
              </div>
            </div>
            <div>
              <h2 id="dora-office-does-title">What Doraemon Office Does</h2>
              <p>
                Doraemon Office is Weiyu&apos;s personal AI command room. A team of MiniDoras work across research,
                writing, data, strategy, and operations, coordinated to turn ideas into impact.
              </p>
              <div className="dora-office-principle-grid">
                {officePrinciples.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article key={item.title}>
                      <span>
                        <Icon size={20} aria-hidden />
                      </span>
                      <h3>{item.title}</h3>
                      <p>{item.summary}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="dora-office-landing-section dora-office-minidoras-section" aria-labelledby="dora-office-minidoras-title">
          <div className="container dora-office-minidoras-grid">
            <div className="dora-office-section-copy">
              <h2 id="dora-office-minidoras-title">Meet the MiniDoras</h2>
              <p>From research to writing, from data to operations, each MiniDora has a clear role.</p>
              <Link href="/dora/team" className="link-focus dora-office-text-link">
                Explore the team
                <ArrowRight size={15} aria-hidden />
              </Link>
            </div>
            <div className="dora-office-agent-card-row">
              {agents.slice(1).map((agent) => (
                <article key={agent.publicId}>
                  <DoraemonMark />
                  <h3>{agent.displayName}</h3>
                  <p>{agent.summary}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="dora-office-landing-section dora-office-safety-section" aria-labelledby="dora-office-safety-title">
          <div className="container dora-office-safety-grid">
            <div className="dora-office-section-copy">
              <h2 id="dora-office-safety-title">Public Safety Boundary</h2>
              <p>Your trust matters. The public window is designed with a strict boundary.</p>
              <ul className="dora-office-boundary-list">
                {publicBoundaryItems.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={15} aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="dora-office-boundary-diagram">
              <div>
                <Eye size={22} aria-hidden />
                <strong>Public window</strong>
                <ul>
                  {publicWindowItems.map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={14} aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <span className="dora-office-boundary-bell" aria-hidden>
                <DoraemonMark />
              </span>
              <div>
                <LockKeyhole size={22} aria-hidden />
                <strong>Private area</strong>
                <ul>
                  {privateAreaItems.map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={14} aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section
          className="dora-office-landing-section dora-office-command-section"
          id="office-command-surface"
          aria-labelledby="dora-office-command-title"
        >
          <div className="container dora-office-command-shell">
            <div className="dora-office-command-heading">
              <h2 id="dora-office-command-title">Office command surface</h2>
              <p>Jump into the public-safe dashboard views without exposing private systems.</p>
            </div>
            <div className="dora-office-command-grid">
              <Link href="/dora/activity" className="link-focus dora-office-command-card">
                <Radio size={24} aria-hidden />
                <h3>Public relay</h3>
                <p>A read-only broadcast of sanitized Doraemon Office activity.</p>
                <StatusBadge tone="info">display-only</StatusBadge>
              </Link>
              <Link href="/dora/schedules" className="link-focus dora-office-command-card">
                <CalendarClock size={24} aria-hidden />
                <h3>{nextSchedule.name}</h3>
                <p>Next rhythm: {nextSchedule.next}. Public cadence only, never cron strings or private prompts.</p>
                <StatusBadge tone="info">safe cadence</StatusBadge>
              </Link>
              <Link href="/dora/tasks" className="link-focus dora-office-command-card">
                <ShieldCheck size={24} aria-hidden />
                <h3>Task posture</h3>
                <div className="dora-office-task-posture">
                  {publicDoraTaskStats.map((stat) => (
                    <div key={stat.label}>
                      <strong>{stat.value}</strong>
                      <span>{stat.label}</span>
                    </div>
                  ))}
                </div>
              </Link>
              <a href={DORA_LIVE_BRIDGE_URL} target="_blank" rel="noopener noreferrer" className="link-focus dora-office-command-card">
                <Info size={24} aria-hidden />
                <h3>Live bridge</h3>
                <p>Open the larger visualizer when the office stage needs more room.</p>
                <span className="dora-office-text-link">
                  {liveBridgeHost}
                  <ArrowRight size={15} aria-hidden />
                </span>
              </a>
            </div>
          </div>
        </section>

        <section className="dora-office-landing-section dora-office-project-section" aria-label="Doraemon Office project context">
          <div className="container dora-office-project-grid">
            <div className="dora-office-section-copy">
              <h2>Project Context</h2>
              <p>This is a long-term personal OS experiment. Built in public. Designed to compound.</p>
              <Link href="/projects/doraemon-agent-system" className="link-focus dora-office-text-link">
                Read the full project
                <ArrowRight size={15} aria-hidden />
              </Link>
            </div>
            <div className="dora-office-project-context-row">
              {projectContext.map((item) => {
                const Icon = item.icon;

                return (
                  <article key={item.title}>
                    <Icon size={22} aria-hidden />
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </SiteChrome>
  );
}
