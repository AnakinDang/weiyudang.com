import fs from "node:fs";
import path from "node:path";

export const publicAgentStates = {
  idle: "Idle",
  planning: "Planning",
  researching: "Working",
  coding: "Working",
  writing: "Working",
  tool_call: "Tool call",
  handoff: "Handoff",
  waiting_user: "Owner review",
  error: "Attention",
  done: "Completed",
  offline: "Offline",
  demo: "Demo"
} as const;

export type PublicAgentState = keyof typeof publicAgentStates;

export type PublicAgent = {
  publicId: string;
  displayName: string;
  stageName: string;
  role: string;
  state: PublicAgentState;
  stateLabel: string;
  summary: string;
  colorToken: string;
};

type RawAgent = {
  id: string;
  state?: unknown;
};

const publicAgentRegistry = {
  doraemon: {
    publicId: "agent_dora",
    displayName: "Doraemon",
    stageName: "Doraemon",
    role: "Orchestrator",
    summary: "Translates ideas into plans, handoffs, summaries, and review checkpoints.",
    colorToken: "dora-blue"
  },
  "minidora-research": {
    publicId: "agent_research",
    displayName: "Research MiniDora",
    stageName: "Research",
    role: "Research",
    summary: "Finds source-backed context and prepares evidence briefs.",
    colorToken: "dora-blue"
  },
  "minidora-dev": {
    publicId: "agent_dev",
    displayName: "Dev MiniDora",
    stageName: "Dev",
    role: "Engineering",
    summary: "Turns product slices into working software artifacts.",
    colorToken: "success"
  },
  "minidora-product": {
    publicId: "agent_product",
    displayName: "Product MiniDora",
    stageName: "Product",
    role: "Product Quality",
    summary: "Keeps scope, review standards, and release rhythm clear.",
    colorToken: "dora-blue"
  },
  "minidora-ops": {
    publicId: "agent_ops",
    displayName: "Ops MiniDora",
    stageName: "Ops",
    role: "Operations",
    summary: "Watches routines, schedules, and public-safe system health.",
    colorToken: "success"
  },
  "minidora-memory": {
    publicId: "agent_memory",
    displayName: "Memory MiniDora",
    stageName: "Memory",
    role: "Knowledge",
    summary: "Maintains durable context, summaries, and knowledge hygiene.",
    colorToken: "dora-blue"
  },
  "minidora-trading": {
    publicId: "agent_trading",
    displayName: "Trading MiniDora",
    stageName: "Trading",
    role: "Trading Research",
    summary: "Maintains an evidence-first research queue with owner review.",
    colorToken: "warning"
  },
  "minidora-media": {
    publicId: "agent_media",
    displayName: "Media MiniDora",
    stageName: "Media",
    role: "Creative Production",
    summary: "Builds repeatable workflows for images, video, and story assets.",
    colorToken: "bell-yellow"
  }
} as const;

const publicAgentOrder = [
  "doraemon",
  "minidora-research",
  "minidora-dev",
  "minidora-product",
  "minidora-ops",
  "minidora-memory",
  "minidora-trading",
  "minidora-media"
] as const;

type KnownAgentId = (typeof publicAgentOrder)[number];

function isKnownAgentId(id: string): id is KnownAgentId {
  return id in publicAgentRegistry;
}

export function getPublicAgents(): PublicAgent[] {
  const folder = path.join(process.cwd(), "content", "agents");
  const stateById = new Map<KnownAgentId, PublicAgentState>();

  fs
    .readdirSync(folder)
    .filter((file) => file.endsWith(".json"))
    .map((file) => JSON.parse(fs.readFileSync(path.join(folder, file), "utf8")) as RawAgent)
    .forEach((agent) => {
      if (!isKnownAgentId(agent.id)) {
        return;
      }

      stateById.set(
        agent.id,
        typeof agent.state === "string" && agent.state in publicAgentStates ? (agent.state as PublicAgentState) : "idle"
      );
    });

  return publicAgentOrder.map((agentId) => {
    const registryEntry = publicAgentRegistry[agentId];
    const state = stateById.get(agentId) ?? "idle";

    return {
      ...registryEntry,
      state,
      stateLabel: publicAgentStates[state]
    };
  });
}
