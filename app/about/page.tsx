import { Metadata } from "next";
import { Atom, BrainCircuit, Compass, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { SiteChrome } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "About",
  description: "About Weiyu Dang, a physics and quantum computing student building AI systems and research tools."
};

const principles = [
  {
    title: "Physics-first curiosity",
    summary: "Start from real questions, mathematical structure, and the habit of checking whether an idea touches reality.",
    icon: Atom
  },
  {
    title: "AI systems as craft",
    summary: "Build small tools, agents, and workflows that make thinking easier without hiding the human judgment inside.",
    icon: BrainCircuit
  },
  {
    title: "Evidence before confidence",
    summary: "Research tools, trading notes, and creative systems should make assumptions visible and decisions reviewable.",
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
            title="Weiyu Dang explores physics, quantum computing, AI systems, and research workflows."
            summary="This website is a personal home base: part portfolio, part lab notebook, part map of the tools and ideas I am building."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {principles.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="panel p-5">
                  <Icon className="text-[#2563eb]" size={26} aria-hidden />
                  <h2 className="mt-5 text-xl font-semibold text-slate-950">{item.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.summary}</p>
                </article>
              );
            })}
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.72fr]">
            <div className="max-w-4xl text-lg leading-9 text-slate-600">
              <p>
                I am interested in the places where rigorous thinking becomes useful software: physics intuition,
                quantum computing, AI-assisted workflows, research tooling, and creative interfaces.
              </p>
              <p className="mt-6">
                The AI lab on this site is one expression of that work. Doraemon, MiniDora, and Weiyu AI are ways to explore
                how a personal operating system could help with research, writing, building, and review while keeping
                responsibility with the human owner.
              </p>
              <p className="mt-6">
                The journal is intentionally softer: photography, everyday observations, and personal fragments that keep
                the site from becoming only a technical portfolio.
              </p>
            </div>
            <aside className="panel h-fit p-5">
              <Compass className="text-[#f4b740]" size={24} aria-hidden />
              <h2 className="mt-4 text-xl font-semibold text-slate-950">Public and private stay separate.</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Public pages explain projects and notes. Private dashboards, credentials, trading research internals, and
                future agent runtimes stay behind the app boundary.
              </p>
            </aside>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
