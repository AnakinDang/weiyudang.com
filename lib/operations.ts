export const privateSchedules = [
  {
    name: "Daily brief",
    cadence: "Morning",
    nextWindow: "Next morning",
    owner: "Doraemon",
    state: "Working",
    tone: "info",
    access: "owner-only",
    accessTone: "private",
    summary: "Prepare a concise daily operating brief for priorities, approvals, and watch items.",
    safety: "No command string or local path is rendered."
  },
  {
    name: "Market scan",
    cadence: "Market days",
    nextWindow: "Next market session",
    owner: "Trading MiniDora",
    state: "Working",
    tone: "info",
    access: "research-only",
    accessTone: "private",
    summary: "Collect market-research context and source-health notes without broker execution.",
    safety: "No account, position, order, or broker credential data is shown."
  },
  {
    name: "System health",
    cadence: "Daily",
    nextWindow: "Tonight",
    owner: "Dev MiniDora",
    state: "Working",
    tone: "info",
    access: "owner-only",
    accessTone: "private",
    summary: "Summarize service posture, event freshness, and queue health for owner review.",
    safety: "No internal hostnames, ports, filesystem paths, or tokens are rendered."
  },
  {
    name: "Weekly review",
    cadence: "Weekly",
    nextWindow: "This week",
    owner: "Doraemon",
    state: "Owner review",
    tone: "warning",
    access: "owner-only",
    accessTone: "private",
    summary: "Create a review loop for what shipped, what was deferred, and what needs owner decisions.",
    safety: "No auto-promotion from review notes into execution."
  }
] as const;

export const scheduleControlPolicy = [
  "The web page is a schedule register, not a scheduler.",
  "Cron command strings, shell paths, and private prompts stay outside the web bundle.",
  "Research schedules can prepare evidence only; they cannot submit orders or mutate accounts.",
  "Owner review remains the boundary before future schedule mutation exists."
] as const;

export const privateSystemServices = [
  {
    label: "Owner auth gate",
    state: "Enabled",
    tone: "normal",
    detail: "Private routes redirect before owner-only UI renders."
  },
  {
    label: "Dora public boundary",
    state: "Sanitized",
    tone: "normal",
    detail: "Public surfaces use safe labels, public schemas, and no owner controls."
  },
  {
    label: "Command runtime",
    state: "Not connected",
    tone: "private",
    detail: "The command surface is draft-only until a separate audited API exists."
  },
  {
    label: "Trading execution",
    state: "Disabled",
    tone: "private",
    detail: "Trading Team remains research-only with no broker write or order path."
  }
] as const;

export const privateSystemSignals = [
  { label: "Event lag", value: "Mock scaffold", tone: "warning", detail: "Live private event source is not connected yet." },
  { label: "Queue health", value: "Review gated", tone: "info", detail: "Items remain in review state until owner action is designed." },
  { label: "Recent failures", value: "None surfaced", tone: "normal", detail: "No private failure feed is currently attached." }
] as const;

export const privateSystemDiagnostics = [
  "Diagnostics are summary-level only.",
  "No service path, port, credential, local hostname, or raw log line is rendered.",
  "Bundle boundary checks are a release gate for credential values, paths, token strings, and raw logs.",
  "Repair, restart, deploy, and rollback workflows need separate authenticated APIs.",
  "Public Dora status and private Owner Cockpit status stay separated."
] as const;
