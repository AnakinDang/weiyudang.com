import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  Bot,
  CalendarClock,
  ClipboardList,
  Home,
  Radio,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { DORA_LIVE_BRIDGE_URL, doraOfficeRoutes, type DoraOfficeRoute } from "@/lib/dora-office";
import { DoraOfficeRouteScroller } from "@/components/DoraOfficeRouteScroller";
import { SiteChrome } from "@/components/SiteChrome";
import { StatusBadge } from "@/components/StatusBadge";

const routeIcons: Record<DoraOfficeRoute, LucideIcon> = {
  "/dora": Home,
  "/dora/office": Radio,
  "/dora/activity": CalendarClock,
  "/dora/team": Bot,
  "/dora/tasks": ClipboardList,
  "/dora/schedules": CalendarClock,
  "/dora/knowledge": Sparkles,
  "/dora/system": ShieldCheck
} as const;

export function DoraOfficeShell({
  active,
  title,
  summary,
  pageClassName,
  showBoundaryStrip = true,
  children
}: {
  active: DoraOfficeRoute;
  title: string;
  summary: string;
  pageClassName?: string;
  showBoundaryStrip?: boolean;
  children: React.ReactNode;
}) {
  const liveBridgeHost = DORA_LIVE_BRIDGE_URL.replace(/^https?:\/\//, "");

  return (
    <SiteChrome headerVariant="doraemon" headerActiveHref="/dora">
      <section className={`dora-office-subpage${pageClassName ? ` ${pageClassName}` : ""}`}>
        <div className="container dora-office-subpage-shell">
          <nav className="dora-office-route-rail" aria-label="Doraemon Office navigation">
            <Link href="/dora" className="link-focus dora-office-rail-brand">
              Doraemon Office
            </Link>
            <div className="dora-office-rail-links" data-dora-office-route-list>
              {doraOfficeRoutes.map((item) => {
                const Icon = routeIcons[item.href];
                const isActive = item.href === active;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`link-focus dora-office-rail-link${isActive ? " is-active" : ""}`}
                  >
                    <Icon size={18} aria-hidden />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <DoraOfficeRouteScroller active={active} />
            </div>
            <div className="dora-office-rail-boundary">
              <Radio size={20} aria-hidden />
              <strong>Live bridge</strong>
              <p>Open the larger visualizer when the office stage needs more room.</p>
              <a
                href={DORA_LIVE_BRIDGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open live bridge ${liveBridgeHost} in a new tab`}
                className="link-focus"
              >
                {liveBridgeHost}
                <ArrowUpRight size={13} aria-hidden />
              </a>
            </div>
          </nav>

          <div className="dora-office-subpage-main">
            <div className="dora-office-subpage-heading">
              <div>
                <p className="dora-office-subpage-kicker">Public / read-only</p>
                <div className="dora-office-subpage-title-row">
                  <h1>{title}</h1>
                  <span className="dora-office-agent-dot" aria-hidden="true" />
                </div>
                <p className="dora-office-subpage-summary">{summary}</p>
              </div>
              <div className="dora-office-subpage-badges" aria-label="Page safety posture">
                <StatusBadge tone="info">demo fallback</StatusBadge>
                <StatusBadge tone="normal">public schema</StatusBadge>
              </div>
            </div>

            {showBoundaryStrip ? (
              <div className="dora-office-boundary-strip">
                <ShieldCheck size={18} aria-hidden />
                <p>
                  Public Doraemon Office is read-only and sanitized. It does not expose private tasks, prompts, memory,
                  credentials, trading data, or private control actions.
                </p>
              </div>
            ) : null}

            <div className="dora-office-subpage-content">{children}</div>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
