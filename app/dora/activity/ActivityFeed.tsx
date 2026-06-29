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
import { useLanguage } from "@/components/LanguageProvider";
import { StatusBadge } from "@/components/StatusBadge";
import { formatPublicEventTime } from "@/lib/dora-public-format";
import type { PublicDoraEventClientView } from "@/lib/dora-public-client";
import { localizeSiteText } from "@/lib/site-i18n";
import { activityModeLabel, displayEvents, useDoraLiveEvents, visibleLiveEvents } from "@/lib/use-dora-live";

const kindLabels = {
  agent_work: "Agent work",
  handoff: "Handoffs",
  tool_call: "Tools",
  owner_review: "Owner review",
  alert: "Alerts",
  system: "System"
} as const satisfies Record<PublicDoraEventClientView["event_type"], string>;

const kindFilters = [
  { value: "all" as const, label: "All" },
  ...Object.entries(kindLabels).map(([value, label]) => ({ value: value as PublicDoraEventClientView["event_type"], label }))
] as const;

const severityLabels = {
  normal: "Normal",
  info: "Info",
  warning: "Warning"
} as const satisfies Record<PublicDoraEventClientView["severity"], string>;

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
type SeverityFilter = "all" | PublicDoraEventClientView["severity"];
type TimeFilter = (typeof timeFilters)[number]["value"];
export type ActivityFeedEvent = PublicDoraEventClientView;

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

export function ActivityFeed({ fallbackEvents }: { fallbackEvents: ActivityFeedEvent[] }) {
  const { locale } = useLanguage();
  const t = (value: string) => localizeSiteText(value, locale);
  const [kind, setKind] = useState<KindFilter>("all");
  const [agent, setAgent] = useState("all");
  const [severity, setSeverity] = useState<SeverityFilter>("all");
  const [timeRange, setTimeRange] = useState<TimeFilter>("all");

  const live = useDoraLiveEvents();
  const hasVisibleLiveActivity = useMemo(() => visibleLiveEvents(live.events).length > 0, [live.events]);
  const sourceEvents = useMemo(() => displayEvents(live.events, fallbackEvents), [live.events, fallbackEvents]);
  const activityMode = activityModeLabel(live.connection, live.events, hasVisibleLiveActivity);

  const agents = useMemo(() => Array.from(new Set(sourceEvents.map((event) => event.agent))).sort(), [sourceEvents]);
  const kindCounts = useMemo(() => countBy(sourceEvents, (event) => event.event_type), [sourceEvents]);
  const currentWindowDate = maxEventDate(sourceEvents);

  const filteredEvents = useMemo(() => {
    const base = sourceEvents.filter((event) => {
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
  }, [agent, currentWindowDate, sourceEvents, kind, severity, timeRange]);

  const hasActiveFilters = kind !== "all" || agent !== "all" || severity !== "all" || timeRange !== "all";
  const activeFilterLabels = [
    { key: "kind", label: kind === "all" ? t("All kinds") : t(kindLabels[kind]) },
    { key: "agent", label: agent === "all" ? t("All agents") : t(agent) },
    { key: "severity", label: severity === "all" ? t("All severity") : t(severityLabels[severity]) },
    { key: "time", label: t(timeFilters.find((item) => item.value === timeRange)?.label ?? "All time") }
  ];

  function clearFilters() {
    setKind("all");
    setAgent("all");
    setSeverity("all");
    setTimeRange("all");
  }

  return (
    <div className="dora-activity">
      <section className="dora-activity-controls" aria-label={t("Activity filters")}>
        <div className="dora-activity-controls-head">
          <div>
            <strong>{t("Filter public stream")}</strong>
            <p>{t("All controls operate on sanitized event labels only.")}</p>
          </div>
          <span>{locale === "zh" ? `显示 ${filteredEvents.length} 条` : `${filteredEvents.length} shown`}</span>
        </div>
        <div className="dora-activity-kind-filters" role="group" aria-label={t("Event kind filters")}>
          {kindFilters.map((item) => (
            <button
              key={item.value}
              type="button"
              className={kind === item.value ? "is-active" : ""}
              aria-pressed={kind === item.value}
              onClick={() => setKind(item.value)}
            >
              {t(item.label)}
            </button>
          ))}
        </div>

        <div className="dora-activity-selects">
          <label>
            <span>{t("Agent")}</span>
            <select value={agent} onChange={(event) => setAgent(event.target.value)}>
              <option value="all">{t("All agents")}</option>
              {agents.map((agentName) => (
                <option key={agentName} value={agentName}>
                  {t(agentName)}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{t("Severity")}</span>
            <select value={severity} onChange={(event) => setSeverity(event.target.value as SeverityFilter)}>
              <option value="all">{t("All severity")}</option>
              {Object.entries(severityLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {t(label)}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{t("Time range")}</span>
            <select value={timeRange} onChange={(event) => setTimeRange(event.target.value as TimeFilter)}>
              {timeFilters.map((item) => (
                <option key={item.value} value={item.value}>
                  {t(item.label)}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={clearFilters} disabled={!hasActiveFilters}>
            {t("Clear")}
          </button>
        </div>
        <div className="dora-activity-active-filters" aria-label={t("Current activity filters")}>
          {activeFilterLabels.map((filter) => (
            <span key={filter.key}>{filter.label}</span>
          ))}
        </div>
      </section>

      <div className="dora-activity-layout">
        <section className="dora-activity-feed" aria-labelledby="dora-activity-feed-title">
          <div className="dora-activity-feed-heading">
            <div>
              <h2 id="dora-activity-feed-title">{t("Public event timeline")}</h2>
              <p>{t("Newest first by creation time. Fixed labels only.")}</p>
            </div>
            <div className="dora-activity-feed-mode">
              <span
                className={hasVisibleLiveActivity ? "dora-activity-live-dot is-live" : "dora-activity-live-dot"}
                aria-hidden
              />
              <strong>{t(activityMode)}</strong>
            </div>
          </div>
          <div className="sr-only" aria-live="polite">
            {hasVisibleLiveActivity
              ? t("Doraemon activity is showing live public events.")
              : t("Doraemon activity is showing a public-safe demo snapshot.")}
          </div>

          <div className="dora-activity-timeline">
            {filteredEvents.map((event) => {
              return (
                <article
                  key={event.event_id}
                  className={`dora-activity-event dora-activity-event-${event.severity}`}
                >
                  <time dateTime={event.created_at}>{formatPublicEventTime(event.created_at)}</time>
                  <span className="dora-activity-event-dot" aria-hidden />
                  <span className="dora-activity-agent-mark">
                    <DoraemonMark />
                  </span>
                  <div className="dora-activity-event-main">
                    <div>
                      <strong>{t(event.title)}</strong>
                      <StatusBadge tone={event.severity}>{t(event.state)}</StatusBadge>
                    </div>
                    <p>
                      {t(event.agent)} · {t(kindLabels[event.event_type])}
                    </p>
                  </div>
                  <div className="dora-activity-event-meta">
                    <span>{t("Fixed public label")}</span>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredEvents.length === 0 ? (
            <div className="dora-activity-empty">
              <Filter size={18} aria-hidden />
              <strong>{t("No public events match these filters.")}</strong>
              <button type="button" onClick={clearFilters}>
                {t("Clear filters")}
              </button>
            </div>
          ) : null}
        </section>

        <aside className="dora-activity-side" aria-label={t("Public activity side rail")}>
          <section>
            <div className="dora-activity-side-title">
              <GitBranch size={20} aria-hidden />
              <h2>{t("Event lanes")}</h2>
            </div>
            <p>{t("Public activity is grouped into readable lanes without exposing run internals.")}</p>
            <div className="dora-activity-lane-list">
              {activityLanes.map((lane) => {
                const count = lane.kinds.reduce((total, laneKind) => total + (kindCounts[laneKind] ?? 0), 0);

                return (
                  <article key={lane.title}>
                    <span>
                      <Layers3 size={15} aria-hidden />
                    </span>
                    <div>
                      <strong>{t(lane.title)}</strong>
                      <small>{locale === "zh" ? `${count} 个公开标签` : `${count} public labels`}</small>
                      <p>{t(lane.summary)}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section>
            <div className="dora-activity-side-title">
              <ShieldCheck size={20} aria-hidden />
              <h2>{t("Public schema")}</h2>
            </div>
            <p>{t("Doraemon Office is public, read-only, and sanitized before rendering.")}</p>
            <ul>
              <li>
                <Eye size={16} aria-hidden />
                <span>{t("Opaque IDs")}</span>
              </li>
              <li>
                <CalendarClock size={16} aria-hidden />
                <span>{t("Fixed titles")}</span>
              </li>
              <li>
                <LockKeyhole size={16} aria-hidden />
                <span>{t("No prompts")}</span>
              </li>
              <li>
                <ShieldCheck size={16} aria-hidden />
                <span>{t("No paths")}</span>
              </li>
            </ul>
          </section>

          <section>
            <div className="dora-activity-side-title">
              <ScanLine size={20} aria-hidden />
              <h2>{t("Office bridge")}</h2>
            </div>
            <p>{t("Open the public command room view when the stage is more useful than the feed.")}</p>
            <Link href="/dora/office" className="link-focus">
              {t("Open Doraemon Office")}
              <ArrowRight size={15} aria-hidden />
            </Link>
          </section>

          <section>
            <div className="dora-activity-side-title">
              <CheckCircle2 size={20} aria-hidden />
              <h2>{t("Boundary check")}</h2>
            </div>
            <p>{t("Visible activity uses fixed public labels and never includes prompts, artifacts, private paths, accounts, orders, or execution controls.")}</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
