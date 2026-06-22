"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  FileText,
  GitBranch,
  LockKeyhole,
  Radio,
  ShieldCheck
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { UnavailableControlsPanel } from "@/components/UnavailableControlsPanel";

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

const sourceIcons: Record<string, LucideIcon> = {
  "Source inbox": BookOpen,
  "Synthesis briefs": BrainCircuit,
  "Public candidates": FileText,
  "Memory context": LockKeyhole
};

function readinessLabel(rows: readonly KnowledgeReviewRow[]) {
  const ready = rows.filter((row) => row.ready).length;
  return `${ready} of ${rows.length} ready`;
}

function postureKey(candidateId: string, label: string) {
  return `${candidateId}:${label}`;
}

function KnowledgeReviewWorkbench({
  candidates,
  selectedCandidate,
  postureChoice,
  onCandidateSelect,
  onPostureChoice
}: {
  candidates: readonly KnowledgeQueueItem[];
  selectedCandidate: KnowledgeQueueItem;
  postureChoice: string;
  onCandidateSelect: (candidateId: string) => void;
  onPostureChoice: (choice: string) => void;
}) {
  const selectedPosture =
    selectedCandidate.ownerPostures.find((posture) => posture.label === postureChoice) ?? selectedCandidate.ownerPostures[0];

  return (
    <section className="panel p-5" aria-labelledby="knowledge-review-workbench-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-yellow-100">
            <BrainCircuit size={22} aria-hidden />
            <h2 id="knowledge-review-workbench-title" className="text-2xl font-semibold text-white">
              Review workbench
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Select one synthesis candidate and choose a local owner reading posture. No public page, vault sync, or publish
            action is created from this surface.
          </p>
        </div>
        <StatusBadge tone="private">Local only</StatusBadge>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[20rem_minmax(0,1fr)] 2xl:grid-cols-[20rem_minmax(0,1fr)_24rem]">
        <aside className="rounded-[8px] border border-slate-700 bg-white/[0.035] p-4" aria-label="Synthesis candidates">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xs font-bold uppercase text-slate-400">Candidates</h3>
            <span className="text-xs font-semibold text-slate-500">{candidates.length} queued</span>
          </div>
          <div className="mt-4 grid gap-3">
            {candidates.map((candidate) => {
              const active = candidate.id === selectedCandidate.id;

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
                      <strong className="text-slate-300">Evidence:</strong> {readinessLabel(candidate.readiness)}
                    </span>
                    <span>
                      <strong className="text-slate-300">Destination:</strong> {candidate.destination}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <article className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-5" aria-labelledby="selected-knowledge-candidate-title">
          <p className="sr-only" aria-live="polite">
            Selected synthesis candidate: {selectedCandidate.title}. {selectedCandidate.state}.
          </p>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase text-yellow-100">Selected candidate</p>
              <h3 id="selected-knowledge-candidate-title" className="mt-2 text-2xl font-semibold text-white">
                {selectedCandidate.title}
              </h3>
              <p className="mt-2 text-xs font-bold uppercase text-slate-400">
                {selectedCandidate.owner} - {selectedCandidate.output} - Priority {selectedCandidate.priority}
              </p>
            </div>
            <StatusBadge tone={selectedCandidate.tone}>{selectedCandidate.state}</StatusBadge>
          </div>

          <div className="mt-5 grid gap-4 2xl:grid-cols-2">
            <div className="rounded-[8px] border border-slate-700 bg-[#07111f]/58 p-4">
              <h4 className="text-xs font-bold uppercase text-slate-400">Review summary</h4>
              <p className="mt-2 text-sm leading-6 text-slate-300">{selectedCandidate.reviewSummary}</p>
            </div>
            <div className="rounded-[8px] border border-red-300/30 bg-red-400/8 p-4">
              <h4 className="text-xs font-bold uppercase text-red-100">Boundary</h4>
              <p className="mt-2 text-sm leading-6 text-slate-300">{selectedCandidate.boundary}</p>
            </div>
          </div>

          <div className="mt-4 rounded-[8px] border border-slate-700 bg-[#07111f]/58 p-4">
            <h4 className="text-sm font-semibold text-sky-100">Evidence readiness</h4>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
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
          </div>

          <div className="mt-4 rounded-[8px] border border-slate-700 bg-[#07111f]/58 p-4">
            <h4 className="text-sm font-semibold text-sky-100">Rewrite path</h4>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
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
          </div>
        </article>

        <aside className="grid content-start gap-4 xl:col-span-2 2xl:col-span-1">
          <section className="rounded-[8px] border border-yellow-200/35 bg-yellow-300/10 p-4" aria-labelledby="knowledge-owner-posture-title">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-yellow-100">
                  <ShieldCheck size={17} aria-hidden />
                  <h3 id="knowledge-owner-posture-title" className="text-sm font-semibold text-white">
                    Owner review posture
                  </h3>
                </div>
                <p className="mt-2 text-xs leading-5 text-yellow-50/80">
                  Choose how to read this candidate locally. This does not publish, sync, or expose source material.
                </p>
              </div>
              <StatusBadge tone="private">No publish</StatusBadge>
            </div>
            {selectedPosture ? (
              <p className="sr-only" aria-live="polite">
                Posture: {selectedPosture.label}. {selectedPosture.next}
              </p>
            ) : null}

            <div className="mt-4 grid gap-2">
              {selectedCandidate.ownerPostures.map((posture) => {
                const active = posture.label === selectedPosture?.label;

                return (
                  <button
                    key={postureKey(selectedCandidate.id, posture.label)}
                    type="button"
                    aria-pressed={active}
                    onClick={() => onPostureChoice(posture.label)}
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
                <h4 className="text-xs font-bold uppercase text-slate-400">If selected</h4>
                <p className="mt-2 text-sm leading-6 text-slate-300">{selectedPosture.next}</p>
              </div>
            ) : null}
          </section>

          <section className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <h3 className="text-sm font-semibold text-white">Safe outputs</h3>
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

export function KnowledgeVaultCockpit({ data }: { data: KnowledgeVaultData }) {
  const [selectedCandidateId, setSelectedCandidateId] = useState(data.queue[0]?.id ?? "");
  const [postureChoices, setPostureChoices] = useState<Record<string, string>>({});

  const selectedCandidate = useMemo(() => {
    return data.queue.find((item) => item.id === selectedCandidateId) ?? data.queue[0];
  }, [data.queue, selectedCandidateId]);

  const postureChoice = selectedCandidate
    ? postureChoices[selectedCandidate.id] ?? selectedCandidate.ownerPostures[0]?.label ?? ""
    : "";

  function handlePostureChoice(choice: string) {
    if (!selectedCandidate) {
      return;
    }

    setPostureChoices((current) => ({
      ...current,
      [selectedCandidate.id]: choice
    }));
  }

  return (
    <div className="grid gap-5">
      <section className="panel relative isolate overflow-hidden p-6 md:p-7">
        <div
          className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-1/2 bg-[radial-gradient(circle_at_55%_35%,rgba(56,189,248,0.18),transparent_34%),linear-gradient(135deg,transparent,rgba(250,204,21,0.08))]"
          aria-hidden
        />
        <div className="grid items-end gap-6 xl:grid-cols-[minmax(0,1fr)_25rem]">
          <div>
            <h2 className="max-w-4xl text-3xl font-semibold text-white md:text-5xl">Knowledge Vault</h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
              Owner-only synthesis, review, and public publishing boundaries for the personal operating system.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-400">
              The cockpit can show posture, review candidates, evidence expectations, and safe public bridges after
              authentication. It does not mount raw vault pages, private memory records, credentials, prompts, accounts,
              or execution workflows.
            </p>
          </div>

          <div className="rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 p-4">
            <div className="flex items-center gap-2 text-yellow-100">
              <ShieldCheck size={19} aria-hidden />
              <h3 className="font-semibold text-white">Read-only owner surface</h3>
            </div>
            <p className="mt-3 text-sm font-semibold leading-6 text-yellow-50">
              Read-only until auth, audit, preview, and rollback are designed.
            </p>
            <div className="mt-4 grid gap-2">
              {data.posture.map((item) => (
                <div key={item.label} className="grid grid-cols-[1fr_auto] items-center gap-3 border-t border-yellow-100/15 pt-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <p className="mt-1 text-xs leading-5 text-yellow-50/80">{item.detail}</p>
                  </div>
                  <StatusBadge tone={item.tone}>{item.value}</StatusBadge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="knowledge-source-posture">
        <h2 id="knowledge-source-posture" className="sr-only">
          Source posture
        </h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {data.sources.map((source) => {
            const Icon = sourceIcons[source.title] ?? BookOpen;

            return (
              <article key={source.title} className="panel p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex size-11 items-center justify-center rounded-[8px] border border-sky-200/20 bg-sky-300/10 text-sky-100">
                    <Icon size={21} aria-hidden />
                  </span>
                  <StatusBadge tone={source.tone}>{source.state}</StatusBadge>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{source.title}</h3>
                <p className="mt-1 text-xs font-bold uppercase text-yellow-100">{source.scope}</p>
                <p className="mt-4 text-sm leading-6 text-slate-300">{source.summary}</p>
                <div className="mt-4 rounded-[8px] border border-slate-700 bg-white/[0.045] p-3">
                  <p className="text-xs font-bold uppercase text-slate-400">{source.signal}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-300">{source.detail}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {selectedCandidate ? (
        <KnowledgeReviewWorkbench
          candidates={data.queue}
          selectedCandidate={selectedCandidate}
          postureChoice={postureChoice}
          onCandidateSelect={setSelectedCandidateId}
          onPostureChoice={handlePostureChoice}
        />
      ) : null}

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_24rem]">
        <div className="panel overflow-hidden p-0">
          <div className="border-b border-slate-700/70 p-5 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-yellow-100">
                  <BrainCircuit size={22} aria-hidden />
                  <h2 className="text-2xl font-semibold text-white">Synthesis queue</h2>
                </div>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  Candidate outputs are visible as review work, not as publishable source material.
                </p>
              </div>
              <StatusBadge tone="warning">Owner review required</StatusBadge>
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
                    <dt className="text-xs font-bold uppercase text-slate-400">Owner</dt>
                    <dd className="mt-1 font-semibold text-slate-200">{item.owner}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase text-slate-400">Destination</dt>
                    <dd className="mt-1 font-semibold text-white">{item.destination}</dd>
                    <dd className="mt-1 text-xs text-slate-400">Priority {item.priority}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase text-slate-400">Risk</dt>
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
                    Candidate
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Owner
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Destination
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Risk
                  </th>
                  <th scope="col" className="px-4 py-3">
                    State
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
                      <p className="mt-1 text-xs text-slate-400">Priority {item.priority}</p>
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
          <section className="panel p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-sky-100">
                  <GitBranch size={21} aria-hidden />
                  <h2 className="text-2xl font-semibold text-white">Publish boundary</h2>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">Every public output passes through the same safe path.</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              {data.publishBridge.map((step, index) => (
                <div key={step.label} className="grid grid-cols-[1.6rem_1fr] gap-3">
                  <div className="relative flex justify-center">
                    <span className="mt-1 flex size-6 items-center justify-center rounded-full border border-sky-200/30 bg-sky-300/10 text-xs font-bold text-sky-100">
                      {index + 1}
                    </span>
                    {index < data.publishBridge.length - 1 ? (
                      <span className="absolute bottom-[-0.75rem] top-8 w-px bg-slate-700" aria-hidden />
                    ) : null}
                  </div>
                  <div className="pb-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-white">{step.label}</h3>
                      <StatusBadge tone={step.tone}>{step.state}</StatusBadge>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-400">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/dora/knowledge" className="link-focus mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-100">
              Open public bridge
              <ArrowRight size={15} aria-hidden />
            </Link>
          </section>

          <section className="panel p-5">
            <div className="flex items-center gap-2 text-yellow-100">
              <Radio size={19} aria-hidden />
              <h2 className="text-xl font-semibold text-white">Policy</h2>
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
            title="No publish controls"
            items={data.unavailableControls}
            note="Future publishing needs authenticated APIs, preview, audit logging, explicit owner action, and rollback behavior."
          />
        </aside>
      </section>
    </div>
  );
}
