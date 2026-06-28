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
  slug: string;
  displayName: string;
  stageName: string;
  role: string;
  state: PublicAgentState;
  stateLabel: string;
  summary: string;
  visibility: "public";
  profileAsset: string;
  colorToken: string;
  focus: string;
  cadence: string;
  reviewGate: string;
  responsibilities: readonly string[];
  publicSignals: readonly string[];
  collaboratesWith: readonly string[];
  projectHref: string;
  projectLabel: string;
};

type RawAgent = {
  id: string;
  state?: unknown;
};

const publicAgentRegistry = {
  doraemon: {
    publicId: "agent_dora",
    slug: "doraemon",
    displayName: "Doraemon",
    stageName: "Doraemon",
    role: "Orchestrator",
    summary: "Translates ideas into plans, handoffs, summaries, and review checkpoints.",
    visibility: "public",
    profileAsset: "doraemon-mark",
    colorToken: "dora-blue",
    focus: "Keep the Personal OS coherent across public pages, owner review, and specialist MiniDoras.",
    cadence: "Continuously summarizes public-safe posture and routes work into review checkpoints.",
    reviewGate: "Weiyu keeps final judgment before private work becomes action.",
    responsibilities: [
      "Turn vague intent into scoped plans and visible next steps.",
      "Coordinate specialist MiniDoras without exposing private task detail.",
      "Bring decisions back to the owner when judgment or approval is required."
    ],
    publicSignals: ["Planning", "Handoff", "Owner review", "Completed"],
    collaboratesWith: [
      "Research MiniDora",
      "Dev MiniDora",
      "Product MiniDora",
      "Ops MiniDora",
      "Memory MiniDora",
      "Trading MiniDora",
      "Media MiniDora"
    ],
    projectHref: "/projects/doraemon-agent-system",
    projectLabel: "Doraemon Agent System"
  },
  "minidora-research": {
    publicId: "agent_research",
    slug: "research",
    displayName: "Research MiniDora",
    stageName: "Research",
    role: "Research",
    summary: "Finds source-backed context and prepares evidence briefs.",
    visibility: "public",
    profileAsset: "minidora-research-mark",
    colorToken: "dora-blue",
    focus: "Read broadly, compare sources, and turn messy questions into public-safe evidence briefs.",
    cadence: "Works in source-backed passes: collect, compare, summarize, and mark what is still missing.",
    reviewGate: "Public summaries stay curated; private notes and raw source excerpts remain out of the page.",
    responsibilities: [
      "Frame research questions before conclusions harden.",
      "Separate evidence, counter-evidence, and open questions.",
      "Prepare concise briefs for Doraemon and the owner review loop."
    ],
    publicSignals: ["Working", "Completed", "Owner review"],
    collaboratesWith: ["Memory MiniDora", "Trading MiniDora", "Product MiniDora", "Doraemon", "Media MiniDora"],
    projectHref: "/lab",
    projectLabel: "Research Lab"
  },
  "minidora-dev": {
    publicId: "agent_dev",
    slug: "dev",
    displayName: "Dev MiniDora",
    stageName: "Dev",
    role: "Engineering",
    summary: "Turns product slices into working software artifacts.",
    visibility: "public",
    profileAsset: "minidora-dev-mark",
    colorToken: "success",
    focus: "Move scoped product slices into tested, reviewable web surfaces.",
    cadence: "Builds in thin vertical slices, verifies locally, and keeps release evidence attached.",
    reviewGate: "No deploy is treated as shipped until build, boundary checks, and browser smoke pass.",
    responsibilities: [
      "Implement Next.js routes and components from the product blueprint.",
      "Preserve public/private boundaries while adding visible capability.",
      "Leave enough verification evidence for the next agent to continue."
    ],
    publicSignals: ["Working", "Tool call", "Completed"],
    collaboratesWith: ["Product MiniDora", "Ops MiniDora", "Doraemon"],
    projectHref: "/projects/weiyu-personal-os",
    projectLabel: "Weiyu Personal OS"
  },
  "minidora-product": {
    publicId: "agent_product",
    slug: "product",
    displayName: "Product MiniDora",
    stageName: "Product",
    role: "Product Quality",
    summary: "Keeps scope, review standards, and release rhythm clear.",
    visibility: "public",
    profileAsset: "minidora-product-mark",
    colorToken: "dora-blue",
    focus: "Turn broad Personal OS ambition into coherent surfaces that can be shipped and reviewed.",
    cadence: "Maintains scope, acceptance checks, and product language before implementation drifts.",
    reviewGate: "Every public surface must be understandable without revealing private operations.",
    responsibilities: [
      "Translate design documents into concrete page responsibilities.",
      "Keep each slice small enough to verify but meaningful enough to compound.",
      "Catch wording that overclaims live access, authority, or execution."
    ],
    publicSignals: ["Planning", "Handoff", "Owner review"],
    collaboratesWith: ["Dev MiniDora", "Research MiniDora", "Doraemon", "Media MiniDora"],
    projectHref: "/projects/weiyu-personal-os",
    projectLabel: "Weiyu Personal OS"
  },
  "minidora-ops": {
    publicId: "agent_ops",
    slug: "ops",
    displayName: "Ops MiniDora",
    stageName: "Ops",
    role: "Operations",
    summary: "Watches routines, schedules, and public-safe system health.",
    visibility: "public",
    profileAsset: "minidora-ops-mark",
    colorToken: "success",
    focus: "Keep the public operating posture legible while private control-plane detail stays hidden.",
    cadence: "Summarizes coarse health, schedule rhythm, and fallback state without exposing internals.",
    reviewGate: "Public pages can reassure; private repair controls stay behind the owner cockpit.",
    responsibilities: [
      "Watch public-safe heartbeat and freshness labels.",
      "Keep schedules readable without cron strings or prompt bodies.",
      "Route attention to the owner only when a safe summary is enough."
    ],
    publicSignals: ["Working", "Attention", "Completed"],
    collaboratesWith: ["Doraemon", "Memory MiniDora", "Dev MiniDora"],
    projectHref: "/dora/system",
    projectLabel: "Doraemon System"
  },
  "minidora-memory": {
    publicId: "agent_memory",
    slug: "memory",
    displayName: "Memory MiniDora",
    stageName: "Memory",
    role: "Knowledge",
    summary: "Maintains durable context, summaries, and knowledge hygiene.",
    visibility: "public",
    profileAsset: "minidora-memory-mark",
    colorToken: "dora-blue",
    focus: "Preserve context in curated summaries so public pages can explain the work without dumping private notes.",
    cadence: "Condenses handoffs, decisions, and durable project context after meaningful work completes.",
    reviewGate: "Private memory is never copied directly into public content.",
    responsibilities: [
      "Maintain summaries that help future agents continue safely.",
      "Separate public project context from private source material.",
      "Keep knowledge hygiene visible as a process, not as a raw database."
    ],
    publicSignals: ["Working", "Handoff", "Completed"],
    collaboratesWith: ["Research MiniDora", "Ops MiniDora", "Doraemon", "Trading MiniDora"],
    projectHref: "/projects/knowledge-vault",
    projectLabel: "Knowledge Vault"
  },
  "minidora-trading": {
    publicId: "agent_trading",
    slug: "trading",
    displayName: "Trading MiniDora",
    stageName: "Trading",
    role: "Trading Research",
    summary: "Maintains an evidence-first research queue with owner review.",
    visibility: "public",
    profileAsset: "minidora-trading-mark",
    colorToken: "warning",
    focus: "Organize market research questions, evidence gates, and uncertainty without execution.",
    cadence: "Builds research packets with source health, blockers, and owner-review posture.",
    reviewGate: "Research-only. Not an order, recommendation, or execution system.",
    responsibilities: [
      "Keep market work framed as research packets, not instructions.",
      "Separate evidence, counter-evidence, missing proof, and owner review.",
      "Avoid accounts, positions, orders, PnL, broker state, or live private signals."
    ],
    publicSignals: ["Working", "Owner review", "Attention"],
    collaboratesWith: ["Research MiniDora", "Memory MiniDora", "Doraemon"],
    projectHref: "/projects/minidora-trading",
    projectLabel: "MiniDora Trading"
  },
  "minidora-media": {
    publicId: "agent_media",
    slug: "media",
    displayName: "Media MiniDora",
    stageName: "Media",
    role: "Creative Production",
    summary: "Builds repeatable workflows for images, video, and story assets.",
    visibility: "public",
    profileAsset: "minidora-media-mark",
    colorToken: "bell-yellow",
    focus: "Turn visual experiments into reusable public-safe creative systems.",
    cadence: "Explores, selects, refines, and packages story assets without exposing private production notes.",
    reviewGate: "Public visuals stay curated, replaceable, and takedown-friendly.",
    responsibilities: [
      "Shape images, video concepts, and story assets into coherent systems.",
      "Keep public creative work separate from private source prompts and drafts.",
      "Support Doraemon Office with visuals that feel warm and precise."
    ],
    publicSignals: ["Working", "Completed", "Handoff"],
    collaboratesWith: ["Product MiniDora", "Research MiniDora", "Doraemon"],
    projectHref: "/projects/media",
    projectLabel: "AI Media Lab"
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

export function getPublicAgentBySlug(slug: string): PublicAgent | undefined {
  return getPublicAgents().find((agent) => agent.slug === slug);
}

export function publicAgentProfileInitial(agent: Pick<PublicAgent, "profileAsset" | "stageName">) {
  const assetParts = agent.profileAsset.split("-");
  const assetRole = assetParts[0] === "minidora" ? assetParts[1] : assetParts[0];

  return (assetRole ?? agent.stageName).slice(0, 1).toUpperCase();
}
