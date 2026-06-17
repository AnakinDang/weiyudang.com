"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Circle, Filter, Search } from "lucide-react";
import type { Project } from "@/lib/content";

type ProjectFilter = {
  label: string;
  match: (project: Project) => boolean;
};

const filters = [
  { label: "All", match: () => true },
  { label: "AI systems", match: (project: Project) => /ai|agent/i.test(`${project.categoryLabel} ${project.title}`) },
  { label: "Creative", match: (project: Project) => /creative|media|games/i.test(`${project.categoryLabel} ${project.title}`) },
  { label: "Research", match: (project: Project) => /research|trading|quantum/i.test(`${project.categoryLabel} ${project.title} ${project.summary}`) },
  { label: "Public", match: (project: Project) => project.visibility === "public" }
] satisfies ProjectFilter[];

const projectVisuals = ["radar", "network", "notes", "market", "field"] as const;

function visualForProject(slug: string) {
  const sum = Array.from(slug).reduce((total, char) => total + char.charCodeAt(0), 0);
  return projectVisuals[sum % projectVisuals.length];
}

export function ProjectExplorer({ projects }: { projects: Project[] }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [query, setQuery] = useState("");

  const visibleProjects = useMemo(() => {
    const filter = filters.find((item) => item.label === activeFilter) ?? filters[0];
    const normalizedQuery = query.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesFilter = filter.match(project);
      const searchable = `${project.title} ${project.categoryLabel} ${project.summary} ${project.statusLabel}`.toLowerCase();
      const matchesQuery = normalizedQuery ? searchable.includes(normalizedQuery) : true;
      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, projects, query]);

  return (
    <div className="home-project-browser">
      <div className="home-project-toolbar">
        <div className="home-project-filters" aria-label="Project filters">
          {filters.map((filter) => {
            const isActive = filter.label === activeFilter;
            return (
              <button
                key={filter.label}
                type="button"
                onClick={() => setActiveFilter(filter.label)}
                aria-pressed={isActive}
                className={`home-filter-button${isActive ? " is-active" : ""}`}
              >
                <Filter size={14} aria-hidden />
                {filter.label}
              </button>
            );
          })}
        </div>
        <label className="home-project-search">
          <Search size={15} aria-hidden />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search projects"
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            placeholder="Search work"
          />
        </label>
      </div>

      <div className="home-project-count">
        <span>
          Showing <strong className="text-slate-900">{visibleProjects.length}</strong> of {projects.length}
        </span>
        <span>public content model</span>
      </div>

      <div className="home-project-list">
        {visibleProjects.map((project) => (
          <Link key={project.slug} href={`/projects/${project.slug}`} className="link-focus home-project-row">
            <span className={`home-project-visual home-project-visual-${visualForProject(project.slug)}`} aria-hidden="true">
              <span />
            </span>
            <span className="home-project-main">
              <strong>
                {project.title}
                <Circle size={7} aria-hidden />
              </strong>
              <span>{project.summary}</span>
            </span>
            <span className="home-project-category">{project.categoryLabel}</span>
            <span className={`home-project-state home-project-state-${project.visibility}`}>
              {project.visibilityLabel}
            </span>
            <span className="home-project-arrow">
              <ArrowRight size={17} aria-hidden />
            </span>
          </Link>
        ))}
      </div>

      {visibleProjects.length === 0 ? (
        <div className="home-project-empty">
          <span>
            {query.trim()
              ? `No ${activeFilter} projects matching "${query.trim()}".`
              : `No ${activeFilter} projects yet.`}
          </span>
          {query.trim() ? (
            <button type="button" onClick={() => setQuery("")}>
              Clear search
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
