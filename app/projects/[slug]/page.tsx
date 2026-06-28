import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  CircleHelp,
  Compass,
  FileText,
  Layers3,
  LockKeyhole,
  ShieldCheck
} from "lucide-react";
import { MarkdownBody } from "@/components/MarkdownBody";
import { SiteChrome } from "@/components/SiteChrome";
import { TradingProjectShowcase } from "@/components/TradingProjectShowcase";
import { getNotesForProject, getProjectBySlug, getProjects } from "@/lib/content";
import { boundaryForProject, visualForProject } from "@/lib/projectPresentation";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

function isExternalProjectHref(href: string) {
  return href.startsWith("https://");
}

function boundaryStatementForLabel(label: string) {
  switch (label) {
    case "Research-only":
      return "This project is research-only.";
    case "Private Summary":
      return "This project is a private summary.";
    case "Public":
      return "This project is public.";
    default:
      throw new Error(`[projects] Unknown project boundary label: ${label}`);
  }
}

function nextQuestionsForProject(project: ReturnType<typeof getProjects>[number]) {
  if (project.category === "trading-research") {
    return [
      {
        label: "Evidence gap",
        detail: "Which evidence is still missing before owner review?"
      },
      {
        label: "Desk disagreement",
        detail: "Where do the research desks disagree?"
      },
      {
        label: "Source freshness",
        detail: "Which sources need freshness checks?"
      }
    ];
  }

  if (project.visibility === "private-summary") {
    return [
      {
        label: "Public summary",
        detail: "What can be safely summarized for the public site?"
      },
      {
        label: "Owner route",
        detail: "Which routes must stay owner-only?"
      },
      {
        label: "Research note",
        detail: "What evidence can become a public research note?"
      }
    ];
  }

  return [
    {
      label: "Artifact",
      detail: "What artifact proves the next step?"
    },
    {
      label: "Public route",
      detail: "Which public route should this connect to?"
    },
    {
      label: "Office feedback",
      detail: "What should feed back into Doraemon Office?"
    }
  ];
}

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {};
  }

  const url = `/projects/${project.slug}`;

  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: url
    },
    openGraph: {
      title: project.title,
      description: project.summary,
      url,
      type: "article"
    }
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const boundary = boundaryForProject(project);
  const boundaryStatement = boundaryStatementForLabel(boundary.label);
  const visual = visualForProject(project.slug);
  const relatedNotes = getNotesForProject(project.slug);
  const hasPrivateLinks = project.links.some((link) => link.private);
  const dossierCards = [
    {
      title: "Project context",
      icon: Compass,
      summary: "Where this artifact sits inside the Personal OS.",
      items: [
        {
          label: "Public role",
          detail: project.summary
        },
        {
          label: "Operating lane",
          detail: `${project.categoryLabel} · ${project.statusLabel}`
        },
        {
          label: "Boundary mode",
          detail: boundary.summary
        }
      ]
    },
    {
      title: "Evidence",
      icon: Layers3,
      summary: "What a visitor can inspect without crossing the private boundary.",
      items: [
        {
          label: "Curated project body",
          detail: "Markdown body explains only public-safe context."
        },
        {
          label: "Reviewed routes",
          detail: hasPrivateLinks ? "Links are either public-safe or owner-gated." : "Links stay on public-safe routes."
        },
        {
          label: "Related research",
          detail: relatedNotes.length ? "Related public research note attached." : "No public related note yet."
        }
      ]
    },
    {
      title: "Next questions",
      icon: CircleHelp,
      summary: "Open questions keep the project from becoming a static portfolio card.",
      items: nextQuestionsForProject(project)
    }
  ];

  return (
    <SiteChrome headerVariant="doraemon" headerActiveHref="/projects">
      <section className="project-dossier-page">
        <div className="container">
          <Link href="/projects" className="link-focus project-back-link">
            <ArrowLeft size={16} aria-hidden />
            Back to Projects
          </Link>

          <div className="project-dossier-grid">
            <article className="project-dossier-main">
              <div className="project-dossier-hero">
                <span className={`project-dossier-visual projects-artifact-visual-${visual}`} aria-hidden="true">
                  <span />
                </span>
                <div>
                  <h1>{project.title}</h1>
                  <p>{project.summary}</p>
                  <div className="project-dossier-badges">
                    <span>{project.categoryLabel}</span>
                    <span className={boundary.className}>{boundary.label}</span>
                    <span>{project.statusLabel}</span>
                    <span>Public-safe page</span>
                  </div>
                </div>
              </div>

              <div className="project-boundary-callout">
                <ShieldCheck size={20} aria-hidden />
                <div>
                  <strong>{boundaryStatement}</strong>
                  <span>{boundary.summary}</span>
                </div>
              </div>

              <section className="project-public-dossier" aria-labelledby="project-public-dossier-title">
                <div className="project-public-dossier-head">
                  <p className="projects-kicker">Public dossier</p>
                  <h2 id="project-public-dossier-title">Context, evidence, and next questions</h2>
                  <p>
                    Project pages should explain the public story, name the evidence a visitor can inspect, and keep
                    the next unknowns visible without exposing private work.
                  </p>
                </div>
                <div className="project-public-dossier-grid">
                  {dossierCards.map((card) => {
                    const Icon = card.icon;
                    return (
                      <article key={card.title} className="project-public-dossier-card">
                        <div className="project-public-dossier-card-head">
                          <span aria-hidden>
                            <Icon size={18} />
                          </span>
                          <div>
                            <h3>{card.title}</h3>
                            <p>{card.summary}</p>
                          </div>
                        </div>
                        <dl>
                          {card.items.map((item) => (
                            <div key={`${card.title}-${item.label}-${item.detail}`}>
                              <dt>{item.label}</dt>
                              <dd>{item.detail}</dd>
                            </div>
                          ))}
                        </dl>
                      </article>
                    );
                  })}
                </div>
              </section>

              <div className="project-dossier-body">
                <h2>Overview</h2>
                <MarkdownBody body={project.body} />
                {project.slug === "minidora-trading" ? <TradingProjectShowcase /> : null}
              </div>
            </article>

            <div className="project-dossier-rail" aria-label="Project dossier metadata">
              <section className="project-rail-panel">
                <p className="projects-kicker">Project dossier</p>
                <dl className="project-meta-list">
                  <div>
                    <dt>Visibility</dt>
                    <dd>{boundary.label}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>{project.statusLabel}</dd>
                  </div>
                  <div>
                    <dt>Category</dt>
                    <dd>{project.categoryLabel}</dd>
                  </div>
                  <div>
                    <dt>Content model</dt>
                    <dd>Public boundary</dd>
                  </div>
                </dl>
              </section>

              <section className="project-rail-panel">
                <p className="projects-kicker">Project links</p>
                <div className="project-link-list">
                  {project.links.map((link) => {
                    const isExternal = isExternalProjectHref(link.href);

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="link-focus project-link-row"
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                      >
                        <span>
                          {link.private ? <LockKeyhole size={15} aria-hidden /> : <FileText size={15} aria-hidden />}
                          {link.label}
                          {link.private ? <span className="sr-only"> Owner-only</span> : null}
                          {isExternal ? <span className="sr-only"> Opens in a new tab</span> : null}
                        </span>
                        <ArrowUpRight size={15} aria-hidden />
                      </Link>
                    );
                  })}
                  <Link href="/dora" className="link-focus project-link-row">
                    <span>
                      <Bot size={15} aria-hidden />
                      Meet Doraemon
                    </span>
                    <ArrowUpRight size={15} aria-hidden />
                  </Link>
                </div>
              </section>

              {relatedNotes.length ? (
                <section className="project-rail-panel">
                  <p className="projects-kicker">Related research</p>
                  <div className="project-related-note-list">
                    {relatedNotes.map((note) => (
                      <Link key={note.slug} href={`/lab/${note.slug}`} className="link-focus">
                        <FileText size={15} aria-hidden />
                        <span>
                          <strong>{note.title}</strong>
                          <small>{note.dateLabel}</small>
                        </span>
                        <ArrowRight size={15} aria-hidden />
                      </Link>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="project-rail-panel">
                <p className="projects-kicker">Safety boundary</p>
                <div className="project-safety-list">
                  {boundary.rules.map((rule) => (
                    <div key={rule}>
                      <CheckCircle2 size={16} aria-hidden />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </section>

              <Link href="/projects" className="link-focus project-rail-return">
                View all projects
                <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
