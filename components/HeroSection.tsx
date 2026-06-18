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
            A public personal studio and private AI command room for research, building, writing, and Doraemon.
          </p>
          <p className="premium-hero-support">
            Public pages explain the work. Owner surfaces stay private. MiniDoras turn context into reviewed output.
          </p>
          <div className="premium-hero-actions">
            <Link href="/dora/office" className="link-focus premium-primary-link">
              Enter Doraemon Office
              <ArrowRight size={16} aria-hidden />
            </Link>
            <Link href="#os-layers" className="link-focus premium-text-link">
              Explore the system
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>

        <div className="premium-hero-status" aria-label="Personal OS public and private boundaries">
          <Link href="/dora/office" className="link-focus premium-status-item premium-status-primary">
            <span>
              <Bot size={18} aria-hidden />
              Doraemon Office
            </span>
            <small>Public-safe command room</small>
          </Link>
          <Link href="/lab" className="link-focus premium-status-item">
            <span>
              <FlaskConical size={18} aria-hidden />
              Research
            </span>
            <small>Notes and system sketches</small>
          </Link>
          <Link href="/app" className="link-focus premium-status-item premium-status-private">
            <span>
              <LockKeyhole size={18} aria-hidden />
              Owner area
            </span>
            <small>Authenticated surfaces only</small>
          </Link>
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
