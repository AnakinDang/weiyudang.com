import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Eye,
  FileText,
  Layers3,
  LockKeyhole,
  Radio,
  ShieldCheck,
  Sparkles,
  TimerReset
} from "lucide-react";
import { KnowledgeVaultPanel } from "@/app/dora/knowledge/KnowledgeVaultPanel";
import { DoraemonMark } from "@/components/DoraemonMark";
import { DoraOfficeCommandSpine } from "@/components/DoraOfficeCommandSpine";
import { DoraOfficeHeroArt } from "@/components/DoraOfficeHero";
import { DoraOfficeRouteDock } from "@/components/DoraOfficeRouteDock";
import { SiteChrome } from "@/components/SiteChrome";
import { StatusBadge } from "@/components/StatusBadge";
import { publicKnowledgeBoundaries, publicKnowledgeFlow, publicKnowledgeOutputs, publicKnowledgeStats } from "@/lib/knowledge-vault";

export const metadata: Metadata = {
  title: "Doraemon Knowledge",
  description: "Public Knowledge Vault explanation with curated outputs and no raw private source material."
};

type PublicKnowledgeFlow = (typeof publicKnowledgeFlow)[number];
type PublicKnowledgeStat = (typeof publicKnowledgeStats)[number];

const flowIcons = {
  "Knowledge capture": BookOpen,
  Synthesis: Sparkles,
  "Owner review": ShieldCheck,
  "Public output": FileText
} as const satisfies Record<PublicKnowledgeFlow["step"], LucideIcon>;

const statIcons = {
  "Public outputs": FileText,
  "Publish gates": ShieldCheck,
  "Private sources": LockKeyhole,
  "Source pages": LockKeyhole
} as const satisfies Record<PublicKnowledgeStat["label"], LucideIcon>;

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
    summary: "Read public-safe activity around synthesis and review.",
    href: "/dora/activity",
    icon: ClipboardList,
    action: "View activity"
  },
  {
    title: "Team Agents",
    summary: "Meet the MiniDoras that help shape public outputs.",
    href: "/dora/team",
    icon: Layers3,
    action: "Meet team"
  },
  {
    title: "Tasks",
    summary: "See display-only task posture without private task content.",
    href: "/dora/tasks",
    icon: CheckCircle2,
    action: "View tasks"
  },
  {
    title: "Schedules",
    summary: "Understand the public operating rhythm behind publication.",
    href: "/dora/schedules",
    icon: TimerReset,
    action: "View rhythm"
  },
  {
    title: "System",
    summary: "Check public health posture without infrastructure details.",
    href: "/dora/system",
    icon: ShieldCheck,
    action: "View system"
  }
] as const;

export default function DoraKnowledgePage() {
  // The hero prism has four authored node positions; the register below remains authoritative.
  const heroFlow = publicKnowledgeFlow.slice(0, 4);

  return (
    <SiteChrome headerVariant="doraemon" headerActiveHref="/dora">
      <div className="dora-knowledge-landing">
        <div className="dora-office-route-dock-wrap">
          <DoraOfficeRouteDock active="/dora/knowledge" />
        </div>
        <DoraOfficeCommandSpine active="/dora/knowledge" />

        <section className="dora-knowledge-landing-hero" aria-labelledby="dora-knowledge-title">
          <div className="container dora-knowledge-landing-hero-grid">
            <div className="dora-knowledge-landing-copy">
              <h1 id="dora-knowledge-title">
                <span>Doraemon</span>
                {" "}
                Knowledge
              </h1>
              <p>Public synthesis without exposing private source material.</p>
              <div className="dora-knowledge-landing-rule" aria-hidden />
              <div className="dora-knowledge-landing-actions">
                <a href="#public-knowledge-register" className="link-focus dora-office-primary-cta">
                  View public outputs
                  <ArrowRight size={19} aria-hidden />
                </a>
                <div className="dora-office-secondary-actions">
                  <Link href="/dora/office" className="link-focus dora-office-text-link">
                    Doraemon Office
                    <ArrowRight size={15} aria-hidden />
                  </Link>
                  <Link href="/lab" className="link-focus dora-office-text-link">
                    Lab Notes
                    <ArrowRight size={15} aria-hidden />
                  </Link>
                </div>
              </div>
            </div>

            <div className="dora-knowledge-command-visual">
              <section className="dora-knowledge-command-stage" aria-label="Public Doraemon knowledge synthesis preview">
                <DoraOfficeHeroArt className="dora-knowledge-command-room" sizes="(max-width: 1180px) 100vw, 58vw" />

                <div className="dora-knowledge-command-boundary">
                  <strong>Public Synthesis</strong>
                  <p>Curated pages cross the boundary. Source records, drafts, and unreleased reports stay private.</p>
                  <div>
                    <Eye size={17} aria-hidden />
                    <span>Public summaries</span>
                  </div>
                  <div>
                    <LockKeyhole size={17} aria-hidden />
                    <span>Sources private</span>
                  </div>
                </div>

                <div className="dora-knowledge-command-prism" aria-hidden>
                  <span className="dora-knowledge-command-ring dora-knowledge-command-ring-1" />
                  <span className="dora-knowledge-command-ring dora-knowledge-command-ring-2" />
                  <span className="dora-knowledge-command-ring dora-knowledge-command-ring-3" />
                  <article className="dora-knowledge-command-hub">
                    <DoraemonMark />
                    <strong>Curated output</strong>
                    <small>owner reviewed</small>
                  </article>
                  {heroFlow.map((item, index) => {
                    const Icon = flowIcons[item.step];

                    return (
                      <article key={item.step} className={`dora-knowledge-command-node dora-knowledge-command-node-${index + 1}`}>
                        <span>
                          <Icon size={16} aria-hidden />
                        </span>
                        <strong>{item.step}</strong>
                        <small>{item.shortLabel}</small>
                      </article>
                    );
                  })}
                </div>

                <section className="dora-knowledge-command-strip" aria-label="Public knowledge publish path preview">
                  <div>
                    <span aria-hidden />
                    <strong>Publish path</strong>
                    <small>{publicKnowledgeOutputs.length} public destinations</small>
                  </div>
                  <ol>
                    {heroFlow.map((item) => (
                      <li key={item.step}>
                        <span>{item.shortLabel}</span>
                        <strong>{item.step}</strong>
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
          className="dora-knowledge-landing-section dora-knowledge-register-section"
          id="public-knowledge-register"
          aria-labelledby="public-knowledge-register-title"
        >
          <div className="container dora-knowledge-register-heading">
            <div>
              <h2 id="public-knowledge-register-title">Public Knowledge Register</h2>
              <p>Curated outputs, visible boundaries, and the publish path from private source material to public-safe pages.</p>
            </div>
            <div className="dora-knowledge-log-stats" aria-label="Public Knowledge Vault summary">
              {publicKnowledgeStats.map((stat) => {
                const Icon = statIcons[stat.label];

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
            <KnowledgeVaultPanel
              outputs={publicKnowledgeOutputs}
              flow={publicKnowledgeFlow}
              boundaries={publicKnowledgeBoundaries}
              stats={publicKnowledgeStats}
              showStats={false}
            />
          </div>
        </section>

        <section className="dora-knowledge-continuation-section" aria-labelledby="dora-knowledge-continuation-title">
          <div className="container dora-knowledge-continuation-heading">
            <div>
              <h2 id="dora-knowledge-continuation-title">Continue Through Doraemon Office</h2>
              <p>Every adjacent surface keeps the same public/private boundary: readable public posture, no private control plane.</p>
            </div>
            <div className="dora-knowledge-continuation-posture" aria-label="Continuation safety posture">
              <StatusBadge tone="info">public-safe</StatusBadge>
              <StatusBadge tone="private">display-only</StatusBadge>
            </div>
          </div>
          <div className="container dora-knowledge-continuation-grid">
            {continuationRoutes.map((route) => {
              const Icon = route.icon;

              return (
                <Link key={route.href} href={route.href} className="link-focus dora-knowledge-continuation-card">
                  <span>
                    <Icon size={18} aria-hidden />
                  </span>
                  <div>
                    <h3>{route.title}</h3>
                    <p>{route.summary}</p>
                    <strong>
                      {route.action}
                      <ArrowRight size={14} aria-hidden />
                    </strong>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </SiteChrome>
  );
}
