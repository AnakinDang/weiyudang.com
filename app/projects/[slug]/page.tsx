import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Ban,
  Bot,
  CheckCircle2,
  CircleHelp,
  Compass,
  Database,
  FileText,
  GitCompareArrows,
  Globe2,
  Layers3,
  LockKeyhole,
  Radio,
  ShieldCheck
} from "lucide-react";
import { MarkdownBody } from "@/components/MarkdownBody";
import { SiteChrome } from "@/components/SiteChrome";
import { TradingProjectShowcase } from "@/components/TradingProjectShowcase";
import { getNotesForProject, getProjectBySlug, getProjects } from "@/lib/content";
import { boundaryForProject, visualForProject } from "@/lib/projectPresentation";
import { tradingConsoleHref, tradingResearchDisclaimer } from "@/lib/trading-team";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

function isExternalProjectHref(href: string) {
  return href.startsWith("https://");
}

function heroImageForProject(project: ReturnType<typeof getProjects>[number]) {
  if (project.slug === "weiyu-personal-os" || project.slug === "weiyu-ai") {
    return "/visuals/personal-os-portal-v1.png";
  }

  if (
    project.slug === "doraemon-agent-system" ||
    project.slug === "doraemon-visualizer" ||
    project.slug === "openclaw-runtime" ||
    project.slug === "knowledge-vault"
  ) {
    return "/visuals/doraemon-office-command-room-v2.png";
  }

  return "/visuals/weiyu-bright-studio.png";
}

function primaryProjectLink(project: ReturnType<typeof getProjects>[number]) {
  return (
    project.links.find((link) => !link.private) ?? {
      label: "Open Doraemon Office",
      href: "/dora",
      private: false
    }
  );
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

const tradingHeroFlow = [
  {
    label: "Research question",
    detail: "Market context enters as research, not a trade idea."
  },
  {
    label: "Evidence",
    detail: "Packets name proof, blockers, and counter-evidence."
  },
  {
    label: "Desk review",
    detail: "Macro, equity, options, news, and risk can disagree."
  },
  {
    label: "Owner gate",
    detail: "Private review stays authenticated and read-only."
  }
] as const;

const tradingHeroStats = [
  { label: "Desks", value: "7" },
  { label: "Console views", value: "8" },
  { label: "Execution", value: "0" }
] as const;

const projectConnectionFlow = [
  {
    label: "Public surface",
    detail: "Curated pages explain the visible project shape."
  },
  {
    label: "Doraemon layer",
    detail: "Doraemon Office makes status, agents, and rhythm legible."
  },
  {
    label: "Private boundary",
    detail: "Owner work, source material, prompts, and controls stay gated."
  }
] as const;

function TradingProjectLandingHero() {
  return (
    <section className="trading-project-landing-hero" aria-labelledby="trading-project-landing-title">
      <div className="trading-project-landing-copy">
        <div className="trading-project-landing-lockup" aria-hidden>
          <span>Research</span>
          <span>Evidence</span>
          <span>Owner review</span>
        </div>
        <h1 id="trading-project-landing-title">MiniDora Trading Research</h1>
        <p>
          A public-safe window into the research desks behind Trading MiniDora: questions, evidence, desk
          disagreement, replay, and owner review. It explains how thinking forms without turning the site into a
          trading terminal.
        </p>
        <div className="trading-project-landing-actions">
          <Link href={tradingConsoleHref()} prefetch={false} className="link-focus">
            <LockKeyhole size={17} aria-hidden />
            Open read-only console
            <ArrowRight size={17} aria-hidden />
          </Link>
          <Link href="/dora/team/trading" className="link-focus">
            Meet Trading MiniDora
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
        <div className="trading-project-landing-boundary" role="note" aria-label="Trading research disclaimer">
          <ShieldCheck size={18} aria-hidden />
          <strong>{tradingResearchDisclaimer}</strong>
        </div>
      </div>

      <div className="trading-project-landing-visual" aria-label="Public trading research workflow preview">
        <div className="trading-project-landing-window">
          <div className="trading-project-window-head">
            <span>
              <Radio size={15} aria-hidden />
              Trading MiniDora
            </span>
            <small>public-safe method</small>
          </div>
          <div className="trading-project-window-grid">
            {tradingHeroFlow.map((item, index) => (
              <article key={item.label}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.label}</strong>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
          <div className="trading-project-window-stats" aria-label="Trading research console summary">
            {tradingHeroStats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="trading-project-landing-split">
          <article>
            <Database size={17} aria-hidden />
            <strong>Public page</strong>
            <span>Desks, method, evidence shapes, sample blockers.</span>
          </article>
          <article>
            <GitCompareArrows size={17} aria-hidden />
            <strong>Private console</strong>
            <span>Evidence packets, replay, gates, source health.</span>
          </article>
          <article>
            <Ban size={17} aria-hidden />
            <strong>Never here</strong>
            <span>Accounts, orders, broker writes, private signals.</span>
          </article>
        </div>
      </div>
    </section>
  );
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
  const isTradingProject = project.slug === "minidora-trading";
  const heroImage = heroImageForProject(project);
  const primaryLink = primaryProjectLink(project);
  const primaryLinkIsExternal = isExternalProjectHref(primaryLink.href);
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
      <section className={`project-dossier-page${isTradingProject ? " project-dossier-page--trading" : ""}`}>
        <div className="container">
          <Link href="/projects" className="link-focus project-back-link">
            <ArrowLeft size={16} aria-hidden />
            Back to Projects
          </Link>

          <div className="project-dossier-grid">
            <article className="project-dossier-main">
              {isTradingProject ? (
                <>
                  <TradingProjectLandingHero />
                  <div className="project-dossier-body project-dossier-body--trading">
                    <TradingProjectShowcase />
                  </div>
                </>
              ) : (
                <>
                  <div className="project-dossier-hero project-dossier-hero--system">
                    <div className="project-dossier-hero-copy">
                      <p className="projects-kicker">Public project dossier</p>
                      <h1>{project.title}</h1>
                      <p>{project.summary}</p>
                      <div className="project-dossier-badges">
                        <span>{project.categoryLabel}</span>
                        <span className={boundary.className}>{boundary.label}</span>
                        <span>{project.statusLabel}</span>
                        <span>Public-safe page</span>
                      </div>
                      <div className="project-dossier-actions">
                        <Link
                          href={primaryLink.href}
                          className="link-focus project-dossier-primary-action"
                          target={primaryLinkIsExternal ? "_blank" : undefined}
                          rel={primaryLinkIsExternal ? "noopener noreferrer" : undefined}
                        >
                          {primaryLink.label}
                          {primaryLinkIsExternal ? <span className="sr-only"> Opens in a new tab</span> : null}
                          <ArrowRight size={16} aria-hidden />
                        </Link>
                        <Link href="#project-overview" className="link-focus project-dossier-secondary-action">
                          Read overview
                          <ArrowRight size={16} aria-hidden />
                        </Link>
                      </div>
                    </div>

                    <aside className="project-dossier-hero-visual" aria-label="Project public-safe map">
                      <div className="project-dossier-image-frame">
                        <Image
                          src={heroImage}
                          alt=""
                          aria-hidden="true"
                          width={1680}
                          height={945}
                          quality={90}
                          sizes="(min-width: 1080px) 34vw, 100vw"
                          className="project-dossier-image"
                        />
                        <div className="project-dossier-image-card">
                          <Globe2 size={17} aria-hidden />
                          <span>
                            <strong>Public-safe dossier</strong>
                            <small>{boundary.summary}</small>
                          </span>
                        </div>
                      </div>
                      <div className="project-dossier-lens-grid" role="list" aria-label="Project dossier lens">
                        <span role="listitem">
                          <strong>{project.categoryLabel}</strong>
                          <small>operating lane</small>
                        </span>
                        <span role="listitem">
                          <strong>{boundary.label}</strong>
                          <small>boundary mode</small>
                        </span>
                        <span role="listitem">
                          <strong>{relatedNotes.length}</strong>
                          <small>linked notes</small>
                        </span>
                      </div>
                    </aside>
                  </div>

                  <div className="project-boundary-callout" role="note">
                    <ShieldCheck size={20} aria-hidden />
                    <div>
                      <strong>{boundaryStatement}</strong>
                      <span>{boundary.summary}</span>
                    </div>
                  </div>

                  <section className="project-system-connection" aria-labelledby="project-system-connection-title">
                    <div className="project-system-connection-head">
                      <p className="projects-kicker">System connection</p>
                      <h2 id="project-system-connection-title">How this project connects back to the Personal OS.</h2>
                    </div>
                    <div className="project-system-connection-flow" role="list" aria-label="Project connection flow">
                      {projectConnectionFlow.map((item, index) => (
                        <article key={item.label} role="listitem">
                          <span>{String(index + 1).padStart(2, "0")}</span>
                          <strong>{item.label}</strong>
                          <p>{item.detail}</p>
                        </article>
                      ))}
                    </div>
                  </section>

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

                  <div id="project-overview" className="project-dossier-body">
                    <h2>Overview</h2>
                    <MarkdownBody body={project.body} />
                  </div>
                </>
              )}
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
