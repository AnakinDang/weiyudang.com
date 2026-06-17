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
  boundary:
    "This draft is visible for planning only. No command is sent to a runtime from this page."
} as const;

export const commandPlanStages = [
  { label: "Interpret", owner: "Doraemon", state: "Complete", tone: "normal" },
  { label: "Plan", owner: "Doraemon", state: "Working", tone: "info" },
  { label: "Implement", owner: "Dev MiniDora", state: "Working", tone: "info" },
  { label: "Review", owner: "Opus", state: "Required", tone: "warning" }
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
    detail: "Needs auth, audit, error, and rollback design before any write path exists."
  },
  {
    title: "Publish private knowledge",
    state: "Blocked",
    tone: "private",
    detail: "Requires explicit curation and public/private contract review."
  }
] as const;

export const commandAgents = [
  {
    name: "Doraemon",
    role: "Orchestrator",
    focus: "Keeps intent, plan, and review boundaries aligned."
  },
  {
    name: "Dev MiniDora",
    role: "Implementation",
    focus: "Ships small slices and verifies build/browser/auth behavior."
  },
  {
    name: "Research MiniDora",
    role: "Evidence",
    focus: "Connects decisions back to docs and source material."
  },
  {
    name: "Trading MiniDora",
    role: "Research-only",
    focus: "Maintains market research boundaries without execution."
  }
] as const;

export const commandOutputShelf = [
  { title: "Local build", state: "Required", detail: "Production build and static checks before review." },
  { title: "Browser QA", state: "Required", detail: "Desktop/mobile screenshots, console, overflow, and route checks." },
  { title: "Opus review", state: "Required", detail: "GO/NO-GO with P0/P1/P2 before the next slice." }
] as const;

export const commandAuditRules = [
  "No write or execution action appears until an authenticated API and audit trail are designed.",
  "Drafts, approvals, and execution are separate product states.",
  "Public pages never import this private command scaffold.",
  "Failed auth should not render command content."
] as const;
