"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  ClipboardList,
  Eye,
  GitBranch,
  Layers3,
  LockKeyhole,
  ScanLine,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { DoraemonMark } from "@/components/DoraemonMark";
import { StatusBadge } from "@/components/StatusBadge";
import { publicDoraTaskToneClasses } from "@/lib/dora-public-client";
import type { publicDoraTasks } from "@/lib/dora-office";

type PublicTask = (typeof publicDoraTasks)[number];
type TaskFilter = "all" | PublicTask["state"];

const taskFilterLabels = {
  "Owner review": "Owner review",
  Working: "Working",
  Attention: "Attention",
  Completed: "Completed"
} as const satisfies Record<PublicTask["state"], string>;

const taskFilterOrder = ["Owner review", "Working", "Attention", "Completed"] as const satisfies readonly PublicTask["state"][];

const taskFilters = [
  { value: "all" as const, label: "All" },
  ...taskFilterOrder.map((value) => ({ value, label: taskFilterLabels[value] }))
] as const;

const severityLabels = {
  normal: "Normal",
  warning: "Warning"
} as const satisfies Record<PublicTask["severity"], string>;

const taskLanes = [
  {
    title: "Needs owner",
    states: ["Owner review", "Attention"] as const,
    summary: "Review and attention labels stay visible while private details stay hidden."
  },
  {
    title: "In motion",
    states: ["Working"] as const,
    summary: "Active work appears as coarse posture, not raw task names or prompts."
  },
  {
    title: "Closed",
    states: ["Completed"] as const,
    summary: "Completed public states show outcome posture without artifacts."
  }
] as const;

function taskToneClass(task: Pick<PublicTask, "state">) {
  return publicDoraTaskToneClasses[task.state];
}

export function TaskBoard({ tasks }: { tasks: readonly PublicTask[] }) {
  const [filter, setFilter] = useState<TaskFilter>("all");

  const filteredTasks = useMemo(
    () => (filter === "all" ? tasks : tasks.filter((task) => task.state === filter)),
    [filter, tasks]
  );
  const ownerReviewTasks = useMemo(() => tasks.filter((task) => task.state === "Owner review"), [tasks]);
  const activeFilterLabels = [
    { key: "state", label: filter === "all" ? "All public states" : taskFilterLabels[filter] },
    { key: "privacy", label: "No private task names" },
    { key: "mode", label: "Display-only" }
  ];

  return (
    <div className="dora-tasks dora-tasks-board">
      <section className="dora-tasks-controls" aria-label="Task filters">
        <div>
          <div className="dora-tasks-controls-head">
            <div>
              <strong>Filter public queue</strong>
              <p>Every control operates on sanitized task posture only.</p>
            </div>
            <span>{filteredTasks.length} shown</span>
          </div>
          <div className="dora-tasks-filter-group" role="group" aria-label="Task state filters">
            {taskFilters.map((item) => (
              <button
                key={item.value}
                type="button"
                className={filter === item.value ? "is-active" : ""}
                aria-pressed={filter === item.value}
                onClick={() => setFilter(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <ul className="dora-tasks-active-filters" aria-label="Current task filters">
            {activeFilterLabels.map((item) => (
              <li key={item.key}>{item.label}</li>
            ))}
          </ul>
        </div>
      </section>

      <div className="dora-tasks-layout">
        <section className="dora-tasks-queue" aria-labelledby="dora-tasks-queue-title">
          <div className="dora-tasks-section-heading">
            <div>
              <h3 id="dora-tasks-queue-title">Sanitized task groups</h3>
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
                  <h4>{task.title}</h4>
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

          {filteredTasks.length === 0 ? (
            <div className="dora-tasks-empty">
              <ClipboardList size={18} aria-hidden />
              <strong>No public tasks match this filter.</strong>
              <button type="button" onClick={() => setFilter("all")}>
                Show all
              </button>
            </div>
          ) : null}
        </section>

        <aside className="dora-tasks-side" aria-label="Owner review and public boundary">
          <section className="dora-tasks-lanes-card">
            <div className="dora-tasks-section-heading">
              <div>
                <h3>Queue lanes</h3>
                <p>Public posture grouped by what a visitor can safely understand.</p>
              </div>
              <GitBranch size={21} aria-hidden />
            </div>

            <div className="dora-tasks-lane-list">
              {taskLanes.map((lane) => {
                const count = tasks.filter((task) => lane.states.some((state) => state === task.state)).length;

                return (
                  <article key={lane.title}>
                    <span>
                      <Layers3 size={15} aria-hidden />
                    </span>
                    <div>
                      <h4>{lane.title}</h4>
                      <small>{count} public labels</small>
                      <p>{lane.summary}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="dora-tasks-owner-lane">
            <div className="dora-tasks-section-heading">
              <div>
                <h3>Owner review lane</h3>
                <p>Shows only that attention is needed, not the private task body.</p>
              </div>
              <Bell size={21} aria-hidden />
            </div>

            <div className="dora-tasks-owner-list">
              {ownerReviewTasks.length > 0 ? (
                ownerReviewTasks.map((task) => (
                  <article key={task.publicKey}>
                    <span aria-hidden />
                    <div>
                      <h4>{task.title}</h4>
                      <p>
                        {task.agentRole}
                        {" · "}
                        {task.updated}
                      </p>
                    </div>
                  </article>
                ))
              ) : (
                <div className="dora-tasks-owner-empty">No public owner-review checkpoint is visible.</div>
              )}
            </div>
          </section>

          <section className="dora-tasks-boundary-card">
            <div className="dora-tasks-section-heading">
              <div>
                <h3>Public task boundary</h3>
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
            <ScanLine size={20} aria-hidden />
            <strong>Read-only posture</strong>
            <p>Public visitors can inspect state, not mutate work.</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
