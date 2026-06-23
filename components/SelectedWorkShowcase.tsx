import Link from "next/link";
import { ArrowRight, Bot, Gamepad2, Globe2, ImageIcon, LineChart, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
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

export function SelectedWorkShowcase({ projects }: { projects: Project[] }) {
  const selectedProjects = projects.slice(0, 5);

  if (selectedProjects.length === 0) {
    return null;
  }

  return (
    <div className="home-work-showcase">
      <div className="home-work-track" aria-label="Selected project artifacts">
        {selectedProjects.map((project) => {
          const boundary = boundaryForProject(project);
          const Icon = categoryIcons[project.category] ?? Sparkles;
          return (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="link-focus home-work-system"
            >
              <span className="home-work-track-node" aria-hidden="true" />
              <span className={`home-work-system-visual home-work-visual-${visualForProject(project.slug)}`} aria-hidden="true">
                <Icon size={28} />
              </span>
              <span className="home-work-system-copy">
                <strong>{project.title}</strong>
                <span>{project.summary}</span>
              </span>
              <span className="home-work-system-meta">
                <span className={`home-work-boundary home-work-boundary-${boundary.className}`}>
                  <span aria-hidden="true" />
                  {boundary.label}
                </span>
                <span className="home-work-system-category">{project.categoryLabel}</span>
              </span>
              <span className="home-work-system-arrow">
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
