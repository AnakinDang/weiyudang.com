import Link from "next/link";
import { ArrowRight, Atom, Bot, BrainCircuit, Contact, LineChart, LockKeyhole, Sparkles, Workflow } from "lucide-react";
import { AiLabPanel } from "@/components/AiLabPanel";
import { HeroSection } from "@/components/HeroSection";
import { JournalCard } from "@/components/JournalCard";
import { LiveNotesFeed } from "@/components/LiveNotesFeed";
import { ProjectExplorer } from "@/components/ProjectExplorer";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteChrome } from "@/components/SiteChrome";
import { getLatestJournalEntries, getLatestNotes, getProjects } from "@/lib/content";

const snapshot = [
  {
    title: "Physics",
    summary: "Questions about the physical world, mathematical structure, and how ideas become intuition.",
    icon: Atom
  },
  {
    title: "Quantum Computing",
    summary: "Learning the language of quantum systems while tracing what useful computation may become.",
    icon: BrainCircuit
  },
  {
    title: "AI Systems",
    summary: "Personal agents, workflow tools, and interfaces that keep human judgment in the loop.",
    icon: Workflow
  },
  {
    title: "Trading Research",
    summary: "Evidence-first market notes, paper research, and decision support instead of live execution.",
    icon: LineChart
  }
];

export default function HomePage() {
  const projects = getProjects();
  const notes = getLatestNotes(3);
  const journalEntries = getLatestJournalEntries(3);

  return (
    <SiteChrome>
      <HeroSection />

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Personal snapshot"
            title="A small research studio around physics, AI, and creative tools."
            summary="The site starts with Weiyu as the center of gravity. Projects, notes, and AI systems are organized as extensions of that curiosity."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {snapshot.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="panel p-5">
                  <span className="flex size-11 items-center justify-center rounded-[8px] border border-[#bfdbfe] bg-[#e0f2fe] text-[#2563eb]">
                    <Icon size={22} aria-hidden />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.summary}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section soft-band">
        <div className="container">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Selected work"
              title="Projects as personal artifacts, not a company brochure."
              summary="A public index for experiments in AI systems, creative workflows, web tools, and research surfaces. Private execution stays behind the app shell."
            />
            <Link
              href="/projects"
              className="link-focus inline-flex w-fit items-center gap-2 rounded-[8px] border border-[#bfdbfe] bg-white px-4 py-3 text-sm font-bold text-[#1d4ed8] transition hover:bg-[#f1f7fb]"
            >
              All projects
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
          <ProjectExplorer projects={projects.slice(0, 5)} />
        </div>
      </section>

      <section id="ai-lab" className="section">
        <div className="container grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="AI Lab"
              title="Dora, MiniDora, and Weiyu AI stay as one focused entrance."
              summary="The Dora and MiniDora idea is still here, but as a lab within the personal site. The pure company narrative can move to weiyudang.ai later."
            />
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
              Dora is the public companion for explaining projects. MiniDora is the working metaphor for small specialist
              agents. Both should support Weiyu's judgment, taste, and review instead of replacing them.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/dora"
                className="link-focus inline-flex items-center gap-2 rounded-[8px] bg-[#2563eb] px-4 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(37,99,235,0.2)] transition hover:bg-[#1d4ed8]"
              >
                <Bot size={17} aria-hidden />
                Meet Dora
              </Link>
              <Link
                href="/projects/weiyu-ai"
                className="link-focus inline-flex items-center gap-2 rounded-[8px] border border-[#dde7f0] bg-white px-4 py-3 text-sm font-bold text-slate-800 transition hover:border-[#bfdbfe] hover:bg-[#f1f7fb]"
              >
                <Sparkles size={17} aria-hidden />
                Weiyu AI
              </Link>
              <Link
                href="/app"
                className="link-focus inline-flex items-center gap-2 rounded-[8px] border border-[#f4b740]/45 bg-[#fff8e5] px-4 py-3 text-sm font-bold text-slate-900 transition hover:bg-[#fff2c7]"
              >
                <LockKeyhole size={17} aria-hidden />
                Private App
              </Link>
            </div>
          </div>
          <AiLabPanel />
        </div>
      </section>

      <section className="section soft-band">
        <div className="container">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Journal"
              title="Photography, life notes, and field observations."
              summary="A softer shelf for the life around the technical work: pictures, places, routines, and personal fragments."
            />
            <Link
              href="/journal"
              className="link-focus inline-flex w-fit items-center gap-2 rounded-[8px] border border-[#bfdbfe] bg-white px-4 py-3 text-sm font-bold text-[#1d4ed8] transition hover:bg-[#f1f7fb]"
            >
              Open journal
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {journalEntries.map((entry) => (
              <JournalCard key={entry.slug} entry={entry} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeading
              eyebrow="Latest notes"
              title="Short notes from the personal lab."
              summary="A light shelf for experiments, architecture decisions, research fragments, and the evolution of the website."
            />
            <LiveNotesFeed notes={notes} />
          </div>
          <div className="panel flex flex-col justify-between p-6">
            <div>
              <Contact className="text-[#f4b740]" size={28} aria-hidden />
              <h2 className="mt-4 text-3xl font-semibold text-slate-950">Notes, projects, or a focused conversation.</h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                This site is a personal home base. Collaboration can start small: a research question, an interface idea,
                or a workflow that deserves a better tool.
              </p>
            </div>
            <Link
              href="/contact"
              className="link-focus mt-8 inline-flex w-fit items-center gap-2 rounded-[8px] bg-[#2563eb] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#1d4ed8]"
            >
              Contact Weiyu
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
