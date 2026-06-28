"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, FileSearch, Filter, FlaskConical, Link2, Search } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { TradingResearchBoundary } from "@/components/TradingResearchBoundary";
import type { Note } from "@/lib/content";
import { labCategories, type LabCategory } from "@/lib/content-model";
import { localizeSiteText, translateToZh, type SiteLocale } from "@/lib/site-i18n";

type LabFilter = {
  key: "all" | LabCategory;
  label: string;
};

const filters = [
  { key: "all", label: "All" },
  ...Object.entries(labCategories).map(([key, label]) => ({
    key: key as LabCategory,
    label
  }))
] satisfies LabFilter[];

const labFilterZhLabels = {
  all: "全部",
  "agent-systems": "智能体系统",
  "dora-office": "Doraemon Office",
  "trading-research": "交易研究",
  design: "设计",
  engineering: "工程",
  "creative-media": "创意媒体",
  operations: "运营"
} satisfies Record<LabFilter["key"], string>;

const noteVisuals = ["orbit", "blueprint", "signal", "method"] as const;

function visualForNote(slug: string) {
  const sum = Array.from(slug).reduce((total, char) => total + char.charCodeAt(0), 0);
  return noteVisuals[sum % noteVisuals.length];
}

function relatedProjectHref(note: Note) {
  return note.relatedProject ? `/projects/${note.relatedProject}` : "/projects";
}

function emptyMessageForNotes({
  activeFilter,
  activeFilterLabel,
  locale,
  query
}: {
  activeFilter: LabFilter["key"];
  activeFilterLabel: string;
  locale: SiteLocale;
  query: string;
}) {
  const localizedFilterLabel = locale === "zh" ? labFilterZhLabels[activeFilter] : activeFilterLabel;

  if (query) {
    if (locale === "zh") {
      return activeFilter === "all"
        ? `没有匹配“${query}”的笔记。`
        : `没有匹配“${query}”的${localizedFilterLabel}笔记。`;
    }

    return activeFilter === "all"
      ? `No notes matching "${query}".`
      : `No ${activeFilterLabel} notes matching "${query}".`;
  }

  if (locale === "zh") {
    return activeFilter === "all" ? "还没有公开研究笔记。" : `还没有${localizedFilterLabel}笔记。`;
  }

  return activeFilter === "all" ? "No public research notes yet." : `No ${activeFilterLabel} notes yet.`;
}

export function LabNotesBrowser({ notes }: { notes: Note[] }) {
  const { locale } = useLanguage();
  const t = (value: string) => localizeSiteText(value, locale);
  const [activeFilter, setActiveFilter] = useState<LabFilter["key"]>("all");
  const [query, setQuery] = useState("");
  const [selectedSlug, setSelectedSlug] = useState(notes[0]?.slug ?? "");

  const visibleNotes = useMemo(() => {
    const filter = filters.find((item) => item.key === activeFilter) ?? filters[0];
    const normalizedQuery = query.trim().toLowerCase();

    return notes.filter((note) => {
      const searchable = [
        note.title,
        note.categoryLabel,
        note.summary,
        note.dateLabel,
        translateToZh(note.title),
        translateToZh(note.categoryLabel),
        translateToZh(note.summary),
        translateToZh(note.dateLabel)
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesFilter = filter.key === "all" || note.category === filter.key;
      return matchesFilter && (normalizedQuery ? searchable.includes(normalizedQuery) : true);
    });
  }, [activeFilter, notes, query]);

  const selectedNote = visibleNotes.find((note) => note.slug === selectedSlug) ?? visibleNotes[0];
  const activeFilterLabel = filters.find((item) => item.key === activeFilter)?.label ?? "All";
  const trimmedQuery = query.trim();
  const emptyMessage = emptyMessageForNotes({ activeFilter, activeFilterLabel, locale, query: trimmedQuery });
  const showsTradingResearch =
    activeFilter === "trading-research" || visibleNotes.some((note) => note.category === "trading-research");

  return (
    <div className="lab-browser-grid">
      <aside className="lab-model-rail" aria-label={t("Research model")}>
        <div className="lab-model-panel">
          <p className="lab-model-kicker">{t("How we organize notes")}</p>
          <h2>{t("Research model")}</h2>
          {[
            ["Build logs", "Ship, test, learn."],
            ["Design notes", "Decisions and tradeoffs."],
            ["Research sketches", "Ideas in progress."],
            ["Public boundary", "What we share."]
          ].map(([title, summary]) => (
            <div key={title} className="lab-model-item">
              <FlaskConical size={17} aria-hidden />
              <span>
                <strong>{t(title)}</strong>
                <small>{t(summary)}</small>
              </span>
            </div>
          ))}
        </div>
      </aside>

      <section className="lab-notes-panel" aria-label={t("Public research notes")}>
        <div className="lab-notes-toolbar">
          <div className="lab-filter-group" aria-label={t("Research note filters")}>
            {filters.map((filter) => {
              const isActive = activeFilter === filter.key;
              return (
                <button
                  key={filter.key}
                  type="button"
                  aria-pressed={isActive}
                  className={`lab-filter-button${isActive ? " is-active" : ""}`}
                  onClick={() => setActiveFilter(filter.key)}
                >
                  <Filter size={13} aria-hidden />
                  {t(filter.label)}
                </button>
              );
            })}
          </div>

          <label className="lab-search">
            <Search size={16} aria-hidden />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label={t("Search research notes")}
              placeholder={t("Search notes")}
            />
          </label>
        </div>

        {showsTradingResearch ? <TradingResearchBoundary compact /> : null}

        <ul className="lab-note-list" role="list">
          {visibleNotes.map((note) => {
            const isSelected = selectedNote?.slug === note.slug;
            return (
              <li key={note.slug} className={`lab-note-row${isSelected ? " is-selected" : ""}`}>
                <button type="button" aria-pressed={isSelected} onClick={() => setSelectedSlug(note.slug)}>
                  <span className={`lab-note-visual lab-note-visual-${visualForNote(note.slug)}`} aria-hidden="true">
                    <span />
                  </span>
                  <span className="lab-note-main">
                    <small>{note.featured ? t("Featured note") : t("Research note")}</small>
                    <strong>{t(note.title)}</strong>
                    <span>{t(note.summary)}</span>
                  </span>
                  <span className="lab-note-chip">{t(note.categoryLabel)}</span>
                  <span className="lab-note-date">{t(note.dateLabel)}</span>
                </button>
                <Link href={`/lab/${note.slug}`} className="link-focus lab-note-open" aria-label={locale === "zh" ? `阅读 ${t(note.title)}` : `Read ${note.title}`}>
                  <ArrowRight size={17} aria-hidden />
                </Link>
              </li>
            );
          })}
        </ul>

        {visibleNotes.length === 0 ? (
          <div className="lab-empty-state">
            <FileSearch size={22} aria-hidden />
            <span data-i18n-skip>{emptyMessage}</span>
            {trimmedQuery ? (
              <button type="button" onClick={() => setQuery("")} data-i18n-skip>
                {locale === "zh" ? "清除搜索" : "Clear search"}
              </button>
            ) : null}
          </div>
        ) : null}

        {selectedNote ? (
          <div className="lab-selected-note" aria-label={t("Selected research note")}>
            <div>
              <p>{t("Selected note")}</p>
              <h2>{t(selectedNote.title)}</h2>
              <div className="lab-selected-meta">
                <span>{t(selectedNote.categoryLabel)}</span>
                <span>{t(selectedNote.dateLabel)}</span>
                <span>{t(selectedNote.visibilityLabel)}</span>
              </div>
              <p>{t(selectedNote.summary)}</p>
              <div className="lab-selected-actions">
                <Link href={`/lab/${selectedNote.slug}`} className="link-focus lab-selected-primary">
                  {t("Read note")}
                  <ArrowRight size={15} aria-hidden />
                </Link>
                <Link href={relatedProjectHref(selectedNote)} className="link-focus">
                  {selectedNote.relatedProject ? t("Related project") : t("Browse projects")}
                  <Link2 size={15} aria-hidden />
                </Link>
              </div>
            </div>
            <span className={`lab-selected-visual lab-note-visual-${visualForNote(selectedNote.slug)}`} aria-hidden="true">
              <span />
            </span>
          </div>
        ) : null}
      </section>
    </div>
  );
}
