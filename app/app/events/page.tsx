import { OwnerEventsSurface, type OwnerEventsInitialFilters, type OwnerEventsSurfaceData } from "@/components/OwnerEventsSurface";
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
  return Boolean(value && privateEventKinds.includes(value as PrivateEventKind));
}

function initialFiltersFrom(params: Record<string, string | string[] | undefined>): OwnerEventsInitialFilters {
  const agentId = firstParam(params.agent);
  const kind = firstParam(params.kind);

  return {
    agentId: privateAgentRoster.some((agent) => agent.id === agentId) ? agentId : undefined,
    kind: isEventKind(kind) ? kind : undefined
  };
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  await requireOwnerSession("/app/events");

  const params = await searchParams;
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
