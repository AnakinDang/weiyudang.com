import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Beaker,
  BookOpen,
  CheckCircle2,
  Eye,
  FileText,
  Layers3,
  LockKeyhole,
  NotebookPen,
  Radio,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import type {
  publicKnowledgeBoundaries,
  publicKnowledgeFlow,
  publicKnowledgeOutputs,
  publicKnowledgeStats
} from "@/lib/knowledge-vault";

type PublicKnowledgeOutput = (typeof publicKnowledgeOutputs)[number];
type PublicKnowledgeFlow = (typeof publicKnowledgeFlow)[number];
type PublicKnowledgeBoundary = (typeof publicKnowledgeBoundaries)[number];
type PublicKnowledgeStat = (typeof publicKnowledgeStats)[number];

const outputIcons = {
  "Project summaries": Layers3,
  "Lab notes": Beaker,
  Journal: NotebookPen,
  "Doraemon Office": Radio
} as const satisfies Record<PublicKnowledgeOutput["title"], LucideIcon>;

const flowIcons = {
  Capture: BookOpen,
  Synthesis: Sparkles,
  "Owner review": ShieldCheck,
  "Public output": FileText
} as const satisfies Record<PublicKnowledgeFlow["step"], LucideIcon>;

const statIcons = {
  "Public outputs": FileText,
  "Publish gates": ShieldCheck,
  "Private sources": LockKeyhole
} as const satisfies Record<PublicKnowledgeStat["label"], LucideIcon>;

function DoraemonMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 72 72" aria-hidden="true" focusable="false">
      <circle cx="36" cy="34" r="25" fill="currentColor" opacity="0.12" />
      <circle cx="36" cy="32" r="20" fill="#ffffff" stroke="currentColor" strokeWidth="2.2" />
      <ellipse cx="30" cy="24" rx="4.2" ry="6.8" fill="#ffffff" stroke="currentColor" strokeWidth="1.8" />
      <ellipse cx="42" cy="24" rx="4.2" ry="6.8" fill="#ffffff" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="31.4" cy="25.5" r="1.45" fill="currentColor" />
      <circle cx="40.6" cy="25.5" r="1.45" fill="currentColor" />
      <circle cx="36" cy="32" r="3.4" fill="currentColor" />
      <path d="M36 35.6v14.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M25.5 41.2c5.4 6.2 15.6 6.2 21 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M21 32.8h10M21.4 38.2l9.2-2.1M51 32.8H41M50.6 38.2l-9.2-2.1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path d="M25.5 53h21" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="36" cy="56" r="5.2" fill="#f4b740" stroke="#ffffff" strokeWidth="2" />
    </svg>
  );
}

function outputToneClass(output: Pick<PublicKnowledgeOutput, "tone">) {
  return output.tone === "normal" ? "is-normal" : "is-info";
}

export function KnowledgeVaultPanel({
  outputs,
  flow,
  boundaries,
  stats
}: {
  outputs: readonly PublicKnowledgeOutput[];
  flow: readonly PublicKnowledgeFlow[];
  boundaries: readonly PublicKnowledgeBoundary[];
  stats: readonly PublicKnowledgeStat[];
}) {
  return (
    <div className="dora-knowledge">
      <section className="dora-knowledge-hero" aria-label="Public Knowledge Vault synthesis map">
        <div className="dora-knowledge-hero-copy">
          <p>
            <span>Knowledge vault.</span> Public synthesis only.
          </p>
          <small>Private sources become public pages only through synthesis, owner review, and safe rewriting.</small>
        </div>

        <div className="dora-knowledge-prism" aria-hidden="true">
          <div className="dora-knowledge-prism-plane dora-knowledge-prism-plane-1" />
          <div className="dora-knowledge-prism-plane dora-knowledge-prism-plane-2" />
          <div className="dora-knowledge-prism-plane dora-knowledge-prism-plane-3" />
          <div className="dora-knowledge-prism-core">
            <DoraemonMark />
            <strong>Curated output</strong>
            <span>owner reviewed</span>
          </div>
          {flow.map((item, index) => {
            const Icon = flowIcons[item.step];

            return (
              <div key={item.step} className={`dora-knowledge-prism-node dora-knowledge-prism-node-${index + 1}`}>
                <span>
                  <Icon size={15} aria-hidden />
                </span>
                <strong>{item.step}</strong>
                <small>{item.shortLabel}</small>
              </div>
            );
          })}
        </div>

        <div className="dora-knowledge-hero-boundary">
          <span>
            <Eye size={15} aria-hidden />
            Public summaries
          </span>
          <span>
            <LockKeyhole size={15} aria-hidden />
            Sources private
          </span>
          <span>
            <ShieldCheck size={15} aria-hidden />
            Owner reviewed
          </span>
        </div>
      </section>

      <section className="dora-knowledge-stats" aria-label="Public Knowledge Vault summary">
        {stats.map((stat) => {
          const Icon = statIcons[stat.label];

          return (
            <article key={stat.label}>
              <Icon size={23} aria-hidden />
              <div>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            </article>
          );
        })}
      </section>

      <div className="dora-knowledge-layout">
        <section className="dora-knowledge-outputs" aria-labelledby="dora-knowledge-outputs-title">
          <div className="dora-knowledge-section-heading">
            <div>
              <h2 id="dora-knowledge-outputs-title">Public synthesis outputs</h2>
              <p>Curated destinations that can be read without exposing private source material.</p>
            </div>
            <BookOpen size={22} aria-hidden />
          </div>

          <div className="dora-knowledge-output-grid">
            {outputs.map((output) => {
              const Icon = outputIcons[output.title];

              return (
                <Link key={output.href} href={output.href} className={`link-focus dora-knowledge-output-card ${outputToneClass(output)}`}>
                  <div>
                    <span className="dora-knowledge-output-icon">
                      <Icon size={20} aria-hidden />
                    </span>
                    <StatusBadge tone={output.tone}>{output.state}</StatusBadge>
                  </div>
                  <h3>{output.title}</h3>
                  <p>{output.summary}</p>
                  <span>
                    Open
                    <ArrowRight size={15} aria-hidden />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <aside className="dora-knowledge-side" aria-label="Knowledge boundary and bridges">
          <section className="dora-knowledge-boundary-card">
            <div className="dora-knowledge-section-heading">
              <div>
                <h2>Knowledge boundary</h2>
                <p>Public pages are curated. Source layers stay private.</p>
              </div>
              <ShieldCheck size={21} aria-hidden />
            </div>
            <ul>
              {boundaries.map((rule) => (
                <li key={rule}>
                  <ShieldCheck size={16} aria-hidden />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="dora-knowledge-review-card">
            <Sparkles size={20} aria-hidden />
            <strong>Owner review gate</strong>
            <p>Publication requires explicit owner-approved rewriting before anything reaches public routes.</p>
          </section>

          <section className="dora-knowledge-link-card">
            <Beaker size={20} aria-hidden />
            <strong>Lab bridge</strong>
            <p>Open public lab notes for examples of curated synthesis.</p>
            <Link href="/lab" className="link-focus">
              View Lab
              <ArrowRight size={15} aria-hidden />
            </Link>
          </section>
        </aside>
      </div>

      <section className="dora-knowledge-flow" aria-labelledby="dora-knowledge-flow-title">
        <div className="dora-knowledge-section-heading">
          <div>
            <h2 id="dora-knowledge-flow-title">Publish path</h2>
            <p>How private source material becomes public-safe site content.</p>
          </div>
          <ShieldCheck size={22} aria-hidden />
        </div>
        <div className="dora-knowledge-flow-track">
          {flow.map((item, index) => {
            const Icon = flowIcons[item.step];

            return (
              <article key={item.step}>
                <span>
                  <Icon size={18} aria-hidden />
                </span>
                <small>step {index + 1}</small>
                <h3>{item.step}</h3>
                <p>{item.summary}</p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
