export const OWNER_AGENT_PARAM = "agent";
export const OWNER_EVENT_KIND_PARAM = "kind";

export const OWNER_AGENT_ROUTES = [
  { routeId: "ag_01", agentId: "doraemon" },
  { routeId: "ag_02", agentId: "minidora-dev" },
  { routeId: "ag_03", agentId: "minidora-product" },
  { routeId: "ag_04", agentId: "minidora-research" },
  { routeId: "ag_05", agentId: "minidora-trading" },
  { routeId: "ag_06", agentId: "minidora-ops" },
  { routeId: "ag_07", agentId: "minidora-memory" },
  { routeId: "ag_08", agentId: "minidora-media" }
] as const;

export const OWNER_EVENT_KIND_VALUES = [
  "Agent history",
  "Handoff",
  "Review signal",
  "Boundary signal",
  "Source posture"
] as const;

export type OwnerAgentRouteId = (typeof OWNER_AGENT_ROUTES)[number]["routeId"];
export type OwnerAgentId = (typeof OWNER_AGENT_ROUTES)[number]["agentId"];
export type OwnerEventKind = (typeof OWNER_EVENT_KIND_VALUES)[number];

export function isOwnerAgentRouteId(value: string | null | undefined): value is OwnerAgentRouteId {
  return OWNER_AGENT_ROUTES.some((route) => route.routeId === value);
}

export function isOwnerAgentId(value: string | null | undefined): value is OwnerAgentId {
  return OWNER_AGENT_ROUTES.some((route) => route.agentId === value);
}

export function isOwnerEventKind(value: string | null | undefined): value is OwnerEventKind {
  return OWNER_EVENT_KIND_VALUES.some((kind) => kind === value);
}

export function ownerAgentIdFromRoute(value: string | null | undefined): OwnerAgentId | undefined {
  return OWNER_AGENT_ROUTES.find((route) => route.routeId === value)?.agentId;
}

export function ownerAgentRouteId(agentId: string | null | undefined): OwnerAgentRouteId | undefined {
  return OWNER_AGENT_ROUTES.find((route) => route.agentId === agentId)?.routeId;
}

function routeHref(pathname: "/app/agents" | "/app/events", agentId?: OwnerAgentId, eventKind?: OwnerEventKind) {
  const query = new URLSearchParams();
  const routeId = ownerAgentRouteId(agentId);

  if (routeId) {
    query.set(OWNER_AGENT_PARAM, routeId);
  }

  if (pathname === "/app/events" && eventKind) {
    query.set(OWNER_EVENT_KIND_PARAM, eventKind);
  }

  const queryString = query.toString();
  if (!queryString) {
    return pathname;
  }

  return `${pathname}?${queryString}`;
}

function routeHrefFromRouteId(
  pathname: "/app/agents" | "/app/events",
  routeId?: OwnerAgentRouteId,
  eventKind?: OwnerEventKind
) {
  const query = new URLSearchParams();

  if (routeId) {
    query.set(OWNER_AGENT_PARAM, routeId);
  }

  if (pathname === "/app/events" && eventKind) {
    query.set(OWNER_EVENT_KIND_PARAM, eventKind);
  }

  const queryString = query.toString();
  if (!queryString) {
    return pathname;
  }

  return `${pathname}?${queryString}`;
}

export function ownerAgentHref(agentId?: OwnerAgentId) {
  return routeHref("/app/agents", agentId);
}

export function ownerAgentHrefFromRouteId(routeId?: OwnerAgentRouteId) {
  return routeHrefFromRouteId("/app/agents", routeId);
}

export function ownerEventsHref(agentId?: OwnerAgentId, eventKind?: OwnerEventKind) {
  return routeHref("/app/events", agentId, eventKind);
}

export function ownerEventsHrefFromRouteId(routeId?: OwnerAgentRouteId, eventKind?: OwnerEventKind) {
  return routeHrefFromRouteId("/app/events", routeId, eventKind);
}
