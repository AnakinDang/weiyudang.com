import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Gamepad2,
  Globe2,
  ImageIcon,
  LineChart,
  LockKeyhole,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import type { Project } from "@/lib/content";
import { boundaryForProject, visualForProject } from "@/lib/projectPresentation";

const categoryIcons = {
  "personal-ai-systems": Sparkles,
  "agent-infrastructure": Bot,
  "research-tools": Globe2,
  "trading-research": LineChart,
  "creative-media": ImageIcon,
  "games-experiments": Gamepad2,
  "writing-field-notes": Globe2
} as const;

const boundaryNotes = [
  {
    label: "Public",
    summary: "Safe to browse. Curated and sanitized.",
    icon: Globe2,
    tone: "public"
  },
  {
    label: "Private Summary",
    summary: "High-level overview only. Internals stay private.",
    icon: LockKeyhole,
    tone: "private"
  },
  {
    label: "Research-only",
    summary: "For research and learning. Not for execution.",
    icon: LineChart,
    tone: "research"
  },
  {
    label: "No raw internals",
    summary: "No prompts, accounts, orders, IDs, or paths.",
    icon: ShieldCheck,
    tone: "safe"
  }
] as const;

function pickFeaturedProject(projects: Project[]) {
  return projects.find((project) => project.slug === "weiyu-ai") ?? projects[0];
}

export function SelectedWorkShowcase({ projects }: { projects: Project[] }) {
  const featuredProject = pickFeaturedProject(projects);
  const supportingProjects = projects.filter((project) => project.slug !== featuredProject?.slug).slice(0, 4);

  if (!featuredProject) {
    return null;
  }

  const featuredBoundary = boundaryForProject(featuredProject);
  const FeaturedIcon = categoryIcons[featuredProject.category] ?? Sparkles;
  const featuredVisual = visualForProject(featuredProject.slug);

  return (
    <div className="home-work-showcase">
      <div className="home-work-featured" aria-label={`Featured project: ${featuredProject.title}`}>
        <div className={`home-work-featured-visual home-work-visual-${featuredVisual}`} aria-hidden="true">
          <span className="home-work-featured-orb">
            <FeaturedIcon size={42} aria-hidden />
          </span>
        </div>
        <div className="home-work-featured-copy">
          <div className="home-work-featured-meta">
            <span className="home-work-featured-label">Featured</span>
            <span className={`home-work-boundary home-work-boundary-${featuredBoundary.className}`}>
              <span aria-hidden="true" />
              {featuredBoundary.label}
            </span>
          </div>
          <h3>{featuredProject.title}</h3>
          <p>{featuredProject.summary}</p>
          <div className="home-work-tags" aria-label={`${featuredProject.title} metadata`}>
            <span>{featuredProject.categoryLabel}</span>
            <span>{featuredProject.statusLabel}</span>
            <span>{featuredProject.visibilityLabel}</span>
          </div>
          <Link href={`/projects/${featuredProject.slug}`} className="link-focus home-work-featured-link">
            View project
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </div>

      <div className="home-work-rail" aria-label="Selected project artifacts">
        {supportingProjects.map((project) => {
          const boundary = boundaryForProject(project);
          const Icon = categoryIcons[project.category] ?? Sparkles;
          return (
            <Link key={project.slug} href={`/projects/${project.slug}`} className="link-focus home-work-artifact">
              <span className={`home-work-artifact-visual home-work-visual-${visualForProject(project.slug)}`} aria-hidden="true">
                <Icon size={24} />
              </span>
              <span className="home-work-artifact-copy">
                <strong>{project.title}</strong>
                <span>{project.summary}</span>
              </span>
              <span className={`home-work-boundary home-work-boundary-${boundary.className}`}>
                <span aria-hidden="true" />
                {boundary.label}
              </span>
              <span className="home-work-artifact-arrow">
                <ArrowRight size={16} aria-hidden />
              </span>
            </Link>
          );
        })}
      </div>

      <div className="home-work-boundary-strip" aria-label="Selected work public safety boundaries">
        {boundaryNotes.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className={`home-work-boundary-note home-work-boundary-note-${item.tone}`}>
              <Icon size={17} aria-hidden />
              <span>
                <strong>{item.label}</strong>
                <small>{item.summary}</small>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
