import type { Metadata } from "next";
import { MonitorPlay, ShieldCheck } from "lucide-react";
import { DoraChatMock } from "@/components/DoraChatMock";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteChrome } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Dora",
  description: "A public Dora guide for Weiyu Dang's personal website and AI lab."
};

export default function DoraPage() {
  return (
    <SiteChrome>
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Dora public entrance"
            title="A warm public guide for the personal AI lab."
            summary="This MVP is a static public chat mock. It answers from public content only and keeps private systems out of scope."
          />
          <div className="mt-8 rounded-[8px] border border-[#bfdbfe] bg-[#f1f7fb] p-5">
            <p className="eyebrow">Office visualizer</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Watch the Doraemon office at work</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              A 60-second scripted replay of the real command screen that runs on the studio Mac mini:
              Doraemon plans the day, MiniDoras pick up handoffs at their stations, tools fire, and the
              owner-review sign goes up. Display-only — the public demo is a self-contained loop with no
              connection to private agent runtimes or trading data.
            </p>
            <a
              href="https://dora.weiyudang.com"
              target="_blank"
              rel="noreferrer"
              className="link-focus mt-4 inline-flex w-fit items-center gap-2 rounded-[8px] bg-[#2563eb] px-4 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(37,99,235,0.2)] transition hover:bg-[#1d4ed8]"
            >
              <MonitorPlay size={18} aria-hidden />
              Open the live office demo
            </a>
          </div>
          <div className="mt-8 rounded-[8px] border border-[#f4b740]/35 bg-[#fff8e5] p-4 text-sm leading-6 text-slate-700">
            <ShieldCheck className="mb-2" size={18} aria-hidden />
            The future API should use a public content index, rate limiting, abuse checks, and bot protection. It must not connect to internal agent runtimes or trading data.
          </div>
          <div className="mt-8">
            <DoraChatMock />
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
