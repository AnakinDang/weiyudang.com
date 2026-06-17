import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bot, Sparkles } from "lucide-react";

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
            A living personal website for physics, AI systems, research tools, and Doraemon, Weiyu&apos;s personal AI
            command room.
          </p>
          <p className="premium-hero-support">
            The public site explains the work, projects, and long-term research direction without exposing the private
            operating layer.
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
          aria-label="Bright Personal OS studio with an open Doraemon Office doorway, MiniDora presence, and a public-safe command room."
        >
          <div className="personal-os-asset" aria-hidden="true">
            <Image
              src="/visuals/personal-os-portal-v2.png"
              alt=""
              width={1672}
              height={941}
              priority
              sizes="(max-width: 1040px) 100vw, 62vw"
            />
          </div>
        </div>

        <Link href="/dora/office" className="link-focus dora-entry-dock">
          <span className="dora-entry-dock-label">
            <Bot size={19} aria-hidden />
            Enter Doraemon Office
          </span>
          <span className="dora-entry-dock-copy">
            Open a sanitized public window into MiniDora presence, activity, and system heartbeat.
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
