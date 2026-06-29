"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Archive,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  ClipboardCheck,
  Database,
  EyeOff,
  FileText,
  GitBranch,
  Layers,
  ListChecks,
  LockKeyhole,
  Radio,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { StatusBadge } from "@/components/StatusBadge";
import { UnavailableControlsPanel } from "@/components/UnavailableControlsPanel";
import {
  isOwnerKnowledgeCandidateId,
  knowledgeCandidateIdFromRoute,
  OWNER_KNOWLEDGE_CANDIDATE_PARAM,
  ownerKnowledgeHref
} from "@/lib/knowledge-route";
import { translateToZh, type SiteLocale } from "@/lib/site-i18n";

type KnowledgeTone = "normal" | "info" | "warning" | "private" | "danger";

type KnowledgeReviewRow = {
  label: string;
  state: string;
  tone: KnowledgeTone;
  ready: boolean;
  detail: string;
};

type KnowledgeReviewPosture = {
  label: string;
  state: string;
  tone: KnowledgeTone;
  detail: string;
  next: string;
};

type KnowledgeSource = {
  title: string;
  state: string;
  tone: KnowledgeTone;
  scope: string;
  signal: string;
  summary: string;
  detail: string;
};

type KnowledgePosture = {
  label: string;
  value: string;
  tone: KnowledgeTone;
  detail: string;
};

type KnowledgeQueueItem = {
  id: string;
  title: string;
  owner: string;
  state: string;
  tone: KnowledgeTone;
  priority: string;
  destination: string;
  output: string;
  risk: string;
  evidence: readonly string[];
  reviewSummary: string;
  boundary: string;
  readiness: readonly KnowledgeReviewRow[];
  transformSteps: readonly KnowledgeReviewRow[];
  safeOutputs: readonly KnowledgeReviewRow[];
  ownerPostures: readonly KnowledgeReviewPosture[];
};

type KnowledgeBridgeStep = {
  label: string;
  state: string;
  tone: KnowledgeTone;
  detail: string;
};

type KnowledgeVaultData = {
  sources: readonly KnowledgeSource[];
  queue: readonly KnowledgeQueueItem[];
  policy: readonly string[];
  posture: readonly KnowledgePosture[];
  publishBridge: readonly KnowledgeBridgeStep[];
  unavailableControls: readonly string[];
};

type KnowledgeRouteMode = "push" | "replace";

const sourceIcons: Record<string, LucideIcon> = {
  "Source inbox": BookOpen,
  "Synthesis briefs": BrainCircuit,
  "Public candidates": FileText,
  "Memory context": LockKeyhole
};

const sourceIconFallbacks = [BookOpen, BrainCircuit, FileText, LockKeyhole] as const;
const untranslatedKnowledgeKeys = new Set(["id", "tone"]);

const metricToneClass = {
  normal: "border-emerald-200/25 bg-emerald-300/10 text-emerald-100",
  info: "border-sky-200/25 bg-sky-300/10 text-sky-100",
  warning: "border-yellow-200/30 bg-yellow-300/10 text-yellow-100",
  private: "border-violet-200/25 bg-violet-300/10 text-violet-100",
  danger: "border-red-200/30 bg-red-400/10 text-red-100"
} as const;

function knowledgeText(value: string | undefined, locale: SiteLocale) {
  if (!value) return "";
  return locale === "zh" ? translateToZh(value) ?? value : value;
}

function localizeKnowledgeData<T>(value: T, locale: SiteLocale): T {
  if (locale !== "zh") return value;
  if (typeof value === "string") return knowledgeText(value, locale) as T;
  if (Array.isArray(value)) return value.map((item) => localizeKnowledgeData(item, locale)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        untranslatedKnowledgeKeys.has(key) ? item : localizeKnowledgeData(item, locale)
      ])
    ) as T;
  }
  return value;
}

function readinessLabel(rows: readonly KnowledgeReviewRow[], locale: SiteLocale) {
  const ready = rows.filter((row) => row.ready).length;
  if (locale === "zh") return `${ready}/${rows.length} 项就绪`;
  return `${ready} of ${rows.length} ready`;
}

function candidateCountLabel(count: number, locale: SiteLocale) {
  return locale === "zh" ? `${count} 个候选` : `${count} candidates`;
}

function priorityLabel(priority: string, locale: SiteLocale) {
  return locale === "zh" ? `优先级 ${knowledgeText(priority, locale)}` : `Priority ${priority}`;
}

function readyCount(rows: readonly KnowledgeReviewRow[]) {
  return rows.filter((row) => row.ready).length;
}

function totalReadyCount(queue: readonly KnowledgeQueueItem[]) {
  return queue.reduce((sum, item) => sum + readyCount(item.readiness), 0);
}

function totalReadinessCount(queue: readonly KnowledgeQueueItem[]) {
  return queue.reduce((sum, item) => sum + item.readiness.length, 0);
}

function candidateIdFromSearch(search: string, candidates: readonly KnowledgeQueueItem[]) {
  const params = new URLSearchParams(search);
  const candidateId = knowledgeCandidateIdFromRoute(params.get(OWNER_KNOWLEDGE_CANDIDATE_PARAM));
  return candidateId && candidates.some((candidate) => candidate.id === candidateId) ? candidateId : undefined;
}

function knowledgeCandidateUrl(candidateId: string) {
  if (!isOwnerKnowledgeCandidateId(candidateId)) {
    return ownerKnowledgeHref();
  }

  const nextHref = ownerKnowledgeHref(candidateId);

  if (typeof window === "undefined") {
    return nextHref;
  }

  const url = new URL(window.location.href);
  const nextUrl = new URL(nextHref, url.origin);
  return `${nextUrl.pathname}${nextUrl.search}${url.hash}`;
}

function currentKnowledgeUrl() {
  if (typeof window === "undefined") {
    return "";
  }

  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function postureKey(candidateId: string, label: string) {
  return `${candidateId}:${label}`;
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
  tone = "info"
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  tone?: KnowledgeTone;
}) {
  const { locale } = useLanguage();
  const t = (value: string) => knowledgeText(value, locale);

  return (
    <article className={`rounded-[8px] border p-4 ${metricToneClass[tone]}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase text-current">{t(label)}</p>
        <Icon size={17} aria-hidden />
      </div>
      <p className="mt-3 text-2xl font-semibold text-white">{t(value)}</p>
      <p className="mt-2 text-xs leading-5 text-slate-200/85">{t(detail)}</p>
    </article>
  );
}

function BridgeRail({ steps }: { steps: readonly KnowledgeBridgeStep[] }) {
  const { locale } = useLanguage();
  const t = (value: string) => knowledgeText(value, locale);

  return (
    <div className="rounded-[8px] border border-slate-700 bg-[#07111f]/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sky-100">
          <GitBranch size={18} aria-hidden />
          <h3 className="text-sm font-semibold text-white">{t("Private-to-public bridge")}</h3>
        </div>
        <StatusBadge tone="warning">{t("Gated")}</StatusBadge>
      </div>
      <div className="mt-4 grid gap-3">
        {steps.map((step, index) => (
          <div key={step.label} className="grid grid-cols-[1.6rem_1fr] gap-3">
            <div className="relative flex justify-center">
              <span className="mt-1 flex size-6 items-center justify-center rounded-full border border-sky-200/30 bg-sky-300/10 text-xs font-bold text-sky-100">
                {index + 1}
              </span>
              {index < steps.length - 1 ? <span className="absolute bottom-[-0.9rem] top-8 w-px bg-slate-700" aria-hidden /> : null}
            </div>
            <div className="pb-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-white">{step.label}</p>
                <StatusBadge tone={step.tone}>{step.state}</StatusBadge>
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-400">{step.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KnowledgeReviewWorkbench({
  candidates,
  selectedCandidate,
  postureChoiceIndex,
  onCandidateSelect,
  onPostureChoice
}: {
  candidates: readonly KnowledgeQueueItem[];
  selectedCandidate: KnowledgeQueueItem;
  postureChoiceIndex: number;
  onCandidateSelect: (candidateId: string) => void;
  onPostureChoice: (choiceIndex: number) => void;
}) {
  const { locale } = useLanguage();
  const t = (value: string) => knowledgeText(value, locale);
  const selectedPosture = selectedCandidate.ownerPostures[postureChoiceIndex] ?? selectedCandidate.ownerPostures[0];

  return (
    <section className="panel overflow-hidden" aria-labelledby="knowledge-review-workbench-title">
      <div className="border-b border-slate-700/70 p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-yellow-100">
              <BrainCircuit size={22} aria-hidden />
              <h2 id="knowledge-review-workbench-title" className="text-2xl font-semibold text-white">
                {t("Owner review workbench")}
              </h2>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              {t("Inspect one synthesis candidate at a time. The controls below only change the local reading posture; they do not publish, sync, expose sources, or create a public page.")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone="private">{t("Local state")}</StatusBadge>
            <StatusBadge tone="warning">{t("Owner review")}</StatusBadge>
          </div>
        </div>
      </div>

      <div className="grid min-w-0 xl:grid-cols-[19rem_minmax(0,1fr)] 2xl:grid-cols-[19rem_minmax(0,1fr)_23rem]">
        <aside className="border-b border-slate-700/70 bg-white/[0.025] p-4 xl:border-b-0 xl:border-r" aria-label={t("Synthesis candidates")}>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xs font-bold uppercase text-slate-400">{t("Review queue")}</h3>
            <span className="text-xs font-semibold text-slate-500">{candidateCountLabel(candidates.length, locale)}</span>
          </div>
          <div className="mt-4 grid gap-3">
            {candidates.map((candidate) => {
              const active = candidate.id === selectedCandidate.id;
              const ready = readyCount(candidate.readiness);

              return (
                <button
                  key={candidate.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onCandidateSelect(candidate.id)}
                  className={`link-focus rounded-[8px] border p-4 text-left transition ${
                    active
                      ? "border-yellow-200/55 bg-yellow-300/12 shadow-[0_18px_50px_rgba(250,204,21,0.10)]"
                      : "border-slate-700 bg-white/[0.045] hover:-translate-y-0.5 hover:border-yellow-200/35 hover:bg-white/[0.07]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{candidate.title}</p>
                      <p className="mt-1 text-xs font-bold uppercase text-yellow-100">{candidate.owner}</p>
                    </div>
                    <StatusBadge tone={candidate.tone}>{candidate.state}</StatusBadge>
                  </div>
                  <div className="mt-3 grid gap-2 text-xs text-slate-400 sm:grid-cols-2 xl:grid-cols-1">
                    <span>
                      <strong className="text-slate-300">{t("Evidence")}:</strong> {ready}/{candidate.readiness.length}
                    </span>
                    <span>
                      <strong className="text-slate-300">{t("Destination")}:</strong> {candidate.destination}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <article className="min-w-0 p-5 md:p-6" aria-labelledby="selected-knowledge-candidate-title">
          <p className="sr-only" aria-live="polite">
            {t("Selected synthesis candidate")}: {selectedCandidate.title}. {selectedCandidate.state}.
          </p>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase text-yellow-100">{t("Selected candidate")}</p>
              <h3 id="selected-knowledge-candidate-title" className="mt-2 text-2xl font-semibold text-white">
                {selectedCandidate.title}
              </h3>
              <p className="mt-2 text-xs font-bold uppercase text-slate-400">
                {selectedCandidate.owner} / {selectedCandidate.output} / {priorityLabel(selectedCandidate.priority, locale)}
              </p>
            </div>
            <StatusBadge tone={selectedCandidate.tone}>{selectedCandidate.state}</StatusBadge>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-[8px] border border-slate-700 bg-[#07111f]/58 p-3">
              <p className="text-xs font-bold uppercase text-slate-400">{t("Destination")}</p>
              <p className="mt-2 text-sm font-semibold text-white">{selectedCandidate.destination}</p>
            </div>
            <div className="rounded-[8px] border border-slate-700 bg-[#07111f]/58 p-3">
              <p className="text-xs font-bold uppercase text-slate-400">{t("Evidence")}</p>
              <p className="mt-2 text-sm font-semibold text-white">{readinessLabel(selectedCandidate.readiness, locale)}</p>
            </div>
            <div className="rounded-[8px] border border-slate-700 bg-[#07111f]/58 p-3">
              <p className="text-xs font-bold uppercase text-slate-400">{t("Risk")}</p>
              <p className="mt-2 text-sm font-semibold text-white">{selectedCandidate.risk}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 2xl:grid-cols-2">
            <div className="rounded-[8px] border border-slate-700 bg-[#07111f]/58 p-4">
              <h4 className="text-xs font-bold uppercase text-slate-400">{t("Review summary")}</h4>
              <p className="mt-2 text-sm leading-6 text-slate-300">{selectedCandidate.reviewSummary}</p>
            </div>
            <div className="rounded-[8px] border border-red-300/30 bg-red-400/10 p-4">
              <h4 className="text-xs font-bold uppercase text-red-100">{t("Boundary")}</h4>
              <p className="mt-2 text-sm leading-6 text-slate-300">{selectedCandidate.boundary}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            <section className="rounded-[8px] border border-slate-700 bg-[#07111f]/58 p-4" aria-labelledby="knowledge-evidence-title">
              <h4 id="knowledge-evidence-title" className="text-sm font-semibold text-sky-100">
                {t("Evidence readiness")}
              </h4>
              <div className="mt-3 grid gap-3">
                {selectedCandidate.readiness.map((row) => (
                  <div key={`${selectedCandidate.id}-${row.label}`} className="rounded-[8px] border border-slate-700 bg-white/[0.035] p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-white">{row.label}</p>
                      <StatusBadge tone={row.tone}>{row.state}</StatusBadge>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-400">{row.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[8px] border border-slate-700 bg-[#07111f]/58 p-4" aria-labelledby="knowledge-rewrite-title">
              <h4 id="knowledge-rewrite-title" className="text-sm font-semibold text-sky-100">
                {t("Rewrite path")}
              </h4>
              <div className="mt-3 grid gap-3">
                {selectedCandidate.transformSteps.map((step, index) => (
                  <div key={`${selectedCandidate.id}-${step.label}`} className="rounded-[8px] border border-slate-700 bg-white/[0.035] p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase text-slate-500">{String(index + 1).padStart(2, "0")}</span>
                      <StatusBadge tone={step.tone}>{step.state}</StatusBadge>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-white">{step.label}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-400">{step.detail}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </article>

        <aside className="grid content-start gap-4 border-t border-slate-700/70 bg-white/[0.025] p-4 xl:col-span-2 2xl:col-span-1 2xl:border-l 2xl:border-t-0">
          <section className="rounded-[8px] border border-yellow-200/35 bg-yellow-300/10 p-4" aria-labelledby="knowledge-owner-posture-title">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-yellow-100">
                  <ShieldCheck size={17} aria-hidden />
                  <h3 id="knowledge-owner-posture-title" className="text-sm font-semibold text-white">
                    {t("Owner review posture")}
                  </h3>
                </div>
                <p className="mt-2 text-xs leading-5 text-yellow-50/80">
                  {t("Choose how to read this candidate locally. This does not publish, sync, or expose source material.")}
                </p>
              </div>
              <StatusBadge tone="private">{t("No publish")}</StatusBadge>
            </div>
            {selectedPosture ? (
              <p className="sr-only" aria-live="polite">
                {t("Posture")}: {selectedPosture.label}. {selectedPosture.next}
              </p>
            ) : null}

            <div className="mt-4 grid gap-2">
              {selectedCandidate.ownerPostures.map((posture, index) => {
                const active = index === postureChoiceIndex;

                return (
                  <button
                    key={postureKey(selectedCandidate.id, posture.label)}
                    type="button"
                    aria-pressed={active}
                    onClick={() => onPostureChoice(index)}
                    className={`link-focus rounded-[8px] border p-3 text-left transition ${
                      active
                        ? "border-yellow-100/65 bg-yellow-200/14 text-white"
                        : "border-slate-700 bg-[#07111f]/58 text-slate-300 hover:border-yellow-100/35 hover:bg-white/[0.07]"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-semibold">{posture.label}</span>
                      <StatusBadge tone={posture.tone}>{posture.state}</StatusBadge>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-400">{posture.detail}</p>
                  </button>
                );
              })}
            </div>

            {selectedPosture ? (
              <div className="mt-4 rounded-[8px] border border-slate-700 bg-[#07111f]/70 p-3">
                <h4 className="text-xs font-bold uppercase text-slate-400">{t("If selected")}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-300">{selectedPosture.next}</p>
              </div>
            ) : null}
          </section>

          <section className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4" aria-labelledby="knowledge-safe-outputs-title">
            <div className="flex items-center gap-2 text-emerald-100">
              <ClipboardCheck size={17} aria-hidden />
              <h3 id="knowledge-safe-outputs-title" className="text-sm font-semibold text-white">
                {t("Safe outputs")}
              </h3>
            </div>
            <div className="mt-3 grid gap-2">
              {selectedCandidate.safeOutputs.map((output) => (
                <div key={`${selectedCandidate.id}-${output.label}`} className="rounded-[8px] border border-slate-700 bg-[#07111f]/58 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                      <CheckCircle2 size={15} aria-hidden />
                      {output.label}
                    </span>
                    <StatusBadge tone={output.tone}>{output.state}</StatusBadge>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{output.detail}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}

export function KnowledgeVaultCockpit({
  data: rawData,
  initialCandidateId
}: {
  data: KnowledgeVaultData;
  initialCandidateId?: string;
}) {
  const { locale } = useLanguage();
  const t = (value: string) => knowledgeText(value, locale);
  const data = useMemo(() => localizeKnowledgeData(rawData, locale), [rawData, locale]);
  const initialSelectedCandidateId =
    initialCandidateId && rawData.queue.some((candidate) => candidate.id === initialCandidateId)
      ? initialCandidateId
      : rawData.queue[0]?.id ?? "";
  const [selectedCandidateId, setSelectedCandidateId] = useState(initialSelectedCandidateId);
  const [postureChoices, setPostureChoices] = useState<Record<string, number>>({});

  const selectedCandidate = useMemo(() => {
    return data.queue.find((item) => item.id === selectedCandidateId) ?? data.queue[0];
  }, [data.queue, selectedCandidateId]);

  const postureChoiceIndex = selectedCandidate ? postureChoices[selectedCandidate.id] ?? 0 : 0;
  const readyEvidence = totalReadyCount(data.queue);
  const totalEvidence = totalReadinessCount(data.queue);
  const ownerReviewCount = rawData.queue.filter((item) => item.state === "Owner review").length;
  const privateSourceCount = rawData.sources.filter((source) => source.tone === "private").length;

  function selectCandidate(candidateId: string, mode: KnowledgeRouteMode = "push") {
    setSelectedCandidateId(candidateId);

    if (typeof window === "undefined") {
      return;
    }

    const nextUrl = knowledgeCandidateUrl(candidateId);

    if (nextUrl !== currentKnowledgeUrl()) {
      window.history[mode === "push" ? "pushState" : "replaceState"](null, "", nextUrl);
    }
  }

  function handlePostureChoice(choiceIndex: number) {
    if (!selectedCandidate) {
      return;
    }

    setPostureChoices((current) => ({
      ...current,
      [selectedCandidate.id]: choiceIndex
    }));
  }

  useEffect(() => {
    function syncFromLocation() {
      const candidateId = candidateIdFromSearch(window.location.search, rawData.queue) ?? rawData.queue[0]?.id;

      if (candidateId) {
        setSelectedCandidateId((current) => (current === candidateId ? current : candidateId));
      }
    }

    syncFromLocation();
    window.addEventListener("popstate", syncFromLocation);
    return () => window.removeEventListener("popstate", syncFromLocation);
  }, [rawData.queue]);

  return (
    <div className="grid gap-5" data-i18n-skip>
      <section className="panel relative isolate overflow-hidden p-0" aria-labelledby="knowledge-vault-hero-title">
        <div
          className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-2/3 bg-[radial-gradient(circle_at_62%_20%,rgba(56,189,248,0.22),transparent_32%),radial-gradient(circle_at_82%_68%,rgba(250,204,21,0.14),transparent_30%),linear-gradient(135deg,transparent,rgba(59,130,246,0.10))]"
          aria-hidden
        />
        <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_27rem]">
          <div className="p-6 md:p-7">
            <div className="inline-flex items-center gap-2 rounded-[8px] border border-sky-200/25 bg-sky-300/10 px-3 py-2 text-xs font-bold uppercase text-sky-100">
              <Sparkles size={14} aria-hidden />
              {t("Owner Knowledge Vault")}
            </div>
            <h2 id="knowledge-vault-hero-title" className="mt-5 max-w-4xl text-3xl font-semibold text-white md:text-5xl">
              {t("Private synthesis, public-safe memory.")}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
              {t("A read-only cockpit for turning owner context, design notes, research method, and release evidence into reviewed knowledge without letting raw source material cross the public boundary.")}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <StatusBadge tone="private">{t("Authenticated")}</StatusBadge>
              <StatusBadge tone="warning">{t("Owner-gated")}</StatusBadge>
              <StatusBadge tone="normal">{t("Research-only boundary")}</StatusBadge>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                icon={Archive}
                label="Candidates"
                value={String(data.queue.length)}
                detail={locale === "zh" ? `${ownerReviewCount} 个待本人审核` : `${ownerReviewCount} in owner review`}
                tone="warning"
              />
              <MetricCard
                icon={ListChecks}
                label="Evidence"
                value={`${readyEvidence}/${totalEvidence}`}
                detail="Ready checks across the queue"
                tone="normal"
              />
              <MetricCard
                icon={Database}
                label="Sources"
                value={String(data.sources.length)}
                detail={locale === "zh" ? `私密来源通道：${privateSourceCount}` : `Private source lanes: ${privateSourceCount}`}
                tone="private"
              />
              <MetricCard
                icon={EyeOff}
                label="Execution"
                value={`0/${data.unavailableControls.length}`}
                detail="Active controls; publish, sync, trade, and source exposure remain unavailable"
                tone="info"
              />
            </div>
          </div>

          <div className="border-t border-slate-700/70 bg-[#07111f]/45 p-5 md:p-6 xl:border-l xl:border-t-0">
            <BridgeRail steps={data.publishBridge} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]" aria-labelledby="knowledge-source-posture">
        <div className="panel p-5 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sky-100">
                <Layers size={22} aria-hidden />
                <h2 id="knowledge-source-posture" className="text-2xl font-semibold text-white">
                  {t("Source posture")}
                </h2>
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                {t("The vault can classify source lanes and review signals, but it never renders raw private source text into the owner cockpit or public routes.")}
              </p>
            </div>
            <StatusBadge tone="private">{t("Source text hidden")}</StatusBadge>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
            {data.sources.map((source, index) => {
              const sourceIconKey = rawData.sources[index]?.title ?? source.title;
              const Icon = sourceIcons[sourceIconKey] ?? sourceIconFallbacks[index] ?? BookOpen;

              return (
                <article key={source.title} className="rounded-[8px] border border-slate-700 bg-white/[0.04] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] border border-sky-200/20 bg-sky-300/10 text-sky-100">
                      <Icon size={20} aria-hidden />
                    </span>
                    <StatusBadge tone={source.tone}>{source.state}</StatusBadge>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">{source.title}</h3>
                  <p className="mt-1 text-xs font-bold uppercase text-yellow-100">{source.scope}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{source.summary}</p>
                  <div className="mt-4 border-t border-slate-700 pt-3">
                    <p className="text-xs font-bold uppercase text-slate-400">{source.signal}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-400">{source.detail}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="panel p-5" aria-labelledby="knowledge-operating-posture-title">
          <div className="flex items-center gap-2 text-yellow-100">
            <ShieldCheck size={20} aria-hidden />
            <h2 id="knowledge-operating-posture-title" className="text-xl font-semibold text-white">
              {t("Operating posture")}
            </h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {t("The vault is deliberately useful before it becomes write-capable.")}
          </p>
          <div className="mt-5 grid gap-3">
            {data.posture.map((item) => (
              <div key={item.label} className="border-t border-slate-700 pt-3 first:border-t-0 first:pt-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <StatusBadge tone={item.tone}>{item.value}</StatusBadge>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-400">{item.detail}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      {selectedCandidate ? (
        <KnowledgeReviewWorkbench
          candidates={data.queue}
          selectedCandidate={selectedCandidate}
          postureChoiceIndex={postureChoiceIndex}
          onCandidateSelect={selectCandidate}
          onPostureChoice={handlePostureChoice}
        />
      ) : null}

      <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.2fr)_24rem]" aria-labelledby="knowledge-synthesis-queue-title">
        <div className="panel overflow-hidden p-0">
          <div className="border-b border-slate-700/70 p-5 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-yellow-100">
                  <BrainCircuit size={22} aria-hidden />
                  <h2 id="knowledge-synthesis-queue-title" className="text-2xl font-semibold text-white">
                    {t("Synthesis queue")}
                  </h2>
                </div>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  {t("Candidate outputs are visible as review work, not as publishable source material.")}
                </p>
              </div>
              <StatusBadge tone="warning">{t("Owner review required")}</StatusBadge>
            </div>
          </div>

          <div className="grid gap-3 p-4 md:hidden">
            {data.queue.map((item) => (
              <article key={item.title} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="mt-1 text-xs font-bold uppercase text-yellow-100">{item.output}</p>
                  </div>
                  <StatusBadge tone={item.tone}>{item.state}</StatusBadge>
                </div>
                <dl className="mt-4 grid gap-3 text-sm">
                  <div>
                    <dt className="text-xs font-bold uppercase text-slate-400">{t("Owner")}</dt>
                    <dd className="mt-1 font-semibold text-slate-200">{item.owner}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase text-slate-400">{t("Destination")}</dt>
                    <dd className="mt-1 font-semibold text-white">{item.destination}</dd>
                    <dd className="mt-1 text-xs text-slate-400">{priorityLabel(item.priority, locale)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase text-slate-400">{t("Risk")}</dt>
                    <dd className="mt-1 leading-6 text-slate-300">{item.risk}</dd>
                  </div>
                </dl>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.evidence.map((evidence) => (
                    <span key={evidence} className="rounded-[8px] border border-slate-700 bg-white/[0.045] px-2 py-1 text-xs text-slate-300">
                      {evidence}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-[640px] w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-700/70 text-xs font-bold uppercase text-slate-400">
                  <th scope="col" className="px-4 py-3">
                    {t("Candidate")}
                  </th>
                  <th scope="col" className="px-4 py-3">
                    {t("Owner")}
                  </th>
                  <th scope="col" className="px-4 py-3">
                    {t("Destination")}
                  </th>
                  <th scope="col" className="px-4 py-3">
                    {t("Risk")}
                  </th>
                  <th scope="col" className="px-4 py-3">
                    {t("State")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.queue.map((item) => (
                  <tr key={item.title} className="border-b border-slate-800/80 last:border-0">
                    <td className="px-4 py-4 align-top">
                      <p className="font-semibold text-white">{item.title}</p>
                      <p className="mt-1 text-xs font-bold uppercase text-yellow-100">{item.output}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.evidence.map((evidence) => (
                          <span key={evidence} className="rounded-[8px] border border-slate-700 bg-white/[0.045] px-2 py-1 text-xs text-slate-300">
                            {evidence}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top text-sm font-semibold text-slate-200">{item.owner}</td>
                    <td className="px-4 py-4 align-top">
                      <p className="text-sm font-semibold text-white">{item.destination}</p>
                      <p className="mt-1 text-xs text-slate-400">{priorityLabel(item.priority, locale)}</p>
                    </td>
                    <td className="max-w-[13rem] px-4 py-4 align-top text-sm leading-6 text-slate-300">{item.risk}</td>
                    <td className="px-4 py-4 align-top">
                      <StatusBadge tone={item.tone}>{item.state}</StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="grid content-start gap-4">
          <section className="panel p-5" aria-labelledby="knowledge-public-bridge-title">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-sky-100">
                  <GitBranch size={21} aria-hidden />
                  <h2 id="knowledge-public-bridge-title" className="text-2xl font-semibold text-white">
                    {t("Public bridge")}
                  </h2>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {t("Open the visitor-facing knowledge page. It stays sanitized and does not expose source material from this owner cockpit.")}
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-white">{t("Public-safe page")}</p>
                  <StatusBadge tone="normal">{t("Curated")}</StatusBadge>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  {t("Shows the public Knowledge page narrative, not private queue items or source records.")}
                </p>
              </div>
              <div className="rounded-[8px] border border-yellow-200/25 bg-yellow-300/10 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-white">{t("Owner gate")}</p>
                  <StatusBadge tone="warning">{t("Required")}</StatusBadge>
                </div>
                <p className="mt-2 text-xs leading-5 text-yellow-50/75">
                  {t("New public text still needs explicit owner review before it becomes a shipped route.")}
                </p>
              </div>
            </div>
            <Link href="/dora/knowledge" className="link-focus mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-100">
              {t("Open public bridge")}
              <ArrowRight size={15} aria-hidden />
            </Link>
          </section>

          <section className="panel p-5">
            <div className="flex items-center gap-2 text-yellow-100">
              <Radio size={19} aria-hidden />
              <h2 className="text-xl font-semibold text-white">{t("Policy")}</h2>
            </div>
            <div className="mt-4 grid gap-3">
              {data.policy.map((rule) => (
                <div key={rule} className="flex gap-3 rounded-[8px] border border-slate-700 bg-white/[0.045] p-3 text-sm leading-6 text-slate-300">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-200" size={17} aria-hidden />
                  {rule}
                </div>
              ))}
            </div>
          </section>

          <UnavailableControlsPanel
            title={t("No publish controls")}
            items={data.unavailableControls}
            note={t("Future publishing needs authenticated APIs, preview, audit logging, explicit owner action, and rollback behavior.")}
            eyebrow={t("Unavailable until designed")}
            unavailableLabel={t("unavailable")}
          />
        </aside>
      </section>
    </div>
  );
}
