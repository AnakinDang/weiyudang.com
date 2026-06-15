import Link from "next/link";
import { Activity, Bot, CalendarClock, Database, Gauge, LayoutDashboard, LineChart, LogOut, Settings, Shield } from "lucide-react";

const appNav = [
  { href: "/app", label: "Today", icon: LayoutDashboard },
  { href: "/app/command", label: "Command", icon: Bot },
  { href: "/app/agents", label: "Agents", icon: Shield },
  { href: "/app/trading", label: "Trading Team", icon: LineChart },
  { href: "/app/knowledge", label: "Knowledge Vault", icon: Database },
  { href: "/app/schedules", label: "Schedules", icon: CalendarClock },
  { href: "/app/events", label: "Review Queue", icon: Activity },
  { href: "/app/system", label: "System Health", icon: Gauge },
  { href: "/app/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell min-h-screen bg-[#08111f] text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[17rem_1fr]">
        <aside className="border-b border-slate-700/50 bg-[#0b1220] p-4 lg:border-b-0 lg:border-r">
          <Link href="/" className="link-focus flex items-center gap-3 rounded-[8px] p-2">
            <span className="flex size-10 items-center justify-center rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 text-yellow-100">
              <Shield size={20} aria-hidden />
            </span>
            <span>
              <span className="block font-semibold">Owner Cockpit</span>
              <span className="block text-xs text-slate-400">Protected Personal OS</span>
            </span>
          </Link>
          <nav className="mt-6 grid gap-1" aria-label="Private app navigation">
            {appNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="link-focus flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <Icon size={17} aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <form action="/api/logout" method="post" className="mt-6">
            <button className="flex w-full items-center gap-3 rounded-[8px] border border-slate-700 px-3 py-2.5 text-sm text-slate-300 transition hover:border-red-300/40 hover:text-red-100">
              <LogOut size={17} aria-hidden />
              Sign out
            </button>
          </form>
        </aside>
        <main>
          <header className="border-b border-slate-700/50 bg-[#0b1220]/76 px-5 py-4 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="eyebrow">Owner session</p>
                <h1 className="text-xl font-semibold text-white">Personal OS Cockpit</h1>
              </div>
              <div className="inline-flex items-center gap-2 rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 px-3 py-2 text-sm font-semibold text-yellow-100">
                <CalendarClock size={16} aria-hidden />
                Private mock mode
              </div>
            </div>
          </header>
          <div className="p-5 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
