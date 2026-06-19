// Owner-only command cockpit data. Do not import this module from public routes or shared client components.

export const commandSurfaceStatus = {
  mode: "Draft-only",
  runtime: "Not connected",
  approval: "Owner-gated",
  audit: "Required before execution APIs",
  posture: "Authenticated private surface",
  dispatch: "Unavailable"
} as const;

export const commandDraft = {
  title: "Redesign Weiyu Personal OS in safe implementation slices",
  prompt:
    "Turn the product blueprint into native website, Doraemon Office, Owner Cockpit, and research console surfaces. Validate each slice and request Opus review before moving on.",
  boundary: "No command is sent. This page prepares intent, plan, evidence, and review packets only."
} as const;

export const commandModeTabs = [
  { key: "draft", label: "Draft", icon: "radio" },
  { key: "plan_preview", label: "Plan preview", icon: "waypoints" },
  { key: "review_packet", label: "Review packet", icon: "clipboard" },
  { key: "evidence", label: "Evidence", icon: "file_search" },
  { key: "audit", label: "Audit", icon: "shield" }
] as const;

const REVIEW_PACKET_MODE_KEY = "review_packet";
const commandReviewPacketMode =
  commandModeTabs.find((tab) => tab.key === REVIEW_PACKET_MODE_KEY) ?? commandModeTabs[2];

export const commandSurfaceCopy = {
  badges: ["Owner-only", "Draft-only", "No dispatch"],
  heroTitle: "Draft a mission before anything moves.",
  heroDetail:
    "Command is the owner-level surface for shaping intent, previewing a plan, and preparing the exact review packet that must pass before implementation, publishing, or runtime work happens.",
  draftLabel: "Draft pad",
  draftAriaLabel: "Owner command draft",
  draftPlaceholder: "Describe intent, constraints, evidence needed, and review gates.",
  preparePacketAction: "Prepare packet",
  resetAction: "Reset",
  dispatchUnavailable: "Dispatch unavailable",
  lensGroupLabel: "Command context lens selector",
  activeLensLabel: "Active lens",
  reviewPacketLabel: commandReviewPacketMode.label,
  planEyebrow: "Plan preview",
  planTitle: "Five gates before work moves.",
  planDetail:
    "A command becomes a staged plan before it becomes implementation. Interpretation, design, implementation, verification, and review stay separate.",
  approvalTitle: "Owner checkpoints",
  approvalDetail:
    "The command surface separates allowed review from blocked execution so the next decision is obvious.",
  approvalStatus: "Owner review required",
  blockedActionsEyebrow: "Blocked actions",
  blockedActionsTitle: "No command execution",
  blockedActionsNote:
    "This cockpit can prepare a command packet only. It cannot dispatch tools, mutate files, publish, or approve itself.",
  agentTitle: "Agent routing",
  agentDetail:
    "The command surface shows who owns the next decision instead of hiding responsibility behind a single assistant response.",
  agentStatus: "Visible responsibility",
  agentNextLabel: "Next",
  evidenceTitle: "Evidence required",
  evidenceDetail:
    "A command cannot move to PR/deploy without evidence that matches the scope of the requested slice.",
  outputTitle: "Output shelf",
  auditTitle: "Audit boundary",
  auditDetail:
    "These rules keep the command surface useful now while leaving future execution APIs explicit and auditable.",
  auditBadge: "No hidden execution"
} as const;

export const commandReviewPacket = {
  title: "Implementation slice packet",
  summary: "A useful command becomes a bounded slice, a verification checklist, and an Opus review brief before PR/deploy.",
  sections: [
    { label: "Intent", value: "What owner wants changed" },
    { label: "Boundary", value: "What must not happen" },
    { label: "Evidence", value: "Build, auth, browser, leak probes" },
    { label: "Review", value: "Claude Opus GO before merge" }
  ]
} as const;

export const commandReadinessChecks = [
  {
    label: "Owner intent",
    state: "Captured",
    tone: "normal",
    detail: "The draft pad has explicit outcome, constraints, and taste notes."
  },
  {
    label: "Execution path",
    state: "Unavailable",
    tone: "private",
    detail: "No runtime dispatch, file mutation, publish, or workflow trigger exists here."
  },
  {
    label: "Review gate",
    state: "Required",
    tone: "warning",
    detail: "A slice cannot move forward without local evidence and Opus review."
  }
] as const;

export const commandModePanels = {
  draft: {
    title: "Capture owner intent without dispatch",
    detail:
      "The draft pad can hold direction, constraints, and taste notes. It stays browser-local in this draft slice and never calls a runtime API.",
    state: "Local only",
    tone: "private"
  },
  plan_preview: {
    title: "Separate thinking from execution",
    detail:
      "Doraemon turns intent into a staged plan with owners, gates, and verification. Every step is visible before implementation begins.",
    state: "Planning",
    tone: "info"
  },
  review_packet: {
    title: "Claude review before the next slice",
    detail:
      "The review packet captures changed files, local checks, browser evidence, and explicit safety boundaries for Opus review.",
    state: "Required",
    tone: "warning"
  },
  evidence: {
    title: "Proof first, confidence second",
    detail:
      "Build, browser, auth, screenshot, data-boundary, and production-smoke evidence must exist before work moves forward.",
    state: "Required",
    tone: "warning"
  },
  audit: {
    title: "Execution APIs remain out of scope",
    detail:
      "Future command APIs need authentication, audit logs, rollback posture, error handling, and explicit owner action.",
    state: "Blocked",
    tone: "private"
  }
} as const;

export const commandPlanStages = [
  {
    label: "Interpret",
    owner: "Doraemon",
    state: "Complete",
    tone: "normal",
    detail: "Restate the requested outcome, source docs, public/private boundary, and active slice.",
    proof: "Owner intent and source docs identified."
  },
  {
    label: "Design",
    owner: "Product MiniDora",
    state: "Working",
    tone: "info",
    detail: "Translate the product blueprint into an implementation-ready surface and interaction model.",
    proof: "Surface responsibility and non-goals are visible."
  },
  {
    label: "Implement",
    owner: "Dev MiniDora",
    state: "Working",
    tone: "info",
    detail: "Ship a narrow, native UI slice with local state, route wiring, and no hidden write path.",
    proof: "Changed files remain scoped to the slice."
  },
  {
    label: "Verify",
    owner: "Codex",
    state: "Required",
    tone: "warning",
    detail: "Run build, diff check, route protection, browser QA, responsive checks, and safety scans.",
    proof: "Evidence packet exists before review."
  },
  {
    label: "Review",
    owner: "Opus",
    state: "Required",
    tone: "warning",
    detail: "Claude Opus reviews product, safety, privacy, a11y, and regression risk before PR/deploy.",
    proof: "P1/P2 findings are fixed before merge."
  }
] as const;

export const commandApprovals = [
  {
    title: "Proceed to next slice",
    state: "Owner review",
    tone: "warning",
    detail: "Advance only after local checks and Opus review are clean.",
    decision: "Allowed only after evidence is attached."
  },
  {
    title: "Expose a new private API",
    state: "Blocked",
    tone: "private",
    detail: "Needs auth, audit, error, permission, and rollback design before any write path exists.",
    decision: "No API work in this slice."
  },
  {
    title: "Publish private knowledge",
    state: "Blocked",
    tone: "private",
    detail: "Requires explicit curation and public/private contract review.",
    decision: "No publishing controls are rendered."
  },
  {
    title: "Run autonomous workflow",
    state: "Unavailable",
    tone: "private",
    detail: "This surface can describe a workflow, but cannot dispatch tools or mutate systems.",
    decision: "No dispatch affordance exists."
  }
] as const;

export const commandAgents = [
  {
    name: "Doraemon",
    role: "Orchestrator",
    state: "Routing",
    tone: "info",
    focus: "Keeps intent, plan, evidence, and review boundaries aligned.",
    next: "Draft the mission shape and ask for owner review when ambiguity matters."
  },
  {
    name: "Product MiniDora",
    role: "Product",
    state: "Shaping",
    tone: "info",
    focus: "Turns the Personal OS blueprint into page responsibility, hierarchy, and interaction rules.",
    next: "Keep the surface useful without making it look like a fake assistant demo."
  },
  {
    name: "Dev MiniDora",
    role: "Implementation",
    state: "Ready",
    tone: "normal",
    focus: "Ships small slices and verifies build/browser/auth behavior.",
    next: "Implement only after the slice boundary is clear."
  },
  {
    name: "Evidence MiniDora",
    role: "Evidence",
    state: "Required",
    tone: "warning",
    focus: "Connects decisions back to docs, code, browser screenshots, and production smoke.",
    next: "Attach the evidence packet before review closes."
  },
  {
    name: "Trading MiniDora",
    role: "Research-only",
    state: "Guarded",
    tone: "private",
    focus: "Maintains market research boundaries without execution.",
    next: "Keep trading work research-only, no broker writes, no order flow."
  }
] as const;

export const commandEvidenceRequirements = [
  {
    title: "Build proof",
    detail: "Production build and TypeScript must pass before Opus review.",
    state: "Required",
    tone: "warning"
  },
  {
    title: "Browser proof",
    detail: "Desktop/mobile route checks, interaction state, console health, and overflow checks.",
    state: "Required",
    tone: "warning"
  },
  {
    title: "Auth proof",
    detail: "Unauthenticated /app/* requests must redirect to the owner gate without private shell render.",
    state: "Required",
    tone: "warning"
  },
  {
    title: "Data-boundary proof",
    detail: "No sensitive values, raw private paths, prompts, credentials, or execution affordances in the rendered UI.",
    state: "Required",
    tone: "warning"
  }
] as const;

export const commandOutputShelf = [
  { title: "Local build", state: "Required", detail: "Production build and static checks before review." },
  { title: "Browser QA", state: "Required", detail: "Desktop/mobile screenshots, console, overflow, and route checks." },
  { title: "Opus review", state: "Required", detail: "GO/NO-GO with P1/P2 findings before the next slice." },
  { title: "Production smoke", state: "Required", detail: "Post-deploy auth, bundle, and public/private boundary checks." }
] as const;

export const commandUnavailableActions = [
  "Runtime dispatch",
  "Tool execution",
  "File mutation",
  "Public publish",
  "Private API write",
  "Autonomous approval"
] as const;

export const commandAuditRules = [
  "No write or execution action appears until an authenticated API and audit trail are designed.",
  "Draft, plan, approval, execution, review, and deploy are separate product states.",
  "Public pages never import this private command scaffold.",
  "Failed auth should not render command content.",
  "Every implementation slice gets local evidence and Claude Opus review before PR/deploy."
] as const;

export const ownerCommandSurfaceData = {
  surfaceStatus: commandSurfaceStatus,
  copy: commandSurfaceCopy,
  draft: commandDraft,
  reviewPacketModeKey: commandReviewPacketMode.key,
  reviewPacket: commandReviewPacket,
  readinessChecks: commandReadinessChecks,
  modeTabs: commandModeTabs,
  modePanels: commandModePanels,
  planStages: commandPlanStages,
  approvals: commandApprovals,
  agents: commandAgents,
  evidenceRequirements: commandEvidenceRequirements,
  outputShelf: commandOutputShelf,
  unavailableActions: commandUnavailableActions,
  auditRules: commandAuditRules
} as const;
