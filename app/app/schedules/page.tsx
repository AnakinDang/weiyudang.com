import type { ReactNode } from "react";
import {
  BellRing,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileSearch,
  LockKeyhole,
  Repeat2,
  ShieldCheck,
  Waypoints,
  XCircle
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { requireOwnerSession } from "@/lib/private/owner-session";
import {
  privateSchedules,
  scheduleControlPolicy,
  scheduleMetrics,
  scheduleRhythmLanes,
  type ScheduleTone,
  type PrivateSchedule
} from "@/lib/private/schedules";

export const dynamic = "force-dynamic";

const unavailableControls = ["Create job", "Pause job", "Resume job", "Delete job", "Edit command"] as const;

function LightStatusBadge({ children, tone }: { children: ReactNode; tone: ScheduleTone }) {
  const className = {
    normal: "border-emerald-200 bg-emerald-50 text-emerald-800",
    info: "border-blue-200 bg-blue-50 text-blue-800",
    warning: "border-amber-200 bg-amber-50 text-amber-800",
    private: "border-slate-200 bg-slate-50 text-slate-700",
    danger: "border-red-200 bg-red-50 text-red-800"
  }[tone];

  return (
    <span className={`inline-flex items-center rounded-[8px] border px-2.5 py-1 text-xs font-bold uppercase ${className}`}>
      {children}
    </span>
  );
}

function SchedulesHero({ nextSchedule }: { nextSchedule: PrivateSchedule }) {
  return (
    <section
      className="overflow-hidden rounded-[8px] border border-white/70 bg-white text-slate-950 shadow-[0_34px_120px_rgba(15,23,42,0.18)]"
      aria-labelledby="schedules-title"
    >
      <div className="grid min-h-[30rem] gap-0 xl:grid-cols-[minmax(0,1.08fr)_31rem]">
        <div className="relative overflow-hidden p-6 md:p-8">
          <div
            className="pointer-events-none absolute -left-28 top-12 size-80 rounded-full bg-blue-500/10 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-0 right-0 h-52 w-[44rem] rounded-tl-full border border-blue-100 bg-[radial-gradient(circle_at_65%_100%,rgba(250,204,21,0.2),rgba(37,99,235,0.08)_42%,transparent_70%)]"
            aria-hidden
          />

          <div className="relative flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase text-blue-800">
              <LockKeyhole size={14} aria-hidden />
              Owner-only
            </span>
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold uppercase text-emerald-800">
              <FileSearch size={14} aria-hidden />
              Evidence-first
            </span>
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs font-bold uppercase text-amber-800">
              <ShieldCheck size={14} aria-hidden />
              No scheduler controls
            </span>
          </div>

          <div className="relative mt-10 max-w-4xl">
            <p className="text-sm font-semibold text-blue-700">Read-only rhythm register</p>
            <h2 id="schedules-title" className="mt-3 max-w-4xl text-4xl font-semibold leading-[1.02] text-slate-950 md:text-5xl">
              Keep the assistant rhythm visible without turning the web page into a scheduler.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
              Schedules are owner-facing agreements about cadence, evidence, and review. This page can show what is
              expected next, what proof is missing, and what must stay outside the browser.
            </p>
          </div>

          <div className="relative mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {scheduleMetrics.map((metric) => (
              <div key={metric.label} className="rounded-[8px] border border-slate-200 bg-white/82 p-4 shadow-[0_18px_70px_rgba(37,99,235,0.08)] backdrop-blur">
                <p className="text-xs font-bold uppercase text-slate-500">{metric.label}</p>
                <strong className="mt-2 block text-3xl font-semibold text-slate-950">{metric.value}</strong>
                <p className="mt-2 text-sm leading-5 text-slate-600">{metric.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <section
          className="relative border-t border-slate-200 bg-[linear-gradient(180deg,#f7fbff,#edf5ff)] p-5 md:p-6 xl:border-l xl:border-t-0"
          aria-labelledby="next-schedule-title"
        >
          <div className="pointer-events-none absolute inset-x-6 top-6 h-48 rounded-full bg-blue-500/12 blur-3xl" aria-hidden />
          <div className="relative rounded-[8px] border border-white bg-white/78 p-5 shadow-[0_20px_80px_rgba(37,99,235,0.1)] backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">Next operating window</p>
                <h3 id="next-schedule-title" className="mt-1 text-2xl font-semibold text-slate-950">
                  {nextSchedule.name}
                </h3>
                <p className="mt-1 text-xs font-bold uppercase text-blue-700">{nextSchedule.window.label}</p>
              </div>
              <span className="flex size-12 items-center justify-center rounded-[8px] bg-blue-600 text-white">
                <CalendarClock size={23} aria-hidden />
              </span>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-600">{nextSchedule.purpose}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <LightStatusBadge tone={nextSchedule.tone}>{nextSchedule.state}</LightStatusBadge>
              <LightStatusBadge tone={nextSchedule.accessTone}>{nextSchedule.access}</LightStatusBadge>
            </div>
          </div>

          <div className="relative mt-4 grid gap-3">
            <div className="rounded-[8px] border border-blue-100 bg-white/78 p-4">
              <p className="text-xs font-bold uppercase text-slate-500">Next action</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-950">{nextSchedule.nextAction}</p>
            </div>
            <div className="rounded-[8px] border border-amber-100 bg-amber-50/80 p-4">
              <p className="text-xs font-bold uppercase text-amber-800">Owner gate</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-950">{nextSchedule.ownerGate}</p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

function RhythmLanes() {
  return (
    <section className="panel p-5" aria-labelledby="rhythm-lanes-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <Waypoints size={22} aria-hidden />
            <h2 id="rhythm-lanes-title" className="text-2xl font-semibold text-white">
              Operating rhythm
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            The schedule map shows when context is supposed to become readable, who owns the loop, and which boundary
            keeps it from becoming an execution surface.
          </p>
        </div>
        <StatusBadge tone="private">Owner visible</StatusBadge>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {scheduleRhythmLanes.map((lane, index) => (
          <article key={lane.label} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <span
                className="flex size-9 items-center justify-center rounded-[8px] border border-sky-200/35 bg-sky-200/16 text-xs font-semibold text-white"
                aria-hidden
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <StatusBadge tone={lane.tone}>{lane.state}</StatusBadge>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">{lane.label}</h3>
            <p className="mt-1 text-xs font-bold uppercase text-yellow-100">{lane.time}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{lane.detail}</p>
            <p className="mt-4 rounded-[8px] border border-slate-700 bg-[#07111f]/70 p-3 text-xs leading-5 text-slate-400">
              Owner: {lane.owner}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ScheduleCard({ schedule, index }: { schedule: PrivateSchedule; index: number }) {
  return (
    <article className="panel p-5" aria-labelledby={`schedule-${schedule.id}`}>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow">
                {String(index + 1).padStart(2, "0")} - {schedule.cadence}
              </p>
              <h3 id={`schedule-${schedule.id}`} className="mt-2 text-2xl font-semibold text-white">
                {schedule.name}
              </h3>
              <p className="mt-2 text-xs font-bold uppercase text-slate-400">
                {schedule.owner} - {schedule.nextWindow} - {schedule.access}
              </p>
            </div>
            <StatusBadge tone={schedule.tone}>{schedule.state}</StatusBadge>
          </div>

          <p className="mt-5 max-w-4xl text-sm leading-6 text-slate-300">{schedule.purpose}</p>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <p className="text-xs font-bold uppercase text-slate-400">Next action</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{schedule.nextAction}</p>
            </div>
            <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <p className="text-xs font-bold uppercase text-slate-400">Safety boundary</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{schedule.safety}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {schedule.evidence.map((evidence) => (
              <div key={`${schedule.id}-${evidence.label}`} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-bold uppercase text-slate-400">{evidence.label}</p>
                  <StatusBadge tone={evidence.tone}>{evidence.state}</StatusBadge>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{evidence.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="grid content-start gap-4">
          <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <div className="flex items-center gap-2 text-sky-100">
              <Clock3 size={17} aria-hidden />
              <p className="text-sm font-semibold">Window</p>
            </div>
            <p className="mt-3 text-xs font-bold uppercase text-slate-400">{schedule.window.time}</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{schedule.window.detail}</p>
            <p className="mt-4 text-xs font-bold uppercase text-slate-400">Last run</p>
            <p className="mt-1 text-sm text-slate-300">{schedule.lastRun}</p>
          </div>

          <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <div className="flex items-center gap-2 text-emerald-100">
              <CheckCircle2 size={17} aria-hidden />
              <p className="text-sm font-semibold">Dependencies</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {schedule.dependencies.map((dependency) => (
                <span key={`${schedule.id}-${dependency}`} className="rounded-[8px] border border-slate-700 bg-[#07111f]/70 px-2.5 py-1 text-xs text-slate-300">
                  {dependency}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <div className="flex items-center gap-2 text-yellow-100">
              <XCircle size={17} aria-hidden />
              <p className="text-sm font-semibold">No-go actions</p>
            </div>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-300">
              {schedule.noGo.map((item) => (
                <li key={`${schedule.id}-${item}`} className="flex gap-2">
                  <LockKeyhole className="mt-1 shrink-0 text-yellow-100" size={15} aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </article>
  );
}

function SchedulePolicyRail() {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <section className="panel p-5" aria-labelledby="schedule-policy-title">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-yellow-100">
              <ShieldCheck size={22} aria-hidden />
              <h2 id="schedule-policy-title" className="text-2xl font-semibold text-white">
                Scheduler boundary
              </h2>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              This page can explain cadence and owner gates. It cannot create, pause, resume, delete, edit, or dispatch
              recurring jobs.
            </p>
          </div>
          <StatusBadge tone="private">Read-only</StatusBadge>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {scheduleControlPolicy.map((rule) => (
            <div key={rule} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 text-sm leading-6 text-slate-300">
              {rule}
            </div>
          ))}
        </div>
      </section>

      <aside className="panel p-5" aria-labelledby="schedule-unavailable-title">
        <div className="flex items-center gap-2 text-yellow-100">
          <BellRing size={20} aria-hidden />
          <h2 id="schedule-unavailable-title" className="text-2xl font-semibold text-white">
            Unavailable
          </h2>
        </div>
        <div className="mt-5 grid gap-2">
          {unavailableControls.map((item) => (
            <div key={item} className="flex items-center justify-between gap-3 rounded-[8px] border border-slate-700 bg-white/[0.045] px-3 py-2 text-sm text-slate-300">
              <span>{item}</span>
              <StatusBadge tone="private">Unavailable</StatusBadge>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

function EmptyScheduleRegister() {
  return (
    <section className="panel p-6 md:p-7" aria-labelledby="schedule-empty-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <CalendarClock size={22} aria-hidden />
            <h2 id="schedule-empty-title" className="text-2xl font-semibold text-white">
              Register empty
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            No owner-visible recurring schedules are available in this private mock source. The page remains read-only
            and does not expose scheduler commands or mutation controls.
          </p>
        </div>
        <StatusBadge tone="private">Owner-only</StatusBadge>
      </div>
    </section>
  );
}

export default async function SchedulesPage() {
  await requireOwnerSession("/app/schedules");
  const nextSchedule = privateSchedules[0];

  if (!nextSchedule) {
    return (
      <div className="grid gap-5">
        <h1 className="sr-only">Private schedules rhythm register</h1>
        <EmptyScheduleRegister />
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <h1 className="sr-only">Private schedules rhythm register</h1>
      <SchedulesHero nextSchedule={nextSchedule} />
      <RhythmLanes />

      <section className="panel p-5" aria-labelledby="schedule-register-title">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-100">
              <Repeat2 size={22} aria-hidden />
              <h2 id="schedule-register-title" className="text-2xl font-semibold text-white">
                Schedule register
              </h2>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Each recurring loop shows its next window, owner gate, evidence state, and blocked control path.
            </p>
          </div>
          <StatusBadge tone="warning">No mutation path</StatusBadge>
        </div>

        <div className="mt-5 grid gap-4">
          {privateSchedules.map((schedule, index) => (
            <ScheduleCard key={schedule.id} schedule={schedule} index={index} />
          ))}
        </div>
      </section>

      <SchedulePolicyRail />
    </div>
  );
}
