import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  FilePenLine,
  FlaskConical,
  Globe2,
  Layers3,
  LockKeyhole,
  Radar,
  ShieldCheck
} from "lucide-react";
import { LabNotesBrowser } from "@/components/LabNotesBrowser";
import { SiteChrome } from "@/components/SiteChrome";
import { getNotes } from "@/lib/content";
import { labCategories } from "@/lib/content-model";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Public research notes, system sketches, design decisions, and experiments from Weiyu Dang's personal research studio.",
  alternates: {
    canonical: "/lab"
  },
  openGraph: {
    title: "Research",
    description:
      "Public research notes, system sketches, design decisions, and experiments from Weiyu Dang's personal research studio.",
    url: "/lab",
    type: "website"
  }
};

const labSignals = [
  ["Public by design", "Share what's safe. Protect what's not.", ShieldCheck],
  ["Evidence first", "Show the why, the how, and the limits.", BookOpenCheck],
  ["Linked to work", "Every note connects to projects and artifacts.", Layers3]
] as const;

const protocolSteps = [
  ["Capture privately", "Raw notes, prompts, and source material stay inside the private vault."],
  ["Distill safely", "Turn the useful idea into a principle, method, or public sketch."],
  ["Attach evidence", "Link only public artifacts, screenshots, project pages, or durable summaries."],
  ["Publish with boundary", "Keep the note useful without exposing accounts, paths, raw logs, or controls."]
] as const;

export default function LabPage() {
  const notes = getNotes();
  const latestNote = notes[0];
  const featuredNote = notes.find((note) => note.featured) ?? latestNote;
  const researchLaneCount = Object.keys(labCategories).length;

  return (
    <SiteChrome headerVariant="doraemon" headerActiveHref="/lab">
      <section className="lab-hero">
        <div className="container lab-hero-grid">
          <div className="lab-hero-copy">
            <p className="lab-kicker">Public research studio</p>
            <h1>Research that can be inspected.</h1>
            <p>
              A public notebook for system sketches, design decisions, build logs, and research fragments around the
              Personal OS. It shows the method and the evidence without exposing the private operating layer.
            </p>
            <div className="lab-hero-actions">
              <Link href={latestNote ? `/lab/${latestNote.slug}` : "#lab-notes"} className="link-focus lab-hero-primary">
                Read the latest note
                <ArrowRight size={16} aria-hidden />
              </Link>
              <Link href="/projects" className="link-focus lab-hero-secondary">
                Browse projects
                <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
            <div className="lab-hero-metrics" aria-label="Research studio summary">
              <span>
                <strong>{notes.length}</strong>
                <small>public notes</small>
              </span>
              <span>
                <strong>{researchLaneCount}</strong>
                <small>research lanes</small>
              </span>
              <span>
                <strong>0</strong>
                <small>execution controls</small>
              </span>
            </div>
            <div className="lab-signal-row" aria-label="Research principles">
              {labSignals.map(([title, summary, Icon]) => (
                <div key={title} className="lab-signal-card">
                  <Icon size={18} aria-hidden />
                  <strong>{title}</strong>
                  <span>{summary}</span>
                </div>
              ))}
            </div>
          </div>

          <aside className="lab-studio-visual" aria-label="Public research studio preview">
            <div className="lab-studio-image-frame">
              <Image
                src="/visuals/personal-os-portal-v2.png"
                alt="A bright research desk with an open notebook, a Doraemon Office portal, and public-safe research system visuals."
                width={1680}
                height={945}
                quality={92}
                sizes="(min-width: 1080px) 52vw, 100vw"
                className="lab-studio-image"
              />
              <div className="lab-studio-card">
                <span>Featured note</span>
                <strong>{featuredNote?.title ?? "Public research studio"}</strong>
                <small>{featuredNote?.summary ?? "Public summaries, evidence, and design decisions."}</small>
              </div>
            </div>
            <div className="lab-studio-route-strip" aria-label="Research studio route map">
              <span>
                <Radar size={15} aria-hidden />
                Observe
              </span>
              <span>
                <FlaskConical size={15} aria-hidden />
                Experiment
              </span>
              <span>
                <ShieldCheck size={15} aria-hidden />
                Publish safely
              </span>
            </div>
            <div className="lab-studio-boundary" role="note" aria-label="Research safety boundary">
              <LockKeyhole size={16} aria-hidden />
              <span>Private vault stays private. Public notes carry only curated evidence.</span>
            </div>
          </aside>
        </div>
      </section>

      <section id="lab-notes" className="lab-notes-section">
        <div className="container">
          <LabNotesBrowser notes={notes} />
        </div>
      </section>

      <section className="lab-protocol-section">
        <div className="container">
          <div className="lab-protocol-grid">
            <div>
              <p className="lab-kicker">Publishing protocol</p>
              <h2>From private signal to public artifact.</h2>
              <div className="lab-protocol-steps" aria-label="Public publishing protocol">
                {protocolSteps.map(([title, summary], index) => (
                  <div key={title} className="lab-protocol-step">
                    <span>{index + 1}</span>
                    <FilePenLine size={20} aria-hidden />
                    <strong>{title}</strong>
                    <small>{summary}</small>
                  </div>
                ))}
              </div>
            </div>

            <div className="lab-boundary-panel">
              <div className="lab-boundary-column">
                <h3>
                  <Globe2 size={22} aria-hidden />
                  Public Research
                  <span>Public</span>
                </h3>
                {["Curated summaries", "Design sketches", "Concepts and methods", "Project links"].map((item) => (
                  <p key={item}>
                    <CheckCircle2 size={16} aria-hidden />
                    {item}
                  </p>
                ))}
              </div>
              <div className="lab-boundary-lock" aria-hidden>
                <LockKeyhole size={24} />
              </div>
              <div className="lab-boundary-column is-private">
                <h3>
                  <LockKeyhole size={22} aria-hidden />
                  Private Vault
                  <span>Private</span>
                </h3>
                {["Raw notes and drafts", "Prompts and credentials", "Internal runtime and logs", "Account and system state"].map((item) => (
                  <p key={item}>
                    <span aria-hidden>×</span>
                    {item}
                  </p>
                ))}
              </div>
              <div className="lab-boundary-note">
                We publish what is safe, useful, and durable. Raw prompts, private source notes, credentials, accounts,
                runtime identifiers, and execution controls stay private by default.
              </div>
            </div>
          </div>

          <div className="lab-living-note">
            <div className="lab-living-orbit" aria-hidden>
              <span />
              <span />
              <span />
            </div>
            <div>
              <h2>This is a living research shelf.</h2>
              <p>
                New notes land when experiments evolve. The point is not volume; it is a durable trail of decisions,
                evidence, and useful boundaries.
              </p>
            </div>
            <Link href={latestNote ? `/lab/${latestNote.slug}` : "#lab-notes"} className="link-focus">
              Read the latest note
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
