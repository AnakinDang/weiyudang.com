"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  ClipboardList,
  Eye,
  LockKeyhole,
  Radio,
  ShieldCheck,
  Sparkles,
  TimerReset
} from "lucide-react";
import { DoraemonMark } from "@/components/DoraemonMark";
import {
  DoraOfficeHeroArt,
  DoraOfficeHeroBoundaryCard,
  DoraOfficeHeroBoundaryStrip,
  DoraOfficeHeroCopy,
  DoraOfficeHeroSignalRail
} from "@/components/DoraOfficeHero";
import { StatusBadge } from "@/components/StatusBadge";
import type { publicDoraTasks, publicDoraTaskStats } from "@/lib/dora-office";

type PublicTask = (typeof publicDoraTasks)[number];
type PublicTaskStat = (typeof publicDoraTaskStats)[number];
type TaskFilter = "all" | PublicTask["state"];

const taskFilters = [
  { value: "all", label: "All" },
  { value: "Owner review", label: "Owner review" },
  { value: "Working", label: "Working" },
  { value: "Completed", label: "Completed" }
] as const satisfies readonly { value: TaskFilter; label: string }[];

const statIcons = {
  Working: TimerReset,
  "Owner review": Bell,
  Completed: CheckCircle2
} as const;

const severityLabels = {
  normal: "Normal",
  warning: "Warning"
} as const satisfies Record<PublicTask["severity"], string>;

function taskToneClass(task: Pick<PublicTask, "severity" | "state">) {
  if (task.severity === "warning") {
    return "is-warning";
  }

  if (task.state === "Completed") {
    return "is-normal";
  }

  return "is-info";
}

export function TaskBoard({ tasks, stats }: { tasks: readonly PublicTask[]; stats: readonly PublicTaskStat[] }) {
  const [filter, setFilter] = useState<TaskFilter>("all");

  const previewTasks = tasks.slice(0, 6);
  const filteredTasks = useMemo(
    () => (filter === "all" ? tasks : tasks.filter((task) => task.state === filter)),
    [filter, tasks]
  );
  const ownerReviewTasks = useMemo(() => tasks.filter((task) => task.state === "Owner review"), [tasks]);

  return (
    <div className="dora-tasks">
      <section className="dora-tasks-hero" aria-label="Public Doraemon task orbit">
        <DoraOfficeHeroArt className="dora-tasks-hero-art" />
        <DoraOfficeHeroCopy
          className="dora-tasks-hero-copy"
          lines={["Public task queue.", "Owner stays in the loop."]}
          summary="Aggregated states only. No execution controls."
        />

        <DoraOfficeHeroBoundaryCard
          className="dora-tasks-hero-boundary-card"
          items={[
            { icon: Eye, title: "Public aggregation", detail: "Opaque keys only" },
            { icon: LockKeyhole, title: "Private details", detail: "Prompts hidden" }
          ]}
        />

        <div className="dora-tasks-orbit" aria-hidden="true">
          <div className="dora-tasks-orbit-ring dora-tasks-orbit-ring-outer" />
          <div className="dora-tasks-orbit-ring dora-tasks-orbit-ring-middle" />
          <div className="dora-tasks-orbit-ring dora-tasks-orbit-ring-inner" />
          <div className="dora-tasks-hub">
            <DoraemonMark />
            <strong>Doraemon</strong>
            <span>coordinates</span>
          </div>
          {tasks.map((task, index) => (
            <div key={task.publicKey} className={`dora-tasks-orbit-node dora-tasks-orbit-node-${index + 1}`}>
              <span className={taskToneClass(task)} />
              <strong>{task.state}</strong>
              <small>{task.agentRole}</small>
            </div>
          ))}
        </div>

        <DoraOfficeHeroBoundaryStrip
          className="dora-tasks-hero-boundary"
          items={[
            { icon: Eye, label: "Public aggregation" },
            { icon: LockKeyhole, label: "Private details hidden" },
            { icon: ShieldCheck, label: "Display-only" }
          ]}
        />

        <DoraOfficeHeroSignalRail
          className="dora-tasks-hero-signal-strip"
          ariaLabel="Public task state preview"
          label="Task state rail"
          items={previewTasks.map((task) => ({
            key: task.publicKey,
            ariaLabel: `${task.publicKey} ${task.title}: ${task.state}`,
            meta: task.publicKey,
            title: task.title,
            detail: task.agentRole
          }))}
        />
      </section>

      <section className="dora-tasks-stats" aria-label="Public task state counts">
        {stats.map((stat) => {
          const Icon = statIcons[stat.label];

          return (
            <article key={stat.label}>
              <Icon size={23} aria-hidden />
              <div>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
              <StatusBadge tone={stat.tone}>{stat.label}</StatusBadge>
            </article>
          );
        })}
      </section>

      <section className="dora-tasks-controls" aria-label="Task filters">
        <div className="dora-tasks-filter-group" role="radiogroup" aria-label="Task state filters">
          {taskFilters.map((item) => (
            <button
              key={item.value}
              role="radio"
              type="button"
              className={filter === item.value ? "is-active" : ""}
              aria-checked={filter === item.value}
              onClick={() => setFilter(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <span>{filteredTasks.length} shown</span>
      </section>

      <div className="dora-tasks-layout">
        <section className="dora-tasks-queue" aria-labelledby="dora-tasks-queue-title">
          <div className="dora-tasks-section-heading">
            <div>
              <h2 id="dora-tasks-queue-title">Sanitized task groups</h2>
              <p>Fixed public titles, coarse timing, and opaque task keys only.</p>
            </div>
            <ClipboardList size={22} aria-hidden />
          </div>

          <div className="dora-tasks-list">
            {filteredTasks.map((task) => (
              <article key={task.publicKey} className={`dora-tasks-row ${taskToneClass(task)}`}>
                <span className="dora-tasks-row-icon">
                  <DoraemonMark />
                </span>
                <div className="dora-tasks-row-main">
                  <div>
                    <span className="dora-tasks-public-key">{task.publicKey}</span>
                    <StatusBadge tone={task.tone}>{task.state}</StatusBadge>
                  </div>
                  <h3>{task.title}</h3>
                  <p>{task.summary}</p>
                </div>
                <dl className="dora-tasks-row-meta">
                  <div>
                    <dt>Agent role</dt>
                    <dd>{task.agentRole}</dd>
                  </div>
                  <div>
                    <dt>Updated</dt>
                    <dd>{task.updated}</dd>
                  </div>
                  <div>
                    <dt>Severity</dt>
                    <dd>{severityLabels[task.severity]}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <aside className="dora-tasks-side" aria-label="Owner review and public boundary">
          <section className="dora-tasks-owner-lane">
            <div className="dora-tasks-section-heading">
              <div>
                <h2>Owner review lane</h2>
                <p>Shows only that attention is needed, not the private task body.</p>
              </div>
              <Bell size={21} aria-hidden />
            </div>

            <div className="dora-tasks-owner-list">
              {ownerReviewTasks.map((task) => (
                <article key={task.publicKey}>
                  <span aria-hidden />
                  <div>
                    <strong>{task.title}</strong>
                    <p>{task.agentRole} · {task.updated}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="dora-tasks-boundary-card">
            <div className="dora-tasks-section-heading">
              <div>
                <h2>Public task boundary</h2>
                <p>This page is an aggregation surface, not an action console.</p>
              </div>
              <ShieldCheck size={21} aria-hidden />
            </div>
            <ul>
              <li>
                <Eye size={16} aria-hidden />
                <span>Opaque public keys</span>
              </li>
              <li>
                <Sparkles size={16} aria-hidden />
                <span>Fixed titles</span>
              </li>
              <li>
                <LockKeyhole size={16} aria-hidden />
                <span>No prompts or notes</span>
              </li>
              <li>
                <ShieldCheck size={16} aria-hidden />
                <span>No execution controls</span>
              </li>
            </ul>
            <Link href="/dora/activity" className="link-focus">
              See public activity
              <ArrowRight size={15} aria-hidden />
            </Link>
          </section>

          <section className="dora-tasks-live-card">
            <Radio size={20} aria-hidden />
            <strong>Read-only posture</strong>
            <p>Public visitors can inspect state, not mutate work.</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
