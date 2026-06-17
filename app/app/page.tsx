import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CalendarClock,
  CheckCircle2,
  LineChart,
  Radio,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import {
  ownerCommandShortcuts,
  ownerMarketAlerts,
  ownerReviewQueue,
  ownerSchedulePressure,
  ownerSystemHealth,
  ownerTodayPriorities
} from "@/lib/owner-cockpit";

export const dynamic = "force-dynamic";

const toneMap = {
  normal: "normal",
  info: "info",
  warning: "warning",
  private: "private"
} as const;

function shanghaiToday() {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Shanghai"
  }).format(new Date());
}

export default function PrivateAppPage() {
  const today = shanghaiToday();

  return (
    <div className="grid gap-5">
      <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.15fr)_24rem]">
        <div className="panel p-6 md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Today</p>
              <h2 className="mt-2 max-w-3xl text-3xl font-semibold text-white md:text-4xl">
                Owner daily cockpit for priorities, approvals, research posture, and system health.
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
                This private surface is authenticated and read-only in the current build. It can summarize what needs
                attention, but it does not execute commands, place trades, expose credentials, or publish private
                knowledge.
              </p>
            </div>
            <div className="rounded-[8px] border border-slate-700 bg-white/5 px-4 py-3 text-right">
              <p className="text-xs font-semibold uppercase text-slate-400">Asia/Shanghai</p>
              <p className="mt-1 text-lg font-semibold text-white">{today}</p>
            </div>
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-3">
            {ownerTodayPriorities.map((priority) => (
              <article key={priority.title} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
                <div className="flex items-start justify-between gap-3">
                  <Bot className="text-sky-100" size={20} aria-hidden />
                  <StatusBadge tone={toneMap[priority.tone]}>{priority.state}</StatusBadge>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{priority.title}</h3>
                <p className="mt-2 text-xs font-bold uppercase text-yellow-100">{priority.owner}</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">{priority.summary}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="grid content-start gap-4">
          <section className="panel p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow">Waiting approvals</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{ownerReviewQueue.length} checkpoints</h2>
              </div>
              <UserCheck className="text-yellow-100" size={24} aria-hidden />
            </div>
            <div className="mt-5 grid gap-3">
              {ownerReviewQueue.map((item) => (
                <article key={item.title} className="rounded-[8px] border border-slate-700 bg-white/5 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                    <StatusBadge tone={toneMap[item.tone]}>{item.state}</StatusBadge>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    {item.urgency} · {item.agent}
                  </p>
                </article>
              ))}
            </div>
            <Link href="/app/events" className="link-focus mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-100">
              Open review queue
              <ArrowRight size={15} aria-hidden />
            </Link>
          </section>

          <section className="panel p-5">
            <p className="eyebrow">System health</p>
            <div className="mt-4 grid gap-3">
              {ownerSystemHealth.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-3 rounded-[8px] border border-slate-700 bg-white/5 px-3 py-3">
                  <span className="text-sm text-slate-300">{item.label}</span>
                  <StatusBadge tone={toneMap[item.tone]}>{item.value}</StatusBadge>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="panel p-5">
          <LineChart className="text-yellow-100" size={24} aria-hidden />
          <p className="eyebrow mt-4">Market alerts</p>
          <div className="mt-4 grid gap-3">
            {ownerMarketAlerts.map((alert) => (
              <div key={alert.label} className="rounded-[8px] border border-slate-700 bg-white/5 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-white">{alert.label}</h3>
                  <span className="text-xs font-bold uppercase text-yellow-100">{alert.value}</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-400">{alert.detail}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel p-5">
          <CalendarClock className="text-yellow-100" size={24} aria-hidden />
          <p className="eyebrow mt-4">Schedule pressure</p>
          <div className="mt-4 grid gap-3">
            {ownerSchedulePressure.map((item) => (
              <div key={item.label} className="grid grid-cols-[1fr_auto] gap-3 rounded-[8px] border border-slate-700 bg-white/5 p-3">
                <div>
                  <h3 className="text-sm font-semibold text-white">{item.label}</h3>
                  <p className="mt-1 text-xs text-slate-400">{item.time}</p>
                </div>
                <span className="text-xs font-bold uppercase text-slate-300">{item.state}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel p-5">
          <ShieldCheck className="text-yellow-100" size={24} aria-hidden />
          <p className="eyebrow mt-4">Safety posture</p>
          <div className="mt-4 grid gap-3">
            {[
              "Authenticated owner route only.",
              "Read-only UI until command APIs have audit gates.",
              "Trading remains research-only.",
              "Public publishing requires explicit review."
            ].map((item) => (
              <div key={item} className="flex gap-3 rounded-[8px] border border-slate-700 bg-white/5 p-3 text-sm leading-6 text-slate-300">
                <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-200" size={17} aria-hidden />
                {item}
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Next surfaces</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Move from awareness into a focused console.</h2>
          </div>
          <Radio className="text-sky-100" size={24} aria-hidden />
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {ownerCommandShortcuts.map((shortcut) => (
            <Link
              key={shortcut.href}
              href={shortcut.href}
              className="link-focus rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 transition hover:-translate-y-0.5 hover:border-sky-300/40"
            >
              <h3 className="text-lg font-semibold text-white">{shortcut.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{shortcut.summary}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-100">
                Open {shortcut.title}
                <ArrowRight size={15} aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
