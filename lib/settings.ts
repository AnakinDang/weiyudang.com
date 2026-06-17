export const ownerProfileSettings = [
  { label: "Owner identity", value: "Weiyu", status: "Owner", tone: "normal" },
  { label: "Workspace mode", value: "Personal OS", status: "Private", tone: "private" },
  { label: "Public posture", value: "Curated only", status: "Public-safe", tone: "normal" }
] as const;

export const ownerAccessStatuses = [
  {
    label: "Owner session",
    state: "Active",
    tone: "normal",
    detail: "Private routes require an owner session before content renders."
  },
  {
    label: "Access token",
    state: "Stored outside UI",
    tone: "private",
    detail: "Token material is never displayed, copied, or echoed in this dashboard."
  },
  {
    label: "Trading access",
    state: "Research-only",
    tone: "private",
    detail: "The web app does not provide broker write access or order execution."
  },
  {
    label: "External accounts",
    state: "Hidden",
    tone: "private",
    detail: "Mail, calendar, and file integrations are represented only as safe status categories."
  }
] as const;

export const ownerDisplayModes = [
  { label: "Owner Cockpit", value: "Dense dashboard", tone: "info" },
  { label: "Doraemon Office", value: "Warm command room", tone: "info" },
  { label: "Public site", value: "Research studio", tone: "normal" }
] as const;

export const ownerNotificationPreferences = [
  {
    label: "Daily brief",
    state: "Planned",
    tone: "info",
    detail: "Future preference controls should only expose cadence labels, never scheduler internals."
  },
  {
    label: "Owner review",
    state: "Important",
    tone: "warning",
    detail: "Review prompts should stay explicit and auditable before any action moves forward."
  },
  {
    label: "System health",
    state: "Watch",
    tone: "info",
    detail: "Health notifications should summarize posture without raw logs or service internals."
  }
] as const;

export const ownerSettingsPolicy = [
  "No raw credential values are displayed in settings.",
  "Provider access, broker access, mail, calendar, and file integrations are status-only until audited controls exist.",
  "Future settings mutations need owner authentication, explicit confirmation, audit logging, and rollback behavior.",
  "Public display choices and private runtime access stay separated."
] as const;
