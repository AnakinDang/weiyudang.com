import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  ClipboardList,
  Eye,
  Layers3,
  ListChecks,
  LockKeyhole,
  Radio,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TimerReset
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { TaskBoard } from "@/app/dora/tasks/TaskBoard";
import { DoraemonMark } from "@/components/DoraemonMark";
import { DoraOfficeCommandSpine } from "@/components/DoraOfficeCommandSpine";
import { DoraOfficeOperatingRhythm } from "@/components/DoraOfficeOperatingRhythm";
import { DoraOfficeRouteDock } from "@/components/DoraOfficeRouteDock";
import { SiteChrome } from "@/components/SiteChrome";
import { StatusBadge } from "@/components/StatusBadge";
import { publicDoraTaskToneClasses } from "@/lib/dora-public-client";
import { publicDoraTasks, publicDoraTaskStats } from "@/lib/dora-office";

export const metadata: Metadata = {
  title: "Doraemon Tasks",
  description: "Public-safe Doraemon Office task aggregation with opaque IDs, fixed titles, and no execution controls."
};

type PublicTaskStat = (typeof publicDoraTaskStats)[number];

const statIcons = {
  Working: TimerReset,
  "Owner review": Bell,
  Attention: ShieldAlert,
  Completed: CheckCircle2
} as const satisfies Record<PublicTaskStat["label"], LucideIcon>;

const taskPrinciples = [
  {
    title: "Opaque IDs",
    summary: "Public keys remain stable without revealing internal run or task names.",
    icon: Eye
  },
  {
    title: "Fixed labels",
    summary: "Visible task titles use the canonical public vocabulary only.",
    icon: ListChecks
  },
  {
    title: "Owner checkpoints",
    summary: "Review signals can appear without exposing task bodies or notes.",
    icon: Bell
  },
  {
    title: "Display-only",
    summary: "No approve, retry, submit, mutation, or execution controls are public.",
    icon: LockKeyhole
  }
] as const;

const publicQueueItems = ["Opaque task keys", "Fixed public titles", "Agent role", "Updated posture"] as const;
const privateWorkItems = ["Task names", "Prompts and notes", "Project paths", "Execution controls"] as const;

const continuationRoutes = [
  {
    title: "Doraemon Office",
    summary: "Return to the public command-room overview.",
    href: "/dora/office",
    icon: Radio,
    action: "Open office"
  },
  {
    title: "Activity Log",
    summary: "Read the surrounding public-safe event stream.",
    href: "/dora/activity",
    icon: ClipboardList,
    action: "View activity"
  },
  {
    title: "Team Agents",
    summary: "See the MiniDora roles behind each public task posture.",
    href: "/dora/team",
    icon: Layers3,
    action: "Meet team"
  },
  {
    title: "Project Context",
    summary: "Read how Doraemon fits into the Personal OS experiment.",
    href: "/projects/doraemon-agent-system",
    icon: Sparkles,
    action: "Read project"
  }
] as const;

export default function DoraTasksPage() {
  const heroTasks = publicDoraTasks.slice(0, 4);
  const ownerReviewCount = publicDoraTasks.filter((task) => task.state === "Owner review").length;
  const attentionCount = publicDoraTasks.filter((task) => task.state === "Attention").length;
  const taskCommandCards = [
    {
      title: "Queue Posture",
      summary: "Aggregated public task state, with fixed titles and opaque keys.",
      icon: ClipboardList,
      rows: [
        { label: "Groups", value: publicDoraTasks.length },
        { label: "Owner review", value: ownerReviewCount },
        { label: "Attention", value: attentionCount }
      ]
    },
    {
      title: "Public Boundary",
      summary: "The public queue shows posture, not task content.",
      icon: ShieldCheck,
      items: ["No task names", "No prompts or notes", "No project paths"]
    },
    {
      title: "Display-only",
      summary: "Public visitors can inspect state but cannot mutate work.",
      icon: LockKeyhole,
      items: ["No approve control", "No retry control", "No execution path"]
    }
  ] as const;

  return (
    <SiteChrome headerVariant="doraemon" headerActiveHref="/dora">
      <div className="dora-tasks-landing">
        <div className="dora-office-route-dock-wrap">
          <DoraOfficeRouteDock active="/dora/tasks" />
        </div>
        <DoraOfficeCommandSpine active="/dora/tasks" />
        <section className="dora-tasks-landing-hero" aria-labelledby="dora-tasks-title">
          <div className="container dora-tasks-landing-hero-grid">
            <div className="dora-tasks-landing-copy">
              <h1 id="dora-tasks-title">
                <span>Doraemon</span>
                {" "}
                Tasks
              </h1>
              <p>Public task posture without private task content.</p>
              <div className="dora-tasks-landing-rule" aria-hidden />
              <div className="dora-tasks-landing-actions">
                <a href="#public-task-queue" className="link-focus dora-office-primary-cta">
                  Explore public queue
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

            <div className="dora-tasks-command-visual">
              <section className="dora-tasks-command-stage" aria-label="Public Doraemon task posture preview">
                <div className="dora-tasks-command-backdrop" aria-hidden>
                  <span />
                  <span />
                  <span />
                </div>

                <div className="dora-tasks-command-card">
                  <strong>Task Posture</strong>
                  <p>Aggregated state counts. No private task body.</p>
                  <div>
                    <Eye size={17} aria-hidden />
                    <span>Public queue</span>
                  </div>
                  <div>
                    <LockKeyhole size={17} aria-hidden />
                    <span>Private work hidden</span>
                  </div>
                </div>

                <div className="dora-tasks-command-orbit" aria-hidden>
                  <span className="dora-tasks-command-ring dora-tasks-command-ring-1" />
                  <span className="dora-tasks-command-ring dora-tasks-command-ring-2" />
                  <span className="dora-tasks-command-ring dora-tasks-command-ring-3" />
                  <article className="dora-tasks-command-hub">
                    <DoraemonMark />
                    <strong>Doraemon</strong>
                    <small>coordinates</small>
                  </article>
                  {heroTasks.map((task, index) => (
                    <article key={task.publicKey} className={`dora-tasks-command-node dora-tasks-command-node-${index + 1}`}>
                      <span className={publicDoraTaskToneClasses[task.state]} />
                      <strong>{task.state}</strong>
                      <small>{task.agentRole}</small>
                    </article>
                  ))}
                </div>

                <section className="dora-tasks-command-stream" aria-label="Recent public task posture preview">
                  <div>
                    <span aria-hidden />
                    <strong>Public task posture</strong>
                    <small>Demo fallback · {publicDoraTasks.length} sanitized task groups</small>
                  </div>
                  <ol>
                    {heroTasks.map((task) => (
                      <li key={task.publicKey}>
                        <span>{task.publicKey}</span>
                        <strong>{task.title}</strong>
                        <small>{task.updated}</small>
                      </li>
                    ))}
                  </ol>
                </section>
              </section>
            </div>

            <aside className="dora-tasks-command-rail" aria-label="Doraemon Tasks public context">
              {taskCommandCards.map((item) => {
                const Icon = item.icon;

                return (
                  <section key={item.title} className="dora-office-product-command-card">
                    <Icon size={20} aria-hidden />
                    <h2>{item.title}</h2>
                    <p>{item.summary}</p>
                    {"rows" in item ? (
                      <dl>
                        {item.rows.map(({ label, value }) => (
                          <div key={label}>
                            <dt>{label}</dt>
                            <dd>{value}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : (
                      <ul>
                        {item.items.map((entry) => (
                          <li key={entry}>
                            <ShieldCheck size={14} aria-hidden />
                            {entry}
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                );
              })}
            </aside>
          </div>
        </section>

        <section
          className="dora-tasks-landing-section dora-tasks-queue-section"
          id="public-task-queue"
          aria-labelledby="public-task-queue-title"
        >
          <div className="container dora-tasks-queue-heading">
            <div>
              <h2 id="public-task-queue-title">Public Task Queue</h2>
              <p>Filter sanitized groups by public state. Every row uses fixed labels, opaque keys, and coarse timing.</p>
            </div>
            <div className="dora-tasks-log-stats" aria-label="Public task state counts">
              {publicDoraTaskStats.map((stat) => {
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
            <TaskBoard tasks={publicDoraTasks} />
          </div>
        </section>

        <section className="dora-tasks-landing-section dora-tasks-boundary-section" aria-labelledby="dora-tasks-boundary-title">
          <div className="container dora-tasks-boundary-grid">
            <div className="dora-tasks-section-copy">
              <h2 id="dora-tasks-boundary-title">Public Task Boundary</h2>
              <p>The public queue is useful because it is intentionally incomplete. It shows posture, not private work.</p>
              <ul className="dora-office-boundary-list">
                <li>
                  <ShieldCheck size={15} aria-hidden />
                  No prompts or owner notes
                </li>
                <li>
                  <ShieldCheck size={15} aria-hidden />
                  No local paths or raw task names
                </li>
                <li>
                  <ShieldCheck size={15} aria-hidden />
                  No approve, retry, submit, or execution path
                </li>
              </ul>
            </div>

            <div className="dora-tasks-boundary-diagram" aria-label="Public queue and private work boundary">
              <div>
                <Eye size={22} aria-hidden />
                <strong>Public Queue</strong>
                <ul>
                  {publicQueueItems.map((item) => (
                    <li key={item}>
                      <ShieldCheck size={14} aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <LockKeyhole size={22} aria-hidden />
                <strong>Private Work</strong>
                <ul>
                  {privateWorkItems.map((item) => (
                    <li key={item}>
                      <ShieldCheck size={14} aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <span className="dora-tasks-boundary-mark" aria-hidden>
                <DoraemonMark />
              </span>
            </div>
          </div>
        </section>

        <section className="dora-tasks-landing-section dora-tasks-principles-section" aria-label="Public task principles">
          <div className="container dora-tasks-principles-grid">
            {taskPrinciples.map((item) => {
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
          surface="tasks"
          title="Tasks are one signal in the operating loop"
          summary="Schedules create cadence, tasks expose public posture, system health proves readiness, and activity gives the timeline around it."
        />

        <section className="dora-tasks-landing-section dora-tasks-continuation-section" aria-label="Doraemon Tasks continuation routes">
          <div className="container dora-office-command-shell">
            <div className="dora-office-command-heading">
              <h2>Continue Through Doraemon Office</h2>
              <p>
                {ownerReviewCount > 0 ? `${ownerReviewCount} public owner-review checkpoint is visible. ` : ""}
                Move from task posture into the surrounding read-only surfaces.
              </p>
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
