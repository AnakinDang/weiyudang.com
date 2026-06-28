import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Camera,
  CheckCircle2,
  MapPin,
  NotebookPen,
  ShieldCheck
} from "lucide-react";
import { MarkdownBody } from "@/components/MarkdownBody";
import { SiteChrome } from "@/components/SiteChrome";
import { getJournalEntries, getJournalEntryBySlug } from "@/lib/content";

type JournalEntryPageProps = {
  params: Promise<{ slug: string }>;
};

const objectPosition = {
  left: "object-left",
  center: "object-center",
  right: "object-right"
} as const;

function journalUrl(slug: string) {
  return `/journal/${slug}`;
}

export function generateStaticParams() {
  return getJournalEntries().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: JournalEntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getJournalEntryBySlug(slug);

  if (!entry) {
    return {};
  }

  const url = journalUrl(entry.slug);

  return {
    title: entry.title,
    description: entry.summary,
    alternates: {
      canonical: url
    },
    openGraph: {
      title: entry.title,
      description: entry.summary,
      url,
      type: "article",
      images: [
        {
          url: entry.cover,
          alt: entry.title
        }
      ]
    }
  };
}

export default async function JournalEntryPage({ params }: JournalEntryPageProps) {
  const { slug } = await params;
  const entry = getJournalEntryBySlug(slug);

  if (!entry) {
    notFound();
  }

  const entries = getJournalEntries();
  const position = objectPosition[entry.accent as keyof typeof objectPosition] ?? "object-center";
  const relatedEntries = entries
    .filter((candidate) => candidate.slug !== entry.slug)
    .sort((left, right) => left.order - right.order || left.slug.localeCompare(right.slug))
    .slice(0, 2);

  return (
    <SiteChrome headerVariant="doraemon" headerActiveHref="/journal">
      <section className="journal-entry-page">
        <div className="container">
          <Link href="/journal" className="link-focus journal-entry-back-link">
            <ArrowLeft size={16} aria-hidden />
            Back to Journal
          </Link>

          <div className="journal-entry-grid">
            <article className="journal-entry-main">
              <div className="journal-entry-hero">
                <div className="journal-entry-hero-copy">
                  <p className="journal-entry-kicker">Journal Entry</p>
                  <h1>{entry.title}</h1>
                  <p>{entry.summary}</p>
                  <div className="journal-entry-meta-row">
                    <span>
                      <NotebookPen size={15} aria-hidden />
                      {entry.type}
                    </span>
                    <span>
                      <MapPin size={15} aria-hidden />
                      {entry.location}
                    </span>
                    <span>
                      <CalendarDays size={15} aria-hidden />
                      {entry.date}
                    </span>
                  </div>
                </div>
                <div className="journal-entry-image-frame">
                  <Image
                    src={entry.cover}
                    width={1536}
                    height={768}
                    priority
                    sizes="(min-width: 1180px) 38vw, 100vw"
                    alt={entry.title}
                    className={`journal-entry-image ${position}`}
                  />
                </div>
              </div>

              <div className="journal-entry-boundary-callout">
                <ShieldCheck size={20} aria-hidden />
                <div>
                  <strong>This entry is public and personal.</strong>
                  <span>No private tasks, prompts, accounts, raw logs, or owner-only notes are included.</span>
                </div>
              </div>

              <div className="journal-entry-body">
                <h2>Field notes</h2>
                <MarkdownBody body={entry.body} />
              </div>
            </article>

            <aside className="journal-entry-rail" aria-label="Journal entry context">
              <section className="journal-entry-rail-panel">
                <p className="journal-entry-kicker">Entry dossier</p>
                <dl className="journal-entry-meta-list">
                  <div>
                    <dt>Entry type</dt>
                    <dd>{entry.type}</dd>
                  </div>
                  <div>
                    <dt>Entry location</dt>
                    <dd>{entry.location}</dd>
                  </div>
                  <div>
                    <dt>Entry date</dt>
                    <dd>{entry.date}</dd>
                  </div>
                  <div>
                    <dt>Entry visibility</dt>
                    <dd>{entry.visibilityLabel}</dd>
                  </div>
                </dl>
              </section>

              <section className="journal-entry-rail-panel">
                <p className="journal-entry-kicker">Public rules</p>
                <div className="journal-entry-rule-list">
                  {[
                    "Share observations and images that are safe to publish.",
                    "Keep private owner work out of public journal entries.",
                    "Let the human side sit beside the technical studio.",
                    "Avoid turning personal notes into a feed or operations log."
                  ].map((rule) => (
                    <div key={rule}>
                      <CheckCircle2 size={16} aria-hidden />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </section>

              {relatedEntries.length ? (
                <section className="journal-entry-rail-panel">
                  <p className="journal-entry-kicker">More journal</p>
                  <div className="journal-entry-related-list">
                    {relatedEntries.map((candidate) => (
                      <Link key={candidate.slug} href={journalUrl(candidate.slug)} className="link-focus">
                        <Camera size={16} aria-hidden />
                        <span>
                          <strong>{candidate.title}</strong>
                          <small>{candidate.location}</small>
                        </span>
                        <ArrowRight size={15} aria-hidden />
                      </Link>
                    ))}
                  </div>
                </section>
              ) : null}
            </aside>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
