"use client";

import { useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard";
import type { Project } from "@/lib/content";

type ProjectFilter = {
  label: string;
  match: (project: Project) => boolean;
};

const filters = [
  { label: "All", match: () => true },
  { label: "AI systems", match: (project: Project) => /ai|agent/i.test(`${project.category} ${project.title}`) },
  { label: "Creative", match: (project: Project) => /creative|media|games/i.test(`${project.category} ${project.title}`) },
  { label: "Research", match: (project: Project) => /research|trading|quantum/i.test(`${project.category} ${project.title} ${project.summary}`) },
  { label: "Public", match: (project: Project) => project.visibility.includes("public") }
] satisfies ProjectFilter[];

export function ProjectExplorer({ projects }: { projects: Project[] }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [query, setQuery] = useState("");

  const visibleProjects = useMemo(() => {
    const filter = filters.find((item) => item.label === activeFilter) ?? filters[0];
    const normalizedQuery = query.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesFilter = filter.match(project);
      const searchable = `${project.title} ${project.category} ${project.summary} ${project.status}`.toLowerCase();
      const matchesQuery = normalizedQuery ? searchable.includes(normalizedQuery) : true;
      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, projects, query]);

  return (
    <div className="mt-10">
      <div className="flex flex-col gap-4 rounded-[8px] border border-[#dde7f0] bg-white/74 p-3 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const isActive = filter.label === activeFilter;
            return (
              <button
                key={filter.label}
                type="button"
                onClick={() => setActiveFilter(filter.label)}
                className={`inline-flex items-center gap-2 rounded-[8px] px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#2563eb] text-white shadow-[0_10px_24px_rgba(37,99,235,0.2)]"
                    : "border border-[#dde7f0] bg-[#f8fafc] text-slate-700 hover:border-[#bfdbfe] hover:bg-[#e0f2fe]"
                }`}
              >
                <Filter size={14} aria-hidden />
                {filter.label}
              </button>
            );
          })}
        </div>
        <label className="flex min-w-0 items-center gap-2 rounded-[8px] border border-[#dde7f0] bg-[#f8fafc] px-3 py-2 text-sm text-slate-600 md:w-72">
          <Search size={15} aria-hidden />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            placeholder="Search work"
          />
        </label>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 text-sm text-slate-500">
        <span>
          Showing <strong className="text-slate-900">{visibleProjects.length}</strong> of {projects.length}
        </span>
        <span className="hidden text-xs font-semibold uppercase text-[#9a6a08] sm:inline">client-side filter</span>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visibleProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {visibleProjects.length === 0 ? (
        <div className="mt-5 rounded-[8px] border border-[#dde7f0] bg-white p-6 text-sm leading-6 text-slate-600">
          No matching project yet. Try clearing the search or switching filters.
        </div>
      ) : null}
    </div>
  );
}
