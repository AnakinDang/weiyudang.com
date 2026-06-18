import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bot, FlaskConical, LockKeyhole, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="premium-hero">
      <div className="premium-hero-backdrop" aria-hidden="true">
        <Image
          src="/visuals/personal-os-portal-v2.png"
          alt=""
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className="premium-hero-lightfield" aria-hidden="true" />

      <div className="container premium-hero-grid">
        <div className="premium-hero-copy">
          <h1 className="premium-hero-title" aria-label="Weiyu Dang Personal OS">
            Weiyu Dang
            <span>Personal OS</span>
          </h1>
          <p className="premium-hero-lede">
            A public personal studio and private AI command layer for research, building, writing, and Doraemon.
          </p>
          <p className="premium-hero-support">
            The public site explains the work. Doraemon is the warm entry. Owner surfaces stay private and reviewed.
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

        <div className="premium-hero-status" aria-label="Personal OS public and private boundaries">
          <Link href="/dora" className="link-focus premium-status-item premium-status-primary">
            <span>
              <Bot size={18} aria-hidden />
              Doraemon entry
            </span>
            <small>Public guide to the office</small>
          </Link>
          <Link href="/lab" className="link-focus premium-status-item">
            <span>
              <FlaskConical size={18} aria-hidden />
              Research studio
            </span>
            <small>Public notes and systems</small>
          </Link>
          <Link href="/app" className="link-focus premium-status-item premium-status-private">
            <span>
              <LockKeyhole size={18} aria-hidden />
              Owner cockpit
            </span>
            <small>Authenticated and private</small>
          </Link>
        </div>

        <Link href="/dora" className="link-focus dora-entry-dock">
          <span className="dora-entry-dock-label">
            <Bot size={19} aria-hidden />
            Start with Doraemon
          </span>
          <span className="dora-entry-dock-copy">
            Meet the entry personality, MiniDora team, public office window, and safety boundary.
          </span>
          <span className="dora-entry-dock-state">
            <Sparkles size={15} aria-hidden />
            public guide
          </span>
          <ArrowRight size={18} aria-hidden />
        </Link>
      </div>
    </section>
  );
}
