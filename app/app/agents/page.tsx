import { PrivateAgentsSurface } from "@/components/PrivateAgentsSurface";
import {
  privateAgentBoundary,
  privateAgentCoverage,
  privateAgentHandoffs,
  privateAgentMetrics,
  privateAgentRoster
} from "@/lib/agent-ops";
import { requireOwnerSession } from "@/lib/private/owner-session";
import { ownerReviewQueueData } from "@/lib/private/review-queue";

export const dynamic = "force-dynamic";

export default async function AgentsPage() {
  await requireOwnerSession("/app/agents");
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
    />
  );
}
