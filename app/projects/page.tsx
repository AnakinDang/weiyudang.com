import { Metadata } from "next";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteChrome } from "@/components/SiteChrome";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Public project index for Weiyu AI, Doraemon Agent System, MiniDora Trading, games, apps, and media work."
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <SiteChrome>
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Projects"
            title="The public project index for Weiyu AI."
            summary="Each project page is generated from structured content, so new systems and notes can be added without rewriting page code."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
