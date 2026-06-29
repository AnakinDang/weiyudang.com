import { redirect } from "next/navigation";
import { OwnerEventsSurface, type OwnerEventsInitialFilters, type OwnerEventsSurfaceData } from "@/components/OwnerEventsSurface";
import {
  isOwnerAgentId,
  isOwnerEventKind,
  ownerAgentIdFromRoute,
  OWNER_AGENT_PARAM,
  OWNER_EVENT_KIND_PARAM,
  ownerEventsHref
} from "@/lib/agent-route";
import { privateAgentRoster } from "@/lib/agent-ops";
import {
  privateEventBoundary,
  privateEventKinds,
  privateEventMetrics,
  privateEventTimeline,
  type PrivateEventKind
} from "@/lib/private/events";
import { requireOwnerSession } from "@/lib/private/owner-session";

export const dynamic = "force-dynamic";

type EventsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isEventKind(value: string | undefined): value is PrivateEventKind {
  return isOwnerEventKind(value) && privateEventKinds.includes(value as PrivateEventKind);
}

function agentFromSearchParams(params: Record<string, string | string[] | undefined> = {}) {
  const agentId = ownerAgentIdFromRoute(firstParam(params[OWNER_AGENT_PARAM]));
  return isOwnerAgentId(agentId) && privateAgentRoster.some((agent) => agent.id === agentId) ? agentId : undefined;
}

function eventKindFromSearchParams(params: Record<string, string | string[] | undefined> = {}) {
  const kind = firstParam(params[OWNER_EVENT_KIND_PARAM]);
  return isEventKind(kind) ? kind : undefined;
}

function nextPathFromSearchParams(params: Record<string, string | string[] | undefined> = {}) {
  return ownerEventsHref(agentFromSearchParams(params), eventKindFromSearchParams(params));
}

function hasInvalidAgentParam(params: Record<string, string | string[] | undefined> = {}) {
  return Boolean(firstParam(params[OWNER_AGENT_PARAM])) && !agentFromSearchParams(params);
}

function initialFiltersFrom(params: Record<string, string | string[] | undefined>): OwnerEventsInitialFilters {
  const kind = firstParam(params[OWNER_EVENT_KIND_PARAM]);

  return {
    agentId: agentFromSearchParams(params),
    kind: isEventKind(kind) ? kind : undefined
  };
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const params = await searchParams;
  await requireOwnerSession(nextPathFromSearchParams(params));

  if (hasInvalidAgentParam(params)) {
    redirect(ownerEventsHref(undefined, eventKindFromSearchParams(params)));
  }

  const data = {
    agents: privateAgentRoster.map((agent) => ({
      id: agent.id,
      name: agent.name,
      role: agent.role,
      state: agent.state,
      tone: agent.tone
    })),
    kinds: privateEventKinds,
    metrics: privateEventMetrics,
    events: privateEventTimeline,
    boundary: privateEventBoundary
  } satisfies OwnerEventsSurfaceData;

  return <OwnerEventsSurface data={data} initialFilters={initialFiltersFrom(params ?? {})} />;
}
