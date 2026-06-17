import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Bot,
  Brain,
  CheckCircle2,
  Eye,
  FileText,
  LockKeyhole,
  MonitorPlay,
  Radio,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react";
import { SiteChrome } from "@/components/SiteChrome";
import { DORA_LIVE_BRIDGE_URL, formatPublicEventTime, getRecentPublicDoraEvents } from "@/lib/dora-office";
import { getPublicAgents } from "@/lib/public-agents";

export const metadata: Metadata = {
  title: "Doraemon",
  description: "The public Doraemon entry for Weiyu Dang's personal AI operating system."
};

const capabilities = [
  {
    title: "Coordinate agents",
    summary: "Doraemon turns goals into plans, handoffs, checkpoints, and owner review moments.",
    icon: Users
  },
  {
    title: "Track work",
    summary: "The public office shows sanitized state, activity, tasks, schedules, and system heartbeat.",
    icon: MonitorPlay
  },
  {
    title: "Summarize signals",
    summary: "Public context is compressed into readable updates without exposing private source material.",
    icon: Brain
  },
  {
    title: "Guard boundaries",
    summary: "Private prompts, memory, accounts, trading data, and controls stay out of public routes.",
    icon: ShieldCheck
  }
] as const;

const projectLinks = [
  {
    title: "Doraemon Visualizer",
    summary: "The live command-room language behind the public office.",
    href: "/projects/doraemon-agent-system",
    icon: MonitorPlay
  },
  {
    title: "MiniDora Trading Team",
    summary: "Research-only market work with no order or execution path.",
    href: "/projects/minidora-trading",
    icon: Radio
  },
  {
    title: "Knowledge Vault",
    summary: "Curated public outputs, private notes, and evidence boundaries.",
    href: "/dora/knowledge",
    icon: FileText
  },
  {
    title: "Weiyu Personal OS",
    summary: "One site connecting public work, Doraemon, owner workflows, and research.",
    href: "/projects/weiyu-ai",
    icon: Sparkles
  }
] as const;

const publicItems = ["Sanitized activity", "High-level state", "Agent presence", "System health"];
const privateItems = ["Raw prompts and memory", "Private task titles", "Accounts and credentials", "Trading data and controls"];

export default function DoraPage() {
  const agents = getPublicAgents();
  const miniDoras = agents.filter((agent) => agent.displayName.includes("MiniDora"));
  const recentEvents = getRecentPublicDoraEvents(5);
  const liveBridgeHost = DORA_LIVE_BRIDGE_URL.replace(/^https?:\/\//, "");

  return (
    <SiteChrome>
      <div className="doraemon-entry-page">
        <section className="doraemon-doorway">
          <div className="container doraemon-doorway-grid">
            <div className="doraemon-doorway-copy">
              <h1 aria-label="Doraemon Office">
                <span>Doraemon</span>
                <span>Office</span>
              </h1>
              <p className="doraemon-doorway-lede">The public window into Weiyu&apos;s personal AI command room.</p>
              <p className="doraemon-doorway-support">
                Doraemon coordinates. MiniDoras work. Weiyu decides. This entrance stays warm, readable, and strictly
                public-safe.
              </p>
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
              <div className="doraemon-portal" aria-hidden>
                <div className="doraemon-portal-door">
                  <Bot size={42} aria-hidden />
                  <span>Doraemon</span>
                </div>
                <div className="doraemon-portal-panel">
                  <strong>Doraemon Office</strong>
                  <p>A personal AI command room built for thinking, creating, and review.</p>
                  <div className="doraemon-boundary-row">
                    <LockKeyhole size={16} aria-hidden />
                    <span>Private area</span>
                    <small>Owner-only</small>
                  </div>
                  <div className="doraemon-boundary-row">
                    <Eye size={16} aria-hidden />
                    <span>Public window</span>
                    <small>Sanitized and read-only</small>
                  </div>
                </div>
              </div>

              <div className="doraemon-agent-constellation" aria-hidden>
                {agents.slice(0, 5).map((agent, index) => (
                  <div key={agent.publicId} className={`doraemon-agent-node doraemon-agent-node-${index + 1}`}>
                    <span>
                      <Bot size={14} aria-hidden />
                    </span>
                    <small>{agent.displayName.replace(" MiniDora", "")}</small>
                  </div>
                ))}
              </div>

              <div className="doraemon-activity-preview">
                <div className="doraemon-activity-preview-head">
                  <span>
                    <Radio size={14} aria-hidden />
                    Live activity
                  </span>
                  <small>public-safe</small>
                </div>
                <div className="doraemon-activity-ticks">
                  {recentEvents.map((event) => (
                    <div key={event.event_id}>
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
            <div className="doraemon-radar" aria-hidden>
              <span className="doraemon-radar-ring doraemon-radar-ring-one" />
              <span className="doraemon-radar-ring doraemon-radar-ring-two" />
              <span className="doraemon-radar-bell">
                <Bell size={28} aria-hidden />
              </span>
            </div>
            <div>
              <h2>What Doraemon Does</h2>
              <p>
                Doraemon is the operating layer for Weiyu&apos;s agent team: calm coordination, public-readable state,
                and owner-centered review.
              </p>
              <div className="doraemon-capability-list">
                {capabilities.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article key={item.title}>
                      <Icon size={21} aria-hidden />
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
                From research to engineering to trading research, each MiniDora has a clear public-safe role. The full
                roster lives in Team Agents.
              </p>
              <Link href="/dora/team" className="link-focus doraemon-inline-link">
                Explore the team
                <ArrowRight size={15} aria-hidden />
              </Link>
            </div>
            <div className="doraemon-agent-strip">
              {miniDoras.map((agent) => (
                <article key={agent.publicId}>
                  <span className={`office-agent-pulse office-agent-pulse-${agent.state === "done" ? "normal" : "info"}`} />
                  <Bot size={26} aria-hidden />
                  <h3>{agent.displayName}</h3>
                  <p>{agent.summary}</p>
                  <small>{agent.stateLabel}</small>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="doraemon-entry-section">
          <div className="container doraemon-safety-grid">
            <div>
              <h2>Public Safety Boundary</h2>
              <p>
                Public Doraemon Office is read-only and sanitized. It does not expose private tasks, prompts, memory,
                credentials, trading data, or owner-only controls.
              </p>
              <ul className="doraemon-safety-list">
                <li>
                  <CheckCircle2 size={16} aria-hidden />
                  Research-only. Not an order, recommendation, or execution system.
                </li>
                <li>
                  <CheckCircle2 size={16} aria-hidden />
                  Curated public guide only; no public RAG, tools, or runtime actions in this slice.
                </li>
              </ul>
            </div>
            <div className="doraemon-boundary-panel">
              <div>
                <h3>Public window</h3>
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
                <h3>Private area</h3>
                <ul>
                  {privateItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="doraemon-entry-section doraemon-context-section">
          <div className="container">
            <div className="doraemon-context-head">
              <h2>Project Context</h2>
              <p>
                Doraemon is one part of the broader Personal OS: public work, private operations, research surfaces,
                and human review stay connected without collapsing into one unsafe interface.
              </p>
            </div>
            <div className="doraemon-context-links">
              {projectLinks.map((item) => {
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
