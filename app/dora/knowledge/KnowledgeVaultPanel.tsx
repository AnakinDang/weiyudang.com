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
  "Knowledge capture": BookOpen,
  Synthesis: Sparkles,
  "Owner review": ShieldCheck,
  "Public output": FileText
} as const satisfies Record<PublicKnowledgeFlow["step"], LucideIcon>;

const statIcons = {
  "Public outputs": FileText,
  "Publish gates": ShieldCheck,
  "Private sources": LockKeyhole,
  "Source pages": LockKeyhole
} as const satisfies Record<PublicKnowledgeStat["label"], LucideIcon>;

const knowledgePrinciples = [
  {
    title: "Curated outputs",
    detail: "Public pages are curated summaries, not direct mirrors of private sources.",
    icon: Sparkles
  },
  {
    title: "Source privacy",
    detail: "Owner notes and source files stay out of public routes.",
    icon: LockKeyhole
  },
  {
    title: "Owner review",
    detail: "Weiyu explicitly approves what becomes visible.",
    icon: ShieldCheck
  },
  {
    title: "No private querying",
    detail: "Visitors never query hidden sources or owner-only context.",
    icon: Eye
  }
] as const;

const vaultLanes = [
  {
    title: "Curated crossings",
    detail: "Only rewritten summaries and public labels cross the boundary.",
    icon: FileText
  },
  {
    title: "Review gates",
    detail: "Synthesis, rewrite, owner approval, then publish.",
    icon: CheckCircle2
  },
  {
    title: "Private source layer",
    detail: "Owner-only records and drafts remain hidden.",
    icon: LockKeyhole
  }
] as const;

function outputToneClass(output: Pick<PublicKnowledgeOutput, "tone">) {
  return output.tone === "normal" ? "is-normal" : "is-info";
}

export function KnowledgeVaultPanel({
  outputs,
  flow,
  boundaries,
  stats,
  showStats = true
}: {
  outputs: readonly PublicKnowledgeOutput[];
  flow: readonly PublicKnowledgeFlow[];
  boundaries: readonly PublicKnowledgeBoundary[];
  stats: readonly PublicKnowledgeStat[];
  showStats?: boolean;
}) {
  return (
    <div className="dora-knowledge">
      <section className="dora-knowledge-principle-strip" aria-label="Public Knowledge Vault principles">
        {knowledgePrinciples.map((principle) => {
          const Icon = principle.icon;

          return (
            <article key={principle.title}>
              <span>
                <Icon size={18} aria-hidden />
              </span>
              <div>
                <h3>{principle.title}</h3>
                <p>{principle.detail}</p>
              </div>
            </article>
          );
        })}
      </section>

      {showStats ? (
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
      ) : null}

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

          <section className="dora-knowledge-vault-card">
            <div className="dora-knowledge-section-heading">
              <div>
                <h2>Vault lanes</h2>
                <p>What may move forward, and what stays sealed.</p>
              </div>
              <Layers3 size={21} aria-hidden />
            </div>
            <div className="dora-knowledge-vault-list">
              {vaultLanes.map((lane) => {
                const Icon = lane.icon;

                return (
                  <article key={lane.title}>
                    <span>
                      <Icon size={16} aria-hidden />
                    </span>
                    <div>
                      <h3>{lane.title}</h3>
                      <p>{lane.detail}</p>
                    </div>
                  </article>
                );
              })}
            </div>
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
                <small>Publish step {index + 1}</small>
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
