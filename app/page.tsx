import Link from "next/link";
import { ArrowRight, Bot, Brain, Contact, FlaskConical, Network, UserRoundCheck } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteChrome } from "@/components/SiteChrome";
import { Timeline } from "@/components/Timeline";
import { getLatestNotes, getProjects } from "@/lib/content";
import { companyModel } from "@/lib/mock";

const modelIcons = [UserRoundCheck, Network, Brain];

export default function HomePage() {
  const projects = getProjects();
  const notes = getLatestNotes(3);

  return (
    <SiteChrome>
      <HeroSection />

      <section className="section bg-[#101827]">
        <div className="container">
          <SectionHeading
            eyebrow="AI one-person company"
            title="A human-led operating model with agent-scale execution."
            summary="Weiyu sets direction and taste. Doraemon coordinates the work. MiniDora agents turn plans into research, code, media, and evidence artifacts."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {companyModel.map((item, index) => {
              const Icon = modelIcons[index];
              return (
                <article key={item.title} className="panel p-5">
                  <span className="flex size-11 items-center justify-center rounded-[8px] border border-sky-200/24 bg-sky-300/10 text-sky-100">
                    <Icon size={22} aria-hidden />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{item.summary}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Project portals"
              title="Public index for the systems being built."
              summary="The public pages explain the operating model and project boundaries. Private execution surfaces stay behind the app shell."
            />
            <Link
              href="/projects"
              className="link-focus inline-flex w-fit items-center gap-2 rounded-[8px] border border-sky-200/30 px-4 py-3 text-sm font-bold text-sky-50 transition hover:bg-sky-300/10"
            >
              All projects
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.slice(0, 5).map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-[#101827]">
        <div className="container grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Studio preview"
              title="A command room for plans, artifacts, and review."
              summary="The first internal surface is event-driven. Visual state should come from real task events, not hand-waved animation."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/app/command"
                className="link-focus inline-flex items-center gap-2 rounded-[8px] bg-yellow-300 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-yellow-200"
              >
                <Bot size={17} aria-hidden />
                Command Center
              </Link>
              <Link
                href="/dora"
                className="link-focus inline-flex items-center gap-2 rounded-[8px] border border-sky-200/30 px-4 py-3 text-sm font-bold text-sky-50 transition hover:bg-sky-300/10"
              >
                Public Dora
              </Link>
            </div>
          </div>
          <div className="panel p-5">
            <Timeline compact />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeading
              eyebrow="Latest notes"
              title="Lab notes from a growing operating system."
              summary="Short public notes will document the evolution of the website, agent system, trading research desk, and creative workflows."
            />
            <div className="mt-8 grid gap-4">
              {notes.map((note) => (
                <Link key={note.slug} href="/lab" className="link-focus panel-quiet block p-5 transition hover:border-sky-300/40">
                  <p className="mono text-xs text-slate-500">{note.date}</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">{note.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{note.summary}</p>
                </Link>
              ))}
            </div>
          </div>
          <div className="panel flex flex-col justify-between p-6">
            <div>
              <Contact className="text-yellow-100" size={28} aria-hidden />
              <h2 className="mt-4 text-3xl font-semibold text-white">Interested in agents, one-person companies, or creative systems?</h2>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                The public site is the entry point. The private app is the command center. Collaboration starts with a focused conversation.
              </p>
            </div>
            <Link
              href="/contact"
              className="link-focus mt-8 inline-flex w-fit items-center gap-2 rounded-[8px] bg-sky-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-300"
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
