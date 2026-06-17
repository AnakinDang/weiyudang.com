import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bot, LockKeyhole, Radio, Sparkles } from "lucide-react";

const agentNodes = [
  { label: "Research", className: "system-node" },
  { label: "Strategy", className: "system-node system-node-researcher" },
  { label: "Data", className: "system-node system-node-builder" },
  { label: "Writing", className: "system-node system-node-analyst" }
];

const publicSignals = ["Projects", "Doraemon", "Notes", "Contact"];

export function HeroSection() {
  return (
    <section className="premium-hero">
      <div className="container premium-hero-grid">
        <div className="premium-hero-copy">
          <h1 className="premium-hero-title" aria-label="Weiyu Dang Personal OS">
            Weiyu Dang
            <span>Personal OS</span>
          </h1>
          <p className="premium-hero-lede">
            A living personal website for physics, AI systems, and research tools. Doraemon is Weiyu&apos;s personal
            AI command room.
          </p>
          <p className="premium-hero-support">
            The public site explains the work. Doraemon makes the agent office legible. The private cockpit stays
            owner-only.
          </p>
          <div className="premium-hero-actions">
            <Link href="/dora" className="link-focus premium-primary-link">
              Meet Doraemon
              <ArrowRight size={16} aria-hidden />
            </Link>
            <Link href="#os-layers" className="link-focus premium-text-link">
              Explore the system
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>

        <div
          className="living-system-visual"
          role="img"
          aria-label="Bright Personal OS studio with a Doraemon command-room portal, public signal layer, and agent constellation."
        >
          <div className="personal-os-asset" aria-hidden="true">
            <Image
              src="/visuals/personal-os-portal-v1.png"
              alt=""
              width={1672}
              height={941}
              priority
              sizes="(max-width: 1040px) 100vw, 62vw"
            />
          </div>

          <div className="dora-core" aria-hidden>
            <span className="dora-core-ring" aria-hidden />
            <span className="dora-core-beam" aria-hidden />
            <span className="dora-core-label">Doraemon</span>
          </div>

          <div className="agent-network" aria-hidden>
            <p>MiniDora team</p>
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
            <p>Public layer</p>
            <ul>
              {publicSignals.map((item) => (
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

        <Link href="/dora/office" className="link-focus dora-entry-dock">
          <span className="dora-entry-dock-label">
            <Bot size={19} aria-hidden />
            Open the live office
          </span>
          <span className="dora-entry-dock-copy">
            Open the sanitized public command room. Private tasks, prompts, and accounts stay out.
          </span>
          <span className="dora-entry-dock-state">
            <Sparkles size={15} aria-hidden />
            public-safe
          </span>
          <ArrowRight size={18} aria-hidden />
        </Link>
      </div>
    </section>
  );
}
