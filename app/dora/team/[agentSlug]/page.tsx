import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Ban,
  Bot,
  CheckCircle2,
  Clock3,
  Database,
  Eye,
  FileText,
  GitCompareArrows,
  LockKeyhole,
  Radio,
  ShieldCheck,
  Users,
  type LucideIcon
} from "lucide-react";
import { DoraemonMark } from "@/components/DoraemonMark";
import { DoraOfficeRouteDock } from "@/components/DoraOfficeRouteDock";
import {
  DoraTeamAgentSignalPanel,
  DoraTeamLiveProvider,
  DoraTeamSelectedAgentCard
} from "@/components/DoraTeamSignals";
import { SiteChrome } from "@/components/SiteChrome";
import { StatusBadge } from "@/components/StatusBadge";
import {
  getRecentPublicDoraEvents,
  toPublicDoraEventClientView
} from "@/lib/dora-office";
import {
  getPublicAgentBySlug,
  getPublicAgents,
  publicAgentProfileInitial,
  type PublicAgent
} from "@/lib/public-agents";
import { tradingConsoleHref, tradingResearchDisclaimer } from "@/lib/trading-team";

type DoraAgentProfilePageProps = {
  params: Promise<{ agentSlug: string }>;
};

const publicRules = [
  "Public profile copy only.",
  "No private prompts, tool detail, or internal run state.",
  "No financial state, orders, or owner-only controls."
] as const;

type ContinuationRoute = {
  title: string;
  summary: string;
  href: string;
  icon: LucideIcon;
  private?: boolean;
};

const profileRoutes = [
  {
    title: "Team Agents",
    summary: "Return to the full public MiniDora roster.",
    href: "/dora/team",
    icon: Users
  },
  {
    title: "Activity",
    summary: "Read the sanitized public timeline.",
    href: "/dora/activity",
    icon: Radio
  },
  {
    title: "System boundary",
    summary: "Review the public/private data contract.",
    href: "/dora/system",
    icon: ShieldCheck
  }
] as const satisfies readonly ContinuationRoute[];

const tradingContinuationRoutes = [
  {
    title: "Trading project",
    summary: "Read the public research-method page.",
    href: "/projects/minidora-trading",
    icon: FileText,
    private: false
  },
  {
    title: "Owner research console",
    summary: "Open the private evidence and gates view.",
    href: tradingConsoleHref("Evidence"),
    icon: LockKeyhole,
    private: true
  }
] as const satisfies readonly ContinuationRoute[];

const tradingResearchBridgeSteps = [
  {
    label: "Public profile",
    title: "One visible team identity",
    detail: "Trading MiniDora stays the public roster member for market research."
  },
  {
    label: "Public project",
    title: "Method before metrics",
    detail: "The project page explains desks, evidence, replay, and safety boundaries."
  },
  {
    label: "Private console",
    title: "Owner-gated evidence review",
    detail: "The cockpit opens only after owner auth and remains read-only."
  }
] as const;

function peersFor(agent: PublicAgent, agents: PublicAgent[]) {
  const collaboratorNames = new Set(agent.collaboratesWith);

  return agents.filter((candidate) => collaboratorNames.has(candidate.displayName));
}

export function generateStaticParams() {
  return getPublicAgents().map((agent) => ({ agentSlug: agent.slug }));
}

export async function generateMetadata({ params }: DoraAgentProfilePageProps): Promise<Metadata> {
  const { agentSlug } = await params;
  const agent = getPublicAgentBySlug(agentSlug);

  if (!agent) {
    return {};
  }

  const url = `/dora/team/${agent.slug}`;

  return {
    title: `${agent.displayName} | Doraemon Team`,
    description: agent.summary,
    alternates: {
      canonical: url
    },
    openGraph: {
      title: `${agent.displayName} | Doraemon Team`,
      description: agent.summary,
      url,
      type: "profile"
    }
  };
}

export default async function DoraAgentProfilePage({ params }: DoraAgentProfilePageProps) {
  const { agentSlug } = await params;
  const agents = getPublicAgents();
  const agent = agents.find((candidate) => candidate.slug === agentSlug);

  if (!agent) {
    notFound();
  }

  const signalEvents = getRecentPublicDoraEvents().map(toPublicDoraEventClientView);
  const peers = peersFor(agent, agents);
  const isTrading = agent.slug === "trading";
  const continuationRoutes: readonly ContinuationRoute[] = isTrading
    ? [...tradingContinuationRoutes, ...profileRoutes]
    : profileRoutes;

  return (
    <SiteChrome headerVariant="doraemon" headerActiveHref="/dora">
      <DoraTeamLiveProvider fallbackSignals={signalEvents}>
        <div className={`dora-agent-profile-page dora-agent-profile-${agent.colorToken}`}>
          <div className="dora-office-route-dock-wrap">
            <DoraOfficeRouteDock active="/dora/team" />
          </div>

          <section className="dora-agent-profile-hero" aria-labelledby="dora-agent-profile-title">
            <div className="container dora-agent-profile-hero-grid">
              <div className="dora-agent-profile-copy">
                <Link href="/dora/team" className="link-focus dora-agent-profile-back">
                  <ArrowLeft size={16} aria-hidden />
                  Back to Team Agents
                </Link>
                <p className="dora-office-kicker">Public Agent Profile</p>
                <h1 id="dora-agent-profile-title">{agent.displayName}</h1>
                <p>{agent.focus}</p>
                <div className="dora-agent-profile-badges">
                  <StatusBadge tone="info">{agent.role}</StatusBadge>
                  <StatusBadge tone={isTrading ? "warning" : "normal"}>{agent.stateLabel}</StatusBadge>
                  <StatusBadge tone="private">read-only</StatusBadge>
                </div>
              </div>

              <div className="dora-agent-profile-visual" aria-label="Public profile mark">
                <span className="dora-agent-profile-halo" aria-hidden />
                <div className="dora-agent-profile-emblem">
                  <DoraemonMark />
                  <span className="dora-agent-profile-emblem-initial" aria-hidden>
                    {publicAgentProfileInitial(agent)}
                  </span>
                  <strong>{agent.stageName}</strong>
                  <small>{agent.role}</small>
                </div>
                <div className="dora-agent-profile-asset-note">
                  <Eye size={16} aria-hidden />
                  <span>Curated public profile mark</span>
                </div>
              </div>

              <aside className="dora-agent-profile-live-card" aria-label="Current public state">
                <DoraTeamSelectedAgentCard agent={agent} showProfileLink={false} />
              </aside>
            </div>
          </section>

          <section className="dora-agent-profile-section" aria-label="Public responsibilities">
            <div className="container dora-agent-profile-grid">
              <article className="dora-agent-profile-panel dora-agent-profile-responsibilities">
                <div className="dora-agent-profile-panel-head">
                  <Bot size={18} aria-hidden />
                  <div>
                    <h2>Public responsibilities</h2>
                    <p>What this profile is allowed to explain in public.</p>
                  </div>
                </div>
                <ul>
                  {agent.responsibilities.map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={16} aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="dora-agent-profile-panel">
                <div className="dora-agent-profile-panel-head">
                  <Clock3 size={18} aria-hidden />
                  <div>
                    <h2>Operating rhythm</h2>
                    <p>{agent.cadence}</p>
                  </div>
                </div>
                <div className="dora-agent-profile-rhythm-list">
                  {agent.publicSignals.map((signal) => (
                    <span key={signal}>{signal}</span>
                  ))}
                </div>
                <div className="dora-agent-profile-review-gate">
                  <ShieldCheck size={17} aria-hidden />
                  <strong>{agent.reviewGate}</strong>
                </div>
              </article>

              <DoraTeamAgentSignalPanel agent={agent} />

              <article className="dora-agent-profile-panel dora-agent-profile-boundary">
                <div className="dora-agent-profile-panel-head">
                  <LockKeyhole size={18} aria-hidden />
                  <div>
                    <h2>Public boundary</h2>
                    <p>This page is a curated profile, not a control panel.</p>
                  </div>
                </div>
                <ul>
                  {publicRules.map((rule) => (
                    <li key={rule}>
                      <CheckCircle2 size={16} aria-hidden />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </section>

          {isTrading ? (
            <section className="dora-agent-profile-section dora-agent-trading-bridge-section" aria-labelledby="dora-agent-trading-bridge-title">
              <div className="container dora-agent-trading-bridge">
                <div className="dora-agent-trading-bridge-copy">
                  <p className="dora-office-kicker">Research bridge</p>
                  <h2 id="dora-agent-trading-bridge-title">From public identity to private evidence.</h2>
                  <p>
                    Trading MiniDora is the public face of a private research desk. The public site can explain the
                    method; the owner console can inspect evidence, gates, and replay after authentication.
                  </p>
                  <div className="dora-agent-trading-bridge-disclaimer" role="note" aria-label="Trading research boundary">
                    <ShieldCheck size={18} aria-hidden />
                    <strong>{tradingResearchDisclaimer}</strong>
                  </div>
                </div>

                <div className="dora-agent-trading-bridge-path" aria-label="Trading MiniDora route path">
                  {tradingResearchBridgeSteps.map((step, index) => (
                    <article key={step.label}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <small>{step.label}</small>
                      <strong>{step.title}</strong>
                      <p>{step.detail}</p>
                    </article>
                  ))}
                </div>

                <div className="dora-agent-trading-bridge-actions" aria-label="Trading MiniDora route actions">
                  <Link href="/projects/minidora-trading" className="link-focus">
                    <FileText size={18} aria-hidden />
                    Open public project
                    <ArrowRight size={16} aria-hidden />
                  </Link>
                  <Link href={tradingConsoleHref("Evidence")} prefetch={false} className="link-focus">
                    <LockKeyhole size={18} aria-hidden />
                    Open owner console
                    <ArrowRight size={16} aria-hidden />
                  </Link>
                </div>

                <div className="dora-agent-trading-bridge-boundary" aria-label="Trading MiniDora public safety boundary">
                  <div>
                    <Database size={18} aria-hidden />
                    <strong>Public can show</strong>
                    <span>Role, method, desk map, sample evidence shapes.</span>
                  </div>
                  <div>
                    <GitCompareArrows size={18} aria-hidden />
                    <strong>Private can inspect</strong>
                    <span>Evidence packets, gates, source health, replay.</span>
                  </div>
                  <div>
                    <Ban size={18} aria-hidden />
                    <strong>Never available</strong>
                    <span>Financial state, order flow, execution controls.</span>
                  </div>
                </div>
              </div>
            </section>
          ) : null}

          <section className="dora-agent-profile-section" aria-labelledby="dora-agent-profile-peers-title">
            <div className="container dora-agent-profile-peer-shell">
              <div className="dora-agent-profile-section-copy">
                <p className="dora-office-kicker">Collaboration map</p>
                <h2 id="dora-agent-profile-peers-title">Works with</h2>
                <p>Profiles stay public-safe while showing how MiniDoras coordinate across the Doraemon Office.</p>
                <Link href={agent.projectHref} className="link-focus dora-office-text-link">
                  <FileText size={16} aria-hidden />
                  {agent.projectLabel}
                  <ArrowRight size={15} aria-hidden />
                </Link>
              </div>
              <div className="dora-agent-profile-peer-grid">
                {peers.map((peer) => (
                  <Link key={peer.slug} href={`/dora/team/${peer.slug}`} className="link-focus dora-agent-profile-peer-card">
                    <span className="dora-agent-profile-peer-mark" aria-hidden>
                      <DoraemonMark />
                      <span>{publicAgentProfileInitial(peer)}</span>
                    </span>
                    <span>
                      <strong>{peer.displayName}</strong>
                      <small>{peer.role}</small>
                    </span>
                    <ArrowRight size={15} aria-hidden />
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="dora-agent-profile-section dora-agent-profile-command-section" aria-label="Continue through Doraemon Office">
            <div className="container dora-agent-profile-command-shell">
              {continuationRoutes.map((route) => {
                const Icon = route.icon;

                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    prefetch={route.private ? false : undefined}
                    className="link-focus dora-agent-profile-route-card"
                  >
                    <Icon size={22} aria-hidden />
                    <span>
                      <strong>{route.title}</strong>
                      <small>{route.summary}</small>
                    </span>
                    <ArrowRight size={15} aria-hidden />
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </DoraTeamLiveProvider>
    </SiteChrome>
  );
}
