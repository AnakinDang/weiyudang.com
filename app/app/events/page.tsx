import type { Metadata } from "next";
import { ClipboardCheck, Clock3, FileSearch, ShieldAlert } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { privateReviewQueue, reviewQueuePolicy } from "@/lib/agent-ops";

export const metadata: Metadata = {
  title: "Review Queue",
  description: "Owner-only review queue for decisions, evidence, notes, and deferrals."
};

const toneMap = {
  normal: "normal",
  info: "info",
  warning: "warning",
  private: "private"
} as const;

export default function EventsPage() {
  return (
    <div className="grid gap-5">
      <section className="panel p-6 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Review Queue</p>
            <h2 className="mt-2 max-w-4xl text-3xl font-semibold text-white md:text-4xl">
              Owner decisions needed, with evidence visible and no silent auto-promotion.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
              This private queue tracks approvals, rejects, notes, and deferrals as review states. It does not execute
              approvals, publish content, dispatch tools, or mutate private systems.
            </p>
          </div>
          <div className="rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 px-4 py-3">
            <p className="text-xs font-bold uppercase text-yellow-100">Mode</p>
            <p className="mt-2 max-w-xs text-sm font-semibold leading-6 text-white">Read-only decision register.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_24rem]">
        <div className="grid gap-4">
          {privateReviewQueue.map((item) => (
            <article key={item.title} className="panel p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">{item.urgency}</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{item.title}</h3>
                </div>
                <StatusBadge tone={toneMap[item.tone]}>{item.decision}</StatusBadge>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-[0.75fr_1fr]">
                <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
                  <p className="text-xs font-bold uppercase text-slate-400">Owner / agent</p>
                  <p className="mt-2 text-sm font-semibold text-white">{item.owner}</p>
                  <p className="mt-1 text-sm text-slate-300">{item.agent}</p>
                </div>
                <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
                  <p className="text-xs font-bold uppercase text-slate-400">Review note</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.note}</p>
                </div>
              </div>
              <div className="mt-4 rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
                <div className="flex items-center gap-2 text-sky-100">
                  <FileSearch size={17} aria-hidden />
                  <p className="text-sm font-semibold">Evidence expected</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.evidence.map((evidence) => (
                    <span key={evidence} className="rounded-[8px] border border-slate-700 bg-white/5 px-2.5 py-1 text-xs text-slate-300">
                      {evidence}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="grid content-start gap-4">
          <section className="panel p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow">Policy</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Review rules</h2>
              </div>
              <ShieldAlert className="text-yellow-100" size={24} aria-hidden />
            </div>
            <div className="mt-5 grid gap-3">
              {reviewQueuePolicy.map((rule) => (
                <div key={rule} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-3 text-sm leading-6 text-slate-300">
                  {rule}
                </div>
              ))}
            </div>
          </section>

          <section className="panel p-5">
            <div className="flex items-center gap-2 text-yellow-100">
              <Clock3 size={18} aria-hidden />
              <h2 className="font-semibold">Deferred by design</h2>
            </div>
            <div className="mt-4 grid gap-2">
              {["One-click approve", "Reject-and-run", "Public publish", "Runtime dispatch"].map((item) => (
                <div key={item} className="rounded-[8px] border border-slate-700 bg-white/5 px-3 py-2 text-sm text-slate-300">
                  {item}: unavailable
                </div>
              ))}
            </div>
          </section>

          <section className="panel-quiet p-4">
            <div className="flex gap-3 text-sm leading-6 text-slate-300">
              <ClipboardCheck className="mt-0.5 shrink-0 text-sky-100" size={17} aria-hidden />
              A future approval API needs authentication, audit logging, explicit owner action, and rollback behavior
              before any button appears here.
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}
