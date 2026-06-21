import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bot, Clock3, FlaskConical, LineChart, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { formatPublicEventDateTime, getRecentPublicDoraEvents } from "@/lib/dora-office";

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

const heroSignals = ["Public studio", "Doraemon Office", "Owner gated"] as const;

const heroAgents = ["Research Dora", "Strategy Dora", "Data Dora", "Operations Dora"] as const;

export function HeroSection() {
  const recentEvents = getRecentPublicDoraEvents(5);

  return (
    <section className="premium-hero">
      <div className="premium-hero-backdrop" aria-hidden="true">
        <Image
          src="/visuals/doraemon-office-doorway-v3.png"
          alt=""
          fill
          priority
          quality={95}
          sizes="100vw"
        />
      </div>
      <div className="premium-hero-lightfield" aria-hidden="true" />

      <div className="container premium-hero-grid">
        <div className="premium-hero-copy">
          <h1 className="premium-hero-title">Weiyu Dang</h1>
          <p className="premium-hero-lede">
            Personal AI systems studio.
          </p>
          <p className="premium-hero-support">
            Research, writing, Doraemon, and the operating layer behind one person&apos;s work.
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

        <div className="premium-agent-constellation" role="list" aria-label="Doraemon agent signals">
          {heroAgents.map((agent, index) => (
            <span key={agent} className={`premium-agent-node premium-agent-node-${index + 1}`} role="listitem">
              <Bot size={18} aria-hidden />
              <small>{agent}</small>
            </span>
          ))}
        </div>

        <aside className="premium-office-capsule" aria-label="Public-safe Doraemon Office status">
          <div className="premium-office-capsule-head">
            <div>
              <span>Doraemon Office</span>
              <strong>Public window</strong>
            </div>
            <span className="premium-office-live-pill">
              <span aria-hidden="true" />
              Demo replay
            </span>
          </div>

          <p className="premium-office-capsule-copy">
            A personal AI command room for thinking, building, and long-term learning.
          </p>

          <div className="premium-office-boundary">
            <div className="premium-office-boundary-row">
              <LockKeyhole size={17} aria-hidden />
              <span>
                <strong>Private Area</strong>
                <small>Owner-only cockpit</small>
              </span>
            </div>
            <div className="premium-office-boundary-row">
              <ShieldCheck size={17} aria-hidden />
              <span>
                <strong>Public Window</strong>
                <small>Sanitized. Read-only. Safe.</small>
              </span>
            </div>
          </div>
        </aside>

        <div className="premium-hero-bottom-deck">
          <section className="premium-office-events premium-hero-live-strip" aria-label="Live activity (public-safe)">
            <div className="premium-office-events-head">
              <span>
                <Clock3 size={14} aria-hidden />
                Live activity (public-safe)
              </span>
              <Link href="/dora/activity" className="link-focus">
                View all
                <ArrowRight size={13} aria-hidden />
              </Link>
            </div>
            <ol>
              {recentEvents.map((event) => (
                <li key={event.event_id}>
                  <time dateTime={event.created_at}>{formatPublicEventDateTime(event.created_at)}</time>
                  <strong>{event.agent}</strong>
                  <span>{event.title}</span>
                </li>
              ))}
            </ol>
          </section>

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
      </div>
    </section>
  );
}
