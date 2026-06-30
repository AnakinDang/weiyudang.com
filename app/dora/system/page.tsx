import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Database,
  Eye,
  Layers3,
  LockKeyhole,
  Radio,
  RefreshCw,
  ShieldCheck,
  Signal,
  Sparkles,
  TimerReset
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SystemHealthPanel } from "@/app/dora/system/SystemHealthPanel";
import { DoraemonMark } from "@/components/DoraemonMark";
import { DoraOfficeCommandSpine } from "@/components/DoraOfficeCommandSpine";
import { DoraOfficeOperatingRhythm } from "@/components/DoraOfficeOperatingRhythm";
import { DoraOfficeRouteDock } from "@/components/DoraOfficeRouteDock";
import { SiteChrome } from "@/components/SiteChrome";
import { StatusBadge } from "@/components/StatusBadge";
import { publicSystemToneClasses } from "@/lib/dora-public-client";
import {
  publicSystemBoundaries,
  publicSystemEvents,
  publicSystemStatus
} from "@/lib/dora-office";

export const metadata: Metadata = {
  title: "Doraemon System",
  description: "Public-safe Doraemon Office system status without private infrastructure details or owner-only controls."
};

type PublicSystemStatus = (typeof publicSystemStatus)[number];

const systemIcons = {
  "Relay mode": Radio,
  "Public schema": ShieldCheck,
  "Event freshness": TimerReset,
  "Replay buffer": RefreshCw
} as const satisfies Record<PublicSystemStatus["label"], LucideIcon>;

// The hero lens is a stable schema preview — it names WHAT each public check
// measures, while the live current values render in the register below. This
// keeps the prominent hero from contradicting the live "Live relay" register.
const heroSchemaNotes = {
  "Relay mode": "Live / demo posture",
  "Public schema": "Closed allowlist",
  "Event freshness": "Sanitized event age",
  "Replay buffer": "Dedupe by opaque ID"
} as const satisfies Record<PublicSystemStatus["label"], string>;

const systemStats = [
  { label: "Public checks", value: publicSystemStatus.length.toString(), icon: Signal },
  { label: "Safe counters", value: "Only", icon: Database },
  { label: "Owner controls", value: "0", icon: LockKeyhole },
  { label: "Private internals", value: "Hidden", icon: ShieldCheck }
] as const;

const systemPrinciples = [
  {
    title: "Safe signal",
    summary: "Only coarse public health posture crosses the boundary.",
    icon: Signal
  },
  {
    title: "Closed schema",
    summary: "Explicit public fields render; surprise fields stay out.",
    icon: ShieldCheck
  },
  {
    title: "Read-only",
    summary: "Visitors can inspect status, never change public or private systems.",
    icon: Eye
  },
  {
    title: "Graceful fallback",
    summary: "A demo snapshot keeps the public window useful if live health is unavailable.",
    icon: Sparkles
  }
] as const;

const publicSignalItems = ["Live / demo posture", "Closed schema", "Safe counters", "Public events"] as const;
const privateAreaItems = ["Diagnostics hidden", "Owner actions hidden", "Infrastructure hidden", "Private data hidden"] as const;

const continuationRoutes = [
  {
    title: "Doraemon Office",
    summary: "Return to the public command-room overview.",
    href: "/dora/office",
    icon: Radio,
    action: "Open office"
  },
  {
    title: "Activity Timeline",
    summary: "Read sanitized event labels around system posture.",
    href: "/dora/activity",
    icon: ClipboardList,
    action: "View activity"
  },
  {
    title: "Team Agents",
    summary: "See the MiniDora roles behind public health signals.",
    href: "/dora/team",
    icon: Layers3,
    action: "Meet team"
  },
  {
    title: "Tasks",
    summary: "Pair attention states with public task posture.",
    href: "/dora/tasks",
    icon: CheckCircle2,
    action: "View tasks"
  },
  {
    title: "Schedules",
    summary: "See the operating rhythm behind system checks.",
    href: "/dora/schedules",
    icon: TimerReset,
    action: "View schedules"
  },
  {
    title: "Knowledge",
    summary: "Understand curated outputs without private source material.",
    href: "/dora/knowledge",
    icon: Sparkles,
    action: "Open knowledge"
  }
] as const;

export default function DoraSystemPage() {
  // The hero lens has four authored node positions; the register below remains authoritative.
  const heroStatuses = publicSystemStatus.slice(0, 4);
  const primaryStatus = publicSystemStatus[0];

  return (
    <SiteChrome headerVariant="doraemon" headerActiveHref="/dora">
      <div className="dora-system-landing">
        <div className="dora-office-route-dock-wrap">
          <DoraOfficeRouteDock active="/dora/system" />
        </div>
        <DoraOfficeCommandSpine active="/dora/system" />
        <section className="dora-system-landing-hero" aria-labelledby="dora-system-title">
          <div className="container dora-system-landing-hero-grid">
            <div className="dora-system-landing-copy">
              <h1 id="dora-system-title">
                <span>Doraemon</span>
                {" "}
                System
              </h1>
              <p>Public health signal without private infrastructure.</p>
              <div className="dora-system-landing-rule" aria-hidden />
              <div className="dora-system-landing-actions">
                <a href="#public-health-register" className="link-focus dora-office-primary-cta">
                  View public health
                  <ArrowRight size={19} aria-hidden />
                </a>
                <div className="dora-office-secondary-actions">
                  <Link href="/dora/office" className="link-focus dora-office-text-link">
                    Doraemon Office
                    <ArrowRight size={15} aria-hidden />
                  </Link>
                  <Link href="/dora/activity" className="link-focus dora-office-text-link">
                    Activity Log
                    <ArrowRight size={15} aria-hidden />
                  </Link>
                </div>
              </div>
            </div>

            <div className="dora-system-command-visual">
              <section className="dora-system-command-stage" aria-label="Public Doraemon system health preview">
                <div className="dora-system-command-room" aria-hidden>
                  <span />
                  <span />
                  <span />
                </div>

                <div className="dora-system-command-boundary">
                  <strong>Public Signal</strong>
                  <p>Live/demo posture, closed schema, and safe counters only.</p>
                  <div>
                    <Signal size={17} aria-hidden />
                    <span>Live / demo posture</span>
                  </div>
                  <div>
                    <ShieldCheck size={17} aria-hidden />
                    <span>Closed schema</span>
                  </div>
                  <div>
                    <LockKeyhole size={17} aria-hidden />
                    <span>Private area hidden</span>
                  </div>
                </div>

                <div className="dora-system-command-lens" aria-hidden>
                  <span className="dora-system-command-ring dora-system-command-ring-1" />
                  <span className="dora-system-command-ring dora-system-command-ring-2" />
                  <span className="dora-system-command-ring dora-system-command-ring-3" />
                  <article className="dora-system-command-hub">
                    <DoraemonMark />
                    <strong>Public health</strong>
                    <small>{heroSchemaNotes[primaryStatus.label]}</small>
                  </article>
                  {heroStatuses.map((status, index) => {
                    const Icon = systemIcons[status.label];

                    return (
                      <article key={status.label} className={`dora-system-command-node dora-system-command-node-${index + 1}`}>
                        <span className={publicSystemToneClasses[status.tone]}>
                          <Icon size={16} aria-hidden />
                        </span>
                        <strong>{status.label}</strong>
                        <small>{heroSchemaNotes[status.label]}</small>
                      </article>
                    );
                  })}
                </div>

                <section className="dora-system-command-strip" aria-label="Public health rail preview">
                  <div>
                    <span aria-hidden />
                    <strong>Health rail</strong>
                    <small>{publicSystemStatus.length} public checks</small>
                  </div>
                  <ol>
                    {heroStatuses.map((status) => (
                      <li key={status.label}>
                        <span>{status.label}</span>
                        <strong>{heroSchemaNotes[status.label]}</strong>
                        <small>public-safe</small>
                      </li>
                    ))}
                  </ol>
                </section>
              </section>
            </div>
          </div>
        </section>

        <section
          className="dora-system-landing-section dora-system-register-section"
          id="public-health-register"
          aria-labelledby="public-health-register-title"
        >
          <div className="container dora-system-register-heading">
            <div>
              <h2 id="public-health-register-title">Public Health Register</h2>
              <p>Live relay health resolves into safe labels and aggregate counts. Private operations never render.</p>
            </div>
            <div className="dora-system-log-stats" aria-label="Public system summary">
              {systemStats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <article key={stat.label}>
                    <Icon size={20} aria-hidden />
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </article>
                );
              })}
            </div>
          </div>
          <div className="container">
            <SystemHealthPanel statuses={publicSystemStatus} events={publicSystemEvents} boundaries={publicSystemBoundaries} />
          </div>
        </section>

        <section className="dora-system-landing-section dora-system-boundary-section" aria-labelledby="dora-system-boundary-title">
          <div className="container dora-system-boundary-grid">
            <div className="dora-system-section-copy">
              <h2 id="dora-system-boundary-title">Public System Boundary</h2>
              <p>A strict boundary keeps Weiyu&apos;s private systems private while still showing whether the public window is healthy.</p>
              <ul className="dora-office-boundary-list">
                {publicSystemBoundaries.map((rule) => (
                  <li key={rule}>
                    <ShieldCheck size={15} aria-hidden />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="dora-system-boundary-diagram" aria-label="Public signal and private operations boundary">
              <div>
                <Eye size={22} aria-hidden />
                <strong>Public Window</strong>
                <ul>
                  {publicSignalItems.map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={14} aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <LockKeyhole size={22} aria-hidden />
                <strong>Private Area</strong>
                <ul>
                  {privateAreaItems.map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={14} aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <span className="dora-system-boundary-mark" aria-hidden>
                <DoraemonMark />
              </span>
            </div>
          </div>
        </section>

        <section className="dora-system-landing-section dora-system-principles-section" aria-label="Public system health principles">
          <div className="container dora-system-principles-grid">
            {systemPrinciples.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title}>
                  <span>
                    <Icon size={18} aria-hidden />
                  </span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.summary}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <DoraOfficeOperatingRhythm
          surface="system"
          title="System health closes the public readiness loop"
          summary="The public dashboard can say whether the office window is healthy without becoming an operations console."
        />

        <section className="dora-system-landing-section dora-system-continuation-section" aria-label="Doraemon System continuation routes">
          <div className="container dora-office-command-shell">
            <div className="dora-office-command-heading">
              <h2>Continue Through Doraemon Office</h2>
              <p>Explore the public-safe windows inside Weiyu&apos;s personal AI command room.</p>
            </div>
            <div className="dora-office-command-grid">
              {continuationRoutes.map((route) => {
                const Icon = route.icon;

                return (
                  <Link key={route.href} href={route.href} className="link-focus dora-office-command-card">
                    <Icon size={24} aria-hidden />
                    <h3>{route.title}</h3>
                    <p>{route.summary}</p>
                    <StatusBadge tone="info">Read-only</StatusBadge>
                    <span className="dora-office-text-link">
                      {route.action}
                      <ArrowRight size={15} aria-hidden />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </SiteChrome>
  );
}
