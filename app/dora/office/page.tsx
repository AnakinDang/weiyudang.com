import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  CalendarClock,
  ClipboardList,
  MonitorPlay,
  Radio,
  ShieldCheck
} from "lucide-react";
import { DoraOfficeShell } from "@/components/DoraOfficeShell";
import { StatusBadge } from "@/components/StatusBadge";
import {
  DORA_LIVE_BRIDGE_URL,
  formatPublicEventTime,
  getPublicAgentTone,
  getRecentPublicDoraEvents,
  publicDoraTasks,
  publicSchedules
} from "@/lib/dora-office";
import { getPublicAgents } from "@/lib/public-agents";

export const metadata: Metadata = {
  title: "Dora Office",
  description: "The public live/demo Dora Office view without private task names, prompts, accounts, or controls."
};

export default function DoraOfficePage() {
  const liveBridgeHost = DORA_LIVE_BRIDGE_URL.replace(/^https?:\/\//, "");
  const agents = getPublicAgents();
  const recentEvents = getRecentPublicDoraEvents(3);
  const ownerReviewTask = publicDoraTasks.find((task) => task.state === "Owner review") ?? publicDoraTasks[0];
  const nextSchedule = publicSchedules[0];

  return (
    <DoraOfficeShell
      active="/dora/office"
      title="Office Live"
      summary="A native public command room: visual stage first, dashboard context second, external live bridge linked when needed."
    >
      <div className="grid gap-5">
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_24rem]">
          <div className="panel overflow-hidden p-4 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Public stage</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">Doraemon coordinates. MiniDoras work.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                  This native stage is a public-safe office map. It shows roles, state, and rhythm without exposing
                  private task titles, prompts, files, accounts, or runtime controls.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge tone="info">demo fallback</StatusBadge>
                <StatusBadge tone="normal">display-only</StatusBadge>
              </div>
            </div>

            <div className="office-stage-surface mt-6 rounded-[8px] border border-[#bfdbfe] bg-[linear-gradient(135deg,#f8fbff_0%,#eef7ff_46%,#fff8e5_100%)] p-4 md:p-6">
              <div className="grid gap-3 md:grid-cols-2">
                {agents.map((agent, index) => (
                  <article
                    key={agent.publicId}
                    className={`office-agent-card rounded-[8px] border border-white/80 bg-white/82 p-4 shadow-[0_14px_38px_rgba(15,23,42,0.08)] backdrop-blur ${
                      index === 0 ? "md:col-span-2 md:border-[#bfdbfe]" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="relative flex size-10 items-center justify-center rounded-[8px] border border-[#bfdbfe] bg-[#e0f2fe] text-[#2563eb]">
                        <Bot size={20} aria-hidden />
                        <span className={`office-agent-pulse office-agent-pulse-${getPublicAgentTone(agent)}`} aria-hidden />
                      </span>
                      <StatusBadge tone={getPublicAgentTone(agent)}>{agent.stateLabel}</StatusBadge>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-950">{agent.displayName}</h3>
                    <p className="mt-1 text-xs font-bold uppercase text-[#9a6a08]">{agent.role}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{agent.summary}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <aside className="grid content-start gap-4">
            <section className="panel p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="eyebrow">Current focus</h2>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">{ownerReviewTask.title}</p>
                </div>
                <StatusBadge tone={ownerReviewTask.tone}>{ownerReviewTask.state}</StatusBadge>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                {ownerReviewTask.agentRole} is holding a public-safe checkpoint. The private task name, prompt,
                artifacts, and owner notes stay out of the public view.
              </p>
            </section>

            <section className="panel p-5">
              <p className="eyebrow">Recent activity</p>
              <div className="mt-4 grid gap-3">
                {recentEvents.map((event) => (
                  <article key={event.event_id} className="rounded-[8px] border border-[#dde7f0] bg-[#f8fafc] p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-slate-950">{event.title}</h3>
                      <StatusBadge tone={event.severity}>{event.state}</StatusBadge>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {formatPublicEventTime(event.created_at)} · {event.agent} · {event.event_type.replaceAll("_", " ")}
                    </p>
                  </article>
                ))}
              </div>
              <Link
                href="/dora/activity"
                className="link-focus mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#1d4ed8]"
              >
                View full timeline
                <ArrowRight size={15} aria-hidden />
              </Link>
            </section>
          </aside>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="panel-quiet p-5">
            <Radio className="text-[#2563eb]" size={24} aria-hidden />
            <p className="mt-4 text-sm font-semibold text-slate-500">Public relay</p>
            <h3 className="mt-1 text-2xl font-semibold text-slate-950">read-only</h3>
          </article>
          <article className="panel-quiet p-5">
            <MonitorPlay className="text-[#2563eb]" size={24} aria-hidden />
            <p className="mt-4 text-sm font-semibold text-slate-500">Live bridge</p>
            <h3 className="mt-1 text-2xl font-semibold text-slate-950">linked</h3>
            <a
              href={DORA_LIVE_BRIDGE_URL}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${liveBridgeHost} in a new tab`}
              className="link-focus mt-3 inline-flex items-center gap-2 break-all text-sm font-bold text-[#1d4ed8]"
            >
              {liveBridgeHost}
              <ArrowUpRight size={15} aria-hidden />
            </a>
          </article>
          <article className="panel-quiet p-5">
            <CalendarClock className="text-[#2563eb]" size={24} aria-hidden />
            <p className="mt-4 text-sm font-semibold text-slate-500">Next rhythm</p>
            <h3 className="mt-1 text-2xl font-semibold text-slate-950">{nextSchedule.name}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{nextSchedule.next}</p>
          </article>
          <article className="panel-quiet p-5">
            <ShieldCheck className="text-[#2563eb]" size={24} aria-hidden />
            <p className="mt-4 text-sm font-semibold text-slate-500">Boundary</p>
            <h3 className="mt-1 text-2xl font-semibold text-slate-950">public schema</h3>
          </article>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {[
            {
              title: "Tasks",
              summary: "Fixed public titles, safe states, and no prompt bodies.",
              href: "/dora/tasks",
              icon: ClipboardList
            },
            {
              title: "Team Agents",
              summary: "Doraemon and MiniDoras with public roles and current state.",
              href: "/dora/team",
              icon: Bot
            },
            {
              title: "System",
              summary: "Safe health summary without local paths, ports, or tokens.",
              href: "/dora/system",
              icon: ShieldCheck
            }
          ].map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="link-focus panel p-5 transition hover:-translate-y-0.5 hover:border-[#bfdbfe]"
              >
                <Icon className="text-[#2563eb]" size={24} aria-hidden />
                <h3 className="mt-4 text-xl font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#1d4ed8]">
                  Open {item.title}
                  <ArrowRight size={15} aria-hidden />
                </span>
              </Link>
            );
          })}
        </section>
      </div>
    </DoraOfficeShell>
  );
}
