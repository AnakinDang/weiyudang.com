"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
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
] as const;

function isActivePath(pathname: string, href: string) {
  if (href === "/app") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function OwnerMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/app" className="link-focus flex min-w-0 items-center gap-3 rounded-[8px] p-2">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 text-yellow-100">
        <Shield size={20} aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block truncate font-semibold text-white">Owner Cockpit</span>
        {!compact ? <span className="block truncate text-xs text-slate-400">Protected Personal OS</span> : null}
      </span>
    </Link>
  );
}

function SignOutButton({ compact = false }: { compact?: boolean }) {
  return (
    <form action="/api/logout" method="post" className={compact ? "shrink-0" : "mt-auto pt-6"}>
      <button
        type="submit"
        className={`link-focus flex items-center gap-3 rounded-[8px] border border-slate-700 text-sm text-slate-300 transition hover:border-red-300/40 hover:text-red-100 ${
          compact ? "px-3 py-2" : "w-full px-3 py-2.5"
        }`}
        aria-label="Sign out of Owner Cockpit"
      >
        <LogOut size={17} aria-hidden />
        <span className={compact ? "hidden min-[420px]:inline" : ""}>Sign out</span>
      </button>
    </form>
  );
}

export function PrivateDesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen border-r border-slate-700/50 bg-[#0b1220] p-4 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:overflow-y-auto">
      <OwnerMark />
      <nav className="mt-6 grid gap-1" aria-label="Private app navigation">
        {appNav.map((item) => {
          const Icon = item.icon;
          const active = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`link-focus flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm transition ${
                active
                  ? "border border-sky-200/30 bg-sky-300/12 text-white"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={17} aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <SignOutButton />
    </aside>
  );
}

export function PrivateMobileHeader() {
  const pathname = usePathname();
  const activeLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    activeLinkRef.current?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-700/60 bg-[#0b1220]/95 shadow-[0_18px_60px_rgba(2,6,23,0.35)] backdrop-blur lg:hidden">
      <div className="flex items-center justify-between gap-3 px-3 py-3">
        <OwnerMark compact />
        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 px-2.5 py-1.5 text-xs font-semibold text-yellow-100 min-[370px]:inline-flex">
            Private
          </span>
          <SignOutButton compact />
        </div>
      </div>
      <nav
        className="flex max-w-full gap-2 overflow-x-auto border-t border-slate-800/80 px-3 pb-3 pt-2"
        aria-label="Private app mobile navigation"
      >
        {appNav.map((item) => {
          const Icon = item.icon;
          const active = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              ref={active ? activeLinkRef : undefined}
              aria-current={active ? "page" : undefined}
              className={`link-focus inline-flex shrink-0 items-center gap-2 rounded-[8px] border px-3 py-2 text-xs font-semibold transition ${
                active
                  ? "border-sky-200/40 bg-sky-300/15 text-sky-50"
                  : "border-slate-700 bg-white/[0.035] text-slate-300 hover:border-sky-200/30 hover:text-white"
              }`}
            >
              <Icon size={15} aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
