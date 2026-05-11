import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, MessageCircle, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteChrome } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Weiyu Dang for AI agents, one-person company systems, creative systems, and research workflows."
};

const contactTopics = [
  "AI agent systems",
  "One-person company operating models",
  "Creative production workflows",
  "Evidence-first research tooling"
];

export default function ContactPage() {
  return (
    <SiteChrome>
      <section className="section">
        <div className="container grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Contact"
              title="Start with a focused note."
              summary="The best collaboration requests are specific about the system, workflow, or project surface you want to explore."
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {contactTopics.map((topic) => (
                <div key={topic} className="panel-quiet p-4 text-sm font-semibold text-slate-200">
                  {topic}
                </div>
              ))}
            </div>
          </div>
          <aside className="panel p-6">
            <Mail className="text-yellow-100" size={28} aria-hidden />
            <h2 className="mt-4 text-2xl font-semibold text-white">Email</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Use the domain mailbox once it is configured in Cloudflare or your preferred mail provider.
            </p>
            <a
              href="mailto:hello@weiyudang.com"
              className="link-focus mt-5 inline-flex items-center gap-2 rounded-[8px] bg-sky-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-300"
            >
              hello@weiyudang.com
              <ArrowRight size={16} aria-hidden />
            </a>
            <div className="mt-6 rounded-[8px] border border-emerald-200/24 bg-emerald-300/10 p-4 text-sm leading-6 text-emerald-50">
              <ShieldCheck className="mb-2" size={18} aria-hidden />
              Public contact should stay separate from private command, trading, and credential systems.
            </div>
            <Link
              href="/dora"
              className="link-focus mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-100 hover:text-sky-50"
            >
              <MessageCircle size={16} aria-hidden />
              Ask Dora about public projects
            </Link>
          </aside>
        </div>
      </section>
    </SiteChrome>
  );
}
