import "server-only";

import {
  privateAgentBoundary,
  privateAgentHandoffs,
  privateAgentRoster,
  type PrivateAgent,
  type PrivateAgentId,
  type PrivateAgentHandoff,
  type PrivateAgentTone
} from "@/lib/agent-ops";
import { ownerReviewQueueData } from "@/lib/private/review-queue";
import { ownerSystemHref } from "@/lib/system-route";

export type PrivateEventKind = "Agent history" | "Handoff" | "Review signal" | "Boundary signal" | "Source posture";

export type PrivateEventTimelineItem = {
  id: string;
  sortOrder: number;
  kind: PrivateEventKind;
  time: string;
  title: string;
  detail: string;
  state: string;
  tone: PrivateAgentTone;
  agentId?: PrivateAgentId;
  agentName: string;
  source: string;
  evidence: readonly string[];
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
};

export type PrivateEventMetric = {
  label: string;
  value: string;
  detail: string;
};

export const privateEventKinds = [
  "Agent history",
  "Handoff",
  "Review signal",
  "Boundary signal",
  "Source posture"
] as const satisfies readonly PrivateEventKind[];

const agentByName = new Map<string, PrivateAgent>(privateAgentRoster.map((agent) => [agent.name, agent]));

function agentHref(agentId?: PrivateAgentId) {
  return agentId ? `/app/agents?agent=${agentId}` : "/app/agents";
}

const historyEvents = privateAgentRoster.flatMap((agent, agentIndex) =>
  agent.history.map((item, itemIndex) => {
    const event = {
      id: `history-${agent.id}-${itemIndex}`,
      sortOrder: 5000 - agentIndex * 20 - itemIndex,
      kind: "Agent history",
      time: item.time,
      title: item.title,
      detail: item.detail,
      state: item.state,
      tone: item.tone,
      agentId: agent.id,
      agentName: agent.name,
      source: "Curated agent roster",
      evidence: [agent.leaseStatus, agent.sourceHealth, "Guardrail held"],
      primaryHref: agentHref(agent.id),
      primaryLabel: "Open agent context",
      secondaryHref: "/app/review",
      secondaryLabel: "Open review queue"
    } satisfies PrivateEventTimelineItem;

    return event;
  })
);

const handoffs: readonly PrivateAgentHandoff[] = privateAgentHandoffs;

const handoffEvents = handoffs.map((handoff, index) => {
  const agentId = handoff.fromAgentId ?? handoff.toAgentId;

  return {
    id: `handoff-${index}`,
    sortOrder: 4200 - index,
    kind: "Handoff",
    time: handoff.time,
    title: `${handoff.from} to ${handoff.to}`,
    detail: handoff.summary,
    state: handoff.state,
    tone: handoff.tone,
    agentId,
    agentName: handoff.from,
    source: "Handoff register",
    evidence: ["Coordination chain", "Owner review loop"],
    primaryHref: agentHref(agentId),
    primaryLabel: "Open agent context",
    secondaryHref: "/app/review",
    secondaryLabel: "Open review queue"
  } satisfies PrivateEventTimelineItem;
});

const reviewEvents = ownerReviewQueueData.queue.map((item, index) => {
  const agent = agentByName.get(item.agent);
  const secondaryPointsToEvents = item.secondaryHref.startsWith("/app/events");
  const secondaryHref = secondaryPointsToEvents ? agentHref(agent?.id) : item.secondaryHref;
  const secondaryLabel = secondaryPointsToEvents ? "Open agent context" : item.secondaryLabel;

  return {
    id: `review-${item.id}`,
    sortOrder: 3600 - index,
    kind: "Review signal",
    time: item.updated,
    title: item.title,
    detail: item.requestedDecision,
    state: item.decision,
    tone: item.tone,
    agentId: agent?.id,
    agentName: item.agent,
    source: "Review Queue",
    evidence: item.evidence,
    primaryHref: "/app/review",
    primaryLabel: "Open review queue",
    secondaryHref,
    secondaryLabel
  } satisfies PrivateEventTimelineItem;
});

const sourcePostureEvents = privateAgentRoster.map((agent, index) => {
  const event = {
    id: `source-${agent.id}`,
    sortOrder: 3000 - index,
    kind: "Source posture",
    time: agent.lastUpdated,
    title: `${agent.name} source posture`,
    detail: agent.sourceDetail,
    state: agent.sourceHealth,
    tone:
      agent.sourceHealth === "Good"
        ? "normal"
        : agent.sourceHealth === "Partial"
          ? "warning"
          : "private",
    agentId: agent.id,
    agentName: agent.name,
    source: "Source health register",
    evidence: [agent.lease, agent.nextReview],
    primaryHref: agentHref(agent.id),
    primaryLabel: "Open agent context",
    secondaryHref: ownerSystemHref("event-freshness"),
    secondaryLabel: "Open system health"
  } satisfies PrivateEventTimelineItem;

  return event;
});

const boundaryEvents = privateAgentBoundary.map((item, index) => {
  const event = {
    id: `boundary-${index}`,
    sortOrder: 2500 - index,
    kind: "Boundary signal",
    time: "Always",
    title: "Boundary held",
    detail: item,
    state: "Held",
    tone: "private",
    agentName: "Owner Cockpit",
    source: "Boundary contract",
    evidence: ["Owner-only", "Read-only", "No dispatch"],
    primaryHref: ownerSystemHref("doraemon-public-boundary"),
    primaryLabel: "Open system health",
    secondaryHref: "/app/review",
    secondaryLabel: "Open review queue"
  } satisfies PrivateEventTimelineItem;

  return event;
});

export const privateEventTimeline: readonly PrivateEventTimelineItem[] = [
  ...historyEvents,
  ...handoffEvents,
  ...reviewEvents,
  ...sourcePostureEvents,
  ...boundaryEvents
].sort((left, right) => right.sortOrder - left.sortOrder);

const representedAgentCount = new Set(privateEventTimeline.flatMap((event) => event.agentId ? [event.agentId] : [])).size;
const reviewSignalCount = privateEventTimeline.filter((event) => event.kind === "Review signal").length;
const sourcePostureCount = privateEventTimeline.filter((event) => event.kind === "Source posture").length;

export const privateEventMetrics = [
  {
    label: "Private events",
    value: privateEventTimeline.length.toString(),
    detail: "Curated cockpit packets"
  },
  {
    label: "Agents represented",
    value: representedAgentCount.toString(),
    detail: "MiniDora lanes with context"
  },
  {
    label: "Review signals",
    value: reviewSignalCount.toString(),
    detail: "Owner-gated packets"
  },
  {
    label: "Source postures",
    value: sourcePostureCount.toString(),
    detail: "Source health summaries"
  },
  {
    label: "Executions",
    value: "0",
    detail: "No dispatch path"
  }
] as const satisfies readonly PrivateEventMetric[];

export const privateEventBoundary = [
  "Events are curated private cockpit packets, not raw runtime payloads.",
  "No raw prompts, task bodies, local paths, account details, or tool payloads are rendered.",
  "This page can route to owner-only context, but it cannot approve, publish, trade, dispatch, or execute work.",
  "A future live private event source needs a separate schema, retention, and audit design."
] as const;
