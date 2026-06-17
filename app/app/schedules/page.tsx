import type { Metadata } from "next";
import { CalendarClock, ShieldCheck } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { UnavailableControlsPanel } from "@/components/UnavailableControlsPanel";
import { privateSchedules, scheduleControlPolicy } from "@/lib/operations";

export const metadata: Metadata = {
  title: "Private Schedules",
  description: "Owner-only recurring schedules and reminder rhythm for Weiyu Personal OS."
};

export default function SchedulesPage() {
  return (
    <div className="grid gap-5">
      <section className="panel p-6 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Private schedules</p>
            <h2 className="mt-2 max-w-4xl text-3xl font-semibold text-white md:text-4xl">
              Owner-only recurring jobs and reminders without exposing command strings.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
              This schedule surface summarizes cadence, next window, owner, state, and safety boundary. It does not
              render cron commands, shell paths, private prompts, or execution controls.
            </p>
          </div>
          <div className="rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 px-4 py-3">
            <p className="text-xs font-bold uppercase text-yellow-100">Mode</p>
            <p className="mt-2 max-w-xs text-sm font-semibold leading-6 text-white">Read-only schedule register.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_24rem]">
        <div className="grid gap-5 md:grid-cols-2">
          {privateSchedules.map((schedule) => (
            <article key={schedule.name} className="panel p-5">
              <div className="flex items-start justify-between gap-3">
                <CalendarClock className="text-yellow-100" size={24} aria-hidden />
                <StatusBadge tone={schedule.tone}>{schedule.state}</StatusBadge>
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">{schedule.name}</h3>
              <p className="mt-1 text-xs font-bold uppercase text-yellow-100">{schedule.owner}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-3">
                  <p className="text-xs font-bold uppercase text-slate-400">Cadence</p>
                  <p className="mt-2 text-sm font-semibold text-white">{schedule.cadence}</p>
                </div>
                <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-3">
                  <p className="text-xs font-bold uppercase text-slate-400">Next window</p>
                  <p className="mt-2 text-sm font-semibold text-white">{schedule.nextWindow}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">{schedule.summary}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <StatusBadge tone={schedule.accessTone}>{schedule.access}</StatusBadge>
                <span className="rounded-[8px] border border-slate-700 bg-white/5 px-2.5 py-1 text-xs text-slate-300">
                  {schedule.safety}
                </span>
              </div>
            </article>
          ))}
        </div>

        <aside className="grid content-start gap-4">
          <section className="panel p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow">Control policy</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Scheduler boundary</h2>
              </div>
              <ShieldCheck className="text-sky-100" size={24} aria-hidden />
            </div>
            <div className="mt-5 grid gap-3">
              {scheduleControlPolicy.map((rule) => (
                <div key={rule} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-3 text-sm leading-6 text-slate-300">
                  {rule}
                </div>
              ))}
            </div>
          </section>

          <UnavailableControlsPanel
            title="No scheduler controls"
            items={["Create job", "Pause job", "Resume job", "Delete job"]}
            note="Future schedule mutation needs owner authentication, audit logging, and rollback behavior before controls appear."
          />
        </aside>
      </section>
    </div>
  );
}
