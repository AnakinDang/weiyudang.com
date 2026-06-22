"use client";

import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileSearch,
  GitBranch,
  Layers3,
  LockKeyhole,
  MessageSquareText,
  ShieldAlert,
  ShieldCheck,
  Waypoints,
  XCircle
} from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";

type ReviewQueueTone = "normal" | "info" | "warning" | "private";

type ReviewQueueEvidence = {
  label: string;
  state: string;
  tone: ReviewQueueTone;
  ready: boolean;
  detail: string;
};

type ReviewQueueCheckpoint = {
  label: string;
  state: string;
  tone: ReviewQueueTone;
};

type ReviewQueueDecisionOption = {
  label: string;
  state: string;
  tone: ReviewQueueTone;
  detail: string;
  next: string;
};

type ReviewQueueGate = {
  label: string;
  state: string;
  tone: ReviewQueueTone;
  detail: string;
};

type ReviewQueueItem = {
  id: string;
  title: string;
  owner: string;
  agent: string;
  lane: string;
  surface: string;
  decision: string;
  tone: ReviewQueueTone;
  urgency: string;
  requestedDecision: string;
  recommendedHandling: string;
  evidence: readonly string[];
  evidenceCards: readonly ReviewQueueEvidence[];
  checkpoints: readonly ReviewQueueCheckpoint[];
  decisionOptions: readonly ReviewQueueDecisionOption[];
  reviewGates: readonly ReviewQueueGate[];
  blockers: readonly string[];
  allowedNext: string;
  disallowedActions: readonly string[];
  updated: string;
  note: string;
};

type ReviewQueueMetric = {
  label: string;
  value: string;
  detail: string;
};

type ReviewQueueLane = {
  label: string;
  owner: string;
  count: string;
  state: string;
  tone: ReviewQueueTone;
  detail: string;
};

type ReviewQueueData = {
  queue: readonly ReviewQueueItem[];
  metrics: readonly ReviewQueueMetric[];
  lanes: readonly ReviewQueueLane[];
  policy: readonly string[];
};

const unavailableActions = ["Approve and execute", "Reject and run", "Public publish", "Runtime dispatch"] as const;
const flowSteps = [
  { id: "packet", label: "Packet created", detail: "Prepared by agent", icon: ClipboardCheck },
  { id: "evidence", label: "Evidence collected", detail: "Proof and gaps named", icon: FileSearch },
  { id: "owner-review", label: "Owner review", detail: "You inspect here", icon: ShieldCheck },
  { id: "owner-gates", label: "Owner gates", detail: "Next step stays explicit", icon: LockKeyhole },
  { id: "implementation", label: "Implementation later", detail: "Only after gates open", icon: GitBranch }
] as const satisfies readonly { id: string; label: string; detail: string; icon: LucideIcon }[];

const metricIcons: Record<string, LucideIcon> = {
  "Open decisions": ClipboardCheck,
  Now: Clock3,
  Blocked: LockKeyhole,
  "Evidence cards": FileSearch
};

const metricToneClass: Record<string, string> = {
  "Open decisions": "border-sky-200/25 bg-sky-300/10 text-sky-100",
  Now: "border-yellow-200/30 bg-yellow-300/10 text-yellow-100",
  Blocked: "border-violet-200/25 bg-violet-300/10 text-violet-100",
  "Evidence cards": "border-emerald-200/25 bg-emerald-300/10 text-emerald-100"
};

function urgencyTone(urgency: string): ReviewQueueTone {
  if (urgency === "Now") {
    return "warning";
  }

  if (urgency === "Next") {
    return "info";
  }

  return "private";
}

function evidenceSummary(item: ReviewQueueItem) {
  const ready = item.evidenceCards.filter((card) => card.ready).length;
  return `${ready} / ${item.evidenceCards.length}`;
}

function laneItemLabel(count: string) {
  return count === "1" ? "item" : "items";
}

function optionChoiceKey(itemId: string, label: string) {
  return `${itemId}:${label}`;
}

function uniqueLanes(items: readonly ReviewQueueItem[]) {
  return Array.from(new Set(items.map((item) => item.lane)));
}

function ReviewMetricCard({ metric }: { metric: ReviewQueueMetric }) {
  const Icon = metricIcons[metric.label] ?? ClipboardCheck;

  return (
    <article className={`rounded-[8px] border p-4 ${metricToneClass[metric.label] ?? metricToneClass["Open decisions"]}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase text-current">{metric.label}</p>
        <Icon size={17} aria-hidden />
      </div>
      <p className="mt-3 text-2xl font-semibold text-white">{metric.value}</p>
      <p className="mt-2 text-xs leading-5 text-slate-200/85">{metric.detail}</p>
    </article>
  );
}

function ReviewHero({
  currentItem,
  data
}: {
  currentItem: ReviewQueueItem;
  data: ReviewQueueData;
}) {
  return (
    <section
      className="panel relative isolate overflow-hidden p-0"
      aria-labelledby="review-queue-title"
    >
      <div
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-2/3 bg-[radial-gradient(circle_at_64%_18%,rgba(56,189,248,0.22),transparent_32%),radial-gradient(circle_at_80%_70%,rgba(250,204,21,0.12),transparent_30%),linear-gradient(135deg,transparent,rgba(59,130,246,0.10))]"
        aria-hidden
      />
      <div className="grid min-h-[30rem] gap-0 xl:grid-cols-[minmax(0,1fr)_30rem]">
        <div className="relative overflow-hidden p-6 md:p-7">
          <div
            className="pointer-events-none absolute bottom-0 left-1/2 h-44 w-[46rem] -translate-x-1/2 rounded-t-full border border-sky-200/10 bg-[radial-gradient(circle_at_50%_100%,rgba(56,189,248,0.12),transparent_62%)]"
            aria-hidden
          />

          <div className="relative inline-flex items-center gap-2 rounded-[8px] border border-sky-200/25 bg-sky-300/10 px-3 py-2 text-xs font-bold uppercase text-sky-100">
            <ClipboardCheck size={14} aria-hidden />
            Owner Review Queue
          </div>

          <div className="relative mt-5 max-w-4xl">
            <h2 id="review-queue-title" className="max-w-4xl text-3xl font-semibold leading-[1.04] text-white md:text-5xl">
              Decisions stay explicit before anything moves.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
              Decision packets prepared by Doraemon and MiniDoras. Review evidence, blockers, allowed next steps, and
              missing proof without approving, dispatching, or silently promoting work.
            </p>
          </div>

          <div className="relative mt-5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-violet-200/25 bg-violet-300/10 px-3 py-1.5 text-xs font-bold uppercase text-violet-100">
              <LockKeyhole size={14} aria-hidden />
              Owner-only
            </span>
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-emerald-200/25 bg-emerald-300/10 px-3 py-1.5 text-xs font-bold uppercase text-emerald-100">
              <FileSearch size={14} aria-hidden />
              Read-only packets
            </span>
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 px-3 py-1.5 text-xs font-bold uppercase text-yellow-100">
              <ShieldCheck size={14} aria-hidden />
              No execution
            </span>
          </div>

          <div className="relative mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {data.metrics.map((metric) => <ReviewMetricCard key={metric.label} metric={metric} />)}
          </div>

          <div className="relative mt-6 rounded-[8px] border border-slate-700 bg-[#07111f]/70 p-4 backdrop-blur">
            <div className="flex items-center gap-2 text-sky-100">
              <Waypoints size={17} aria-hidden />
              <p className="text-xs font-bold uppercase">Decision flow</p>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-5">
              {flowSteps.map((step, index) => {
                const Icon = step.icon;
                const active = step.id === "owner-review";

                return (
                  <div
                    key={step.label}
                    aria-current={active ? "step" : undefined}
                    className={`rounded-[8px] border p-3 ${
                      active ? "border-sky-200/55 bg-sky-300/14 text-white" : "border-slate-700 bg-white/[0.045] text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex size-8 items-center justify-center rounded-[8px] border border-current/20 bg-white/[0.06]">
                        <Icon size={15} aria-hidden />
                      </span>
                      <span className="text-xs font-bold uppercase">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <p className="mt-3 text-sm font-semibold">{step.label}</p>
                    <p className="mt-1 text-xs leading-5 opacity-75">{step.detail}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <section
          className="relative border-t border-slate-700/70 bg-[#07111f]/45 p-5 md:p-6 xl:border-l xl:border-t-0"
          aria-labelledby="current-review-title"
        >
          <div className="pointer-events-none absolute inset-x-6 top-6 h-48 rounded-full bg-sky-500/12 blur-3xl" aria-hidden />
          <div className="relative rounded-[8px] border border-slate-700 bg-[#07111f]/76 p-5 shadow-[0_20px_80px_rgba(14,165,233,0.10)] backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-yellow-100">Current packet</p>
                <h3 id="current-review-title" className="mt-2 text-2xl font-semibold text-white">
                  {currentItem.title}
                </h3>
                <p className="mt-1 text-xs font-bold uppercase text-sky-100">{currentItem.agent}</p>
              </div>
              <StatusBadge tone={urgencyTone(currentItem.urgency)}>{currentItem.urgency}</StatusBadge>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-300">{currentItem.requestedDecision}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <StatusBadge tone={currentItem.tone}>{currentItem.decision}</StatusBadge>
              <StatusBadge tone="info">{currentItem.lane}</StatusBadge>
            </div>
          </div>

          <div className="relative mt-4 grid gap-3">
            <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <p className="text-xs font-bold uppercase text-slate-400">Recommended handling</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-white">{currentItem.recommendedHandling}</p>
            </div>
            <div className="rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 p-4">
              <p className="text-xs font-bold uppercase text-yellow-100">Allowed next</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-yellow-50">{currentItem.allowedNext}</p>
            </div>
            <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs font-bold uppercase text-slate-400">Evidence</dt>
                  <dd className="mt-1 font-semibold text-white">{evidenceSummary(currentItem)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase text-slate-400">Blockers</dt>
                  <dd className="mt-1 font-semibold text-white">{currentItem.blockers.length}</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

function LaneFilters({
  lanes,
  activeLane,
  onSelect
}: {
  lanes: readonly string[];
  activeLane: string;
  onSelect: (lane: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" aria-label="Review queue lane filters">
      {["All lanes", ...lanes].map((lane) => {
        const active = lane === activeLane;
        return (
          <button
            key={lane}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(lane)}
            className={`link-focus rounded-[8px] border px-3 py-2 text-xs font-bold uppercase transition ${
              active
                ? "border-sky-200/45 bg-sky-300/15 text-white"
                : "border-slate-700 bg-white/[0.035] text-slate-400 hover:border-sky-200/30 hover:text-white"
            }`}
          >
            {lane}
          </button>
        );
      })}
    </div>
  );
}

function QueueList({
  items,
  selectedId,
  onSelect
}: {
  items: readonly ReviewQueueItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid gap-3">
      {items.map((item) => {
        const active = item.id === selectedId;

        return (
          <button
            key={item.id}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(item.id)}
            className={`link-focus grid gap-3 rounded-[8px] border p-4 text-left transition ${
              active
                ? "border-sky-300/55 bg-sky-300/14 shadow-[0_18px_50px_rgba(14,165,233,0.14)]"
                : "border-slate-700 bg-white/[0.045] hover:-translate-y-0.5 hover:border-sky-300/35 hover:bg-white/[0.07]"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-xs font-bold uppercase text-yellow-100">{item.agent}</p>
              </div>
              <StatusBadge tone={item.tone}>{item.decision}</StatusBadge>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-slate-400">
              <span>
                <strong className="text-slate-300">Lane:</strong> {item.lane}
              </span>
              <span>
                <strong className="text-slate-300">Proof:</strong> {evidenceSummary(item)}
              </span>
              <span>
                <strong className="text-slate-300">Due:</strong> {item.urgency}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function EvidenceWorkbench({
  items,
  selectedItem,
  draftChoice,
  activeLane,
  lanes,
  onDraftChoice,
  onLaneSelect,
  onItemSelect
}: {
  items: readonly ReviewQueueItem[];
  selectedItem: ReviewQueueItem;
  draftChoice: string;
  activeLane: string;
  lanes: readonly string[];
  onDraftChoice: (choice: string) => void;
  onLaneSelect: (lane: string) => void;
  onItemSelect: (id: string) => void;
}) {
  return (
    <section className="panel p-5" aria-labelledby="evidence-workbench-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <FileSearch size={22} aria-hidden />
            <h2 id="evidence-workbench-title" className="text-2xl font-semibold text-white">
              Evidence workbench
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Inspect the selected packet in detail. All information is read-only; missing proof is visible instead of
            being papered over.
          </p>
        </div>
        <StatusBadge tone="private">No execution</StatusBadge>
      </div>

      <div className="mt-5">
        <LaneFilters lanes={lanes} activeLane={activeLane} onSelect={onLaneSelect} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[20rem_minmax(0,1fr)] 2xl:grid-cols-[22rem_minmax(0,1fr)_24rem]">
        <aside className="rounded-[8px] border border-slate-700 bg-white/[0.035] p-4" aria-label="Decision packets">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase text-slate-400">Decision packets</p>
            <span className="text-xs font-semibold text-slate-500">{items.length} shown</span>
          </div>
          <div className="mt-4">
            <QueueList items={items} selectedId={selectedItem.id} onSelect={onItemSelect} />
          </div>
        </aside>

        <article className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-5" aria-labelledby="selected-packet-title">
          <p className="sr-only" aria-live="polite">
            Selected packet: {selectedItem.title}. {selectedItem.decision}.
          </p>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase text-yellow-100">Selected packet</p>
              <h3 id="selected-packet-title" className="mt-2 text-2xl font-semibold text-white">
                {selectedItem.title}
              </h3>
              <p className="mt-2 text-xs font-bold uppercase text-slate-400">
                {selectedItem.urgency} - {selectedItem.agent} - {selectedItem.surface}
              </p>
            </div>
            <StatusBadge tone={selectedItem.tone}>{selectedItem.decision}</StatusBadge>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[8px] border border-slate-700 bg-[#07111f]/58 p-4">
              <p className="text-xs font-bold uppercase text-slate-400">Requested decision</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{selectedItem.requestedDecision}</p>
            </div>
            <div className="rounded-[8px] border border-slate-700 bg-[#07111f]/58 p-4">
              <p className="text-xs font-bold uppercase text-slate-400">Recommended handling</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{selectedItem.recommendedHandling}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {selectedItem.checkpoints.map((checkpoint) => (
              <div key={`${selectedItem.id}-${checkpoint.label}`} className="rounded-[8px] border border-slate-700 bg-[#07111f]/58 p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-slate-300">{checkpoint.label}</span>
                  <StatusBadge tone={checkpoint.tone}>{checkpoint.state}</StatusBadge>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-[8px] border border-slate-700 bg-[#07111f]/58 p-4">
            <div className="flex items-center gap-2 text-sky-100">
              <MessageSquareText size={17} aria-hidden />
              <p className="text-sm font-semibold">Agent note</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{selectedItem.note}</p>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_12rem]">
            <div className="rounded-[8px] border border-slate-700 bg-[#07111f]/58 p-4">
              <p className="text-xs font-bold uppercase text-slate-400">Evidence requested</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedItem.evidence.map((evidence) => (
                  <span key={`${selectedItem.id}-${evidence}`} className="rounded-[8px] border border-slate-700 bg-white/[0.045] px-3 py-1.5 text-xs font-semibold text-slate-300">
                    {evidence}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-[8px] border border-slate-700 bg-[#07111f]/58 p-4">
              <p className="text-xs font-bold uppercase text-slate-400">Updated</p>
              <p className="mt-3 text-sm font-semibold text-white">{selectedItem.updated}</p>
            </div>
          </div>
        </article>

        <aside className="grid gap-4 xl:col-span-2 2xl:col-span-1">
          <DecisionPlanner selectedItem={selectedItem} draftChoice={draftChoice} onDraftChoice={onDraftChoice} />

          <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase text-slate-400">Evidence</p>
              <span className="text-sm font-semibold text-slate-300">{evidenceSummary(selectedItem)}</span>
            </div>
            <div className="mt-3 grid gap-3">
              {selectedItem.evidenceCards.map((evidence) => (
                <div key={`${selectedItem.id}-${evidence.label}`} className="rounded-[8px] border border-slate-700 bg-[#07111f]/70 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-white">{evidence.label}</p>
                    <StatusBadge tone={evidence.tone}>{evidence.state}</StatusBadge>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{evidence.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[8px] border border-red-300/35 bg-red-400/8 p-4">
            <div className="flex items-center gap-2 text-red-100">
              <AlertTriangle size={17} aria-hidden />
              <p className="text-sm font-semibold">Blockers</p>
            </div>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-300">
              {selectedItem.blockers.map((blocker) => (
                <li key={`${selectedItem.id}-${blocker}`} className="flex gap-2">
                  <XCircle className="mt-1 shrink-0 text-red-100" size={15} aria-hidden />
                  <span>{blocker}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <p className="text-xs font-bold uppercase text-slate-400">Allowed next</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{selectedItem.allowedNext}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function DecisionPlanner({
  selectedItem,
  draftChoice,
  onDraftChoice
}: {
  selectedItem: ReviewQueueItem;
  draftChoice: string;
  onDraftChoice: (choice: string) => void;
}) {
  const selectedOption = selectedItem.decisionOptions.find((option) => option.label === draftChoice) ?? selectedItem.decisionOptions[0];

  return (
    <section className="rounded-[8px] border border-sky-300/35 bg-sky-300/10 p-4" aria-labelledby="decision-planner-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <ShieldCheck size={17} aria-hidden />
            <h3 id="decision-planner-title" className="text-sm font-semibold">
              Owner decision draft
            </h3>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-400">
            Choose a local review posture for this packet. No API call, approval, publish, or dispatch is sent.
          </p>
        </div>
        <StatusBadge tone="private">Local only</StatusBadge>
      </div>

      <div className="mt-4 grid gap-2">
        {selectedItem.decisionOptions.map((option) => {
          const active = option.label === selectedOption?.label;

          return (
            <button
              key={optionChoiceKey(selectedItem.id, option.label)}
              type="button"
              aria-pressed={active}
              onClick={() => onDraftChoice(option.label)}
              className={`link-focus rounded-[8px] border p-3 text-left transition ${
                active
                  ? "border-sky-200/65 bg-sky-200/16 text-white"
                  : "border-slate-700 bg-[#07111f]/58 text-slate-300 hover:border-sky-200/35 hover:bg-white/[0.07]"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold">{option.label}</span>
                <StatusBadge tone={option.tone}>{option.state}</StatusBadge>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">{option.detail}</p>
            </button>
          );
        })}
      </div>

      {selectedOption ? (
        <div className="mt-4 rounded-[8px] border border-slate-700 bg-[#07111f]/70 p-3">
          <p className="text-xs font-bold uppercase text-slate-400">If selected</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">{selectedOption.next}</p>
        </div>
      ) : null}

      <div className="mt-4">
        <p className="text-xs font-bold uppercase text-slate-400">Gates before merge</p>
        <div className="mt-3 grid gap-2">
          {selectedItem.reviewGates.map((gate) => (
            <div key={`${selectedItem.id}-${gate.label}`} className="rounded-[8px] border border-slate-700 bg-[#07111f]/58 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                  <CheckCircle2 size={15} aria-hidden />
                  {gate.label}
                </span>
                <StatusBadge tone={gate.tone}>{gate.state}</StatusBadge>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">{gate.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-bold uppercase text-slate-400">Still unavailable</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedItem.disallowedActions.map((action) => (
            <span key={`${selectedItem.id}-${action}`} className="rounded-[8px] border border-slate-700 bg-[#07111f]/58 px-3 py-1.5 text-xs font-semibold text-slate-300">
              {action}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function DecisionLanes({ lanes }: { lanes: readonly ReviewQueueLane[] }) {
  return (
    <section className="panel p-5" aria-labelledby="review-lanes-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <Waypoints size={22} aria-hidden />
            <h2 id="review-lanes-title" className="text-2xl font-semibold text-white">
              Decision lanes
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Each lane says who owns the review, why the item exists, and whether the next step is current, deferred, or
            blocked.
          </p>
        </div>
        <StatusBadge tone="warning">Owner-gated</StatusBadge>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {lanes.map((lane, index) => (
          <article key={lane.label} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <span className="flex size-9 items-center justify-center rounded-[8px] border border-sky-200/35 bg-sky-200/16 text-xs font-semibold text-white" aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </span>
              <StatusBadge tone={lane.tone}>{lane.state}</StatusBadge>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">{lane.label}</h3>
            <p className="mt-1 text-xs font-bold uppercase text-yellow-100">{lane.owner}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{lane.detail}</p>
            <p className="mt-4 rounded-[8px] border border-slate-700 bg-[#07111f]/70 p-3 text-xs leading-5 text-slate-400">
              {lane.count} {laneItemLabel(lane.count)} in this lane
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PolicyRail({ policy }: { policy: readonly string[] }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <section className="panel p-5" aria-labelledby="review-policy-title">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-yellow-100">
              <ShieldAlert size={22} aria-hidden />
              <h2 id="review-policy-title" className="text-2xl font-semibold text-white">
                Review rules
              </h2>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              The queue represents decisions as states only. It can clarify what is allowed next, but it cannot perform
              the next step.
            </p>
          </div>
          <StatusBadge tone="private">Read-only</StatusBadge>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {policy.map((rule) => (
            <div key={rule} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 text-sm leading-6 text-slate-300">
              {rule}
            </div>
          ))}
        </div>
      </section>

      <aside className="panel p-5" aria-labelledby="review-unavailable-title">
        <div className="flex items-center gap-2 text-yellow-100">
          <Clock3 size={20} aria-hidden />
          <h2 id="review-unavailable-title" className="text-2xl font-semibold text-white">
            Unavailable
          </h2>
        </div>
        <div className="mt-5 grid gap-2">
          {unavailableActions.map((item) => (
            <div key={item} className="flex items-center justify-between gap-3 rounded-[8px] border border-slate-700 bg-white/[0.045] px-3 py-2 text-sm text-slate-300">
              <span>{item}</span>
              <StatusBadge tone="private">Unavailable</StatusBadge>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

function CommandBridge() {
  return (
    <section className="panel p-5" aria-label="Review queue continuation paths">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <Layers3 size={22} aria-hidden />
            <h2 className="text-2xl font-semibold text-white">Continue from review</h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Review Queue does not mutate work. When a decision is clear, move to the relevant private surface and keep
            the next step explicit.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/app/command" className="link-focus group rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 transition hover:border-sky-200/35 hover:bg-sky-300/10">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-white">Open Command</span>
              <ArrowRight className="text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-sky-100" size={16} aria-hidden />
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-400">Draft a mission packet after review is understood.</p>
          </Link>
          <Link href="/app/agents" className="link-focus group rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 transition hover:border-sky-200/35 hover:bg-sky-300/10">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-white">See Agents</span>
              <ArrowRight className="text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-sky-100" size={16} aria-hidden />
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-400">Inspect the MiniDora lane responsible for the packet.</p>
          </Link>
        </div>
      </div>
    </section>
  );
}

function EmptyQueueState() {
  return (
    <section className="panel p-6" aria-labelledby="empty-review-queue-title">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 text-emerald-100">
            <ClipboardCheck size={22} aria-hidden />
            <h2 id="empty-review-queue-title" className="text-2xl font-semibold text-white">
              Review Queue is clear
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            No owner decision packets are waiting right now. The surface stays read-only and will show evidence,
            blockers, and allowed next steps when Doraemon prepares a packet.
          </p>
        </div>
        <StatusBadge tone="normal">Clear</StatusBadge>
      </div>
    </section>
  );
}

export function OwnerReviewQueueSurface({ data }: { data: ReviewQueueData }) {
  const lanes = useMemo(() => uniqueLanes(data.queue), [data.queue]);
  const [activeLane, setActiveLane] = useState("All lanes");
  const [selectedItemId, setSelectedItemId] = useState(data.queue[0]?.id ?? "");
  const [draftChoices, setDraftChoices] = useState<Record<string, string>>({});

  const visibleQueue = useMemo(() => {
    if (activeLane === "All lanes") {
      return data.queue;
    }

    return data.queue.filter((item) => item.lane === activeLane);
  }, [activeLane, data.queue]);

  const selectedItem = data.queue.find((item) => item.id === selectedItemId) ?? visibleQueue[0] ?? data.queue[0];

  if (!selectedItem) {
    return <EmptyQueueState />;
  }

  function handleLaneSelect(lane: string) {
    setActiveLane(lane);
    const nextVisible = lane === "All lanes" ? data.queue : data.queue.filter((item) => item.lane === lane);
    if (nextVisible[0]) {
      setSelectedItemId(nextVisible[0].id);
    }
  }

  const draftChoice = draftChoices[selectedItem.id] ?? selectedItem.decisionOptions[0]?.label ?? "";

  function handleDraftChoice(choice: string) {
    setDraftChoices((current) => ({
      ...current,
      [selectedItem.id]: choice
    }));
  }

  return (
    <div className="grid gap-5">
      <ReviewHero currentItem={selectedItem} data={data} />
      <EvidenceWorkbench
        items={visibleQueue}
        selectedItem={selectedItem}
        draftChoice={draftChoice}
        activeLane={activeLane}
        lanes={lanes}
        onDraftChoice={handleDraftChoice}
        onLaneSelect={handleLaneSelect}
        onItemSelect={setSelectedItemId}
      />
      <DecisionLanes lanes={data.lanes} />
      <PolicyRail policy={data.policy} />
      <CommandBridge />
    </div>
  );
}
