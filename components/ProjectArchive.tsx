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
import { useLanguage } from "@/components/LanguageProvider";
import type { Project } from "@/lib/content";
import { boundaryForProject, visualForProject } from "@/lib/projectPresentation";
import { localizeSiteText, translateToZh } from "@/lib/site-i18n";

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
  const { locale } = useLanguage();
  const t = (value: string) => localizeSiteText(value, locale);
  const [activeFilter, setActiveFilter] = useState(filters[0].label);
  const [query, setQuery] = useState("");
  const [selectedSlug, setSelectedSlug] = useState(
    projects.find((project) => project.slug === "minidora-trading")?.slug ?? projects[0]?.slug ?? ""
  );

  const visibleProjects = useMemo(() => {
    const filter = filters.find((item) => item.label === activeFilter) ?? filters[0];
    const normalizedQuery = query.trim().toLowerCase();

    return projects.filter((project) => {
      const searchable = [
        project.title,
        project.categoryLabel,
        project.summary,
        project.statusLabel,
        project.visibilityLabel,
        translateToZh(project.title),
        translateToZh(project.categoryLabel),
        translateToZh(project.summary),
        translateToZh(project.statusLabel),
        translateToZh(project.visibilityLabel)
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return filter.match(project) && (normalizedQuery ? searchable.includes(normalizedQuery) : true);
    });
  }, [activeFilter, projects, query]);

  const selectedProject = visibleProjects.find((project) => project.slug === selectedSlug) ?? visibleProjects[0] ?? projects[0];
  const selectedBoundary = selectedProject ? boundaryForProject(selectedProject) : null;

  return (
    <div className="projects-archive-grid">
      <aside className="projects-context-rail" aria-label={t("Projects content model")}>
        <div className="projects-rail-panel">
          <p className="projects-kicker">{t("Content model")}</p>
          <div className="projects-rail-item">
            <Boxes size={18} aria-hidden />
            <div>
              <strong>{t("Projects as artifacts")}</strong>
              <span>{t("A living index of systems, tools, experiments, and research.")}</span>
            </div>
          </div>
          <div className="projects-rail-item">
            <ShieldCheck size={18} aria-hidden />
            <div>
              <strong>{t("Public explains")}</strong>
              <span>{t("Public pages explain the work; private execution stays behind the app shell.")}</span>
            </div>
          </div>
          <div className="projects-rail-item">
            <LockKeyhole size={18} aria-hidden />
            <div>
              <strong>{t("No raw internals")}</strong>
              <span>{t("No prompts, raw IDs, accounts, orders, or execution.")}</span>
            </div>
          </div>
          <div className="projects-rail-item">
            <FileSearch size={18} aria-hidden />
            <div>
              <strong>{t("Research-only trading")}</strong>
              <span>{t("Trading content is research-only. No execution.")}</span>
            </div>
          </div>
        </div>

        <div className="projects-rail-panel projects-boundary-panel">
          <p className="projects-kicker">{t("Public boundary")}</p>
          {[
            ["Public", "Safe to share."],
            ["Private Summary", "High-level view only."],
            ["Research-only", "No execution."],
            ["Owner-only", "Authenticated."]
          ].map(([label, summary]) => (
            <div key={label} className="projects-boundary-token">
              <strong>{t(label)}</strong>
              <span>{t(summary)}</span>
            </div>
          ))}
        </div>

        <Link href="/dora" className="link-focus projects-dora-card">
          <Bot size={28} aria-hidden />
          <span>
            <strong>{t("Meet Doraemon")}</strong>
            <small>{t("Enter the personal AI command room.")}</small>
          </span>
          <ArrowRight size={16} aria-hidden />
        </Link>
      </aside>

      <section className="projects-browser-panel" aria-label={t("Project archive")}>
        <div className="projects-browser-toolbar">
          <div className="projects-browser-filters" aria-label={t("Project filters")}>
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
                  {t(filter.label)}
                </button>
              );
            })}
          </div>
          <label className="projects-search">
            <Search size={16} aria-hidden />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label={t("Search projects")}
              placeholder={t("Search projects")}
            />
          </label>
        </div>

        <div className="projects-table-head" aria-hidden="true">
          <span>{t("Project")}</span>
          <span>{t("Category")}</span>
          <span>{t("Visibility")}</span>
          <span>{t("Status")}</span>
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
                    <strong>{t(project.title)}</strong>
                    <small>{t(project.summary)}</small>
                  </span>
                  <span className="projects-artifact-chip">{t(project.categoryLabel)}</span>
                  <span className={`projects-artifact-boundary ${boundary.className}`}>{t(boundary.label)}</span>
                  <span className="projects-artifact-status">{t(project.statusLabel)}</span>
                </button>
                <Link href={`/projects/${project.slug}`} className="link-focus projects-artifact-open" aria-label={locale === "zh" ? `打开 ${t(project.title)}` : `Open ${project.title}`}>
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
                ? locale === "zh"
                  ? `没有匹配“${query.trim()}”的${t(activeFilter)}项目。`
                  : `No ${activeFilter} projects matching "${query.trim()}".`
                : activeFilter === "All"
                  ? t("No projects yet.")
                  : locale === "zh"
                    ? `还没有${t(activeFilter)}项目。`
                    : `No ${activeFilter} projects yet.`}
            </span>
            {query.trim() ? (
              <button type="button" onClick={() => setQuery("")}>
                {t("Clear search")}
              </button>
            ) : null}
          </div>
        ) : null}

        {selectedProject && selectedBoundary ? (
          <div className="projects-selected-artifact" aria-label={t("Selected project preview")}>
            <span className={`projects-selected-visual projects-artifact-visual-${visualForProject(selectedProject.slug)}`} aria-hidden="true">
              <span />
            </span>
            <div>
              <p className="projects-kicker">{t("Selected artifact")}</p>
              <h2>{t(selectedProject.title)}</h2>
              <p>{t(selectedProject.summary)}</p>
              <div className="projects-selected-meta">
                <span>{t(selectedProject.categoryLabel)}</span>
                <span>{t(selectedBoundary.label)}</span>
                <span>{t(selectedProject.statusLabel)}</span>
              </div>
            </div>
            <div className="projects-selected-routes">
              <p className="projects-kicker">{t("Next routes")}</p>
              <Link href={`/projects/${selectedProject.slug}`} className="link-focus">
                {t("Read public overview")}
                <ArrowRight size={15} aria-hidden />
              </Link>
              <Link href="/dora" className="link-focus">
                {t("Open Doraemon Office")}
                <ArrowRight size={15} aria-hidden />
              </Link>
              <Link href={`/projects/${selectedProject.slug}`} className="link-focus projects-selected-primary">
                {t("Open project")}
                <ArrowRight size={15} aria-hidden />
              </Link>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
