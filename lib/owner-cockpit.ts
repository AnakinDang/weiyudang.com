export const ownerTodayPriorities = [
  {
    title: "Ship the native Personal OS shell",
    owner: "Doraemon",
    state: "Owner review",
    tone: "warning",
    summary: "Close the public Office screen, then move into the private cockpit and trading research surfaces."
  },
  {
    title: "Keep public Doraemon routes sanitized",
    owner: "Dev MiniDora",
    state: "Working",
    tone: "info",
    summary: "Preserve fixed public titles, safe state labels, and the no-execution public contract."
  },
  {
    title: "Prepare trading research evidence lanes",
    owner: "Trading MiniDora",
    state: "Research-only",
    tone: "private",
    summary: "Make source quality, gate status, and owner review visible without broker actions."
  }
] as const;

export const ownerReviewQueue = [
  {
    title: "Review Step 3 Doraemon Office fix packet",
    agent: "Codex + Opus",
    urgency: "Now",
    state: "Ready",
    tone: "normal"
  },
  {
    title: "Approve next private cockpit slice",
    agent: "Doraemon",
    urgency: "Next",
    state: "Waiting",
    tone: "warning"
  },
  {
    title: "Decide public trading story boundary",
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
  { label: "Public Doraemon boundary", value: "Sanitized", tone: "normal" },
  { label: "Trading execution", value: "Disabled", tone: "private" },
  { label: "Runtime source", value: "Mock scaffold", tone: "warning" }
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
