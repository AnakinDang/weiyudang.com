import Link from "next/link";
import { ArrowRight, Compass, LockKeyhole, MessageSquareText } from "lucide-react";
import { StudioScene } from "@/components/StudioScene";

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden px-5">
      <StudioScene />
      <div className="container relative z-10 flex min-h-[calc(100vh-4rem)] items-center py-20">
        <div className="max-w-3xl">
          <p className="eyebrow">Weiyu Dang</p>
          <h1 className="mt-5 text-5xl font-semibold leading-tight text-white md:text-7xl">
            Building an AI-augmented one-person company.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 md:text-xl">
            Powered by Doraemon Agent System. One human sets the vision. A team of AI agents helps execute.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="link-focus inline-flex items-center gap-2 rounded-[8px] bg-sky-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-300"
            >
              <Compass size={17} aria-hidden />
              Explore Projects
              <ArrowRight size={16} aria-hidden />
            </Link>
            <Link
              href="/dora"
              className="link-focus inline-flex items-center gap-2 rounded-[8px] border border-sky-200/30 bg-sky-200/10 px-4 py-3 text-sm font-bold text-sky-50 transition hover:bg-sky-200/16"
            >
              <MessageSquareText size={17} aria-hidden />
              Enter Dora
            </Link>
            <Link
              href="/app"
              className="link-focus inline-flex items-center gap-2 rounded-[8px] border border-yellow-200/40 bg-yellow-200/12 px-4 py-3 text-sm font-bold text-yellow-50 transition hover:bg-yellow-200/18"
            >
              <LockKeyhole size={17} aria-hidden />
              Private Command Center
            </Link>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#101827]" />
    </section>
  );
}
