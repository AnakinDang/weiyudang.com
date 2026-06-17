"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bot,
  Boxes,
  FileSearch,
  Filter,
  LockKeyhole,
  Search,
  ShieldCheck
} from "lucide-react";
import type { Project } from "@/lib/content";
import { boundaryForProject, visualForProject } from "@/lib/projectPresentation";

type ArchiveFilter = {
  label: string;
  match: (project: Project) => boolean;
};

const filters = [
  { label: "All", match: () => true },
  { label: "Public", match: (project: Project) => project.visibility === "public" },
  { label: "Private Summary", match: (project: Project) => project.visibility === "private-summary" },
  { label: "Research-only", match: (project: Project) => project.category === "trading-research" }
] satisfies ArchiveFilter[];

export function ProjectArchive({ projects }: { projects: Project[] }) {
  const [activeFilter, setActiveFilter] = useState(filters[0].label);
  const [query, setQuery] = useState("");
  const [selectedSlug, setSelectedSlug] = useState(
    projects.find((project) => project.slug === "minidora-trading")?.slug ?? projects[0]?.slug ?? ""
  );

  const visibleProjects = useMemo(() => {
    const filter = filters.find((item) => item.label === activeFilter) ?? filters[0];
    const normalizedQuery = query.trim().toLowerCase();

    return projects.filter((project) => {
      const searchable = `${project.title} ${project.categoryLabel} ${project.summary} ${project.statusLabel} ${project.visibilityLabel}`.toLowerCase();
      return filter.match(project) && (normalizedQuery ? searchable.includes(normalizedQuery) : true);
    });
  }, [activeFilter, projects, query]);

  const selectedProject = visibleProjects.find((project) => project.slug === selectedSlug) ?? visibleProjects[0] ?? projects[0];
  const selectedBoundary = selectedProject ? boundaryForProject(selectedProject) : null;

  return (
    <div className="projects-archive-grid">
      <aside className="projects-context-rail" aria-label="Projects content model">
        <div className="projects-rail-panel">
          <p className="projects-kicker">Content model</p>
          <div className="projects-rail-item">
            <Boxes size={18} aria-hidden />
            <div>
              <strong>Projects as artifacts</strong>
              <span>A living index of systems, tools, experiments, and research.</span>
            </div>
          </div>
          <div className="projects-rail-item">
            <ShieldCheck size={18} aria-hidden />
            <div>
              <strong>Public explains</strong>
              <span>Public pages explain the work; private execution stays behind the app shell.</span>
            </div>
          </div>
          <div className="projects-rail-item">
            <LockKeyhole size={18} aria-hidden />
            <div>
              <strong>No raw internals</strong>
              <span>No prompts, raw IDs, accounts, orders, or execution.</span>
            </div>
          </div>
          <div className="projects-rail-item">
            <FileSearch size={18} aria-hidden />
            <div>
              <strong>Research-only trading</strong>
              <span>Trading content is research-only. No execution.</span>
            </div>
          </div>
        </div>

        <div className="projects-rail-panel projects-boundary-panel">
          <p className="projects-kicker">Public boundary</p>
          {[
            ["Public", "Safe to share."],
            ["Private Summary", "High-level view only."],
            ["Research-only", "No execution."],
            ["Owner-only", "Authenticated."]
          ].map(([label, summary]) => (
            <div key={label} className="projects-boundary-token">
              <strong>{label}</strong>
              <span>{summary}</span>
            </div>
          ))}
        </div>

        <Link href="/dora" className="link-focus projects-dora-card">
          <Bot size={28} aria-hidden />
          <span>
            <strong>Meet Doraemon</strong>
            <small>Enter the personal AI command room.</small>
          </span>
          <ArrowRight size={16} aria-hidden />
        </Link>
      </aside>

      <section className="projects-browser-panel" aria-label="Project archive">
        <div className="projects-browser-toolbar">
          <div className="projects-browser-filters" aria-label="Project filters">
            {filters.map((filter) => {
              const isActive = filter.label === activeFilter;
              return (
                <button
                  key={filter.label}
                  type="button"
                  aria-pressed={isActive}
                  className={`projects-filter-button${isActive ? " is-active" : ""}`}
                  onClick={() => setActiveFilter(filter.label)}
                >
                  <Filter size={14} aria-hidden />
                  {filter.label}
                </button>
              );
            })}
          </div>
          <label className="projects-search">
            <Search size={16} aria-hidden />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search projects"
              placeholder="Search projects"
            />
          </label>
        </div>

        <div className="projects-table-head" aria-hidden="true">
          <span>Project</span>
          <span>Category</span>
          <span>Visibility</span>
          <span>Status</span>
          <span />
        </div>

        <ul className="projects-artifact-list" role="list">
          {visibleProjects.map((project) => {
            const isSelected = selectedProject?.slug === project.slug;
            const boundary = boundaryForProject(project);
            return (
              <li key={project.slug} className={`projects-artifact-row${isSelected ? " is-selected" : ""}`}>
                <button type="button" aria-pressed={isSelected} onClick={() => setSelectedSlug(project.slug)}>
                  <span className={`projects-artifact-visual projects-artifact-visual-${visualForProject(project.slug)}`} aria-hidden="true">
                    <span />
                  </span>
                  <span className="projects-artifact-main">
                    <strong>{project.title}</strong>
                    <small>{project.summary}</small>
                  </span>
                  <span className="projects-artifact-chip">{project.categoryLabel}</span>
                  <span className={`projects-artifact-boundary ${boundary.className}`}>{boundary.label}</span>
                  <span className="projects-artifact-status">{project.statusLabel}</span>
                </button>
                <Link href={`/projects/${project.slug}`} className="link-focus projects-artifact-open" aria-label={`Open ${project.title}`}>
                  <ArrowRight size={17} aria-hidden />
                </Link>
              </li>
            );
          })}
        </ul>

        {visibleProjects.length === 0 ? (
          <div className="projects-empty-state">
            <FileSearch size={22} aria-hidden />
            <span>
              {query.trim()
                ? `No ${activeFilter} projects matching "${query.trim()}".`
                : activeFilter === "All"
                  ? "No projects yet."
                  : `No ${activeFilter} projects yet.`}
            </span>
            {query.trim() ? (
              <button type="button" onClick={() => setQuery("")}>
                Clear search
              </button>
            ) : null}
          </div>
        ) : null}

        {selectedProject && selectedBoundary ? (
          <div className="projects-selected-artifact" aria-label="Selected project preview">
            <span className={`projects-selected-visual projects-artifact-visual-${visualForProject(selectedProject.slug)}`} aria-hidden="true">
              <span />
            </span>
            <div>
              <p className="projects-kicker">Selected artifact</p>
              <h2>{selectedProject.title}</h2>
              <p>{selectedProject.summary}</p>
              <div className="projects-selected-meta">
                <span>{selectedProject.categoryLabel}</span>
                <span>{selectedBoundary.label}</span>
                <span>{selectedProject.statusLabel}</span>
              </div>
            </div>
            <div className="projects-selected-routes">
              <p className="projects-kicker">Next routes</p>
              <Link href={`/projects/${selectedProject.slug}`} className="link-focus">
                Read public overview
                <ArrowRight size={15} aria-hidden />
              </Link>
              <Link href="/dora" className="link-focus">
                Open Doraemon office
                <ArrowRight size={15} aria-hidden />
              </Link>
              <Link href={`/projects/${selectedProject.slug}`} className="link-focus projects-selected-primary">
                Open project
                <ArrowRight size={15} aria-hidden />
              </Link>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
