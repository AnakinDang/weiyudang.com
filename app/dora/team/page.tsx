import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ArrowRight, Bot, Eye, LockKeyhole, Radio, ShieldCheck } from "lucide-react";
import { DoraemonMark } from "@/components/DoraemonMark";
import {
  DoraOfficeHeroArt,
  DoraOfficeHeroBoundaryCard,
  DoraOfficeHeroCopy,
  DoraOfficeHeroSignalRail
} from "@/components/DoraOfficeHero";
import { DoraOfficeShell } from "@/components/DoraOfficeShell";
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

const topologySlots = [
  "agent_dora",
  "agent_research",
  "agent_dev",
  "agent_product",
  "agent_ops",
  "agent_memory",
  "agent_trading",
  "agent_media"
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

function topologyClass(agent: PublicAgent, index: number) {
  const slot = topologySlots.includes(agent.publicId as (typeof topologySlots)[number])
    ? agent.publicId.replace("agent_", "")
    : "fallback";

  return `dora-team-node dora-team-node-${slot}`;
}

export default function DoraTeamPage() {
  const agents = getPublicAgents();
  const recentSignals = getRecentPublicDoraEvents(5);

  return (
    <DoraOfficeShell
      active="/dora/team"
      title="Team Agents"
      summary="A public-safe roster of Doraemon and MiniDoras with role, state, and recent sanitized activity."
      showBoundaryStrip={false}
    >
      <section className="dora-team-hero" aria-label="MiniDora team topology">
        <DoraOfficeHeroArt className="dora-team-hero-art" sizes="(max-width: 900px) 100vw, 72vw" />
        <DoraOfficeHeroCopy
          className="dora-team-hero-copy"
          lines={["Doraemon coordinates.", "MiniDoras specialize."]}
          summary="Public-safe roster"
        />

        <DoraOfficeHeroBoundaryCard
          className="dora-team-hero-boundary-card"
          items={[
            { icon: Eye, title: "Public window", detail: "Sanitized states" },
            { icon: LockKeyhole, title: "Private area", detail: "Owner-only work" }
          ]}
        />

        <div className="dora-team-topology">
          <div className="dora-team-orbit" aria-hidden="true" />
          {agents.map((agent, index) => (
            <article key={agent.publicId} className={topologyClass(agent, index)}>
              <span className="dora-team-node-mark">
                <DoraemonMark />
              </span>
              <div>
                <strong>{agent.stageName}</strong>
                <small>{agent.role}</small>
                <em className={stateToneClass[agent.state]}>
                  <span aria-hidden />
                  {agent.stateLabel}
                </em>
              </div>
            </article>
          ))}
        </div>

        <DoraOfficeHeroSignalRail
          className="dora-team-hero-signal-strip"
          ariaLabel="Recent public team signals"
          label="Recent public signals"
          items={recentSignals.map((event) => ({
            key: event.event_id,
            ariaLabel: `${formatPublicEventTime(event.created_at)} ${event.agent}: ${event.title}`,
            meta: formatPublicEventTime(event.created_at),
            metaElement: "time",
            metaDateTime: event.created_at,
            title: event.agent,
            detail: event.title
          }))}
        />
      </section>

      <section className="dora-team-boundary" aria-label="Public and private boundary">
        <div>
          <Eye size={19} aria-hidden />
          <strong>Public window</strong>
          <span>Sanitized. Real-time. Safe.</span>
        </div>
        <div>
          <LockKeyhole size={19} aria-hidden />
          <strong>Private area</strong>
          <span>Owner-only. Not visible here.</span>
        </div>
        <Link href="/dora/system" className="link-focus">
          Boundary details
          <ArrowRight size={14} aria-hidden />
        </Link>
      </section>

      <div className="dora-team-content-grid">
        <section aria-labelledby="dora-team-roster-title">
          <div className="dora-team-section-heading">
            <div>
              <h2 id="dora-team-roster-title">Agent roster ({agents.length})</h2>
              <p>Each card shows public role, state, and the latest fixed public event label.</p>
            </div>
            <Bot size={21} aria-hidden />
          </div>

          <div className="dora-team-roster">
            {agents.map((agent) => {
              const event = latestAgentEvent(agent);

              return (
                <article key={agent.publicId} className="dora-team-card">
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
                  <div className="dora-team-event">
                    <Activity size={15} aria-hidden />
                    <span>Recent public event</span>
                    <strong>{event ? event.title : "No public event yet"}</strong>
                    <time dateTime={event?.created_at}>{event ? formatPublicEventTime(event.created_at) : "Demo state"}</time>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="dora-team-signal-lane" aria-labelledby="dora-team-signals-title">
          <div className="dora-team-section-heading">
            <div>
              <h2 id="dora-team-signals-title">Recent public signals</h2>
              <p>Fixed labels only. No private titles, prompts, paths, or payloads.</p>
            </div>
            <Radio size={21} aria-hidden />
          </div>

          <div className="dora-team-signal-list">
            {recentSignals.map((event) => (
              <article key={event.event_id}>
                <span>
                  <DoraemonMark />
                </span>
                <div>
                  <strong>{event.agent}</strong>
                  <p>{event.title}</p>
                </div>
                <time dateTime={event.created_at}>{formatPublicEventTime(event.created_at)}</time>
              </article>
            ))}
          </div>

          <div className="dora-team-signal-note">
            <ShieldCheck size={17} aria-hidden />
            <span>Public relay content is allowlisted before it reaches this page.</span>
          </div>

          <Link href="/dora/activity" className="link-focus dora-team-view-all">
            View all public activity
            <ArrowRight size={15} aria-hidden />
          </Link>
        </aside>
      </div>
    </DoraOfficeShell>
  );
}
