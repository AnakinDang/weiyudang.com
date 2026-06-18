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
import { DoraemonMark } from "@/components/DoraemonMark";
import {
  DoraOfficeHeroArt,
  DoraOfficeHeroBoundaryCard,
  DoraOfficeHeroBoundaryStrip,
  DoraOfficeHeroCopy,
  DoraOfficeHeroSignalRail
} from "@/components/DoraOfficeHero";
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
  const previewSchedules = schedules.slice(0, 6);

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
        <DoraOfficeHeroArt className="dora-schedules-hero-art" />
        <DoraOfficeHeroCopy
          className="dora-schedules-hero-copy"
          lines={["Operating rhythm.", "Public windows only."]}
          summary="Coarse cadence, safe labels, no scheduler controls."
        />

        <DoraOfficeHeroBoundaryCard
          className="dora-schedules-hero-boundary-card"
          items={[
            { icon: Eye, title: "Public cadence", detail: "Coarse windows" },
            { icon: LockKeyhole, title: "Private scheduler", detail: "Commands hidden" }
          ]}
        />

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

        <DoraOfficeHeroBoundaryStrip
          className="dora-schedules-hero-boundary"
          items={[
            { icon: Eye, label: "Coarse windows" },
            { icon: LockKeyhole, label: "Commands hidden" },
            { icon: ShieldCheck, label: "Read-only" }
          ]}
        />

        <DoraOfficeHeroSignalRail
          className="dora-schedules-hero-signal-strip"
          ariaLabel="Public schedule window preview"
          label="Rhythm rail"
          items={previewSchedules.map((schedule) => ({
            key: schedule.name,
            ariaLabel: `${schedule.name}: ${schedule.cadence}, next ${schedule.next}`,
            meta: schedule.cadence,
            title: schedule.name,
            detail: schedule.next
          }))}
        />
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
