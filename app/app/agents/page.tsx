import { PrivateAgentsSurface } from "@/components/PrivateAgentsSurface";
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

function initialAgentFrom(params: Record<string, string | string[] | undefined>): PrivateAgentId | undefined {
  const agentId = firstParam(params.agent);
  return privateAgentRoster.some((agent) => agent.id === agentId) ? (agentId as PrivateAgentId) : undefined;
}

export default async function AgentsPage({ searchParams }: AgentsPageProps) {
  await requireOwnerSession("/app/agents");
  const params = await searchParams;
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
      initialAgentId={initialAgentFrom(params ?? {})}
    />
  );
}
