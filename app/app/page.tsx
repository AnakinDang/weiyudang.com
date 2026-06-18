import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  GitBranch,
  LineChart,
  LockKeyhole,
  MonitorCheck,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import {
  ownerCommandShortcuts,
  ownerMarketAlerts,
  ownerOperatingMap,
  ownerReviewQueue,
  ownerSchedulePressure,
  ownerSystemHealth,
  ownerTodayPriorities
} from "@/lib/owner-cockpit";

export const dynamic = "force-dynamic";

const toneMap = {
  normal: "normal",
  info: "info",
  warning: "warning",
  private: "private"
} as const;

type OperatingSurface = (typeof ownerOperatingMap)[number];

function shanghaiToday() {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Shanghai"
  }).format(new Date());
}

const safetyRails = [
  "Authenticated owner route only.",
  "Read-only UI until command APIs have audit gates.",
  "Research-only. Not an order, recommendation, or execution system.",
  "Public publishing requires explicit review."
] as const;

const ownerLoop = [
  {
    label: "Sense",
    detail: "Doraemon watches priorities, schedules, research posture, and system health.",
    state: "Live review",
    tone: "info"
  },
  {
    label: "Review",
    detail: "Owner checkpoints stay visible before anything private becomes action.",
    state: "Owner-gated",
    tone: "private"
  },
  {
    label: "Prepare",
    detail: "MiniDoras prepare evidence and next steps without hidden execution.",
    state: "Read-only",
    tone: "private"
  }
] as const;

function OperatingSurfaceCard({ surface }: { surface: OperatingSurface }) {
  const cardClass =
    "grid min-h-[15rem] content-between gap-6 bg-[#0b1627] p-5 transition md:p-6";
  const cardBody = (
    <>
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 className="max-w-xs text-xl font-semibold text-white">{surface.title}</h3>
          <StatusBadge tone={toneMap[surface.tone]}>{surface.state}</StatusBadge>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-300">{surface.summary}</p>
      </div>
      <div>
        <p className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-3 text-xs leading-5 text-slate-300">
          {surface.evidence}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-100 transition group-hover:text-white">
          {surface.current ? "Current surface" : "Open surface"}
          {!surface.current ? <ArrowRight size={15} aria-hidden /> : null}
        </span>
      </div>
    </>
  );

  if (surface.current) {
    return (
      <article aria-current="page" className={cardClass}>
        {cardBody}
      </article>
    );
  }

  return (
    <Link href={surface.href} className={`link-focus group ${cardClass} hover:bg-[#10213a]`}>
      {cardBody}
    </Link>
  );
}

export default function PrivateAppPage() {
  const today = shanghaiToday();
  const cockpitMetrics = [
    { label: "Active lanes", value: ownerTodayPriorities.length.toString(), detail: "Priority streams" },
    { label: "Approvals", value: ownerReviewQueue.length.toString(), detail: "Waiting owner review" },
    { label: "Surfaces", value: ownerOperatingMap.length.toString(), detail: "Mapped and bounded" },
    { label: "Executions", value: "0", detail: "Disabled in this build" }
  ] as const;

  return (
    <div className="grid gap-5">
      <section className="overflow-hidden rounded-[8px] border border-white/60 bg-white/90 text-slate-950 shadow-[0_32px_100px_rgba(15,23,42,0.16)] backdrop-blur-xl">
        <div className="grid gap-0 xl:grid-cols-[minmax(0,1.15fr)_26rem]">
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-[8px] border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase text-blue-800">
                <LockKeyhole size={14} aria-hidden />
                Owner-only
              </span>
              <span className="inline-flex items-center gap-2 rounded-[8px] border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold uppercase text-emerald-800">
                <MonitorCheck size={14} aria-hidden />
                Read-only
              </span>
              <span className="inline-flex items-center gap-2 rounded-[8px] border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs font-bold uppercase text-amber-800">
                <LineChart size={14} aria-hidden />
                Research-only
              </span>
            </div>
            <p className="mt-8 text-xs font-bold uppercase text-blue-700">Today</p>
            <h2 className="mt-3 max-w-4xl text-4xl font-semibold leading-[1.02] text-slate-950 md:text-5xl">
              Personal OS cockpit for what needs your attention now.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
              This private surface is the owner-readable map of the system: priorities, approvals, public relay posture,
              trading research, schedules, and health. It is authenticated and read-only in the current build, with no
              command execution, broker writes, credential exposure, or private publishing.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/app/command"
                className="link-focus inline-flex items-center gap-2 rounded-[8px] bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_44px_rgba(37,99,235,0.24)] transition hover:bg-blue-700"
              >
                Open Command
                <ArrowRight size={16} aria-hidden />
              </Link>
              <Link
                href="/app/trading"
                className="link-focus inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-blue-200 hover:text-blue-700"
              >
                Trading research
                <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </div>

          <aside className="border-t border-slate-200 bg-[linear-gradient(180deg,#f8fbff,#eef6ff)] p-5 md:p-6 xl:border-l xl:border-t-0">
            <div className="rounded-[8px] border border-white bg-white/80 p-4 shadow-[0_18px_60px_rgba(37,99,235,0.08)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase text-slate-500">Asia/Shanghai</p>
                  <p className="mt-1 text-lg font-semibold text-slate-950">{today}</p>
                </div>
                <CalendarClock className="text-blue-600" size={24} aria-hidden />
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              {cockpitMetrics.map((metric) => (
                <div key={metric.label} className="rounded-[8px] border border-blue-100 bg-white/80 p-4">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase text-slate-500">{metric.label}</p>
                      <p className="mt-1 text-sm text-slate-500">{metric.detail}</p>
                    </div>
                    <p className="text-3xl font-semibold text-slate-950">{metric.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="panel overflow-hidden p-0">
        <div className="grid gap-0 xl:grid-cols-[22rem_minmax(0,1fr)]">
          <div className="border-b border-slate-700 bg-white/[0.035] p-5 md:p-6 xl:border-b-0 xl:border-r">
            <div className="flex size-11 items-center justify-center rounded-[8px] border border-sky-200/25 bg-sky-300/10 text-sky-100">
              <GitBranch size={22} aria-hidden />
            </div>
            <p className="eyebrow mt-5">Operating map</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Four surfaces, one boundary model.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Today should make the Personal OS legible at a glance: what is public, what is private, what is research
              only, and where owner review interrupts automation.
            </p>
          </div>
          <div className="grid gap-px bg-slate-700/70 md:grid-cols-2">
            {ownerOperatingMap.map((surface) => (
              <OperatingSurfaceCard key={surface.title} surface={surface} />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_24rem]">
        <div>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Priority lanes</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">What Doraemon is keeping in view.</h2>
            </div>
            <Link href="/app/agents" className="link-focus inline-flex items-center gap-2 text-sm font-semibold text-sky-100">
              See agents
              <ArrowRight size={15} aria-hidden />
            </Link>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {ownerTodayPriorities.map((priority) => (
              <article key={priority.title} className="rounded-[8px] border border-slate-700 bg-white/[0.055] p-4 shadow-[0_18px_60px_rgba(2,6,23,0.18)] backdrop-blur">
                <div className="flex items-start justify-between gap-3">
                  <Bot className="text-sky-100" size={20} aria-hidden />
                  <StatusBadge tone={toneMap[priority.tone]}>{priority.state}</StatusBadge>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{priority.title}</h3>
                <p className="mt-2 text-xs font-bold uppercase text-yellow-100">{priority.owner}</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">{priority.summary}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="grid content-start gap-4">
          <section className="panel p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow">Waiting approvals</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{ownerReviewQueue.length} checkpoints</h2>
              </div>
              <UserCheck className="text-yellow-100" size={24} aria-hidden />
            </div>
            <div className="mt-5 grid gap-3">
              {ownerReviewQueue.map((item) => (
                <article key={item.title} className="rounded-[8px] border border-slate-700 bg-white/5 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                    <StatusBadge tone={toneMap[item.tone]}>{item.state}</StatusBadge>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    {item.urgency} - {item.agent}
                  </p>
                </article>
              ))}
            </div>
            <Link href="/app/events" className="link-focus mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-100">
              Open review queue
              <ArrowRight size={15} aria-hidden />
            </Link>
          </section>

          <section className="panel p-5">
            <p className="eyebrow">System health</p>
            <div className="mt-4 grid gap-3">
              {ownerSystemHealth.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-3 rounded-[8px] border border-slate-700 bg-white/5 px-3 py-3">
                  <span className="text-sm text-slate-300">{item.label}</span>
                  <StatusBadge tone={toneMap[item.tone]}>{item.value}</StatusBadge>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <article className="panel p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow">Owner loop</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Sense, review, then prepare.</h2>
            </div>
            <Compass className="text-sky-100" size={24} aria-hidden />
          </div>
          <div className="mt-5 grid gap-3">
            {ownerLoop.map((step, index) => (
              <div key={step.label} className="grid gap-3 rounded-[8px] border border-slate-700 bg-white/5 p-4 sm:grid-cols-[2.5rem_1fr_auto] sm:items-center">
                <span className="flex size-10 items-center justify-center rounded-[8px] border border-sky-200/25 bg-sky-300/10 text-sm font-semibold text-sky-100">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-white">{step.label}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-300">{step.detail}</p>
                </div>
                <StatusBadge tone={step.tone}>{step.state}</StatusBadge>
              </div>
            ))}
          </div>
        </article>

        <article className="panel p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow">Safety posture</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Clear boundary before capability.</h2>
            </div>
            <ShieldCheck className="text-yellow-100" size={24} aria-hidden />
          </div>
          <div className="mt-5 grid gap-3">
            {safetyRails.map((item) => (
              <div key={item} className="flex gap-3 rounded-[8px] border border-slate-700 bg-white/5 p-3 text-sm leading-6 text-slate-300">
                <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-200" size={17} aria-hidden />
                {item}
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="panel p-5">
          <LineChart className="text-yellow-100" size={24} aria-hidden />
          <p className="eyebrow mt-4">Market research</p>
          <div className="mt-4 grid gap-3">
            {ownerMarketAlerts.map((alert) => (
              <div key={alert.label} className="rounded-[8px] border border-slate-700 bg-white/5 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-white">{alert.label}</h3>
                  <span className="text-xs font-bold uppercase text-yellow-100">{alert.value}</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-400">{alert.detail}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel p-5">
          <CalendarClock className="text-yellow-100" size={24} aria-hidden />
          <p className="eyebrow mt-4">Schedule pressure</p>
          <div className="mt-4 grid gap-3">
            {ownerSchedulePressure.map((item) => (
              <div key={item.label} className="grid grid-cols-[1fr_auto] gap-3 rounded-[8px] border border-slate-700 bg-white/5 p-3">
                <div>
                  <h3 className="text-sm font-semibold text-white">{item.label}</h3>
                  <p className="mt-1 text-xs text-slate-400">{item.time}</p>
                </div>
                <span className="text-xs font-bold uppercase text-slate-300">{item.state}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel p-5">
          <ClipboardCheck className="text-yellow-100" size={24} aria-hidden />
          <p className="eyebrow mt-4">Next surfaces</p>
          <div className="mt-4 grid gap-3">
            {ownerCommandShortcuts.map((shortcut) => (
              <Link
                key={shortcut.href}
                href={shortcut.href}
                className="link-focus rounded-[8px] border border-slate-700 bg-white/[0.045] p-3 transition hover:-translate-y-0.5 hover:border-sky-300/40"
              >
                <h3 className="text-sm font-semibold text-white">{shortcut.title}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-300">{shortcut.summary}</p>
                <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-sky-100">
                  Open
                  <ArrowRight size={14} aria-hidden />
                </span>
              </Link>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
