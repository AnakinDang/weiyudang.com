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
    title: "Doraemon",
    summary: "Guide and public office",
    href: "/dora",
    state: "public-safe",
    stateLabel: "Public-safe",
    icon: Bot
  },
  {
    title: "Owner Cockpit",
    summary: "Private review and approvals",
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
          src="/visuals/personal-os-portal-v2.png"
          alt=""
          fill
          loading="eager"
          fetchPriority="high"
          quality={95}
          sizes="(max-width: 900px) 100vw, 68vw"
        />
      </div>
      <div className="premium-hero-lightfield" aria-hidden="true" />
      <div className="premium-hero-signal-field" aria-hidden="true">
        <span className="premium-hero-signal-trace" />
      </div>

      <div className="container premium-hero-grid">
        <div className="premium-hero-copy">
          <h1 className="premium-hero-title" aria-label="Weiyu's Personal OS with Doraemon.">
            <span className="premium-hero-name">Weiyu&apos;s</span>
            <span className="premium-hero-os">Personal OS</span>
            <span className="premium-hero-line">
              <em>with Doraemon.</em>
            </span>
          </h1>
          <p className="premium-hero-lede">Doraemon coordinates. MiniDoras work. Weiyu decides.</p>
          <p className="premium-hero-support">
            A public home for physics, AI systems, research tools, and the agent team behind the work.
            Doraemon Office makes the Personal OS visible without exposing private tasks, prompts, or controls.
          </p>
          <div
            className="premium-hero-statusline"
            role="group"
            aria-label="Personal OS public and private boundaries"
          >
            <span className="premium-hero-signal premium-hero-signal-public">
              <span className="premium-hero-signal-dot" aria-hidden="true" />
              Public studio
            </span>
            <span className="premium-hero-signal-divider" aria-hidden="true" />
            <span className="premium-hero-signal premium-hero-signal-office">
              <span className="premium-hero-signal-dot" aria-hidden="true" />
              Doraemon Office
            </span>
            <span className="premium-hero-signal-divider" aria-hidden="true" />
            <span className="premium-hero-signal premium-hero-signal-private">
              <span className="premium-hero-signal-dot" aria-hidden="true" />
              Owner Cockpit
            </span>
          </div>
          <div className="premium-hero-actions">
            <Link href="/dora" className="link-focus premium-primary-link">
              <Bot size={18} aria-hidden />
              Enter Doraemon
              <ArrowRight size={16} aria-hidden />
            </Link>
            <Link href="#os-layers" className="link-focus premium-text-link">
              Explore the system
              <ArrowRight size={16} aria-hidden />
            </Link>
            <Link href="/projects" className="link-focus premium-text-link">
              See what&apos;s public
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>

        <aside className="premium-office-capsule" aria-label="Public-safe Doraemon Office status">
          <div className="premium-office-capsule-head">
            <div>
              <span>Doraemon Office</span>
              <strong>Public-safe agent layer</strong>
            </div>
            <span className="premium-office-status-pill">
              <span aria-hidden="true" />
              Public-safe
            </span>
          </div>

          <p className="premium-office-capsule-copy">
            Doraemon is the doorway into the public-safe Personal OS: MiniDora presence,
            activity, schedules, research rhythm, and system posture, without private task detail.
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
                <Link
                  key={surface.title}
                  href={surface.href}
                  prefetch={surface.href.startsWith("/app") ? false : undefined}
                  className="link-focus premium-surface-link"
                >
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
        <div className="premium-hero-next-rail" aria-hidden="true">
          <span>Next</span>
          <strong>Four clear Personal OS surfaces</strong>
        </div>
      </div>
    </section>
  );
}
