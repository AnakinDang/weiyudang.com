import "server-only";

// Owner-only review queue data. Do not import this module from public routes or shared client components.

export type ReviewQueueTone = "normal" | "info" | "warning" | "private";

export type PrivateReviewQueueEvidence = {
  label: string;
  state: string;
  tone: ReviewQueueTone;
  ready: boolean;
  detail: string;
};

export type PrivateReviewQueueCheckpoint = {
  label: string;
  state: string;
  tone: ReviewQueueTone;
};

export type PrivateReviewQueueDecisionOption = {
  label: string;
  state: string;
  tone: ReviewQueueTone;
  detail: string;
  next: string;
};

export type PrivateReviewQueueGate = {
  label: string;
  state: string;
  tone: ReviewQueueTone;
  detail: string;
};

export type PrivateReviewQueueItem = {
  id: string;
  title: string;
  owner: string;
  agent: string;
  lane: string;
  surface: string;
  decision: string;
  tone: ReviewQueueTone;
  urgency: string;
  requestedDecision: string;
  recommendedHandling: string;
  evidence: readonly string[];
  evidenceCards: readonly PrivateReviewQueueEvidence[];
  checkpoints: readonly PrivateReviewQueueCheckpoint[];
  decisionOptions: readonly PrivateReviewQueueDecisionOption[];
  reviewGates: readonly PrivateReviewQueueGate[];
  blockers: readonly string[];
  allowedNext: string;
  disallowedActions: readonly string[];
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  updated: string;
  note: string;
};

export type PrivateReviewQueueMetric = {
  label: string;
  value: string;
  detail: string;
};

export type PrivateReviewQueueLane = {
  label: string;
  owner: string;
  count: string;
  state: string;
  tone: ReviewQueueTone;
  detail: string;
};

export const privateReviewQueue = [
  {
    id: "review-private-events-surface",
    title: "Confirm Review Queue cockpit surface",
    owner: "Owner",
    agent: "Codex",
    lane: "Ship gate",
    surface: "/app/review",
    decision: "Review needed",
    tone: "warning",
    urgency: "Now",
    requestedDecision: "Decide whether this review surface is clear enough to enter PR after Opus review.",
    recommendedHandling: "Check local evidence, read the Opus finding list, then allow merge only if P1/P2 are closed.",
    evidence: ["Build output", "authenticated browser screenshots", "Opus review"],
    evidenceCards: [
      {
        label: "Build",
        state: "Required",
        tone: "warning",
        ready: false,
        detail: "Production build and TypeScript must pass after the final diff."
      },
      {
        label: "Auth",
        state: "Required",
        tone: "warning",
        ready: false,
        detail: "Unauthenticated /app/review must redirect before private shell content renders."
      },
      {
        label: "Review",
        state: "Required",
        tone: "warning",
        ready: false,
        detail: "Claude Opus must return no open P1/P2 before PR/deploy."
      }
    ],
    checkpoints: [
      { label: "No approve button", state: "Held", tone: "private" },
      { label: "Evidence visible", state: "Required", tone: "warning" },
      { label: "Owner decides", state: "Required", tone: "warning" }
    ],
    decisionOptions: [
      {
        label: "Send to Opus review",
        state: "After local proof",
        tone: "warning",
        detail: "Use only after build, auth, browser, and boundary evidence are attached.",
        next: "Prepare the Claude Opus review packet. PR waits for a clean P1/P2 result."
      },
      {
        label: "Request more evidence",
        state: "Safe hold",
        tone: "info",
        detail: "Keep the packet open and ask for missing screenshots, route smoke, or leak probes.",
        next: "Do not open the PR. Attach the missing proof to this review item first."
      },
      {
        label: "Defer this slice",
        state: "No ship",
        tone: "private",
        detail: "Keep the route private and leave implementation paused until scope changes.",
        next: "Return to Command with a revised mission packet instead of promoting this work."
      }
    ],
    reviewGates: [
      {
        label: "Local build",
        state: "Required",
        tone: "warning",
        detail: "Production build and TypeScript must pass after the final diff."
      },
      {
        label: "Private route gate",
        state: "Required",
        tone: "warning",
        detail: "Unauthenticated /app/review must redirect before private shell content renders."
      },
      {
        label: "Browser QA",
        state: "Required",
        tone: "warning",
        detail: "Desktop and narrow viewports must show the decision loop without overflow."
      },
      {
        label: "Opus review",
        state: "Required",
        tone: "warning",
        detail: "Claude Opus must return no open P1/P2 before PR, merge, or deploy."
      }
    ],
    blockers: ["No live private review API exists in this slice.", "The page must remain a decision register, not a workflow runner."],
    allowedNext: "Prepare PR only after local verification and Opus review are clean.",
    disallowedActions: ["Approve and execute", "Reject and run", "Publish", "Dispatch tools"],
    primaryHref: "/app/review",
    primaryLabel: "Stay in review queue",
    secondaryHref: "/app/command",
    secondaryLabel: "Open command context",
    updated: "This session",
    note: "No private API or execution action should appear in this slice."
  },
  {
    id: "review-agent-history-depth",
    title: "Decide agent history depth",
    owner: "Owner",
    agent: "Doraemon",
    lane: "Product depth",
    surface: "/app/agents",
    decision: "Context ready",
    tone: "info",
    urgency: "Next",
    requestedDecision: "Decide whether the curated Events context is enough before designing a live private timeline source.",
    recommendedHandling: "Use /app/events for owner-readable history, handoffs, and review signals; keep live event ingestion as a separate future design.",
    evidence: ["Step review history", "current slice summary", "Owner Events context"],
    evidenceCards: [
      {
        label: "Roster",
        state: "Complete",
        tone: "normal",
        ready: true,
        detail: "The current Agents surface shows leases, source health, handoffs, and boundary."
      },
      {
        label: "Events context",
        state: "Ready",
        tone: "info",
        ready: true,
        detail: "The owner-only Events page now reconstructs a curated timeline from cockpit packets."
      },
      {
        label: "Live source",
        state: "Future",
        tone: "private",
        ready: false,
        detail: "A true live per-agent source still needs schema, retention, and audit design."
      }
    ],
    checkpoints: [
      { label: "No raw runtime payloads", state: "Held", tone: "normal" },
      { label: "Curated context", state: "Ready", tone: "info" },
      { label: "Owner revisit", state: "Next", tone: "info" }
    ],
    decisionOptions: [
      {
        label: "Use Events context",
        state: "Recommended",
        tone: "info",
        detail: "Use the curated owner-only timeline for current review and context hops.",
        next: "Open /app/events when the owner needs history, handoffs, review signals, or source posture."
      },
      {
        label: "Request source design",
        state: "Planning",
        tone: "warning",
        detail: "Ask for a private timeline source design before expanding the UI.",
        next: "Draft schema, retention, auth, and redaction rules before implementation."
      },
      {
        label: "Hold live ingestion",
        state: "Safe hold",
        tone: "private",
        detail: "Keep the live private source disconnected until audit design exists.",
        next: "Do not connect raw runtime events to the owner UI from this slice."
      }
    ],
    reviewGates: [
      {
        label: "Curated source",
        state: "Ready",
        tone: "info",
        detail: "Events reads curated roster, handoff, review, source, and boundary packets."
      },
      {
        label: "Live source",
        state: "Future",
        tone: "private",
        detail: "No authenticated live per-agent event source is connected yet."
      },
      {
        label: "No raw payloads",
        state: "Held",
        tone: "normal",
        detail: "The UI uses curated cockpit state and never renders raw runtime payloads."
      }
    ],
    blockers: ["No authenticated live private event source is connected yet."],
    allowedNext: "Use /app/events as a curated owner context while live event ingestion remains future work.",
    disallowedActions: ["Expose raw runtime events", "Add a private API without audit design", "Dispatch agents from history"],
    primaryHref: "/app/agents?agent=doraemon",
    primaryLabel: "Open agents context",
    secondaryHref: "/app/events?agent=doraemon",
    secondaryLabel: "Open event context",
    updated: "Current slice",
    note: "Events is a curated owner-only context, not a raw live runtime feed."
  },
  {
    id: "review-trading-boundary-copy",
    title: "Review trading research boundary copy",
    owner: "Owner",
    agent: "Trading MiniDora",
    lane: "Research boundary",
    surface: "/app/trading",
    decision: "Owner wording choice",
    tone: "warning",
    urgency: "Later",
    requestedDecision: "Decide whether the research-only disclaimer is strong enough for the private trading cockpit.",
    recommendedHandling: "Keep the disclaimer visible until the owner explicitly revises it.",
    evidence: ["Research-only disclaimer", "blocked action list", "source degradation panel"],
    evidenceCards: [
      {
        label: "Disclaimer",
        state: "Visible",
        tone: "normal",
        ready: true,
        detail: "Trading Team states that it is research-only and not an order, recommendation, or execution system."
      },
      {
        label: "Source posture",
        state: "Degraded",
        tone: "warning",
        ready: false,
        detail: "Market data and broker connections are intentionally absent from the web surface."
      },
      {
        label: "Actions",
        state: "Blocked",
        tone: "private",
        ready: false,
        detail: "No broker, paper trading, live order, or auto-promotion path exists."
      }
    ],
    checkpoints: [
      { label: "Research-only", state: "Held", tone: "normal" },
      { label: "No broker write", state: "Held", tone: "private" },
      { label: "Owner wording", state: "Later", tone: "warning" }
    ],
    decisionOptions: [
      {
        label: "Keep current wording",
        state: "Safe default",
        tone: "normal",
        detail: "Keep the fixed research-only disclaimer visible on the private trading cockpit.",
        next: "Continue building evidence-first research surfaces with no execution affordance."
      },
      {
        label: "Revise owner copy",
        state: "Owner wording",
        tone: "warning",
        detail: "Update the human-readable disclaimer without weakening the research-only boundary.",
        next: "Review against the Public/Private Data Contract before shipping."
      },
      {
        label: "Hold trading changes",
        state: "No ship",
        tone: "private",
        detail: "Pause new Trading Team UI until boundary language is settled.",
        next: "Return to Command with a narrower copy-only review packet."
      }
    ],
    reviewGates: [
      {
        label: "Research-only",
        state: "Held",
        tone: "normal",
        detail: "The surface says it is not an order, recommendation, or execution system."
      },
      {
        label: "No broker path",
        state: "Held",
        tone: "private",
        detail: "No broker, paper trading, live order, or auto-promotion path exists."
      },
      {
        label: "Evidence first",
        state: "Required",
        tone: "warning",
        detail: "Signals must link to evidence or show that evidence is missing."
      }
    ],
    blockers: ["No trading execution authorization exists.", "Any future data connection must preserve research-only framing."],
    allowedNext: "Owner may revise copy, but not authorize execution from this page.",
    disallowedActions: ["Order placement", "Broker write", "Position sizing", "Recommendation wording"],
    primaryHref: "/app/trading?view=system",
    primaryLabel: "Open trading system",
    secondaryHref: "/app/trading?view=evidence",
    secondaryLabel: "Open evidence center",
    updated: "Recent slice",
    note: "The console remains research-only and has no order, paper, live, or broker path."
  },
  {
    id: "review-private-api-audit",
    title: "Prepare future private API audit design",
    owner: "Owner",
    agent: "Dev MiniDora",
    lane: "Safety design",
    surface: "/app/command",
    decision: "Blocked",
    tone: "private",
    urgency: "Future",
    requestedDecision: "Decide when the team is ready to design audited write APIs.",
    recommendedHandling: "Keep all command surfaces read-only until auth, audit, rollback, and error handling are designed.",
    evidence: ["Auth/session spec", "command audit rules"],
    evidenceCards: [
      {
        label: "Auth",
        state: "Baseline",
        tone: "info",
        ready: true,
        detail: "The current owner token gate is acceptable for read-only v0 dashboards."
      },
      {
        label: "Audit",
        state: "Missing",
        tone: "private",
        ready: false,
        detail: "No audit log, rollback model, or write permission system exists yet."
      },
      {
        label: "Runtime",
        state: "Unavailable",
        tone: "private",
        ready: false,
        detail: "No command or workflow dispatch endpoint is rendered in the cockpit."
      }
    ],
    checkpoints: [
      { label: "Auth model", state: "Known", tone: "info" },
      { label: "Audit model", state: "Missing", tone: "private" },
      { label: "Write APIs", state: "Blocked", tone: "private" }
    ],
    decisionOptions: [
      {
        label: "Write audit spec",
        state: "Spec first",
        tone: "warning",
        detail: "Design auth, audit log, rollback, error, and permission behavior before any write API exists.",
        next: "Produce an implementation spec and review packet, not an endpoint."
      },
      {
        label: "Keep read-only",
        state: "Safe default",
        tone: "normal",
        detail: "Leave Command and Review Queue as planning and review surfaces only.",
        next: "Continue read-only cockpit slices without adding hidden execution paths."
      },
      {
        label: "Block write work",
        state: "Blocked",
        tone: "private",
        detail: "Do not add action buttons or private APIs until the audit model is approved.",
        next: "Revisit only after the owner accepts the audit and rollback design."
      }
    ],
    reviewGates: [
      {
        label: "Auth",
        state: "Known",
        tone: "info",
        detail: "The current owner token gate is acceptable for read-only v0 dashboards."
      },
      {
        label: "Audit log",
        state: "Missing",
        tone: "private",
        detail: "No append-only action log, actor model, or rollback record exists."
      },
      {
        label: "Write endpoint",
        state: "Blocked",
        tone: "private",
        detail: "No command or workflow dispatch endpoint should be rendered in this cockpit."
      }
    ],
    blockers: ["No audited write API design exists.", "No rollback behavior exists.", "No owner action confirmation model exists."],
    allowedNext: "Write an implementation spec before any action button appears.",
    disallowedActions: ["Hidden execution", "One-click approve", "Silent retry", "Unaudited mutation"],
    primaryHref: "/app/command",
    primaryLabel: "Open command context",
    secondaryHref: "/app/system",
    secondaryLabel: "Open system health",
    updated: "Future",
    note: "No write endpoint should be added until audit, rollback, and error handling are designed."
  }
] as const satisfies readonly PrivateReviewQueueItem[];

const reviewQueueNowCount = privateReviewQueue.filter((item) => item.urgency === "Now").length;
const reviewQueueBlockedCount = privateReviewQueue.filter((item) => item.tone === "private").length;
const reviewQueueEvidenceCount = privateReviewQueue.reduce((total, item) => total + item.evidenceCards.length, 0);

export const reviewQueueMetrics = [
  { label: "Open decisions", value: privateReviewQueue.length.toString(), detail: "Owner-visible review items" },
  { label: "Now", value: reviewQueueNowCount.toString(), detail: "Needs current attention" },
  { label: "Blocked", value: reviewQueueBlockedCount.toString(), detail: "No action path allowed" },
  { label: "Evidence cards", value: reviewQueueEvidenceCount.toString(), detail: "Proof or gap rows" }
] as const satisfies readonly PrivateReviewQueueMetric[];

export const reviewQueueLanes = [
  {
    label: "Ship gate",
    owner: "Codex + Opus",
    count: privateReviewQueue.filter((item) => item.lane === "Ship gate").length.toString(),
    state: "Current",
    tone: "warning",
    detail: "Local evidence and external review must be clean before PR/deploy."
  },
  {
    label: "Product depth",
    owner: "Doraemon",
    count: privateReviewQueue.filter((item) => item.lane === "Product depth").length.toString(),
    state: "Deferred",
    tone: "private",
    detail: "Depth work waits for a real source instead of invented history."
  },
  {
    label: "Research boundary",
    owner: "Trading MiniDora",
    count: privateReviewQueue.filter((item) => item.lane === "Research boundary").length.toString(),
    state: "Owner wording",
    tone: "warning",
    detail: "Trading stays research-only and evidence-first."
  },
  {
    label: "Safety design",
    owner: "Dev MiniDora",
    count: privateReviewQueue.filter((item) => item.lane === "Safety design").length.toString(),
    state: "Blocked",
    tone: "private",
    detail: "Write APIs need audit and rollback design before controls exist."
  }
] as const satisfies readonly PrivateReviewQueueLane[];

export const reviewQueuePolicy = [
  "Approvals, rejects, notes, and deferrals are represented as review states only.",
  "This page has no approve, reject, publish, execute, or dispatch button.",
  "Every decision item must show evidence or say what evidence is missing.",
  "No silent auto-promotion from review state to execution state."
] as const;

export const ownerReviewQueueData = {
  queue: privateReviewQueue,
  metrics: reviewQueueMetrics,
  lanes: reviewQueueLanes,
  policy: reviewQueuePolicy
} as const;
