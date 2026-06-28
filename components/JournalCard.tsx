import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Camera } from "lucide-react";
import type { JournalEntry } from "@/lib/content";

const objectPosition = {
  left: "object-left",
  center: "object-center",
  right: "object-right"
} as const;

export function JournalCard({ entry, featured = false }: { entry: JournalEntry; featured?: boolean }) {
  const position = objectPosition[entry.accent as keyof typeof objectPosition] ?? "object-center";

  return (
    <article className={`panel group overflow-hidden ${featured ? "lg:grid lg:grid-cols-[1.08fr_0.92fr]" : ""}`}>
      <div className="relative min-h-64 overflow-hidden bg-[#f1f7fb]">
        <Image
          src={entry.cover}
          alt={`${entry.title} visual placeholder`}
          width={1536}
          height={768}
          sizes={featured ? "(min-width: 1024px) 48vw, 100vw" : "(min-width: 1024px) 30vw, 100vw"}
          className={`h-full min-h-64 w-full object-cover ${position} transition duration-500 group-hover:scale-[1.025]`}
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/88 to-transparent" aria-hidden />
      </div>
      <div className="flex flex-col justify-between p-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase">
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-[#bfdbfe] bg-[#e0f2fe] px-3 py-1.5 text-[#1d4ed8]">
              <Camera size={13} aria-hidden />
              {entry.type}
            </span>
            <span className="rounded-[8px] border border-[#dde7f0] bg-[#f8fafc] px-3 py-1.5 text-slate-500">{entry.location}</span>
          </div>
          <p className="mono mt-5 text-xs text-slate-500">{entry.date}</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-950">{entry.title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">{entry.summary}</p>
        </div>
        <Link
          href={`/journal/${entry.slug}`}
          className="link-focus mt-6 inline-flex w-fit items-center gap-2 rounded-[8px] border border-[#dde7f0] bg-white px-3 py-2 text-sm font-bold text-slate-800 transition hover:border-[#bfdbfe] hover:bg-[#f1f7fb]"
        >
          Read entry
          <ArrowUpRight size={15} aria-hidden />
        </Link>
      </div>
    </article>
  );
}
