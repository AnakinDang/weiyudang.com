import type { Metadata } from "next";
import { PrivateAgentsSurface } from "@/components/PrivateAgentsSurface";
import {
  privateAgentBoundary,
  privateAgentCoverage,
  privateAgentHandoffs,
  privateAgentMetrics,
  privateAgentRoster,
  privateReviewQueue
} from "@/lib/agent-ops";

export const metadata: Metadata = {
  title: "Private Agents",
  description: "Owner-only MiniDora roster, leases, source health, review queue, and handoffs."
};

export default function AgentsPage() {
  return (
    <PrivateAgentsSurface
      agents={privateAgentRoster}
      metrics={privateAgentMetrics}
      coverage={privateAgentCoverage}
      boundary={privateAgentBoundary}
      handoffs={privateAgentHandoffs}
      reviewQueue={privateReviewQueue}
    />
  );
}
