import { Bot, Boxes, CheckCircle2, ClipboardCheck, FileText, GitBranch, LockKeyhole, Radio } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import {
  commandAgents,
  commandApprovals,
  commandAuditRules,
  commandDraft,
  commandOutputShelf,
  commandPlanStages,
  commandSurfaceStatus
} from "@/lib/command-surface";

const toneMap = {
  normal: "normal",
  info: "info",
  warning: "warning",
  private: "private"
} as const;

const agentIcons = {
  Orchestrator: Bot,
  Implementation: Boxes,
  Evidence: GitBranch,
  "Research-only": FileText
} as const;

export function CommandDashboardMock() {
  return (
    <div className="grid gap-5">
      <section className="panel p-6 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Owner command surface</p>
            <h2 className="mt-2 max-w-4xl text-3xl font-semibold text-white md:text-4xl">
              Draft plans, inspect handoffs, and approve work without opening an execution path.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
              This page models the owner command workflow before any runtime write API exists. It separates draft,
              plan, approval, and output states so future execution can be audited instead of hidden.
            </p>
          </div>
          <div className="rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 px-4 py-3">
            <p className="text-xs font-bold uppercase text-yellow-100">Safety boundary</p>
            <p className="mt-2 max-w-xs text-sm font-semibold leading-6 text-white">
              Draft-only. No command is sent from this page.
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-4">
          {[
            ["Mode", commandSurfaceStatus.mode],
            ["Runtime", commandSurfaceStatus.runtime],
            ["Approval", commandSurfaceStatus.approval],
            ["Audit", commandSurfaceStatus.audit]
          ].map(([label, value]) => (
            <div key={label} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
              <p className="mt-2 text-lg font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.15fr)_24rem]">
        <div className="panel p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Draft pad</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">{commandDraft.title}</h2>
            </div>
            <Radio className="text-sky-100" size={24} aria-hidden />
          </div>
          <blockquote className="mt-5 rounded-[8px] border border-slate-700 bg-[#08111f] p-4 text-sm leading-7 text-slate-200">
            {commandDraft.prompt}
          </blockquote>
          <p className="mt-4 rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 p-4 text-sm font-semibold leading-6 text-yellow-50">
            {commandDraft.boundary}
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {commandPlanStages.map((stage) => (
              <article key={stage.label} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
                <StatusBadge tone={toneMap[stage.tone]}>{stage.state}</StatusBadge>
                <h3 className="mt-4 text-lg font-semibold text-white">{stage.label}</h3>
                <p className="mt-2 text-xs font-bold uppercase text-yellow-100">{stage.owner}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="grid content-start gap-4">
          <section className="panel p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow">Approval flow</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Owner checkpoints</h2>
              </div>
              <ClipboardCheck className="text-yellow-100" size={24} aria-hidden />
            </div>
            <div className="mt-5 grid gap-3">
              {commandApprovals.map((approval) => (
                <article key={approval.title} className="rounded-[8px] border border-slate-700 bg-white/5 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-white">{approval.title}</h3>
                    <StatusBadge tone={toneMap[approval.tone]}>{approval.state}</StatusBadge>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{approval.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="panel p-5">
            <div className="flex items-center gap-2 text-yellow-100">
              <LockKeyhole size={18} aria-hidden />
              <h2 className="font-semibold">Execution status</h2>
            </div>
            <div className="mt-4 grid gap-2">
              {["Runtime write", "Tool dispatch", "File mutation", "Public publish"].map((item) => (
                <div key={item} className="rounded-[8px] border border-slate-700 bg-white/5 px-3 py-2 text-sm text-slate-300">
                  {item}: unavailable
                </div>
              ))}
            </div>
          </section>
        </aside>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="panel p-5">
          <p className="eyebrow">Agent handoffs</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Who owns the next decision</h2>
          <div className="mt-5 grid gap-3">
            {commandAgents.map((agent) => {
              const Icon = agentIcons[agent.role];

              return (
                <article key={agent.name} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 items-center justify-center rounded-[8px] bg-sky-300/10 text-sky-100">
                      <Icon size={19} aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">{agent.name}</h3>
                      <p className="mt-1 text-xs font-bold uppercase text-yellow-100">{agent.role}</p>
                      <p className="mt-3 text-sm leading-6 text-slate-300">{agent.focus}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </article>

        <article className="panel p-5">
          <p className="eyebrow">Output shelf</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">What must exist before review closes</h2>
          <div className="mt-5 grid gap-3">
            {commandOutputShelf.map((item) => (
              <article key={item.title} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <span className="text-xs font-bold uppercase text-yellow-100">{item.state}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{item.detail}</p>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="panel p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Audit boundary</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Rules before command execution exists</h2>
          </div>
          <CheckCircle2 className="text-emerald-200" size={24} aria-hidden />
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {commandAuditRules.map((rule) => (
            <div key={rule} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 text-sm leading-6 text-slate-300">
              {rule}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
