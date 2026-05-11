import type { Metadata } from "next";
import { FlaskConical } from "lucide-react";
import { MarkdownBody } from "@/components/MarkdownBody";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteChrome } from "@/components/SiteChrome";
import { getNotes } from "@/lib/content";

export const metadata: Metadata = {
  title: "Lab Notes",
  description: "Public lab notes about Weiyu AI, Doraemon Agent System, and creative workflows."
};

export default function LabPage() {
  const notes = getNotes();

  return (
    <SiteChrome>
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Lab notes"
            title="Public notes from the operating system build."
            summary="A lightweight content shelf for experiments, architecture notes, and system-building decisions."
          />
          <div className="mt-10 grid gap-5">
            {notes.map((note) => (
              <article key={note.slug} className="panel p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-[8px] border border-sky-200/24 bg-sky-300/10 text-sky-100">
                    <FlaskConical size={20} aria-hidden />
                  </span>
                  <div>
                    <p className="mono text-xs text-slate-500">{note.date}</p>
                    <h2 className="text-2xl font-semibold text-white">{note.title}</h2>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-300">{note.summary}</p>
                <MarkdownBody body={note.body} />
              </article>
            ))}
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
