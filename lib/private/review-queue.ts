import "server-only";

// Owner-only review queue data. Do not import this module from public routes or shared client components.

export type ReviewQueueTone = "normal" | "info" | "warning" | "private";

export type PrivateReviewQueueEvidence = {
  label: string;
  state: string;
  tone: ReviewQueueTone;
  detail: string;
};

export type PrivateReviewQueueCheckpoint = {
  label: string;
  state: string;
  tone: ReviewQueueTone;
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
  blockers: readonly string[];
  allowedNext: string;
  disallowedActions: readonly string[];
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
    surface: "/app/events",
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
        detail: "Production build and TypeScript must pass after the final diff."
      },
      {
        label: "Auth",
        state: "Required",
        tone: "warning",
        detail: "Unauthenticated /app/events must redirect before private shell content renders."
      },
      {
        label: "Review",
        state: "Required",
        tone: "warning",
        detail: "Claude Opus must return no open P1/P2 before PR/deploy."
      }
    ],
    checkpoints: [
      { label: "No approve button", state: "Held", tone: "private" },
      { label: "Evidence visible", state: "Required", tone: "warning" },
      { label: "Owner decides", state: "Required", tone: "warning" }
    ],
    blockers: ["No live private review API exists in this slice.", "The page must remain a decision register, not a workflow runner."],
    allowedNext: "Prepare PR only after local verification and Opus review are clean.",
    disallowedActions: ["Approve and execute", "Reject and run", "Publish", "Dispatch tools"],
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
    decision: "Defer",
    tone: "private",
    urgency: "Next",
    requestedDecision: "Decide whether the next Agents pass needs a full per-agent timeline or the current snapshot is enough.",
    recommendedHandling: "Keep the current roster shipped, then revisit history depth when a private event source exists.",
    evidence: ["Step review history", "current slice summary"],
    evidenceCards: [
      {
        label: "Roster",
        state: "Complete",
        tone: "normal",
        detail: "The current Agents surface shows leases, source health, handoffs, and boundary."
      },
      {
        label: "History",
        state: "Deferred",
        tone: "private",
        detail: "True per-agent history needs a private timeline source, not invented UI rows."
      }
    ],
    checkpoints: [
      { label: "No fake history", state: "Held", tone: "normal" },
      { label: "Source needed", state: "Deferred", tone: "private" },
      { label: "Owner revisit", state: "Next", tone: "info" }
    ],
    blockers: ["No authenticated agent timeline source is connected yet."],
    allowedNext: "Track as a future Agents or Events depth slice.",
    disallowedActions: ["Invent history", "Expose raw runtime events", "Add a private API without audit design"],
    updated: "Recent slice",
    note: "Each cockpit surface should continue landing as a reviewed, coherent slice."
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
        detail: "Trading Team states that it is research-only and not an order, recommendation, or execution system."
      },
      {
        label: "Source posture",
        state: "Degraded",
        tone: "warning",
        detail: "Market data and broker connections are intentionally absent from the web surface."
      },
      {
        label: "Actions",
        state: "Blocked",
        tone: "private",
        detail: "No broker, paper trading, live order, or auto-promotion path exists."
      }
    ],
    checkpoints: [
      { label: "Research-only", state: "Held", tone: "normal" },
      { label: "No broker write", state: "Held", tone: "private" },
      { label: "Owner wording", state: "Later", tone: "warning" }
    ],
    blockers: ["No trading execution authorization exists.", "Any future data connection must preserve research-only framing."],
    allowedNext: "Owner may revise copy, but not authorize execution from this page.",
    disallowedActions: ["Order placement", "Broker write", "Position sizing", "Recommendation wording"],
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
        detail: "The current owner token gate is acceptable for read-only v0 dashboards."
      },
      {
        label: "Audit",
        state: "Missing",
        tone: "private",
        detail: "No audit log, rollback model, or write permission system exists yet."
      },
      {
        label: "Runtime",
        state: "Unavailable",
        tone: "private",
        detail: "No command or workflow dispatch endpoint is rendered in the cockpit."
      }
    ],
    checkpoints: [
      { label: "Auth model", state: "Known", tone: "info" },
      { label: "Audit model", state: "Missing", tone: "private" },
      { label: "Write APIs", state: "Blocked", tone: "private" }
    ],
    blockers: ["No audited write API design exists.", "No rollback behavior exists.", "No owner action confirmation model exists."],
    allowedNext: "Write an implementation spec before any action button appears.",
    disallowedActions: ["Hidden execution", "One-click approve", "Silent retry", "Unaudited mutation"],
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
