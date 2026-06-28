import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Boxes, ShieldCheck } from "lucide-react";
import { ProjectArchive } from "@/components/ProjectArchive";
import { SiteChrome } from "@/components/SiteChrome";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Public project index for Weiyu Dang's AI systems, creative workflows, apps, and research tools.",
  alternates: {
    canonical: "/projects"
  },
  openGraph: {
    title: "Projects",
    description: "Public project index for Weiyu Dang's AI systems, creative workflows, apps, and research tools.",
    url: "/projects",
    type: "website"
  }
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <SiteChrome headerVariant="doraemon" headerActiveHref="/projects">
      <section className="projects-page-hero">
        <div className="container projects-page-hero-grid">
          <div>
            <h1>Projects as artifacts.</h1>
            <p>
              A curated index of public projects across systems, tools, experiments, and research. Choose a project to
              read the public story, understand the boundary, and explore next steps.
            </p>
            <div className="projects-hero-actions">
              <Link href="#project-archive" className="link-focus projects-hero-primary">
                Browse the archive
                <ArrowRight size={16} aria-hidden />
              </Link>
              <Link href="/dora" className="link-focus projects-hero-link">
                Open Doraemon
                <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </div>

          <div className="projects-hero-system" aria-label="Project archive public boundary">
            <div className="projects-hero-orbit" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="projects-hero-system-card">
              <Boxes size={24} aria-hidden />
              <strong>{projects.length} curated artifacts</strong>
              <span>Public pages, private summaries, and research-only surfaces.</span>
            </div>
            <div className="projects-hero-system-card is-boundary">
              <ShieldCheck size={24} aria-hidden />
              <strong>Public by design</strong>
              <span>No prompts, accounts, raw IDs, orders, or private execution state.</span>
            </div>
          </div>
        </div>
      </section>

      <section id="project-archive" className="projects-page-section">
        <div className="container">
          <ProjectArchive projects={projects} />
        </div>
      </section>
    </SiteChrome>
  );
}
