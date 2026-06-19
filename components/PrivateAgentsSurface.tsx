"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  Bot,
  Boxes,
  Brain,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  GitBranch,
  LineChart,
  LockKeyhole,
  Radio,
  ShieldCheck,
  Sparkles,
  Waypoints
} from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import type {
  PrivateAgent,
  PrivateAgentCoverageLane,
  PrivateAgentHandoff,
  PrivateAgentMetric,
  PrivateAgentRole,
  PrivateAgentSourceHealth
} from "@/lib/agent-ops";

type Tone = PrivateAgent["tone"];
type ReviewQueuePreviewItem = {
  title: string;
  tone: Tone;
  decision: string;
  urgency: string;
  agent: string;
  note: string;
};

type PrivateAgentsSurfaceProps = {
  agents: readonly PrivateAgent[];
  metrics: readonly PrivateAgentMetric[];
  coverage: readonly PrivateAgentCoverageLane[];
  boundary: readonly string[];
  handoffs: readonly PrivateAgentHandoff[];
  reviewQueue: readonly ReviewQueuePreviewItem[];
};

const roleIcons = {
  Orchestrator: Bot,
  Implementation: Boxes,
  Evidence: GitBranch,
  "Trading Research": ShieldCheck,
  "Creative Production": FileText,
  "Product Quality": ClipboardCheck,
  Operations: CalendarClock,
  Knowledge: Brain
} as const satisfies Record<PrivateAgentRole, LucideIcon>;

const sourceHealthTone = {
  Good: "normal",
  Partial: "warning",
  Degraded: "warning",
  Pending: "private"
} as const satisfies Record<PrivateAgentSourceHealth, Tone>;

const REVIEW_QUEUE_PREVIEW_LIMIT = 3;

function LightStatusBadge({ children, tone }: { children: ReactNode; tone: Tone }) {
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

function AgentButton({
  agent,
  active,
  onSelect
}: {
  agent: PrivateAgent;
  active: boolean;
  onSelect: () => void;
}) {
  const Icon = roleIcons[agent.role];

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className={`link-focus grid gap-3 rounded-[8px] border p-4 text-left transition ${
        active
          ? "border-sky-200/45 bg-sky-300/14 shadow-[0_18px_50px_rgba(14,165,233,0.12)]"
          : "border-slate-700 bg-white/[0.045] hover:-translate-y-0.5 hover:border-sky-300/35 hover:bg-white/[0.07]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-11 items-center justify-center rounded-[8px] border border-sky-200/25 bg-sky-300/10 text-sky-100">
          <Icon size={21} aria-hidden />
        </span>
        <StatusBadge tone={agent.tone}>{agent.state}</StatusBadge>
      </div>
      <div>
        <h3 className="text-base font-semibold text-white">{agent.name}</h3>
        <p className="mt-1 text-xs font-bold uppercase text-yellow-100">{agent.role}</p>
      </div>
      <p className="text-sm leading-6 text-slate-300">{agent.currentFocus}</p>
      <div className="grid gap-2 border-t border-slate-700 pt-3 text-xs text-slate-400">
        <span>
          <strong className="text-slate-300">Lease:</strong> {agent.leaseStatus}
        </span>
        <span>
          <strong className="text-slate-300">Updated:</strong> {agent.lastUpdated}
        </span>
      </div>
    </button>
  );
}

function HeroPanel({ activeAgent, metrics }: { activeAgent: PrivateAgent; metrics: readonly PrivateAgentMetric[] }) {
  const ActiveIcon = roleIcons[activeAgent.role];

  return (
    <section
      className="overflow-hidden rounded-[8px] border border-white/70 bg-white text-slate-950 shadow-[0_34px_120px_rgba(15,23,42,0.18)]"
      aria-labelledby="private-agents-title"
    >
      <div className="grid min-h-[30rem] gap-0 xl:grid-cols-[minmax(0,1.08fr)_31rem]">
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
              Read-only roster
            </span>
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs font-bold uppercase text-amber-800">
              <ShieldCheck size={14} aria-hidden />
              No execution
            </span>
          </div>

          <div className="relative mt-10 max-w-4xl">
            <p className="text-sm font-semibold text-blue-700">Authenticated MiniDora operations map</p>
            <h2 id="private-agents-title" className="mt-3 max-w-4xl text-4xl font-semibold leading-[1.02] text-slate-950 md:text-5xl">
              See who owns the next decision.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
              The private Agents surface turns the MiniDora team into a reviewable operating map: leases, capabilities,
              source health, handoffs, and guardrails stay visible before any future API or workflow can move.
            </p>
          </div>

          <div className="relative mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
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
          aria-labelledby="active-agent-title"
        >
          <div
            className="pointer-events-none absolute inset-x-6 top-6 h-48 rounded-full bg-blue-500/12 blur-3xl"
            aria-hidden
          />
          <div className="relative rounded-[8px] border border-white bg-white/78 p-5 shadow-[0_20px_80px_rgba(37,99,235,0.1)] backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">Active selection</p>
                <h3 id="active-agent-title" className="mt-1 text-2xl font-semibold text-slate-950">
                  {activeAgent.name}
                </h3>
                <p className="mt-1 text-xs font-bold uppercase text-blue-700">{activeAgent.role}</p>
              </div>
              <span className="flex size-12 items-center justify-center rounded-[8px] bg-blue-600 text-white">
                <ActiveIcon size={23} aria-hidden />
              </span>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-600">{activeAgent.mission}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <LightStatusBadge tone={activeAgent.tone}>{activeAgent.state}</LightStatusBadge>
              <LightStatusBadge tone="private">{activeAgent.leaseStatus}</LightStatusBadge>
              <LightStatusBadge tone={sourceHealthTone[activeAgent.sourceHealth]}>{activeAgent.sourceHealth}</LightStatusBadge>
            </div>
          </div>

          <div className="relative mt-4 grid gap-3">
            <div className="rounded-[8px] border border-blue-100 bg-white/78 p-4">
              <p className="text-xs font-bold uppercase text-slate-500">Current lease</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-950">{activeAgent.lease}</p>
            </div>
            <div className="rounded-[8px] border border-blue-100 bg-white/78 p-4">
              <p className="text-xs font-bold uppercase text-slate-500">Next review</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-950">{activeAgent.nextReview}</p>
            </div>
            <div className="rounded-[8px] border border-amber-100 bg-amber-50/80 p-4">
              <p className="text-xs font-bold uppercase text-amber-800">Guardrail</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-950">{activeAgent.guardrail}</p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

function AgentDetail({ agent }: { agent: PrivateAgent }) {
  return (
    <section className="panel p-5" aria-labelledby="agent-detail-title" aria-live="polite">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Agent detail</p>
          <h2 id="agent-detail-title" className="mt-2 text-2xl font-semibold text-white">
            {agent.name}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{agent.currentFocus}</p>
        </div>
        <StatusBadge tone={agent.tone}>{agent.state}</StatusBadge>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="grid gap-4">
          <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <p className="text-xs font-bold uppercase text-slate-400">Last output</p>
            <p className="mt-2 text-sm leading-6 text-slate-200">{agent.lastOutput}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <p className="text-xs font-bold uppercase text-slate-400">Inputs watched</p>
              <ul className="mt-3 grid gap-2 text-sm text-slate-300">
                {agent.inputs.map((input) => (
                  <li key={input} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-sky-100" size={15} aria-hidden />
                    <span>{input}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <p className="text-xs font-bold uppercase text-slate-400">Outputs prepared</p>
              <ul className="mt-3 grid gap-2 text-sm text-slate-300">
                {agent.outputs.map((output) => (
                  <li key={output} className="flex gap-2">
                    <Sparkles className="mt-0.5 shrink-0 text-yellow-100" size={15} aria-hidden />
                    <span>{output}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <aside className="grid content-start gap-4">
          <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <p className="text-xs font-bold uppercase text-slate-400">Capabilities</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {agent.capabilities.map((capability) => (
                <span key={capability} className="rounded-[8px] border border-slate-700 bg-[#07111f]/70 px-2.5 py-1 text-xs text-slate-300">
                  {capability}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase text-slate-400">Source health</p>
              <StatusBadge tone={sourceHealthTone[agent.sourceHealth]}>{agent.sourceHealth}</StatusBadge>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{agent.sourceDetail}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function CoverageAndBoundary({
  coverage,
  boundary
}: {
  coverage: readonly PrivateAgentCoverageLane[];
  boundary: readonly string[];
}) {
  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <section className="panel p-5" aria-labelledby="agent-coverage-title">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-100">
              <Waypoints size={22} aria-hidden />
              <h2 id="agent-coverage-title" className="text-2xl font-semibold text-white">
                Coverage lanes
              </h2>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              The roster is useful only when every lane says who owns the next review and what evidence is missing.
            </p>
          </div>
          <StatusBadge tone="info">Review map</StatusBadge>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {coverage.map((lane, index) => (
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
              <p className="mt-1 text-xs font-bold uppercase text-yellow-100">{lane.owner}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{lane.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <aside className="panel p-5" aria-labelledby="agent-boundary-title">
        <div className="flex items-center gap-2 text-yellow-100">
          <ShieldCheck size={22} aria-hidden />
          <h2 id="agent-boundary-title" className="text-2xl font-semibold text-white">
            Boundary
          </h2>
        </div>
        <ul className="mt-5 grid gap-3">
          {boundary.map((item) => (
            <li key={item} className="flex gap-3 rounded-[8px] border border-slate-700 bg-white/[0.045] p-3 text-sm leading-6 text-slate-300">
              <CheckCircle2 className="mt-1 shrink-0 text-sky-100" size={16} aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
}

function HandoffsAndQueue({
  activeAgent,
  handoffs,
  reviewQueue
}: {
  activeAgent: PrivateAgent;
  handoffs: readonly PrivateAgentHandoff[];
  reviewQueue: readonly ReviewQueuePreviewItem[];
}) {
  const relatedHandoffs = handoffs.filter(
    (handoff) => handoff.fromAgentId === activeAgent.id || handoff.toAgentId === activeAgent.id
  );

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <section className="panel p-5" aria-labelledby="agent-handoff-title">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-100">
              <Radio size={22} aria-hidden />
              <h2 id="agent-handoff-title" className="text-2xl font-semibold text-white">
                Handoffs
              </h2>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Recent coordination chain for the selected agent. Empty states are explicit when no direct handoff has
              been recorded for this slice.
            </p>
          </div>
          <StatusBadge tone="private">No dispatch</StatusBadge>
        </div>

        {relatedHandoffs.length > 0 ? (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {relatedHandoffs.map((handoff) => (
              <article key={`${handoff.time}-${handoff.from}-${handoff.to}`} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-white">{handoff.time}</h3>
                  <StatusBadge tone={handoff.tone}>{handoff.state}</StatusBadge>
                </div>
                <p className="mt-2 text-xs font-bold uppercase text-yellow-100">
                  {handoff.from} to {handoff.to}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-300">{handoff.summary}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <p className="text-sm font-semibold text-white">No direct handoff recorded.</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              This agent has no direct handoff in the current slice evidence. Keep the lease visible, but do not invent a
              coordination chain.
            </p>
          </div>
        )}
      </section>

      <aside className="panel p-5" aria-labelledby="agent-review-title">
        <div className="flex items-center gap-2 text-yellow-100">
          <ClipboardCheck size={22} aria-hidden />
          <h2 id="agent-review-title" className="text-2xl font-semibold text-white">
            Review queue
          </h2>
        </div>
        <div className="mt-5 grid gap-3">
          {reviewQueue.slice(0, REVIEW_QUEUE_PREVIEW_LIMIT).map((item) => (
            <article key={item.title} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                <StatusBadge tone={item.tone}>{item.decision}</StatusBadge>
              </div>
              <p className="mt-2 text-xs font-bold uppercase text-slate-400">
                {item.urgency} - {item.agent}
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-400">{item.note}</p>
            </article>
          ))}
        </div>
        <Link href="/app/events" className="link-focus mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-100 hover:text-white">
          Open Review Queue
          <LineChart size={15} aria-hidden />
        </Link>
      </aside>
    </section>
  );
}

export function PrivateAgentsSurface({
  agents,
  metrics,
  coverage,
  boundary,
  handoffs,
  reviewQueue
}: PrivateAgentsSurfaceProps) {
  const [activeAgentId, setActiveAgentId] = useState(agents[0]?.id ?? "");
  const activeAgent = useMemo(
    () => agents.find((agent) => agent.id === activeAgentId) ?? agents[0],
    [activeAgentId, agents]
  );

  if (!activeAgent) {
    return null;
  }

  return (
    <div className="grid gap-5">
      <HeroPanel activeAgent={activeAgent} metrics={metrics} />

      <section className="panel-quiet p-3" aria-label="MiniDora roster selector">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {agents.map((agent) => (
            <AgentButton
              key={agent.id}
              agent={agent}
              active={agent.id === activeAgent.id}
              onSelect={() => setActiveAgentId(agent.id)}
            />
          ))}
        </div>
      </section>

      <AgentDetail agent={activeAgent} />
      <CoverageAndBoundary coverage={coverage} boundary={boundary} />
      <HandoffsAndQueue activeAgent={activeAgent} handoffs={handoffs} reviewQueue={reviewQueue} />
    </div>
  );
}
