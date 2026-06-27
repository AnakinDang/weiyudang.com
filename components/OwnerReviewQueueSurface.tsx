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
import { useLanguage } from "@/components/LanguageProvider";
import { StatusBadge } from "@/components/StatusBadge";
import { translateToZh, type SiteLocale } from "@/lib/site-i18n";

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

const reviewQueueZhOverrides: Partial<Record<string, string>> = {
  Owner: "本人",
  "Owner-gated": "本人把关",
  Now: "现在",
  Next: "下一步"
};

function reviewText(value: string | undefined, locale: SiteLocale) {
  if (!value) return "";
  if (locale !== "zh") return value;
  return reviewQueueZhOverrides[value] ?? translateToZh(value) ?? value;
}

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

function laneItemLabel(count: string, locale: SiteLocale) {
  if (locale === "zh") return "项";
  return count === "1" ? "item" : "items";
}

function optionChoiceKey(itemId: string, label: string) {
  return `${itemId}:${label}`;
}

function uniqueLanes(items: readonly ReviewQueueItem[]) {
  return Array.from(new Set(items.map((item) => item.lane)));
}

function ReviewMetricCard({ metric, locale }: { metric: ReviewQueueMetric; locale: SiteLocale }) {
  const Icon = metricIcons[metric.label] ?? ClipboardCheck;
  const t = (value: string | undefined) => reviewText(value, locale);

  return (
    <article className={`rounded-[8px] border p-4 ${metricToneClass[metric.label] ?? metricToneClass["Open decisions"]}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase text-current">{t(metric.label)}</p>
        <Icon size={17} aria-hidden />
      </div>
      <p className="mt-3 text-2xl font-semibold text-white">{metric.value}</p>
      <p className="mt-2 text-xs leading-5 text-slate-200/85">{t(metric.detail)}</p>
    </article>
  );
}

function ReviewHero({
  currentItem,
  data,
  locale
}: {
  currentItem: ReviewQueueItem;
  data: ReviewQueueData;
  locale: SiteLocale;
}) {
  const t = (value: string | undefined) => reviewText(value, locale);

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
            {t("Owner Review Queue")}
          </div>

          <div className="relative mt-5 max-w-4xl">
            <h2 id="review-queue-title" className="max-w-4xl text-3xl font-semibold leading-[1.04] text-white md:text-5xl">
              {t("Decisions stay explicit before anything moves.")}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
              {t("Decision packets prepared by Doraemon and MiniDoras. Review evidence, blockers, allowed next steps, and missing proof without approving, dispatching, or silently promoting work.")}
            </p>
          </div>

          <div className="relative mt-5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-violet-200/25 bg-violet-300/10 px-3 py-1.5 text-xs font-bold uppercase text-violet-100">
              <LockKeyhole size={14} aria-hidden />
              {t("Owner-only")}
            </span>
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-emerald-200/25 bg-emerald-300/10 px-3 py-1.5 text-xs font-bold uppercase text-emerald-100">
              <FileSearch size={14} aria-hidden />
              {t("Read-only packets")}
            </span>
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 px-3 py-1.5 text-xs font-bold uppercase text-yellow-100">
              <ShieldCheck size={14} aria-hidden />
              {t("No execution")}
            </span>
          </div>

          <div className="relative mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {data.metrics.map((metric) => <ReviewMetricCard key={metric.label} metric={metric} locale={locale} />)}
          </div>

          <div className="relative mt-6 rounded-[8px] border border-slate-700 bg-[#07111f]/70 p-4 backdrop-blur">
            <div className="flex items-center gap-2 text-sky-100">
              <Waypoints size={17} aria-hidden />
              <p className="text-xs font-bold uppercase">{t("Decision flow")}</p>
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
                    <p className="mt-3 text-sm font-semibold">{t(step.label)}</p>
                    <p className="mt-1 text-xs leading-5 opacity-75">{t(step.detail)}</p>
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
                <p className="text-xs font-bold uppercase text-yellow-100">{t("Current packet")}</p>
                <h3 id="current-review-title" className="mt-2 text-2xl font-semibold text-white">
                  {t(currentItem.title)}
                </h3>
                <p className="mt-1 text-xs font-bold uppercase text-sky-100">{t(currentItem.agent)}</p>
              </div>
              <StatusBadge tone={urgencyTone(currentItem.urgency)}>{t(currentItem.urgency)}</StatusBadge>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-300">{t(currentItem.requestedDecision)}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <StatusBadge tone={currentItem.tone}>{t(currentItem.decision)}</StatusBadge>
              <StatusBadge tone="info">{t(currentItem.lane)}</StatusBadge>
            </div>
          </div>

          <div className="relative mt-4 grid gap-3">
            <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <p className="text-xs font-bold uppercase text-slate-400">{t("Recommended handling")}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-white">{t(currentItem.recommendedHandling)}</p>
            </div>
            <div className="rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 p-4">
              <p className="text-xs font-bold uppercase text-yellow-100">{t("Allowed next")}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-yellow-50">{t(currentItem.allowedNext)}</p>
            </div>
            <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs font-bold uppercase text-slate-400">{t("Evidence")}</dt>
                  <dd className="mt-1 font-semibold text-white">{evidenceSummary(currentItem)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase text-slate-400">{t("Blockers")}</dt>
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
  onSelect,
  locale
}: {
  lanes: readonly string[];
  activeLane: string;
  onSelect: (lane: string) => void;
  locale: SiteLocale;
}) {
  const t = (value: string | undefined) => reviewText(value, locale);

  return (
    <div className="flex flex-wrap gap-2" aria-label={t("Review queue lane filters")}>
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
            {t(lane)}
          </button>
        );
      })}
    </div>
  );
}

function QueueList({
  items,
  selectedId,
  onSelect,
  locale
}: {
  items: readonly ReviewQueueItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  locale: SiteLocale;
}) {
  const t = (value: string | undefined) => reviewText(value, locale);

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
                <p className="text-sm font-semibold text-white">{t(item.title)}</p>
                <p className="mt-1 text-xs font-bold uppercase text-yellow-100">{t(item.agent)}</p>
              </div>
              <StatusBadge tone={item.tone}>{t(item.decision)}</StatusBadge>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-slate-400">
              <span>
                <strong className="text-slate-300">{t("Lane")}:</strong> {t(item.lane)}
              </span>
              <span>
                <strong className="text-slate-300">{t("Proof")}:</strong> {evidenceSummary(item)}
              </span>
              <span>
                <strong className="text-slate-300">{t("Due")}:</strong> {t(item.urgency)}
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
  draftNote,
  activeLane,
  lanes,
  onDraftChoice,
  onDraftNote,
  onLaneSelect,
  onItemSelect,
  locale
}: {
  items: readonly ReviewQueueItem[];
  selectedItem: ReviewQueueItem;
  draftChoice: string;
  draftNote: string;
  activeLane: string;
  lanes: readonly string[];
  onDraftChoice: (choice: string) => void;
  onDraftNote: (note: string) => void;
  onLaneSelect: (lane: string) => void;
  onItemSelect: (id: string) => void;
  locale: SiteLocale;
}) {
  const t = (value: string | undefined) => reviewText(value, locale);

  return (
    <section className="panel p-5" aria-labelledby="evidence-workbench-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <FileSearch size={22} aria-hidden />
            <h2 id="evidence-workbench-title" className="text-2xl font-semibold text-white">
              {t("Evidence workbench")}
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            {t("Inspect the selected packet in detail. All information is read-only; missing proof is visible instead of being papered over.")}
          </p>
        </div>
        <StatusBadge tone="private">{t("No execution")}</StatusBadge>
      </div>

      <div className="mt-5">
        <LaneFilters lanes={lanes} activeLane={activeLane} onSelect={onLaneSelect} locale={locale} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[20rem_minmax(0,1fr)] 2xl:grid-cols-[22rem_minmax(0,1fr)_24rem]">
        <aside className="rounded-[8px] border border-slate-700 bg-white/[0.035] p-4" aria-label={t("Decision packets")}>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase text-slate-400">{t("Decision packets")}</p>
            <span className="text-xs font-semibold text-slate-500">{locale === "zh" ? `显示 ${items.length} 项` : `${items.length} shown`}</span>
          </div>
          <div className="mt-4">
            <QueueList items={items} selectedId={selectedItem.id} onSelect={onItemSelect} locale={locale} />
          </div>
        </aside>

        <article className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-5" aria-labelledby="selected-packet-title">
          <p className="sr-only" aria-live="polite">
            {locale === "zh" ? `选中审核包：${t(selectedItem.title)}。${t(selectedItem.decision)}。` : `Selected packet: ${selectedItem.title}. ${selectedItem.decision}.`}
          </p>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase text-yellow-100">{t("Selected packet")}</p>
              <h3 id="selected-packet-title" className="mt-2 text-2xl font-semibold text-white">
                {t(selectedItem.title)}
              </h3>
              <p className="mt-2 text-xs font-bold uppercase text-slate-400">
                {t(selectedItem.urgency)} - {t(selectedItem.agent)} - {selectedItem.surface}
              </p>
            </div>
            <StatusBadge tone={selectedItem.tone}>{t(selectedItem.decision)}</StatusBadge>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[8px] border border-slate-700 bg-[#07111f]/58 p-4">
              <p className="text-xs font-bold uppercase text-slate-400">{t("Requested decision")}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{t(selectedItem.requestedDecision)}</p>
            </div>
            <div className="rounded-[8px] border border-slate-700 bg-[#07111f]/58 p-4">
              <p className="text-xs font-bold uppercase text-slate-400">{t("Recommended handling")}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{t(selectedItem.recommendedHandling)}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {selectedItem.checkpoints.map((checkpoint) => (
              <div key={`${selectedItem.id}-${checkpoint.label}`} className="rounded-[8px] border border-slate-700 bg-[#07111f]/58 p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-slate-300">{t(checkpoint.label)}</span>
                  <StatusBadge tone={checkpoint.tone}>{t(checkpoint.state)}</StatusBadge>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-[8px] border border-slate-700 bg-[#07111f]/58 p-4">
            <div className="flex items-center gap-2 text-sky-100">
              <MessageSquareText size={17} aria-hidden />
              <p className="text-sm font-semibold">{t("Agent note")}</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{t(selectedItem.note)}</p>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_12rem]">
            <div className="rounded-[8px] border border-slate-700 bg-[#07111f]/58 p-4">
              <p className="text-xs font-bold uppercase text-slate-400">{t("Evidence requested")}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedItem.evidence.map((evidence) => (
                  <span key={`${selectedItem.id}-${evidence}`} className="rounded-[8px] border border-slate-700 bg-white/[0.045] px-3 py-1.5 text-xs font-semibold text-slate-300">
                    {t(evidence)}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-[8px] border border-slate-700 bg-[#07111f]/58 p-4">
              <p className="text-xs font-bold uppercase text-slate-400">{t("Updated")}</p>
              <p className="mt-3 text-sm font-semibold text-white">{t(selectedItem.updated)}</p>
            </div>
          </div>
        </article>

        <aside className="grid gap-4 xl:col-span-2 2xl:col-span-1">
          <DecisionPlanner
            selectedItem={selectedItem}
            draftChoice={draftChoice}
            draftNote={draftNote}
            onDraftChoice={onDraftChoice}
            onDraftNote={onDraftNote}
            locale={locale}
          />

          <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase text-slate-400">{t("Evidence")}</p>
              <span className="text-sm font-semibold text-slate-300">{evidenceSummary(selectedItem)}</span>
            </div>
            <div className="mt-3 grid gap-3">
              {selectedItem.evidenceCards.map((evidence) => (
                <div key={`${selectedItem.id}-${evidence.label}`} className="rounded-[8px] border border-slate-700 bg-[#07111f]/70 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-white">{t(evidence.label)}</p>
                    <StatusBadge tone={evidence.tone}>{t(evidence.state)}</StatusBadge>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{t(evidence.detail)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[8px] border border-red-300/35 bg-red-400/8 p-4">
            <div className="flex items-center gap-2 text-red-100">
              <AlertTriangle size={17} aria-hidden />
              <p className="text-sm font-semibold">{t("Blockers")}</p>
            </div>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-300">
              {selectedItem.blockers.map((blocker) => (
                <li key={`${selectedItem.id}-${blocker}`} className="flex gap-2">
                  <XCircle className="mt-1 shrink-0 text-red-100" size={15} aria-hidden />
                  <span>{t(blocker)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <p className="text-xs font-bold uppercase text-slate-400">{t("Allowed next")}</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{t(selectedItem.allowedNext)}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function DecisionPlanner({
  selectedItem,
  draftChoice,
  draftNote,
  onDraftChoice,
  onDraftNote,
  locale
}: {
  selectedItem: ReviewQueueItem;
  draftChoice: string;
  draftNote: string;
  onDraftChoice: (choice: string) => void;
  onDraftNote: (note: string) => void;
  locale: SiteLocale;
}) {
  const selectedOption = selectedItem.decisionOptions.find((option) => option.label === draftChoice) ?? selectedItem.decisionOptions[0];
  const t = (value: string | undefined) => reviewText(value, locale);

  return (
    <section className="rounded-[8px] border border-sky-300/35 bg-sky-300/10 p-4" aria-labelledby="decision-planner-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <ShieldCheck size={17} aria-hidden />
            <h3 id="decision-planner-title" className="text-sm font-semibold">
              {t("Owner decision draft")}
            </h3>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-400">
            {t("Choose a local review posture for this packet. No API call, approval, publish, or dispatch is sent.")}
          </p>
        </div>
        <StatusBadge tone="private">{t("Local only")}</StatusBadge>
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
                <span className="text-sm font-semibold">{t(option.label)}</span>
                <StatusBadge tone={option.tone}>{t(option.state)}</StatusBadge>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">{t(option.detail)}</p>
            </button>
          );
        })}
      </div>

      {selectedOption ? (
        <div className="mt-4 rounded-[8px] border border-slate-700 bg-[#07111f]/70 p-3">
          <p className="text-xs font-bold uppercase text-slate-400">{t("If selected")}</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">{t(selectedOption.next)}</p>
        </div>
      ) : null}

      <div className="mt-4 rounded-[8px] border border-slate-700 bg-[#07111f]/70 p-3">
        <label htmlFor={`owner-note-${selectedItem.id}`} className="text-xs font-bold uppercase text-slate-400">
          {t("Owner note draft")}
        </label>
        <textarea
          id={`owner-note-${selectedItem.id}`}
          value={draftNote}
          onChange={(event) => onDraftNote(event.target.value)}
          rows={4}
          className="mt-3 min-h-28 w-full resize-y rounded-[8px] border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm leading-6 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300"
          placeholder={t("Private note for this review packet")}
        />
        <p className="mt-2 text-xs leading-5 text-slate-500">
          {t("This note stays in this browser session. It is not saved, sent, or treated as approval.")}
        </p>
      </div>

      <div className="mt-4">
        <p className="text-xs font-bold uppercase text-slate-400">{t("Gates before merge")}</p>
        <div className="mt-3 grid gap-2">
          {selectedItem.reviewGates.map((gate) => (
            <div key={`${selectedItem.id}-${gate.label}`} className="rounded-[8px] border border-slate-700 bg-[#07111f]/58 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                  <CheckCircle2 size={15} aria-hidden />
                  {t(gate.label)}
                </span>
                <StatusBadge tone={gate.tone}>{t(gate.state)}</StatusBadge>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">{t(gate.detail)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-bold uppercase text-slate-400">{t("Still unavailable")}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedItem.disallowedActions.map((action) => (
            <span key={`${selectedItem.id}-${action}`} className="rounded-[8px] border border-slate-700 bg-[#07111f]/58 px-3 py-1.5 text-xs font-semibold text-slate-300">
              {t(action)}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function DecisionLanes({ lanes, locale }: { lanes: readonly ReviewQueueLane[]; locale: SiteLocale }) {
  const t = (value: string | undefined) => reviewText(value, locale);

  return (
    <section className="panel p-5" aria-labelledby="review-lanes-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <Waypoints size={22} aria-hidden />
            <h2 id="review-lanes-title" className="text-2xl font-semibold text-white">
              {t("Decision lanes")}
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            {t("Each lane says who owns the review, why the item exists, and whether the next step is current, deferred, or blocked.")}
          </p>
        </div>
        <StatusBadge tone="warning">{t("Owner-gated")}</StatusBadge>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {lanes.map((lane, index) => (
          <article key={lane.label} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <span className="flex size-9 items-center justify-center rounded-[8px] border border-sky-200/35 bg-sky-200/16 text-xs font-semibold text-white" aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </span>
              <StatusBadge tone={lane.tone}>{t(lane.state)}</StatusBadge>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">{t(lane.label)}</h3>
            <p className="mt-1 text-xs font-bold uppercase text-yellow-100">{t(lane.owner)}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{t(lane.detail)}</p>
            <p className="mt-4 rounded-[8px] border border-slate-700 bg-[#07111f]/70 p-3 text-xs leading-5 text-slate-400">
              {locale === "zh" ? `${lane.count} ${laneItemLabel(lane.count, locale)}在这个通道。` : `${lane.count} ${laneItemLabel(lane.count, locale)} in this lane`}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PolicyRail({ policy, locale }: { policy: readonly string[]; locale: SiteLocale }) {
  const t = (value: string | undefined) => reviewText(value, locale);

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <section className="panel p-5" aria-labelledby="review-policy-title">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-yellow-100">
              <ShieldAlert size={22} aria-hidden />
              <h2 id="review-policy-title" className="text-2xl font-semibold text-white">
                {t("Review rules")}
              </h2>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              {t("The queue represents decisions as states only. It can clarify what is allowed next, but it cannot perform the next step.")}
            </p>
          </div>
          <StatusBadge tone="private">{t("Read-only")}</StatusBadge>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {policy.map((rule) => (
            <div key={rule} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 text-sm leading-6 text-slate-300">
              {t(rule)}
            </div>
          ))}
        </div>
      </section>

      <aside className="panel p-5" aria-labelledby="review-unavailable-title">
        <div className="flex items-center gap-2 text-yellow-100">
          <Clock3 size={20} aria-hidden />
          <h2 id="review-unavailable-title" className="text-2xl font-semibold text-white">
            {t("Unavailable")}
          </h2>
        </div>
        <div className="mt-5 grid gap-2">
          {unavailableActions.map((item) => (
            <div key={item} className="flex items-center justify-between gap-3 rounded-[8px] border border-slate-700 bg-white/[0.045] px-3 py-2 text-sm text-slate-300">
              <span>{t(item)}</span>
              <StatusBadge tone="private">{t("Unavailable")}</StatusBadge>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

function CommandBridge({ locale }: { locale: SiteLocale }) {
  const t = (value: string | undefined) => reviewText(value, locale);

  return (
    <section className="panel p-5" aria-label={t("Review queue continuation paths")}>
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <Layers3 size={22} aria-hidden />
            <h2 className="text-2xl font-semibold text-white">{t("Continue from review")}</h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            {t("Review Queue does not mutate work. When a decision is clear, move to the relevant private surface and keep the next step explicit.")}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/app/command" className="link-focus group rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 transition hover:border-sky-200/35 hover:bg-sky-300/10">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-white">{t("Open Command")}</span>
              <ArrowRight className="text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-sky-100" size={16} aria-hidden />
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-400">{t("Draft a mission packet after review is understood.")}</p>
          </Link>
          <Link href="/app/agents" className="link-focus group rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 transition hover:border-sky-200/35 hover:bg-sky-300/10">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-white">{t("See Agents")}</span>
              <ArrowRight className="text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-sky-100" size={16} aria-hidden />
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-400">{t("Inspect the MiniDora lane responsible for the packet.")}</p>
          </Link>
        </div>
      </div>
    </section>
  );
}

function EmptyQueueState({ locale }: { locale: SiteLocale }) {
  const t = (value: string | undefined) => reviewText(value, locale);

  return (
    <section className="panel p-6" aria-labelledby="empty-review-queue-title">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 text-emerald-100">
            <ClipboardCheck size={22} aria-hidden />
            <h2 id="empty-review-queue-title" className="text-2xl font-semibold text-white">
              {t("Review Queue is clear")}
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            {t("No owner decision packets are waiting right now. The surface stays read-only and will show evidence, blockers, and allowed next steps when Doraemon prepares a packet.")}
          </p>
        </div>
        <StatusBadge tone="normal">{t("Clear")}</StatusBadge>
      </div>
    </section>
  );
}

export function OwnerReviewQueueSurface({ data }: { data: ReviewQueueData }) {
  const { locale } = useLanguage();
  const lanes = useMemo(() => uniqueLanes(data.queue), [data.queue]);
  const [activeLane, setActiveLane] = useState("All lanes");
  const [selectedItemId, setSelectedItemId] = useState(data.queue[0]?.id ?? "");
  const [draftChoices, setDraftChoices] = useState<Record<string, string>>({});
  const [draftNotes, setDraftNotes] = useState<Record<string, string>>({});

  const visibleQueue = useMemo(() => {
    if (activeLane === "All lanes") {
      return data.queue;
    }

    return data.queue.filter((item) => item.lane === activeLane);
  }, [activeLane, data.queue]);

  const selectedItem = data.queue.find((item) => item.id === selectedItemId) ?? visibleQueue[0] ?? data.queue[0];

  if (!selectedItem) {
    return <EmptyQueueState locale={locale} />;
  }

  function handleLaneSelect(lane: string) {
    setActiveLane(lane);
    const nextVisible = lane === "All lanes" ? data.queue : data.queue.filter((item) => item.lane === lane);
    if (nextVisible[0]) {
      setSelectedItemId(nextVisible[0].id);
    }
  }

  const draftChoice = draftChoices[selectedItem.id] ?? selectedItem.decisionOptions[0]?.label ?? "";
  const draftNote = draftNotes[selectedItem.id] ?? "";

  function handleDraftChoice(choice: string) {
    setDraftChoices((current) => ({
      ...current,
      [selectedItem.id]: choice
    }));
  }

  function handleDraftNote(note: string) {
    setDraftNotes((current) => ({
      ...current,
      [selectedItem.id]: note
    }));
  }

  return (
    <div className="grid gap-5" data-i18n-skip>
      <ReviewHero currentItem={selectedItem} data={data} locale={locale} />
      <EvidenceWorkbench
        items={visibleQueue}
        selectedItem={selectedItem}
        draftChoice={draftChoice}
        draftNote={draftNote}
        activeLane={activeLane}
        lanes={lanes}
        onDraftChoice={handleDraftChoice}
        onDraftNote={handleDraftNote}
        onLaneSelect={handleLaneSelect}
        onItemSelect={setSelectedItemId}
        locale={locale}
      />
      <DecisionLanes lanes={data.lanes} locale={locale} />
      <PolicyRail policy={data.policy} locale={locale} />
      <CommandBridge locale={locale} />
    </div>
  );
}
