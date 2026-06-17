import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  FileText,
  LockKeyhole,
  ShieldCheck
} from "lucide-react";
import { MarkdownBody } from "@/components/MarkdownBody";
import { SiteChrome } from "@/components/SiteChrome";
import { getProjectBySlug, getProjects } from "@/lib/content";
import { boundaryForProject, visualForProject } from "@/lib/projectPresentation";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.summary
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const boundary = boundaryForProject(project);
  const visual = visualForProject(project.slug);

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
                  <strong>This project is {boundary.label.toLowerCase()}.</strong>
                  <span>{boundary.summary}</span>
                </div>
              </div>

              <div className="project-dossier-body">
                <h2>Overview</h2>
                <MarkdownBody body={project.body} />
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
                  {project.links.map((link) => (
                    <Link key={link.href} href={link.href} className="link-focus project-link-row">
                      <span>
                        {link.private ? <LockKeyhole size={15} aria-hidden /> : <FileText size={15} aria-hidden />}
                        {link.label}
                      </span>
                      <ArrowUpRight size={15} aria-hidden />
                    </Link>
                  ))}
                  <Link href="/dora" className="link-focus project-link-row">
                    <span>
                      <Bot size={15} aria-hidden />
                      Meet Doraemon
                    </span>
                    <ArrowUpRight size={15} aria-hidden />
                  </Link>
                </div>
              </section>

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
