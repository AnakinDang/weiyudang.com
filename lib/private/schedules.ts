import "server-only";

export type ScheduleTone = "normal" | "info" | "warning" | "private" | "danger";

export type PrivateScheduleEvidence = {
  label: string;
  state: string;
  tone: ScheduleTone;
  ready: boolean;
  detail: string;
};

export type PrivateScheduleWindow = {
  label: string;
  time: string;
  detail: string;
};

export type PrivateScheduleStep = {
  label: string;
  state: string;
  tone: ScheduleTone;
  detail: string;
};

export type PrivateScheduleOwnerPosture = {
  label: string;
  state: string;
  tone: ScheduleTone;
  detail: string;
  next: string;
};

export type PrivateSchedule = {
  id: string;
  lifecycle: "working" | "owner-review";
  name: string;
  cadence: string;
  nextWindow: string;
  owner: string;
  state: string;
  tone: ScheduleTone;
  access: string;
  accessTone: ScheduleTone;
  summary: string;
  safety: string;
  purpose: string;
  lastRun: string;
  nextAction: string;
  window: PrivateScheduleWindow;
  evidence: readonly PrivateScheduleEvidence[];
  readingSteps: readonly PrivateScheduleStep[];
  safeOutputs: readonly PrivateScheduleStep[];
  ownerPostures: readonly PrivateScheduleOwnerPosture[];
  dependencies: readonly string[];
  ownerGate: string;
  noGo: readonly string[];
};

export type ScheduleRhythmLane = {
  label: string;
  time: string;
  owner: string;
  state: string;
  tone: ScheduleTone;
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
        ready: true,
        detail: "Uses curated priorities and review queue state, not raw private prompts."
      },
      {
        label: "Approvals",
        state: "Visible",
        tone: "warning",
        ready: true,
        detail: "Items that need owner decisions stay in review state."
      },
      {
        label: "Delivery",
        state: "No-send",
        tone: "private",
        ready: false,
        detail: "This page does not send messages or trigger delivery."
      }
    ],
    readingSteps: [
      {
        label: "Scan priorities",
        state: "Readable",
        tone: "normal",
        detail: "Start with priorities, review queue pressure, and schedule constraints."
      },
      {
        label: "Check owner gates",
        state: "Required",
        tone: "warning",
        detail: "Identify decisions that need explicit owner action before the day moves."
      },
      {
        label: "Hold delivery",
        state: "Blocked",
        tone: "private",
        detail: "No message is sent and no reminder is triggered from this page."
      }
    ],
    safeOutputs: [
      {
        label: "Operating brief",
        state: "Allowed",
        tone: "normal",
        detail: "A short owner-readable plan with priorities, watch items, and review queue links."
      },
      {
        label: "Review packet",
        state: "Allowed",
        tone: "info",
        detail: "Decision items can be summarized for Review Queue without becoming execution state."
      },
      {
        label: "Runtime action",
        state: "Unavailable",
        tone: "private",
        detail: "Tool dispatch, delivery, or schedule mutation remains outside this surface."
      }
    ],
    ownerPostures: [
      {
        label: "Read now",
        state: "Owner read",
        tone: "normal",
        detail: "Treat this loop as the next item to inspect in the cockpit.",
        next: "Read the brief, then move any decision into Review Queue or Command."
      },
      {
        label: "Defer window",
        state: "Safe hold",
        tone: "info",
        detail: "Leave the loop visible but do not promote it into today's work.",
        next: "Keep the schedule unchanged and revisit at the next owner review window."
      },
      {
        label: "Need more evidence",
        state: "Needs proof",
        tone: "warning",
        detail: "Ask for more proof before trusting this recurring loop.",
        next: "Open System Health or Review Queue; do not send or mutate the schedule."
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
        ready: true,
        detail: "The schedule can prepare evidence, but cannot recommend or execute trades."
      },
      {
        label: "Source health",
        state: "Partial",
        tone: "warning",
        ready: false,
        detail: "Market data health is summarized without showing accounts or broker details."
      },
      {
        label: "Execution",
        state: "Blocked",
        tone: "private",
        ready: false,
        detail: "No broker, paper, live, or order path exists in the web cockpit."
      }
    ],
    readingSteps: [
      {
        label: "Read context",
        state: "Research-only",
        tone: "normal",
        detail: "Scan market context as evidence, not as advice or instruction."
      },
      {
        label: "Check source health",
        state: "Partial",
        tone: "warning",
        detail: "Treat degraded sources as a blocker, not something to smooth over."
      },
      {
        label: "Hold execution",
        state: "Blocked",
        tone: "private",
        detail: "No broker write, paper trade, live order, or recommendation can emerge here."
      }
    ],
    safeOutputs: [
      {
        label: "Research note",
        state: "Allowed",
        tone: "normal",
        detail: "A private evidence note for owner reading, clearly marked research-only."
      },
      {
        label: "Evidence gap",
        state: "Allowed",
        tone: "warning",
        detail: "A visible missing-source or disagreement row for future review."
      },
      {
        label: "Trade instruction",
        state: "Unavailable",
        tone: "private",
        detail: "No order, recommendation, position sizing, or account action is rendered."
      }
    ],
    ownerPostures: [
      {
        label: "Read research",
        state: "Owner read",
        tone: "normal",
        detail: "Use the schedule as a private research context scan.",
        next: "Open Trading Team for evidence and gates; do not treat this as a trade action."
      },
      {
        label: "Hold for sources",
        state: "Needs proof",
        tone: "warning",
        detail: "Pause interpretation when source health is incomplete.",
        next: "Keep the loop visible and require source evidence before summary."
      },
      {
        label: "Defer trading",
        state: "No action",
        tone: "private",
        detail: "Leave research untouched for this window.",
        next: "No schedule mutation, order path, or recommendation is created."
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
    safety: "No internal hostnames, ports, filesystem paths, or credential material is rendered.",
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
        ready: true,
        detail: "Private routes must redirect before owner-only shell content renders."
      },
      {
        label: "Public boundary",
        state: "Required",
        tone: "warning",
        ready: true,
        detail: "Public Doraemon status stays separate from private diagnostics."
      },
      {
        label: "Repair controls",
        state: "Unavailable",
        tone: "private",
        ready: false,
        detail: "Restart, deploy, purge, and raw log actions are not rendered."
      }
    ],
    readingSteps: [
      {
        label: "Check boundary",
        state: "Required",
        tone: "warning",
        detail: "Confirm public and private health views stay separate."
      },
      {
        label: "Read posture",
        state: "Readable",
        tone: "normal",
        detail: "Summarize route gates, event freshness, and attention areas."
      },
      {
        label: "Hold repair",
        state: "Unavailable",
        tone: "private",
        detail: "No restart, deploy, log, or purge affordance belongs in this surface."
      }
    ],
    safeOutputs: [
      {
        label: "Health note",
        state: "Allowed",
        tone: "normal",
        detail: "A private summary of posture and attention areas."
      },
      {
        label: "Review item",
        state: "Allowed",
        tone: "info",
        detail: "A future Review Queue packet can be created after separate implementation."
      },
      {
        label: "Repair command",
        state: "Unavailable",
        tone: "private",
        detail: "No operational command or raw service detail is exposed here."
      }
    ],
    ownerPostures: [
      {
        label: "Read health",
        state: "Owner read",
        tone: "normal",
        detail: "Use this window to inspect safe service posture.",
        next: "Open System Health for details; keep repair work outside the schedule surface."
      },
      {
        label: "Escalate review",
        state: "Review needed",
        tone: "warning",
        detail: "Treat an attention area as a future Review Queue item.",
        next: "Draft a reviewed packet; do not add repair controls to schedules."
      },
      {
        label: "Hold repairs",
        state: "Blocked",
        tone: "private",
        detail: "Keep operations read-only until audit and rollback design exists.",
        next: "No restart, deploy, purge, or raw log action is created."
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
        ready: true,
        detail: "Summaries should link to reviewed PRs or deployment evidence."
      },
      {
        label: "Deferred work",
        state: "Visible",
        tone: "warning",
        ready: true,
        detail: "Open decisions stay visible instead of silently becoming tasks."
      },
      {
        label: "Promotion",
        state: "Blocked",
        tone: "private",
        ready: false,
        detail: "Review notes cannot become execution state from this page."
      }
    ],
    readingSteps: [
      {
        label: "Collect shipped work",
        state: "Collected",
        tone: "info",
        detail: "Review shipped PRs, deployments, and verification evidence."
      },
      {
        label: "Name deferrals",
        state: "Visible",
        tone: "warning",
        detail: "Keep postponed work explicit instead of letting it vanish."
      },
      {
        label: "Hold promotion",
        state: "Blocked",
        tone: "private",
        detail: "Review notes cannot become next-week execution without owner approval."
      }
    ],
    safeOutputs: [
      {
        label: "Weekly packet",
        state: "Allowed",
        tone: "normal",
        detail: "A private review packet of shipped, deferred, blocked, and candidate work."
      },
      {
        label: "Next-slice shortlist",
        state: "Owner-gated",
        tone: "warning",
        detail: "Candidate work stays reviewable until the owner chooses the next slice."
      },
      {
        label: "Auto-plan",
        state: "Unavailable",
        tone: "private",
        detail: "No automatic planning mutation or task promotion is rendered."
      }
    ],
    ownerPostures: [
      {
        label: "Review now",
        state: "Owner review",
        tone: "warning",
        detail: "Use this loop to choose what should shape the next week.",
        next: "Move chosen items into Command or Review Queue after owner decision."
      },
      {
        label: "Defer close",
        state: "Safe hold",
        tone: "info",
        detail: "Keep the weekly packet open until evidence is complete.",
        next: "Do not auto-promote postponed work."
      },
      {
        label: "Need proof",
        state: "Needs evidence",
        tone: "warning",
        detail: "Ask for PR, deployment, or review evidence before closing the week.",
        next: "Attach evidence first; leave execution unavailable."
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
  "Scheduler command strings, shell paths, and private prompts stay outside the web bundle.",
  "Research schedules can prepare evidence only; they cannot submit orders or mutate accounts.",
  "Owner review remains the boundary before future schedule mutation exists."
] as const;
