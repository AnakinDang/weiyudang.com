import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleHelp,
  Compass,
  FileText,
  FlaskConical,
  Layers3,
  ShieldCheck
} from "lucide-react";
import { MarkdownBody } from "@/components/MarkdownBody";
import { SiteChrome } from "@/components/SiteChrome";
import { TradingResearchBoundary } from "@/components/TradingResearchBoundary";
import { formatContentDate, getNoteBySlug, getNotes, getRelatedNotes, type Note } from "@/lib/content";

type LabNotePageProps = {
  params: Promise<{ slug: string }>;
};

type ResearchDossierItem = {
  label: string;
  detail: string;
  value?: string;
};

type ResearchDossierCard = {
  title: string;
  description: string;
  icon: typeof Compass;
  items: ResearchDossierItem[];
};

function publicationPostureForNote(note: Note): Pick<ResearchDossierItem, "detail" | "value"> {
  if (note.updatedAt && note.updatedAt !== note.publishedAt) {
    return {
      detail: "Updated",
      value: formatContentDate(note.updatedAt)
    };
  }

  return {
    detail: "Published",
    value: formatContentDate(note.publishedAt)
  };
}

function nextQuestionsForNote(note: Note): ResearchDossierItem[] {
  switch (note.category) {
    case "trading-research":
      return [
        {
          label: "Evidence gap",
          detail: "Which proof is still missing before owner review?"
        },
        {
          label: "Desk disagreement",
          detail: "Where should opposing evidence stay visible?"
        },
        {
          label: "Research boundary",
          detail: "Keep this as research only, never an execution path."
        }
      ];
    case "dora-office":
      return [
        {
          label: "Public boundary",
          detail: "Which signals can be shown without exposing private work?"
        },
        {
          label: "Office route",
          detail: "Which Doraemon Office route should this improve next?"
        },
        {
          label: "Demo fallback",
          detail: "How should the page stay honest when live data is unavailable?"
        }
      ];
    case "agent-systems":
      return [
        {
          label: "Agent role",
          detail: "Which MiniDora responsibility becomes clearer from this note?"
        },
        {
          label: "Review gate",
          detail: "Where should owner judgment remain explicit?"
        },
        {
          label: "Public artifact",
          detail: "What durable artifact can prove the next step?"
        }
      ];
    case "design":
      return [
        {
          label: "Design choice",
          detail: "Which visual or product decision needs evidence?"
        },
        {
          label: "Tradeoff",
          detail: "What did the design intentionally leave out?"
        },
        {
          label: "Next prototype",
          detail: "Which surface should carry the next fidelity pass?"
        }
      ];
    case "engineering":
      return [
        {
          label: "Build evidence",
          detail: "Which checks prove the implementation is stable?"
        },
        {
          label: "Failure mode",
          detail: "Which unsafe or brittle path should stay visible?"
        },
        {
          label: "Next check",
          detail: "What should be verified before this becomes a pattern?"
        }
      ];
    case "creative-media":
      return [
        {
          label: "Asset system",
          detail: "Which reusable visual language should survive the experiment?"
        },
        {
          label: "Taste check",
          detail: "What would make the output feel less generic?"
        },
        {
          label: "Production memory",
          detail: "Which settings or lessons should be preserved publicly?"
        }
      ];
    case "operations":
      return [
        {
          label: "Rhythm",
          detail: "Which recurring signal is useful enough to publish?"
        },
        {
          label: "Health signal",
          detail: "What can be summarized without exposing system internals?"
        },
        {
          label: "Owner boundary",
          detail: "Which operational actions must stay private?"
        }
      ];
    default:
      return [
        {
          label: "Research question",
          detail: "What should the public note make easier to understand?"
        },
        {
          label: "Public artifact",
          detail: "Which artifact can readers inspect safely?"
        },
        {
          label: "Next synthesis",
          detail: "What should become clearer in the next note?"
        }
      ];
  }
}

function buildResearchDossier(note: Note): ResearchDossierCard[] {
  const publicationPosture = publicationPostureForNote(note);

  return [
    {
      title: "Research context",
      description: "Where this note sits inside the Personal OS research studio.",
      icon: Compass,
      items: [
        {
          label: "Public role",
          detail: "Frames this as a public-safe research artifact, not a private source record."
        },
        {
          label: "Research lane",
          detail: "Category",
          value: note.categoryLabel
        },
        {
          label: "Boundary mode",
          detail: "Visibility",
          value: note.visibilityLabel
        },
        {
          label: "Published posture",
          ...publicationPosture
        }
      ]
    },
    {
      title: "Evidence",
      description: "What a reader can inspect without crossing the private boundary.",
      icon: Layers3,
      items: [
        {
          label: "Curated note body",
          detail: "The note below is the public-safe narrative."
        },
        {
          label: "Related project",
          detail: note.relatedProject ? "A public project route is attached." : "No public project route attached yet."
        },
        {
          label: "Artifact links",
          detail: note.artifactLinks.length
            ? "Public artifact links are attached."
            : "No public artifact links yet."
        }
      ]
    },
    {
      title: "Next questions",
      description: "Open questions keep the note tied to future research.",
      icon: CircleHelp,
      items: nextQuestionsForNote(note)
    }
  ];
}

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
  const dossierCards = buildResearchDossier(note);

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

              <section className="lab-research-dossier" aria-labelledby="lab-research-dossier-title">
                <div className="lab-research-dossier-head">
                  <p>Research dossier</p>
                  <h2 id="lab-research-dossier-title">Research context, evidence, and next questions</h2>
                  <span>
                    Structured for public reading: enough context to understand the work, enough evidence to inspect it,
                    and enough open questions to keep it honest.
                  </span>
                </div>
                <div className="lab-research-dossier-grid">
                  {dossierCards.map((card) => {
                    const Icon = card.icon;

                    return (
                      <section key={card.title} className="lab-research-dossier-card">
                        <div className="lab-research-dossier-card-head">
                          <Icon size={18} aria-hidden />
                          <span>
                            <strong>{card.title}</strong>
                            <small>{card.description}</small>
                          </span>
                        </div>
                        <dl className="lab-research-dossier-list">
                          {card.items.map((item) => (
                            <div key={item.label}>
                              <dt>{item.label}</dt>
                              <dd>
                                <span>{item.detail}</span>
                                {item.value ? <strong>{item.value}</strong> : null}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </section>
                    );
                  })}
                </div>
              </section>

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
