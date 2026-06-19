import "server-only";

// Owner-only settings data. Do not import this module from public routes or public components.

export type SettingsTone = "normal" | "info" | "warning" | "private" | "danger";
export type SettingsLifecycle = "held" | "status-only" | "planned" | "blocked";

export type OwnerSettingMetric = {
  label: string;
  value: string;
  detail: string;
};

export type OwnerSettingLane = {
  label: string;
  owner: string;
  state: string;
  tone: SettingsTone;
  detail: string;
};

export type OwnerProfileSetting = {
  id: string;
  label: string;
  value: string;
  status: string;
  tone: SettingsTone;
  detail: string;
};

export type OwnerSettingsPacket = {
  id: string;
  lifecycle: SettingsLifecycle;
  title: string;
  domain: string;
  state: string;
  tone: SettingsTone;
  summary: string;
  visibleValue: string;
  ownerGate: string;
  evidence: readonly {
    label: string;
    state: string;
    tone: SettingsTone;
    detail: string;
  }[];
  risks: readonly string[];
  noGo: readonly string[];
};

export type OwnerNotificationPreference = {
  id: string;
  label: string;
  state: string;
  tone: SettingsTone;
  cadence: string;
  detail: string;
  boundary: string;
};

export const ownerProfileSettings = [
  {
    id: "owner-identity",
    label: "Owner identity",
    value: "Weiyu",
    status: "Owner",
    tone: "normal",
    detail: "Public identity can be named; private credentials and contact channels stay outside the UI."
  },
  {
    id: "workspace-mode",
    label: "Workspace mode",
    value: "Personal OS",
    status: "Private",
    tone: "private",
    detail: "Owner Cockpit preferences are private by default and only summarize safe state."
  },
  {
    id: "public-posture",
    label: "Public posture",
    value: "Curated only",
    status: "Public-safe",
    tone: "normal",
    detail: "Public site copy and private runtime access stay separated."
  }
] as const satisfies readonly OwnerProfileSetting[];

export const ownerSettingsPackets = [
  {
    id: "owner-session",
    lifecycle: "held",
    title: "Owner session",
    domain: "Auth status",
    state: "Active",
    tone: "normal",
    summary: "Private routes require a signed owner session before the cockpit shell renders.",
    visibleValue: "Authenticated owner session",
    ownerGate: "Token material stays server-side and is exchanged for a scoped session cookie.",
    evidence: [
      {
        label: "Route guard",
        state: "Held",
        tone: "normal",
        detail: "Unauthenticated /app routes redirect before private content renders."
      },
      {
        label: "Cookie",
        state: "HttpOnly",
        tone: "private",
        detail: "Session material is not readable by browser JavaScript."
      },
      {
        label: "Expiry",
        state: "Finite",
        tone: "info",
        detail: "The session model requires expiration and logout behavior."
      }
    ],
    risks: ["Future auth upgrades must preserve server-side verification.", "Owner gate copy must never hint at token values."],
    noGo: ["No token display", "No localStorage session", "No private shell before auth"]
  },
  {
    id: "access-token",
    lifecycle: "blocked",
    title: "Access credential",
    domain: "Credential boundary",
    state: "Hidden",
    tone: "private",
    summary: "Credential material is represented only as posture, never as a visible field.",
    visibleValue: "Stored outside UI",
    ownerGate: "Any credential rotation flow needs a separate audited design before controls exist.",
    evidence: [
      {
        label: "Raw value",
        state: "Absent",
        tone: "private",
        detail: "Settings cannot display, copy, echo, or partially reveal credential material."
      },
      {
        label: "Rotation",
        state: "Unavailable",
        tone: "private",
        detail: "No rotate, reset, copy, or reveal action exists in the cockpit."
      },
      {
        label: "Environment",
        state: "Server-only",
        tone: "warning",
        detail: "Environment names and raw values stay outside browser output."
      }
    ],
    risks: ["A future settings form could accidentally echo submitted credential text."],
    noGo: ["No reveal credential", "No copy credential", "No reset credential"]
  },
  {
    id: "display-mode",
    lifecycle: "status-only",
    title: "Display modes",
    domain: "Presentation",
    state: "Preview",
    tone: "info",
    summary: "Display preferences explain the current visual posture for private and public surfaces.",
    visibleValue: "Dense cockpit / warm office / research studio",
    ownerGate: "Future display changes should be stored as preferences only after settings mutation is designed.",
    evidence: [
      {
        label: "Owner Cockpit",
        state: "Dense",
        tone: "info",
        detail: "Private work surfaces prioritize scannable compact information."
      },
      {
        label: "Doraemon Office",
        state: "Warm",
        tone: "info",
        detail: "Public command room surfaces stay friendly and safe."
      },
      {
        label: "Public site",
        state: "Studio",
        tone: "normal",
        detail: "Public content uses curated research studio framing."
      }
    ],
    risks: ["Visual preferences can drift if public/private modes are edited separately."],
    noGo: ["No public/private merge", "No raw runtime theme switch", "No unaudited preference write"]
  },
  {
    id: "notification-preferences",
    lifecycle: "planned",
    title: "Notification preferences",
    domain: "Owner attention",
    state: "Planned",
    tone: "warning",
    summary: "Notification preferences are shown as intent, not as a delivery control surface.",
    visibleValue: "Daily brief / review / health watch",
    ownerGate: "Delivery channels and schedules need explicit consent, audit, and rollback before mutation.",
    evidence: [
      {
        label: "Daily brief",
        state: "Planned",
        tone: "info",
        detail: "Cadence can be described without exposing scheduler internals."
      },
      {
        label: "Owner review",
        state: "Important",
        tone: "warning",
        detail: "Review prompts must stay explicit before action moves forward."
      },
      {
        label: "System health",
        state: "Watch",
        tone: "info",
        detail: "Health alerts summarize posture, not raw logs."
      }
    ],
    risks: ["Delivery preferences can become send controls if mutation is added too early."],
    noGo: ["No send now", "No channel token display", "No scheduler mutation"]
  }
] as const satisfies readonly OwnerSettingsPacket[];

export const ownerNotificationPreferences = [
  {
    id: "daily-brief",
    label: "Daily brief",
    state: "Planned",
    tone: "info",
    cadence: "Morning",
    detail: "Future preference controls should expose cadence labels only.",
    boundary: "No scheduler command strings or prompt bodies."
  },
  {
    id: "owner-review",
    label: "Owner review",
    state: "Important",
    tone: "warning",
    cadence: "As needed",
    detail: "Review prompts should stay explicit and auditable before any action moves forward.",
    boundary: "No silent auto-promotion."
  },
  {
    id: "system-health",
    label: "System health",
    state: "Watch",
    tone: "info",
    cadence: "Daily",
    detail: "Health notifications should summarize posture without raw logs or service internals.",
    boundary: "No repair control from notification settings."
  }
] as const satisfies readonly OwnerNotificationPreference[];

const heldSettingsCount = ownerSettingsPackets.filter((packet) => packet.lifecycle === "held").length;
const statusOnlySettingsCount = ownerSettingsPackets.filter((packet) => packet.lifecycle === "status-only").length;
const plannedSettingsCount = ownerSettingsPackets.filter((packet) => packet.lifecycle === "planned").length;
const blockedSettingsCount = ownerSettingsPackets.filter((packet) => packet.lifecycle === "blocked").length;

export const ownerSettingsMetrics = [
  { label: "Held", value: heldSettingsCount.toString(), detail: "Boundaries currently active" },
  { label: "Status-only", value: statusOnlySettingsCount.toString(), detail: "Preference previews only" },
  { label: "Planned", value: plannedSettingsCount.toString(), detail: "Needs mutation design" },
  { label: "Blocked", value: blockedSettingsCount.toString(), detail: "No control path allowed" }
] as const satisfies readonly OwnerSettingMetric[];

export const ownerSettingsLanes = [
  {
    label: "Identity",
    owner: "Weiyu",
    state: "Curated",
    tone: "normal",
    detail: "Profile state can identify the owner and public posture without exposing private channels."
  },
  {
    label: "Access",
    owner: "Owner session",
    state: "Server-gated",
    tone: "private",
    detail: "Auth status can be summarized; credential material stays server-side."
  },
  {
    label: "Display",
    owner: "Doraemon",
    state: "Preview",
    tone: "info",
    detail: "Visual posture is shown as current preference, not edited from this page."
  },
  {
    label: "Notifications",
    owner: "Owner",
    state: "Planned",
    tone: "warning",
    detail: "Attention preferences are documented, but delivery controls are unavailable."
  }
] as const satisfies readonly OwnerSettingLane[];

export const ownerSettingsPolicy = [
  "No raw credential values are displayed in settings.",
  "Provider access, broker access, mail, calendar, and file integrations are status-only until audited controls exist.",
  "Future settings mutations need owner authentication, explicit confirmation, audit logging, and rollback behavior.",
  "Public display choices and private runtime access stay separated.",
  "Notification settings can describe cadence, but cannot send, schedule, or mutate delivery channels."
] as const;
