import Link from "next/link";
import { ArrowRight, Bot, LockKeyhole, Radio } from "lucide-react";

const agentNodes = [
  { label: "Planner", className: "system-node" },
  { label: "Researcher", className: "system-node system-node-researcher" },
  { label: "Builder", className: "system-node system-node-builder" },
  { label: "Analyst", className: "system-node system-node-analyst" }
];

const contextItems = ["Papers", "Notes", "Code", "Data"];

export function HeroSection() {
  return (
    <section className="premium-hero">
      <div className="container premium-hero-grid">
        <div className="premium-hero-copy">
          <h1 className="premium-hero-title">Weiyu Dang</h1>
          <p className="premium-hero-lede">
            I work at the intersection of physics and AI systems. I build Doraemon, a personal assistant, and research
            tools that extend human insight.
          </p>
          <p className="premium-hero-support">
            Public work stays legible. Private operations stay protected. Doraemon turns the whole system into a living
            front door.
          </p>
          <div className="premium-hero-actions">
            <Link href="#os-layers" className="link-focus premium-text-link">
              Explore the OS
              <ArrowRight size={16} aria-hidden />
            </Link>
            <Link href="/dora" className="link-focus premium-secondary-link">
              <Bot size={17} aria-hidden />
              Talk to Doraemon
            </Link>
          </div>
        </div>

        <div
          className="living-system-visual"
          role="img"
          aria-label="Animated Personal OS signal map with a Doraemon entry, agent network, living context, and public/private boundary."
        >
          <div className="system-plane" aria-hidden>
            <div className="system-plane-grid" aria-hidden />
            <div className="system-track system-track-one" aria-hidden />
            <div className="system-track system-track-two" aria-hidden />
            <div className="system-track system-track-three" aria-hidden />
            <div className="system-track system-track-four" aria-hidden />
          </div>

          <div className="dora-core" aria-hidden>
            <span className="dora-core-ring" aria-hidden />
            <span className="dora-core-beam" aria-hidden />
            <span className="dora-core-label">Doraemon entry</span>
          </div>

          <div className="agent-network" aria-hidden>
            <p>Agent network</p>
            <ul>
              {agentNodes.map((node) => (
                <li key={node.label}>
                  <span className={node.className} aria-hidden />
                  {node.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="context-stack" aria-hidden>
            <p>Living context</p>
            <ul>
              {contextItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="privacy-boundary" aria-hidden>
            <div>
              <Radio size={15} aria-hidden />
              <span>Public</span>
              <small>Shareable</small>
            </div>
            <div>
              <LockKeyhole size={15} aria-hidden />
              <span>Private</span>
              <small>Owner-only</small>
            </div>
          </div>
        </div>

        <Link href="/dora" className="link-focus dora-entry-dock">
          <span className="dora-entry-dock-label">
            <Bot size={19} aria-hidden />
            Talk to Doraemon
          </span>
          <span className="dora-entry-dock-copy">Ask the public guide, enter the office, or follow the agent team.</span>
          <ArrowRight size={18} aria-hidden />
        </Link>
      </div>
    </section>
  );
}
