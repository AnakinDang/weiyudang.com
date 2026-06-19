"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Boxes,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  GitBranch,
  LockKeyhole,
  Radio,
  RotateCcw,
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
  commandReadinessChecks,
  commandReviewPacket,
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

function LightStatusBadge({ children, tone }: { children: React.ReactNode; tone: Tone }) {
  const className = {
    normal: "border-emerald-200 bg-emerald-50 text-emerald-800",
    info: "border-blue-200 bg-blue-50 text-blue-800",
    warning: "border-amber-200 bg-amber-50 text-amber-800",
    private: "border-slate-200 bg-slate-50 text-slate-700"
  }[tone];

  return (
    <span className={`inline-flex items-center rounded-[8px] border px-2.5 py-1 text-xs font-bold uppercase ${className}`}>
      {children}
    </span>
  );
}

function CommandWorkspace({
  activeMode,
  setActiveMode
}: {
  activeMode: CommandMode;
  setActiveMode: (mode: CommandMode) => void;
}) {
  const [draft, setDraft] = useState<string>(commandDraft.prompt);
  const activePanel = commandModePanels[activeMode];
  const draftWords = useMemo(() => draft.trim().split(/\s+/).filter(Boolean).length, [draft]);
  const draftLines = useMemo(() => draft.split(/\n/).filter((line) => line.trim().length > 0).length, [draft]);

  return (
    <section
      className="overflow-hidden rounded-[8px] border border-white/70 bg-white text-slate-950 shadow-[0_34px_120px_rgba(15,23,42,0.18)]"
      aria-labelledby="owner-command-title"
    >
      <div className="grid min-h-[34rem] gap-0 xl:grid-cols-[minmax(0,1.08fr)_30rem]">
        <div className="relative overflow-hidden p-6 md:p-8">
          <div
            className="pointer-events-none absolute -right-28 -top-32 size-96 rounded-full bg-blue-500/12 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-0 left-1/2 h-44 w-[46rem] -translate-x-1/2 rounded-t-full border border-blue-100 bg-[radial-gradient(circle_at_50%_100%,rgba(37,99,235,0.14),transparent_62%)]"
            aria-hidden
          />

          <div className="relative flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase text-blue-800">
              <LockKeyhole size={14} aria-hidden />
              Owner-only
            </span>
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold uppercase text-emerald-800">
              <Radio size={14} aria-hidden />
              Draft-only
            </span>
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs font-bold uppercase text-amber-800">
              <ShieldCheck size={14} aria-hidden />
              No dispatch
            </span>
          </div>

          <div className="relative mt-10 max-w-4xl">
            <p className="text-sm font-semibold text-blue-700">{commandSurfaceStatus.posture}</p>
            <h2 id="owner-command-title" className="mt-3 max-w-4xl text-4xl font-semibold leading-[1.02] text-slate-950 md:text-5xl">
              Draft a mission before anything moves.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
              Command is the owner-level surface for shaping intent, previewing a plan, and preparing the exact review
              packet that must pass before implementation, publishing, or runtime work happens.
            </p>
          </div>

          <div className="relative mt-7 rounded-[8px] border border-slate-200 bg-white/82 p-4 shadow-[0_18px_70px_rgba(37,99,235,0.1)] backdrop-blur">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">Draft pad</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-950">{commandDraft.title}</h3>
              </div>
              <LightStatusBadge tone="private">{commandSurfaceStatus.mode}</LightStatusBadge>
            </div>
            <textarea
              aria-label="Owner command draft"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              className="mt-4 min-h-40 w-full resize-y rounded-[8px] border border-slate-200 bg-slate-50/80 p-4 text-sm leading-7 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white"
              placeholder="Describe intent, constraints, evidence needed, and review gates."
            />
            <div className="mt-3 grid gap-3 text-sm text-slate-600 sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="flex flex-wrap gap-3">
                <span>
                  <strong className="text-slate-950">{draftWords}</strong> words
                </span>
                <span>
                  <strong className="text-slate-950">{draftLines}</strong> active lines
                </span>
                <span>{commandSurfaceStatus.runtime}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveMode("Review packet")}
                  className="link-focus inline-flex items-center gap-2 rounded-[8px] bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(37,99,235,0.2)] transition hover:bg-blue-700"
                >
                  Prepare packet
                  <ArrowRight size={15} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => setDraft(commandDraft.prompt)}
                  className="link-focus inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
                >
                  <RotateCcw size={15} aria-hidden />
                  Reset
                </button>
                <button
                  type="button"
                  disabled
                  className="inline-flex cursor-not-allowed items-center gap-2 rounded-[8px] border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-400"
                >
                  Dispatch unavailable
                </button>
              </div>
            </div>
          </div>

          <div className="relative mt-5 flex flex-wrap gap-2" role="group" aria-label="Command context lens selector">
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
                      ? "border-blue-200 bg-blue-50 text-blue-800"
                      : "border-slate-200 bg-white/72 text-slate-600 hover:border-blue-200 hover:text-blue-700"
                  }`}
                >
                  <Icon size={16} aria-hidden />
                  {mode}
                </button>
              );
            })}
          </div>
        </div>

        <section
          className="relative border-t border-slate-200 bg-[linear-gradient(180deg,#f7fbff,#edf5ff)] p-5 md:p-6 xl:border-l xl:border-t-0"
          aria-labelledby="command-mode-title"
        >
          <div
            className="pointer-events-none absolute inset-x-6 top-6 h-48 rounded-full bg-blue-500/12 blur-3xl"
            aria-hidden
          />
          <div className="relative rounded-[8px] border border-white bg-white/78 p-5 shadow-[0_20px_80px_rgba(37,99,235,0.1)] backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">Active lens</p>
                <h3 id="command-mode-title" className="mt-1 text-xl font-semibold text-slate-950">
                  {activePanel.title}
                </h3>
              </div>
              <span className="flex size-11 items-center justify-center rounded-[8px] bg-blue-600 text-white">
                <Sparkles size={21} aria-hidden />
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{activePanel.detail}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <LightStatusBadge tone={safeTone(activePanel.tone)}>{activePanel.state}</LightStatusBadge>
              <LightStatusBadge tone="private">{commandSurfaceStatus.dispatch}</LightStatusBadge>
            </div>
          </div>

          <section
            className="relative mt-4 rounded-[8px] border border-blue-100 bg-white/78 p-5"
            aria-labelledby="command-review-packet-title"
          >
            <p className="text-xs font-bold uppercase text-slate-500">Review packet</p>
            <h3 id="command-review-packet-title" className="mt-1 text-xl font-semibold text-slate-950">
              {commandReviewPacket.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{commandReviewPacket.summary}</p>
            <div className="mt-4 grid gap-3">
              {commandReviewPacket.sections.map((section) => (
                <div key={section.label} className="grid grid-cols-[5.5rem_1fr] gap-3 rounded-[8px] border border-blue-100 bg-white/72 p-3">
                  <span className="text-xs font-bold uppercase text-slate-500">{section.label}</span>
                  <span className="text-sm font-semibold text-slate-950">{section.value}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="relative mt-4 grid gap-3">
            {commandReadinessChecks.map((check) => (
              <article key={check.label} className="rounded-[8px] border border-blue-100 bg-white/72 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold text-slate-950">{check.label}</h4>
                  <LightStatusBadge tone={safeTone(check.tone)}>{check.state}</LightStatusBadge>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-600">{check.detail}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

function PlanPreview() {
  return (
    <section className="panel overflow-hidden p-0" aria-labelledby="command-plan-title">
      <div className="grid gap-0 xl:grid-cols-[20rem_minmax(0,1fr)]">
        <div className="border-b border-slate-700 bg-white/[0.035] p-5 md:p-6 xl:border-b-0 xl:border-r">
          <div className="flex size-11 items-center justify-center rounded-[8px] border border-sky-200/25 bg-sky-300/10 text-sky-100">
            <Waypoints size={22} aria-hidden />
          </div>
          <p className="eyebrow mt-5">Plan preview</p>
          <h2 id="command-plan-title" className="mt-2 text-2xl font-semibold text-white">
            Five gates before work moves.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            A command becomes a staged plan before it becomes implementation. Interpretation, design, implementation,
            verification, and review stay separate.
          </p>
        </div>
        <div className="grid gap-3 p-4 md:p-5 xl:grid-cols-5">
          {commandPlanStages.map((stage, index) => (
            <article key={stage.label} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <div className="flex items-start justify-between gap-3">
                <span
                  className="flex size-9 items-center justify-center rounded-[8px] border border-sky-200/35 bg-sky-200/16 text-xs font-semibold text-white"
                  aria-hidden
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <StatusBadge tone={safeTone(stage.tone)}>{stage.state}</StatusBadge>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{stage.label}</h3>
              <p className="mt-1 text-xs font-bold uppercase text-yellow-100">{stage.owner}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{stage.detail}</p>
              <p className="mt-4 rounded-[8px] border border-slate-700 bg-[#07111f]/70 p-3 text-xs leading-5 text-slate-400">
                {stage.proof}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ApprovalGate() {
  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <section className="panel p-5" aria-labelledby="command-approval-title">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-yellow-100">
              <ClipboardCheck size={22} aria-hidden />
              <h2 id="command-approval-title" className="text-2xl font-semibold text-white">
                Owner checkpoints
              </h2>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              The command surface separates allowed review from blocked execution so the next decision is obvious.
            </p>
          </div>
          <StatusBadge tone="warning">Owner review required</StatusBadge>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {commandApprovals.map((approval) => (
            <article key={approval.title} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-white">{approval.title}</h3>
                <StatusBadge tone={safeTone(approval.tone)}>{approval.state}</StatusBadge>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{approval.detail}</p>
              <p className="mt-3 rounded-[8px] border border-slate-700 bg-[#07111f]/70 p-3 text-xs leading-5 text-slate-400">
                {approval.decision}
              </p>
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
    </section>
  );
}

function AgentRouting() {
  return (
    <section className="panel p-5" aria-labelledby="command-agent-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <Bot size={22} aria-hidden />
            <h2 id="command-agent-title" className="text-2xl font-semibold text-white">
              Agent routing
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            The command surface shows who owns the next decision instead of hiding responsibility behind a single
            assistant response.
          </p>
        </div>
        <StatusBadge tone="info">Visible responsibility</StatusBadge>
      </div>
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
      <CommandWorkspace activeMode={activeMode} setActiveMode={setActiveMode} />
      <PlanPreview />
      <ApprovalGate />
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
