"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CalendarClock,
  GitBranch,
  Layers3,
  LineChart,
  Radio,
  Repeat2,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { DoraemonMark } from "@/components/DoraemonMark";
import { StatusBadge } from "@/components/StatusBadge";
import { publicDoraScheduleToneClasses } from "@/lib/dora-public-client";
import type { SiteLocale } from "@/lib/site-i18n";
import type { publicScheduleBoundaries, publicSchedules } from "@/lib/dora-office";

type PublicSchedule = (typeof publicSchedules)[number];
type PublicScheduleBoundary = (typeof publicScheduleBoundaries)[number];
type StateFilter = "all" | PublicSchedule["state"];
type CadenceFilter = "all" | PublicSchedule["cadence"];

const stateFilters = [
  { value: "all", label: "All" },
  { value: "Working", label: "Working" },
  { value: "Owner review", label: "Owner review" }
] as const satisfies readonly { value: StateFilter; label: string }[];

const stateLabels = {
  Working: "Working",
  "Owner review": "Owner review"
} as const satisfies Record<PublicSchedule["state"], string>;

const cadenceLabels = {
  Morning: "Morning",
  "Market days": "Market days",
  Daily: "Daily",
  Weekly: "Weekly"
} as const satisfies Record<PublicSchedule["cadence"], string>;

const rhythmIcons = {
  "Daily brief": Sparkles,
  "Market scan": LineChart,
  "System health": Radio,
  "Weekly review": CalendarClock
} as const satisfies Record<PublicSchedule["name"], LucideIcon>;

const rhythmLanes = [
  {
    title: "Daily loops",
    cadences: ["Morning", "Daily"] as const,
    summary: "Briefs and health checks stay readable as rhythm, not commands."
  },
  {
    title: "Research loops",
    cadences: ["Market days"] as const,
    summary: "Market schedules show research-only posture and coarse windows."
  },
  {
    title: "Review loops",
    cadences: ["Weekly"] as const,
    summary: "Slower owner-review cadence stays public without private notes."
  }
] as const;

function scheduleToneClass(schedule: Pick<PublicSchedule, "state">) {
  return publicDoraScheduleToneClasses[schedule.state];
}

function publicWindowCountLabel(count: number, locale: SiteLocale) {
  if (locale === "zh") {
    return `${count} 个公开窗口`;
  }

  return `${count} public ${count === 1 ? "window" : "windows"}`;
}

export function ScheduleBoard({
  schedules,
  boundaries
}: {
  schedules: readonly PublicSchedule[];
  boundaries: readonly PublicScheduleBoundary[];
}) {
  const { locale } = useLanguage();
  const [stateFilter, setStateFilter] = useState<StateFilter>("all");
  const [cadenceFilter, setCadenceFilter] = useState<CadenceFilter>("all");

  const cadenceFilters = useMemo(
    () => [
      { value: "all" as const, label: "All cadence" },
      ...Array.from(new Set(schedules.map((schedule) => schedule.cadence))).map((cadence) => ({
        value: cadence,
        label: cadenceLabels[cadence]
      }))
    ],
    [schedules]
  );

  const filteredSchedules = useMemo(
    () =>
      schedules.filter((schedule) => {
        if (stateFilter !== "all" && schedule.state !== stateFilter) {
          return false;
        }

        if (cadenceFilter !== "all" && schedule.cadence !== cadenceFilter) {
          return false;
        }

        return true;
      }),
    [cadenceFilter, schedules, stateFilter]
  );

  const ownerReviewCount = useMemo(
    () => schedules.filter((schedule) => schedule.state === "Owner review").length,
    [schedules]
  );
  const ownerReviewText =
    ownerReviewCount === 1
      ? "1 review window is public. "
      : `${ownerReviewCount} review windows are public. `;
  const activeFilterLabels = [
    { key: "state", label: stateFilter === "all" ? "All public states" : stateLabels[stateFilter] },
    { key: "cadence", label: cadenceFilter === "all" ? "All cadence windows" : cadenceLabels[cadenceFilter] },
    { key: "privacy", label: "No private details" },
    { key: "mode", label: "Display-only" }
  ];

  return (
    <div className="dora-schedules dora-schedules-board-island">
      <section className="dora-schedules-controls" aria-label="Schedule filters">
        <div>
          <div className="dora-schedules-controls-head">
            <div>
              <strong>Filter public rhythm</strong>
              <p>Every control filters sanitized cadence posture only.</p>
            </div>
            <span aria-live="polite" aria-atomic="true">
              {filteredSchedules.length} shown
            </span>
          </div>

          <div className="dora-schedules-filter-row">
            <div className="dora-schedules-filter-group" role="group" aria-label="Schedule state filters">
              {stateFilters.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={stateFilter === item.value ? "is-active" : ""}
                  aria-pressed={stateFilter === item.value}
                  onClick={() => setStateFilter(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <label>
              <span>Cadence</span>
              <select value={cadenceFilter} onChange={(event) => setCadenceFilter(event.target.value as CadenceFilter)}>
                {cadenceFilters.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <ul className="dora-schedules-active-filters" aria-label="Filter posture and guarantees">
            {activeFilterLabels.map((item) => (
              <li key={item.key}>{item.label}</li>
            ))}
          </ul>
        </div>
      </section>

      <div className="dora-schedules-layout">
        <section className="dora-schedules-board" aria-labelledby="dora-schedules-board-title">
          <div className="dora-schedules-section-heading">
            <div>
              <h3 id="dora-schedules-board-title">Recurring operating windows</h3>
              <p>Public names, coarse last/next windows, and safe status only.</p>
            </div>
            <CalendarClock size={22} aria-hidden />
          </div>

          <div className="dora-schedules-lanes">
            {filteredSchedules.length === 0 ? (
              <article className="dora-schedules-empty" aria-live="polite">
                <CalendarClock size={20} aria-hidden />
                <div>
                  <h4>No public rhythm matches these filters</h4>
                  <p>Try a broader state or cadence view. Private automation details remain hidden.</p>
                </div>
              </article>
            ) : (
              filteredSchedules.map((schedule) => {
                const Icon = rhythmIcons[schedule.name];

                return (
                  <article key={schedule.name} className={`dora-schedules-lane ${scheduleToneClass(schedule)}`}>
                    <span className="dora-schedules-lane-icon">
                      <Icon size={20} aria-hidden />
                    </span>
                    <div className="dora-schedules-lane-main">
                      <div>
                        <h4>{schedule.name}</h4>
                        <StatusBadge tone={schedule.tone}>{schedule.state}</StatusBadge>
                      </div>
                      <p>{schedule.summary}</p>
                      <dl>
                        <div>
                          <dt>Cadence</dt>
                          <dd>{schedule.cadence}</dd>
                        </div>
                        <div>
                          <dt>Last</dt>
                          <dd>{schedule.last}</dd>
                        </div>
                        <div>
                          <dt>Next</dt>
                          <dd>{schedule.next}</dd>
                        </div>
                      </dl>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>

        <aside className="dora-schedules-side" aria-label="Schedule boundary and bridges">
          <section className="dora-schedules-rhythm-card" aria-label="Rhythm lanes">
            <div className="dora-schedules-section-heading">
              <div>
                <h3>Rhythm lanes</h3>
                <p>Public cadence grouped by what a visitor can safely understand.</p>
              </div>
              <GitBranch size={21} aria-hidden />
            </div>

            <div className="dora-schedules-rhythm-list">
              {rhythmLanes.map((lane) => {
                const count = schedules.filter((schedule) =>
                  lane.cadences.some((cadence) => cadence === schedule.cadence)
                ).length;

                return (
                  <article key={lane.title}>
                    <span>
                      <Layers3 size={15} aria-hidden />
                    </span>
                    <div>
                      <h4>{lane.title}</h4>
                      <small>
                        <span data-i18n-skip>{publicWindowCountLabel(count, locale)}</span>
                      </small>
                      <p>{lane.summary}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="dora-schedules-boundary-card" aria-label="Schedule boundary">
            <div className="dora-schedules-section-heading">
              <div>
                <h3>Schedule boundary</h3>
                <p>Rhythm is public. Implementation remains private.</p>
              </div>
              <ShieldCheck size={21} aria-hidden />
            </div>
            <ul>
              {boundaries.map((rule) => (
                <li key={rule}>
                  <ShieldCheck size={16} aria-hidden />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="dora-schedules-review-card" aria-label="Owner loop">
            <CalendarClock size={19} aria-hidden />
            <strong>Owner loop</strong>
            <p>
              {ownerReviewCount > 0 ? ownerReviewText : ""}
              Private instructions stay hidden.
            </p>
          </section>

          <section className="dora-schedules-link-card" aria-label="Activity bridge">
            <Repeat2 size={20} aria-hidden />
            <strong>Activity bridge</strong>
            <p>Open the public activity feed for surrounding fixed labels.</p>
            <Link href="/dora/activity" className="link-focus">
              View Activity
              <ArrowRight size={15} aria-hidden />
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
