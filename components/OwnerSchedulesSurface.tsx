"use client";

import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BellRing,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileSearch,
  Gauge,
  Layers3,
  LockKeyhole,
  Moon,
  Repeat2,
  ShieldAlert,
  ShieldCheck,
  Sun,
  TimerReset,
  Waypoints,
  XCircle
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { StatusBadge } from "@/components/StatusBadge";
import { isOwnerScheduleId, OWNER_SCHEDULE_PARAM, ownerScheduleHref } from "@/lib/schedule-route";
import { translateToZh, type SiteLocale } from "@/lib/site-i18n";
import { ownerSystemHref } from "@/lib/system-route";

type ScheduleTone = "normal" | "info" | "warning" | "private" | "danger";

type ScheduleEvidence = {
  label: string;
  state: string;
  tone: ScheduleTone;
  ready: boolean;
  detail: string;
};

type ScheduleWindow = {
  label: string;
  time: string;
  detail: string;
};

type ScheduleStep = {
  label: string;
  state: string;
  tone: ScheduleTone;
  detail: string;
};

type ScheduleOwnerPosture = {
  label: string;
  state: string;
  tone: ScheduleTone;
  detail: string;
  next: string;
};

type PrivateSchedule = {
  id: string;
  lifecycle: "working" | "owner-review";
  name: string;
  cadence: string;
  nextWindow: string;
  owner: string;
  state: string;
  tone: ScheduleTone;
  access: string;
  accessTone: ScheduleTone;
  summary: string;
  safety: string;
  purpose: string;
  lastRun: string;
  nextAction: string;
  window: ScheduleWindow;
  evidence: readonly ScheduleEvidence[];
  readingSteps: readonly ScheduleStep[];
  safeOutputs: readonly ScheduleStep[];
  ownerPostures: readonly ScheduleOwnerPosture[];
  dependencies: readonly string[];
  ownerGate: string;
  noGo: readonly string[];
};

type ScheduleMetric = {
  label: string;
  value: string;
  detail: string;
};

type RhythmLane = {
  label: string;
  time: string;
  owner: string;
  state: string;
  tone: ScheduleTone;
  detail: string;
};

type SchedulesData = {
  schedules: readonly PrivateSchedule[];
  metrics: readonly ScheduleMetric[];
  rhythmLanes: readonly RhythmLane[];
  policy: readonly string[];
};

type ScheduleRouteMode = "push" | "replace";

type FilterOption = {
  label: string;
  value: string;
  icon: LucideIcon;
};

const unavailableControls = ["Create job", "Pause job", "Resume job", "Delete job", "Edit command"] as const;
const rhythmIcons = [Sun, BarChart3, Moon, CalendarClock] as const;
const scheduleMetricToneClasses = [
  "border-sky-200/25 bg-sky-300/10 text-sky-100",
  "border-yellow-200/30 bg-yellow-300/10 text-yellow-100",
  "border-emerald-200/25 bg-emerald-300/10 text-emerald-100",
  "border-violet-200/25 bg-violet-300/10 text-violet-100"
] as const;

const scheduleZhOverrides: Partial<Record<string, string>> = {
  "owner-only": "仅限本人",
  "research-only": "仅研究",
  "No-send": "不发送",
  "No action": "无动作",
  "Owner read": "本人阅读",
  "Safe hold": "安全保持",
  "Needs proof": "需要证明"
};

function scheduleText(value: string | undefined, locale: SiteLocale) {
  if (!value) return "";
  if (locale !== "zh") return value;
  return scheduleZhOverrides[value] ?? translateToZh(value) ?? value;
}

function evidenceSummary(schedule: PrivateSchedule, locale: SiteLocale) {
  const ready = schedule.evidence.filter((item) => item.ready).length;
  if (locale === "zh") return `${ready}/${schedule.evidence.length} 项就绪`;
  return `${ready} of ${schedule.evidence.length} ready`;
}

function postureChoiceKey(scheduleId: string, label: string) {
  return `${scheduleId}:${label}`;
}

function filterOptions(schedules: readonly PrivateSchedule[]) {
  const cadenceOptions = Array.from(new Set(schedules.map((schedule) => schedule.cadence))).map((cadence) => {
    const Icon = cadence.includes("Market") ? BarChart3 : cadence === "Weekly" ? CalendarClock : cadence === "Daily" ? TimerReset : Sun;
    return { label: cadence, value: cadence, icon: Icon };
  });

  return [{ label: "All", value: "All", icon: Layers3 }, ...cadenceOptions] as const satisfies readonly FilterOption[];
}

function scheduleCountLabel(count: number, locale: SiteLocale) {
  if (locale === "zh") return "项日程";
  return count === 1 ? "schedule" : "schedules";
}

function scheduleIdFromSearch(search: string, schedules: readonly PrivateSchedule[]) {
  const params = new URLSearchParams(search);
  const scheduleId = params.get(OWNER_SCHEDULE_PARAM);
  return isOwnerScheduleId(scheduleId) && schedules.some((schedule) => schedule.id === scheduleId) ? scheduleId : undefined;
}

function scheduleRouteUrl(scheduleId: string) {
  if (!isOwnerScheduleId(scheduleId)) {
    return ownerScheduleHref();
  }

  if (typeof window === "undefined") {
    return ownerScheduleHref(scheduleId);
  }

  const url = new URL(window.location.href);
  const nextHref = ownerScheduleHref(scheduleId);
  const nextUrl = new URL(nextHref, url.origin);
  return `${nextUrl.pathname}${nextUrl.search}${url.hash}`;
}

function currentScheduleUrl() {
  if (typeof window === "undefined") {
    return "";
  }

  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function SchedulesHero({
  data,
  selectedSchedule,
  locale
}: {
  data: SchedulesData;
  selectedSchedule: PrivateSchedule;
  locale: SiteLocale;
}) {
  const t = (value: string | undefined) => scheduleText(value, locale);

  return (
    <section
      className="panel relative isolate overflow-hidden p-0"
      aria-labelledby="schedules-title"
    >
      <div
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-2/3 bg-[radial-gradient(circle_at_66%_18%,rgba(56,189,248,0.22),transparent_34%),radial-gradient(circle_at_82%_72%,rgba(250,204,21,0.13),transparent_30%),linear-gradient(135deg,transparent,rgba(59,130,246,0.10))]"
        aria-hidden
      />
      <div className="grid min-h-[31rem] gap-0 xl:grid-cols-[minmax(0,1fr)_25rem] 2xl:grid-cols-[minmax(0,1fr)_28rem]">
        <div className="relative grid gap-6 overflow-hidden p-6 md:p-8 2xl:grid-cols-[minmax(18rem,0.72fr)_minmax(22rem,1fr)]">
          <div className="pointer-events-none absolute -left-24 top-12 size-80 rounded-full bg-sky-500/14 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute bottom-0 right-0 h-56 w-[44rem] rounded-tl-full border border-sky-200/10 bg-[radial-gradient(circle_at_65%_100%,rgba(250,204,21,0.12),rgba(56,189,248,0.10)_42%,transparent_70%)]" aria-hidden />

          <div className="relative">
            <div className="relative inline-flex items-center gap-2 rounded-[8px] border border-sky-200/25 bg-sky-300/10 px-3 py-2 text-xs font-bold uppercase text-sky-100">
              <CalendarClock size={14} aria-hidden />
              {t("Owner Schedules")}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-[8px] border border-violet-200/25 bg-violet-300/10 px-3 py-1.5 text-xs font-bold uppercase text-violet-100">
                <LockKeyhole size={14} aria-hidden />
                {t("Owner-only")}
              </span>
              <span className="inline-flex items-center gap-2 rounded-[8px] border border-emerald-200/25 bg-emerald-300/10 px-3 py-1.5 text-xs font-bold uppercase text-emerald-100">
                <FileSearch size={14} aria-hidden />
                {t("Read-only register")}
              </span>
              <span className="inline-flex items-center gap-2 rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 px-3 py-1.5 text-xs font-bold uppercase text-yellow-100">
                <ShieldCheck size={14} aria-hidden />
                {t("No scheduler controls")}
              </span>
            </div>

            <div className="mt-10 max-w-3xl">
              <p className="eyebrow">{t("Authenticated private rhythm")}</p>
              <h2 id="schedules-title" className="mt-2 text-3xl font-semibold leading-[1.04] text-white md:text-5xl">
                {t("Schedules")}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                {t("Time awareness and operating windows for Doraemon, MiniDoras, and owner review. The page shows rhythm, evidence, and gates without becoming a scheduler.")}
              </p>
            </div>

            <RhythmMiniMap lanes={data.rhythmLanes} selectedSchedule={selectedSchedule} locale={locale} />

            <div className="mt-7 grid gap-3 sm:grid-cols-2 2xl:hidden">
              {data.metrics.map((metric, index) => (
                <MetricCell key={metric.label} metric={metric} toneClass={scheduleMetricToneClasses[index % scheduleMetricToneClasses.length]} locale={locale} />
              ))}
            </div>
          </div>

          <div className="relative hidden min-h-[24rem] rounded-[8px] border border-slate-700 bg-[#07111f]/76 p-5 shadow-[0_24px_90px_rgba(14,165,233,0.08)] backdrop-blur 2xl:block">
            <RhythmClock lanes={data.rhythmLanes} selectedSchedule={selectedSchedule} locale={locale} />
          </div>

          <div className="relative hidden gap-3 2xl:col-span-2 2xl:grid 2xl:grid-cols-4">
            {data.metrics.map((metric, index) => (
              <MetricCell key={metric.label} metric={metric} toneClass={scheduleMetricToneClasses[index % scheduleMetricToneClasses.length]} locale={locale} />
            ))}
          </div>
        </div>

        <section
          className="relative border-t border-slate-700/70 bg-[#07111f]/45 p-5 md:p-6 xl:border-l xl:border-t-0"
          aria-labelledby="next-schedule-title"
        >
          <div className="pointer-events-none absolute inset-x-6 top-6 h-48 rounded-full bg-sky-500/12 blur-3xl" aria-hidden />
          <div className="relative rounded-[8px] border border-slate-700 bg-[#07111f]/76 p-5 shadow-[0_20px_80px_rgba(14,165,233,0.10)] backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-yellow-100">{t("Next operating window")}</p>
                <h3 id="next-schedule-title" className="mt-1 text-2xl font-semibold text-white">
                  {t(selectedSchedule.name)}
                </h3>
                <p className="mt-1 text-xs font-bold uppercase text-sky-100">{t(selectedSchedule.window.label)}</p>
              </div>
              <StatusBadge tone={selectedSchedule.tone}>{t(selectedSchedule.state)}</StatusBadge>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-300">{t(selectedSchedule.purpose)}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <StatusBadge tone={selectedSchedule.accessTone}>{t(selectedSchedule.access)}</StatusBadge>
              <StatusBadge tone="info">{t(selectedSchedule.cadence)}</StatusBadge>
            </div>
          </div>

          <div className="relative mt-4 grid gap-3">
            <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <p className="text-xs font-bold uppercase text-slate-400">{t("Next action")}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-white">{t(selectedSchedule.nextAction)}</p>
            </div>
            <div className="rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 p-4">
              <p className="text-xs font-bold uppercase text-yellow-100">{t("Owner gate")}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-yellow-50">{t(selectedSchedule.ownerGate)}</p>
            </div>
            <dl className="grid grid-cols-2 gap-3 rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 text-sm">
              <div>
                <dt className="text-xs font-bold uppercase text-slate-400">{t("Evidence")}</dt>
                <dd className="mt-1 font-semibold text-white">{evidenceSummary(selectedSchedule, locale)}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase text-slate-400">{t("No-go")}</dt>
                <dd className="mt-1 font-semibold text-white">{selectedSchedule.noGo.length}</dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </section>
  );
}

function RhythmMiniMap({
  lanes,
  selectedSchedule,
  locale
}: {
  lanes: readonly RhythmLane[];
  selectedSchedule: PrivateSchedule;
  locale: SiteLocale;
}) {
  const t = (value: string | undefined) => scheduleText(value, locale);

  return (
    <div className="mt-7 rounded-[8px] border border-slate-700 bg-[#07111f]/70 p-4 shadow-[0_16px_55px_rgba(14,165,233,0.08)] backdrop-blur 2xl:hidden">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sky-100">
          <Clock3 size={17} aria-hidden />
          <p className="text-xs font-bold uppercase">{t("Rhythm map")}</p>
        </div>
        <span className="rounded-[8px] border border-sky-200/25 bg-sky-300/10 px-2.5 py-1 text-xs font-bold uppercase text-sky-100">
          {t(selectedSchedule.nextWindow)}
        </span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {lanes.map((lane, index) => {
          const Icon = rhythmIcons[index] ?? Clock3;
          return (
            <article key={lane.label} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-3 text-slate-300">
              <div className="flex items-center gap-2 text-sky-100">
                <span className="flex size-8 items-center justify-center rounded-[8px] border border-sky-200/35 bg-sky-200/16">
                  <Icon size={15} aria-hidden />
                </span>
                <span className="text-xs font-bold uppercase">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <p className="mt-3 text-sm font-semibold text-white">{t(lane.label)}</p>
              <p className="mt-1 text-xs leading-5 text-slate-400">{t(lane.time)}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function MetricCell({ metric, toneClass, locale }: { metric: ScheduleMetric; toneClass: string; locale: SiteLocale }) {
  const t = (value: string | undefined) => scheduleText(value, locale);

  return (
    <div className={`rounded-[8px] border p-4 ${toneClass}`}>
      <p className="text-xs font-bold uppercase text-current">{t(metric.label)}</p>
      <strong className="mt-2 block text-3xl font-semibold text-white">{metric.value}</strong>
      <p className="mt-2 text-sm leading-5 text-slate-200/85">{t(metric.detail)}</p>
    </div>
  );
}

function RhythmClock({
  lanes,
  selectedSchedule,
  locale
}: {
  lanes: readonly RhythmLane[];
  selectedSchedule: PrivateSchedule;
  locale: SiteLocale;
}) {
  const t = (value: string | undefined) => scheduleText(value, locale);

  return (
    <div className="relative h-full min-h-[21rem]">
      <div className="absolute left-1/2 top-1/2 size-56 -translate-x-1/2 -translate-y-1/2 rounded-full border-[12px] border-slate-700" aria-hidden />
      <div className="absolute left-1/2 top-1/2 size-56 -translate-x-1/2 -translate-y-1/2 rounded-full border-[12px] border-transparent border-r-sky-300 border-t-yellow-300" aria-hidden />
      <div className="absolute left-1/2 top-1/2 size-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-200/25 bg-[#07111f] p-4 text-center shadow-[0_16px_55px_rgba(14,165,233,0.12)]">
        <Clock3 className="mx-auto text-sky-100" size={26} aria-hidden />
        <strong className="mt-2 block text-sm font-semibold text-white">{t(selectedSchedule.cadence)}</strong>
        <span className="mt-1 block text-xs font-bold uppercase text-sky-100">{t(selectedSchedule.nextWindow)}</span>
      </div>

      {lanes.map((lane, index) => {
        const Icon = rhythmIcons[index] ?? Clock3;
        const positions = [
          "left-3 top-8",
          "right-4 top-10",
          "right-0 bottom-14",
          "left-4 bottom-10"
        ];

        return (
          <article key={lane.label} className={`absolute ${positions[index] ?? "left-3 top-8"} max-w-[9rem] text-sm`}>
            <Icon className="text-sky-100" size={22} aria-hidden />
            <strong className="mt-2 block text-white">{t(lane.label)}</strong>
            <span className="mt-1 block text-xs leading-5 text-slate-400">{t(lane.time)}</span>
          </article>
        );
      })}
    </div>
  );
}

function ScheduleFilters({
  options,
  activeFilter,
  onSelect,
  locale
}: {
  options: readonly FilterOption[];
  activeFilter: string;
  onSelect: (value: string) => void;
  locale: SiteLocale;
}) {
  const t = (value: string | undefined) => scheduleText(value, locale);

  return (
    <div className="flex flex-wrap gap-2" aria-label={t("Schedule cadence filters")}>
      {options.map((option) => {
        const Icon = option.icon;
        const active = option.value === activeFilter;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(option.value)}
            className={`link-focus inline-flex items-center gap-2 rounded-[8px] border px-3 py-2 text-xs font-bold uppercase transition ${
              active
                ? "border-sky-200/45 bg-sky-300/15 text-white"
                : "border-slate-700 bg-white/[0.035] text-slate-400 hover:border-sky-200/30 hover:text-white"
            }`}
          >
            <Icon size={14} aria-hidden />
            {t(option.label)}
          </button>
        );
      })}
    </div>
  );
}

function ScheduleList({
  schedules,
  selectedId,
  onSelect,
  locale
}: {
  schedules: readonly PrivateSchedule[];
  selectedId: string;
  onSelect: (id: string) => void;
  locale: SiteLocale;
}) {
  const t = (value: string | undefined) => scheduleText(value, locale);

  return (
    <div className="grid gap-3">
      {schedules.map((schedule) => {
        const active = schedule.id === selectedId;

        return (
          <button
            key={schedule.id}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(schedule.id)}
            className={`link-focus grid gap-3 rounded-[8px] border p-4 text-left transition ${
              active
                ? "border-sky-300/55 bg-sky-300/14 shadow-[0_18px_50px_rgba(14,165,233,0.14)]"
                : "border-slate-700 bg-white/[0.045] hover:-translate-y-0.5 hover:border-sky-300/35 hover:bg-white/[0.07]"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">{t(schedule.name)}</p>
                <p className="mt-1 text-xs font-bold uppercase text-yellow-100">{t(schedule.owner)}</p>
              </div>
              <StatusBadge tone={schedule.tone}>{t(schedule.state)}</StatusBadge>
            </div>
            <div className="grid gap-2 text-xs text-slate-400 sm:grid-cols-3">
              <span>
                <strong className="text-slate-300">{t("Cadence")}:</strong> {t(schedule.cadence)}
              </span>
              <span>
                <strong className="text-slate-300">{t("Evidence")}:</strong> {evidenceSummary(schedule, locale)}
              </span>
              <span>
                <strong className="text-slate-300">{t("Window")}:</strong> {t(schedule.nextWindow)}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function RhythmWorkbench({
  schedules,
  selectedSchedule,
  postureChoice,
  activeFilter,
  filters,
  onPostureChoice,
  onFilterSelect,
  onScheduleSelect,
  locale
}: {
  schedules: readonly PrivateSchedule[];
  selectedSchedule: PrivateSchedule;
  postureChoice: string;
  activeFilter: string;
  filters: readonly FilterOption[];
  onPostureChoice: (choice: string) => void;
  onFilterSelect: (filter: string) => void;
  onScheduleSelect: (id: string) => void;
  locale: SiteLocale;
}) {
  const t = (value: string | undefined) => scheduleText(value, locale);

  return (
    <section className="panel p-5" aria-labelledby="schedule-workbench-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <Repeat2 size={22} aria-hidden />
            <h2 id="schedule-workbench-title" className="text-2xl font-semibold text-white">
              {t("Rhythm workbench")}
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            {t("Inspect one recurring loop at a time. The browser can show cadence, evidence, and owner gates, but it cannot create or mutate scheduler jobs.")}
          </p>
        </div>
        <StatusBadge tone="private">{t("No scheduler controls")}</StatusBadge>
      </div>

      <div className="mt-5">
        <ScheduleFilters options={filters} activeFilter={activeFilter} onSelect={onFilterSelect} locale={locale} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[20rem_minmax(0,1fr)] 2xl:grid-cols-[22rem_minmax(0,1fr)_24rem]">
        <aside className="rounded-[8px] border border-slate-700 bg-white/[0.035] p-4" aria-label={t("Schedules")}>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase text-slate-400">{t("Schedules")}</p>
            <span className="text-xs font-semibold text-slate-500">
              {schedules.length} {scheduleCountLabel(schedules.length, locale)}
            </span>
          </div>
          <div className="mt-4">
            {schedules.length > 0 ? (
              <ScheduleList schedules={schedules} selectedId={selectedSchedule.id} onSelect={onScheduleSelect} locale={locale} />
            ) : (
              <div className="rounded-[8px] border border-slate-700 bg-[#07111f]/70 p-4 text-sm leading-6 text-slate-300">
                {t("No schedules match this filter.")}
              </div>
            )}
          </div>
        </aside>

        <article className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-5" aria-labelledby="selected-schedule-title">
          <p className="sr-only" aria-live="polite">
            {locale === "zh" ? `选中日程：${t(selectedSchedule.name)}。${t(selectedSchedule.state)}。` : `Selected schedule: ${selectedSchedule.name}. ${selectedSchedule.state}.`}
          </p>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase text-yellow-100">{t("Selected schedule")}</p>
              <h3 id="selected-schedule-title" className="mt-2 text-2xl font-semibold text-white">
                {t(selectedSchedule.name)}
              </h3>
              <p className="mt-2 text-xs font-bold uppercase text-slate-400">
                {t(selectedSchedule.cadence)} - {t(selectedSchedule.owner)} - {t(selectedSchedule.nextWindow)}
              </p>
            </div>
            <StatusBadge tone={selectedSchedule.tone}>{t(selectedSchedule.state)}</StatusBadge>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <div className="rounded-[8px] border border-slate-700 bg-[#07111f]/58 p-4">
              <h4 className="text-xs font-bold uppercase text-slate-400">{t("Summary")}</h4>
              <p className="mt-2 text-sm leading-6 text-slate-300">{t(selectedSchedule.summary)}</p>
            </div>
            <div className="rounded-[8px] border border-slate-700 bg-[#07111f]/58 p-4">
              <h4 className="text-xs font-bold uppercase text-slate-400">{t("Purpose")}</h4>
              <p className="mt-2 text-sm leading-6 text-slate-300">{t(selectedSchedule.purpose)}</p>
            </div>
            <div className="rounded-[8px] border border-slate-700 bg-[#07111f]/58 p-4">
              <h4 className="text-xs font-bold uppercase text-slate-400">{t("Next action")}</h4>
              <p className="mt-2 text-sm leading-6 text-slate-300">{t(selectedSchedule.nextAction)}</p>
            </div>
          </div>

          <div className="mt-4 rounded-[8px] border border-slate-700 bg-[#07111f]/58 p-4">
            <div className="flex items-center gap-2 text-sky-100">
              <ShieldCheck size={17} aria-hidden />
              <h4 className="text-sm font-semibold">{t("Safety boundary")}</h4>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{t(selectedSchedule.safety)}</p>
          </div>

          <div className="mt-4 rounded-[8px] border border-slate-700 bg-[#07111f]/58 p-4">
            <div className="flex items-center gap-2 text-sky-100">
              <Waypoints size={17} aria-hidden />
              <h4 className="text-sm font-semibold">{t("Reading steps")}</h4>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {selectedSchedule.readingSteps.map((step, index) => (
                <div key={`${selectedSchedule.id}-${step.label}`} className="rounded-[8px] border border-slate-700 bg-white/[0.035] p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase text-slate-500">{String(index + 1).padStart(2, "0")}</span>
                    <StatusBadge tone={step.tone}>{t(step.state)}</StatusBadge>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-white">{t(step.label)}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{t(step.detail)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-[8px] border border-slate-700 bg-[#07111f]/58 p-4">
            <h4 className="text-sm font-semibold text-sky-100">{t("Evidence")}</h4>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {selectedSchedule.evidence.map((evidence) => (
                <div key={`${selectedSchedule.id}-${evidence.label}`} className="rounded-[8px] border border-slate-700 bg-white/[0.035] p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-white">{t(evidence.label)}</p>
                    <StatusBadge tone={evidence.tone}>{t(evidence.state)}</StatusBadge>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{t(evidence.detail)}</p>
                </div>
              ))}
            </div>
          </div>
        </article>

        <aside className="grid gap-4 xl:col-span-2 2xl:col-span-1">
          <ScheduleOperatingPlanner
            selectedSchedule={selectedSchedule}
            postureChoice={postureChoice}
            onPostureChoice={onPostureChoice}
            locale={locale}
          />

          <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <div className="flex items-center gap-2 text-sky-100">
              <Clock3 size={17} aria-hidden />
              <h4 className="text-sm font-semibold">{t("Window")}</h4>
            </div>
            <p className="mt-3 text-sm font-semibold text-white">{t(selectedSchedule.window.label)}</p>
            <p className="mt-1 text-xs font-bold uppercase text-slate-400">{t(selectedSchedule.window.time)}</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{t(selectedSchedule.window.detail)}</p>
            <h4 className="mt-4 text-xs font-bold uppercase text-slate-400">{t("Last run")}</h4>
            <p className="mt-1 text-sm text-slate-300">{t(selectedSchedule.lastRun)}</p>
          </div>

          <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-xs font-bold uppercase text-slate-400">{t("Dependencies")}</h4>
              <span className="text-sm font-semibold text-slate-300">{selectedSchedule.dependencies.length}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedSchedule.dependencies.map((dependency) => (
                <span key={`${selectedSchedule.id}-${dependency}`} className="rounded-[8px] border border-slate-700 bg-[#07111f]/70 px-2.5 py-1 text-xs text-slate-300">
                  {t(dependency)}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[8px] border border-red-300/35 bg-red-400/8 p-4">
            <div className="flex items-center gap-2 text-red-100">
              <XCircle size={17} aria-hidden />
              <h4 className="text-sm font-semibold">{t("No-go actions")}</h4>
            </div>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-300">
              {selectedSchedule.noGo.map((item) => (
                <li key={`${selectedSchedule.id}-${item}`} className="flex gap-2">
                  <LockKeyhole className="mt-1 shrink-0 text-red-100" size={15} aria-hidden />
                  <span>{t(item)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[8px] border border-blue-300/35 bg-blue-400/8 p-4">
            <h4 className="text-xs font-bold uppercase text-blue-100">{t("Owner gate")}</h4>
            <p className="mt-2 text-sm leading-6 text-slate-300">{t(selectedSchedule.ownerGate)}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function ScheduleOperatingPlanner({
  selectedSchedule,
  postureChoice,
  onPostureChoice,
  locale
}: {
  selectedSchedule: PrivateSchedule;
  postureChoice: string;
  onPostureChoice: (choice: string) => void;
  locale: SiteLocale;
}) {
  const selectedPosture =
    selectedSchedule.ownerPostures.find((posture) => posture.label === postureChoice) ?? selectedSchedule.ownerPostures[0];
  const t = (value: string | undefined) => scheduleText(value, locale);

  return (
    <section className="rounded-[8px] border border-sky-300/35 bg-sky-300/10 p-4" aria-labelledby="schedule-operating-planner-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <ShieldCheck size={17} aria-hidden />
            <h3 id="schedule-operating-planner-title" className="text-sm font-semibold">
              {t("Owner window plan")}
            </h3>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-400">
            {t("Pick a local reading posture for this schedule window. No schedule job, delivery, or runtime action is sent.")}
          </p>
        </div>
        <StatusBadge tone="private">{t("Local only")}</StatusBadge>
      </div>
      {selectedPosture ? (
        <p className="sr-only" aria-live="polite">
          {locale === "zh" ? `阅读姿态：${t(selectedPosture.label)}。${t(selectedPosture.next)}` : `Posture: ${selectedPosture.label}. ${selectedPosture.next}`}
        </p>
      ) : null}

      <div className="mt-4 grid gap-2">
        {selectedSchedule.ownerPostures.map((posture) => {
          const active = posture.label === selectedPosture?.label;

          return (
            <button
              key={postureChoiceKey(selectedSchedule.id, posture.label)}
              type="button"
              aria-pressed={active}
              onClick={() => onPostureChoice(posture.label)}
              className={`link-focus rounded-[8px] border p-3 text-left transition ${
                active
                  ? "border-sky-200/65 bg-sky-200/16 text-white"
                  : "border-slate-700 bg-[#07111f]/58 text-slate-300 hover:border-sky-200/35 hover:bg-white/[0.07]"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold">{t(posture.label)}</span>
                <StatusBadge tone={posture.tone}>{t(posture.state)}</StatusBadge>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">{t(posture.detail)}</p>
            </button>
          );
        })}
      </div>

      {selectedPosture ? (
        <div className="mt-4 rounded-[8px] border border-slate-700 bg-[#07111f]/70 p-3">
          <h4 className="text-xs font-bold uppercase text-slate-400">{t("If selected")}</h4>
          <p className="mt-2 text-sm leading-6 text-slate-300">{t(selectedPosture.next)}</p>
        </div>
      ) : null}

      <div className="mt-4">
        <h4 className="text-xs font-bold uppercase text-slate-400">{t("Safe outputs")}</h4>
        <div className="mt-3 grid gap-2">
          {selectedSchedule.safeOutputs.map((output) => (
            <div key={`${selectedSchedule.id}-${output.label}`} className="rounded-[8px] border border-slate-700 bg-[#07111f]/58 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                  <CheckCircle2 size={15} aria-hidden />
                  {t(output.label)}
                </span>
                <StatusBadge tone={output.tone}>{t(output.state)}</StatusBadge>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">{t(output.detail)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RhythmLanes({ lanes, locale }: { lanes: readonly RhythmLane[]; locale: SiteLocale }) {
  const t = (value: string | undefined) => scheduleText(value, locale);

  return (
    <section className="panel p-5" aria-labelledby="rhythm-lanes-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <Waypoints size={22} aria-hidden />
            <h2 id="rhythm-lanes-title" className="text-2xl font-semibold text-white">
              {t("Operating rhythm")}
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            {t("A compact map of when context should become readable and which agent owns the loop.")}
          </p>
        </div>
        <StatusBadge tone="private">{t("Owner visible")}</StatusBadge>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {lanes.map((lane, index) => (
          <article key={lane.label} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <span className="flex size-9 items-center justify-center rounded-[8px] border border-sky-200/35 bg-sky-200/16 text-xs font-semibold text-white" aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </span>
              <StatusBadge tone={lane.tone}>{t(lane.state)}</StatusBadge>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">{t(lane.label)}</h3>
            <p className="mt-1 text-xs font-bold uppercase text-yellow-100">{t(lane.time)}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{t(lane.detail)}</p>
            <p className="mt-4 rounded-[8px] border border-slate-700 bg-[#07111f]/70 p-3 text-xs leading-5 text-slate-400">
              {t("Owner")}: {t(lane.owner)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SchedulePolicyRail({ policy, locale }: { policy: readonly string[]; locale: SiteLocale }) {
  const t = (value: string | undefined) => scheduleText(value, locale);

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <section className="panel p-5" aria-labelledby="schedule-policy-title">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-yellow-100">
              <ShieldAlert size={22} aria-hidden />
              <h2 id="schedule-policy-title" className="text-2xl font-semibold text-white">
                {t("Scheduler boundary")}
              </h2>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              {t("This page can explain cadence and owner gates. It cannot create, pause, resume, delete, edit, or dispatch recurring jobs.")}
            </p>
          </div>
          <StatusBadge tone="private">{t("Read-only")}</StatusBadge>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {policy.map((rule) => (
            <div key={rule} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 text-sm leading-6 text-slate-300">
              {t(rule)}
            </div>
          ))}
        </div>
      </section>

      <aside className="panel p-5" aria-labelledby="schedule-unavailable-title">
        <div className="flex items-center gap-2 text-yellow-100">
          <BellRing size={20} aria-hidden />
          <h2 id="schedule-unavailable-title" className="text-2xl font-semibold text-white">
            {t("Unavailable")}
          </h2>
        </div>
        <div className="mt-5 grid gap-2">
          {unavailableControls.map((item) => (
            <div key={item} className="flex items-center justify-between gap-3 rounded-[8px] border border-slate-700 bg-white/[0.045] px-3 py-2 text-sm text-slate-300">
              <span>{t(item)}</span>
              <StatusBadge tone="private">{t("Unavailable")}</StatusBadge>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

function CommandBridge({ locale }: { locale: SiteLocale }) {
  const t = (value: string | undefined) => scheduleText(value, locale);

  return (
    <section className="panel p-5" aria-label={t("Schedules continuation paths")}>
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <Gauge size={22} aria-hidden />
            <h2 className="text-2xl font-semibold text-white">{t("Continue from schedules")}</h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            {t("Schedule review stays descriptive here. Use adjacent private surfaces to draft work or inspect system posture without exposing scheduler commands.")}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/app/command" className="link-focus group rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 transition hover:border-sky-200/35 hover:bg-sky-300/10">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-white">{t("Open Command")}</span>
              <ArrowRight className="text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-sky-100" size={16} aria-hidden />
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-400">{t("Draft schedule-related owner instructions after review.")}</p>
          </Link>
          <Link href={ownerSystemHref("command-runtime")} className="link-focus group rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 transition hover:border-sky-200/35 hover:bg-sky-300/10">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-white">{t("System Health")}</span>
              <ArrowRight className="text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-sky-100" size={16} aria-hidden />
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-400">{t("Inspect posture before trusting recurring loops.")}</p>
          </Link>
        </div>
      </div>
    </section>
  );
}

function EmptyScheduleRegister({ locale }: { locale: SiteLocale }) {
  const t = (value: string | undefined) => scheduleText(value, locale);

  return (
    <section className="panel p-6 md:p-7" aria-labelledby="schedule-empty-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <CalendarClock size={22} aria-hidden />
            <h2 id="schedule-empty-title" className="text-2xl font-semibold text-white">
              {t("Register empty")}
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            {t("No owner-visible recurring schedules are available in this private mock source. The page remains read-only and does not expose scheduler commands or mutation controls.")}
          </p>
        </div>
        <StatusBadge tone="private">{t("Owner-only")}</StatusBadge>
      </div>
    </section>
  );
}

export function OwnerSchedulesSurface({ data, initialScheduleId }: { data: SchedulesData; initialScheduleId?: string }) {
  const { locale } = useLanguage();
  const filters = useMemo(() => filterOptions(data.schedules), [data.schedules]);
  const [activeFilter, setActiveFilter] = useState("All");
  const initialSelectedScheduleId =
    initialScheduleId && data.schedules.some((schedule) => schedule.id === initialScheduleId)
      ? initialScheduleId
      : data.schedules[0]?.id ?? "";
  const [selectedScheduleId, setSelectedScheduleId] = useState(initialSelectedScheduleId);
  const [postureChoices, setPostureChoices] = useState<Record<string, string>>({});

  const visibleSchedules = useMemo(() => {
    if (activeFilter === "All") {
      return data.schedules;
    }

    return data.schedules.filter((schedule) => schedule.cadence === activeFilter);
  }, [activeFilter, data.schedules]);

  const selectedSchedule = data.schedules.find((schedule) => schedule.id === selectedScheduleId) ?? visibleSchedules[0] ?? data.schedules[0];

  function selectSchedule(scheduleId: string, mode: ScheduleRouteMode = "push") {
    setSelectedScheduleId(scheduleId);

    if (typeof window === "undefined") {
      return;
    }

    const nextUrl = scheduleRouteUrl(scheduleId);

    if (nextUrl !== currentScheduleUrl()) {
      window.history[mode === "push" ? "pushState" : "replaceState"](null, "", nextUrl);
    }
  }

  useEffect(() => {
    function syncFromLocation() {
      const scheduleId = scheduleIdFromSearch(window.location.search, data.schedules) ?? data.schedules[0]?.id;

      if (scheduleId) {
        setSelectedScheduleId((current) => (current === scheduleId ? current : scheduleId));
      }
    }

    syncFromLocation();
    window.addEventListener("popstate", syncFromLocation);
    return () => window.removeEventListener("popstate", syncFromLocation);
  }, [data.schedules]);

  if (!selectedSchedule) {
    return (
      <div className="grid gap-5" data-i18n-skip>
        <p className="sr-only">{scheduleText("Private schedules rhythm register", locale)}</p>
        <EmptyScheduleRegister locale={locale} />
      </div>
    );
  }

  function handleFilterSelect(filter: string) {
    setActiveFilter(filter);
    const nextVisible = filter === "All" ? data.schedules : data.schedules.filter((schedule) => schedule.cadence === filter);
    const selectedStillVisible = nextVisible.some((schedule) => schedule.id === selectedScheduleId);
    if (!selectedStillVisible && nextVisible[0]) {
      selectSchedule(nextVisible[0].id, "replace");
    }
  }

  const postureChoice = postureChoices[selectedSchedule.id] ?? selectedSchedule.ownerPostures[0]?.label ?? "";

  function handlePostureChoice(choice: string) {
    setPostureChoices((current) => ({
      ...current,
      [selectedSchedule.id]: choice
    }));
  }

  return (
    <div className="grid gap-5" data-i18n-skip>
      <p className="sr-only">{scheduleText("Private schedules rhythm register", locale)}</p>
      <SchedulesHero data={data} selectedSchedule={selectedSchedule} locale={locale} />
      <RhythmWorkbench
        schedules={visibleSchedules}
        selectedSchedule={selectedSchedule}
        postureChoice={postureChoice}
        activeFilter={activeFilter}
        filters={filters}
        onPostureChoice={handlePostureChoice}
        onFilterSelect={handleFilterSelect}
        onScheduleSelect={selectSchedule}
        locale={locale}
      />
      <RhythmLanes lanes={data.rhythmLanes} locale={locale} />
      <SchedulePolicyRail policy={data.policy} locale={locale} />
      <CommandBridge locale={locale} />
    </div>
  );
}
