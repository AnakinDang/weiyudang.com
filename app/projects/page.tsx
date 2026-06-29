import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bot, Boxes, FileSearch, Globe2, LockKeyhole, Network, ShieldCheck } from "lucide-react";
import { ProjectArchive } from "@/components/ProjectArchive";
import { SiteChrome } from "@/components/SiteChrome";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Personal OS systems map for Weiyu Dang's public projects, Doraemon Office surfaces, research tools, and safe project summaries.",
  alternates: {
    canonical: "/projects"
  },
  openGraph: {
    title: "Projects",
    description:
      "Personal OS systems map for Weiyu Dang's public projects, Doraemon Office surfaces, research tools, and safe project summaries.",
    url: "/projects",
    type: "website"
  }
};

const systemLanes = [
  {
    title: "Personal OS Core",
    summary: "The website, Doraemon Office, owner cockpit, and research surfaces share one public/private contract.",
    href: "/projects/weiyu-personal-os",
    icon: Boxes
  },
  {
    title: "Doraemon Office",
    summary: "A public-safe command room for agent presence, activity, schedules, knowledge, and system posture.",
    href: "/dora",
    icon: Bot
  },
  {
    title: "Research Studio",
    summary: "Public notes and build logs expose the method and evidence without exposing private source material.",
    href: "/lab",
    icon: FileSearch
  },
  {
    title: "Trading Research",
    summary: "Research-only market work: evidence, validation, review, and no execution path.",
    href: "/projects/minidora-trading",
    icon: ShieldCheck
  }
] as const;

const boundaryStrip = [
  ["Public story", "Curated pages, notes, demos, and safe summaries."],
  ["Private execution", "Prompts, tasks, accounts, raw data, and controls stay gated."],
  ["Owner review", "Important actions remain human-bounded and reviewable."]
] as const;

export default function ProjectsPage() {
  const projects = getProjects();
  const publicCount = projects.filter((project) => project.visibility === "public").length;
  const privateSummaryCount = projects.filter((project) => project.visibility === "private-summary").length;
  const researchOnlyCount = projects.filter((project) => project.category === "trading-research").length;

  return (
    <SiteChrome headerVariant="doraemon" headerActiveHref="/projects">
      <section className="projects-page-hero">
        <div className="container projects-page-hero-grid">
          <div className="projects-hero-copy">
            <p className="projects-kicker">Personal OS systems map</p>
            <h1>Projects that connect into one operating system.</h1>
            <p>
              A curated map of the public systems, private summaries, research lanes, and Doraemon Office surfaces that
              make the Personal OS legible without exposing the operating layer underneath.
            </p>
            <div className="projects-hero-actions">
              <Link href="#project-archive" className="link-focus projects-hero-primary">
                Explore the system map
                <ArrowRight size={16} aria-hidden />
              </Link>
              <Link href="/dora" className="link-focus projects-hero-link">
                Open Doraemon Office
                <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
            <div className="projects-hero-metrics" role="list" aria-label="Projects system summary">
              <span role="listitem">
                <strong>{projects.length}</strong>
                <small>curated projects</small>
              </span>
              <span role="listitem">
                <strong>{publicCount}</strong>
                <small>public artifacts</small>
              </span>
              <span role="listitem">
                <strong>{privateSummaryCount}</strong>
                <small>private summaries</small>
              </span>
              <span role="listitem">
                <strong>{researchOnlyCount}</strong>
                <small>research-only projects</small>
              </span>
            </div>
          </div>

          <aside className="projects-hero-visual" aria-label="Personal OS project map preview">
            <div className="projects-hero-image-frame">
              <Image
                src="/visuals/personal-os-portal-v1.png"
                alt="A bright Personal OS studio with a Doraemon Office portal, public system map lights, notebooks, and safe research artifacts."
                width={1680}
                height={945}
                priority
                quality={92}
                sizes="(min-width: 1080px) 50vw, 100vw"
                className="projects-hero-image"
              />
              <div className="projects-hero-image-card">
                <Globe2 size={18} aria-hidden />
                <span>
                  <strong>Public map. Private engine.</strong>
                  <small>No prompts, accounts, raw IDs, orders, or owner controls.</small>
                </span>
              </div>
            </div>
            <div className="projects-hero-boundary-strip" role="list" aria-label="Public private project boundary">
              {boundaryStrip.map(([title, summary]) => (
                <span key={title} role="listitem">
                  <strong>{title}</strong>
                  <small>{summary}</small>
                </span>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="projects-system-map-section">
        <div className="container">
          <div className="projects-system-map-head">
            <p className="projects-kicker">System lanes</p>
            <h2>Follow the work by operating layer.</h2>
            <p>
              The archive is not a portfolio shelf. It is the public map of how the site, Doraemon Office, research
              studio, owner cockpit, and specialist MiniDoras fit together.
            </p>
          </div>
          <div className="projects-system-lane-grid" role="list" aria-label="Personal OS project lanes">
            {systemLanes.map((lane) => {
              const Icon = lane.icon;
              return (
                <Link key={lane.title} href={lane.href} role="listitem" className="link-focus projects-system-lane-card">
                  <span className="projects-system-lane-icon">
                    <Icon size={22} aria-hidden />
                  </span>
                  <strong>{lane.title}</strong>
                  <span className="projects-system-lane-summary">{lane.summary}</span>
                  <span className="projects-system-lane-link">
                    Inspect layer
                    <ArrowRight size={15} aria-hidden />
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="projects-map-boundary-note" role="note">
            <LockKeyhole size={17} aria-hidden />
            <span>
              Public project pages explain architecture, evidence, direction, and boundary. Private prompts, raw
              runtime state, account data, trading execution, and owner-only controls stay outside the public bundle.
            </span>
            <Network size={17} aria-hidden />
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
