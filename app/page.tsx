import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Contact,
  Globe2,
  LineChart,
  LockKeyhole,
  MonitorPlay,
  Network,
  ShieldCheck,
  Sparkles,
  UserRound
} from "lucide-react";
import { AiLabPanel } from "@/components/AiLabPanel";
import { HeroSection } from "@/components/HeroSection";
import { JournalCard } from "@/components/JournalCard";
import { LiveNotesFeed } from "@/components/LiveNotesFeed";
import { SectionHeading } from "@/components/SectionHeading";
import { SelectedWorkShowcase } from "@/components/SelectedWorkShowcase";
import { SiteChrome } from "@/components/SiteChrome";
import { getLatestJournalEntries, getLatestNotes, getProjects } from "@/lib/content";

const operatingLayers = [
  {
    title: "Public studio",
    summary: "Projects, research notes, journal entries, and contact paths that explain the work.",
    boundary: "public",
    boundaryLabel: "Public",
    safety: "Safe to share",
    actionLabel: "Visit studio",
    href: "/projects",
    icon: UserRound
  },
  {
    title: "Doraemon Office",
    summary: "A sanitized room for Doraemon, MiniDoras, activity, schedules, and system heartbeat.",
    boundary: "public-safe",
    boundaryLabel: "Public-safe",
    safety: "Sanitized read-only",
    actionLabel: "Open Doraemon",
    href: "/dora",
    icon: MonitorPlay
  },
  {
    title: "Owner Cockpit",
    summary: "The private daily surface for priorities, approvals, schedules, and knowledge work.",
    boundary: "owner-only",
    boundaryLabel: "Owner-only",
    safety: "Authenticated",
    actionLabel: "Open cockpit",
    href: "/app",
    icon: LockKeyhole
  },
  {
    title: "Research desk",
    summary: "Public-safe lab notes and evidence-first research context, including MiniDora trading work without execution.",
    boundary: "research-only",
    boundaryLabel: "Research-only",
    safety: "Public notes",
    actionLabel: "Open research",
    href: "/lab",
    icon: LineChart
  }
];

const operatingPrinciples = [
  {
    title: "Weiyu stays in control",
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
    summary: "Public, private, research.",
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
        <div className="container home-os-frame">
          <div className="home-os-heading">
            <div>
              <h2 className="section-title">One operating system. Four clear surfaces.</h2>
            </div>
            <p className="section-summary">
              The public site explains the work. Doraemon Office makes agent activity visible. The owner cockpit stays
              private. Research stays public-safe, evidence-first, and execution-free.
            </p>
          </div>

          <div className="home-os-constellation" role="group" aria-label="Weiyu Personal OS connected surfaces">
            <div className="home-os-core" role="group" aria-label="Personal OS center">
              <span className="home-os-core-mark" aria-hidden="true">Wy</span>
              <strong>Personal OS</strong>
              <span className="home-os-core-owner">Weiyu Dang</span>
            </div>
            <div className="home-os-orbit-icons" aria-hidden="true">
              <span><UserRound size={20} /></span>
              <span><MonitorPlay size={20} /></span>
              <span><LockKeyhole size={20} /></span>
              <span><LineChart size={20} /></span>
            </div>
            {operatingLayers.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  prefetch={item.href.startsWith("/app") ? false : undefined}
                  className={`link-focus home-os-surface home-os-surface-${index + 1} home-os-boundary-${item.boundary}`}
                >
                  <span className="home-os-surface-icon">
                    <Icon size={25} aria-hidden />
                  </span>
                  <span className="home-os-surface-copy">
                    <strong>{item.title}</strong>
                    <span>{item.summary}</span>
                  </span>
                  <span className="home-os-surface-footer">
                    <span className="home-os-boundary-label">
                      <span aria-hidden="true" />
                      {item.boundaryLabel}
                    </span>
                    <span className="home-os-surface-action">
                      {item.actionLabel}
                      <ArrowRight size={15} aria-hidden />
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="home-os-principle-strip">
            {operatingPrinciples.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="home-os-principle-item">
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
        <div className="container home-project-showroom">
          <div className="home-section-heading home-section-heading-split">
            <div className="home-project-heading-copy">
              <h2 className="section-title">Selected systems</h2>
            </div>
            <p className="section-summary">
              A few systems and artifacts from the studio. Public pages explain the work; private execution stays behind
              the app shell.
            </p>
            <Link
              href="/projects"
              className="link-focus home-outline-action"
            >
              All projects
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
          <SelectedWorkShowcase projects={projects} />
        </div>
      </section>

      <section id="doraemon-system" className="home-section home-ai-section">
        <div className="container home-ai-grid">
          <div className="home-ai-copy">
            <p className="eyebrow">Public command room</p>
            <h2 className="section-title">Doraemon Office</h2>
            <p className="section-summary">
              The public window into Weiyu&apos;s personal AI command room. Doraemon coordinates MiniDoras across research,
              writing, data, product, and operations; private work stays behind the owner cockpit.
            </p>
            <div className="home-ai-actions">
              <Link
                href="/dora/office"
                className="link-focus home-primary-action"
              >
                <Bot size={17} aria-hidden />
                Enter Doraemon Office
              </Link>
              <Link
                href="/dora/team"
                className="link-focus home-text-action"
              >
                <Network size={17} aria-hidden />
                Meet the MiniDoras
              </Link>
              <Link
                href="/app"
                prefetch={false}
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
          <div className="home-journal-head">
            <SectionHeading
              eyebrow="Journal"
              title="Photography, life notes, and field observations."
              summary="A softer shelf for the life around the technical work: pictures, places, routines, and personal fragments."
            />
            <Link
              href="/journal"
              className="link-focus home-journal-action"
            >
              Open journal
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
          <div className="home-journal-grid">
            {journalEntries.map((entry) => (
              <JournalCard key={entry.slug} entry={entry} />
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-notes-section">
        <div className="container home-notes-grid">
          <div>
            <SectionHeading
              eyebrow="Latest notes"
              title="Thoughts, research, and updates from the desk."
              summary="A light shelf for experiments, architecture decisions, research fragments, and the evolution of the Personal OS."
            />
            <LiveNotesFeed notes={notes} />
          </div>
          <div className="panel home-contact-panel">
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
              className="link-focus home-contact-action"
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
