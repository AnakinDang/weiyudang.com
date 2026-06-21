import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CalendarClock,
  ClipboardList,
  Radio,
  ShieldCheck
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { publicDoraOperatingRhythm, type DoraOfficeRoute } from "@/lib/dora-office";

const rhythmIcons = {
  "/dora/schedules": CalendarClock,
  "/dora/tasks": ClipboardList,
  "/dora/system": ShieldCheck,
  "/dora/activity": Activity
} as const satisfies Partial<Record<DoraOfficeRoute, LucideIcon>>;

const surfaceLabels = {
  activity: "Activity timeline",
  tasks: "Task posture",
  schedules: "Operating rhythm",
  system: "System readiness"
} as const;

const surfaceRoutes = {
  activity: "/dora/activity",
  tasks: "/dora/tasks",
  schedules: "/dora/schedules",
  system: "/dora/system"
} as const satisfies Record<keyof typeof surfaceLabels, DoraOfficeRoute>;

export function DoraOfficeOperatingRhythm({
  surface,
  title,
  summary
}: {
  surface: keyof typeof surfaceLabels;
  title: string;
  summary: string;
}) {
  return (
    <section
      className={`dora-office-operating-section dora-office-operating-section--${surface}`}
      aria-labelledby={`dora-office-operating-title-${surface}`}
      role="region"
    >
      <div className="dora-office-operating-rhythm">
        <div className="dora-office-operating-heading">
          <div>
            <span>
              <Radio size={16} aria-hidden />
              {surfaceLabels[surface]}
            </span>
            <h2 id={`dora-office-operating-title-${surface}`}>{title}</h2>
            <p>{summary}</p>
          </div>
          <div className="dora-office-operating-posture" aria-label="Operating rhythm safety posture">
            <StatusBadge tone="info">public-safe</StatusBadge>
            <StatusBadge tone="private">display-only</StatusBadge>
          </div>
        </div>

        <ol className="dora-office-operating-steps" aria-label="Public operating signal chain">
          {publicDoraOperatingRhythm.map((step, index) => {
            const Icon = rhythmIcons[step.route] ?? Radio;
            const isCurrent = step.route === surfaceRoutes[surface];

            return (
              <li key={step.stage} className={`dora-office-operating-step${isCurrent ? " is-current" : ""}`}>
                <article aria-current={isCurrent ? "page" : undefined}>
                  <span className="dora-office-operating-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="dora-office-operating-icon">
                    <Icon size={19} aria-hidden />
                  </span>
                  <div className="dora-office-operating-copy">
                    <div>
                      <span>{step.stage}</span>
                      <StatusBadge tone={step.tone}>{step.state}</StatusBadge>
                    </div>
                    <h3>{step.label}</h3>
                    <p>{step.signal}</p>
                    <dl>
                      <div>
                        <dt>Public window</dt>
                        <dd>{step.window}</dd>
                      </div>
                      <div>
                        <dt>Boundary</dt>
                        <dd>{step.boundary}</dd>
                      </div>
                    </dl>
                    {isCurrent ? (
                      <span className="dora-office-operating-current">Current view</span>
                    ) : (
                      <Link
                        href={step.route}
                        aria-label={`Open ${step.label}`}
                        className="link-focus dora-office-operating-link"
                      >
                        Open
                        <ArrowRight size={14} aria-hidden />
                      </Link>
                    )}
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
