import type { PublicDoraEvent } from "@/lib/dora-office";

export type DoraRelayHealth = {
  status: "ok";
  viewers: number;
  buffered: number;
  seen: number;
  hasRegistry: boolean;
};

const OPAQUE_EVENT_ID_RE = /^evt_[0-9a-f]{8,32}$/;
const SAFE_TOKEN_RE = /^[a-z0-9_.-]{1,64}$/i;
const TRADING_ROLE_TOKENS = new Set([
  "crypto",
  "execution",
  "fundamental",
  "macro",
  "news",
  "options",
  "quant",
  "risk",
  "social",
  "strategy",
  "technical"
]);

const EVENT_GROUPS = {
  agent_registered: "system",
  agent_state_changed: "agent_work",
  task_created: "agent_work",
  task_handoff: "handoff",
  task_completed: "agent_work",
  tool_call_started: "tool_call",
  tool_call_succeeded: "tool_call",
  tool_call_failed: "tool_call",
  owner_review_required: "owner_review",
  artifact_created: "agent_work",
  alert_created: "alert",
  scene_changed: "system",
  system_health_changed: "system",
  system_heartbeat: "system"
} as const satisfies Record<string, PublicDoraEvent["event_type"]>;

const FIXED_TITLES = {
  agent_registered: "Agent online",
  agent_state_changed: "Working",
  task_created: "Working",
  task_handoff: "Handoff",
  task_completed: "Completed",
  tool_call_started: "Tool call",
  tool_call_succeeded: "Tool done",
  tool_call_failed: "Tool failed",
  owner_review_required: "Owner review",
  artifact_created: "Artifact",
  alert_created: "Attention needed",
  scene_changed: "Scene",
  system_health_changed: "System health",
  system_heartbeat: "Heartbeat"
} as const satisfies Record<keyof typeof EVENT_GROUPS, string>;

const STATE_BY_EVENT = {
  agent_registered: "Working",
  agent_state_changed: "Working",
  task_created: "Planning",
  task_handoff: "Handoff",
  task_completed: "Completed",
  tool_call_started: "Tool call",
  tool_call_succeeded: "Completed",
  tool_call_failed: "Attention",
  owner_review_required: "Owner review",
  artifact_created: "Working",
  alert_created: "Attention",
  scene_changed: "Working",
  system_health_changed: "Working",
  system_heartbeat: "Working"
} as const satisfies Record<keyof typeof EVENT_GROUPS, PublicDoraEvent["state"]>;

const STATE_LABELS = {
  planning: "Planning",
  researching: "Working",
  coding: "Working",
  writing: "Working",
  rendering: "Working",
  monitoring: "Working",
  tool_call: "Tool call",
  handoff: "Handoff",
  waiting_user: "Owner review",
  error: "Attention",
  done: "Completed",
  started: "Working",
  succeeded: "Completed",
  failed: "Attention"
} as const satisfies Record<string, PublicDoraEvent["state"]>;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function safeString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function safeInteger(value: unknown): number | null {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : null;
}

function publicSeverity(value: unknown): PublicDoraEvent["severity"] {
  if (value === "warning" || value === "critical") return "warning";
  if (value === "debug" || value === "watch" || value === "info") return "info";
  return "normal";
}

function publicAgentLabel(agentId: unknown, agentRole: unknown): string {
  const id = safeString(agentId);
  const role = safeString(agentRole);
  const roleTokens = role?.split(/[^a-z0-9]+/i).filter(Boolean).map((token) => token.toLowerCase()) ?? [];

  if (!id) return "System";
  if (id === "doraemon") return "Doraemon";
  if (id === "minidora-codex" || role === "codex") return "Dev MiniDora";
  if (roleTokens.some((token) => TRADING_ROLE_TOKENS.has(token))) {
    return "Trading MiniDora";
  }
  if (id.startsWith("minidora-")) return "MiniDora";
  return "Doraemon";
}

function publicState(eventType: keyof typeof EVENT_GROUPS, value: unknown): PublicDoraEvent["state"] {
  const state = safeString(value);
  if (state && SAFE_TOKEN_RE.test(state) && state in STATE_LABELS) {
    return STATE_LABELS[state as keyof typeof STATE_LABELS];
  }
  return STATE_BY_EVENT[eventType];
}

export function normalizeRelayEvent(value: unknown): PublicDoraEvent | null {
  if (!isObject(value)) return null;

  const eventId = safeString(value["event_id"]);
  const eventType = safeString(value["event_type"]);
  const createdAt = safeString(value["created_at"]);

  if (!eventId || !OPAQUE_EVENT_ID_RE.test(eventId)) return null;
  if (!eventType || !(eventType in EVENT_GROUPS)) return null;
  if (!createdAt || Number.isNaN(Date.parse(createdAt))) return null;

  const typedEventType = eventType as keyof typeof EVENT_GROUPS;

  return {
    event_id: eventId,
    created_at: createdAt,
    event_type: EVENT_GROUPS[typedEventType],
    agent: publicAgentLabel(value["agent_id"], value["agent_role"]),
    state: publicState(typedEventType, value["state"]),
    severity: publicSeverity(value["severity"]),
    title: FIXED_TITLES[typedEventType]
  };
}

export function normalizeRelayHealth(value: unknown): DoraRelayHealth | null {
  if (!isObject(value) || value["status"] !== "ok") return null;

  const viewers = safeInteger(value["viewers"]);
  const buffered = safeInteger(value["buffered"]);
  const seen = safeInteger(value["seen"]);
  const hasRegistry = typeof value["has_registry"] === "boolean" ? value["has_registry"] : null;

  if (viewers === null || buffered === null || seen === null || hasRegistry === null) return null;

  return {
    status: "ok",
    viewers,
    buffered,
    seen,
    hasRegistry
  };
}

export function mergeLiveEvents(events: PublicDoraEvent[], next: PublicDoraEvent, limit = 12) {
  const deduped = [next, ...events.filter((event) => event.event_id !== next.event_id)];
  return deduped
    .sort((left, right) => Date.parse(right.created_at) - Date.parse(left.created_at))
    .slice(0, limit);
}
