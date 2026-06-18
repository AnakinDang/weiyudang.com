"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Eye,
  LockKeyhole,
  Radio,
  Repeat2,
  ShieldCheck,
  Sparkles,
  TimerReset
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
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

const cadenceLabels = {
  Morning: "Morning",
  "Market days": "Market days",
  Daily: "Daily",
  Weekly: "Weekly"
} as const satisfies Record<PublicSchedule["cadence"], string>;

const rhythmIcons = {
  "Daily brief": Sparkles,
  "Market scan": Radio,
  "System health": ShieldCheck,
  "Weekly review": Repeat2
} as const satisfies Record<PublicSchedule["name"], LucideIcon>;

function DoraemonMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 72 72" aria-hidden="true" focusable="false">
      <circle cx="36" cy="34" r="25" fill="currentColor" opacity="0.12" />
      <circle cx="36" cy="32" r="20" fill="#ffffff" stroke="currentColor" strokeWidth="2.2" />
      <ellipse cx="30" cy="24" rx="4.2" ry="6.8" fill="#ffffff" stroke="currentColor" strokeWidth="1.8" />
      <ellipse cx="42" cy="24" rx="4.2" ry="6.8" fill="#ffffff" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="31.4" cy="25.5" r="1.45" fill="currentColor" />
      <circle cx="40.6" cy="25.5" r="1.45" fill="currentColor" />
      <circle cx="36" cy="32" r="3.4" fill="currentColor" />
      <path d="M36 35.6v14.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M25.5 41.2c5.4 6.2 15.6 6.2 21 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M21 32.8h10M21.4 38.2l9.2-2.1M51 32.8H41M50.6 38.2l-9.2-2.1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path d="M25.5 53h21" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="36" cy="56" r="5.2" fill="#f4b740" stroke="#ffffff" strokeWidth="2" />
    </svg>
  );
}

function scheduleToneClass(schedule: Pick<PublicSchedule, "state">) {
  return schedule.state === "Owner review" ? "is-warning" : "is-info";
}

export function ScheduleBoard({
  schedules,
  boundaries
}: {
  schedules: readonly PublicSchedule[];
  boundaries: readonly PublicScheduleBoundary[];
}) {
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

  const ownerReviewCount = schedules.filter((schedule) => schedule.state === "Owner review").length;
  const cadenceCount = new Set(schedules.map((schedule) => schedule.cadence)).size;

  return (
    <div className="dora-schedules">
      <section className="dora-schedules-hero" aria-label="Doraemon operating rhythm">
        <div className="dora-schedules-hero-copy">
          <p>
            <span>Operating rhythm.</span> Public windows only.
          </p>
          <small>Coarse cadence, safe labels, no scheduler controls.</small>
        </div>

        <div className="dora-schedules-clock" aria-hidden="true">
          <div className="dora-schedules-clock-ring dora-schedules-clock-ring-outer" />
          <div className="dora-schedules-clock-ring dora-schedules-clock-ring-middle" />
          <div className="dora-schedules-clock-ring dora-schedules-clock-ring-inner" />
          <div className="dora-schedules-hub">
            <DoraemonMark />
            <strong>Doraemon</strong>
            <span>rhythm</span>
          </div>
          {schedules.map((schedule, index) => {
            const Icon = rhythmIcons[schedule.name];

            return (
              <div key={schedule.name} className={`dora-schedules-clock-node dora-schedules-clock-node-${index + 1}`}>
                <span className={scheduleToneClass(schedule)}>
                  <Icon size={15} aria-hidden />
                </span>
                <strong>{schedule.name}</strong>
                <small>{schedule.cadence}</small>
              </div>
            );
          })}
        </div>

        <div className="dora-schedules-hero-boundary">
          <span>
            <Eye size={15} aria-hidden />
            Coarse windows
          </span>
          <span>
            <LockKeyhole size={15} aria-hidden />
            Commands hidden
          </span>
          <span>
            <ShieldCheck size={15} aria-hidden />
            Read-only
          </span>
        </div>
      </section>

      <section className="dora-schedules-stats" aria-label="Public schedule summary">
        <article>
          <Repeat2 size={23} aria-hidden />
          <div>
            <strong>{schedules.length}</strong>
            <span>public rhythms</span>
          </div>
        </article>
        <article>
          <TimerReset size={23} aria-hidden />
          <div>
            <strong>{cadenceCount}</strong>
            <span>cadence windows</span>
          </div>
        </article>
        <article>
          <CheckCircle2 size={23} aria-hidden />
          <div>
            <strong>{ownerReviewCount}</strong>
            <span>review window</span>
          </div>
        </article>
      </section>

      <section className="dora-schedules-controls" aria-label="Schedule filters">
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
        <span aria-live="polite" aria-atomic="true">
          {filteredSchedules.length} shown
        </span>
      </section>

      <div className="dora-schedules-layout">
        <section className="dora-schedules-board" aria-labelledby="dora-schedules-board-title">
          <div className="dora-schedules-section-heading">
            <div>
              <h2 id="dora-schedules-board-title">Recurring operating windows</h2>
              <p>Public names, coarse last/next windows, and safe status only.</p>
            </div>
            <CalendarClock size={22} aria-hidden />
          </div>

          <div className="dora-schedules-lanes">
            {filteredSchedules.length === 0 ? (
              <article className="dora-schedules-empty" aria-live="polite">
                <CalendarClock size={20} aria-hidden />
                <div>
                  <h3>No public rhythm matches these filters</h3>
                  <p>Try a broader state or cadence view. Private scheduler details remain hidden.</p>
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
                        <h3>{schedule.name}</h3>
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
          <section className="dora-schedules-boundary-card">
            <div className="dora-schedules-section-heading">
              <div>
                <h2>Schedule boundary</h2>
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

          <section className="dora-schedules-review-card">
            <ReviewWindowIcon />
            <strong>Owner loop</strong>
            <p>Review windows are visible only as public state, never as private instructions.</p>
          </section>

          <section className="dora-schedules-link-card">
            <Radio size={20} aria-hidden />
            <strong>Activity bridge</strong>
            <p>Open the public activity feed for latest fixed labels.</p>
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

function ReviewWindowIcon() {
  return (
    <span className="dora-schedules-review-icon" aria-hidden>
      <CalendarClock size={19} />
    </span>
  );
}
