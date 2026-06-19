"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CircleDot,
  Eye,
  Filter,
  LockKeyhole,
  Radio,
  ShieldCheck,
  Sparkles
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

type KindFilter = (typeof kindFilters)[number]["value"];
type SeverityFilter = "all" | PublicDoraEvent["severity"];
type TimeFilter = (typeof timeFilters)[number]["value"];
type ActivityFeedEvent = Omit<PublicDoraEvent, "event_id">;

function maxEventDate(events: ActivityFeedEvent[]) {
  return events[0]?.created_at.slice(0, 10);
}

export function ActivityFeed({ events }: { events: ActivityFeedEvent[] }) {
  const [kind, setKind] = useState<KindFilter>("all");
  const [agent, setAgent] = useState("all");
  const [severity, setSeverity] = useState<SeverityFilter>("all");
  const [timeRange, setTimeRange] = useState<TimeFilter>("all");

  const agents = useMemo(() => Array.from(new Set(events.map((event) => event.agent))).sort(), [events]);
  const groupCount = useMemo(() => new Set(events.map((event) => event.event_type)).size, [events]);
  const currentWindowDate = maxEventDate(events);
  const heroEvents = events.slice(0, 5);

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

  function clearFilters() {
    setKind("all");
    setAgent("all");
    setSeverity("all");
    setTimeRange("all");
  }

  return (
    <div className="dora-activity">
      <section className="dora-activity-lens" aria-label="Doraemon public activity lens">
        <Image
          src="/visuals/doraemon-activity-lens-v1.webp"
          alt=""
          width={1400}
          height={788}
          sizes="(max-width: 900px) 100vw, 70vw"
        />
        <div className="dora-activity-lens-overlay">
          <span>
            <DoraemonMark />
          </span>
          <strong>Live public lens</strong>
          <small>Sanitized event flow</small>
        </div>
        <div className="dora-activity-lens-strip" aria-label="Activity posture">
          <span>
            <Radio size={14} aria-hidden />
            Live bridge aware
          </span>
          <span>
            <ShieldCheck size={14} aria-hidden />
            Public schema only
          </span>
          <span>
            <LockKeyhole size={14} aria-hidden />
            Owner data hidden
          </span>
        </div>
        <div className="dora-activity-hero-rail" aria-label="Recent public activity preview">
          <div>
            <span className="dora-activity-rail-live-dot" aria-hidden />
            <strong>Live activity</strong>
            <small>public-safe</small>
          </div>
          <ol>
            {heroEvents.map((event) => (
              <li
                key={`${event.created_at}-${event.agent}-${event.title}`}
                aria-label={`${formatPublicEventTime(event.created_at)} ${event.agent}: ${event.title}`}
              >
                <time dateTime={event.created_at}>{formatPublicEventTime(event.created_at)}</time>
                <strong>{event.agent}</strong>
                <span>{event.title}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="dora-activity-summary" aria-label="Public activity summary">
        <article>
          <Radio size={24} aria-hidden />
          <strong>{events.length}</strong>
          <span>public events</span>
        </article>
        <article>
          <Sparkles size={24} aria-hidden />
          <strong>{groupCount}</strong>
          <span>event groups</span>
        </article>
        <article>
          <CircleDot size={24} aria-hidden />
          <strong>Demo</strong>
          <span>fallback ready</span>
        </article>
      </section>

      <section className="dora-activity-controls" aria-label="Activity filters">
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
      </section>

      <div className="dora-activity-layout">
        <section className="dora-activity-feed" aria-labelledby="dora-activity-feed-title">
          <div className="dora-activity-feed-heading">
            <div>
              <h2 id="dora-activity-feed-title">Public event timeline</h2>
              <p>Newest first. Fixed labels only.</p>
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
              <Radio size={20} aria-hidden />
              <h2>Live bridge</h2>
            </div>
            <p>Open the public command room view when the stage is more useful than the feed.</p>
            <Link href="/dora/office" className="link-focus">
              View Office Live
              <ArrowRight size={15} aria-hidden />
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
