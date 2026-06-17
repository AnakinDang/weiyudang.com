export const privateAgentRoster = [
  {
    name: "Doraemon",
    role: "Orchestrator",
    state: "Planning",
    tone: "info",
    lease: "Owner session planning",
    capabilities: ["Plan slicing", "handoff design", "review summaries"],
    lastOutput: "Kept the rollout moving slice by slice with Opus review after each step.",
    sourceHealth: "Good",
    sourceDetail: "Docs, local build output, browser checks, and review packets are available."
  },
  {
    name: "Dev MiniDora",
    role: "Implementation",
    state: "Working",
    tone: "info",
    lease: "Frontend slice work",
    capabilities: ["Next.js surfaces", "route wiring", "browser QA"],
    lastOutput: "Built native Doraemon Office, Owner Today, Trading Team, and Command surfaces.",
    sourceHealth: "Good",
    sourceDetail: "Code and verification artifacts are local to the protected worktree."
  },
  {
    name: "Research MiniDora",
    role: "Evidence",
    state: "Reviewing",
    tone: "warning",
    lease: "Spec alignment",
    capabilities: ["Design-doc traceability", "boundary review", "source synthesis"],
    lastOutput: "Mapped each private surface back to Personal OS docs before implementation.",
    sourceHealth: "Partial",
    sourceDetail: "Current docs are complete enough for scaffolds; live sources are not connected."
  },
  {
    name: "Trading MiniDora",
    role: "Trading Research",
    state: "Owner review",
    tone: "warning",
    lease: "Research-only console",
    capabilities: ["Evidence gates", "desk disagreement", "source degradation"],
    lastOutput: "Upgraded trading into a research cockpit with no execution affordance.",
    sourceHealth: "Degraded",
    sourceDetail: "Market data and broker connections are intentionally absent from this web surface."
  },
  {
    name: "Media MiniDora",
    role: "Creative Production",
    state: "Queued",
    tone: "private",
    lease: "Visual asset strategy",
    capabilities: ["Image workflows", "story assets", "public-safe presentation"],
    lastOutput: "Waiting for a future visual asset pass after the core cockpit surfaces stabilize.",
    sourceHealth: "Pending",
    sourceDetail: "No source asset library is exposed through the web app."
  }
] as const;

export const privateAgentHandoffs = [
  {
    time: "Step 3",
    from: "Dev MiniDora",
    to: "Opus",
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
    state: "Complete",
    tone: "normal",
    summary: "Trading Team passed as research-only with no execution controls."
  },
  {
    time: "Step 6",
    from: "Doraemon",
    to: "Opus",
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
] as const;

export const privateReviewQueue = [
  {
    title: "Confirm Step 7 private agents surface",
    owner: "Owner",
    agent: "Codex",
    decision: "Review needed",
    tone: "warning",
    urgency: "Now",
    evidence: ["Build output", "authenticated browser screenshots", "Opus review"],
    note: "No private API or execution action should appear in this slice."
  },
  {
    title: "Decide whether to land current worktree as one PR",
    owner: "Owner",
    agent: "Doraemon",
    decision: "Defer",
    tone: "private",
    urgency: "Next",
    evidence: ["Step review history", "dirty worktree summary"],
    note: "Large uncommitted package can be split after the core surfaces stabilize."
  },
  {
    title: "Review trading research boundary copy",
    owner: "Owner",
    agent: "Trading MiniDora",
    decision: "Approve copy or revise",
    tone: "warning",
    urgency: "Later",
    evidence: ["Research-only disclaimer", "blocked action list", "source degradation panel"],
    note: "The console remains research-only and has no order, paper, live, or broker path."
  },
  {
    title: "Prepare future private API audit design",
    owner: "Owner",
    agent: "Dev MiniDora",
    decision: "Blocked",
    tone: "private",
    urgency: "Future",
    evidence: ["Auth/session spec", "command audit rules"],
    note: "No write endpoint should be added until audit, rollback, and error handling are designed."
  }
] as const;

export const reviewQueuePolicy = [
  "Approvals, rejects, notes, and deferrals are represented as review states only.",
  "This page has no approve, reject, publish, execute, or dispatch button.",
  "Every decision item must show evidence or say what evidence is missing.",
  "No silent auto-promotion from review state to execution state."
] as const;
