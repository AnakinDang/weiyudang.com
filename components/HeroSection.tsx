import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bot } from "lucide-react";

export function HeroSection() {
  return (
    <>
      <section className="relative isolate overflow-hidden px-5 py-14 md:py-20">
        <Image
          src="/visuals/weiyu-bright-studio.png"
          alt="Bright personal research studio with notes, screens, AI workflows, quantum grid hints, and trading research references."
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover object-center"
        />
        <div
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(248,250,252,0.97)_0%,rgba(248,250,252,0.9)_42%,rgba(248,250,252,0.58)_100%),linear-gradient(180deg,rgba(248,250,252,0.78)_0%,rgba(248,250,252,0.45)_52%,rgba(248,250,252,0.94)_100%)]"
          aria-hidden
        />

        <div className="container">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-semibold leading-[1.02] text-slate-950 md:text-7xl">Weiyu Dang</h1>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-800 md:text-2xl">
              A personal AI systems studio where public work, Doraemon, MiniDoras, private owner workflows, and
              research-only trading meet in one living operating system.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700 md:text-lg">
              Public pages explain the work. Dora makes the agent team legible. The private cockpit keeps Weiyu as the
              final authority.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/dora/office"
                className="link-focus inline-flex items-center gap-2 rounded-[8px] bg-[#2563eb] px-4 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(37,99,235,0.22)] transition hover:bg-[#1d4ed8]"
              >
                <Bot size={17} aria-hidden />
                Enter Dora Office
                <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </div>
        </div>
        <div className="container pointer-events-none relative -mt-4 hidden h-px bg-gradient-to-r from-transparent via-[#dde7f0] to-transparent md:block" />
      </section>
    </>
  );
}
