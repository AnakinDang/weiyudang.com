import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Atom,
  Bot,
  BrainCircuit,
  CheckCircle2,
  Compass,
  FileSearch,
  Globe2,
  LineChart,
  LockKeyhole,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { SiteChrome } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "About",
  description: "About Weiyu Dang, a physics and quantum computing student building personal AI systems and research tools."
};

const identitySignals = [
  ["Physics", "Start with structure, models, and reality checks."],
  ["AI systems", "Build tools that make thinking easier without hiding judgment."],
  ["Research workflows", "Turn questions, evidence, and review into repeatable loops."]
] as const;

const osNodes = [
  { label: "Research", className: "about-os-node-research", icon: FileSearch },
  { label: "Doraemon Office", className: "about-os-node-doraemon", icon: Bot },
  { label: "Owner Cockpit", className: "about-os-node-owner", icon: LockKeyhole },
  { label: "Public Studio", className: "about-os-node-studio", icon: Globe2 }
] as const;

const thinkingPrinciples = [
  {
    title: "Physics-first curiosity",
    summary: "I like questions that survive contact with equations, experiments, constraints, and messy real systems.",
    icon: Atom
  },
  {
    title: "Taste before automation",
    summary: "Agents are useful when they amplify judgment. They are dangerous when they hide it.",
    icon: Compass
  },
  {
    title: "Evidence before confidence",
    summary: "Research notes, trading work, and product decisions should keep assumptions inspectable.",
    icon: ShieldCheck
  }
] as const;

const buildAreas = [
  {
    title: "Doraemon and MiniDoras",
    summary: "A personal AI operating layer with public-safe visibility and owner-only control surfaces.",
    href: "/dora",
    icon: Bot
  },
  {
    title: "Research and lab notes",
    summary: "Public sketches of systems, experiments, design choices, and durable lessons from building.",
    href: "/lab",
    icon: BrainCircuit
  },
  {
    title: "Projects as artifacts",
    summary: "A curated index of tools, interfaces, and systems with clear public/private boundaries.",
    href: "/projects",
    icon: Sparkles
  },
  {
    title: "Research-only trading",
    summary: "Market work is framed as evidence, disagreement, and gates. It is never execution.",
    href: "/projects/minidora-trading",
    icon: LineChart
  }
] as const;

const privateRules = [
  "No private tasks, prompts, credentials, accounts, raw IDs, runtime logs, or owner notes on public pages.",
  "Doraemon can be public as a story and interface; owner work stays behind authentication.",
  "Trading surfaces are research-only. Not an order, recommendation, or execution system."
] as const;

export default function AboutPage() {
  return (
    <SiteChrome headerVariant="doraemon" headerActiveHref="/about">
      <section className="about-hero">
        <div className="container about-hero-grid">
          <div className="about-hero-copy">
            <h1>
              <span className="about-hero-title">Weiyu Dang</span>
              <span className="about-hero-subtitle">Physics, quantum computing, and personal AI systems.</span>
            </h1>
            <p>
              I am building a public research studio and a private Personal OS: Doraemon as the entrance personality,
              MiniDoras as specialized teammates, and an owner cockpit where final judgment stays human.
            </p>
            <div className="about-hero-actions">
              <Link href="#personal-os" className="link-focus about-primary-action">
                Explore the Personal OS
                <ArrowRight size={16} aria-hidden />
              </Link>
              <Link href="/dora" className="link-focus about-secondary-action">
                Meet Doraemon
                <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
            <ul className="about-signal-row" aria-label="About Weiyu signal row">
              {identitySignals.map(([title, summary]) => (
                <li key={title}>
                  <strong>{title}</strong>
                  <span>{summary}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="about-os-visual" aria-label="Weiyu Personal OS identity map">
            <div className="about-os-glass">
              <div className="about-os-ring about-os-ring-one" aria-hidden />
              <div className="about-os-ring about-os-ring-two" aria-hidden />
              <div className="about-os-axis about-os-axis-horizontal" aria-hidden />
              <div className="about-os-axis about-os-axis-vertical" aria-hidden />
              <div className="about-os-core">
                <span className="about-os-core-mark">Wy</span>
                <span className="about-os-core-label">Personal OS</span>
              </div>
              {osNodes.map((node) => {
                const Icon = node.icon;
                return (
                  <div key={node.label} className={`about-os-node ${node.className}`}>
                    <Icon size={18} aria-hidden />
                    <span>{node.label}</span>
                  </div>
                );
              })}
            </div>
            <div className="about-boundary-strip" aria-label="Public and private boundary">
              <span>
                <Globe2 size={15} aria-hidden />
                Public
              </span>
              <span>
                <ShieldCheck size={15} aria-hidden />
                Public-safe
              </span>
              <span>
                <LockKeyhole size={15} aria-hidden />
                Owner-only
              </span>
            </div>
          </aside>
        </div>
      </section>

      <section id="personal-os" className="about-section about-thinking-section">
        <div className="container about-section-grid">
          <div className="about-section-intro">
            <p className="about-section-kicker">How I think</p>
            <h2>Rigorous when it matters. Playful when it helps.</h2>
            <p>
              The through-line is a taste for systems that compound: physics intuition, AI tools, research notes,
              product surfaces, and the private loops that keep work honest.
            </p>
          </div>
          <ul className="about-principle-grid">
            {thinkingPrinciples.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.title}>
                  <article className="about-principle-card">
                    <Icon size={24} aria-hidden />
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="about-section about-build-section">
        <div className="container about-build-frame">
          <div className="about-section-intro about-section-intro-wide">
            <p className="about-section-kicker">What I build</p>
            <h2>Public artifacts around a private operating layer.</h2>
            <p>
              The public site explains the work. Doraemon makes the agent system legible. The owner cockpit keeps the
              actual private state, approvals, and review loops protected.
            </p>
          </div>
          <ol className="about-build-list">
            {buildAreas.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={item.title}>
                  <Link href={item.href} className="link-focus about-build-row">
                    <span className="about-build-index">{String(index + 1).padStart(2, "0")}</span>
                    <span className="about-build-icon">
                      <Icon size={20} aria-hidden />
                    </span>
                    <span className="about-build-copy">
                      <strong>{item.title}</strong>
                      <span>{item.summary}</span>
                    </span>
                    <ArrowRight size={17} aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="about-section about-boundary-section">
        <div className="container about-boundary-grid">
          <div className="about-boundary-copy">
            <p className="about-section-kicker">What stays private</p>
            <h2>Useful in public. Careful by default.</h2>
            <p>
              This site can show concepts, public artifacts, sanitized Doraemon surfaces, and research summaries. It
              should not pretend the private operating layer is public.
            </p>
          </div>
          <ul className="about-boundary-panel">
            {privateRules.map((rule) => (
              <li key={rule}>
                <CheckCircle2 size={17} aria-hidden />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SiteChrome>
  );
}
