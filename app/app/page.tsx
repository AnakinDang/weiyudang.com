import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Bot,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Flag,
  GitBranch,
  LineChart,
  LockKeyhole,
  MonitorCheck,
  ShieldCheck,
  Sparkles,
  UserCheck
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  ownerCommandShortcuts,
  ownerMarketAlerts,
  ownerOperatingMap,
  ownerReviewQueue,
  ownerSchedulePressure,
  ownerSystemHealth,
  ownerTodayBrief,
  ownerTodayPriorities
} from "@/lib/private/owner-cockpit";
import { requireOwnerSession } from "@/lib/private/owner-session";

export const dynamic = "force-dynamic";

type StatusTone = "normal" | "info" | "warning" | "private";
type OperatingSurface = (typeof ownerOperatingMap)[number];
type OwnerPriority = (typeof ownerTodayPriorities)[number];

const toneClass = {
  normal: "border-emerald-200 bg-emerald-50 text-emerald-700",
  info: "border-blue-200 bg-blue-50 text-blue-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  private: "border-slate-200 bg-slate-50 text-slate-600"
} as const satisfies Record<StatusTone, string>;

const dotClass = {
  normal: "bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]",
  info: "bg-blue-500 shadow-[0_0_0_4px_rgba(37,99,235,0.12)]",
  warning: "bg-amber-500 shadow-[0_0_0_4px_rgba(245,158,11,0.12)]",
  private: "bg-slate-400 shadow-[0_0_0_4px_rgba(100,116,139,0.12)]"
} as const satisfies Record<StatusTone, string>;

function shanghaiToday() {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Shanghai"
  }).format(new Date());
}

function LightStatus({ children, tone }: { children: React.ReactNode; tone: StatusTone }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-[8px] border px-2.5 py-1 text-xs font-semibold ${toneClass[tone]}`}>
      <span className={`size-1.5 rounded-full ${dotClass[tone]}`} aria-hidden />
      {children}
    </span>
  );
}

const ownerLoop = [
  {
    label: "Sense",
    detail: "Doraemon watches priorities, schedules, research posture, and system health.",
    state: "Live review",
    tone: "info",
    icon: Activity
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

const safetyRails = [
  "Authenticated owner route only.",
  "Read-only UI until command APIs have audit gates.",
  "Research-only. Not an order, recommendation, or execution system.",
  "Public publishing requires explicit review."
] as const;

function IntelligenceCard({
  label,
  value,
  detail,
  tone,
  status,
  icon: Icon
}: {
  label: string;
  value: string;
  detail: string;
  tone: StatusTone;
  status: string;
  icon: LucideIcon;
}) {
  return (
    <article className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-4 border-b border-blue-100/80 p-4 last:border-b-0 sm:border-b-0 sm:border-r sm:[&:nth-child(2n)]:border-r-0 xl:[&:nth-child(2n)]:border-r xl:last:border-r-0 md:p-5">
      <span className="flex size-12 items-center justify-center rounded-[8px] border border-blue-100 bg-blue-50 text-blue-600 shadow-[0_14px_34px_rgba(37,99,235,0.08)]">
        <Icon size={23} aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-slate-950">{label}</span>
        <span className="mt-1 flex items-baseline gap-3">
          <strong className="text-3xl font-semibold leading-none text-blue-600">{value}</strong>
          <span className="text-xs font-semibold text-slate-500">{detail}</span>
        </span>
        <span className="mt-3 block">
          <LightStatus tone={tone}>{status}</LightStatus>
        </span>
      </span>
    </article>
  );
}

function PriorityLane({ priority, index }: { priority: OwnerPriority; index: number }) {
  return (
    <article className="grid gap-4 rounded-[8px] border border-blue-100 bg-white/88 p-4 shadow-[0_18px_60px_rgba(37,99,235,0.08)] sm:grid-cols-[3.25rem_minmax(0,1fr)_auto] sm:items-start">
      <span className="flex size-11 items-center justify-center rounded-[8px] border border-blue-100 bg-blue-50 text-sm font-semibold text-blue-700">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold text-slate-950">{priority.title}</h3>
          <LightStatus tone={priority.tone}>{priority.state}</LightStatus>
        </div>
        <p className="mt-2 text-xs font-bold uppercase text-blue-700">{priority.owner}</p>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{priority.summary}</p>
        <div className="mt-4 rounded-[8px] border border-slate-200 bg-slate-50/84 p-3">
          <p className="text-xs font-bold uppercase text-slate-500">Next step</p>
          <p className="mt-1 text-sm leading-6 text-slate-700">{priority.nextStep}</p>
        </div>
      </div>
      <div className="inline-flex w-fit items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-xs font-semibold uppercase text-slate-500 sm:justify-self-end">
        <Clock3 size={14} aria-hidden />
        {priority.freshness}
      </div>
    </article>
  );
}

function SurfaceLink({ surface }: { surface: OperatingSurface }) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase text-slate-500">{surface.current ? "Current" : "Surface"}</p>
          <h3 className="mt-1 text-base font-semibold text-slate-950">{surface.title}</h3>
        </div>
        <LightStatus tone={surface.tone}>{surface.state}</LightStatus>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{surface.summary}</p>
      <p className="mt-4 rounded-[8px] border border-slate-200 bg-slate-50/88 p-3 text-xs leading-5 text-slate-500">
        {surface.evidence}
      </p>
    </>
  );

  if (surface.current) {
    return (
      <article aria-current="page" className="rounded-[8px] border border-blue-200 bg-blue-50/72 p-4">
        {content}
      </article>
    );
  }

  return (
    <Link
      href={surface.href}
      className="link-focus group rounded-[8px] border border-blue-100 bg-white/78 p-4 transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white"
    >
      {content}
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition group-hover:text-blue-800">
        Open
        <ArrowRight size={15} aria-hidden />
      </span>
    </Link>
  );
}

export default async function PrivateAppPage() {
  await requireOwnerSession("/app");
  const today = shanghaiToday();
  const pendingApprovals = ownerReviewQueue.filter((item) => item.tone === "warning").length;
  const highPressureWindows = ownerSchedulePressure.filter((item) => item.tone === "warning").length;
  const intelligence = [
    {
      label: "Priority lanes",
      value: ownerTodayPriorities.length.toString(),
      detail: "Active",
      tone: "normal",
      status: "On track",
      icon: Flag
    },
    {
      label: "Waiting approvals",
      value: pendingApprovals.toString(),
      detail: `Pending of ${ownerReviewQueue.length}`,
      tone: "warning",
      status: "Needs owner",
      icon: UserCheck
    },
    {
      label: "Schedule pressure",
      value: highPressureWindows.toString(),
      detail: `High of ${ownerSchedulePressure.length}`,
      tone: "warning",
      status: "Watch windows",
      icon: CalendarClock
    },
    {
      label: "Boundary locks",
      value: safetyRails.length.toString(),
      detail: "No hidden execution",
      tone: "private",
      status: "Locked",
      icon: LockKeyhole
    }
  ] as const;

  return (
    <div className="relative -m-4 min-h-[calc(100vh-2rem)] overflow-hidden rounded-[8px] border border-white/80 bg-[#f8fbff] text-slate-950 shadow-[0_34px_120px_rgba(15,23,42,0.2)] sm:-m-5 md:-m-8">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_78%_8%,rgba(37,99,235,0.15),transparent_34%),linear-gradient(180deg,#ffffff_0%,#f7fbff_62%,rgba(248,251,255,0)_100%)]"
        aria-hidden
      />
      <div className="relative grid gap-5 p-5 sm:p-6 md:p-8">
        <header className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-[8px] border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase text-blue-800">
                <LockKeyhole size={14} aria-hidden />
                Private owner area
              </span>
              <span className="inline-flex items-center gap-2 rounded-[8px] border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold uppercase text-emerald-800">
                <MonitorCheck size={14} aria-hidden />
                Read-only by default
              </span>
              <span className="inline-flex items-center gap-2 rounded-[8px] border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs font-bold uppercase text-amber-800">
                <LineChart size={14} aria-hidden />
                Research-only trading
              </span>
            </div>
            <p className="mt-8 text-sm font-semibold text-blue-700">Today - {today} - Asia/Shanghai</p>
            <h2 className="mt-2 max-w-3xl text-4xl font-semibold leading-[1.02] text-slate-950 md:text-6xl">
              Owner Cockpit
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              The private command center for priorities, approvals, research posture, schedule pressure, and system
              health. Doraemon prepares the work; you keep the decision boundary.
            </p>
          </div>

          <aside className="rounded-[8px] border border-blue-100 bg-white/78 p-5 shadow-[0_18px_70px_rgba(37,99,235,0.1)] backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">Private status</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-950">{ownerTodayBrief.posture}</h3>
              </div>
              <span className="flex size-12 items-center justify-center rounded-[8px] bg-blue-600 text-white">
                <Sparkles size={22} aria-hidden />
              </span>
            </div>
            <dl className="mt-5 grid gap-3 text-sm text-slate-600">
              <div className="flex items-center justify-between gap-3 border-t border-blue-100 pt-3">
                <dt className="font-semibold text-slate-500">Current focus</dt>
                <dd className="max-w-[14rem] text-right font-semibold text-slate-950">{ownerTodayBrief.focus}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-blue-100 pt-3">
                <dt className="font-semibold text-slate-500">Next review</dt>
                <dd className="font-semibold text-slate-950">{ownerTodayBrief.nextReview}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-blue-100 pt-3">
                <dt className="font-semibold text-slate-500">Freshness</dt>
                <dd className="font-semibold text-slate-950">{ownerTodayBrief.freshness}</dd>
              </div>
            </dl>
          </aside>
        </header>

        <section className="grid overflow-hidden rounded-[8px] border border-blue-100 bg-white/86 shadow-[0_26px_90px_rgba(37,99,235,0.1)] backdrop-blur sm:grid-cols-2 xl:grid-cols-4">
          {intelligence.map((item) => (
            <IntelligenceCard key={item.label} {...item} />
          ))}
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.42fr)]">
          <div className="grid gap-5">
            <section className="rounded-[8px] border border-blue-100 bg-white/88 p-5 shadow-[0_20px_80px_rgba(37,99,235,0.08)] md:p-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase text-blue-700">Daily Brief</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">What needs attention today.</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/app/command"
                    className="link-focus inline-flex items-center gap-2 rounded-[8px] bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_44px_rgba(37,99,235,0.24)] transition hover:bg-blue-700"
                  >
                    Open Command
                    <ArrowRight size={16} aria-hidden />
                  </Link>
                  <Link
                    href="/app/events"
                    className="link-focus inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-blue-200 hover:text-blue-700"
                  >
                    Review Queue
                    <ArrowRight size={16} aria-hidden />
                  </Link>
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                {ownerLoop.map((step, index) => {
                  const Icon = step.icon;

                  return (
                    <div key={step.label} className="grid grid-cols-[2.75rem_1fr] gap-3 rounded-[8px] border border-blue-100 bg-blue-50/42 p-3">
                      <span className="flex size-10 items-center justify-center rounded-[8px] border border-blue-100 bg-white text-blue-700 shadow-[0_10px_28px_rgba(37,99,235,0.08)]">
                        <Icon size={18} aria-hidden />
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="text-sm font-semibold text-slate-950">
                            {index + 1}. {step.label}
                          </h3>
                          <LightStatus tone={step.tone}>{step.state}</LightStatus>
                        </div>
                        <p className="mt-2 text-xs leading-5 text-slate-600">{step.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[8px] border border-blue-100 bg-white/88 p-5 shadow-[0_20px_80px_rgba(37,99,235,0.08)] md:p-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase text-blue-700">Priority Lanes</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">What Doraemon is keeping in view.</h2>
                </div>
                <Link href="/app/agents" className="link-focus inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                  See agents
                  <ArrowRight size={15} aria-hidden />
                </Link>
              </div>
              <div className="mt-5 grid gap-3">
                {ownerTodayPriorities.map((priority, index) => (
                  <PriorityLane key={priority.title} priority={priority} index={index} />
                ))}
              </div>
            </section>
          </div>

          <aside className="grid content-start gap-5">
            <section className="rounded-[8px] border border-blue-100 bg-white/88 p-5 shadow-[0_20px_80px_rgba(37,99,235,0.08)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase text-blue-700">Waiting Approvals</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">{ownerReviewQueue.length} checkpoints</h2>
                </div>
                <UserCheck className="text-blue-600" size={24} aria-hidden />
              </div>
              <div className="mt-5 grid gap-3">
                {ownerReviewQueue.map((item) => (
                  <article key={item.title} className="rounded-[8px] border border-blue-100 bg-white/76 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-slate-950">{item.title}</h3>
                      <LightStatus tone={item.tone}>{item.state}</LightStatus>
                    </div>
                    <p className="mt-2 text-xs font-bold uppercase text-slate-500">
                      {item.urgency} - {item.agent}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.decision}</p>
                    <p className="mt-3 rounded-[8px] border border-slate-200 bg-slate-50/88 p-3 text-xs leading-5 text-slate-500">
                      {item.evidence}
                    </p>
                  </article>
                ))}
              </div>
              <Link href="/app/events" className="link-focus mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                Open review queue
                <ArrowRight size={15} aria-hidden />
              </Link>
            </section>

            <section className="rounded-[8px] border border-blue-100 bg-white/88 p-5 shadow-[0_20px_80px_rgba(37,99,235,0.08)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase text-blue-700">System Health</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-950">Operational guardrails.</h2>
                </div>
                <ShieldCheck className="text-blue-600" size={24} aria-hidden />
              </div>
              <div className="mt-4 grid gap-3">
                {ownerSystemHealth.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-3 rounded-[8px] border border-blue-100 bg-blue-50/38 px-3 py-3">
                    <span className="text-sm text-slate-600">{item.label}</span>
                    <LightStatus tone={item.tone}>{item.value}</LightStatus>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </section>

        <section className="grid gap-5 xl:grid-cols-[22rem_minmax(0,1fr)]">
          <div className="rounded-[8px] border border-blue-100 bg-white/88 p-5 shadow-[0_20px_80px_rgba(37,99,235,0.08)] md:p-6">
            <div className="flex size-11 items-center justify-center rounded-[8px] border border-blue-100 bg-blue-50 text-blue-600">
              <GitBranch size={22} aria-hidden />
            </div>
            <p className="mt-5 text-xs font-bold uppercase text-blue-700">Operating Map</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Public, private, research, review.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Today links the Personal OS surfaces without blurring their boundary. Public pages stay sanitized; owner
              routes stay authenticated; research stays non-executing.
            </p>
          </div>
          <div className="grid gap-3 rounded-[8px] border border-blue-100 bg-white/60 p-4 md:grid-cols-2 md:p-5">
            {ownerOperatingMap.map((surface) => (
              <SurfaceLink key={surface.title} surface={surface} />
            ))}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,0.85fr)_minmax(0,0.8fr)]">
          <article className="rounded-[8px] border border-blue-100 bg-white/88 p-5 shadow-[0_20px_80px_rgba(37,99,235,0.08)]">
            <LineChart className="text-blue-600" size={24} aria-hidden />
            <p className="mt-4 text-xs font-bold uppercase text-blue-700">Market Research</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">Evidence before conviction.</h2>
            <div className="mt-4 grid gap-3">
              {ownerMarketAlerts.map((alert) => (
                <div key={alert.label} className="rounded-[8px] border border-blue-100 bg-blue-50/38 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-950">{alert.label}</h3>
                    <span className="text-xs font-bold uppercase text-blue-700">{alert.value}</span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{alert.detail}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[8px] border border-blue-100 bg-white/88 p-5 shadow-[0_20px_80px_rgba(37,99,235,0.08)]">
            <CalendarClock className="text-blue-600" size={24} aria-hidden />
            <p className="mt-4 text-xs font-bold uppercase text-blue-700">Schedule Pressure</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">When attention comes due.</h2>
            <div className="mt-4 grid gap-3">
              {ownerSchedulePressure.map((item) => (
                <div key={item.label} className="grid grid-cols-[1fr_auto] gap-3 rounded-[8px] border border-blue-100 bg-blue-50/38 p-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-950">{item.label}</h3>
                    <p className="mt-1 text-xs text-slate-500">{item.time}</p>
                  </div>
                  <LightStatus tone={item.tone}>{item.state}</LightStatus>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[8px] border border-blue-100 bg-white/88 p-5 shadow-[0_20px_80px_rgba(37,99,235,0.08)]">
            <ClipboardCheck className="text-blue-600" size={24} aria-hidden />
            <p className="mt-4 text-xs font-bold uppercase text-blue-700">Next Surfaces</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">Move without losing the boundary.</h2>
            <div className="mt-4 grid gap-3">
              {ownerCommandShortcuts.map((shortcut) => (
                <Link
                  key={shortcut.href}
                  href={shortcut.href}
                  className="link-focus rounded-[8px] border border-blue-100 bg-blue-50/38 p-3 transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white"
                >
                  <h3 className="text-sm font-semibold text-slate-950">{shortcut.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{shortcut.summary}</p>
                  <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-blue-700">
                    Open
                    <ArrowRight size={14} aria-hidden />
                  </span>
                </Link>
              ))}
            </div>
          </article>
        </section>

        <section className="rounded-[8px] border border-blue-100 bg-white/88 p-5 shadow-[0_20px_80px_rgba(37,99,235,0.08)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase text-blue-700">Safety Boundary</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">No hidden execution.</h2>
            </div>
            <ShieldCheck className="text-blue-600" size={24} aria-hidden />
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {safetyRails.map((item) => (
              <div key={item} className="flex gap-3 rounded-[8px] border border-blue-100 bg-blue-50/38 p-3 text-sm leading-6 text-slate-600">
                <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={17} aria-hidden />
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
