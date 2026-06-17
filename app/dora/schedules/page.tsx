import type { Metadata } from "next";
import { CalendarClock, ShieldCheck } from "lucide-react";
import { DoraOfficeShell } from "@/components/DoraOfficeShell";
import { StatusBadge } from "@/components/StatusBadge";
import { publicScheduleBoundaries, publicSchedules } from "@/lib/dora-office";

export const metadata: Metadata = {
  title: "Dora Schedules",
  description: "Public-safe Dora Office schedule rhythm with no cron strings, local paths, prompts, or controls."
};

export default function DoraSchedulesPage() {
  return (
    <DoraOfficeShell
      active="/dora/schedules"
      title="Schedules"
      summary="A public rhythm of recurring Dora Office workflows with coarse cadence, next window, and safe state labels."
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="grid gap-5 md:grid-cols-2">
          {publicSchedules.map((schedule) => (
            <article key={schedule.name} className="panel p-5">
              <div className="flex items-start justify-between gap-3">
                <CalendarClock className="text-[#2563eb]" size={24} aria-hidden />
                <StatusBadge tone={schedule.tone}>{schedule.state}</StatusBadge>
              </div>
              <h2 className="mt-5 text-xl font-semibold text-slate-950">{schedule.name}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{schedule.summary}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[8px] border border-[#dde7f0] bg-[#f8fafc] p-3">
                  <p className="text-xs font-semibold uppercase text-slate-500">Cadence</p>
                  <p className="mt-2 text-sm font-semibold text-slate-950">{schedule.cadence}</p>
                </div>
                <div className="rounded-[8px] border border-[#dde7f0] bg-[#f8fafc] p-3">
                  <p className="text-xs font-semibold uppercase text-slate-500">Last</p>
                  <p className="mt-2 text-sm font-semibold text-slate-950">{schedule.last}</p>
                </div>
                <div className="rounded-[8px] border border-[#dde7f0] bg-[#f8fafc] p-3">
                  <p className="text-xs font-semibold uppercase text-slate-500">Next</p>
                  <p className="mt-2 text-sm font-semibold text-slate-950">{schedule.next}</p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <aside className="panel h-fit p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 shrink-0 text-[#2563eb]" size={22} aria-hidden />
            <div>
              <p className="eyebrow">Schedule boundary</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Public rhythm only</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {publicScheduleBoundaries.map((rule) => (
              <div key={rule} className="rounded-[8px] border border-[#dde7f0] bg-[#f8fafc] p-3 text-sm leading-6 text-slate-600">
                {rule}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </DoraOfficeShell>
  );
}
