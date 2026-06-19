import Link from "next/link";
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
import {
  privateKnowledgePolicy,
  privateKnowledgePosture,
  privateKnowledgePublishBridge,
  privateKnowledgeQueue,
  privateKnowledgeSources,
  privateKnowledgeUnavailableControls
} from "@/lib/private/knowledge-vault";

const sourceIcons = {
  "Source inbox": BookOpen,
  "Synthesis briefs": BrainCircuit,
  "Public candidates": FileText,
  "Memory context": LockKeyhole
} as const;

export function KnowledgeVaultCockpit() {
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
              {privateKnowledgePosture.map((item) => (
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
          {privateKnowledgeSources.map((source) => {
            const Icon = sourceIcons[source.title];

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
            {privateKnowledgeQueue.map((item) => (
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
                {privateKnowledgeQueue.map((item) => (
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
              {privateKnowledgePublishBridge.map((step, index) => (
                <div key={step.label} className="grid grid-cols-[1.6rem_1fr] gap-3">
                  <div className="relative flex justify-center">
                    <span className="mt-1 flex size-6 items-center justify-center rounded-full border border-sky-200/30 bg-sky-300/10 text-xs font-bold text-sky-100">
                      {index + 1}
                    </span>
                    {index < privateKnowledgePublishBridge.length - 1 ? (
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
              {privateKnowledgePolicy.map((rule) => (
                <div key={rule} className="flex gap-3 rounded-[8px] border border-slate-700 bg-white/[0.045] p-3 text-sm leading-6 text-slate-300">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-200" size={17} aria-hidden />
                  {rule}
                </div>
              ))}
            </div>
          </section>

          <UnavailableControlsPanel
            title="No publish controls"
            items={privateKnowledgeUnavailableControls}
            note="Future publishing needs authenticated APIs, preview, audit logging, explicit owner action, and rollback behavior."
          />
        </aside>
      </section>
    </div>
  );
}
