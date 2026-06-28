"use client";

import { createContext, useContext, useMemo } from "react";
import Link from "next/link";
import { Activity } from "lucide-react";
import { DoraemonMark } from "@/components/DoraemonMark";
import { StatusBadge } from "@/components/StatusBadge";
import type { PublicDoraEventClientView } from "@/lib/dora-public-client";
import { formatPublicEventTime } from "@/lib/dora-public-format";
import type { PublicAgent } from "@/lib/public-agents";
import { activityModeLabel, displayEvents, useDoraLiveEvents, visibleLiveEvents } from "@/lib/use-dora-live";

type DoraTeamSignalsProps = {
  fallbackSignals: PublicDoraEventClientView[];
};
type BadgeTone = "normal" | "info" | "warning" | "private" | "danger";
type DoraTeamLiveValue = {
  activityMode: string;
  hasVisibleLiveActivity: boolean;
  signalEvents: PublicDoraEventClientView[];
  latestEventForAgent: (agent: PublicAgent) => PublicDoraEventClientView | null;
};

const DoraTeamLiveContext = createContext<DoraTeamLiveValue | null>(null);

const baselineStateDotClass = {
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

function baselineTone(agent: PublicAgent): BadgeTone {
  if (agent.state === "waiting_user") return "warning";
  if (agent.state === "error") return "danger";
  if (agent.state === "done") return "normal";
  if (agent.state === "offline") return "private";
  return "info";
}

function eventTone(event: PublicDoraEventClientView): BadgeTone {
  if (event.severity === "warning") return "warning";
  if (event.state === "Attention") return "danger";
  if (event.state === "Completed" || event.severity === "normal") return "normal";
  return "info";
}

function stateDotClass(agent: PublicAgent, event: PublicDoraEventClientView | null) {
  if (!event) return baselineStateDotClass[agent.state];
  return `is-${eventTone(event)}`;
}

function publicAgentKeys(agent: PublicAgent) {
  return agent.publicId === "agent_dora"
    ? [agent.displayName, agent.stageName, "Doraemon"]
    : [agent.displayName, agent.stageName];
}

function AgentAvatar({ agent }: { agent: PublicAgent }) {
  const isDoraemon = agent.publicId === "agent_dora";

  return (
    <span className={`dora-team-avatar ${isDoraemon ? "is-doraemon" : "is-minidora"}`} role="img" aria-label={`${agent.stageName} public avatar`}>
      <DoraemonMark />
      {isDoraemon ? null : (
        <span className="dora-team-avatar-role" aria-hidden>
          {agent.stageName.slice(0, 1)}
        </span>
      )}
    </span>
  );
}

function useDoraTeamLive() {
  const value = useContext(DoraTeamLiveContext);
  if (!value) {
    throw new Error("DoraTeam live components must be rendered inside DoraTeamLiveProvider.");
  }
  return value;
}

// Public team live provider. Reuses the shared live-relay client once so the
// recent strip, selected agent card, and roster all agree on live/demo posture.
// It consumes only PublicDoraEventClientView: opaque IDs, fixed labels, public
// agent names, states, severity, and timestamps.
export function DoraTeamLiveProvider({
  fallbackSignals,
  children
}: DoraTeamSignalsProps & {
  children: React.ReactNode;
}) {
  const live = useDoraLiveEvents();
  const hasVisibleLiveActivity = useMemo(() => visibleLiveEvents(live.events).length > 0, [live.events]);
  const signalEvents = useMemo(
    () => displayEvents(live.events, fallbackSignals),
    [fallbackSignals, live.events]
  );
  const activityMode = activityModeLabel(live.connection, live.events, hasVisibleLiveActivity);
  const latestByAgent = useMemo(() => {
    const byAgent = new Map<string, PublicDoraEventClientView>();
    signalEvents.forEach((event) => {
      if (!byAgent.has(event.agent)) {
        byAgent.set(event.agent, event);
      }
    });
    return byAgent;
  }, [signalEvents]);

  const value = useMemo<DoraTeamLiveValue>(
    () => ({
      activityMode,
      hasVisibleLiveActivity,
      signalEvents,
      latestEventForAgent: (agent) => {
        for (const key of publicAgentKeys(agent)) {
          const event = latestByAgent.get(key);
          if (event) return event;
        }
        return null;
      }
    }),
    [activityMode, hasVisibleLiveActivity, latestByAgent, signalEvents]
  );

  return <DoraTeamLiveContext.Provider value={value}>{children}</DoraTeamLiveContext.Provider>;
}

// Public team recent-activity strip. Reuses the shared live-relay context so the
// team page's recent signals reflect real relay state (live/demo), consistent
// with /dora, /dora/office, and /dora/activity.
export function DoraTeamSignals() {
  const { activityMode, hasVisibleLiveActivity, signalEvents } = useDoraTeamLive();
  const signals = signalEvents.slice(0, 5);

  return (
    <section
      className={
        hasVisibleLiveActivity
          ? "dora-office-live-strip dora-team-landing-activity-strip dora-team-signals"
          : "dora-office-live-strip dora-team-landing-activity-strip dora-team-signals is-demo"
      }
      aria-label="Recent public-safe MiniDora team activity"
    >
      <div>
        <span aria-hidden />
        <strong>Recent public team signals</strong>
        <small>{activityMode}</small>
      </div>
      <ol>
        {signals.map((event) => (
          <li key={event.event_id}>
            <time dateTime={event.created_at}>{formatPublicEventTime(event.created_at)}</time>
            <strong>{event.agent}</strong>
            <span>{event.title}</span>
          </li>
        ))}
      </ol>
      <p className="sr-only" aria-live="polite">
        {hasVisibleLiveActivity
          ? "Doraemon team is showing live public signals."
          : "Doraemon team is showing a public-safe demo snapshot."}
      </p>
    </section>
  );
}

export function DoraTeamSelectedAgentCard({
  agent,
  showProfileLink = true
}: {
  agent: PublicAgent;
  showProfileLink?: boolean;
}) {
  const { hasVisibleLiveActivity, latestEventForAgent } = useDoraTeamLive();
  const event = latestEventForAgent(agent);
  const stateLabel = event?.state ?? agent.stateLabel;
  const label = event?.title ?? "Profile baseline";
  const updated = event ? formatPublicEventTime(event.created_at) : "Demo state";
  const sourceLabel = event ? (hasVisibleLiveActivity ? "Live public label" : "Demo public label") : "Profile baseline";

  return (
    <section className="dora-team-hero-side-card dora-team-selected-agent-card">
      <div className="dora-team-selected-agent-head">
        <AgentAvatar agent={agent} />
        <div>
          <h2>{agent.displayName}</h2>
          <p>{agent.role}</p>
        </div>
        <StatusBadge tone={event ? eventTone(event) : baselineTone(agent)}>{stateLabel}</StatusBadge>
      </div>
      <p>{agent.summary}</p>
      <dl>
        <div>
          <dt>Latest label</dt>
          <dd>{label}</dd>
        </div>
        <div>
          <dt>Updated</dt>
          <dd>{updated}</dd>
        </div>
        <div>
          <dt>Source</dt>
          <dd>{sourceLabel}</dd>
        </div>
      </dl>
      {showProfileLink ? (
        <Link href={`/dora/team/${agent.slug}`} className="link-focus dora-team-profile-link">
          View profile
        </Link>
      ) : null}
    </section>
  );
}

export function DoraTeamAgentSignalPanel({
  agent,
  limit = 4
}: {
  agent: PublicAgent;
  limit?: number;
}) {
  const { hasVisibleLiveActivity, signalEvents } = useDoraTeamLive();
  const keys = publicAgentKeys(agent);
  const matchingSignals = signalEvents.filter((event) => keys.includes(event.agent)).slice(0, limit);

  return (
    <section className="dora-agent-profile-panel dora-agent-profile-signal-panel">
      <div className="dora-agent-profile-panel-head">
        <Activity size={18} aria-hidden />
        <div>
          <h2>Recent public signals</h2>
          <p>{hasVisibleLiveActivity ? "Live public labels for this profile." : "Demo-safe labels for this profile."}</p>
        </div>
      </div>
      {matchingSignals.length ? (
        <ol className="dora-agent-profile-signal-list">
          {matchingSignals.map((event) => (
            <li key={event.event_id}>
              <time dateTime={event.created_at}>{formatPublicEventTime(event.created_at)}</time>
              <strong>{event.title}</strong>
              <span>{event.state}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="dora-agent-profile-empty">No matching public event yet</p>
      )}
    </section>
  );
}

export function DoraTeamRoster({ agents }: { agents: PublicAgent[] }) {
  const { hasVisibleLiveActivity, latestEventForAgent } = useDoraTeamLive();

  return (
    <div className="dora-team-roster">
      {agents.map((agent) => {
        const event = latestEventForAgent(agent);
        const tone = event ? eventTone(event) : baselineTone(agent);
        const stateLabel = event?.state ?? agent.stateLabel;
        const latestLabel = event?.title ?? "No matching public event yet";
        const sourceLabel = event ? (hasVisibleLiveActivity ? "Live public label" : "Demo public label") : "Profile baseline";

        return (
          <article key={agent.publicId} className={`dora-team-card dora-team-card-${agent.colorToken}`}>
            <div className="dora-team-card-top">
              <AgentAvatar agent={agent} />
              <span className={`dora-team-state-dot ${stateDotClass(agent, event)}`} aria-hidden />
            </div>
            <div className="dora-team-card-title">
              <h3>{agent.displayName}</h3>
              <StatusBadge tone={tone}>{stateLabel}</StatusBadge>
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
              <span>{sourceLabel}</span>
              <strong>{latestLabel}</strong>
              {event ? (
                <time dateTime={event.created_at}>{formatPublicEventTime(event.created_at)}</time>
              ) : (
                <span className="dora-team-event-time">Demo state</span>
              )}
            </div>
            <Link href={`/dora/team/${agent.slug}`} className="link-focus dora-team-profile-link">
              View public profile
            </Link>
          </article>
        );
      })}
    </div>
  );
}
