import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Bot,
  CalendarClock,
  CheckSquare,
  Home,
  Radio,
  Server,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { doraOfficeRoutes, type DoraOfficeRoute } from "@/lib/dora-office";
import { DoraOfficeRouteScroller } from "@/components/DoraOfficeRouteScroller";
import { StatusBadge } from "@/components/StatusBadge";

const routeIcons: Record<DoraOfficeRoute, LucideIcon> = {
  "/dora": Home,
  "/dora/office": Radio,
  "/dora/activity": Activity,
  "/dora/team": Bot,
  "/dora/tasks": CheckSquare,
  "/dora/schedules": CalendarClock,
  "/dora/knowledge": Sparkles,
  "/dora/system": Server
} as const;

export function DoraOfficeRouteDock({ active }: { active: DoraOfficeRoute }) {
  return (
    <nav className="dora-office-route-dock" aria-label="Doraemon Office sections">
      <div className="dora-office-route-dock-brand">
        <Radio size={17} aria-hidden />
        <span>Doraemon Office</span>
      </div>
      <div className="dora-office-route-dock-links" data-dora-office-route-list>
        {doraOfficeRoutes.map((route) => {
          const Icon = routeIcons[route.href];
          const isActive = route.href === active;

          return (
            <Link
              key={route.href}
              href={route.href}
              aria-current={isActive ? "page" : undefined}
              className={`link-focus dora-office-route-dock-link${isActive ? " is-active" : ""}`}
            >
              <Icon size={15} aria-hidden />
              <span>{route.label}</span>
            </Link>
          );
        })}
        <DoraOfficeRouteScroller active={active} />
      </div>
      <div className="dora-office-route-dock-posture" aria-label="Doraemon Office safety posture">
        <StatusBadge tone="info">public-safe</StatusBadge>
        <StatusBadge tone="private">read-only</StatusBadge>
        <ShieldCheck size={16} aria-hidden />
      </div>
    </nav>
  );
}
