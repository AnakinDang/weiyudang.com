"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, Lightbulb, NotebookPen, Radio } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import type { Note } from "@/lib/content";
import { localizeSiteText } from "@/lib/site-i18n";

const pulses = ["drafting", "annotating", "connecting", "publishing"];

const noteIcons = [BookOpen, Lightbulb, NotebookPen];

export function LiveNotesFeed({ notes }: { notes: Note[] }) {
  const { locale } = useLanguage();
  const t = (value: string) => localizeSiteText(value, locale);
  const [active, setActive] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  useEffect(() => {
    if (!isAutoRotating || notes.length <= 1) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % notes.length);
    }, 3600);

    return () => window.clearInterval(timer);
  }, [isAutoRotating, notes.length]);

  const activeNote = notes[active] ?? notes[0];

  if (!activeNote) {
    return null;
  }

  function selectNote(index: number) {
    setActive(index);
    setIsAutoRotating(false);
  }

  function selectAdjacentNote(offset: number) {
    const nextIndex = (active + offset + notes.length) % notes.length;
    document.getElementById(`home-note-tab-${notes[nextIndex].slug}`)?.focus();
    selectNote(nextIndex);
  }

  return (
    <div className="home-notes-feed">
      <div className="home-notes-list" role="tablist" aria-label={t("Latest notes")}>
        {notes.map((note, index) => {
          const isActive = index === active;
          const NoteIcon = noteIcons[index % noteIcons.length];
          return (
            <button
              key={note.slug}
              id={`home-note-tab-${note.slug}`}
              type="button"
              onClick={() => selectNote(index)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                  event.preventDefault();
                  selectAdjacentNote(1);
                }

                if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                  event.preventDefault();
                  selectAdjacentNote(-1);
                }

                if (event.key === "Home") {
                  event.preventDefault();
                  document.getElementById(`home-note-tab-${notes[0].slug}`)?.focus();
                  selectNote(0);
                }

                if (event.key === "End") {
                  event.preventDefault();
                  const lastIndex = notes.length - 1;
                  document.getElementById(`home-note-tab-${notes[lastIndex].slug}`)?.focus();
                  selectNote(lastIndex);
                }
              }}
              role="tab"
              aria-selected={isActive}
              aria-controls="home-note-preview-panel"
              tabIndex={isActive ? 0 : -1}
              className={`home-note-button${isActive ? " is-active" : ""}`}
            >
              <span className="home-note-row-icon" aria-hidden="true">
                <NoteIcon size={18} />
              </span>
              <span className="home-note-row-copy">
                <span className="home-note-row-title">
                  <strong>{t(note.title)}</strong>
                  <span className="home-note-row-tag">{t(note.categoryLabel)}</span>
                </span>
                <span>{t(note.summary)}</span>
              </span>
              <time dateTime={note.date}>{t(note.dateLabel)}</time>
            </button>
          );
        })}
      </div>

      <div
        id="home-note-preview-panel"
        className="panel home-note-preview"
        role="tabpanel"
        aria-labelledby={`home-note-tab-${activeNote.slug}`}
      >
        <div>
          <div className="home-note-preview-head">
            <span className="home-note-feed-label">
              <Radio size={14} aria-hidden />
              {t("research feed")}
            </span>
            <span className="home-note-pulse">
              {t(pulses[active % pulses.length])}
            </span>
          </div>
          <NotebookPen className="mt-8 text-[#f4b740]" size={28} aria-hidden />
          <h3 className="mt-4 text-2xl font-semibold text-slate-950">{t(activeNote.title)}</h3>
          <p className="mt-4 text-sm leading-6 text-slate-600">{t(activeNote.summary)}</p>
        </div>
        <Link
          href="/lab"
          className="link-focus home-note-action"
        >
          {t("Open notes")}
          <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
    </div>
  );
}
