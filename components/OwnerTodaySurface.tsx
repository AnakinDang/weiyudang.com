"use client";

import { useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Bot,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Flag,
  GitBranch,
  LayoutDashboard,
  LineChart,
  LockKeyhole,
  MonitorCheck,
  Radio,
  ShieldCheck,
  Sparkles,
  UserCheck
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { StatusBadge } from "@/components/StatusBadge";
import { translateToZh, type SiteLocale } from "@/lib/site-i18n";

type Tone = "normal" | "info" | "warning" | "private";

type TodayBrief = {
  focus: string;
  posture: string;
  nextReview: string;
  freshness: string;
};

type TodayPriority = {
  lane: string;
  title: string;
  owner: string;
  state: string;
  tone: Tone;
  summary: string;
  nextStep: string;
  freshness: string;
};

type OperatingSurface = {
  title: string;
  href: string;
  state: string;
  tone: Tone;
  current: boolean;
  summary: string;
  evidence: string;
};

type ReviewItem = {
  title: string;
  agent: string;
  urgency: string;
  state: string;
  tone: Tone;
  decision: string;
  evidence: string;
  href: string;
  hrefLabel: string;
  contextHref: string;
  contextLabel: string;
};

type MarketAlert = {
  label: string;
  value: string;
  detail: string;
};

type SchedulePressure = {
  label: string;
  time: string;
  state: string;
  tone: Tone;
};

type SystemHealth = {
  label: string;
  value: string;
  tone: Tone;
};

type CommandShortcut = {
  title: string;
  href: string;
  summary: string;
};

type DecisionHubItem = {
  title: string;
  href: string;
  state: string;
  tone: Tone;
  summary: string;
  proof: string;
};

type LocalizedDateLabel = {
  en: string;
  zh: string;
};

const fixedTradingDisclaimer = "Research-only. Not an order, recommendation, or execution system.";

export type OwnerTodaySurfaceData = {
  dateLabel: LocalizedDateLabel;
  brief: TodayBrief;
  priorities: readonly TodayPriority[];
  operatingMap: readonly OperatingSurface[];
  reviewQueue: readonly ReviewItem[];
  decisionHub: readonly DecisionHubItem[];
  marketAlerts: readonly MarketAlert[];
  schedulePressure: readonly SchedulePressure[];
  systemHealth: readonly SystemHealth[];
  commandShortcuts: readonly CommandShortcut[];
};

function todayText(value: string | undefined, locale: SiteLocale) {
  if (!value) return "";
  if (value === fixedTradingDisclaimer) return value;
  return locale === "zh" ? translateToZh(value) ?? value : value;
}

function todayDateLabel(value: LocalizedDateLabel, locale: SiteLocale) {
  return locale === "zh" ? value.zh : value.en;
}

function todayDateLine(value: LocalizedDateLabel, locale: SiteLocale) {
  if (locale === "zh") {
    return `今日 · ${todayDateLabel(value, locale)} · 上海时间`;
  }

  return `Today - ${todayDateLabel(value, locale)} - Asia/Shanghai`;
}

function checkpointCountLabel(count: number, locale: SiteLocale) {
  return locale === "zh" ? `${count} 个检查点` : `${count} checkpoints`;
}

function reviewMetaLabel(urgency: string, agent: string, locale: SiteLocale) {
  const urgencyLabel = todayText(urgency, locale);
  const agentLabel = todayText(agent, locale);

  return locale === "zh" ? `${urgencyLabel} · ${agentLabel}` : `${urgencyLabel} - ${agentLabel}`;
}

const safetyRails = [
  "Authenticated owner route only.",
  "Read-only UI until command APIs have audit gates.",
  fixedTradingDisclaimer,
  "Public publishing requires explicit review."
] as const;

const ownerLoop = [
  {
    label: "Sense",
    detail: "Doraemon watches priorities, schedules, research posture, and system health.",
    state: "Live review",
    tone: "info",
    icon: Radio
  },
  {
    label: "Review",
    detail: "Owner checkpoints stay visible before private work becomes action.",
    state: "Owner-gated",
    tone: "private",
    icon: UserCheck
  },
  {
    label: "Prepare",
    detail: "MiniDoras prepare evidence and next steps without hidden execution.",
    state: "Read-only",
    tone: "private",
    icon: Bot
  }
] as const;

const metricToneClasses = [
  "border-sky-200/25 bg-sky-300/10 text-sky-100",
  "border-yellow-200/30 bg-yellow-300/10 text-yellow-100",
  "border-emerald-200/25 bg-emerald-300/10 text-emerald-100",
  "border-violet-200/25 bg-violet-300/10 text-violet-100"
] as const;

const surfaceIcons = [MonitorCheck, LayoutDashboard, LineChart, ClipboardCheck] as const;
const decisionHubIcons = [ClipboardCheck, LineChart, Bot, MonitorCheck] as const;
const scheduleIcons = [CalendarClock, LineChart, MonitorCheck, Clock3] as const;

function TodayPill({
  children,
  tone = "info",
  icon: Icon
}: {
  children: React.ReactNode;
  tone?: Tone;
  icon?: LucideIcon;
}) {
  const toneClass = {
    normal: "border-emerald-200/25 bg-emerald-300/10 text-emerald-100",
    info: "border-sky-200/25 bg-sky-300/10 text-sky-100",
    warning: "border-yellow-200/30 bg-yellow-300/10 text-yellow-100",
    private: "border-violet-200/25 bg-violet-300/10 text-violet-100"
  }[tone];

  return (
    <span className={`inline-flex items-center gap-2 rounded-[8px] border px-3 py-1.5 text-xs font-bold uppercase ${toneClass}`}>
      {Icon ? <Icon size={14} aria-hidden /> : null}
      {children}
    </span>
  );
}

function MetricCell({
  label,
  value,
  detail,
  icon: Icon,
  toneClass,
  locale
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  toneClass: string;
  locale: SiteLocale;
}) {
  return (
    <article className={`rounded-[8px] border p-4 ${toneClass}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-bold uppercase text-current">{todayText(label, locale)}</p>
        <Icon size={18} aria-hidden />
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <p className="text-xs leading-5 text-slate-200/85">{todayText(detail, locale)}</p>
        <strong className="text-3xl font-semibold leading-none text-white">{value}</strong>
      </div>
    </article>
  );
}

function TodayRadar({
  data,
  pendingApprovals,
  highPressureWindows,
  locale
}: {
  data: OwnerTodaySurfaceData;
  pendingApprovals: number;
  highPressureWindows: number;
  locale: SiteLocale;
}) {
  const radarNodes = [
    { label: "Priorities", value: data.priorities.length.toString(), className: "left-[8%] top-[36%]" },
    { label: "Approvals", value: pendingApprovals.toString(), className: "right-[10%] top-[28%]" },
    { label: "Schedule", value: highPressureWindows.toString(), className: "bottom-[12%] left-[16%]" },
    { label: "Systems", value: data.systemHealth.length.toString(), className: "bottom-[18%] right-[14%]" }
  ] as const;

  return (
    <div className="relative min-h-[23rem] overflow-hidden rounded-[8px] border border-slate-700 bg-[#07111f]/76 p-5 shadow-[0_24px_90px_rgba(14,165,233,0.10)] backdrop-blur">
      <div className="pointer-events-none absolute inset-x-8 top-8 h-52 rounded-full bg-sky-500/14 blur-3xl" aria-hidden />
      <div className="absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-200/10" aria-hidden />
      <div className="absolute left-1/2 top-1/2 size-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-200/15" aria-hidden />
      <div className="absolute left-1/2 top-1/2 size-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow-200/20" aria-hidden />
      <div className="absolute left-1/2 top-1/2 h-px w-64 -translate-x-1/2 bg-sky-200/10" aria-hidden />
      <div className="absolute left-1/2 top-1/2 h-64 w-px -translate-y-1/2 bg-sky-200/10" aria-hidden />

      <div className="absolute left-1/2 top-1/2 grid size-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[8px] border border-sky-200/25 bg-sky-300/10 text-center shadow-[0_18px_60px_rgba(14,165,233,0.18)]">
        <Sparkles className="text-yellow-100" size={28} aria-hidden />
        <span className="mt-1 block text-xs font-bold uppercase text-sky-100">{todayText("Owner Today", locale)}</span>
      </div>

      {radarNodes.map((node) => (
        <div
          key={node.label}
          className={`absolute ${node.className} w-28 rounded-[8px] border border-slate-700 bg-black/20 p-3 text-center shadow-[0_16px_48px_rgba(2,6,23,0.24)]`}
        >
          <strong className="block text-2xl font-semibold text-white">{node.value}</strong>
          <span className="mt-1 block text-xs font-bold uppercase text-slate-400">{todayText(node.label, locale)}</span>
        </div>
      ))}

      <div className="absolute bottom-5 left-5 right-5 rounded-[8px] border border-slate-700 bg-white/[0.045] p-3">
        <p className="text-xs font-bold uppercase text-slate-400">{todayText("Current focus", locale)}</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-white">{todayText(data.brief.focus, locale)}</p>
      </div>
    </div>
  );
}

function TodayHero({
  data,
  pendingApprovals,
  highPressureWindows,
  locale
}: {
  data: OwnerTodaySurfaceData;
  pendingApprovals: number;
  highPressureWindows: number;
  locale: SiteLocale;
}) {
  const metrics = [
    {
      label: "Priority lanes",
      value: data.priorities.length.toString(),
      detail: "Active owner-visible work streams",
      icon: Flag
    },
    {
      label: "Waiting approvals",
      value: pendingApprovals.toString(),
      detail: `Owner checkpoints of ${data.reviewQueue.length}`,
      icon: UserCheck
    },
    {
      label: "Schedule pressure",
      value: highPressureWindows.toString(),
      detail: `High-pressure windows of ${data.schedulePressure.length}`,
      icon: CalendarClock
    },
    {
      label: "Boundary locks",
      value: safetyRails.length.toString(),
      detail: "No hidden execution paths",
      icon: LockKeyhole
    }
  ] as const;

  return (
    <section className="panel relative isolate overflow-hidden p-0" aria-labelledby="owner-today-title">
      <div
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-2/3 bg-[radial-gradient(circle_at_66%_18%,rgba(56,189,248,0.22),transparent_34%),radial-gradient(circle_at_82%_72%,rgba(250,204,21,0.13),transparent_30%),linear-gradient(135deg,transparent,rgba(59,130,246,0.10))]"
        aria-hidden
      />
      <div className="grid min-h-[33rem] gap-0 xl:grid-cols-[minmax(0,1fr)_27rem] 2xl:grid-cols-[minmax(0,1fr)_32rem]">
        <div className="relative overflow-hidden p-6 md:p-8">
          <div className="pointer-events-none absolute -left-28 top-10 size-96 rounded-full bg-sky-500/14 blur-3xl" aria-hidden />
          <div
            className="pointer-events-none absolute bottom-0 right-0 h-56 w-[46rem] rounded-tl-full border border-sky-200/10 bg-[radial-gradient(circle_at_65%_100%,rgba(250,204,21,0.12),rgba(56,189,248,0.10)_42%,transparent_70%)]"
            aria-hidden
          />

          <div className="relative inline-flex items-center gap-2 rounded-[8px] border border-sky-200/25 bg-sky-300/10 px-3 py-2 text-xs font-bold uppercase text-sky-100">
            <LayoutDashboard size={14} aria-hidden />
            {todayText("Owner Today", locale)}
          </div>

          <div className="relative mt-4 flex flex-wrap items-center gap-2">
            <TodayPill tone="private" icon={LockKeyhole}>
              {todayText("Owner-only", locale)}
            </TodayPill>
            <TodayPill tone="normal" icon={MonitorCheck}>
              {todayText("Read-only cockpit", locale)}
            </TodayPill>
            <TodayPill tone="warning" icon={LineChart}>
              {todayText("Research-only trading", locale)}
            </TodayPill>
          </div>

          <div className="relative mt-10 max-w-4xl">
            <p className="eyebrow">{todayDateLine(data.dateLabel, locale)}</p>
            <h2 id="owner-today-title" className="mt-2 max-w-4xl text-3xl font-semibold leading-[1.04] text-white md:text-5xl">
              {todayText("Owner Cockpit", locale)}
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
              {todayText(
                "The private command surface for priorities, approvals, research posture, schedule pressure, and system health. Doraemon prepares the work; you keep the decision boundary.",
                locale
              )}
            </p>
          </div>

          <div className="relative mt-7 grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
            {metrics.map((metric, index) => (
              <MetricCell
                key={metric.label}
                {...metric}
                toneClass={metricToneClasses[index % metricToneClasses.length]}
                locale={locale}
              />
            ))}
          </div>
        </div>

        <aside className="relative border-t border-slate-700/70 bg-[#07111f]/45 p-5 md:p-6 xl:border-l xl:border-t-0">
          <TodayRadar
            data={data}
            pendingApprovals={pendingApprovals}
            highPressureWindows={highPressureWindows}
            locale={locale}
          />
          <dl className="mt-4 grid gap-3 rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 text-sm">
            <div className="flex items-start justify-between gap-4">
              <dt className="text-xs font-bold uppercase text-slate-400">{todayText("Private status", locale)}</dt>
              <dd className="max-w-[14rem] text-right font-semibold text-white">{todayText(data.brief.posture, locale)}</dd>
            </div>
            <div className="flex items-start justify-between gap-4 border-t border-slate-700 pt-3">
              <dt className="text-xs font-bold uppercase text-slate-400">{todayText("Next review", locale)}</dt>
              <dd className="text-right font-semibold text-white">{todayText(data.brief.nextReview, locale)}</dd>
            </div>
            <div className="flex items-start justify-between gap-4 border-t border-slate-700 pt-3">
              <dt className="text-xs font-bold uppercase text-slate-400">{todayText("Freshness", locale)}</dt>
              <dd className="text-right font-semibold text-white">{todayText(data.brief.freshness, locale)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}

function LoopPanel({ locale }: { locale: SiteLocale }) {
  return (
    <section className="panel relative overflow-hidden p-5 md:p-6" aria-labelledby="today-loop-title">
      <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-sky-500/12 blur-3xl" aria-hidden />
      <div className="relative flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{todayText("Daily brief", locale)}</p>
          <h2 id="today-loop-title" className="mt-2 text-2xl font-semibold text-white">
            {todayText("What needs attention today.", locale)}
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/app/command"
            className="link-focus inline-flex items-center gap-2 rounded-[8px] bg-sky-300 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_44px_rgba(14,165,233,0.2)] transition hover:bg-sky-200"
          >
            {todayText("Open Command", locale)}
            <ArrowRight size={16} aria-hidden />
          </Link>
          <Link
            href="/app/review"
            className="link-focus inline-flex items-center gap-2 rounded-[8px] border border-slate-700 bg-white/[0.045] px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-200/35 hover:text-white"
          >
            {todayText("Review Queue", locale)}
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </div>
      <div className="relative mt-5 grid gap-3">
        {ownerLoop.map((step, index) => {
          const Icon = step.icon;

          return (
            <article key={step.label} className="grid grid-cols-[2.75rem_1fr] gap-3 rounded-[8px] border border-slate-700 bg-white/[0.045] p-3">
              <span className="flex size-10 items-center justify-center rounded-[8px] border border-sky-200/25 bg-sky-300/10 text-sky-100">
                <Icon size={18} aria-hidden />
              </span>
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-white">
                    {index + 1}. {todayText(step.label, locale)}
                  </h3>
                  <StatusBadge tone={step.tone}>{todayText(step.state, locale)}</StatusBadge>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-400">{todayText(step.detail, locale)}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function PriorityLane({ priority, index, locale }: { priority: TodayPriority; index: number; locale: SiteLocale }) {
  return (
    <article className="grid gap-4 rounded-[8px] border border-slate-700 bg-[#07111f]/74 p-4 shadow-[0_18px_60px_rgba(2,6,23,0.18)] sm:grid-cols-[3.25rem_minmax(0,1fr)_auto] sm:items-start">
      <span className="flex size-11 items-center justify-center rounded-[8px] border border-sky-200/25 bg-sky-300/10 text-sm font-semibold text-sky-100">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-bold uppercase text-yellow-100">{todayText(priority.lane, locale)}</p>
          <StatusBadge tone={priority.tone}>{todayText(priority.state, locale)}</StatusBadge>
        </div>
        <h3 className="mt-2 text-base font-semibold text-white">{todayText(priority.title, locale)}</h3>
        <p className="mt-2 text-xs font-bold uppercase text-sky-100">{todayText(priority.owner, locale)}</p>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{todayText(priority.summary, locale)}</p>
        <div className="mt-4 rounded-[8px] border border-slate-700 bg-white/[0.045] p-3">
          <p className="text-xs font-bold uppercase text-slate-400">{todayText("Next step", locale)}</p>
          <p className="mt-1 text-sm leading-6 text-slate-200">{todayText(priority.nextStep, locale)}</p>
        </div>
      </div>
      <div className="inline-flex w-fit items-center gap-2 rounded-[8px] border border-slate-700 bg-black/20 px-3 py-2 text-xs font-semibold uppercase text-slate-300 sm:justify-self-end">
        <Clock3 size={14} aria-hidden />
        {todayText(priority.freshness, locale)}
      </div>
    </article>
  );
}

function PriorityPanel({ priorities, locale }: { priorities: readonly TodayPriority[]; locale: SiteLocale }) {
  return (
    <section className="panel p-5 md:p-6" aria-labelledby="today-priorities-title">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">{todayText("Priority lanes", locale)}</p>
          <h2 id="today-priorities-title" className="mt-2 text-2xl font-semibold text-white">
            {todayText("What Doraemon is keeping in view.", locale)}
          </h2>
        </div>
        <Link href="/app/agents" className="link-focus inline-flex items-center gap-2 text-sm font-semibold text-sky-100 transition hover:text-white">
          {todayText("See agents", locale)}
          <ArrowRight size={15} aria-hidden />
        </Link>
      </div>
      <div className="mt-5 grid gap-3">
        {priorities.map((priority, index) => (
          <PriorityLane key={priority.title} priority={priority} index={index} locale={locale} />
        ))}
      </div>
    </section>
  );
}

function DecisionHubPanel({ items, locale }: { items: readonly DecisionHubItem[]; locale: SiteLocale }) {
  return (
    <section className="panel p-5 md:p-6" aria-labelledby="today-decision-hub-title">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">{todayText("Decision hub", locale)}</p>
          <h2 id="today-decision-hub-title" className="mt-2 text-2xl font-semibold text-white">
            {todayText("Open the right private context.", locale)}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            {todayText(
              "Today links decisions to their owner-only surfaces. These are routing shortcuts only; they do not approve, publish, dispatch, or execute work.",
              locale
            )}
          </p>
        </div>
        <TodayPill tone="private" icon={LockKeyhole}>
          {todayText("Read-only routing", locale)}
        </TodayPill>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {items.map((item, index) => {
          const Icon = decisionHubIcons[index % decisionHubIcons.length];

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className="link-focus group rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 transition hover:-translate-y-0.5 hover:border-sky-200/35 hover:bg-sky-300/10"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] border border-sky-200/25 bg-sky-300/10 text-sky-100">
                    <Icon size={18} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-white">{todayText(item.title, locale)}</h3>
                  </div>
                </div>
                <StatusBadge tone={item.tone}>{todayText(item.state, locale)}</StatusBadge>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{todayText(item.summary, locale)}</p>
              <p className="mt-4 rounded-[8px] border border-slate-700 bg-black/20 p-3 text-xs leading-5 text-slate-400">
                {todayText(item.proof, locale)}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-100 transition group-hover:text-white">
                {todayText("Open context", locale)}
                <ArrowRight size={15} aria-hidden />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function OwnerHandoffRunwayPanel({ reviewQueue, locale }: { reviewQueue: readonly ReviewItem[]; locale: SiteLocale }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const safeSelectedIndex = reviewQueue[selectedIndex] ? selectedIndex : 0;
  const selectedItem = reviewQueue[safeSelectedIndex];

  if (!selectedItem) {
    return (
      <section className="panel p-5 md:p-6" aria-labelledby="today-handoff-runway-title">
        <p className="eyebrow">{todayText("Owner decision runway", locale)}</p>
        <h2 id="today-handoff-runway-title" className="mt-2 text-2xl font-semibold text-white">
          {todayText("No checkpoint is waiting on this private source.", locale)}
        </h2>
      </section>
    );
  }

  return (
    <section className="panel relative overflow-hidden p-5 md:p-6" aria-labelledby="today-handoff-runway-title">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_75%_18%,rgba(250,204,21,0.14),transparent_34%),radial-gradient(circle_at_82%_82%,rgba(14,165,233,0.13),transparent_36%)]" aria-hidden />
      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{todayText("Owner decision runway", locale)}</p>
          <h2 id="today-handoff-runway-title" className="mt-2 text-2xl font-semibold text-white">
            {todayText("Pick the next safe handoff.", locale)}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            {todayText(
              "Select a checkpoint to see the decision, evidence, and private context before opening the next surface.",
              locale
            )}
          </p>
        </div>
        <TodayPill tone="private" icon={ShieldCheck}>
          {todayText("Stay read-only", locale)}
        </TodayPill>
      </div>

      <div className="relative mt-5 grid gap-4 xl:grid-cols-[minmax(17rem,0.58fr)_minmax(0,1fr)]">
        <div className="grid content-start gap-2" aria-label={todayText("Selected checkpoint", locale)}>
          {reviewQueue.map((item, index) => {
            const isSelected = index === safeSelectedIndex;

            return (
              <button
                key={`${item.title}-${index}`}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedIndex(index)}
                className={`link-focus grid gap-2 rounded-[8px] border p-3 text-left transition ${
                  isSelected
                    ? "border-sky-200/40 bg-sky-300/12 text-white shadow-[0_18px_52px_rgba(14,165,233,0.12)]"
                    : "border-slate-700 bg-white/[0.045] text-slate-300 hover:border-sky-200/30 hover:bg-sky-300/10 hover:text-white"
                }`}
              >
                <span className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase text-sky-100">{todayText(item.urgency, locale)}</span>
                  <StatusBadge tone={item.tone}>{todayText(item.state, locale)}</StatusBadge>
                </span>
                <strong className="text-sm font-semibold leading-5">{todayText(item.title, locale)}</strong>
                <span className="text-xs leading-5 text-slate-400">{todayText(item.agent, locale)}</span>
              </button>
            );
          })}
        </div>

        <article className="rounded-[8px] border border-slate-700 bg-[#07111f]/70 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase text-slate-400">{todayText("Selected checkpoint", locale)}</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{todayText(selectedItem.title, locale)}</h3>
            </div>
            <StatusBadge tone={selectedItem.tone}>{todayText(selectedItem.state, locale)}</StatusBadge>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-[8px] border border-slate-700 bg-black/20 p-3">
              <p className="text-xs font-bold uppercase text-slate-400">{todayText("Decision request", locale)}</p>
              <p className="mt-2 text-sm leading-6 text-slate-200">{todayText(selectedItem.decision, locale)}</p>
            </div>
            <div className="rounded-[8px] border border-slate-700 bg-black/20 p-3">
              <p className="text-xs font-bold uppercase text-slate-400">{todayText("Evidence packet", locale)}</p>
              <p className="mt-2 text-sm leading-6 text-slate-200">{todayText(selectedItem.evidence, locale)}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 rounded-[8px] border border-yellow-200/20 bg-yellow-300/10 p-3 2xl:grid-cols-[1fr_auto] 2xl:items-center">
            <p className="text-sm leading-6 text-yellow-50">
              {todayText("No approve, publish, dispatch, or execute action appears here.", locale)}
            </p>
            <div className="flex flex-wrap gap-2 2xl:justify-end">
              <Link
                href={selectedItem.href}
                prefetch={false}
                className="link-focus inline-flex items-center gap-2 rounded-[8px] bg-sky-300 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-sky-200"
              >
                {todayText(selectedItem.hrefLabel, locale)}
                <ArrowRight size={14} aria-hidden />
              </Link>
              <Link
                href={selectedItem.contextHref}
                prefetch={false}
                className="link-focus inline-flex items-center gap-2 rounded-[8px] border border-slate-700 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-sky-200/35 hover:text-white"
              >
                {todayText(selectedItem.contextLabel, locale)}
                <ArrowRight size={14} aria-hidden />
              </Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function ReviewQueueRail({ reviewQueue, locale }: { reviewQueue: readonly ReviewItem[]; locale: SiteLocale }) {
  return (
    <section className="panel p-5" aria-labelledby="today-review-title">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">{todayText("Waiting approvals", locale)}</p>
          <h2 id="today-review-title" className="mt-2 text-2xl font-semibold text-white">
            {checkpointCountLabel(reviewQueue.length, locale)}
          </h2>
        </div>
        <UserCheck className="text-sky-100" size={24} aria-hidden />
      </div>
      <div className="mt-5 grid gap-3">
        {reviewQueue.map((item) => (
          <article key={item.title} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-white">{todayText(item.title, locale)}</h3>
              <StatusBadge tone={item.tone}>{todayText(item.state, locale)}</StatusBadge>
            </div>
            <p className="mt-2 text-xs font-bold uppercase text-slate-400">
              {reviewMetaLabel(item.urgency, item.agent, locale)}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{todayText(item.decision, locale)}</p>
            <p className="mt-3 rounded-[8px] border border-slate-700 bg-black/20 p-3 text-xs leading-5 text-slate-400">
              {todayText(item.evidence, locale)}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={item.href}
                prefetch={false}
                className="link-focus inline-flex items-center gap-2 rounded-[8px] border border-sky-200/25 bg-sky-300/10 px-3 py-2 text-xs font-semibold text-sky-100 transition hover:border-sky-200/45 hover:text-white"
              >
                {todayText(item.hrefLabel, locale)}
                <ArrowRight size={14} aria-hidden />
              </Link>
              <Link
                href={item.contextHref}
                prefetch={false}
                className="link-focus inline-flex items-center gap-2 rounded-[8px] border border-slate-700 bg-white/[0.045] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-sky-200/30 hover:text-white"
              >
                {todayText(item.contextLabel, locale)}
                <ArrowRight size={14} aria-hidden />
              </Link>
            </div>
          </article>
        ))}
      </div>
      <Link href="/app/review" className="link-focus mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-100 transition hover:text-white">
        {todayText("Open review queue", locale)}
        <ArrowRight size={15} aria-hidden />
      </Link>
    </section>
  );
}

function SystemHealthRail({ systemHealth, locale }: { systemHealth: readonly SystemHealth[]; locale: SiteLocale }) {
  return (
    <section className="panel p-5" aria-labelledby="today-system-title">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="eyebrow">{todayText("System health", locale)}</p>
          <h2 id="today-system-title" className="mt-2 text-xl font-semibold text-white">
            {todayText("Operational guardrails.", locale)}
          </h2>
        </div>
        <ShieldCheck className="text-sky-100" size={24} aria-hidden />
      </div>
      <div className="mt-4 grid gap-3">
        {systemHealth.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-3 rounded-[8px] border border-slate-700 bg-white/[0.045] px-3 py-3">
            <span className="text-sm text-slate-300">{todayText(item.label, locale)}</span>
            <StatusBadge tone={item.tone}>{todayText(item.value, locale)}</StatusBadge>
          </div>
        ))}
      </div>
    </section>
  );
}

function SurfaceLink({ surface, index, locale }: { surface: OperatingSurface; index: number; locale: SiteLocale }) {
  const Icon = surfaceIcons[index % surfaceIcons.length];
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] border border-sky-200/25 bg-sky-300/10 text-sky-100">
            <Icon size={18} aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase text-slate-400">{todayText(surface.current ? "Current" : "Surface", locale)}</p>
            <h3 className="mt-1 text-base font-semibold text-white">{todayText(surface.title, locale)}</h3>
          </div>
        </div>
        <StatusBadge tone={surface.tone}>{todayText(surface.state, locale)}</StatusBadge>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">{todayText(surface.summary, locale)}</p>
      <p className="mt-4 rounded-[8px] border border-slate-700 bg-black/20 p-3 text-xs leading-5 text-slate-400">
        {todayText(surface.evidence, locale)}
      </p>
    </>
  );

  if (surface.current) {
    return (
      <article aria-current="page" className="rounded-[8px] border border-sky-200/30 bg-sky-300/10 p-4">
        {content}
      </article>
    );
  }

  return (
    <Link
      href={surface.href}
      className="link-focus group rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 transition hover:-translate-y-0.5 hover:border-sky-200/35 hover:bg-sky-300/10"
    >
      {content}
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-100 transition group-hover:text-white">
        {todayText("Open", locale)}
        <ArrowRight size={15} aria-hidden />
      </span>
    </Link>
  );
}

function OperatingMapPanel({ operatingMap, locale }: { operatingMap: readonly OperatingSurface[]; locale: SiteLocale }) {
  return (
    <section className="grid gap-5 xl:grid-cols-[22rem_minmax(0,1fr)]" aria-labelledby="today-operating-map-title">
      <div className="panel p-5 md:p-6">
        <div className="flex size-11 items-center justify-center rounded-[8px] border border-sky-200/25 bg-sky-300/10 text-sky-100">
          <GitBranch size={22} aria-hidden />
        </div>
        <p className="eyebrow mt-5">{todayText("Operating map", locale)}</p>
        <h2 id="today-operating-map-title" className="mt-2 text-2xl font-semibold text-white">
          {todayText("Public, private, research, review.", locale)}
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          {todayText(
            "Today links the Personal OS surfaces without blurring their boundary. Public pages stay sanitized; owner routes stay authenticated; research stays non-executing.",
            locale
          )}
        </p>
      </div>
      <div className="grid gap-3 rounded-[8px] border border-slate-700 bg-[#07111f]/64 p-4 md:grid-cols-2 md:p-5">
        {operatingMap.map((surface, index) => (
          <SurfaceLink key={surface.title} surface={surface} index={index} locale={locale} />
        ))}
      </div>
    </section>
  );
}

function ResearchPressurePanel({
  marketAlerts,
  schedulePressure,
  commandShortcuts,
  locale
}: {
  marketAlerts: readonly MarketAlert[];
  schedulePressure: readonly SchedulePressure[];
  commandShortcuts: readonly CommandShortcut[];
  locale: SiteLocale;
}) {
  return (
    <section className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,0.85fr)_minmax(0,0.8fr)]">
      <article className="panel p-5" aria-labelledby="today-market-research-title">
        <LineChart className="text-sky-100" size={24} aria-hidden />
        <p className="eyebrow mt-4">{todayText("Market research", locale)}</p>
        <h2 id="today-market-research-title" className="mt-2 text-xl font-semibold text-white">
          {todayText("Evidence before conviction.", locale)}
        </h2>
        <div className="mt-4 grid gap-3">
          {marketAlerts.map((alert) => (
            <div key={alert.label} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-white">{todayText(alert.label, locale)}</h3>
                <span className="text-xs font-bold uppercase text-sky-100">{todayText(alert.value, locale)}</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">{todayText(alert.detail, locale)}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="panel p-5" aria-labelledby="today-schedule-pressure-title">
        <CalendarClock className="text-sky-100" size={24} aria-hidden />
        <p className="eyebrow mt-4">{todayText("Schedule pressure", locale)}</p>
        <h2 id="today-schedule-pressure-title" className="mt-2 text-xl font-semibold text-white">
          {todayText("When attention comes due.", locale)}
        </h2>
        <div className="mt-4 grid gap-3">
          {schedulePressure.map((item, index) => {
            const Icon = scheduleIcons[index % scheduleIcons.length];

            return (
              <div key={item.label} className="grid grid-cols-[1fr_auto] gap-3 rounded-[8px] border border-slate-700 bg-white/[0.045] p-3">
                <div className="flex gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-[8px] border border-sky-200/25 bg-sky-300/10 text-sky-100">
                    <Icon size={16} aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{todayText(item.label, locale)}</h3>
                    <p className="mt-1 text-xs text-slate-400">{todayText(item.time, locale)}</p>
                  </div>
                </div>
                <StatusBadge tone={item.tone}>{todayText(item.state, locale)}</StatusBadge>
              </div>
            );
          })}
        </div>
      </article>

      <article className="panel p-5" aria-labelledby="today-next-surfaces-title">
        <ClipboardCheck className="text-sky-100" size={24} aria-hidden />
        <p className="eyebrow mt-4">{todayText("Next surfaces", locale)}</p>
        <h2 id="today-next-surfaces-title" className="mt-2 text-xl font-semibold text-white">
          {todayText("Move without losing the boundary.", locale)}
        </h2>
        <div className="mt-4 grid gap-3">
          {commandShortcuts.map((shortcut) => (
            <Link
              key={shortcut.href}
              href={shortcut.href}
              className="link-focus group rounded-[8px] border border-slate-700 bg-white/[0.045] p-3 transition hover:-translate-y-0.5 hover:border-sky-200/35 hover:bg-sky-300/10"
            >
              <h3 className="text-sm font-semibold text-white">{todayText(shortcut.title, locale)}</h3>
              <p className="mt-2 text-xs leading-5 text-slate-400">{todayText(shortcut.summary, locale)}</p>
              <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-sky-100 transition group-hover:text-white">
                {todayText("Open", locale)}
                <ArrowRight size={14} aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </article>
    </section>
  );
}

function SafetyBoundaryPanel({ locale }: { locale: SiteLocale }) {
  return (
    <section className="panel p-5 md:p-6" aria-labelledby="today-safety-title">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">{todayText("Safety boundary", locale)}</p>
          <h2 id="today-safety-title" className="mt-2 text-2xl font-semibold text-white">
            {todayText("No hidden execution.", locale)}
          </h2>
        </div>
        <ShieldCheck className="text-sky-100" size={24} aria-hidden />
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {safetyRails.map((item) => (
          <div key={item} className="flex gap-3 rounded-[8px] border border-slate-700 bg-white/[0.045] p-3 text-sm leading-6 text-slate-300">
            <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-200" size={17} aria-hidden />
            {todayText(item, locale)}
          </div>
        ))}
      </div>
    </section>
  );
}

export function OwnerTodaySurface({ data }: { data: OwnerTodaySurfaceData }) {
  const { locale } = useLanguage();
  const pendingApprovals = data.reviewQueue.filter((item) => item.tone === "warning").length;
  const highPressureWindows = data.schedulePressure.filter((item) => item.tone === "warning").length;

  return (
    <div className="grid gap-5" data-i18n-skip>
      <TodayHero data={data} pendingApprovals={pendingApprovals} highPressureWindows={highPressureWindows} locale={locale} />
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.42fr)]">
        <div className="grid gap-5">
          <LoopPanel locale={locale} />
          <OwnerHandoffRunwayPanel reviewQueue={data.reviewQueue} locale={locale} />
          <DecisionHubPanel items={data.decisionHub} locale={locale} />
          <PriorityPanel priorities={data.priorities} locale={locale} />
        </div>
        <aside className="grid content-start gap-5">
          <ReviewQueueRail reviewQueue={data.reviewQueue} locale={locale} />
          <SystemHealthRail systemHealth={data.systemHealth} locale={locale} />
        </aside>
      </section>
      <OperatingMapPanel operatingMap={data.operatingMap} locale={locale} />
      <ResearchPressurePanel
        marketAlerts={data.marketAlerts}
        schedulePressure={data.schedulePressure}
        commandShortcuts={data.commandShortcuts}
        locale={locale}
      />
      <SafetyBoundaryPanel locale={locale} />
    </div>
  );
}
