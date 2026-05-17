import type { Metadata } from "next";
import Image from "next/image";
import { Camera, MapPin, NotebookPen } from "lucide-react";
import { JournalCard } from "@/components/JournalCard";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteChrome } from "@/components/SiteChrome";
import { getJournalEntries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Journal",
  description: "Photography, life notes, and personal field observations from Weiyu Dang."
};

const journalPillars = [
  { title: "Photography", summary: "Frames, light, texture, and visual memory.", icon: Camera },
  { title: "Life Notes", summary: "Small personal updates without turning the site into a feed.", icon: NotebookPen },
  { title: "Places", summary: "Travel fragments, daily walks, and field observations.", icon: MapPin }
];

export default function JournalPage() {
  const entries = getJournalEntries();
  const [featured, ...rest] = entries;

  return (
    <SiteChrome>
      <section className="section">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <SectionHeading
              eyebrow="Journal"
              title="Field notes from life outside the lab."
              summary="Photography, everyday observations, places, and personal fragments. A softer shelf beside the technical work."
            />
            <div className="relative overflow-hidden rounded-[8px] border border-[#dde7f0] bg-white p-3 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
              <Image
                src="/visuals/journal-triptych.png"
                alt="Photography and life journal triptych with camera, city walk, and travel desk scenes."
                width={1536}
                height={768}
                priority
                loading="eager"
                sizes="(min-width: 1024px) 44vw, 100vw"
                className="aspect-[1.58/1] w-full rounded-[8px] object-cover"
              />
            </div>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {journalPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div key={pillar.title} className="panel-quiet p-5">
                  <Icon className="text-[#2563eb]" size={24} aria-hidden />
                  <h2 className="mt-4 text-xl font-semibold text-slate-950">{pillar.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{pillar.summary}</p>
                </div>
              );
            })}
          </div>

          {featured ? (
            <div className="mt-12">
              <JournalCard entry={featured} featured />
            </div>
          ) : null}

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {rest.map((entry) => (
              <JournalCard key={entry.slug} entry={entry} />
            ))}
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
