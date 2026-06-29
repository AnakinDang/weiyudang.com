import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  FlaskConical,
  LockKeyhole,
  MapPin,
  NotebookPen,
  ShieldCheck
} from "lucide-react";
import { JournalCard } from "@/components/JournalCard";
import { SiteChrome } from "@/components/SiteChrome";
import { getJournalEntries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Journal",
  description: "Photography, life notes, and personal field observations from Weiyu Dang.",
  alternates: {
    canonical: "/journal"
  },
  openGraph: {
    title: "Journal",
    description: "Photography, life notes, and personal field observations from Weiyu Dang.",
    url: "/journal",
    type: "website",
    images: [
      {
        url: "/visuals/journal-triptych.png",
        alt: "Photography and life journal triptych."
      }
    ]
  }
};

const journalPillars = [
  { title: "Photography", summary: "Frames, light, texture, and visual memory.", icon: Camera },
  { title: "Life Notes", summary: "Small personal updates without turning the site into a feed.", icon: NotebookPen },
  { title: "Places", summary: "Travel fragments, daily walks, and field observations.", icon: MapPin }
];

const journalBoundary = [
  {
    title: "Public Journal",
    summary: "Photos, places, observations, and personal notes that are safe to share.",
    icon: Camera
  },
  {
    title: "Research Lab",
    summary: "Experiments and system notes stay structured in the research surface.",
    icon: FlaskConical
  },
  {
    title: "Private Work",
    summary: "Owner tasks, prompts, raw memory, and private operations stay out of public entries.",
    icon: LockKeyhole
  }
];

export default function JournalPage() {
  const entries = getJournalEntries();
  const [featured, ...rest] = entries;

  return (
    <SiteChrome headerVariant="doraemon" headerActiveHref="/journal">
      <section className="journal-index-hero">
        <div className="container journal-index-hero-grid">
          <div className="journal-index-copy">
            <h1>Journal as a second notebook.</h1>
            <p>
              Photography, places, routines, and field observations around the Personal OS.
              Less operational than the lab, still part of the work.
            </p>
            <div className="journal-index-actions">
              <Link href={featured ? `/journal/${featured.slug}` : "#journal-entries"} className="link-focus journal-index-primary">
                Read the latest entry
                <ArrowRight size={16} aria-hidden />
              </Link>
              <Link href="/lab" className="link-focus journal-index-secondary">
                Open research notes
                <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
            <div className="journal-index-status" aria-label="Journal public boundary">
              <span>
                <ShieldCheck size={15} aria-hidden />
                Public and personal
              </span>
              <span>
                <LockKeyhole size={15} aria-hidden />
                No owner operations
              </span>
            </div>
          </div>

          <div className="journal-index-visual" aria-label="Journal visual surface">
            <div className="journal-index-image-frame">
              <Image
                src="/visuals/journal-triptych.png"
                alt="Photography and life journal triptych with camera, city walk, and travel desk scenes."
                width={1536}
                height={768}
                priority
                loading="eager"
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="journal-index-image"
              />
              <div className="journal-index-image-caption">
                <span>Public journal</span>
                <strong>
                  <span>{entries.length}</span> public journal entries
                </strong>
                <small>Photography, life notes, places</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="journal-index-section">
        <div className="container">
          <div className="journal-index-lanes" aria-label="Journal lanes">
            {journalPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div key={pillar.title} className="journal-index-lane">
                  <Icon size={24} aria-hidden />
                  <h2>{pillar.title}</h2>
                  <p>{pillar.summary}</p>
                </div>
              );
            })}
          </div>

          <div className="journal-index-boundary" aria-label="Journal and Personal OS boundary">
            {journalBoundary.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="journal-index-boundary-item">
                  <Icon size={20} aria-hidden />
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.summary}</small>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="journal-entries" className="journal-index-section journal-index-entries">
        <div className="container">
          <div className="journal-index-section-head">
            <div>
              <h2>Latest public field notes.</h2>
              <p>
                A quiet shelf for the human layer around the technical work: images, observations,
                and fragments before they become projects or research notes.
              </p>
            </div>
          </div>

          {featured ? (
            <div className="journal-index-featured">
              <JournalCard entry={featured} featured />
            </div>
          ) : null}

          <div className="journal-index-card-grid">
            {rest.map((entry) => (
              <JournalCard key={entry.slug} entry={entry} />
            ))}
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
