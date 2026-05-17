import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
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
