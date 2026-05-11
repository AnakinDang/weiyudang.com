import { Metadata } from "next";
import { BrainCircuit, Compass, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteChrome } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "About",
  description: "About Weiyu Dang and the AI-augmented one-person company model."
};

const principles = [
  {
    title: "Human judgment stays central",
    summary: "Direction, taste, approval, and accountability stay with Weiyu.",
    icon: Compass
  },
  {
    title: "Agents create leverage",
    summary: "Doraemon and MiniDora agents help turn intent into plans, artifacts, and reviewable work.",
    icon: BrainCircuit
  },
  {
    title: "Boundaries are product design",
    summary: "Public explanation, private execution, and local-only credentials remain separate.",
    icon: ShieldCheck
  }
];

export default function AboutPage() {
  return (
    <SiteChrome>
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="About"
            title="Weiyu Dang is building a personal AI company operating system."
            summary="This website is the public front door for the systems, projects, and notes behind that effort."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {principles.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="panel p-5">
                  <Icon className="text-yellow-100" size={26} aria-hidden />
                  <h2 className="mt-5 text-xl font-semibold text-white">{item.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{item.summary}</p>
                </article>
              );
            })}
          </div>
          <div className="mt-10 max-w-4xl text-lg leading-9 text-slate-300">
            <p>
              The site is intentionally not a traditional resume page. It is a portal for an AI-augmented workflow:
              projects, public explanations, a public Dora guide, and a private command surface for future internal
              dashboards.
            </p>
            <p className="mt-6">
              The public layer is designed to be understandable and safe. The private layer is where operating data,
              event streams, and owner review queues will belong once real integrations are connected.
            </p>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
