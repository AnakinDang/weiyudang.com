export type PrivateAgentId =
  | "doraemon"
  | "minidora-dev"
  | "minidora-product"
  | "minidora-research"
  | "minidora-trading"
  | "minidora-ops"
  | "minidora-memory"
  | "minidora-media";

export type PrivateAgentRole =
  | "Orchestrator"
  | "Implementation"
  | "Product Quality"
  | "Evidence"
  | "Trading Research"
  | "Operations"
  | "Knowledge"
  | "Creative Production";

export type PrivateAgentTone = "normal" | "info" | "warning" | "private";
export type PrivateAgentSourceHealth = "Good" | "Partial" | "Degraded" | "Pending";
export type PrivateAgentLeaseStatus = "Active lease" | "Review lease" | "Owner-gated" | "Queued lease" | "Idle lease";

export type PrivateAgentHistoryItem = {
  time: string;
  title: string;
  state: string;
  tone: PrivateAgentTone;
  detail: string;
};

export type PrivateAgent = {
  id: PrivateAgentId;
  name: string;
  role: PrivateAgentRole;
  state: string;
  tone: PrivateAgentTone;
  lease: string;
  leaseStatus: PrivateAgentLeaseStatus;
  currentFocus: string;
  mission: string;
  capabilities: readonly string[];
  lastOutput: string;
  sourceHealth: PrivateAgentSourceHealth;
  sourceDetail: string;
  lastUpdated: string;
  nextReview: string;
  inputs: readonly string[];
  outputs: readonly string[];
  guardrail: string;
  history: readonly PrivateAgentHistoryItem[];
};

export type PrivateAgentMetric = {
  label: string;
  value: string;
  detail: string;
};

export type PrivateAgentCoverageLane = {
  label: string;
  owner: string;
  state: string;
  tone: PrivateAgentTone;
  detail: string;
};

export type PrivateAgentHandoff = {
  time: string;
  from: string;
  to: string;
  fromAgentId?: PrivateAgentId;
  toAgentId?: PrivateAgentId;
  state: string;
  tone: PrivateAgentTone;
  summary: string;
};

export const privateAgentRoster = [
  {
    id: "doraemon",
    name: "Doraemon",
    role: "Orchestrator",
    state: "Planning",
    tone: "info",
    lease: "Rollout conductor",
    leaseStatus: "Active lease",
    currentFocus: "Keep Personal OS implementation moving one reviewed slice at a time.",
    mission: "Translate owner intent into bounded work, route it to the right MiniDora, and keep review gates visible.",
    capabilities: ["Plan slicing", "handoff design", "review summaries", "boundary memory"],
    lastOutput: "Kept the rollout moving slice by slice with Opus review after each step.",
    sourceHealth: "Good",
    sourceDetail: "Docs, local build output, browser checks, and review packets are available.",
    lastUpdated: "Just now",
    nextReview: "Confirm the current Agents slice after local evidence and Opus review.",
    inputs: ["Owner instruction", "Personal OS docs", "previous review findings"],
    outputs: ["slice brief", "handoff packet", "risk notes"],
    guardrail: "Cannot approve its own work or bypass owner review.",
    history: [
      {
        time: "Now",
        title: "Agents slice in motion",
        state: "Planning",
        tone: "info",
        detail: "Routing this owner-only roster through implementation, verification, and Opus review."
      },
      {
        time: "Step 6",
        title: "Command surface closed",
        state: "Complete",
        tone: "normal",
        detail: "Merged the owner command surface after local QA and Claude review."
      },
      {
        time: "Step 5",
        title: "Trading boundary held",
        state: "Complete",
        tone: "normal",
        detail: "Kept market research inside a research-only cockpit with no execution path."
      }
    ]
  },
  {
    id: "minidora-dev",
    name: "Dev MiniDora",
    role: "Implementation",
    state: "Working",
    tone: "info",
    lease: "Frontend surface polish",
    leaseStatus: "Active lease",
    currentFocus: "Turn the private Agents page into a useful team operations surface.",
    mission: "Build native Next.js interfaces that preserve auth, public/private boundaries, and deployability.",
    capabilities: ["Next.js surfaces", "route wiring", "browser QA", "production smoke"],
    lastOutput: "Built native Doraemon Office, Owner Today, Trading Team, and Command surfaces.",
    sourceHealth: "Good",
    sourceDetail: "Code and verification artifacts are local to the protected worktree.",
    lastUpdated: "This session",
    nextReview: "Attach build, route, leak, and visual evidence before merge.",
    inputs: ["repo state", "design docs", "local QA"],
    outputs: ["component diff", "verification log", "deployment notes"],
    guardrail: "No hidden write path, dispatch button, or private API is added in UI-only slices.",
    history: [
      {
        time: "Now",
        title: "Roster interface polish",
        state: "Working",
        tone: "info",
        detail: "Building the private MiniDora roster into a scan-first team control panel."
      },
      {
        time: "Step 6",
        title: "Command QA packet",
        state: "Complete",
        tone: "normal",
        detail: "Produced build, route, browser, and leak evidence for the command surface."
      },
      {
        time: "Step 4",
        title: "Owner Today surface",
        state: "Complete",
        tone: "normal",
        detail: "Connected daily priorities, review pressure, and command shortcuts."
      }
    ]
  },
  {
    id: "minidora-product",
    name: "Product MiniDora",
    role: "Product Quality",
    state: "Reviewing",
    tone: "warning",
    lease: "Experience coherence",
    leaseStatus: "Review lease",
    currentFocus: "Keep the private cockpit consistent with the public Doraemon story and Owner Cockpit IA.",
    mission: "Translate the Personal OS blueprint into page responsibilities, acceptance checks, and interface hierarchy.",
    capabilities: ["IA alignment", "copy clarity", "acceptance gates", "scope control"],
    lastOutput: "Kept Command, Today, Trading, and Agents aligned with the source-of-truth docs.",
    sourceHealth: "Good",
    sourceDetail: "Product docs and implementation evidence are available for this slice.",
    lastUpdated: "This session",
    nextReview: "Check whether the Agents page now answers roster, lease, source-health, and handoff questions.",
    inputs: ["IA", "design brief", "auth spec"],
    outputs: ["page intent", "copy constraints", "review checklist"],
    guardrail: "Cannot expand a slice into execution, publishing, or broker behavior.",
    history: [
      {
        time: "Now",
        title: "Team surface acceptance",
        state: "Reviewing",
        tone: "warning",
        detail: "Checking that roster, history, capabilities, leases, and source health are all visible."
      },
      {
        time: "Step 6",
        title: "Command hierarchy review",
        state: "Complete",
        tone: "normal",
        detail: "Kept mission drafting separate from hidden execution."
      },
      {
        time: "Step 3",
        title: "Public Office alignment",
        state: "Complete",
        tone: "normal",
        detail: "Made the public Doraemon story line up with private cockpit vocabulary."
      }
    ]
  },
  {
    id: "minidora-research",
    name: "Research MiniDora",
    role: "Evidence",
    state: "Reviewing",
    tone: "warning",
    lease: "Spec alignment",
    leaseStatus: "Review lease",
    currentFocus: "Trace every private Agents field back to a documented purpose or a safe mock source.",
    mission: "Collect evidence, compare it with the design contract, and flag missing proof before owner decisions.",
    capabilities: ["Design-doc traceability", "boundary review", "source synthesis", "evidence summaries"],
    lastOutput: "Mapped each private surface back to Personal OS docs before implementation.",
    sourceHealth: "Partial",
    sourceDetail: "Current docs are complete enough for scaffolds; live sources are not connected.",
    lastUpdated: "This session",
    nextReview: "Verify the page says what evidence exists and what remains mocked.",
    inputs: ["docs", "review notes", "route smoke"],
    outputs: ["evidence packet", "gap list", "source posture"],
    guardrail: "No private source documents or raw memory records are rendered.",
    history: [
      {
        time: "Now",
        title: "Evidence posture check",
        state: "Reviewing",
        tone: "warning",
        detail: "Separating verified local evidence from intentionally mocked cockpit state."
      },
      {
        time: "Step 6",
        title: "Leak probe reviewed",
        state: "Complete",
        tone: "normal",
        detail: "Confirmed private command copy did not appear on unauthenticated login routes."
      },
      {
        time: "Step 5",
        title: "Research-only claim traced",
        state: "Complete",
        tone: "normal",
        detail: "Matched trading copy to the research-only contract."
      }
    ]
  },
  {
    id: "minidora-trading",
    name: "Trading MiniDora",
    role: "Trading Research",
    state: "Owner review",
    tone: "warning",
    lease: "Research-only console",
    leaseStatus: "Owner-gated",
    currentFocus: "Keep market research visible without creating order, broker, or recommendation paths.",
    mission: "Organize signals, disagreement, source degradation, and replay evidence for owner interpretation.",
    capabilities: ["Evidence gates", "desk disagreement", "source degradation", "research replay"],
    lastOutput: "Upgraded trading into a research cockpit with no execution affordance.",
    sourceHealth: "Degraded",
    sourceDetail: "Market data and broker connections are intentionally absent from this web surface.",
    lastUpdated: "Recent slice",
    nextReview: "Keep the research-only disclaimer visible wherever trading appears.",
    inputs: ["curated signal mocks", "research boundary", "source-health notes"],
    outputs: ["research posture", "evidence gate", "risk summary"],
    guardrail: "Research-only. Not an order, recommendation, or execution system.",
    history: [
      {
        time: "Now",
        title: "Owner-gated market lane",
        state: "Owner review",
        tone: "warning",
        detail: "Visible in the roster, but intentionally separated from broker or order workflows."
      },
      {
        time: "Step 5",
        title: "Research cockpit passed",
        state: "Complete",
        tone: "normal",
        detail: "Evidence, disagreement, and replay stayed research-only."
      },
      {
        time: "Queued",
        title: "Live data deferred",
        state: "Degraded",
        tone: "warning",
        detail: "Market and broker connections remain absent from this web surface."
      }
    ]
  },
  {
    id: "minidora-ops",
    name: "Ops MiniDora",
    role: "Operations",
    state: "Queued",
    tone: "private",
    lease: "Schedule and health surfaces",
    leaseStatus: "Queued lease",
    currentFocus: "Prepare the future Schedules and System Health cockpit slices.",
    mission: "Turn recurring rhythms and system status into calm, reviewable owner dashboards.",
    capabilities: ["schedule rhythm", "system posture", "health summaries", "runbook notes"],
    lastOutput: "Outlined where schedules, system health, and route smokes belong in the Owner Cockpit.",
    sourceHealth: "Partial",
    sourceDetail: "Cron and runtime sources are intentionally not connected to this page yet.",
    lastUpdated: "Queued",
    nextReview: "Define read-only schedule evidence before any private endpoint exists.",
    inputs: ["operating rhythm", "system health mocks", "acceptance checks"],
    outputs: ["schedule view", "health view", "ops handoff"],
    guardrail: "No cron command strings, ports, local paths, or restart controls are displayed.",
    history: [
      {
        time: "Queued",
        title: "Schedules slice waiting",
        state: "Queued",
        tone: "private",
        detail: "Needs a read-only evidence plan before runtime sources are connected."
      },
      {
        time: "Step 4",
        title: "System health preview",
        state: "Complete",
        tone: "normal",
        detail: "Kept owner cockpit status calm and route-protected."
      },
      {
        time: "Future",
        title: "Operational endpoints not wired",
        state: "Pending",
        tone: "private",
        detail: "No restart controls, cron commands, ports, or local paths are rendered."
      }
    ]
  },
  {
    id: "minidora-memory",
    name: "Memory MiniDora",
    role: "Knowledge",
    state: "Idle",
    tone: "private",
    lease: "Context preservation",
    leaseStatus: "Idle lease",
    currentFocus: "Keep future Knowledge Vault work separate from public pages and owner-only notes.",
    mission: "Preserve context, decisions, and reusable knowledge without leaking private memory into public bundles.",
    capabilities: ["context retrieval", "decision history", "knowledge synthesis", "privacy checks"],
    lastOutput: "Defined that public Knowledge pages show only curated synthesis, not raw vault material.",
    sourceHealth: "Pending",
    sourceDetail: "Private vault content is not exposed through this static cockpit slice.",
    lastUpdated: "Idle",
    nextReview: "Design Knowledge Vault evidence before connecting private sources.",
    inputs: ["curated notes", "decision logs", "public/private contract"],
    outputs: ["context brief", "memory boundary", "knowledge checklist"],
    guardrail: "No raw private vault pages, source files, or memory records appear in the UI.",
    history: [
      {
        time: "Idle",
        title: "Knowledge Vault deferred",
        state: "Idle",
        tone: "private",
        detail: "Waiting for a dedicated private knowledge slice."
      },
      {
        time: "Step 3",
        title: "Public boundary defined",
        state: "Complete",
        tone: "normal",
        detail: "Public knowledge pages stay curated and never expose raw vault material."
      },
      {
        time: "Future",
        title: "Memory sources not connected",
        state: "Pending",
        tone: "private",
        detail: "Private memory records are not available through this static cockpit."
      }
    ]
  },
  {
    id: "minidora-media",
    name: "Media MiniDora",
    role: "Creative Production",
    state: "Queued",
    tone: "private",
    lease: "Visual asset strategy",
    leaseStatus: "Queued lease",
    currentFocus: "Prepare a future asset pass for the Apple-like Personal OS and Doraemon Office visuals.",
    mission: "Create public-safe visuals that feel alive while keeping source asset collections replaceable and private.",
    capabilities: ["Image workflows", "story assets", "public-safe presentation", "asset replacement"],
    lastOutput: "Waiting for a future visual asset pass after the core cockpit surfaces stabilize.",
    sourceHealth: "Pending",
    sourceDetail: "No source asset library is exposed through the web app.",
    lastUpdated: "Queued",
    nextReview: "Generate and review assets only when the target page direction is fixed.",
    inputs: ["visual brief", "approved references", "asset policy"],
    outputs: ["concept frames", "runtime assets", "replacement notes"],
    guardrail: "Raw/source asset collections stay private and takedown-friendly.",
    history: [
      {
        time: "Queued",
        title: "Asset pass waiting",
        state: "Queued",
        tone: "private",
        detail: "Visual exploration waits until the target surface is stable enough to judge."
      },
      {
        time: "Step 1",
        title: "Apple-like direction captured",
        state: "Complete",
        tone: "normal",
        detail: "Personal site direction moved toward premium, minimal, alive interfaces."
      },
      {
        time: "Future",
        title: "Raw assets remain private",
        state: "Pending",
        tone: "private",
        detail: "Runtime visuals should stay replaceable and source collections stay outside public repos."
      }
    ]
  }
] as const satisfies readonly PrivateAgent[];

const activeLeaseCount = privateAgentRoster.filter(
  (agent) => agent.leaseStatus === "Active lease" || agent.leaseStatus === "Review lease"
).length;

const ownerGateCount = privateAgentRoster.filter((agent) => agent.leaseStatus === "Owner-gated").length;

export const privateAgentMetrics = [
  { label: "Roster", value: privateAgentRoster.length.toString(), detail: "Doraemon plus MiniDoras" },
  { label: "Active leases", value: activeLeaseCount.toString(), detail: "Active or review leases" },
  { label: "Owner gates", value: ownerGateCount.toString(), detail: "Owner-gated agent leases" },
  { label: "Executions", value: "0", detail: "No dispatch path in this surface" }
] as const satisfies readonly PrivateAgentMetric[];

export const privateAgentCoverage = [
  {
    label: "Direction",
    owner: "Doraemon",
    state: "Planning",
    tone: "info",
    detail: "Keeps the rollout, scope, and review loop coherent."
  },
  {
    label: "Build",
    owner: "Dev MiniDora",
    state: "Working",
    tone: "info",
    detail: "Turns approved slices into native, verified web surfaces."
  },
  {
    label: "Evidence",
    owner: "Research MiniDora",
    state: "Reviewing",
    tone: "warning",
    detail: "Collects proof, gaps, and boundary risks before PR/deploy."
  },
  {
    label: "Research",
    owner: "Trading MiniDora",
    state: "Owner review",
    tone: "warning",
    detail: "Keeps market work research-only and evidence-first."
  }
] as const satisfies readonly PrivateAgentCoverageLane[];

export const privateAgentBoundary = [
  "Owner-only route protected before the private shell renders.",
  "This page has no execute, approve, publish, trade, or dispatch control.",
  "Agent data is curated private mock state until authenticated APIs exist.",
  "Public Doraemon pages must continue to use sanitized public schemas only."
] as const satisfies readonly string[];

export const privateAgentHandoffs = [
  {
    time: "Step 3",
    from: "Dev MiniDora",
    to: "Opus",
    fromAgentId: "minidora-dev",
    state: "Complete",
    tone: "normal",
    summary: "Doraemon Office first screen passed review after P2 fixes."
  },
  {
    time: "Step 4",
    from: "Codex",
    to: "Opus",
    state: "Complete",
    tone: "normal",
    summary: "Owner Today passed after the complete packet proved auth and routes."
  },
  {
    time: "Step 5",
    from: "Trading MiniDora",
    to: "Opus",
    fromAgentId: "minidora-trading",
    state: "Complete",
    tone: "normal",
    summary: "Trading Team passed as research-only with no execution controls."
  },
  {
    time: "Step 6",
    from: "Doraemon",
    to: "Opus",
    fromAgentId: "doraemon",
    state: "Complete",
    tone: "normal",
    summary: "Command Surface passed after removing the accessibility textbox role."
  },
  {
    time: "Step 7",
    from: "Codex",
    to: "Owner",
    state: "Working",
    tone: "info",
    summary: "Private Agents and Review Queue are being shaped into cockpit surfaces."
  }
] as const satisfies readonly PrivateAgentHandoff[];
