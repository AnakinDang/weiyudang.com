import { redirect } from "next/navigation";
import { PrivateAgentsSurface } from "@/components/PrivateAgentsSurface";
import {
  isOwnerAgentId,
  ownerAgentHref,
  ownerAgentIdFromRoute,
  OWNER_AGENT_PARAM
} from "@/lib/agent-route";
import type { OwnerAgentId } from "@/lib/agent-route";
import {
  type PrivateAgentId,
  privateAgentBoundary,
  privateAgentCoverage,
  privateAgentHandoffs,
  privateAgentMetrics,
  privateAgentRoster
} from "@/lib/agent-ops";
import { requireOwnerSession } from "@/lib/private/owner-session";
import { ownerReviewQueueData } from "@/lib/private/review-queue";

export const dynamic = "force-dynamic";

type AgentsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function agentFromSearchParams(params: Record<string, string | string[] | undefined> = {}): OwnerAgentId | undefined {
  const agentId = ownerAgentIdFromRoute(firstParam(params[OWNER_AGENT_PARAM]));
  return isOwnerAgentId(agentId) && privateAgentRoster.some((agent) => agent.id === agentId) ? agentId : undefined;
}

function nextPathFromSearchParams(params: Record<string, string | string[] | undefined> = {}) {
  return ownerAgentHref(agentFromSearchParams(params));
}

function hasInvalidAgentParam(params: Record<string, string | string[] | undefined> = {}) {
  return Boolean(firstParam(params[OWNER_AGENT_PARAM])) && !agentFromSearchParams(params);
}

export default async function AgentsPage({ searchParams }: AgentsPageProps) {
  const params = await searchParams;
  await requireOwnerSession(nextPathFromSearchParams(params));

  if (hasInvalidAgentParam(params)) {
    redirect(ownerAgentHref());
  }

  const initialAgentId = agentFromSearchParams(params) as PrivateAgentId | undefined;
  const reviewQueuePreview = ownerReviewQueueData.queue.map((item) => ({
    title: item.title,
    tone: item.tone,
    decision: item.decision,
    urgency: item.urgency,
    agent: item.agent,
    note: item.note
  }));

  return (
    <PrivateAgentsSurface
      agents={privateAgentRoster}
      metrics={privateAgentMetrics}
      coverage={privateAgentCoverage}
      boundary={privateAgentBoundary}
      handoffs={privateAgentHandoffs}
      reviewQueue={reviewQueuePreview}
      initialAgentId={initialAgentId}
    />
  );
}
