export const commandSurfaceStatus = {
  mode: "Draft-only",
  runtime: "Not connected",
  approval: "Owner-gated",
  audit: "Required before execution APIs"
} as const;

export const commandDraft = {
  title: "Redesign Weiyu Personal OS in safe implementation slices",
  prompt:
    "Turn the product blueprint into native website, Doraemon Office, Owner Cockpit, and research console surfaces. Validate each slice and request Opus review before moving on.",
  boundary: "No command is sent. This page prepares intent, plan, evidence, and review packets only."
} as const;

export const commandModeTabs = ["Draft", "Plan preview", "Review packet", "Evidence", "Audit"] as const;

export const commandModePanels = {
  Draft: {
    title: "Capture owner intent without dispatch",
    detail:
      "The draft pad can hold direction, constraints, and taste notes. It stays browser-local in this static slice and never calls a runtime API.",
    state: "Local only",
    tone: "private"
  },
  "Plan preview": {
    title: "Separate thinking from execution",
    detail:
      "Doraemon turns intent into a staged plan with owners, gates, and verification. Every step is visible before implementation begins.",
    state: "Planning",
    tone: "info"
  },
  "Review packet": {
    title: "Claude review before the next slice",
    detail:
      "The review packet captures changed files, local checks, browser evidence, and explicit safety boundaries for Opus review.",
    state: "Required",
    tone: "warning"
  },
  Evidence: {
    title: "Proof first, confidence second",
    detail:
      "Build, browser, auth, screenshot, data-boundary, and production-smoke evidence must exist before work moves forward.",
    state: "Required",
    tone: "warning"
  },
  Audit: {
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
    detail: "Restate the requested outcome, source docs, public/private boundary, and active slice."
  },
  {
    label: "Design",
    owner: "Product MiniDora",
    state: "Working",
    tone: "info",
    detail: "Translate the product blueprint into an implementation-ready surface and interaction model."
  },
  {
    label: "Implement",
    owner: "Dev MiniDora",
    state: "Working",
    tone: "info",
    detail: "Ship a narrow, native UI slice with local state, route wiring, and no hidden write path."
  },
  {
    label: "Verify",
    owner: "Codex",
    state: "Required",
    tone: "warning",
    detail: "Run build, diff check, route protection, browser QA, responsive checks, and safety scans."
  },
  {
    label: "Review",
    owner: "Opus",
    state: "Required",
    tone: "warning",
    detail: "Claude Opus reviews product, safety, privacy, a11y, and regression risk before PR/deploy."
  }
] as const;

export const commandApprovals = [
  {
    title: "Proceed to next slice",
    state: "Owner review",
    tone: "warning",
    detail: "Advance only after local checks and Opus review are clean."
  },
  {
    title: "Expose a new private API",
    state: "Blocked",
    tone: "private",
    detail: "Needs auth, audit, error, permission, and rollback design before any write path exists."
  },
  {
    title: "Publish private knowledge",
    state: "Blocked",
    tone: "private",
    detail: "Requires explicit curation and public/private contract review."
  },
  {
    title: "Run autonomous workflow",
    state: "Unavailable",
    tone: "private",
    detail: "This surface can describe a workflow, but cannot dispatch tools or mutate systems."
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
