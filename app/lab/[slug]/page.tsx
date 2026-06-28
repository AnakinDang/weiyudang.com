import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, FileText, FlaskConical, ShieldCheck } from "lucide-react";
import { MarkdownBody } from "@/components/MarkdownBody";
import { SiteChrome } from "@/components/SiteChrome";
import { TradingResearchBoundary } from "@/components/TradingResearchBoundary";
import { formatContentDate, getNoteBySlug, getNotes, getRelatedNotes } from "@/lib/content";

type LabNotePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getNotes().map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: LabNotePageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = getNoteBySlug(slug);

  if (!note) {
    return {};
  }

  const url = `/lab/${note.slug}`;

  return {
    title: note.title,
    description: note.summary,
    alternates: {
      canonical: url
    },
    openGraph: {
      title: note.title,
      description: note.summary,
      url,
      type: "article"
    }
  };
}

export default async function LabNotePage({ params }: LabNotePageProps) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);

  if (!note) {
    notFound();
  }

  const relatedNotes = getRelatedNotes(note, 2);

  return (
    <SiteChrome headerVariant="doraemon" headerActiveHref="/lab">
      <section className="lab-note-page">
        <div className="container">
          <Link href="/lab" className="link-focus lab-back-link">
            <ArrowLeft size={16} aria-hidden />
            Back to Research
          </Link>

          <div className="lab-note-dossier-grid">
            <article className="lab-note-dossier-main">
              <div className="lab-note-dossier-hero">
                <span className="lab-note-dossier-icon" aria-hidden>
                  <FlaskConical size={28} />
                </span>
                <div>
                  <h1>{note.title}</h1>
                  <p>{note.summary}</p>
                  <div className="lab-note-dossier-badges">
                    <span>{note.categoryLabel}</span>
                    <span>{note.dateLabel}</span>
                    <span>Public-safe note</span>
                  </div>
                </div>
              </div>

              <div className="lab-note-boundary-callout">
                <ShieldCheck size={20} aria-hidden />
                <div>
                  <strong>This note is public-safe.</strong>
                  <span>Curated summary only. No private prompts, raw notes, credentials, runtime IDs, or account state.</span>
                </div>
              </div>

              {note.category === "trading-research" ? <TradingResearchBoundary /> : null}

              <div className="lab-note-body">
                <h2>Note</h2>
                <MarkdownBody body={note.body} />
              </div>
            </article>

            <aside className="lab-note-dossier-rail" aria-label="Research note metadata">
              <section className="lab-note-rail-panel">
                <p className="lab-rail-kicker">Note dossier</p>
                <dl className="lab-note-meta-list">
                  <div>
                    <dt>Category</dt>
                    <dd>{note.categoryLabel}</dd>
                  </div>
                  <div>
                    <dt>Date</dt>
                    <dd>{note.dateLabel}</dd>
                  </div>
                  {note.updatedAt ? (
                    <div>
                      <dt>Updated</dt>
                      <dd>{note.updatedAt === note.publishedAt ? note.dateLabel : formatContentDate(note.updatedAt)}</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt>Visibility</dt>
                    <dd>{note.visibilityLabel}</dd>
                  </div>
                  <div>
                    <dt>Content model</dt>
                    <dd>Public research note</dd>
                  </div>
                </dl>
              </section>

              <section className="lab-note-rail-panel">
                <p className="lab-rail-kicker">Public rules</p>
                <div className="lab-note-rule-list">
                  {[
                    "Explain principles, decisions, and sketches.",
                    "Omit private source text and raw drafts.",
                    "No credentials, accounts, prompts, or runtime logs.",
                    "Link back to durable project artifacts."
                  ].map((rule) => (
                    <div key={rule}>
                      <CheckCircle2 size={16} aria-hidden />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </section>

              {note.relatedProject ? (
                <Link href={`/projects/${note.relatedProject}`} className="link-focus lab-note-rail-link">
                  <FileText size={16} aria-hidden />
                  Related project
                  <ArrowRight size={16} aria-hidden />
                </Link>
              ) : null}

              {relatedNotes.length ? (
                <section className="lab-note-rail-panel">
                  <p className="lab-rail-kicker">More research</p>
                  <div className="lab-note-related-list">
                    {relatedNotes.map((candidate) => (
                      <Link key={candidate.slug} href={`/lab/${candidate.slug}`} className="link-focus">
                        <FileText size={16} aria-hidden />
                        <span>
                          <strong>{candidate.title}</strong>
                          <small>{candidate.categoryLabel}</small>
                        </span>
                        <ArrowRight size={15} aria-hidden />
                      </Link>
                    ))}
                  </div>
                </section>
              ) : null}

              <Link href="/projects" className="link-focus lab-note-rail-link">
                <FileText size={16} aria-hidden />
                Browse projects
                <ArrowRight size={16} aria-hidden />
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
