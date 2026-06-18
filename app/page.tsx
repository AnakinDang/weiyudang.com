import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Contact,
  Globe2,
  LineChart,
  LockKeyhole,
  MonitorPlay,
  ShieldCheck,
  Sparkles,
  UserRound
} from "lucide-react";
import { AiLabPanel } from "@/components/AiLabPanel";
import { HeroSection } from "@/components/HeroSection";
import { JournalCard } from "@/components/JournalCard";
import { LiveNotesFeed } from "@/components/LiveNotesFeed";
import { ProjectExplorer } from "@/components/ProjectExplorer";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteChrome } from "@/components/SiteChrome";
import { getLatestJournalEntries, getLatestNotes, getProjects } from "@/lib/content";

const operatingLayers = [
  {
    title: "Public studio",
    summary: "Projects, research notes, journal entries, and contact paths that explain the work without private internals.",
    boundary: "public",
    boundaryLabel: "Public",
    safety: "Safe to share",
    actionLabel: "Visit studio",
    href: "/projects",
    icon: UserRound
  },
  {
    title: "Doraemon Office",
    summary: "A public command-room view for Doraemon, MiniDoras, activity, schedules, and system heartbeat.",
    boundary: "public-safe",
    boundaryLabel: "Public safe",
    safety: "Sanitized read-only",
    actionLabel: "Open Doraemon",
    href: "/dora",
    icon: MonitorPlay
  },
  {
    title: "Owner cockpit",
    summary: "The private daily surface for priorities, commands, review queues, schedules, and knowledge work.",
    boundary: "owner-only",
    boundaryLabel: "Owner only",
    safety: "Authenticated",
    actionLabel: "Open cockpit",
    href: "/app",
    icon: LockKeyhole
  },
  {
    title: "Trading team",
    summary: "MiniDora research desks for signals, instruments, evidence, gates, and replay without execution.",
    boundary: "research-only",
    boundaryLabel: "Research only",
    safety: "Not execution",
    actionLabel: "View research",
    href: "/projects/minidora-trading",
    icon: LineChart
  }
];

const operatingPrinciples = [
  {
    title: "Weiyu stays in the loop",
    summary: "Final authority.",
    icon: ShieldCheck
  },
  {
    title: "Agents are teammates",
    summary: "Not replacements.",
    icon: Bot
  },
  {
    title: "Evidence over claims",
    summary: "Always show sources.",
    icon: Sparkles
  },
  {
    title: "Boundaries by design",
    summary: "Public, private, and research-only.",
    icon: Globe2
  }
];

export default function HomePage() {
  const projects = getProjects();
  const notes = getLatestNotes(3);
  const journalEntries = getLatestJournalEntries(3);

  return (
    <SiteChrome headerVariant="doraemon" headerActiveHref="/">
      <HeroSection />

      <section id="os-layers" className="home-section home-os-section">
        <div className="container home-section-frame">
          <div className="home-section-heading home-section-heading-split">
            <div>
              <p className="eyebrow">Personal OS layers</p>
              <h2 className="section-title">One OS. Four connected surfaces.</h2>
            </div>
            <p className="section-summary">
              The public site explains the work. Doraemon makes the office visible. The private cockpit drives execution.
              Trading stays research-only.
            </p>
          </div>

          <div className="home-layer-system" aria-label="Weiyu Personal OS connected surfaces">
            <div className="home-layer-rail" aria-hidden="true" />
            {operatingLayers.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link key={item.title} href={item.href} className="link-focus home-layer-row">
                  <span className={`home-layer-marker home-layer-marker-${index + 1}`} aria-hidden="true" />
                  <span className="home-layer-icon">
                    <Icon size={24} aria-hidden />
                  </span>
                  <span className="home-layer-copy">
                    <strong>{item.title}</strong>
                    <span>{item.summary}</span>
                  </span>
                  <span className="home-layer-action">
                    {item.actionLabel}
                    <ArrowRight size={16} aria-hidden />
                  </span>
                  <span className={`home-boundary-badge home-boundary-${item.boundary.replace(" ", "-")}`}>
                    <strong>{item.boundaryLabel}</strong>
                    <small>{item.safety}</small>
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="home-principle-strip">
            {operatingPrinciples.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="home-principle-item">
                  <Icon size={17} aria-hidden />
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.summary}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="home-section home-project-section">
        <div className="container home-section-frame">
          <div className="home-section-heading home-section-heading-split">
            <div>
              <p className="eyebrow">Selected work</p>
              <h2 className="section-title">Projects as personal artifacts.</h2>
            </div>
            <p className="section-summary">
              A living index of systems, tools, experiments, and research. Public pages explain the work; private execution
              stays behind the app shell.
            </p>
            <Link
              href="/projects"
              className="link-focus home-outline-action"
            >
              All projects
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
          <ProjectExplorer projects={projects.slice(0, 5)} />
        </div>
      </section>

      <section id="doraemon-system" className="home-section home-ai-section">
        <div className="container home-ai-grid">
          <div className="home-ai-copy">
            <p className="eyebrow">Doraemon system</p>
            <h2 className="section-title">Doraemon, MiniDoras, and Weiyu AI.</h2>
            <p className="section-summary">
              One system. Multiple agents. Clear public/private boundaries. The system should support Weiyu&apos;s judgment,
              taste, and review instead of replacing them.
            </p>
            <div className="home-ai-actions">
              <Link
                href="/dora"
                className="link-focus home-primary-action"
              >
                <Bot size={17} aria-hidden />
                Meet Doraemon
              </Link>
              <Link
                href="/projects/weiyu-ai"
                className="link-focus home-text-action"
              >
                <Sparkles size={17} aria-hidden />
                Weiyu AI
              </Link>
              <Link
                href="/app"
                className="link-focus home-text-action home-private-action"
              >
                <LockKeyhole size={17} aria-hidden />
                Owner area
              </Link>
            </div>
          </div>
          <AiLabPanel />
        </div>
      </section>

      <section className="home-section home-journal-section">
        <div className="container home-section-frame home-section-frame-quiet">
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

      <section className="home-section home-notes-section">
        <div className="container grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeading
              eyebrow="Latest notes"
              title="Short notes from the research studio."
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
