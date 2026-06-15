import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bot, MonitorPlay, ShieldCheck, Sparkles } from "lucide-react";
import { DoraChatMock } from "@/components/DoraChatMock";
import { DoraOfficeShell } from "@/components/DoraOfficeShell";
import { SectionHeading } from "@/components/SectionHeading";
import { DORA_LIVE_BRIDGE_URL } from "@/lib/dora-office";

export const metadata: Metadata = {
  title: "Dora",
  description: "The public Dora entry for Weiyu Dang's personal AI operating system."
};

export default function DoraPage() {
  const liveBridgeHost = DORA_LIVE_BRIDGE_URL.replace(/^https?:\/\//, "");

  return (
    <DoraOfficeShell
      active="/dora"
      title="Dora is the front door to the personal AI office."
      summary="Doraemon coordinates, MiniDoras work, and Weiyu decides. This public entrance explains the system and routes into a sanitized command-room view."
    >
      <div className="grid gap-8">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Coordinate agents",
              summary: "Dora turns intent into plans, handoffs, summaries, and review checkpoints.",
              icon: Bot
            },
            {
              title: "Track work",
              summary: "The office shows public-safe state, activity, tasks, schedules, and system heartbeat.",
              icon: MonitorPlay
            },
            {
              title: "Guard boundaries",
              summary: "Public routes are display-only and never connect to private memory, trading data, or tools.",
              icon: ShieldCheck
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="panel p-5">
                <span className="flex size-11 items-center justify-center rounded-[8px] border border-[#bfdbfe] bg-[#e0f2fe] text-[#2563eb]">
                  <Icon size={22} aria-hidden />
                </span>
                <h2 className="mt-5 text-xl font-semibold text-slate-950">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.summary}</p>
              </article>
            );
          })}
        </div>

        <div className="rounded-[8px] border border-[#bfdbfe] bg-[#f1f7fb] p-5">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="eyebrow">Office live</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Enter the native Dora Office route</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700">
                The current production bridge is still available at {liveBridgeHost}, but the main product shape now
                starts here under `/dora/*`.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dora/office"
                className="link-focus inline-flex w-fit items-center gap-2 rounded-[8px] bg-[#2563eb] px-4 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(37,99,235,0.2)] transition hover:bg-[#1d4ed8]"
              >
                <Sparkles size={17} aria-hidden />
                Enter Dora Office
              </Link>
              <a
                href={DORA_LIVE_BRIDGE_URL}
                target="_blank"
                rel="noreferrer"
                className="link-focus inline-flex w-fit items-center gap-2 rounded-[8px] border border-[#bfdbfe] bg-white px-4 py-3 text-sm font-bold text-[#1d4ed8] transition hover:bg-[#e0f2fe]"
              >
                Live bridge
                <ArrowRight size={16} aria-hidden />
              </a>
            </div>
          </div>
        </div>

        <div>
          <SectionHeading
            eyebrow="Curated guide"
            title="Ask from public content only."
            summary="The current guide remains curated and static. It does not use public RAG, call tools, or read private systems."
          />
          <div className="mt-8 rounded-[8px] border border-[#f4b740]/35 bg-[#fff8e5] p-4 text-sm leading-6 text-slate-700">
            <ShieldCheck className="mb-2" size={18} aria-hidden />
            The future API should use a public content index, rate limiting, abuse checks, and bot protection. It must
            not connect to internal agent runtimes or trading data.
          </div>
          <div className="mt-8">
            <DoraChatMock />
          </div>
        </div>
      </div>
    </DoraOfficeShell>
  );
}
