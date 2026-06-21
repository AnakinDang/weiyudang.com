import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bot, Clock3, FlaskConical, LineChart, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { formatPublicEventTime, getRecentPublicDoraEvents } from "@/lib/dora-office";

const heroSurfaces = [
  {
    title: "Public Studio",
    summary: "Essays, ideas, projects",
    href: "/projects",
    state: "public",
    stateLabel: "Public",
    icon: FlaskConical
  },
  {
    title: "Doraemon Office",
    summary: "Main command-room entrance",
    href: "/dora/office",
    state: "public-safe",
    stateLabel: "Public-safe",
    icon: Bot
  },
  {
    title: "Owner Cockpit",
    summary: "Approvals, schedules, review",
    href: "/app",
    state: "private",
    stateLabel: "Private",
    icon: LockKeyhole
  },
  {
    title: "Research Desk",
    summary: "Long-form research notes",
    href: "/lab",
    state: "research",
    stateLabel: "Research-only",
    icon: LineChart
  }
];

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
          sizes="(max-width: 900px) 100vw, 62vw"
        />
      </div>
      <div className="premium-hero-lightfield" aria-hidden="true" />

      <div className="container premium-hero-grid">
        <div className="premium-hero-copy">
          <h1 className="premium-hero-title">
            <span className="premium-hero-name">Weiyu Dang</span>
            <span>
              Personal OS for research, writing, and <em>Doraemon.</em>
            </span>
          </h1>
          <p className="premium-hero-support">
            A living studio where public work, Doraemon Office, MiniDoras, and private owner workflows stay connected.
          </p>
          <div className="premium-hero-actions">
            <Link href="/dora/office" className="link-focus premium-primary-link">
              <Bot size={18} aria-hidden />
              Enter Doraemon Office
              <ArrowRight size={16} aria-hidden />
            </Link>
            <Link href="#os-layers" className="link-focus premium-text-link">
              Explore the system
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
          <Link href="/app" className="link-focus premium-owner-inline">
            <LockKeyhole size={15} aria-hidden />
            Owner cockpit
            <ArrowRight size={14} aria-hidden />
          </Link>
        </div>

        <aside className="premium-office-capsule" aria-label="Public-safe Doraemon Office status">
          <div className="premium-office-capsule-head">
            <div>
              <span>Doraemon Office</span>
              <strong>Public window</strong>
            </div>
            <span className="premium-office-status-pill">
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
                <small>Sanitized. Demo-safe. Read-only.</small>
              </span>
            </div>
          </div>
        </aside>

        <div className="premium-hero-bottom-deck">
          <section className="premium-office-events premium-hero-demo-strip" aria-label="Public activity (demo-safe)">
            <div className="premium-office-events-head">
              <span>
                <Clock3 size={14} aria-hidden />
                Public activity (demo-safe)
              </span>
              <Link href="/dora/activity" className="link-focus">
                View all
                <ArrowRight size={13} aria-hidden />
              </Link>
            </div>
            <ol>
              {recentEvents.map((event) => (
                <li key={event.event_id}>
                  <time dateTime={event.created_at}>{formatPublicEventTime(event.created_at)}</time>
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
