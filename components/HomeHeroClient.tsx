"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bot, Clock3, FlaskConical, LineChart, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { localizeSiteText } from "@/lib/site-i18n";
import type { PublicDoraEventClientView } from "@/lib/dora-public-client";

type HomeHeroEvent = PublicDoraEventClientView & {
  displayTime: string;
};

const heroSurfaces = [
  {
    title: "Public Studio",
    summary: "Essays, ideas, projects",
    href: "/projects",
    stateLabel: "Public",
    icon: FlaskConical
  },
  {
    title: "Doraemon",
    summary: "Guide and public office",
    href: "/dora",
    stateLabel: "Public-safe",
    icon: Bot
  },
  {
    title: "Owner Cockpit",
    summary: "Private review and approvals",
    href: "/app",
    stateLabel: "Private",
    icon: LockKeyhole
  },
  {
    title: "Research Desk",
    summary: "Long-form research notes",
    href: "/lab",
    stateLabel: "Research-only",
    icon: LineChart
  }
] as const;

const heroSignals = [
  {
    label: "Public studio",
    className: "premium-hero-signal-public"
  },
  {
    label: "Doraemon Office",
    className: "premium-hero-signal-office"
  },
  {
    label: "Owner Cockpit",
    className: "premium-hero-signal-private"
  }
] as const;

const heroProofs = [
  {
    label: "Research in public",
    value: "Physics, AI, systems"
  },
  {
    label: "Doraemon visible",
    value: "Agent rhythm, sanitized"
  },
  {
    label: "Owner gated",
    value: "Private decisions stay private"
  }
] as const;

export function HomeHeroClient({ recentEvents }: { recentEvents: HomeHeroEvent[] }) {
  const { locale } = useLanguage();
  const t = (value: string) => localizeSiteText(value, locale);

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
          <p className="premium-hero-kicker">
            <span>{t("Personal research studio")}</span>
            <span>{t("Doraemon-ready")}</span>
          </p>
          <h1 className="premium-hero-title" aria-label={t("Weiyu's Personal OS with Doraemon.")}>
            <span className="premium-hero-name">{t("Weiyu's")}</span>
            <span className="premium-hero-os">Personal OS</span>
            <span className="premium-hero-line">
              <em>{t("with Doraemon.")}</em>
            </span>
          </h1>
          <p className="premium-hero-lede">{t("Doraemon coordinates. MiniDoras work. Weiyu decides.")}</p>
          <p className="premium-hero-support">
            {t(
              "A public home for physics, AI systems, research tools, and the agent team behind the work. Doraemon Office makes the Personal OS visible without exposing private tasks, prompts, or controls."
            )}
          </p>

          <div className="premium-hero-proofbar" aria-label={t("Homepage Personal OS proof points")}>
            {heroProofs.map((proof) => (
              <span key={proof.label}>
                <strong>{t(proof.label)}</strong>
                <small>{t(proof.value)}</small>
              </span>
            ))}
          </div>

          <div
            className="premium-hero-statusline"
            role="group"
            aria-label={t("Personal OS public and private boundaries")}
          >
            {heroSignals.map((signal, index) => (
              <span key={signal.label} className="premium-hero-status-item">
                <span className={`premium-hero-signal ${signal.className}`}>
                  <span className="premium-hero-signal-dot" aria-hidden="true" />
                  {t(signal.label)}
                </span>
                {index < heroSignals.length - 1 ? (
                  <span className="premium-hero-signal-divider" aria-hidden="true" />
                ) : null}
              </span>
            ))}
          </div>

          <div className="premium-hero-actions">
            <Link href="/dora" className="link-focus premium-primary-link">
              <Bot size={18} aria-hidden />
              {t("Enter Doraemon")}
              <ArrowRight size={16} aria-hidden />
            </Link>
            <Link href="#os-layers" className="link-focus premium-text-link">
              {t("Explore the system")}
              <ArrowRight size={16} aria-hidden />
            </Link>
            <Link href="/projects" className="link-focus premium-text-link">
              {t("See what's public")}
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>

        <aside className="premium-office-capsule" aria-label={t("Public-safe Doraemon Office status")}>
          <div className="premium-office-capsule-head">
            <div>
              <span>{t("Doraemon Office")}</span>
              <strong>{t("Public-safe agent layer")}</strong>
            </div>
            <span className="premium-office-status-pill">
              <span aria-hidden="true" />
              {t("Public-safe")}
            </span>
          </div>

          <p className="premium-office-capsule-copy">
            {t(
              "Doraemon is the doorway into the public-safe Personal OS: MiniDora presence, activity, schedules, research rhythm, and system posture, without private task detail."
            )}
          </p>

          <div className="premium-office-boundary">
            <div className="premium-office-boundary-row">
              <LockKeyhole size={17} aria-hidden />
              <span>
                <strong>{t("Private Area")}</strong>
                <small>{t("Owner-only cockpit")}</small>
              </span>
            </div>
            <div className="premium-office-boundary-row">
              <ShieldCheck size={17} aria-hidden />
              <span>
                <strong>{t("Public Window")}</strong>
                <small>{t("Sanitized. Demo-safe. Read-only.")}</small>
              </span>
            </div>
          </div>
        </aside>

        <div className="premium-hero-bottom-deck">
          <section className="premium-office-events premium-hero-demo-strip" aria-label={t("Public activity (demo-safe)")}>
            <div className="premium-office-events-head">
              <span>
                <Clock3 size={14} aria-hidden />
                {t("Public activity (demo-safe)")}
              </span>
              <Link href="/dora/activity" className="link-focus">
                {t("View all")}
                <ArrowRight size={13} aria-hidden />
              </Link>
            </div>
            <ol>
              {recentEvents.map((event) => (
                <li key={event.event_id}>
                  <time dateTime={event.created_at}>{event.displayTime}</time>
                  <strong>{event.agent}</strong>
                  <span>{event.title}</span>
                </li>
              ))}
            </ol>
          </section>

          <div className="premium-surface-rail" aria-label={t("Personal OS connected surfaces")}>
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
                  <span className="premium-surface-copy">
                    <strong>{t(surface.title)}</strong>
                    <small>{t(surface.summary)}</small>
                  </span>
                  <span className="premium-surface-state">{t(surface.stateLabel)}</span>
                </Link>
              );
            })}
            <span className="premium-surface-rail-note">
              <Sparkles size={14} aria-hidden />
              {t("Public surfaces stay visible. Owner work stays private.")}
            </span>
          </div>
        </div>
        <div className="premium-hero-next-rail" aria-hidden="true">
          <span>{t("Next")}</span>
          <strong>{t("Four clear Personal OS surfaces")}</strong>
        </div>
      </div>
    </section>
  );
}
