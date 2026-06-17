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
    <div className="mt-8 grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="grid gap-3">
        {notes.map((note, index) => {
          const isActive = index === active;
          return (
            <button
              key={note.slug}
              type="button"
              onClick={() => setActive(index)}
              className={`text-left transition ${
                isActive ? "panel p-5" : "panel-quiet p-5 hover:border-[#bfdbfe] hover:bg-white/80"
              }`}
            >
              <p className="mono text-xs text-slate-500">{note.date}</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-950">{note.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{note.summary}</p>
            </button>
          );
        })}
      </div>

      <div className="panel flex min-h-72 flex-col justify-between p-5">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-[#bfdbfe] bg-[#e0f2fe] px-3 py-2 text-xs font-bold text-[#1d4ed8]">
              <Radio size={14} aria-hidden />
              lab feed
            </span>
            <span className="rounded-[8px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800">
              {pulses[active % pulses.length]}
            </span>
          </div>
          <NotebookPen className="mt-8 text-[#f4b740]" size={28} aria-hidden />
          <h3 className="mt-4 text-2xl font-semibold text-slate-950">{activeNote.title}</h3>
          <p className="mt-4 text-sm leading-6 text-slate-600">{activeNote.summary}</p>
        </div>
        <Link
          href="/lab"
          className="link-focus mt-8 inline-flex w-fit items-center gap-2 rounded-[8px] border border-[#dde7f0] bg-white px-4 py-3 text-sm font-bold text-slate-800 transition hover:border-[#bfdbfe] hover:bg-[#f1f7fb]"
        >
          Open notes
          <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
    </div>
  );
}
