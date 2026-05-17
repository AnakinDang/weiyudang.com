import Link from "next/link";
import { ArrowRight, BookOpenText, Compass, Sparkles } from "lucide-react";
import { LiveStudioSignal } from "@/components/LiveStudioSignal";
import { StudioScene } from "@/components/StudioScene";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-5 py-12 md:py-16">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(224,242,254,0.95),transparent_28rem),radial-gradient(circle_at_84%_12%,rgba(244,183,64,0.18),transparent_22rem)]" />
      <div className="container grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-semibold leading-[1.02] text-slate-950 md:text-7xl">Weiyu Dang</h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-700 md:text-2xl">
            Physics and quantum computing student building AI systems, creative workflows, and trading research tools.
          </p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            This is my personal studio on the web: a place for experiments, notes, projects, and the small systems that
            help turn curiosity into working artifacts.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="link-focus inline-flex items-center gap-2 rounded-[8px] bg-[#2563eb] px-4 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(37,99,235,0.22)] transition hover:bg-[#1d4ed8]"
            >
              <Compass size={17} aria-hidden />
              Explore Work
              <ArrowRight size={16} aria-hidden />
            </Link>
            <Link
              href="/lab"
              className="link-focus inline-flex items-center gap-2 rounded-[8px] border border-[#dde7f0] bg-white px-4 py-3 text-sm font-bold text-slate-800 transition hover:border-[#bfdbfe] hover:bg-[#f1f7fb]"
            >
              <BookOpenText size={17} aria-hidden />
              Read Notes
            </Link>
            <Link
              href="#ai-lab"
              className="link-focus inline-flex items-center gap-2 rounded-[8px] border border-[#f4b740]/45 bg-[#fff8e5] px-4 py-3 text-sm font-bold text-slate-900 transition hover:bg-[#fff2c7]"
            >
              <Sparkles size={17} aria-hidden />
              AI Lab
            </Link>
          </div>
          <LiveStudioSignal />
        </div>
        <StudioScene />
      </div>
      <div className="container pointer-events-none relative -mt-4 hidden h-px bg-gradient-to-r from-transparent via-[#dde7f0] to-transparent md:block" />
    </section>
  );
}
