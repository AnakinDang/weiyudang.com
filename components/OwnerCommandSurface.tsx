"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Bot,
  Boxes,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  GitBranch,
  LockKeyhole,
  Radio,
  ShieldCheck,
  Sparkles,
  Waypoints
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { UnavailableControlsPanel } from "@/components/UnavailableControlsPanel";
import {
  commandAgents,
  commandApprovals,
  commandAuditRules,
  commandDraft,
  commandEvidenceRequirements,
  commandModePanels,
  commandModeTabs,
  commandOutputShelf,
  commandPlanStages,
  commandSurfaceStatus,
  commandUnavailableActions
} from "@/lib/command-surface";

type CommandMode = (typeof commandModeTabs)[number];
type Tone = "normal" | "info" | "warning" | "private";

const agentIcons = {
  Orchestrator: Bot,
  Product: Sparkles,
  Implementation: Boxes,
  Evidence: GitBranch,
  "Research-only": FileSearch
} as const;

const modeIcons = {
  Draft: Radio,
  "Plan preview": Waypoints,
  "Review packet": ClipboardCheck,
  Evidence: FileSearch,
  Audit: ShieldCheck
} as const;

function safeTone(tone: string): Tone {
  if (tone === "normal" || tone === "warning" || tone === "private") {
    return tone;
  }

  return "info";
}

function CommandComposer({
  activeMode,
  setActiveMode
}: {
  activeMode: CommandMode;
  setActiveMode: (mode: CommandMode) => void;
}) {
  const [draft, setDraft] = useState<string>(commandDraft.prompt);
  const activePanel = commandModePanels[activeMode];
  const draftWords = useMemo(() => draft.trim().split(/\s+/).filter(Boolean).length, [draft]);

  return (
    <section className="panel overflow-hidden p-0" aria-labelledby="owner-command-title">
      <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="p-5 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sky-100">
                <Bot size={24} aria-hidden />
                <h2 id="owner-command-title" className="text-3xl font-semibold text-white md:text-5xl">
                  Owner Command
                </h2>
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
                Shape intent, inspect the plan, and prepare an Opus review packet before any runtime API exists.
              </p>
            </div>
            <StatusBadge tone="private">{commandSurfaceStatus.mode}</StatusBadge>
          </div>

          <div className="mt-6 rounded-[8px] border border-slate-700 bg-[#07101d] p-4 shadow-inner shadow-black/20">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Draft pad</p>
                <h3 className="mt-1 text-xl font-semibold text-white">{commandDraft.title}</h3>
              </div>
              <div className="rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 px-3 py-2 text-xs font-semibold text-yellow-50">
                No runtime dispatch
              </div>
            </div>
            <textarea
              aria-label="Owner command draft"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              className="mt-4 min-h-36 w-full resize-y rounded-[8px] border border-slate-700 bg-black/20 p-4 text-sm leading-7 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-200/60"
              placeholder="Describe intent, constraints, evidence needed, and review gates."
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <span>{draftWords} words in local draft state</span>
              <span>No command is sent from this page.</span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Command context lens selector">
            {commandModeTabs.map((mode) => {
              const Icon = modeIcons[mode];
              const active = activeMode === mode;

              return (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveMode(mode)}
                  className={`link-focus inline-flex items-center gap-2 rounded-[8px] border px-3 py-2 text-sm font-semibold transition ${
                    active
                      ? "border-sky-200/40 bg-sky-300/15 text-sky-50"
                      : "border-slate-700 bg-white/[0.035] text-slate-300 hover:border-sky-200/30 hover:text-white"
                  }`}
                >
                  <Icon size={16} aria-hidden />
                  {mode}
                </button>
              );
            })}
          </div>
        </div>

        <aside className="border-t border-slate-700/60 bg-white/[0.035] p-5 xl:border-l xl:border-t-0">
          <div className="flex items-start gap-3">
            <span className="flex size-10 items-center justify-center rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 text-yellow-100">
              <ShieldCheck size={20} aria-hidden />
            </span>
            <div>
              <p className="eyebrow">Active mode</p>
              <h3 className="mt-1 text-2xl font-semibold text-white">{activePanel.title}</h3>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-300">{activePanel.detail}</p>
          <div className="mt-5">
            <StatusBadge tone={safeTone(activePanel.tone)}>{activePanel.state}</StatusBadge>
          </div>
          <div className="mt-6 grid gap-3">
            {[
              ["Runtime", commandSurfaceStatus.runtime],
              ["Approval", commandSurfaceStatus.approval],
              ["Audit", commandSurfaceStatus.audit]
            ].map(([label, value]) => (
              <div key={label} className="grid grid-cols-[6rem_1fr] gap-3 border-t border-slate-700/70 pt-3">
                <span className="text-xs font-bold uppercase text-slate-400">{label}</span>
                <span className="text-sm font-semibold text-white">{value}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

function PlanPreview() {
  return (
    <section className="panel p-5" aria-labelledby="command-plan-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <Waypoints size={22} aria-hidden />
            <h2 id="command-plan-title" className="text-2xl font-semibold text-white">
              Plan preview
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            A command becomes a staged plan before it becomes work. This keeps interpretation, design, implementation,
            verification, and review separate.
          </p>
        </div>
        <StatusBadge tone="warning">Owner review required</StatusBadge>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-5">
        {commandPlanStages.map((stage, index) => (
          <article key={stage.label} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <span className="mono text-xs text-slate-500">0{index + 1}</span>
              <StatusBadge tone={safeTone(stage.tone)}>{stage.state}</StatusBadge>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">{stage.label}</h3>
            <p className="mt-1 text-xs font-bold uppercase text-yellow-100">{stage.owner}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{stage.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ApprovalGate() {
  return (
    <aside className="grid content-start gap-4">
      <section className="panel p-5" aria-labelledby="command-approval-title">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="eyebrow">Approval gate</p>
            <h2 id="command-approval-title" className="mt-2 text-2xl font-semibold text-white">
              Owner checkpoints
            </h2>
          </div>
          <ClipboardCheck className="text-yellow-100" size={24} aria-hidden />
        </div>
        <div className="mt-5 grid gap-3">
          {commandApprovals.map((approval) => (
            <article key={approval.title} className="rounded-[8px] border border-slate-700 bg-white/5 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-white">{approval.title}</h3>
                <StatusBadge tone={safeTone(approval.tone)}>{approval.state}</StatusBadge>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">{approval.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <UnavailableControlsPanel
        eyebrow="Blocked actions"
        title="No command execution"
        items={commandUnavailableActions}
        note="This cockpit can prepare a command packet only. It cannot dispatch tools, mutate files, publish, or approve itself."
      />
    </aside>
  );
}

function AgentRouting() {
  return (
    <section className="panel p-5" aria-labelledby="command-agent-title">
      <div className="flex items-center gap-2 text-sky-100">
        <Bot size={22} aria-hidden />
        <h2 id="command-agent-title" className="text-2xl font-semibold text-white">
          Agent routing
        </h2>
      </div>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
        The command surface shows who owns the next decision instead of hiding responsibility behind a single assistant
        response.
      </p>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {commandAgents.map((agent) => {
          const Icon = agentIcons[agent.role];

          return (
            <article key={agent.name} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <div className="flex items-start justify-between gap-3">
                <span className="flex size-10 items-center justify-center rounded-[8px] bg-sky-300/10 text-sky-100">
                  <Icon size={19} aria-hidden />
                </span>
                <StatusBadge tone={safeTone(agent.tone)}>{agent.state}</StatusBadge>
              </div>
              <h3 className="mt-4 font-semibold text-white">{agent.name}</h3>
              <p className="mt-1 text-xs font-bold uppercase text-yellow-100">{agent.role}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{agent.focus}</p>
              <p className="mt-3 rounded-[8px] border border-slate-700 bg-black/15 p-3 text-xs leading-5 text-slate-400">
                Next: {agent.next}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function EvidenceShelf() {
  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <section className="panel p-5" aria-labelledby="command-evidence-title">
        <div className="flex items-center gap-2 text-yellow-100">
          <FileSearch size={22} aria-hidden />
          <h2 id="command-evidence-title" className="text-2xl font-semibold text-white">
            Evidence required
          </h2>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          A command cannot move to PR/deploy without evidence that matches the scope of the requested slice.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {commandEvidenceRequirements.map((item) => (
            <article key={item.title} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-semibold text-white">{item.title}</h3>
                <StatusBadge tone={safeTone(item.tone)}>{item.state}</StatusBadge>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel p-5" aria-labelledby="command-output-title">
        <div className="flex items-center gap-2 text-sky-100">
          <ClipboardCheck size={20} aria-hidden />
          <h2 id="command-output-title" className="text-xl font-semibold text-white">
            Output shelf
          </h2>
        </div>
        <div className="mt-4 grid gap-3">
          {commandOutputShelf.map((item) => (
            <article key={item.title} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                <span className="text-xs font-bold uppercase text-yellow-100">{item.state}</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

function AuditBoundary() {
  return (
    <section className="panel p-5" aria-labelledby="command-audit-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-200">
            <CheckCircle2 size={22} aria-hidden />
            <h2 id="command-audit-title" className="text-2xl font-semibold text-white">
              Audit boundary
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            These rules keep the command surface useful now while leaving future execution APIs explicit and auditable.
          </p>
        </div>
        <div className="rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 px-4 py-3">
          <div className="flex items-center gap-2 text-yellow-50">
            <LockKeyhole size={17} aria-hidden />
            <span className="text-sm font-semibold">No hidden execution</span>
          </div>
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {commandAuditRules.map((rule) => (
          <div key={rule} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 text-sm leading-6 text-slate-300">
            {rule}
          </div>
        ))}
      </div>
    </section>
  );
}

export function OwnerCommandSurface() {
  const [activeMode, setActiveMode] = useState<CommandMode>("Draft");

  return (
    <div className="grid gap-5">
      <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.35fr)_24rem]">
        <CommandComposer activeMode={activeMode} setActiveMode={setActiveMode} />
        <ApprovalGate />
      </section>

      <PlanPreview />
      <AgentRouting />
      <EvidenceShelf />
      <AuditBoundary />

      <section className="rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 p-4 text-sm font-semibold leading-6 text-yellow-50">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 shrink-0" size={18} aria-hidden />
          <p>{commandDraft.boundary}</p>
        </div>
      </section>
    </div>
  );
}
