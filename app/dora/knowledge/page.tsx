import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, FileText, LockKeyhole, ShieldCheck } from "lucide-react";
import { DoraOfficeShell } from "@/components/DoraOfficeShell";
import { StatusBadge } from "@/components/StatusBadge";
import { publicKnowledgeBoundaries, publicKnowledgeFlow, publicKnowledgeOutputs } from "@/lib/knowledge-vault";

export const metadata: Metadata = {
  title: "Doraemon Knowledge",
  description: "Public Knowledge Vault explanation with curated outputs and no raw private source material."
};

export default function DoraKnowledgePage() {
  return (
    <DoraOfficeShell
      active="/dora/knowledge"
      title="Knowledge"
      summary="A public explanation of the Knowledge Vault: private source material becomes curated public outputs only after synthesis and owner review."
    >
      <div className="grid gap-5">
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="panel p-6">
            <BookOpen className="text-[#2563eb]" size={28} aria-hidden />
            <h2 className="mt-4 text-2xl font-semibold text-slate-950">Public synthesis, private sources</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Knowledge can appear publicly as project pages, lab notes, journal entries, and safe Doraemon Office copy. The
              private vault remains the source layer for raw notes, evidence, and personal memory.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {publicKnowledgeOutputs.map((output) => (
                <Link
                  key={output.href}
                  href={output.href}
                  className="link-focus rounded-[8px] border border-[#dde7f0] bg-[#f8fafc] p-4 transition hover:-translate-y-0.5 hover:border-[#bfdbfe]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <FileText className="text-[#2563eb]" size={21} aria-hidden />
                    <StatusBadge tone={output.tone}>{output.state}</StatusBadge>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-950">{output.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{output.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#1d4ed8]">
                    Open
                    <ArrowRight size={15} aria-hidden />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <aside className="panel h-fit p-5">
            <div className="flex items-start gap-3">
              <LockKeyhole className="mt-0.5 shrink-0 text-[#f4b740]" size={22} aria-hidden />
              <div>
                <p className="eyebrow">Knowledge boundary</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">Private by default</h2>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              {publicKnowledgeBoundaries.map((rule) => (
                <div key={rule} className="rounded-[8px] border border-[#dde7f0] bg-[#f8fafc] p-3 text-sm leading-6 text-slate-600">
                  {rule}
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="panel p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 shrink-0 text-[#2563eb]" size={22} aria-hidden />
            <div>
              <p className="eyebrow">Publish path</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">How private knowledge becomes public</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {publicKnowledgeFlow.map((item, index) => (
              <article key={item.step} className="rounded-[8px] border border-[#dde7f0] bg-[#f8fafc] p-4">
                <p className="mono text-xs text-slate-500">step {index + 1}</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-950">{item.step}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </DoraOfficeShell>
  );
}
