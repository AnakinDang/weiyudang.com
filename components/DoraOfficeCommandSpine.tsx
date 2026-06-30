import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Bot,
  CalendarClock,
  CheckSquare,
  Database,
  Eye,
  LockKeyhole,
  Radio,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { DoraemonMark } from "@/components/DoraemonMark";
import { StatusBadge } from "@/components/StatusBadge";
import { publicDoraOperatingRhythm, type DoraOfficeRoute } from "@/lib/dora-office";

type CommandSpineRoute = Exclude<DoraOfficeRoute, "/dora">;

type CommandSurface = {
  href: CommandSpineRoute;
  title: string;
  eyebrow: string;
  boundary: string;
  icon: LucideIcon;
  tone: "normal" | "info" | "warning" | "private";
};

const rhythmByRoute = new Map(publicDoraOperatingRhythm.map((step) => [step.route, step]));

const commandSurfaces = [
  {
    href: "/dora/office",
    title: "Office Live",
    eyebrow: "Command stage",
    boundary: "No owner controls render in public."
  },
  {
    href: "/dora/activity",
    title: "Activity",
    eyebrow: "Event timeline",
    boundary: rhythmByRoute.get("/dora/activity")?.boundary ?? "No run internals appear."
  },
  {
    href: "/dora/team",
    title: "Team Agents",
    eyebrow: "Agent roster",
    boundary: "No private task names or prompts appear."
  },
  {
    href: "/dora/tasks",
    title: "Tasks",
    eyebrow: "Task posture",
    boundary: rhythmByRoute.get("/dora/tasks")?.boundary ?? "No owner notes appear."
  },
  {
    href: "/dora/schedules",
    title: "Schedules",
    eyebrow: "Operating rhythm",
    boundary: rhythmByRoute.get("/dora/schedules")?.boundary ?? "No automation internals render."
  },
  {
    href: "/dora/knowledge",
    title: "Knowledge",
    eyebrow: "Knowledge synthesis",
    boundary: "No raw vault pages or memory records render."
  },
  {
    href: "/dora/system",
    title: "System",
    eyebrow: "Health signal",
    boundary: rhythmByRoute.get("/dora/system")?.boundary ?? "No private operations render."
  }
] as const satisfies readonly Omit<CommandSurface, "icon" | "tone">[];

const surfaceIcons = {
  "/dora/office": Radio,
  "/dora/activity": Activity,
  "/dora/team": Bot,
  "/dora/tasks": CheckSquare,
  "/dora/schedules": CalendarClock,
  "/dora/knowledge": Sparkles,
  "/dora/system": Database
} as const satisfies Record<(typeof commandSurfaces)[number]["href"], LucideIcon>;

const surfaceTones = {
  "/dora/office": "info",
  "/dora/activity": "normal",
  "/dora/team": "normal",
  "/dora/tasks": "warning",
  "/dora/schedules": "info",
  "/dora/knowledge": "normal",
  "/dora/system": "info"
} as const satisfies Record<(typeof commandSurfaces)[number]["href"], CommandSurface["tone"]>;

const surfaces = commandSurfaces.map((surface) => ({
  ...surface,
  icon: surfaceIcons[surface.href],
  tone: surfaceTones[surface.href]
}));

export function DoraOfficeCommandSpine({ active }: { active: CommandSpineRoute }) {
  const activeSurface = surfaces.find((surface) => surface.href === active);

  if (!activeSurface) {
    throw new Error(`Unknown Doraemon Office command spine route: ${active}`);
  }

  return (
    <section className="dora-office-command-spine" aria-label="Doraemon Office public command spine">
      <div className="dora-office-command-spine-core">
        <span className="dora-office-command-spine-mark" aria-hidden>
          <DoraemonMark />
        </span>
        <div>
          <p>Public command spine</p>
          <strong>Doraemon coordinates. MiniDoras work. Weiyu decides.</strong>
          <span>Only sanitized state crosses into these routes.</span>
        </div>
      </div>

      <ol className="dora-office-command-spine-steps" aria-label="Doraemon Office read-only route map">
        {surfaces.map((surface) => {
          const Icon = surface.icon;
          const isActive = surface.href === active;

          return (
            <li key={surface.href} className={isActive ? "is-active" : undefined}>
              <Link href={surface.href} className="link-focus" aria-current={isActive ? "page" : undefined}>
                <span className={`dora-office-command-spine-icon dora-office-command-spine-icon-${surface.tone}`} aria-hidden>
                  <Icon size={16} />
                </span>
                <span>
                  <small>{surface.eyebrow}</small>
                  <strong>{surface.title}</strong>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <aside className="dora-office-command-spine-boundary" aria-label="Current public boundary">
        <div>
          <Eye size={16} aria-hidden />
          <span>Current Office surface</span>
          <strong>{activeSurface.title}</strong>
        </div>
        <p>{activeSurface.boundary}</p>
        <div className="dora-office-command-spine-badges">
          <StatusBadge tone="info">public-safe</StatusBadge>
          <StatusBadge tone="private">read-only</StatusBadge>
          <span>
            <ShieldCheck size={14} aria-hidden />
            No execution
          </span>
          <span>
            <LockKeyhole size={14} aria-hidden />
            Owner private
          </span>
        </div>
      </aside>
    </section>
  );
}
