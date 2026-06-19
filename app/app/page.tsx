import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  GitBranch,
  LineChart,
  LockKeyhole,
  MonitorCheck,
  ShieldCheck,
  Sparkles,
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
  ownerTodayBrief,
  ownerTodayPriorities
} from "@/lib/private/owner-cockpit";
import { requireOwnerSession } from "@/lib/private/owner-session";

export const dynamic = "force-dynamic";

type StatusTone = "normal" | "info" | "warning" | "private";

const toneMap = {
  normal: "normal",
  info: "info",
  warning: "warning",
  private: "private"
} as const satisfies Record<StatusTone, StatusTone>;

type OperatingSurface = (typeof ownerOperatingMap)[number];
type OwnerPriority = (typeof ownerTodayPriorities)[number];

function shanghaiToday() {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Shanghai"
  }).format(new Date());
}

const ownerLoop = [
  {
    label: "Sense",
    detail: "Doraemon watches priorities, schedules, research posture, and system health.",
    state: "Live review",
    tone: "info"
  },
  {
    label: "Review",
    detail: "Owner checkpoints stay visible before private work becomes action.",
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

const safetyRails = [
  "Authenticated owner route only.",
  "Read-only UI until command APIs have audit gates.",
  "Research-only. Not an order, recommendation, or execution system.",
  "Public publishing requires explicit review."
] as const;

function SurfaceLink({ surface }: { surface: OperatingSurface }) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase text-slate-500">{surface.current ? "Current" : "Surface"}</p>
          <h3 className="mt-1 text-base font-semibold text-white">{surface.title}</h3>
        </div>
        <StatusBadge tone={toneMap[surface.tone]}>{surface.state}</StatusBadge>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">{surface.summary}</p>
      <p className="mt-4 rounded-[8px] border border-slate-700 bg-white/[0.04] p-3 text-xs leading-5 text-slate-400">
        {surface.evidence}
      </p>
    </>
  );

  if (surface.current) {
    return (
      <article aria-current="page" className="rounded-[8px] border border-sky-200/25 bg-sky-300/10 p-4">
        {content}
      </article>
    );
  }

  return (
    <Link
      href={surface.href}
      className="link-focus group rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 transition hover:-translate-y-0.5 hover:border-sky-300/45 hover:bg-white/[0.07]"
    >
      {content}
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-100 transition group-hover:text-white">
        Open
        <ArrowRight size={15} aria-hidden />
      </span>
    </Link>
  );
}

function PriorityLane({ priority, index }: { priority: OwnerPriority; index: number }) {
  return (
    <article className="grid gap-4 rounded-[8px] border border-slate-700 bg-white/[0.052] p-4 shadow-[0_18px_60px_rgba(2,6,23,0.18)] sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:items-start">
      <div className="flex items-center gap-3 sm:grid sm:justify-items-start sm:gap-3">
        <span
          className="flex size-11 items-center justify-center rounded-[8px] border border-sky-200/35 bg-sky-200/16 text-sm font-semibold text-white"
          aria-hidden
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-xs font-bold uppercase text-slate-500">{priority.lane}</span>
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-semibold text-white">{priority.title}</h3>
          <StatusBadge tone={toneMap[priority.tone]}>{priority.state}</StatusBadge>
        </div>
        <p className="mt-2 text-xs font-bold uppercase text-yellow-100">{priority.owner}</p>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{priority.summary}</p>
        <div className="mt-4 rounded-[8px] border border-slate-700 bg-[#07111f]/70 p-3">
          <p className="text-xs font-bold uppercase text-slate-500">Next step</p>
          <p className="mt-1 text-sm leading-6 text-slate-200">{priority.nextStep}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-[8px] border border-slate-700 bg-white/[0.045] px-3 py-2 text-xs font-semibold uppercase text-slate-300 sm:justify-self-end">
        <Clock3 size={14} aria-hidden />
        {priority.freshness}
      </div>
    </article>
  );
}

export default async function PrivateAppPage() {
  await requireOwnerSession("/app");
  const today = shanghaiToday();
  const cockpitMetrics = [
    { label: "Priority lanes", value: ownerTodayPriorities.length.toString(), detail: "Active owner focus" },
    { label: "Approvals", value: ownerReviewQueue.length.toString(), detail: "Waiting checkpoints" },
    { label: "Surfaces", value: ownerOperatingMap.length.toString(), detail: "Mapped boundaries" },
    { label: "Executions", value: "0", detail: "Disabled in this build" }
  ] as const;

  return (
    <div className="grid gap-5">
      <section className="overflow-hidden rounded-[8px] border border-white/70 bg-white text-slate-950 shadow-[0_34px_120px_rgba(15,23,42,0.18)]">
        <div className="grid min-h-[29rem] gap-0 xl:grid-cols-[minmax(0,1.08fr)_32rem]">
          <div className="relative overflow-hidden p-6 md:p-8">
            <div
              className="pointer-events-none absolute -right-24 -top-28 size-80 rounded-full bg-blue-500/12 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute bottom-0 left-1/2 h-44 w-[44rem] -translate-x-1/2 rounded-t-full border border-blue-100 bg-[radial-gradient(circle_at_50%_100%,rgba(37,99,235,0.16),transparent_62%)]"
              aria-hidden
            />

            <div className="relative flex flex-wrap items-center gap-2">
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

            <div className="relative mt-10 max-w-4xl">
              <p className="text-sm font-semibold text-blue-700">{today} - Asia/Shanghai</p>
              <h2 className="mt-3 max-w-4xl text-4xl font-semibold leading-[1.02] text-slate-950 md:text-5xl">
                Owner Cockpit for today&apos;s decisions.
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
                The private Personal OS home should show what needs attention, what is being prepared, and where the
                safety boundary stops the system. It is a command surface for review, not a hidden execution layer.
              </p>
            </div>

            <div className="relative mt-7 grid gap-4">
              <div className="rounded-[8px] border border-slate-200 bg-white/78 p-4 shadow-[0_18px_70px_rgba(37,99,235,0.1)] backdrop-blur">
                <p className="text-xs font-bold uppercase text-slate-500">Current focus</p>
                <h3 className="mt-2 text-lg font-semibold leading-7 text-slate-950">{ownerTodayBrief.focus}</h3>
                <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
                  <span>
                    <strong className="block text-xs font-bold uppercase text-slate-500">Posture</strong>
                    {ownerTodayBrief.posture}
                  </span>
                  <span>
                    <strong className="block text-xs font-bold uppercase text-slate-500">Next review</strong>
                    {ownerTodayBrief.nextReview}
                  </span>
                  <span>
                    <strong className="block text-xs font-bold uppercase text-slate-500">Freshness</strong>
                    {ownerTodayBrief.freshness}
                  </span>
                </div>
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
          </div>

          <section
            className="relative border-t border-slate-200 bg-[linear-gradient(180deg,#f7fbff,#edf5ff)] p-5 md:p-6 xl:border-l xl:border-t-0"
            aria-labelledby="doraemon-loop-title"
          >
            <div
              className="pointer-events-none absolute inset-x-6 top-6 h-48 rounded-full bg-blue-500/12 blur-3xl"
              aria-hidden
            />
            <div className="relative rounded-[8px] border border-white bg-white/78 p-5 shadow-[0_20px_80px_rgba(37,99,235,0.1)] backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase text-slate-500">Doraemon loop</p>
                  <h3 id="doraemon-loop-title" className="mt-1 text-xl font-semibold text-slate-950">
                    Sense, review, prepare.
                  </h3>
                </div>
                <span className="flex size-11 items-center justify-center rounded-[8px] bg-blue-600 text-white">
                  <Sparkles size={21} aria-hidden />
                </span>
              </div>

              <div className="mt-5 grid gap-3">
                {ownerLoop.map((step, index) => (
                  <div key={step.label} className="grid grid-cols-[2.5rem_1fr] gap-3 rounded-[8px] border border-blue-100 bg-white/82 p-3">
                    <span className="flex size-9 items-center justify-center rounded-[8px] border border-blue-100 bg-blue-50 text-sm font-semibold text-blue-700">
                      {index + 1}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-sm font-semibold text-slate-950">{step.label}</h4>
                        <StatusBadge tone={step.tone}>{step.state}</StatusBadge>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-slate-600">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-4 grid grid-cols-2 gap-3">
              {cockpitMetrics.map((metric) => (
                <div key={metric.label} className="rounded-[8px] border border-blue-100 bg-white/78 p-4">
                  <p className="text-xs font-bold uppercase text-slate-500">{metric.label}</p>
                  <div className="mt-2 flex items-end justify-between gap-3">
                    <p className="text-xs leading-5 text-slate-500">{metric.detail}</p>
                    <p className="text-3xl font-semibold text-slate-950">{metric.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="panel p-5 md:p-6">
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
          <div className="mt-5 grid gap-3">
            {ownerTodayPriorities.map((priority, index) => (
              <PriorityLane key={priority.title} priority={priority} index={index} />
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
                  <p className="mt-2 text-xs font-bold uppercase text-slate-500">
                    {item.urgency} - {item.agent}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{item.decision}</p>
                  <p className="mt-3 rounded-[8px] border border-slate-700 bg-[#07111f]/60 p-3 text-xs leading-5 text-slate-400">
                    {item.evidence}
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

      <section className="panel overflow-hidden p-0">
        <div className="grid gap-0 xl:grid-cols-[20rem_minmax(0,1fr)]">
          <div className="border-b border-slate-700 bg-white/[0.035] p-5 md:p-6 xl:border-b-0 xl:border-r">
            <div className="flex size-11 items-center justify-center rounded-[8px] border border-sky-200/25 bg-sky-300/10 text-sky-100">
              <GitBranch size={22} aria-hidden />
            </div>
            <p className="eyebrow mt-5">Operating map</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Public, private, research, review.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Today links the Personal OS surfaces without blurring their boundary. Public pages stay sanitized; owner
              routes stay authenticated; research stays non-executing.
            </p>
          </div>
          <div className="grid gap-3 p-4 md:grid-cols-2 md:p-5">
            {ownerOperatingMap.map((surface) => (
              <SurfaceLink key={surface.title} surface={surface} />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,0.85fr)_minmax(0,0.8fr)]">
        <article className="panel p-5">
          <LineChart className="text-yellow-100" size={24} aria-hidden />
          <p className="eyebrow mt-4">Market research</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Evidence before conviction.</h2>
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
          <h2 className="mt-2 text-xl font-semibold text-white">When attention comes due.</h2>
          <div className="mt-4 grid gap-3">
            {ownerSchedulePressure.map((item) => (
              <div key={item.label} className="grid grid-cols-[1fr_auto] gap-3 rounded-[8px] border border-slate-700 bg-white/5 p-3">
                <div>
                  <h3 className="text-sm font-semibold text-white">{item.label}</h3>
                  <p className="mt-1 text-xs text-slate-400">{item.time}</p>
                </div>
                <StatusBadge tone={toneMap[item.tone]}>{item.state}</StatusBadge>
              </div>
            ))}
          </div>
        </article>

        <article className="panel p-5">
          <ClipboardCheck className="text-yellow-100" size={24} aria-hidden />
          <p className="eyebrow mt-4">Next surfaces</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Move without losing the boundary.</h2>
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

      <section className="panel p-5">
        <article>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow">Safety posture</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">No hidden write path.</h2>
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
    </div>
  );
}
