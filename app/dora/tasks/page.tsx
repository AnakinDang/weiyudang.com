import type { Metadata } from "next";
import { ClipboardList, ShieldCheck } from "lucide-react";
import { DoraOfficeShell } from "@/components/DoraOfficeShell";
import { StatusBadge } from "@/components/StatusBadge";
import { publicDoraTasks, publicDoraTaskStats } from "@/lib/dora-office";

export const metadata: Metadata = {
  title: "Dora Tasks",
  description: "Public-safe Dora Office task aggregation with opaque IDs, fixed titles, and no execution controls."
};

const severityLabels = {
  normal: "Normal",
  warning: "Warning"
} as const;

export default function DoraTasksPage() {
  return (
    <DoraOfficeShell
      active="/dora/tasks"
      title="Tasks"
      summary="A public aggregation view with opaque task IDs, fixed titles, safe state counts, and no execution controls."
    >
      <div className="grid gap-5">
        <section className="grid gap-4 md:grid-cols-3">
          {publicDoraTaskStats.map((stat) => (
            <article key={stat.label} className="panel p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
                <StatusBadge tone={stat.tone}>{stat.label}</StatusBadge>
              </div>
              <p className="mt-4 text-4xl font-semibold text-slate-950">{stat.value}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-4">
          {publicDoraTasks.map((task) => (
            <article key={task.publicKey} className="panel p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] border border-[#bfdbfe] bg-[#e0f2fe] text-[#2563eb]">
                    <ClipboardList size={20} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="mono text-xs text-slate-500">{task.publicKey}</p>
                    <h2 className="mt-1 text-xl font-semibold text-slate-950">{task.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{task.summary}</p>
                  </div>
                </div>
                <StatusBadge tone={task.tone}>{task.state}</StatusBadge>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[8px] border border-[#dde7f0] bg-[#f8fafc] p-3">
                  <p className="text-xs font-semibold uppercase text-slate-500">Agent role</p>
                  <p className="mt-2 text-sm font-semibold text-slate-950">{task.agentRole}</p>
                </div>
                <div className="rounded-[8px] border border-[#dde7f0] bg-[#f8fafc] p-3">
                  <p className="text-xs font-semibold uppercase text-slate-500">Updated</p>
                  <p className="mt-2 text-sm font-semibold text-slate-950">{task.updated}</p>
                </div>
                <div className="rounded-[8px] border border-[#dde7f0] bg-[#f8fafc] p-3">
                  <p className="text-xs font-semibold uppercase text-slate-500">Severity</p>
                  <p className="mt-2 text-sm font-semibold text-slate-950">{severityLabels[task.severity]}</p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="panel p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 shrink-0 text-[#2563eb]" size={22} aria-hidden />
            <div>
              <p className="eyebrow">Public task boundary</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Aggregation, not execution</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                This view uses fixed public titles and opaque IDs only. Private task names, prompt bodies, owner notes,
                artifacts, and execution controls stay outside the public bundle.
              </p>
            </div>
          </div>
        </section>
      </div>
    </DoraOfficeShell>
  );
}
