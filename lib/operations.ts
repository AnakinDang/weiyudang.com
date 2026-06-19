export type OperationsTone = "normal" | "info" | "warning" | "private" | "danger";

export type PrivateScheduleEvidence = {
  label: string;
  state: string;
  tone: OperationsTone;
  detail: string;
};

export type PrivateScheduleWindow = {
  label: string;
  time: string;
  detail: string;
};

export type PrivateSchedule = {
  id: string;
  lifecycle: "working" | "owner-review";
  name: string;
  cadence: string;
  nextWindow: string;
  owner: string;
  state: string;
  tone: OperationsTone;
  access: string;
  accessTone: OperationsTone;
  summary: string;
  safety: string;
  purpose: string;
  lastRun: string;
  nextAction: string;
  window: PrivateScheduleWindow;
  evidence: readonly PrivateScheduleEvidence[];
  dependencies: readonly string[];
  ownerGate: string;
  noGo: readonly string[];
};

export type ScheduleRhythmLane = {
  label: string;
  time: string;
  owner: string;
  state: string;
  tone: OperationsTone;
  detail: string;
};

export type ScheduleMetric = {
  label: string;
  value: string;
  detail: string;
};

export const privateSchedules = [
  {
    id: "daily-brief",
    lifecycle: "working",
    name: "Daily brief",
    cadence: "Morning",
    nextWindow: "Next morning",
    owner: "Doraemon",
    state: "Working",
    tone: "info",
    access: "owner-only",
    accessTone: "private",
    summary: "Prepare a concise daily operating brief for priorities, approvals, and watch items.",
    safety: "No command string or local path is rendered.",
    purpose: "Turn overnight context into a short owner-facing operating plan before the day starts.",
    lastRun: "Tracked off-page",
    nextAction: "Review priority stack, approvals, schedule pressure, and systems that need attention.",
    window: {
      label: "Morning review",
      time: "Next morning",
      detail: "Designed to be read before the first work block."
    },
    evidence: [
      {
        label: "Priority inputs",
        state: "Ready",
        tone: "normal",
        detail: "Uses curated priorities and review queue state, not raw private prompts."
      },
      {
        label: "Approvals",
        state: "Visible",
        tone: "warning",
        detail: "Items that need owner decisions stay in review state."
      },
      {
        label: "Delivery",
        state: "No-send",
        tone: "private",
        detail: "This page does not send messages or trigger delivery."
      }
    ],
    dependencies: ["Review Queue", "Schedules", "System Health"],
    ownerGate: "Owner reads and decides what moves into the day.",
    noGo: ["No auto-send", "No tool dispatch", "No hidden task promotion"]
  },
  {
    id: "market-scan",
    lifecycle: "working",
    name: "Market scan",
    cadence: "Market days",
    nextWindow: "Next market session",
    owner: "Trading MiniDora",
    state: "Working",
    tone: "info",
    access: "research-only",
    accessTone: "private",
    summary: "Collect market-research context and source-health notes without broker execution.",
    safety: "No account, position, order, or broker credential data is shown.",
    purpose: "Keep the trading research desk aware of market context while preserving the research-only boundary.",
    lastRun: "Tracked off-page",
    nextAction: "Collect signals, source health, disagreement notes, and evidence gaps for owner reading.",
    window: {
      label: "Market session",
      time: "Next market day",
      detail: "Runs as research preparation, not trading instruction."
    },
    evidence: [
      {
        label: "Research posture",
        state: "Held",
        tone: "normal",
        detail: "The schedule can prepare evidence, but cannot recommend or execute trades."
      },
      {
        label: "Source health",
        state: "Partial",
        tone: "warning",
        detail: "Market data health is summarized without showing accounts or broker details."
      },
      {
        label: "Execution",
        state: "Blocked",
        tone: "private",
        detail: "No broker, paper, live, or order path exists in the web cockpit."
      }
    ],
    dependencies: ["Trading Team", "Evidence gates", "Source health"],
    ownerGate: "Owner may read research; the page cannot act on it.",
    noGo: ["No order placement", "No position sizing", "No broker write"]
  },
  {
    id: "system-health",
    lifecycle: "working",
    name: "System health",
    cadence: "Daily",
    nextWindow: "Tonight",
    owner: "Dev MiniDora",
    state: "Working",
    tone: "info",
    access: "owner-only",
    accessTone: "private",
    summary: "Summarize service posture, event freshness, and queue health for owner review.",
    safety: "No internal hostnames, ports, filesystem paths, or tokens are rendered.",
    purpose: "Keep the Personal OS observable without turning the web page into a repair console.",
    lastRun: "Tracked off-page",
    nextAction: "Summarize public boundary, private auth posture, event freshness, and queue health.",
    window: {
      label: "Evening check",
      time: "Tonight",
      detail: "Designed to reveal attention areas before overnight work."
    },
    evidence: [
      {
        label: "Auth gate",
        state: "Required",
        tone: "private",
        detail: "Private routes must redirect before owner-only shell content renders."
      },
      {
        label: "Public boundary",
        state: "Required",
        tone: "warning",
        detail: "Public Doraemon status stays separate from private diagnostics."
      },
      {
        label: "Repair controls",
        state: "Unavailable",
        tone: "private",
        detail: "Restart, deploy, purge, and raw log actions are not rendered."
      }
    ],
    dependencies: ["System Health", "Doraemon public boundary", "Owner auth gate"],
    ownerGate: "Owner can inspect posture; repair design is a separate future slice.",
    noGo: ["No raw logs", "No restart control", "No deployment trigger"]
  },
  {
    id: "weekly-review",
    lifecycle: "owner-review",
    name: "Weekly review",
    cadence: "Weekly",
    nextWindow: "This week",
    owner: "Doraemon",
    state: "Owner review",
    tone: "warning",
    access: "owner-only",
    accessTone: "private",
    summary: "Create a review loop for what shipped, what was deferred, and what needs owner decisions.",
    safety: "No auto-promotion from review notes into execution.",
    purpose: "Turn shipped work, deferred work, and owner decisions into an explicit weekly review packet.",
    lastRun: "Pending owner review",
    nextAction: "Collect shipped slices, review findings, deferred decisions, and next-week candidate work.",
    window: {
      label: "Weekly close",
      time: "This week",
      detail: "Runs as a review packet, not an automatic planning mutation."
    },
    evidence: [
      {
        label: "Shipped work",
        state: "Collected",
        tone: "info",
        detail: "Summaries should link to reviewed PRs or deployment evidence."
      },
      {
        label: "Deferred work",
        state: "Visible",
        tone: "warning",
        detail: "Open decisions stay visible instead of silently becoming tasks."
      },
      {
        label: "Promotion",
        state: "Blocked",
        tone: "private",
        detail: "Review notes cannot become execution state from this page."
      }
    ],
    dependencies: ["Review Queue", "Agents", "Deploy evidence"],
    ownerGate: "Owner chooses what becomes next-week work.",
    noGo: ["No auto-plan", "No silent promotion", "No execution queue mutation"]
  }
] as const satisfies readonly PrivateSchedule[];

const activeScheduleCount = privateSchedules.filter((schedule) => schedule.lifecycle === "working").length;
const ownerReviewScheduleCount = privateSchedules.filter((schedule) => schedule.lifecycle === "owner-review").length;
const scheduleEvidenceCount = privateSchedules.reduce((total, schedule) => total + schedule.evidence.length, 0);

export const scheduleMetrics = [
  { label: "Recurring loops", value: privateSchedules.length.toString(), detail: "Owner-visible operating rhythms" },
  { label: "Working", value: activeScheduleCount.toString(), detail: "Schedules preparing context" },
  { label: "Owner review", value: ownerReviewScheduleCount.toString(), detail: "Needs explicit owner read" },
  { label: "Tracked rows", value: scheduleEvidenceCount.toString(), detail: "Proof, gaps, or blocked actions" }
] as const satisfies readonly ScheduleMetric[];

export const scheduleRhythmLanes = [
  {
    label: "Morning",
    time: "Before work starts",
    owner: "Doraemon",
    state: "Daily brief",
    tone: "info",
    detail: "Priorities, approvals, schedule pressure, and attention items become a short owner brief."
  },
  {
    label: "Market day",
    time: "During market sessions",
    owner: "Trading MiniDora",
    state: "Research-only",
    tone: "private",
    detail: "Market context is gathered for reading only; no order, recommendation, or execution path exists."
  },
  {
    label: "Evening",
    time: "Before overnight work",
    owner: "Dev MiniDora",
    state: "Health check",
    tone: "warning",
    detail: "System posture is summarized without exposing raw service internals or repair controls."
  },
  {
    label: "Weekly",
    time: "Planning close",
    owner: "Doraemon",
    state: "Owner review",
    tone: "warning",
    detail: "Shipped, deferred, and blocked work becomes a review packet before next-week planning."
  }
] as const satisfies readonly ScheduleRhythmLane[];

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
    label: "Doraemon public boundary",
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
  "Public Doraemon status and private Owner Cockpit status stay separated."
] as const;
