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

export type PrivateReviewQueueEvidence = {
  label: string;
  state: string;
  tone: PrivateAgentTone;
  detail: string;
};

export type PrivateReviewQueueCheckpoint = {
  label: string;
  state: string;
  tone: PrivateAgentTone;
};

export type PrivateReviewQueueItem = {
  id: string;
  title: string;
  owner: string;
  agent: string;
  lane: string;
  surface: string;
  decision: string;
  tone: PrivateAgentTone;
  urgency: string;
  requestedDecision: string;
  recommendedHandling: string;
  evidence: readonly string[];
  evidenceCards: readonly PrivateReviewQueueEvidence[];
  checkpoints: readonly PrivateReviewQueueCheckpoint[];
  blockers: readonly string[];
  allowedNext: string;
  disallowedActions: readonly string[];
  updated: string;
  note: string;
};

export type PrivateReviewQueueMetric = {
  label: string;
  value: string;
  detail: string;
};

export type PrivateReviewQueueLane = {
  label: string;
  owner: string;
  count: string;
  state: string;
  tone: PrivateAgentTone;
  detail: string;
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
    guardrail: "Cannot approve its own work or bypass owner review."
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
    guardrail: "No hidden write path, dispatch button, or private API is added in UI-only slices."
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
    guardrail: "Cannot expand a slice into execution, publishing, or broker behavior."
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
    guardrail: "No private source documents or raw memory records are rendered."
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
    guardrail: "Research-only. Not an order, recommendation, or execution system."
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
    guardrail: "No cron command strings, ports, local paths, or restart controls are displayed."
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
    guardrail: "No raw private vault pages, source files, or memory records appear in the UI."
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
    guardrail: "Raw/source asset collections stay private and takedown-friendly."
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

export const privateReviewQueue = [
  {
    id: "review-private-events-surface",
    title: "Confirm Review Queue cockpit surface",
    owner: "Owner",
    agent: "Codex",
    lane: "Ship gate",
    surface: "/app/events",
    decision: "Review needed",
    tone: "warning",
    urgency: "Now",
    requestedDecision: "Decide whether this review surface is clear enough to enter PR after Opus review.",
    recommendedHandling: "Check local evidence, read the Opus finding list, then allow merge only if P1/P2 are closed.",
    evidence: ["Build output", "authenticated browser screenshots", "Opus review"],
    evidenceCards: [
      {
        label: "Build",
        state: "Required",
        tone: "warning",
        detail: "Production build and TypeScript must pass after the final diff."
      },
      {
        label: "Auth",
        state: "Required",
        tone: "warning",
        detail: "Unauthenticated /app/events must redirect before private shell content renders."
      },
      {
        label: "Review",
        state: "Required",
        tone: "warning",
        detail: "Claude Opus must return no open P1/P2 before PR/deploy."
      }
    ],
    checkpoints: [
      { label: "No approve button", state: "Held", tone: "private" },
      { label: "Evidence visible", state: "Required", tone: "warning" },
      { label: "Owner decides", state: "Required", tone: "warning" }
    ],
    blockers: ["No live private review API exists in this slice.", "The page must remain a decision register, not a workflow runner."],
    allowedNext: "Prepare PR only after local verification and Opus review are clean.",
    disallowedActions: ["Approve and execute", "Reject and run", "Publish", "Dispatch tools"],
    updated: "This session",
    note: "No private API or execution action should appear in this slice."
  },
  {
    id: "review-agent-history-depth",
    title: "Decide agent history depth",
    owner: "Owner",
    agent: "Doraemon",
    lane: "Product depth",
    surface: "/app/agents",
    decision: "Defer",
    tone: "private",
    urgency: "Next",
    requestedDecision: "Decide whether the next Agents pass needs a full per-agent timeline or the current snapshot is enough.",
    recommendedHandling: "Keep the current roster shipped, then revisit history depth when a private event source exists.",
    evidence: ["Step review history", "current slice summary"],
    evidenceCards: [
      {
        label: "Roster",
        state: "Complete",
        tone: "normal",
        detail: "The current Agents surface shows leases, source health, handoffs, and boundary."
      },
      {
        label: "History",
        state: "Deferred",
        tone: "private",
        detail: "True per-agent history needs a private timeline source, not invented UI rows."
      }
    ],
    checkpoints: [
      { label: "No fake history", state: "Held", tone: "normal" },
      { label: "Source needed", state: "Deferred", tone: "private" },
      { label: "Owner revisit", state: "Next", tone: "info" }
    ],
    blockers: ["No authenticated agent timeline source is connected yet."],
    allowedNext: "Track as a future Agents or Events depth slice.",
    disallowedActions: ["Invent history", "Expose raw runtime events", "Add a private API without audit design"],
    updated: "Recent slice",
    note: "Each cockpit surface should continue landing as a reviewed, coherent slice."
  },
  {
    id: "review-trading-boundary-copy",
    title: "Review trading research boundary copy",
    owner: "Owner",
    agent: "Trading MiniDora",
    lane: "Research boundary",
    surface: "/app/trading",
    decision: "Owner wording choice",
    tone: "warning",
    urgency: "Later",
    requestedDecision: "Decide whether the research-only disclaimer is strong enough for the private trading cockpit.",
    recommendedHandling: "Keep the disclaimer visible until the owner explicitly revises it.",
    evidence: ["Research-only disclaimer", "blocked action list", "source degradation panel"],
    evidenceCards: [
      {
        label: "Disclaimer",
        state: "Visible",
        tone: "normal",
        detail: "Trading Team states that it is research-only and not an order, recommendation, or execution system."
      },
      {
        label: "Source posture",
        state: "Degraded",
        tone: "warning",
        detail: "Market data and broker connections are intentionally absent from the web surface."
      },
      {
        label: "Actions",
        state: "Blocked",
        tone: "private",
        detail: "No broker, paper trading, live order, or auto-promotion path exists."
      }
    ],
    checkpoints: [
      { label: "Research-only", state: "Held", tone: "normal" },
      { label: "No broker write", state: "Held", tone: "private" },
      { label: "Owner wording", state: "Later", tone: "warning" }
    ],
    blockers: ["No trading execution authorization exists.", "Any future data connection must preserve research-only framing."],
    allowedNext: "Owner may revise copy, but not authorize execution from this page.",
    disallowedActions: ["Order placement", "Broker write", "Position sizing", "Recommendation wording"],
    updated: "Recent slice",
    note: "The console remains research-only and has no order, paper, live, or broker path."
  },
  {
    id: "review-private-api-audit",
    title: "Prepare future private API audit design",
    owner: "Owner",
    agent: "Dev MiniDora",
    lane: "Safety design",
    surface: "/app/command",
    decision: "Blocked",
    tone: "private",
    urgency: "Future",
    requestedDecision: "Decide when the team is ready to design audited write APIs.",
    recommendedHandling: "Keep all command surfaces read-only until auth, audit, rollback, and error handling are designed.",
    evidence: ["Auth/session spec", "command audit rules"],
    evidenceCards: [
      {
        label: "Auth",
        state: "Baseline",
        tone: "info",
        detail: "The current owner token gate is acceptable for read-only v0 dashboards."
      },
      {
        label: "Audit",
        state: "Missing",
        tone: "private",
        detail: "No audit log, rollback model, or write permission system exists yet."
      },
      {
        label: "Runtime",
        state: "Unavailable",
        tone: "private",
        detail: "No command or workflow dispatch endpoint is rendered in the cockpit."
      }
    ],
    checkpoints: [
      { label: "Auth model", state: "Known", tone: "info" },
      { label: "Audit model", state: "Missing", tone: "private" },
      { label: "Write APIs", state: "Blocked", tone: "private" }
    ],
    blockers: ["No audited write API design exists.", "No rollback behavior exists.", "No owner action confirmation model exists."],
    allowedNext: "Write an implementation spec before any action button appears.",
    disallowedActions: ["Hidden execution", "One-click approve", "Silent retry", "Unaudited mutation"],
    updated: "Future",
    note: "No write endpoint should be added until audit, rollback, and error handling are designed."
  }
] as const satisfies readonly PrivateReviewQueueItem[];

const reviewQueueNowCount = privateReviewQueue.filter((item) => item.urgency === "Now").length;
const reviewQueueBlockedCount = privateReviewQueue.filter((item) => item.tone === "private").length;
const reviewQueueEvidenceCount = privateReviewQueue.reduce((total, item) => total + item.evidenceCards.length, 0);

export const reviewQueueMetrics = [
  { label: "Open decisions", value: privateReviewQueue.length.toString(), detail: "Owner-visible review items" },
  { label: "Now", value: reviewQueueNowCount.toString(), detail: "Needs current attention" },
  { label: "Blocked", value: reviewQueueBlockedCount.toString(), detail: "No action path allowed" },
  { label: "Evidence cards", value: reviewQueueEvidenceCount.toString(), detail: "Proof or gap rows" }
] as const satisfies readonly PrivateReviewQueueMetric[];

export const reviewQueueLanes = [
  {
    label: "Ship gate",
    owner: "Codex + Opus",
    count: privateReviewQueue.filter((item) => item.lane === "Ship gate").length.toString(),
    state: "Current",
    tone: "warning",
    detail: "Local evidence and external review must be clean before PR/deploy."
  },
  {
    label: "Product depth",
    owner: "Doraemon",
    count: privateReviewQueue.filter((item) => item.lane === "Product depth").length.toString(),
    state: "Deferred",
    tone: "private",
    detail: "Depth work waits for a real source instead of invented history."
  },
  {
    label: "Research boundary",
    owner: "Trading MiniDora",
    count: privateReviewQueue.filter((item) => item.lane === "Research boundary").length.toString(),
    state: "Owner wording",
    tone: "warning",
    detail: "Trading stays research-only and evidence-first."
  },
  {
    label: "Safety design",
    owner: "Dev MiniDora",
    count: privateReviewQueue.filter((item) => item.lane === "Safety design").length.toString(),
    state: "Blocked",
    tone: "private",
    detail: "Write APIs need audit and rollback design before controls exist."
  }
] as const satisfies readonly PrivateReviewQueueLane[];

export const reviewQueuePolicy = [
  "Approvals, rejects, notes, and deferrals are represented as review states only.",
  "This page has no approve, reject, publish, execute, or dispatch button.",
  "Every decision item must show evidence or say what evidence is missing.",
  "No silent auto-promotion from review state to execution state."
] as const;
