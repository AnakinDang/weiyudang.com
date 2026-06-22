import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Eye, Filter, LockKeyhole, Radio, ShieldCheck, Sparkles, Users } from "lucide-react";
import { ActivityFeed } from "@/app/dora/activity/ActivityFeed";
import { DoraemonMark } from "@/components/DoraemonMark";
import { DoraOfficeOperatingRhythm } from "@/components/DoraOfficeOperatingRhythm";
import { DoraOfficeRouteDock } from "@/components/DoraOfficeRouteDock";
import { SiteChrome } from "@/components/SiteChrome";
import { formatPublicEventTime, getRecentPublicDoraEvents } from "@/lib/dora-office";

export const metadata: Metadata = {
  title: "Doraemon Activity",
  description: "Public sanitized Doraemon Office activity timeline."
};

const activityBoundaryItems = ["No raw IDs", "No prompts or workflows", "No accounts or execution"] as const;
const activityFilterItems = ["Kind", "Agent", "Severity", "Time window"] as const;

const activityCommandCardTemplates = [
  {
    title: "Public Boundary",
    summary: "The activity surface explains motion without exposing the private work behind it.",
    icon: ShieldCheck,
    items: activityBoundaryItems
  },
  {
    title: "Filter Surface",
    summary: "Code-native controls filter sanitized event labels, not private payloads.",
    icon: Filter,
    items: activityFilterItems
  }
] as const;

export default function DoraActivityPage() {
  const publicEvents = getRecentPublicDoraEvents().sort((left, right) => Date.parse(right.created_at) - Date.parse(left.created_at));
  const events = publicEvents.map(({ event_id: _eventId, ...event }) => event);
  const heroEvents = events.slice(0, 5);
  const heroAgents = Array.from(new Set(heroEvents.map((event) => event.agent))).slice(0, 4);
  const groupCount = new Set(events.map((event) => event.event_type)).size;
  const warningCount = events.filter((event) => event.severity === "warning").length;
  const activityCommandCards = [
    {
      title: "Timeline Posture",
      summary: "Newest public labels first, with event groups and review labels visible at a safe level.",
      icon: Radio,
      rows: [
        { label: "Events", value: events.length },
        { label: "Groups", value: groupCount },
        { label: "Order", value: "Newest first" }
      ]
    },
    ...activityCommandCardTemplates
  ] as const;

  return (
    <SiteChrome headerVariant="doraemon" headerActiveHref="/dora">
      <div className="dora-activity-landing">
        <div className="dora-office-route-dock-wrap">
          <DoraOfficeRouteDock active="/dora/activity" />
        </div>
        <section className="dora-activity-landing-hero" aria-labelledby="dora-activity-title">
          <div className="container dora-activity-landing-hero-grid">
            <div className="dora-activity-landing-copy">
              <h1 id="dora-activity-title">
                <span>Doraemon</span>
                {" "}
                Activity
              </h1>
              <p>Every public signal, ordered. A readable command log for MiniDora motion without exposing private work.</p>
              <div className="dora-activity-landing-rule" aria-hidden />
              <div className="dora-activity-landing-actions">
                <a href="#public-activity-log" className="link-focus dora-office-primary-cta">
                  Explore public log
                  <ArrowRight size={19} aria-hidden />
                </a>
                <div className="dora-office-secondary-actions">
                  <Link href="/dora/office" className="link-focus dora-office-text-link">
                    Doraemon Office
                    <ArrowRight size={15} aria-hidden />
                  </Link>
                  <Link href="/dora/team" className="link-focus dora-office-text-link">
                    Team Agents
                    <ArrowRight size={15} aria-hidden />
                  </Link>
                </div>
              </div>
            </div>

            <div className="dora-activity-command-visual">
              <section className="dora-activity-command-stage" aria-label="Public Doraemon activity command log preview">
                <div className="dora-activity-command-art" aria-hidden="true">
                  <Image
                    src="/visuals/doraemon-activity-lens-v1.webp"
                    alt=""
                    width={1400}
                    height={788}
                    priority
                    quality={95}
                    sizes="(max-width: 1180px) 100vw, 58vw"
                  />
                </div>

                <div className="dora-activity-command-schema">
                  <strong>Public Schema</strong>
                  <p>Fixed titles. Safe timestamps. No private payloads.</p>
                  <div>
                    <Eye size={17} aria-hidden />
                    <span>Public window</span>
                  </div>
                  <div>
                    <LockKeyhole size={17} aria-hidden />
                    <span>Private area hidden</span>
                  </div>
                </div>

                <div className="dora-activity-command-timeline" aria-label="Recent public activity preview">
                  <div>
                    <span aria-hidden />
                    <strong>Public event stream</strong>
                    <small>Demo fallback · {events.length} sanitized events</small>
                  </div>
                  <ol>
                    {heroEvents.map((event) => (
                      <li key={`${event.created_at}-${event.agent}-${event.title}`}>
                        <time dateTime={event.created_at}>{formatPublicEventTime(event.created_at)}</time>
                        <strong>{event.agent}</strong>
                        <span>{event.title}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="dora-activity-command-agents" aria-hidden="true">
                  {heroAgents.map((agent, index) => (
                    <span key={agent} className={`dora-activity-command-agent dora-activity-command-agent-${index + 1}`}>
                      <DoraemonMark />
                    </span>
                  ))}
                </div>
              </section>
            </div>

            <aside className="dora-activity-command-rail" aria-label="Doraemon Activity public context">
              {activityCommandCards.map((item) => {
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
          className="dora-activity-landing-section dora-activity-log-section"
          id="public-activity-log"
          aria-labelledby="public-activity-log-title"
        >
          <div className="container dora-activity-log-heading">
            <div>
              <h2 id="public-activity-log-title">Public Activity Log</h2>
              <p>Filter the sanitized timeline by event kind, agent, severity, and safe time window.</p>
            </div>
            <div className="dora-activity-log-stats" aria-label="Public activity summary">
              <article>
                <strong>{events.length}</strong>
                <span>events</span>
              </article>
              <article>
                <strong>{groupCount}</strong>
                <span>groups</span>
              </article>
              <article>
                <strong>{warningCount}</strong>
                <span>review labels</span>
              </article>
            </div>
          </div>
          <div className="container">
            <ActivityFeed events={events} />
          </div>
        </section>

        <DoraOfficeOperatingRhythm
          surface="activity"
          title="Activity closes the public operating loop"
          summary="The public log above gives schedule, task, and system signals their surrounding story without exposing private work."
        />

        <section className="dora-activity-landing-section dora-activity-continuation-section" aria-label="Doraemon Activity continuation routes">
          <div className="container dora-office-command-shell">
            <div className="dora-office-command-heading">
              <h2>Continue Through Doraemon Office</h2>
              <p>Move from the public log into the surrounding read-only command surfaces.</p>
            </div>
            <div className="dora-office-command-grid">
              <Link href="/dora/office" className="link-focus dora-office-command-card">
                <Radio size={24} aria-hidden />
                <h3>Doraemon Office</h3>
                <p>Return to the public command-room overview and stage.</p>
                <span className="dora-office-text-link">
                  Open office
                  <ArrowRight size={15} aria-hidden />
                </span>
              </Link>
              <Link href="/dora/team" className="link-focus dora-office-command-card">
                <Users size={24} aria-hidden />
                <h3>Team Agents</h3>
                <p>See the MiniDora roster behind the public event labels.</p>
                <span className="dora-office-text-link">
                  Meet the team
                  <ArrowRight size={15} aria-hidden />
                </span>
              </Link>
              <Link href="/dora/tasks" className="link-focus dora-office-command-card">
                <ShieldCheck size={24} aria-hidden />
                <h3>Task posture</h3>
                <p>Review public-safe task state without private titles or prompts.</p>
                <span className="dora-office-text-link">
                  View tasks
                  <ArrowRight size={15} aria-hidden />
                </span>
              </Link>
              <Link href="/projects/doraemon-agent-system" className="link-focus dora-office-command-card">
                <Sparkles size={24} aria-hidden />
                <h3>Project context</h3>
                <p>Read how the Personal OS experiment is designed to compound.</p>
                <span className="dora-office-text-link">
                  Read project
                  <ArrowRight size={15} aria-hidden />
                </span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </SiteChrome>
  );
}
