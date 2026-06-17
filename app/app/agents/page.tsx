import type { Metadata } from "next";
import { Bot, Boxes, FileText, GitBranch, Radio, ShieldCheck } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { privateAgentHandoffs, privateAgentRoster } from "@/lib/agent-ops";

export const metadata: Metadata = {
  title: "Private Agents",
  description: "Owner-only MiniDora roster, leases, capabilities, and handoffs."
};

const toneMap = {
  normal: "normal",
  info: "info",
  warning: "warning",
  private: "private"
} as const;

const roleIcons = {
  Orchestrator: Bot,
  Implementation: Boxes,
  Evidence: GitBranch,
  "Trading Research": ShieldCheck,
  "Creative Production": FileText
} as const;

function sourceTone(sourceHealth: string) {
  if (sourceHealth === "Good") {
    return "normal";
  }

  if (sourceHealth === "Partial") {
    return "warning";
  }

  return "private";
}

export default function AgentsPage() {
  return (
    <div className="grid gap-5">
      <section className="panel p-6 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Private agents</p>
            <h2 className="mt-2 max-w-4xl text-3xl font-semibold text-white md:text-4xl">
              Full MiniDora roster with leases, capabilities, source health, and handoffs.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
              This owner-only roster can show private operating context after authentication. It does not expose raw
              credentials, filesystem paths, private source documents, or execution controls.
            </p>
          </div>
          <div className="rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 px-4 py-3">
            <p className="text-xs font-bold uppercase text-yellow-100">Visibility</p>
            <p className="mt-2 max-w-xs text-sm font-semibold leading-6 text-white">Authenticated owner surface only.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_24rem]">
        <div className="grid gap-5 md:grid-cols-2">
          {privateAgentRoster.map((agent) => {
            const Icon = roleIcons[agent.role];

            return (
              <article key={agent.name} className="panel p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex size-11 items-center justify-center rounded-[8px] bg-sky-300/10 text-sky-100">
                    <Icon size={21} aria-hidden />
                  </span>
                  <StatusBadge tone={toneMap[agent.tone]}>{agent.state}</StatusBadge>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{agent.name}</h3>
                <p className="mt-1 text-xs font-bold uppercase text-yellow-100">{agent.role}</p>
                <div className="mt-4 rounded-[8px] border border-slate-700 bg-white/[0.045] p-3">
                  <p className="text-xs font-bold uppercase text-slate-400">Current lease</p>
                  <p className="mt-2 text-sm font-semibold text-white">{agent.lease}</p>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-bold uppercase text-slate-400">Capabilities</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {agent.capabilities.map((capability) => (
                      <span key={capability} className="rounded-[8px] border border-slate-700 bg-white/5 px-2.5 py-1 text-xs text-slate-300">
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-300">{agent.lastOutput}</p>
                <div className="mt-4 rounded-[8px] border border-slate-700 bg-white/[0.045] p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase text-slate-400">Source health</span>
                    <StatusBadge tone={sourceTone(agent.sourceHealth)}>{agent.sourceHealth}</StatusBadge>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{agent.sourceDetail}</p>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="grid content-start gap-4">
          <section className="panel p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow">Handoffs</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Recent coordination chain</h2>
              </div>
              <Radio className="text-sky-100" size={24} aria-hidden />
            </div>
            <div className="mt-5 grid gap-3">
              {privateAgentHandoffs.map((handoff) => (
                <article key={`${handoff.time}-${handoff.from}-${handoff.to}`} className="rounded-[8px] border border-slate-700 bg-white/5 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-white">{handoff.time}</h3>
                    <StatusBadge tone={toneMap[handoff.tone]}>{handoff.state}</StatusBadge>
                  </div>
                  <p className="mt-2 text-xs font-bold uppercase text-yellow-100">
                    {handoff.from} to {handoff.to}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{handoff.summary}</p>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}
