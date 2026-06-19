"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, NotebookPen, Radio } from "lucide-react";
import type { Note } from "@/lib/content";

const pulses = ["drafting", "annotating", "connecting", "publishing"];

export function LiveNotesFeed({ notes }: { notes: Note[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (notes.length <= 1) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % notes.length);
    }, 3600);

    return () => window.clearInterval(timer);
  }, [notes.length]);

  const activeNote = notes[active] ?? notes[0];

  if (!activeNote) {
    return null;
  }

  return (
    <div className="home-notes-feed">
      <div className="home-notes-list">
        {notes.map((note, index) => {
          const isActive = index === active;
          return (
            <button
              key={note.slug}
              type="button"
              onClick={() => setActive(index)}
              className={`home-note-button${isActive ? " is-active" : ""}`}
            >
              <p className="mono text-xs text-slate-500">{note.dateLabel}</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-950">{note.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{note.summary}</p>
            </button>
          );
        })}
      </div>

      <div className="panel home-note-preview">
        <div>
          <div className="home-note-preview-head">
            <span className="home-note-feed-label">
              <Radio size={14} aria-hidden />
              research feed
            </span>
            <span className="home-note-pulse">
              {pulses[active % pulses.length]}
            </span>
          </div>
          <NotebookPen className="mt-8 text-[#f4b740]" size={28} aria-hidden />
          <h3 className="mt-4 text-2xl font-semibold text-slate-950">{activeNote.title}</h3>
          <p className="mt-4 text-sm leading-6 text-slate-600">{activeNote.summary}</p>
        </div>
        <Link
          href="/lab"
          className="link-focus home-note-action"
        >
          Open notes
          <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
    </div>
  );
}
