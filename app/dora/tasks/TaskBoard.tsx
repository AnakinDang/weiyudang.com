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

function DoraemonMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 72 72" aria-hidden="true" focusable="false">
      <circle cx="36" cy="34" r="25" fill="currentColor" opacity="0.12" />
      <circle cx="36" cy="32" r="20" fill="#ffffff" stroke="currentColor" strokeWidth="2.2" />
      <ellipse cx="30" cy="24" rx="4.2" ry="6.8" fill="#ffffff" stroke="currentColor" strokeWidth="1.8" />
      <ellipse cx="42" cy="24" rx="4.2" ry="6.8" fill="#ffffff" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="31.4" cy="25.5" r="1.45" fill="currentColor" />
      <circle cx="40.6" cy="25.5" r="1.45" fill="currentColor" />
      <circle cx="36" cy="32" r="3.4" fill="currentColor" />
      <path d="M36 35.6v14.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M25.5 41.2c5.4 6.2 15.6 6.2 21 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M21 32.8h10M21.4 38.2l9.2-2.1M51 32.8H41M50.6 38.2l-9.2-2.1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path d="M25.5 53h21" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="36" cy="56" r="5.2" fill="#f4b740" stroke="#ffffff" strokeWidth="2" />
    </svg>
  );
}

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

  const filteredTasks = useMemo(
    () => (filter === "all" ? tasks : tasks.filter((task) => task.state === filter)),
    [filter, tasks]
  );
  const ownerReviewTasks = useMemo(() => tasks.filter((task) => task.state === "Owner review"), [tasks]);

  return (
    <div className="dora-tasks">
      <section className="dora-tasks-hero" aria-label="Public Doraemon task orbit">
        <div className="dora-tasks-hero-copy">
          <p>
            <span>Public task queue.</span> Owner stays in the loop.
          </p>
          <small>Aggregated states only. No execution controls.</small>
        </div>

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

        <div className="dora-tasks-hero-boundary">
          <span>
            <Eye size={15} aria-hidden />
            Public aggregation
          </span>
          <span>
            <LockKeyhole size={15} aria-hidden />
            Private details hidden
          </span>
          <span>
            <ShieldCheck size={15} aria-hidden />
            Display-only
          </span>
        </div>
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
