import type { Metadata } from "next";
import { BookOpen, FileText, LockKeyhole, ShieldCheck } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { privateKnowledgePolicy, privateKnowledgeQueue, privateKnowledgeSources } from "@/lib/knowledge-vault";

export const metadata: Metadata = {
  title: "Private Knowledge",
  description: "Owner-only Knowledge Vault overview for private synthesis, review, and public publishing boundaries."
};

export default function KnowledgePage() {
  return (
    <section className="space-y-5">
      <div className="panel p-6">
        <p className="eyebrow">Knowledge Vault</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Private source, reviewed synthesis, curated output</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          This protected surface tracks knowledge categories, synthesis work, and publish candidates without mounting raw
          vault pages or private memory records into the web UI.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_23rem]">
        <section className="grid gap-5 md:grid-cols-2">
          {privateKnowledgeSources.map((source) => (
            <article key={source.title} className="panel p-5">
              <div className="flex items-start justify-between gap-3">
                <BookOpen className="text-yellow-100" size={24} aria-hidden />
                <StatusBadge tone={source.tone}>{source.state}</StatusBadge>
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">{source.title}</h3>
              <p className="mt-1 text-xs font-bold uppercase text-yellow-100">{source.scope}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{source.summary}</p>
            </article>
          ))}
        </section>

        <aside className="grid content-start gap-4">
          <section className="panel p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 shrink-0 text-sky-100" size={22} aria-hidden />
              <div>
                <p className="eyebrow">Publish policy</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Reviewed rewrite only</h2>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              {privateKnowledgePolicy.map((rule) => (
                <div key={rule} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-3 text-sm leading-6 text-slate-300">
                  {rule}
                </div>
              ))}
            </div>
          </section>

          <section className="panel-quiet flex gap-3 p-4 text-sm leading-6 text-slate-300">
            <LockKeyhole className="mt-0.5 shrink-0 text-yellow-100" size={17} aria-hidden />
            Public publishing controls stay absent until auth, audit, preview, and rollback behavior are designed.
          </section>
        </aside>
      </div>

      <section className="panel p-5">
        <div className="flex items-start gap-3">
          <FileText className="mt-0.5 shrink-0 text-yellow-100" size={22} aria-hidden />
          <div>
            <p className="eyebrow">Synthesis queue</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Owner-reviewed candidates</h2>
          </div>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {privateKnowledgeQueue.map((item) => (
            <article key={item.title} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-1 text-xs font-bold uppercase text-yellow-100">{item.owner}</p>
                </div>
                <StatusBadge tone={item.tone}>{item.state}</StatusBadge>
              </div>
              <div className="mt-4 grid gap-3">
                <div className="rounded-[8px] border border-slate-700 bg-black/15 p-3">
                  <p className="text-xs font-bold uppercase text-slate-400">Output</p>
                  <p className="mt-2 text-sm font-semibold text-white">{item.output}</p>
                </div>
                <div className="rounded-[8px] border border-slate-700 bg-black/15 p-3">
                  <p className="text-xs font-bold uppercase text-slate-400">Review risk</p>
                  <p className="mt-2 text-sm font-semibold text-white">{item.risk}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
