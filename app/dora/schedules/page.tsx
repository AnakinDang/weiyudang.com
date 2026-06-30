import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Eye,
  Layers3,
  LineChart,
  ListChecks,
  LockKeyhole,
  Radio,
  Repeat2,
  ShieldCheck,
  Sparkles,
  TimerReset
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ScheduleBoard } from "@/app/dora/schedules/ScheduleBoard";
import { DoraemonMark } from "@/components/DoraemonMark";
import { DoraOfficeCommandSpine } from "@/components/DoraOfficeCommandSpine";
import { DoraOfficeOperatingRhythm } from "@/components/DoraOfficeOperatingRhythm";
import { DoraOfficeRouteDock } from "@/components/DoraOfficeRouteDock";
import { SiteChrome } from "@/components/SiteChrome";
import { StatusBadge } from "@/components/StatusBadge";
import { publicDoraScheduleToneClasses } from "@/lib/dora-public-client";
import { publicScheduleBoundaries, publicSchedules } from "@/lib/dora-office";

export const metadata: Metadata = {
  title: "Doraemon Schedules",
  description: "Public-safe Doraemon Office schedule rhythm with no private internals or controls."
};

type PublicSchedule = (typeof publicSchedules)[number];

const scheduleIcons = {
  "Daily brief": Sparkles,
  "Market scan": LineChart,
  "System health": Radio,
  "Weekly review": CalendarClock
} as const satisfies Record<PublicSchedule["name"], LucideIcon>;

const scheduleStats = [
  { label: "Public rhythms", value: publicSchedules.length.toString(), icon: Repeat2 },
  { label: "Cadence windows", value: new Set(publicSchedules.map((schedule) => schedule.cadence)).size.toString(), icon: TimerReset },
  {
    label: "Review window",
    value: publicSchedules.filter((schedule) => schedule.state === "Owner review").length.toString(),
    icon: CheckCircle2
  },
  { label: "Private controls", value: "0", icon: LockKeyhole }
] as const;

const schedulePrinciples = [
  {
    title: "Operate with consistency",
    summary: "Stable cadence builds trust without exposing implementation.",
    icon: CalendarClock
  },
  {
    title: "Share the why, not the how",
    summary: "Purpose, public name, and coarse window replace command details.",
    icon: ListChecks
  },
  {
    title: "Safe by design",
    summary: "Public rhythms are display-only and cannot mutate private systems.",
    icon: ShieldCheck
  },
  {
    title: "Better over time",
    summary: "The rhythm page can grow with public synthesis and owner review.",
    icon: LineChart
  }
] as const;

const publicWindowItems = ["Schedule name", "Rhythm category", "Last run window", "Next window", "Public state"] as const;
const privateAreaItems = ["Automation internals", "Exact triggers", "Last contents", "Execution details", "Private data"] as const;

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
    summary: "Read the full public-safe event stream around each rhythm.",
    href: "/dora/activity",
    icon: ClipboardList,
    action: "View activity"
  },
  {
    title: "Tasks",
    summary: "Pair cadence with public task posture and owner-review labels.",
    href: "/dora/tasks",
    icon: CheckCircle2,
    action: "View tasks"
  },
  {
    title: "Team Agents",
    summary: "Meet the MiniDoras behind the recurring operating loops.",
    href: "/dora/team",
    icon: Layers3,
    action: "Meet team"
  }
] as const;

export default function DoraSchedulesPage() {
  // The hero clock has four authored node positions; the full register below remains authoritative.
  const heroSchedules = publicSchedules.slice(0, 4);
  const ownerReviewCount = publicSchedules.filter((schedule) => schedule.state === "Owner review").length;
  const ownerReviewText =
    ownerReviewCount === 1
      ? "1 public review window is visible. "
      : `${ownerReviewCount} public review windows are visible. `;
  const publicScheduleCount: number = publicSchedules.length;
  const sanitizedWindowText =
    publicScheduleCount === 1
      ? "1 sanitized window"
      : `${publicScheduleCount} sanitized windows`;
  const cadenceCount = new Set(publicSchedules.map((schedule) => schedule.cadence)).size;
  const scheduleCommandCards = [
    {
      title: "Rhythm Posture",
      summary: "Coarse public cadence windows, without automation internals.",
      icon: Repeat2,
      rows: [
        { label: "Windows", value: publicScheduleCount },
        { label: "Cadences", value: cadenceCount },
        { label: "Review", value: ownerReviewCount }
      ]
    },
    {
      title: "Public Boundary",
      summary: "Visitors can understand rhythm without seeing how it runs.",
      icon: ShieldCheck,
      items: ["No private automation", "No precise trigger times", "No private prompts"]
    },
    {
      title: "Window Buckets",
      summary: "Coarse labels show timing shape, not live schedule data.",
      icon: CalendarClock,
      items: ["Morning bucket", "Session bucket", "Weekly bucket"]
    }
  ] as const;

  return (
    <SiteChrome headerVariant="doraemon" headerActiveHref="/dora">
      <div className="dora-schedules-landing">
        <div className="dora-office-route-dock-wrap">
          <DoraOfficeRouteDock active="/dora/schedules" />
        </div>
        <DoraOfficeCommandSpine active="/dora/schedules" />
        <section className="dora-schedules-landing-hero" aria-labelledby="dora-schedules-title">
          <div className="container dora-schedules-landing-hero-grid">
            <div className="dora-schedules-landing-copy">
              <h1 id="dora-schedules-title">
                <span>Doraemon</span>
                {" "}
                Schedules
              </h1>
              <p>Public operating rhythm without private automation internals.</p>
              <div className="dora-schedules-landing-rule" aria-hidden />
              <div className="dora-schedules-landing-actions">
                <a href="#public-rhythm-register" className="link-focus dora-office-primary-cta">
                  View public rhythm
                  <ArrowRight size={19} aria-hidden />
                </a>
                <div className="dora-office-secondary-actions">
                  <Link href="/dora/office" className="link-focus dora-office-text-link">
                    Doraemon Office
                    <ArrowRight size={15} aria-hidden />
                  </Link>
                  <Link href="/dora/tasks" className="link-focus dora-office-text-link">
                    Tasks
                    <ArrowRight size={15} aria-hidden />
                  </Link>
                </div>
              </div>
            </div>

            <div className="dora-schedules-command-visual">
              <section className="dora-schedules-command-stage" aria-label="Public Doraemon schedule rhythm preview">
                <div className="dora-schedules-command-room" aria-hidden>
                  <span />
                  <span />
                  <span />
                </div>

                <div className="dora-schedules-command-boundary">
                  <strong>Public cadence</strong>
                  <p>Coarse rhythm windows. Automation details stay private.</p>
                  <div>
                    <Eye size={17} aria-hidden />
                    <span>Public rhythm</span>
                  </div>
                  <div>
                    <LockKeyhole size={17} aria-hidden />
                    <span>Private automation</span>
                  </div>
                </div>

                <div className="dora-schedules-command-clock" aria-hidden>
                  <span className="dora-schedules-command-ring dora-schedules-command-ring-1" />
                  <span className="dora-schedules-command-ring dora-schedules-command-ring-2" />
                  <span className="dora-schedules-command-ring dora-schedules-command-ring-3" />
                  <article className="dora-schedules-command-hub">
                    <DoraemonMark />
                    <strong>Doraemon</strong>
                    <small>rhythm</small>
                  </article>
                  {heroSchedules.map((schedule, index) => {
                    const Icon = scheduleIcons[schedule.name];

                    return (
                      <article key={schedule.name} className={`dora-schedules-command-node dora-schedules-command-node-${index + 1}`}>
                        <span className={publicDoraScheduleToneClasses[schedule.state]}>
                          <Icon size={16} aria-hidden />
                        </span>
                        <strong>{schedule.name}</strong>
                        <small>{schedule.cadence}</small>
                      </article>
                    );
                  })}
                </div>

                <section className="dora-schedules-command-strip" aria-label="Public rhythm preview">
                  <div>
                    <span aria-hidden />
                    <strong>Public rhythm</strong>
                    <small>{sanitizedWindowText}</small>
                  </div>
                  <ol>
                    {heroSchedules.map((schedule) => (
                      <li key={schedule.name}>
                        <span>{schedule.next}</span>
                        <strong>{schedule.name}</strong>
                        <small>{schedule.summary}</small>
                      </li>
                    ))}
                  </ol>
                </section>
              </section>
            </div>

            <aside className="dora-schedules-command-rail" aria-label="Doraemon Schedules public context">
              {scheduleCommandCards.map((item) => {
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
          className="dora-schedules-landing-section dora-schedules-register-section"
          id="public-rhythm-register"
          aria-labelledby="public-rhythm-register-title"
        >
          <div className="container dora-schedules-register-heading">
            <div>
              <h2 id="public-rhythm-register-title">Public Rhythm Register</h2>
              <p>Filter sanitized schedule windows by public state and coarse cadence. No private automation details render.</p>
            </div>
            <div className="dora-schedules-log-stats" aria-label="Public schedule summary">
              {scheduleStats.map((stat) => {
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
            <ScheduleBoard schedules={publicSchedules} boundaries={publicScheduleBoundaries} />
          </div>
        </section>

        <section className="dora-schedules-landing-section dora-schedules-boundary-section" aria-labelledby="dora-schedules-boundary-title">
          <div className="container dora-schedules-boundary-grid">
            <div className="dora-schedules-section-copy">
              <h2 id="dora-schedules-boundary-title">Public Schedule Boundary</h2>
              <p>Your trust matters. Schedules are visible only as rhythm: name, category, coarse windows, and public state.</p>
              <ul className="dora-office-boundary-list">
                {publicScheduleBoundaries.map((rule) => (
                  <li key={rule}>
                    <CheckCircle2 size={15} aria-hidden />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="dora-schedules-boundary-diagram" aria-label="Public rhythm and private automation boundary">
              <div>
                <Eye size={22} aria-hidden />
                <strong>Public Window</strong>
                <ul>
                  {publicWindowItems.map((item) => (
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
              <span className="dora-schedules-boundary-mark" aria-hidden>
                <DoraemonMark />
              </span>
            </div>
          </div>
        </section>

        <section className="dora-schedules-landing-section dora-schedules-principles-section" aria-label="Public schedule principles">
          <div className="container dora-schedules-principles-grid">
            {schedulePrinciples.map((item) => {
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
          surface="schedules"
          title="Schedules set the rhythm for the public office"
          summary="A public schedule is not an implementation viewer. It is the first safe signal in a chain that ends in task posture, health, and activity."
        />

        <section className="dora-schedules-landing-section dora-schedules-continuation-section" aria-label="Doraemon Schedules continuation routes">
          <div className="container dora-office-command-shell">
            <div className="dora-office-command-heading">
              <h2>Continue Through Doraemon Office</h2>
              <p>
                {ownerReviewCount > 0 ? ownerReviewText : ""}
                Move from operating rhythm into the surrounding read-only surfaces.
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
