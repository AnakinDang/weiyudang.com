import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  Globe2,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react";
import { DoraemonMark } from "@/components/DoraemonMark";
import { SiteChrome } from "@/components/SiteChrome";
import { DORA_LIVE_BRIDGE_URL, formatPublicEventTime, getRecentPublicDoraEvents } from "@/lib/dora-office";

export const metadata: Metadata = {
  title: "Doraemon",
  description: "The public Doraemon entry for Weiyu Dang's personal AI operating system."
};

const capabilities = [
  {
    title: "Multi-Agent Team",
    summary: "Specialized MiniDoras collaborate in real time across research, writing, data, strategy, and operations.",
    icon: Users
  },
  {
    title: "Always On, Always Learning",
    summary: "Doraemon continuously monitors, analyzes, summarizes, and improves the work loop.",
    icon: RefreshCw
  },
  {
    title: "Owner in the Loop",
    summary: "Weiyu sets direction, reviews decisions, and keeps execution bounded by human judgment.",
    icon: ShieldCheck
  },
  {
    title: "Public Window",
    summary: "Selected visibility is sanitized, real-time safe, and designed with privacy first.",
    icon: Globe2
  }
] as const;

const contextItems = [
  {
    title: "Personal OS",
    summary: "Doraemon Office is the operating layer of Weiyu's work and thinking.",
    href: "/projects/doraemon-agent-system",
    icon: Users
  },
  {
    title: "Built with Discipline",
    summary: "Strong privacy boundary, clean architecture, and clear principles.",
    href: "/dora/system",
    icon: ShieldCheck
  },
  {
    title: "Open in the Right Way",
    summary: "The public window exists to inspire and build trust, not to expose internals.",
    href: "/dora/office",
    icon: FileText
  },
  {
    title: "Long-Term Vision",
    summary: "Better thinking, better work, and more impact over time.",
    href: "/projects/weiyu-ai",
    icon: Sparkles
  }
] as const;

const miniDoraRoles = [
  {
    name: "Research MiniDora",
    summary: "Finds signals, reads deeply, and prepares evidence."
  },
  {
    name: "Dev MiniDora",
    summary: "Turns product slices into working software."
  },
  {
    name: "Product MiniDora",
    summary: "Shapes scope, quality, and release rhythm."
  },
  {
    name: "Ops MiniDora",
    summary: "Keeps schedules, health, and routines clear."
  },
  {
    name: "Memory MiniDora",
    summary: "Maintains long-term context and knowledge."
  },
  {
    name: "Trading MiniDora",
    summary: "Organizes market research with no execution."
  },
  {
    name: "Media MiniDora",
    summary: "Creates public-safe visuals and story assets."
  }
] as const;

const heroAgentLabels = [
  "Strategy MiniDora",
  "Research MiniDora",
  "Data MiniDora",
  "Market MiniDora",
  "Operations MiniDora"
] as const;

const publicItems = ["Sanitized activity", "High-level state", "Agent presence", "System health"];
const privateItems = ["Owner tasks and notes", "Strategies and playbooks", "Knowledge and data", "Accounts and integrations"];

export default function DoraPage() {
  const recentEvents = getRecentPublicDoraEvents(5);
  const liveBridgeHost = DORA_LIVE_BRIDGE_URL.replace(/^https?:\/\//, "");

  return (
    <SiteChrome headerVariant="doraemon">
      <div className="doraemon-entry-page">
        <section className="doraemon-doorway">
          <div className="container doraemon-doorway-grid">
            <div className="doraemon-doorway-copy">
              <h1 aria-label="Doraemon Office">
                <span>Doraemon</span>
                <span>Office</span>
              </h1>
              <p className="doraemon-doorway-lede">The public window into Weiyu&apos;s personal AI command room.</p>
              <div className="doraemon-doorway-actions">
                <Link href="/dora/office" className="link-focus doraemon-primary-action">
                  Enter Doraemon Office
                  <ArrowRight size={17} aria-hidden />
                </Link>
                <Link href="#minidoras" className="link-focus doraemon-quiet-action">
                  Meet the MiniDoras
                  <ArrowRight size={15} aria-hidden />
                </Link>
                <Link href="/projects/doraemon-agent-system" className="link-focus doraemon-quiet-action">
                  Read the project
                  <ArrowRight size={15} aria-hidden />
                </Link>
              </div>
            </div>

            <div
              className="doraemon-command-preview"
              role="img"
              aria-label="Public Doraemon Office preview with MiniDora agents, a sanitized activity strip, and a public/private boundary."
            >
              <div className="doraemon-portal-stage" aria-hidden="true">
                <Image
                  src="/visuals/doraemon-office-doorway-v3.png"
                  alt=""
                  width={1586}
                  height={992}
                  priority
                  quality={95}
                  sizes="(max-width: 1040px) 100vw, 58vw"
                />
                <div className="doraemon-portal-panel">
                  <strong>Doraemon Office</strong>
                  <p>A personal AI command room built for thinking, creating, and long-term impact.</p>
                  <div className="doraemon-boundary-row">
                    <LockKeyhole size={16} aria-hidden />
                    <span>Private Area</span>
                    <small>Owner-only</small>
                  </div>
                  <div className="doraemon-boundary-row">
                    <Eye size={16} aria-hidden />
                    <span>Public Window</span>
                    <small>Sanitized. Real-time. Safe.</small>
                  </div>
                </div>
                <div className="doraemon-orbit-labels" aria-hidden="true">
                  {heroAgentLabels.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
              </div>

              <div className="doraemon-activity-preview" aria-label="Recent public-safe Doraemon activity">
                <div className="doraemon-activity-preview-head">
                  <span>
                    <Clock3 size={14} aria-hidden />
                    Recent activity (public-safe)
                  </span>
                  <small>Demo replay</small>
                </div>
                <div className="doraemon-activity-ticks">
                  {recentEvents.map((event) => (
                    <div
                      key={event.event_id}
                      className={`doraemon-activity-tick doraemon-activity-tick-${event.severity}`}
                    >
                      <time>{formatPublicEventTime(event.created_at)}</time>
                      <strong>{event.agent}</strong>
                      <span>{event.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="what-doraemon-does" className="doraemon-entry-section">
          <div className="container doraemon-capability-grid">
            <div className="doraemon-radar" aria-hidden="true">
              <DoraemonMark className="doraemon-radar-mark" />
              <span className="doraemon-radar-ring doraemon-radar-ring-one" />
              <span className="doraemon-radar-ring doraemon-radar-ring-two" />
              <span className="doraemon-radar-bell">
                <Bell size={28} aria-hidden />
              </span>
            </div>
            <div>
              <h2>What Doraemon Does</h2>
              <p>
                Doraemon Office is Weiyu&apos;s personal AI command room. A team of MiniDoras work across research,
                writing, data, strategy, and operations, coordinated to turn ideas into impact.
              </p>
              <div className="doraemon-capability-list">
                {capabilities.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article key={item.title}>
                      <span className="doraemon-capability-icon">
                        <Icon size={20} aria-hidden />
                      </span>
                      <h3>{item.title}</h3>
                      <p>{item.summary}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="minidoras" className="doraemon-entry-section doraemon-minidora-section">
          <div className="container doraemon-minidora-grid">
            <div>
              <h2>Meet the MiniDoras</h2>
              <p>
                From research to writing, from data to operations, each MiniDora has a clear role in the public-safe
                story of the office.
              </p>
              <Link href="/dora/team" className="link-focus doraemon-inline-link">
                Explore the team
                <ArrowRight size={15} aria-hidden />
              </Link>
            </div>
            <div className="doraemon-agent-strip">
              {miniDoraRoles.map((agent) => (
                <article key={agent.name}>
                  <DoraemonMark className="doraemon-card-mark" />
                  <h3>{agent.name}</h3>
                  <p>{agent.summary}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="doraemon-entry-section">
          <div className="container doraemon-safety-grid">
            <div>
              <h2>Public Safety Boundary</h2>
              <p>Your trust matters. The public window is designed with a strict boundary.</p>
              <ul className="doraemon-safety-list">
                <li>
                  <CheckCircle2 size={16} aria-hidden />
                  No private tasks or notes.
                </li>
                <li>
                  <CheckCircle2 size={16} aria-hidden />
                  No prompts or workflows.
                </li>
                <li>
                  <CheckCircle2 size={16} aria-hidden />
                  No accounts or credentials.
                </li>
                <li>
                  <CheckCircle2 size={16} aria-hidden />
                  No trading or execution.
                </li>
                <li>
                  <CheckCircle2 size={16} aria-hidden />
                  Research-only. Not an order, recommendation, or execution system.
                </li>
              </ul>
            </div>
            <div className="doraemon-boundary-panel">
              <div>
                <h3>Public Window</h3>
                <ul>
                  {publicItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <span className="doraemon-boundary-divider">
                <Bell size={20} aria-hidden />
              </span>
              <div>
                <h3>Private Area</h3>
                <ul>
                  {privateItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <DoraemonMark className="doraemon-safety-mark" />
          </div>
        </section>

        <section className="doraemon-entry-section doraemon-context-section">
          <div className="container">
            <div className="doraemon-context-head">
              <h2>Project Context</h2>
              <p>This is a long-term Personal OS experiment. Built in public. Designed to compound.</p>
            </div>
            <div className="doraemon-context-links">
              {contextItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.title} href={item.href} className="link-focus">
                    <Icon size={20} aria-hidden />
                    <strong>{item.title}</strong>
                    <span>{item.summary}</span>
                  </Link>
                );
              })}
            </div>
            <div className="doraemon-live-note">
              <span>Current bridge</span>
              <a href={DORA_LIVE_BRIDGE_URL} target="_blank" rel="noreferrer" className="link-focus">
                {liveBridgeHost}
                <ArrowRight size={14} aria-hidden />
              </a>
            </div>
          </div>
        </section>
      </div>
    </SiteChrome>
  );
}
