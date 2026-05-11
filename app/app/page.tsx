import Link from "next/link";
import { Activity, ArrowRight, Bot, LineChart, ShieldCheck } from "lucide-react";
import { Timeline } from "@/components/Timeline";

const portals = [
  {
    title: "Doraemon Command Center",
    href: "/app/command",
    summary: "Mission, plan, owner review, and output shelf.",
    icon: Bot
  },
  {
    title: "MiniDora Trading",
    href: "/app/trading",
    summary: "Read-only P0 local-paper research dashboard.",
    icon: LineChart
  },
  {
    title: "Agent Status",
    href: "/app/agents",
    summary: "MiniDora states and roles.",
    icon: ShieldCheck
  },
  {
    title: "Event Stream",
    href: "/app/events",
    summary: "Task events, handoffs, artifacts, and warnings.",
    icon: Activity
  }
];

export default function PrivateAppPage() {
  return (
    <div className="space-y-6">
      <section className="panel p-6">
        <p className="eyebrow">Private shell</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Personal command center MVP</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          This route is protected by an app access token and currently displays mock data only. Real local services should connect through authenticated APIs later.
        </p>
      </section>
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {portals.map((portal) => {
          const Icon = portal.icon;
          return (
            <Link key={portal.href} href={portal.href} className="link-focus panel p-5 transition hover:-translate-y-0.5 hover:border-sky-300/40">
              <Icon className="text-yellow-100" size={24} aria-hidden />
              <h3 className="mt-4 text-lg font-semibold text-white">{portal.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{portal.summary}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-100">
                Open
                <ArrowRight size={15} aria-hidden />
              </span>
            </Link>
          );
        })}
      </section>
      <section className="panel p-5">
        <p className="eyebrow">Recent events</p>
        <div className="mt-5">
          <Timeline compact />
        </div>
      </section>
    </div>
  );
}
