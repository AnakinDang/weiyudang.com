import { Metadata } from "next";
import { ProjectExplorer } from "@/components/ProjectExplorer";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteChrome } from "@/components/SiteChrome";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Public project index for Weiyu Dang's AI systems, creative workflows, apps, and research tools."
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <SiteChrome>
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Projects"
            title="Selected work from the personal lab."
            summary="AI systems, creative workflows, apps, and research tools collected as public project entries."
          />
          <ProjectExplorer projects={projects} />
        </div>
      </section>
    </SiteChrome>
  );
}
