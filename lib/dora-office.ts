import type { PublicAgent } from "@/lib/public-agents";
export { formatPublicEventDateTime, formatPublicEventTime, getPublicToolLabel } from "@/lib/dora-public-format";

export const DORA_LIVE_BRIDGE_URL = "https://dora.weiyudang.com";
export const DORA_RELAY_HEALTH_URL = "https://relay.weiyudang.com/health";

export const doraOfficeRoutes = [
  { href: "/dora", label: "Overview" },
  { href: "/dora/office", label: "Office Live" },
  { href: "/dora/activity", label: "Activity" },
  { href: "/dora/team", label: "Team Agents" },
  { href: "/dora/tasks", label: "Tasks" },
  { href: "/dora/schedules", label: "Schedules" },
  { href: "/dora/knowledge", label: "Knowledge" },
  { href: "/dora/system", label: "System" }
] as const;

export type DoraOfficeRoute = (typeof doraOfficeRoutes)[number]["href"];

export type PublicDoraEvent = {
  event_id: string;
  created_at: string;
  event_type: "agent_work" | "handoff" | "tool_call" | "owner_review" | "alert" | "system";
  agent: string;
  state: "Planning" | "Working" | "Tool call" | "Handoff" | "Owner review" | "Completed" | "Attention" | "Demo";
  severity: "normal" | "info" | "warning";
  title: string;
  tool_name?: string;
};

export function getPublicAgentTone(agent: Pick<PublicAgent, "state">) {
  if (agent.state === "waiting_user") {
    return "warning";
  }

  if (agent.state === "error") {
    return "danger";
  }

  if (agent.state === "done") {
    return "normal";
  }

  if (agent.state === "offline") {
    return "private";
  }

  return "info";
}

export const publicDoraEvents: PublicDoraEvent[] = [
  {
    event_id: "evt_9f2a0c71",
    created_at: "2026-06-13T11:05:00+08:00",
    event_type: "alert",
    agent: "Ops MiniDora",
    state: "Attention",
    severity: "warning",
    title: "Attention needed"
  },
  {
    event_id: "evt_68815d67",
    created_at: "2026-06-13T11:04:00+08:00",
    event_type: "owner_review",
    agent: "Doraemon",
    state: "Owner review",
    severity: "warning",
    title: "Owner review"
  },
  {
    event_id: "evt_71f20be1",
    created_at: "2026-06-13T11:03:00+08:00",
    event_type: "tool_call",
    agent: "Dev MiniDora",
    state: "Tool call",
    severity: "info",
    title: "Tool call",
    tool_name: "browser_check"
  },
  {
    event_id: "evt_44a91d0f",
    created_at: "2026-06-13T11:02:00+08:00",
    event_type: "handoff",
    agent: "Research MiniDora",
    state: "Handoff",
    severity: "normal",
    title: "Handoff"
  },
  {
    event_id: "evt_105e5a2c",
    created_at: "2026-06-13T11:01:00+08:00",
    event_type: "agent_work",
    agent: "Product MiniDora",
    state: "Planning",
    severity: "normal",
    title: "Planning"
  },
  {
    event_id: "evt_5c12d9aa",
    created_at: "2026-06-13T11:00:00+08:00",
    event_type: "system",
    agent: "Ops MiniDora",
    state: "Tool call",
    severity: "info",
    title: "System check",
    tool_name: "browser_check"
  },
  {
    event_id: "evt_6aa103df",
    created_at: "2026-06-13T10:59:00+08:00",
    event_type: "agent_work",
    agent: "Memory MiniDora",
    state: "Working",
    severity: "normal",
    title: "Working"
  },
  {
    event_id: "evt_7b24cb90",
    created_at: "2026-06-13T10:58:00+08:00",
    event_type: "owner_review",
    agent: "Trading MiniDora",
    state: "Owner review",
    severity: "warning",
    title: "Owner review"
  },
  {
    event_id: "evt_8d19fe43",
    created_at: "2026-06-13T10:57:00+08:00",
    event_type: "agent_work",
    agent: "Media MiniDora",
    state: "Working",
    severity: "normal",
    title: "Working"
  }
];

export function getRecentPublicDoraEvents(limit?: number) {
  const events = [...publicDoraEvents].sort((a, b) => b.created_at.localeCompare(a.created_at));

  return typeof limit === "number" ? events.slice(0, limit) : events;
}

export const publicDoraTasks = [
  {
    publicKey: "t_2f41a9c0",
    title: "Owner review",
    state: "Owner review",
    tone: "warning",
    agentRole: "Coordinator",
    updated: "Recent",
    severity: "warning",
    summary: "A public-safe review checkpoint is waiting for Weiyu. The private task title and prompt stay hidden."
  },
  {
    publicKey: "t_7c18b2e4",
    title: "Working",
    state: "Working",
    tone: "info",
    agentRole: "Trading research",
    updated: "Recent",
    severity: "normal",
    summary: "Research-only context is being prepared without account data or execution paths."
  },
  {
    publicKey: "t_9adc74a6",
    title: "Completed",
    state: "Completed",
    tone: "normal",
    agentRole: "Operations",
    updated: "Earlier today",
    severity: "normal",
    summary: "A sanitized operating item completed and is safe to display as an aggregate public state."
  },
  {
    publicKey: "t_4e6b8d21",
    title: "Attention needed",
    state: "Attention",
    tone: "danger",
    agentRole: "System health",
    updated: "Recent",
    severity: "warning",
    summary: "A public-safe attention state is visible while private diagnostics, paths, and repair actions stay hidden."
  }
] as const;

export const publicDoraTaskStats = [
  { label: "Working", value: "1", tone: "info" },
  { label: "Owner review", value: "1", tone: "warning" },
  { label: "Attention", value: "1", tone: "danger" },
  { label: "Completed", value: "1", tone: "normal" }
] as const;

export const publicSchedules = [
  {
    name: "Daily brief",
    cadence: "Morning",
    state: "Working",
    tone: "info",
    last: "Today",
    next: "Next morning",
    summary: "A concise public rhythm for priorities, review points, and watch items."
  },
  {
    name: "Market scan",
    cadence: "Market days",
    state: "Working",
    tone: "info",
    last: "Recent session",
    next: "Next session",
    summary: "Research-only market context with coarse public status and no private execution path."
  },
  {
    name: "System health",
    cadence: "Daily",
    state: "Working",
    tone: "info",
    last: "Today",
    next: "Tonight",
    summary: "A safe abstraction of freshness, queue posture, and public relay state."
  },
  {
    name: "Weekly review",
    cadence: "Weekly",
    state: "Owner review",
    tone: "warning",
    last: "This week",
    next: "This week",
    summary: "A slower review loop for shipped work, deferred decisions, and public-safe outcomes."
  }
] as const;

export const publicScheduleBoundaries = [
  "Only coarse cadence and next-window labels are public.",
  "No scheduler command strings, local paths, private prompts, or controls are rendered.",
  "Research schedules remain read-only and cannot change private systems."
] as const;

export const publicSystemStatus = [
  {
    label: "Relay mode",
    value: "Live bridge + demo fallback",
    tone: "info",
    detail: "The public dashboard can fall back to a demo snapshot when live relay state is unavailable."
  },
  {
    label: "Public schema",
    value: "Closed allowlist",
    tone: "normal",
    detail: "Events and registry fields are rebuilt from explicit public fields before rendering."
  },
  {
    label: "Event freshness",
    value: "Last event: demo snapshot",
    tone: "info",
    detail: "This public slice uses a fixed demo-safe snapshot until a sanitized age is available."
  },
  {
    label: "Replay buffer",
    value: "Sanitized only",
    tone: "normal",
    detail: "Replay buffers contain public events and dedupe by opaque public event ID."
  }
] as const;

export const publicSystemEvents = [
  {
    time: "Latest",
    label: "Public schema check",
    state: "OK",
    tone: "normal",
    detail: "Only explicit public fields are rendered."
  },
  {
    time: "Recent",
    label: "Freshness posture",
    state: "Demo",
    tone: "info",
    detail: "The page reports a coarse demo-safe snapshot instead of private telemetry."
  },
  {
    time: "Replay",
    label: "Dedupe posture",
    state: "OK",
    tone: "normal",
    detail: "Replay entries stay sanitized and keyed by opaque public event labels."
  },
  {
    time: "Owner",
    label: "Operations boundary",
    state: "Private",
    tone: "private",
    detail: "Diagnostics and repair actions stay in authenticated owner surfaces."
  }
] as const;

export const publicSystemBoundaries = [
  "Public visitors can see live/demo posture and public schema health.",
  "Private infrastructure details, credentials, and diagnostic logs stay behind owner access.",
  "This page is display-only and has no repair, restart, deploy, or purge controls."
] as const;

export function latestAgentEvent(agent: PublicAgent) {
  return publicDoraEvents.find((event) => event.agent === agent.displayName);
}
