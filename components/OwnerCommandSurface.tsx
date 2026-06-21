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

type Tone = "normal" | "info" | "warning" | "private";
type CommandMode = string;
type CommandAgentRole = "Orchestrator" | "Product" | "Implementation" | "Evidence" | "Research-only";
type CommandModeIcon = "radio" | "waypoints" | "clipboard" | "file_search" | "shield";
type CommandStatusItem = {
  title?: string;
  label?: string;
  state: string;
  tone: string;
  detail: string;
};

export type OwnerCommandSurfaceData = {
  surfaceStatus: {
    mode: string;
    runtime: string;
    posture: string;
    dispatch: string;
  };
  copy: {
    badges: readonly string[];
    heroTitle: string;
    heroDetail: string;
    draftLabel: string;
    draftAriaLabel: string;
    draftPlaceholder: string;
    preparePacketAction: string;
    resetAction: string;
    dispatchUnavailable: string;
    lensGroupLabel: string;
    activeLensLabel: string;
    reviewPacketLabel: string;
    planEyebrow: string;
    planTitle: string;
    planDetail: string;
    approvalTitle: string;
    approvalDetail: string;
    approvalStatus: string;
    blockedActionsEyebrow: string;
    blockedActionsTitle: string;
    blockedActionsNote: string;
    agentTitle: string;
    agentDetail: string;
    agentStatus: string;
    agentNextLabel: string;
    evidenceTitle: string;
    evidenceDetail: string;
    outputTitle: string;
    auditTitle: string;
    auditDetail: string;
    auditBadge: string;
  };
  draft: {
    title: string;
    prompt: string;
    boundary: string;
  };
  reviewPacket: {
    title: string;
    summary: string;
    sections: readonly {
      label: string;
      value: string;
    }[];
  };
  readinessChecks: readonly CommandStatusItem[];
  modeTabs: readonly {
    key: CommandMode;
    label: string;
    icon: CommandModeIcon;
  }[];
  modePanels: Record<string, CommandStatusItem & { title: string }>;
  reviewPacketModeKey: CommandMode;
  planStages: readonly (CommandStatusItem & {
    label: string;
    owner: string;
    proof: string;
  })[];
  approvals: readonly (CommandStatusItem & {
    title: string;
    decision: string;
  })[];
  agents: readonly {
    name: string;
    role: CommandAgentRole;
    state: string;
    tone: string;
    focus: string;
    next: string;
  }[];
  evidenceRequirements: readonly CommandStatusItem[];
  outputShelf: readonly {
    title: string;
    state: string;
    detail: string;
  }[];
  unavailableActions: readonly string[];
  auditRules: readonly string[];
};

const agentIcons = {
  Orchestrator: Bot,
  Product: Sparkles,
  Implementation: Boxes,
  Evidence: GitBranch,
  "Research-only": FileSearch
} as const;

const modeIcons = {
  radio: Radio,
  waypoints: Waypoints,
  clipboard: ClipboardCheck,
  file_search: FileSearch,
  shield: ShieldCheck
} as const satisfies Record<CommandModeIcon, typeof Radio>;

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
  setActiveMode,
  data
}: {
  activeMode: CommandMode;
  setActiveMode: (mode: CommandMode) => void;
  data: OwnerCommandSurfaceData;
}) {
  const [draft, setDraft] = useState<string>(data.draft.prompt);
  const fallbackMode = data.modeTabs[0]?.key ?? data.reviewPacketModeKey;
  const activePanel = data.modePanels[activeMode] ?? data.modePanels[fallbackMode];
  const draftWords = useMemo(() => draft.trim().split(/\s+/).filter(Boolean).length, [draft]);
  const draftLines = useMemo(() => draft.split(/\n/).filter((line) => line.trim().length > 0).length, [draft]);
  const commandMetrics = [
    { label: "Plan gates", value: data.planStages.length.toString(), detail: "Visible before work moves" },
    { label: "Owner checkpoints", value: data.approvals.length.toString(), detail: "Review states, not execution" },
    { label: "Evidence checks", value: data.evidenceRequirements.length.toString(), detail: "Required before PR/deploy" },
    { label: "Blocked actions", value: data.unavailableActions.length.toString(), detail: "No dispatch in this slice" }
  ] as const;

  return (
    <section
      className="overflow-hidden rounded-[8px] border border-white/70 bg-white text-slate-950 shadow-[0_34px_120px_rgba(15,23,42,0.18)]"
      aria-labelledby="owner-command-title"
    >
      <div className="grid min-h-[34rem] gap-0 xl:grid-cols-[minmax(0,1.08fr)_32rem]">
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
              {data.copy.badges[0]}
            </span>
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold uppercase text-emerald-800">
              <Radio size={14} aria-hidden />
              {data.copy.badges[1]}
            </span>
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs font-bold uppercase text-amber-800">
              <ShieldCheck size={14} aria-hidden />
              {data.copy.badges[2]}
            </span>
          </div>

          <div className="relative mt-8 max-w-4xl">
            <p className="text-sm font-semibold text-blue-700">{data.surfaceStatus.posture}</p>
            <h2 id="owner-command-title" className="mt-2 max-w-4xl text-5xl font-semibold leading-[0.98] text-slate-950 md:text-6xl">
              {data.copy.heroTitle}
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
              {data.copy.heroDetail}
            </p>
          </div>

          <div className="relative mt-6 grid overflow-hidden rounded-[8px] border border-blue-100 bg-white/78 shadow-[0_18px_70px_rgba(37,99,235,0.08)] backdrop-blur sm:grid-cols-2 xl:grid-cols-4">
            {commandMetrics.map((metric) => (
              <div key={metric.label} className="border-b border-blue-100/80 p-4 last:border-b-0 sm:border-b sm:border-r sm:[&:nth-child(2n)]:border-r-0 sm:[&:nth-child(n+3)]:border-b-0 xl:border-b-0 xl:[&:nth-child(2n)]:border-r xl:last:border-r-0">
                <p className="text-xs font-bold uppercase text-slate-500">{metric.label}</p>
                <div className="mt-2 flex items-end justify-between gap-3">
                  <p className="text-xs leading-5 text-slate-500">{metric.detail}</p>
                  <p className="text-3xl font-semibold leading-none text-blue-600">{metric.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative mt-5 rounded-[8px] border border-slate-200 bg-white/86 p-4 shadow-[0_18px_70px_rgba(37,99,235,0.1)] backdrop-blur">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">{data.copy.draftLabel}</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-950">{data.draft.title}</h3>
              </div>
              <LightStatusBadge tone="private">{data.surfaceStatus.mode}</LightStatusBadge>
            </div>
            <textarea
              aria-label={data.copy.draftAriaLabel}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              className="mt-4 min-h-40 w-full resize-y rounded-[8px] border border-slate-200 bg-slate-50/80 p-4 text-sm leading-7 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white"
              placeholder={data.copy.draftPlaceholder}
            />
            <div className="mt-3 grid gap-3 text-sm text-slate-600 sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="flex flex-wrap gap-3">
                <span>
                  <strong className="text-slate-950">{draftWords}</strong> words
                </span>
                <span>
                  <strong className="text-slate-950">{draftLines}</strong> active lines
                </span>
                <span>{data.surfaceStatus.runtime}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveMode(data.reviewPacketModeKey)}
                  className="link-focus inline-flex items-center gap-2 rounded-[8px] bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(37,99,235,0.2)] transition hover:bg-blue-700"
                >
                  {data.copy.preparePacketAction}
                  <ArrowRight size={15} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => setDraft(data.draft.prompt)}
                  className="link-focus inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
                >
                  <RotateCcw size={15} aria-hidden />
                  {data.copy.resetAction}
                </button>
                <span className="inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-400">
                  <LockKeyhole size={15} aria-hidden />
                  {data.copy.dispatchUnavailable}
                </span>
              </div>
            </div>
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
          <div
            className="relative mb-4 grid gap-2 rounded-[8px] border border-blue-100 bg-white/72 p-2 shadow-[0_16px_48px_rgba(37,99,235,0.08)] sm:grid-cols-5"
            role="group"
            aria-label={data.copy.lensGroupLabel}
          >
            {data.modeTabs.map((mode) => {
              const Icon = modeIcons[mode.icon] ?? Radio;
              const active = activeMode === mode.key;

              return (
                <button
                  key={mode.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveMode(mode.key)}
                  className={`link-focus inline-flex items-center justify-center gap-2 rounded-[8px] border px-3 py-2 text-xs font-semibold transition ${
                    active
                      ? "border-blue-200 bg-blue-50 text-blue-800 shadow-[0_10px_24px_rgba(37,99,235,0.08)]"
                      : "border-transparent bg-transparent text-slate-600 hover:border-blue-100 hover:bg-white hover:text-blue-700"
                  }`}
                >
                  <Icon size={15} aria-hidden />
                  {mode.label}
                </button>
              );
            })}
          </div>
          <div className="relative rounded-[8px] border border-white bg-white/78 p-5 shadow-[0_20px_80px_rgba(37,99,235,0.1)] backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">{data.copy.activeLensLabel}</p>
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
              <LightStatusBadge tone="private">{data.surfaceStatus.dispatch}</LightStatusBadge>
            </div>
          </div>

          <section
            className="relative mt-4 rounded-[8px] border border-blue-100 bg-white/78 p-5"
            aria-labelledby="command-review-packet-title"
          >
            <p className="text-xs font-bold uppercase text-slate-500">{data.copy.reviewPacketLabel}</p>
            <h3 id="command-review-packet-title" className="mt-1 text-xl font-semibold text-slate-950">
              {data.reviewPacket.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{data.reviewPacket.summary}</p>
            <div className="mt-4 grid gap-3">
              {data.reviewPacket.sections.map((section) => (
                <div key={section.label} className="grid grid-cols-[5.5rem_1fr] gap-3 rounded-[8px] border border-blue-100 bg-white/72 p-3">
                  <span className="text-xs font-bold uppercase text-slate-500">{section.label}</span>
                  <span className="text-sm font-semibold text-slate-950">{section.value}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="relative mt-4 grid gap-3">
            {data.readinessChecks.map((check) => (
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

function PlanPreview({ data }: { data: OwnerCommandSurfaceData }) {
  return (
    <section className="panel overflow-hidden p-0" aria-labelledby="command-plan-title">
      <div className="grid gap-0 xl:grid-cols-[20rem_minmax(0,1fr)]">
        <div className="border-b border-slate-700 bg-white/[0.035] p-5 md:p-6 xl:border-b-0 xl:border-r">
          <div className="flex size-11 items-center justify-center rounded-[8px] border border-sky-200/25 bg-sky-300/10 text-sky-100">
            <Waypoints size={22} aria-hidden />
          </div>
          <p className="eyebrow mt-5">{data.copy.planEyebrow}</p>
          <h2 id="command-plan-title" className="mt-2 text-2xl font-semibold text-white">
            {data.copy.planTitle}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {data.copy.planDetail}
          </p>
        </div>
        <div className="grid gap-3 p-4 md:p-5 xl:grid-cols-5">
          {data.planStages.map((stage, index) => (
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

function ApprovalGate({ data }: { data: OwnerCommandSurfaceData }) {
  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <section className="panel p-5" aria-labelledby="command-approval-title">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-yellow-100">
              <ClipboardCheck size={22} aria-hidden />
              <h2 id="command-approval-title" className="text-2xl font-semibold text-white">
                {data.copy.approvalTitle}
              </h2>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              {data.copy.approvalDetail}
            </p>
          </div>
          <StatusBadge tone="warning">{data.copy.approvalStatus}</StatusBadge>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {data.approvals.map((approval) => (
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
        eyebrow={data.copy.blockedActionsEyebrow}
        title={data.copy.blockedActionsTitle}
        items={data.unavailableActions}
        note={data.copy.blockedActionsNote}
      />
    </section>
  );
}

function AgentRouting({ data }: { data: OwnerCommandSurfaceData }) {
  return (
    <section className="panel p-5" aria-labelledby="command-agent-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <Bot size={22} aria-hidden />
            <h2 id="command-agent-title" className="text-2xl font-semibold text-white">
              {data.copy.agentTitle}
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            {data.copy.agentDetail}
          </p>
        </div>
        <StatusBadge tone="info">{data.copy.agentStatus}</StatusBadge>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {data.agents.map((agent) => {
          const Icon = agentIcons[agent.role] ?? Bot;

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
                {data.copy.agentNextLabel}: {agent.next}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function EvidenceShelf({ data }: { data: OwnerCommandSurfaceData }) {
  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <section className="panel p-5" aria-labelledby="command-evidence-title">
        <div className="flex items-center gap-2 text-yellow-100">
          <FileSearch size={22} aria-hidden />
          <h2 id="command-evidence-title" className="text-2xl font-semibold text-white">
            {data.copy.evidenceTitle}
          </h2>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          {data.copy.evidenceDetail}
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {data.evidenceRequirements.map((item) => (
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
            {data.copy.outputTitle}
          </h2>
        </div>
        <div className="mt-4 grid gap-3">
          {data.outputShelf.map((item) => (
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

function AuditBoundary({ data }: { data: OwnerCommandSurfaceData }) {
  return (
    <section className="panel p-5" aria-labelledby="command-audit-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-200">
            <CheckCircle2 size={22} aria-hidden />
            <h2 id="command-audit-title" className="text-2xl font-semibold text-white">
              {data.copy.auditTitle}
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            {data.copy.auditDetail}
          </p>
        </div>
        <div className="rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 px-4 py-3">
          <div className="flex items-center gap-2 text-yellow-50">
            <LockKeyhole size={17} aria-hidden />
            <span className="text-sm font-semibold">{data.copy.auditBadge}</span>
          </div>
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {data.auditRules.map((rule) => (
          <div key={rule} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 text-sm leading-6 text-slate-300">
            {rule}
          </div>
        ))}
      </div>
    </section>
  );
}

export function OwnerCommandSurface({ data }: { data: OwnerCommandSurfaceData }) {
  const [activeMode, setActiveMode] = useState<CommandMode>(data.modeTabs[0]?.key ?? data.reviewPacketModeKey);

  return (
    <div className="grid gap-5">
      <CommandWorkspace activeMode={activeMode} setActiveMode={setActiveMode} data={data} />
      <PlanPreview data={data} />
      <ApprovalGate data={data} />
      <AgentRouting data={data} />
      <EvidenceShelf data={data} />
      <AuditBoundary data={data} />

      <section className="rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 p-4 text-sm font-semibold leading-6 text-yellow-50">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 shrink-0" size={18} aria-hidden />
          <p>{data.draft.boundary}</p>
        </div>
      </section>
    </div>
  );
}
