import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Bot,
  CheckCircle2,
  Eye,
  Globe2,
  Layers3,
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
  formatPublicEventTime,
  getPublicAgentTone,
  getRecentPublicDoraEvents,
  latestAgentEvent
} from "@/lib/dora-office";
import { getPublicAgents, type PublicAgent } from "@/lib/public-agents";

export const metadata: Metadata = {
  title: "Doraemon Team Agents",
  description: "Public MiniDora roster for the Doraemon Office."
};

const teamPrinciples = [
  {
    title: "8 public profiles",
    summary: "Doraemon and seven MiniDoras, each with a clear public-safe role.",
    icon: Bot
  },
  {
    title: "Demo-safe posture",
    summary: "Stable labels such as planning, working, handoff, owner review, and attention.",
    icon: Activity
  },
  {
    title: "Owner boundary",
    summary: "No prompts, accounts, private task names, paths, or private controls.",
    icon: ShieldCheck
  },
  {
    title: "Research-only markets",
    summary: "Trading MiniDora organizes market research; it never executes orders.",
    icon: LockKeyhole
  }
] as const;

const teamLanes = [
  {
    title: "Coordinate",
    agents: "Doraemon",
    summary: "Turns intent into plans, handoffs, and review checkpoints."
  },
  {
    title: "Research",
    agents: "Research + Memory + Trading",
    summary: "Reads, compares, preserves context, and keeps market work research-only."
  },
  {
    title: "Build",
    agents: "Dev + Product",
    summary: "Moves product slices from scope into tested, reviewed software."
  },
  {
    title: "Operate",
    agents: "Ops + Media",
    summary: "Keeps routines, health, public visuals, and publishing rhythm clear."
  }
] as const;

const publicWindowItems = ["Public-safe profiles", "Sanitized states", "Fixed event labels", "Team presence"] as const;
const privateAreaItems = ["Owner tasks", "Prompts and workflows", "Accounts and credentials", "Private knowledge"] as const;
const heroSafetySignals = [
  {
    title: "Public-safe",
    summary: "Read-only profiles",
    icon: Users
  },
  {
    title: "Demo fallback",
    summary: "Sanitized view",
    icon: ShieldCheck
  },
  {
    title: "No execution",
    summary: "No private work",
    icon: LockKeyhole
  }
] as const;

const commandRoutes = [
  {
    title: "Doraemon Office",
    summary: "Return to the public command-room overview.",
    href: "/dora/office",
    icon: Users,
    badge: "public window"
  },
  {
    title: "Activity",
    summary: "Read the full sanitized public event timeline.",
    href: "/dora/activity",
    icon: Radio,
    badge: "fixed labels"
  },
  {
    title: "System boundary",
    summary: "Review what can and cannot cross into public surfaces.",
    href: "/dora/system",
    icon: ShieldCheck,
    badge: "privacy first"
  },
  {
    title: "Project context",
    summary: "See the long-term Personal OS project behind the team.",
    href: "/projects/doraemon-agent-system",
    icon: Sparkles,
    badge: "built in public"
  }
] as const;

const stateToneClass = {
  idle: "is-info",
  planning: "is-info",
  researching: "is-normal",
  coding: "is-normal",
  writing: "is-normal",
  tool_call: "is-info",
  handoff: "is-info",
  waiting_user: "is-warning",
  error: "is-danger",
  done: "is-normal",
  offline: "is-private",
  demo: "is-info"
} as const satisfies Record<PublicAgent["state"], string>;

function orbitClass(index: number) {
  return `dora-team-landing-orbit-agent dora-team-landing-orbit-agent-${index + 1}`;
}

export default function DoraTeamPage() {
  const agents = getPublicAgents();
  const doraemon = agents.find((agent) => agent.publicId === "agent_dora") ?? agents[0];
  const minidoras = agents.filter((agent) => agent.publicId !== doraemon.publicId);
  const recentSignals = getRecentPublicDoraEvents(5);

  return (
    <SiteChrome headerVariant="doraemon" headerActiveHref="/dora">
      <div className="dora-team-landing">
        <section className="dora-team-landing-hero" aria-labelledby="dora-team-title">
          <div className="container dora-team-landing-hero-grid">
            <div className="dora-team-landing-copy">
              <h1 id="dora-team-title">
                <span>MiniDora</span>
                {" "}
                Team Agents
              </h1>
              <p>Doraemon leads. MiniDoras specialize across research, product, engineering, memory, media, operations, and market research.</p>
              <div className="dora-team-landing-rule" aria-hidden />
              <div className="dora-team-landing-actions">
                <a href="#agent-roster" className="link-focus dora-office-primary-cta">
                  Meet the MiniDoras
                  <ArrowRight size={19} aria-hidden />
                </a>
                <div className="dora-office-secondary-actions">
                  <Link href="/dora/office" className="link-focus dora-office-text-link">
                    Enter Doraemon Office
                    <ArrowRight size={15} aria-hidden />
                  </Link>
                  <Link href="/dora/activity" className="link-focus dora-office-text-link">
                    View public activity
                    <ArrowRight size={15} aria-hidden />
                  </Link>
                </div>
              </div>
              <div className="dora-team-hero-signal-strip" aria-label="Public team safety posture">
                {heroSafetySignals.map((signal) => {
                  const Icon = signal.icon;

                  return (
                    <div key={signal.title}>
                      <Icon size={17} aria-hidden />
                      <strong>{signal.title}</strong>
                      <span>{signal.summary}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="dora-team-landing-visual">
              <section className="dora-team-command-stage" aria-label="Public MiniDora team constellation">
                <div className="dora-team-command-room" aria-hidden="true">
                  <Image
                    src="/visuals/doraemon-office-command-room-v2.png"
                    alt=""
                    width={1536}
                    height={1024}
                    priority
                    quality={94}
                    sizes="(max-width: 900px) 100vw, 58vw"
                  />
                </div>

                <div className="dora-team-stage-boundary">
                  <strong>Doraemon Team</strong>
                  <p>Public-safe profiles. Demo-safe posture. No private work exposed.</p>
                  <div>
                    <Eye size={17} aria-hidden />
                    <span>Public window</span>
                  </div>
                  <div>
                    <LockKeyhole size={17} aria-hidden />
                    <span>Private area</span>
                  </div>
                </div>

                <div className="dora-team-orbit-system">
                  <span className="dora-team-orbit-ring dora-team-orbit-ring-1" aria-hidden />
                  <span className="dora-team-orbit-ring dora-team-orbit-ring-2" aria-hidden />
                  <article className="dora-team-landing-core">
                    <DoraemonMark />
                    <strong>{doraemon.stageName}</strong>
                    <small>{doraemon.role}</small>
                  </article>
                  {minidoras.map((agent, index) => (
                    <article key={agent.publicId} className={orbitClass(index)}>
                      <span>
                        <DoraemonMark />
                      </span>
                      <strong>{agent.stageName}</strong>
                      <small>{agent.role}</small>
                    </article>
                  ))}
                </div>
              </section>

              <section className="dora-office-live-strip dora-team-landing-activity-strip" aria-label="Recent public-safe MiniDora team activity">
                <div>
                  <span aria-hidden />
                  <strong>Public team activity</strong>
                  <small>Demo fallback · Public-safe labels</small>
                </div>
                <ol>
                  {recentSignals.map((event) => (
                    <li key={event.event_id}>
                      <time dateTime={event.created_at}>{formatPublicEventTime(event.created_at)}</time>
                      <strong>{event.agent}</strong>
                      <span>{event.title}</span>
                    </li>
                  ))}
                </ol>
              </section>
            </div>

            <aside className="dora-team-hero-side" aria-label="MiniDora public team context">
              <section className="dora-team-hero-side-card">
                <div className="dora-team-hero-side-head">
                  <Layers3 size={20} aria-hidden />
                  <h2>Operating lanes</h2>
                </div>
                <ol className="dora-team-hero-lane-list">
                  {teamLanes.map((lane) => (
                    <li key={lane.title}>
                      <strong>{lane.title}</strong>
                      <span>{lane.summary}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="dora-team-hero-side-card">
                <div className="dora-team-hero-side-head">
                  <ShieldCheck size={20} aria-hidden />
                  <h2>Public boundary</h2>
                </div>
                <ul className="dora-team-hero-boundary-list">
                  {publicWindowItems.map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={14} aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/dora/system" className="link-focus dora-office-text-link">
                  Boundary details
                  <ArrowRight size={15} aria-hidden />
                </Link>
              </section>
            </aside>
          </div>
        </section>

        <section className="dora-team-landing-section dora-team-principles-section" aria-label="Public-safe MiniDora team principles">
          <div className="container dora-team-principle-strip">
            {teamPrinciples.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title}>
                  <span>
                    <Icon size={18} aria-hidden />
                  </span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.summary}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="dora-team-landing-section dora-team-lanes-section" aria-labelledby="dora-team-lanes-title">
          <div className="container dora-team-lanes-grid">
            <div className="dora-team-section-copy">
              <h2 id="dora-team-lanes-title">Team Operating Lanes</h2>
              <p>Doraemon stays central while MiniDoras specialize around the work that compounds: research, building, operations, memory, and public-safe output.</p>
              <Link href="/dora/office" className="link-focus dora-office-text-link">
                See the command room
                <ArrowRight size={15} aria-hidden />
              </Link>
            </div>
            <div className="dora-team-lane-grid">
              {teamLanes.map((lane) => (
                <article key={lane.title}>
                  <span>
                    <Layers3 size={18} aria-hidden />
                  </span>
                  <strong>{lane.title}</strong>
                  <small>{lane.agents}</small>
                  <p>{lane.summary}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="dora-team-landing-section dora-team-roster-section" id="agent-roster" aria-labelledby="dora-team-roster-title">
          <div className="container dora-team-roster-layout">
            <div className="dora-team-section-copy">
              <h2 id="dora-team-roster-title">Meet the MiniDoras</h2>
              <p>Each public profile shows role, state, and the latest fixed public event label. The private work stays behind the owner boundary.</p>
              <div className="dora-team-roster-stat">
                <strong>{agents.length}</strong>
                <span>public profiles</span>
              </div>
            </div>

            <div className="dora-team-roster">
              {agents.map((agent) => {
                const event = latestAgentEvent(agent);

                return (
                  <article key={agent.publicId} className={`dora-team-card dora-team-card-${agent.colorToken}`}>
                    <div className="dora-team-card-top">
                      <span className="dora-team-avatar">
                        <DoraemonMark />
                      </span>
                      <span className={`dora-team-state-dot ${stateToneClass[agent.state]}`} aria-hidden />
                    </div>
                    <div className="dora-team-card-title">
                      <h3>{agent.displayName}</h3>
                      <StatusBadge tone={getPublicAgentTone(agent)}>{agent.stateLabel}</StatusBadge>
                    </div>
                    <p className="dora-team-role">{agent.role}</p>
                    <p>{agent.summary}</p>
                    {agent.publicId === "agent_trading" ? (
                      <p className="dora-team-research-boundary">
                        Research-only. Not an order, recommendation, or execution system.
                      </p>
                    ) : null}
                    <div className="dora-team-event">
                      <Activity size={15} aria-hidden />
                      <span>Latest public label</span>
                      <strong>{event ? event.title : "No public event yet"}</strong>
                      {event ? (
                        <time dateTime={event.created_at}>{formatPublicEventTime(event.created_at)}</time>
                      ) : (
                        <span className="dora-team-event-time">Demo state</span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="dora-team-landing-section dora-team-safety-section" aria-labelledby="dora-team-safety-title">
          <div className="container dora-team-safety-grid">
            <div className="dora-team-section-copy">
              <h2 id="dora-team-safety-title">Public Safety Boundary</h2>
              <p>The team can be understood from the outside without exposing the owner&apos;s private work, prompts, accounts, or execution systems.</p>
              <ul className="dora-office-boundary-list">
                <li>
                  <CheckCircle2 size={15} aria-hidden />
                  <span>No private task titles, prompts, paths, or payloads.</span>
                </li>
                <li>
                  <CheckCircle2 size={15} aria-hidden />
                  <span>No accounts, credentials, positions, orders, or execution controls.</span>
                </li>
                <li>
                  <CheckCircle2 size={15} aria-hidden />
                  <span>Trading MiniDora is research-only. Not an order, recommendation, or execution system.</span>
                </li>
              </ul>
            </div>

            <div className="dora-team-boundary-diagram">
              <div>
                <Globe2 size={22} aria-hidden />
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
              <span className="dora-team-boundary-mark" aria-hidden>
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

        <section className="dora-team-landing-section dora-team-command-section" aria-label="Doraemon team routes">
          <div className="container dora-team-command-shell">
            <div className="dora-office-command-heading">
              <h2>Continue Through Doraemon Office</h2>
              <p>Move between the public-safe views without crossing into private owner systems.</p>
            </div>
            <div className="dora-office-command-grid">
              {commandRoutes.map((route) => {
                const Icon = route.icon;

                return (
                  <Link key={route.href} href={route.href} className="link-focus dora-office-command-card">
                    <Icon size={24} aria-hidden />
                    <h3>{route.title}</h3>
                    <p>{route.summary}</p>
                    <StatusBadge tone="info">{route.badge}</StatusBadge>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </SiteChrome>
  );
}
