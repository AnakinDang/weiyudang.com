import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bot, FlaskConical, LineChart, LockKeyhole, Sparkles } from "lucide-react";

const heroSurfaces = [
  {
    title: "Public Studio",
    summary: "Projects & notes",
    href: "/projects",
    state: "public",
    stateLabel: "Public",
    icon: FlaskConical
  },
  {
    title: "Doraemon Office",
    summary: "Public-safe office",
    href: "/dora",
    state: "public-safe",
    stateLabel: "Public-safe",
    icon: Bot
  },
  {
    title: "Owner Cockpit",
    summary: "Private daily surface",
    href: "/app",
    state: "private",
    stateLabel: "Private",
    icon: LockKeyhole
  },
  {
    title: "Research Desk",
    summary: "Research-only",
    href: "/lab",
    state: "research",
    stateLabel: "Research",
    icon: LineChart
  }
];

const heroSignals = ["Public window", "Doraemon entry", "Owner gated"] as const;

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
            <span className="premium-hero-name">Weiyu Dang</span>
            <span>Personal OS</span>
          </h1>
          <p className="premium-hero-lede">
            A living personal site for AI systems, research, writing, and Doraemon.
          </p>
          <p className="premium-hero-support">
            Public studio in front. Doraemon Office in view. Owner work behind a private boundary.
          </p>
          <div className="premium-hero-statusline" aria-label="Public and private boundary">
            {heroSignals.map((signal, index) => (
              <span key={signal} className="premium-hero-signal">
                <span className="premium-hero-signal-dot" aria-hidden={true} />
                {signal}
                {index < heroSignals.length - 1 ? (
                  <span className="premium-hero-signal-divider" aria-hidden={true} />
                ) : null}
              </span>
            ))}
          </div>
          <div className="premium-hero-actions">
            <Link href="/dora" className="link-focus premium-primary-link">
              Enter Doraemon
              <ArrowRight size={16} aria-hidden />
            </Link>
            <Link href="#os-layers" className="link-focus premium-text-link">
              Explore the system
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>

        <div className="premium-hero-map" aria-hidden="true">
          {/* Visual-only: accessible Doraemon context is in the hero copy and surface rail. */}
          <div className="premium-map-core">
            <Bot size={16} aria-hidden />
            <strong>Doraemon</strong>
            <span>coordinates the office</span>
          </div>
          {heroSurfaces.map((surface) => {
            const Icon = surface.icon;
            return (
              <Link
                key={surface.title}
                href={surface.href}
                className={`link-focus premium-map-node premium-map-node-${surface.state}`}
                tabIndex={-1}
              >
                <Icon size={15} aria-hidden />
                <span>{surface.title}</span>
                <small>{surface.summary}</small>
              </Link>
            );
          })}
        </div>

        <div className="premium-surface-rail" aria-label="Personal OS connected surfaces">
          {heroSurfaces.map((surface) => {
            const Icon = surface.icon;
            return (
              <Link key={surface.title} href={surface.href} className="link-focus premium-surface-link">
                <Icon size={15} aria-hidden />
                <span>
                  <strong>{surface.title}</strong>
                </span>
                <span className="premium-surface-state">{surface.stateLabel}</span>
              </Link>
            );
          })}
          <span className="premium-surface-rail-note">
            <Sparkles size={14} aria-hidden />
            Public surfaces stay visible. Owner work stays private.
          </span>
        </div>
      </div>
    </section>
  );
}
