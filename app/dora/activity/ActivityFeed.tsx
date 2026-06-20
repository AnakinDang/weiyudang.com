"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Eye,
  Filter,
  GitBranch,
  Layers3,
  LockKeyhole,
  ScanLine,
  ShieldCheck,
} from "lucide-react";
import { DoraemonMark } from "@/components/DoraemonMark";
import { StatusBadge } from "@/components/StatusBadge";
import { formatPublicEventTime, getPublicToolLabel } from "@/lib/dora-public-format";
import type { PublicDoraEvent } from "@/lib/dora-office";

const kindLabels = {
  agent_work: "Agent work",
  handoff: "Handoffs",
  tool_call: "Tools",
  owner_review: "Owner review",
  alert: "Alerts",
  system: "System"
} as const satisfies Record<PublicDoraEvent["event_type"], string>;

const kindFilters = [
  { value: "all" as const, label: "All" },
  ...Object.entries(kindLabels).map(([value, label]) => ({ value: value as PublicDoraEvent["event_type"], label }))
] as const;

const severityLabels = {
  normal: "Normal",
  info: "Info",
  warning: "Warning"
} as const satisfies Record<PublicDoraEvent["severity"], string>;

const timeFilters = [
  { value: "all", label: "All time" },
  { value: "current", label: "Current window" },
  { value: "latest5", label: "Latest 5" }
] as const;

const activityLanes = [
  {
    title: "Work",
    kinds: ["agent_work", "tool_call"] as const,
    summary: "Visible public progress and sanitized tool labels."
  },
  {
    title: "Coordination",
    kinds: ["handoff", "owner_review"] as const,
    summary: "Handoffs and owner checkpoints without private task names."
  },
  {
    title: "Health",
    kinds: ["alert", "system"] as const,
    summary: "Attention and system posture at a safe abstraction level."
  }
] as const;

type KindFilter = (typeof kindFilters)[number]["value"];
type SeverityFilter = "all" | PublicDoraEvent["severity"];
type TimeFilter = (typeof timeFilters)[number]["value"];
type ActivityFeedEvent = Omit<PublicDoraEvent, "event_id">;

function maxEventDate(events: ActivityFeedEvent[]) {
  return events[0]?.created_at.slice(0, 10);
}

function countBy<T extends string>(items: ActivityFeedEvent[], read: (event: ActivityFeedEvent) => T) {
  return items.reduce(
    (counts, event) => {
      const value = read(event);
      counts[value] = (counts[value] ?? 0) + 1;
      return counts;
    },
    {} as Partial<Record<T, number>>
  );
}

export function ActivityFeed({ events }: { events: ActivityFeedEvent[] }) {
  const [kind, setKind] = useState<KindFilter>("all");
  const [agent, setAgent] = useState("all");
  const [severity, setSeverity] = useState<SeverityFilter>("all");
  const [timeRange, setTimeRange] = useState<TimeFilter>("all");

  const agents = useMemo(() => Array.from(new Set(events.map((event) => event.agent))).sort(), [events]);
  const kindCounts = useMemo(() => countBy(events, (event) => event.event_type), [events]);
  const currentWindowDate = maxEventDate(events);

  const filteredEvents = useMemo(() => {
    const base = events.filter((event) => {
      if (kind !== "all" && event.event_type !== kind) {
        return false;
      }

      if (agent !== "all" && event.agent !== agent) {
        return false;
      }

      if (severity !== "all" && event.severity !== severity) {
        return false;
      }

      if (timeRange === "current" && currentWindowDate && !event.created_at.startsWith(currentWindowDate)) {
        return false;
      }

      return true;
    });

    return timeRange === "latest5" ? base.slice(0, 5) : base;
  }, [agent, currentWindowDate, events, kind, severity, timeRange]);

  const hasActiveFilters = kind !== "all" || agent !== "all" || severity !== "all" || timeRange !== "all";
  const activeFilterLabels = [
    { key: "kind", label: kind === "all" ? "All kinds" : kindLabels[kind] },
    { key: "agent", label: agent === "all" ? "All agents" : agent },
    { key: "severity", label: severity === "all" ? "All severity" : severityLabels[severity] },
    { key: "time", label: timeFilters.find((item) => item.value === timeRange)?.label ?? "All time" }
  ];

  function clearFilters() {
    setKind("all");
    setAgent("all");
    setSeverity("all");
    setTimeRange("all");
  }

  return (
    <div className="dora-activity">
      <section className="dora-activity-controls" aria-label="Activity filters">
        <div className="dora-activity-controls-head">
          <div>
            <strong>Filter public stream</strong>
            <p>All controls operate on sanitized event labels only.</p>
          </div>
          <span>{filteredEvents.length} shown</span>
        </div>
        <div className="dora-activity-kind-filters" role="group" aria-label="Event kind filters">
          {kindFilters.map((item) => (
            <button
              key={item.value}
              type="button"
              className={kind === item.value ? "is-active" : ""}
              aria-pressed={kind === item.value}
              onClick={() => setKind(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="dora-activity-selects">
          <label>
            <span>Agent</span>
            <select value={agent} onChange={(event) => setAgent(event.target.value)}>
              <option value="all">All agents</option>
              {agents.map((agentName) => (
                <option key={agentName} value={agentName}>
                  {agentName}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Severity</span>
            <select value={severity} onChange={(event) => setSeverity(event.target.value as SeverityFilter)}>
              <option value="all">All severity</option>
              {Object.entries(severityLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Time range</span>
            <select value={timeRange} onChange={(event) => setTimeRange(event.target.value as TimeFilter)}>
              {timeFilters.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={clearFilters} disabled={!hasActiveFilters}>
            Clear
          </button>
        </div>
        <div className="dora-activity-active-filters" aria-label="Current activity filters">
          {activeFilterLabels.map((filter) => (
            <span key={filter.key}>{filter.label}</span>
          ))}
        </div>
      </section>

      <div className="dora-activity-layout">
        <section className="dora-activity-feed" aria-labelledby="dora-activity-feed-title">
          <div className="dora-activity-feed-heading">
            <div>
              <h2 id="dora-activity-feed-title">Public event timeline</h2>
              <p>Newest first by creation time. Fixed labels only.</p>
            </div>
            <span>{filteredEvents.length} shown</span>
          </div>

          <div className="dora-activity-timeline">
            {filteredEvents.map((event) => {
              const toolLabel = getPublicToolLabel(event.tool_name);

              return (
                <article
                  key={`${event.created_at}-${event.agent}-${event.event_type}-${event.title}-${event.state}`}
                  className={`dora-activity-event dora-activity-event-${event.severity}`}
                >
                  <time dateTime={event.created_at}>{formatPublicEventTime(event.created_at)}</time>
                  <span className="dora-activity-event-dot" aria-hidden />
                  <span className="dora-activity-agent-mark">
                    <DoraemonMark />
                  </span>
                  <div className="dora-activity-event-main">
                    <div>
                      <strong>{event.title}</strong>
                      <StatusBadge tone={event.severity}>{event.state}</StatusBadge>
                    </div>
                    <p>
                      {event.agent} · {kindLabels[event.event_type]}
                    </p>
                  </div>
                  <div className="dora-activity-event-meta">
                    {toolLabel ? <span>Tool: {toolLabel}</span> : <span>Fixed public label</span>}
                  </div>
                </article>
              );
            })}
          </div>

          {filteredEvents.length === 0 ? (
            <div className="dora-activity-empty">
              <Filter size={18} aria-hidden />
              <strong>No public events match these filters.</strong>
              <button type="button" onClick={clearFilters}>
                Clear filters
              </button>
            </div>
          ) : null}
        </section>

        <aside className="dora-activity-side" aria-label="Public schema and live bridge">
          <section>
            <div className="dora-activity-side-title">
              <GitBranch size={20} aria-hidden />
              <h2>Event lanes</h2>
            </div>
            <p>Public activity is grouped into readable lanes without exposing run internals.</p>
            <div className="dora-activity-lane-list">
              {activityLanes.map((lane) => {
                const count = lane.kinds.reduce((total, laneKind) => total + (kindCounts[laneKind] ?? 0), 0);

                return (
                  <article key={lane.title}>
                    <span>
                      <Layers3 size={15} aria-hidden />
                    </span>
                    <div>
                      <strong>{lane.title}</strong>
                      <small>{count} public labels</small>
                      <p>{lane.summary}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section>
            <div className="dora-activity-side-title">
              <ShieldCheck size={20} aria-hidden />
              <h2>Public schema</h2>
            </div>
            <p>Doraemon Office is public, read-only, and sanitized before rendering.</p>
            <ul>
              <li>
                <Eye size={16} aria-hidden />
                <span>Opaque IDs</span>
              </li>
              <li>
                <CalendarClock size={16} aria-hidden />
                <span>Fixed titles</span>
              </li>
              <li>
                <LockKeyhole size={16} aria-hidden />
                <span>No prompts</span>
              </li>
              <li>
                <ShieldCheck size={16} aria-hidden />
                <span>No paths</span>
              </li>
            </ul>
          </section>

          <section>
            <div className="dora-activity-side-title">
              <ScanLine size={20} aria-hidden />
              <h2>Live bridge</h2>
            </div>
            <p>Open the public command room view when the stage is more useful than the feed.</p>
            <Link href="/dora/office" className="link-focus">
              View Office Live
              <ArrowRight size={15} aria-hidden />
            </Link>
          </section>

          <section>
            <div className="dora-activity-side-title">
              <CheckCircle2 size={20} aria-hidden />
              <h2>Boundary check</h2>
            </div>
            <p>Visible activity never includes raw IDs, prompts, artifacts, private paths, accounts, orders, or execution controls.</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
