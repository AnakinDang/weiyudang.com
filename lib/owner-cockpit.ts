export const ownerTodayPriorities = [
  {
    title: "Turn Today into the owner command surface",
    owner: "Doraemon",
    state: "Active slice",
    tone: "warning",
    summary: "Keep the private home focused on priorities, approvals, research posture, schedule pressure, and system health."
  },
  {
    title: "Keep the public Doraemon window verifiable",
    owner: "Dev MiniDora",
    state: "Live probe",
    tone: "info",
    summary: "Use the public-safe system page as the owner-visible bridge to relay health without exposing internals."
  },
  {
    title: "Prepare trading research evidence lanes",
    owner: "Trading MiniDora",
    state: "Research-only",
    tone: "private",
    summary: "Make source quality, gate status, and owner review visible without broker actions."
  }
] as const;

export const ownerOperatingMap = [
  {
    title: "Public Doraemon Office",
    href: "/dora/system",
    state: "Public-safe live probe",
    tone: "normal",
    current: false,
    summary: "Sanitized Office pages show public relay posture, agent presence, tasks, schedules, knowledge, and system health.",
    evidence: "No private task titles, raw IDs, prompts, credentials, or repair controls."
  },
  {
    title: "Owner Cockpit",
    href: "/app",
    state: "Authenticated read-only",
    tone: "private",
    current: true,
    summary: "The private shell organizes Today, Command, Agents, Review Queue, Schedules, Settings, and System Health.",
    evidence: "Owner session required before private app chrome or data renders."
  },
  {
    title: "Trading Research",
    href: "/app/trading",
    state: "Research-only",
    tone: "warning",
    current: false,
    summary: "MiniDora Trading collects signals, desks, gates, evidence, replay, and source degradation for owner review.",
    evidence: "Research-only. Not an order, recommendation, or execution system."
  },
  {
    title: "Review Queue",
    href: "/app/events",
    state: "Owner-gated",
    tone: "info",
    current: false,
    summary: "Decisions stay visible as checkpoints, not hidden execution paths or one-click approvals.",
    evidence: "Future mutations require authentication, audit logging, explicit owner action, and rollback behavior."
  }
] as const;

export const ownerReviewQueue = [
  {
    title: "Review Owner Cockpit Today operating map",
    agent: "Codex + Opus",
    urgency: "Now",
    state: "In review",
    tone: "warning"
  },
  {
    title: "Decide next private cockpit slice",
    agent: "Doraemon",
    urgency: "Next",
    state: "Waiting",
    tone: "warning"
  },
  {
    title: "Define Trading Team evidence bridge",
    agent: "Trading MiniDora",
    urgency: "Later",
    state: "Draft",
    tone: "info"
  }
] as const;

export const ownerMarketAlerts = [
  {
    label: "Research mode",
    value: "Read-only",
    detail: "No orders, recommendations, broker writes, or execution controls."
  },
  {
    label: "Signal quality",
    value: "Evidence pending",
    detail: "Today surface should show source coverage before any candidate is promoted."
  },
  {
    label: "Gate posture",
    value: "Owner-gated",
    detail: "Private console can prepare evidence, but owner review remains the decision point."
  }
] as const;

export const ownerSchedulePressure = [
  { label: "Daily brief", time: "Morning", state: "Ready" },
  { label: "Market scan", time: "Market session", state: "Research-only" },
  { label: "System health", time: "Tonight", state: "Watching" },
  { label: "Weekly review", time: "This week", state: "Queued" }
] as const;

export const ownerSystemHealth = [
  { label: "Private auth gate", value: "Enabled", tone: "normal" },
  { label: "Public relay probe", value: "Live-safe", tone: "normal" },
  { label: "Public Doraemon boundary", value: "Sanitized", tone: "normal" },
  { label: "Data source", value: "Seeded scaffold", tone: "warning" },
  { label: "Trading execution", value: "Disabled", tone: "private" },
  { label: "Private writes", value: "Unavailable", tone: "private" }
] as const;

export const ownerCommandShortcuts = [
  {
    title: "Command",
    href: "/app/command",
    summary: "Draft plans, review owner checkpoints, and inspect current mission shape."
  },
  {
    title: "Trading Team",
    href: "/app/trading",
    summary: "Open the research-only console with gates, evidence, and source degradation."
  },
  {
    title: "Knowledge Vault",
    href: "/app/knowledge",
    summary: "Review private synthesis layers before anything is curated for public publishing."
  }
] as const;
