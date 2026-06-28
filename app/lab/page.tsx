import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FilePenLine, Globe2, LockKeyhole, ShieldCheck } from "lucide-react";
import { LabNotesBrowser } from "@/components/LabNotesBrowser";
import { SiteChrome } from "@/components/SiteChrome";
import { getNotes } from "@/lib/content";

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
  ["Public by design", "Share what's safe. Protect what's not."],
  ["Evidence first", "Show the why, the how, and the limits."],
  ["Linked to work", "Every note connects to projects and artifacts."]
];

const protocolSteps = [
  ["Draft privately", "Capture raw ideas and evidence."],
  ["Rewrite safely", "Remove sensitive details and reduce to principles."],
  ["Publish public note", "Share summaries, sketches, and lessons."],
  ["Link artifact", "Connect to projects, datasets, and code."]
];

export default function LabPage() {
  const notes = getNotes();
  const latestNote = notes[0];

  return (
    <SiteChrome headerVariant="doraemon" headerActiveHref="/lab">
      <section className="lab-hero">
        <div className="container lab-hero-grid">
          <div className="lab-hero-copy">
            <h1>Research notes.</h1>
            <p>
              Public experiments, system sketches, design decisions, and research fragments from Weiyu&apos;s personal
              research studio. Public by design.
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
            <div className="lab-signal-row" aria-label="Research principles">
              {labSignals.map(([title, summary]) => (
                <div key={title} className="lab-signal-card">
                  <ShieldCheck size={18} aria-hidden />
                  <strong>{title}</strong>
                  <span>{summary}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lab-surface-visual" aria-label="Public research surface sketch">
            <div className="lab-surface-sheet">
              <p>RESEARCH SURFACE</p>
              {[
                ["01", "Observe", "Watch, collect, and question."],
                ["02", "Build", "Prototype, test, and document."],
                ["03", "Review", "Reflect, decide, and refine."]
              ].map(([number, title, summary]) => (
                <div key={number} className="lab-surface-step">
                  <strong>{number}</strong>
                  <span>
                    <span className="lab-surface-step-title">{title}</span>
                    <small>{summary}</small>
                  </span>
                  <span className="lab-surface-step-mark" aria-hidden />
                </div>
              ))}
            </div>
            <div className="lab-floating-card lab-floating-card-chart" aria-hidden>
              <span />
            </div>
            <div className="lab-floating-card lab-floating-card-network" aria-hidden>
              <span />
            </div>
            <div className="lab-private-boundary">
              <LockKeyhole size={15} aria-hidden />
              Private boundary
            </div>
          </div>
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
              <h2>Research protocol</h2>
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
                We publish what is safe, useful, and durable. The rest stays private by default.
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
              <h2>This is living research.</h2>
              <p>New notes land when experiments evolve. Follow along, learn from the process, and build with care.</p>
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
