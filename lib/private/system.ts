import "server-only";

// Owner-only diagnostics data. Do not import this module from public routes or public components.

export type SystemTone = "normal" | "info" | "warning" | "private" | "danger";
export type PrivateSystemPosture = "healthy" | "watch" | "blocked";

export type PrivateSystemEvidence = {
  label: string;
  state: string;
  tone: SystemTone;
  detail: string;
};

export type PrivateSystemService = {
  id: string;
  label: string;
  domain: string;
  posture: PrivateSystemPosture;
  state: string;
  tone: SystemTone;
  detail: string;
  visibleSignal: string;
  ownerGate: string;
  evidence: readonly PrivateSystemEvidence[];
  risks: readonly string[];
  noGo: readonly string[];
};

export type PrivateSystemSignal = {
  id: string;
  label: string;
  value: string;
  tone: SystemTone;
  scope: string;
  detail: string;
  lastChecked: string;
};

export type PrivateSystemGap = {
  id: string;
  label: string;
  state: string;
  tone: SystemTone;
  detail: string;
  notedAt: string;
  revisitWhen: string;
};

export type PrivateSystemMetric = {
  label: string;
  value: string;
  detail: string;
};

export type PrivateSystemDiagnosticLane = {
  label: string;
  owner: string;
  state: string;
  tone: SystemTone;
  detail: string;
};

export const privateSystemServices = [
  {
    id: "owner-auth-gate",
    label: "Owner auth gate",
    domain: "Access boundary",
    posture: "healthy",
    state: "Enabled",
    tone: "normal",
    detail: "Private routes redirect before owner-only UI renders.",
    visibleSignal: "Unauthenticated /app routes redirect to login.",
    ownerGate: "Owner session is required before the cockpit shell renders.",
    evidence: [
      {
        label: "Private gate",
        state: "Held",
        tone: "normal",
        detail: "The route guard must redirect before private UI is sent."
      },
      {
        label: "Session material",
        state: "Hidden",
        tone: "private",
        detail: "The page never renders credential values or cookie contents."
      },
      {
        label: "Public pages",
        state: "Separate",
        tone: "info",
        detail: "Public Doraemon pages remain reachable without owner auth."
      }
    ],
    risks: ["Auth copy can drift if route smoke is skipped.", "Future private APIs must check auth server-side."],
    noGo: ["No credential display", "No client-readable session", "No unauthenticated app shell"]
  },
  {
    id: "doraemon-public-boundary",
    label: "Doraemon public boundary",
    domain: "Public relay",
    posture: "healthy",
    state: "Sanitized",
    tone: "normal",
    detail: "Public surfaces use safe labels, public schemas, and no owner controls.",
    visibleSignal: "Public dashboard uses sanitized status and fixed labels.",
    ownerGate: "Public fields stay allowlisted; private detail belongs in Owner Cockpit only.",
    evidence: [
      {
        label: "IDs",
        state: "Opaque",
        tone: "normal",
        detail: "Public IDs must remain hashed or fixed public labels."
      },
      {
        label: "Titles",
        state: "Fixed",
        tone: "normal",
        detail: "Public text cannot expose private task names or prompts."
      },
      {
        label: "Controls",
        state: "Absent",
        tone: "private",
        detail: "Public surfaces stay display-only."
      }
    ],
    risks: ["A future import from private operations data into public routes could leak mock detail."],
    noGo: ["No raw IDs", "No prompt bodies", "No owner controls"]
  },
  {
    id: "event-freshness",
    label: "Event freshness",
    domain: "Signal posture",
    posture: "watch",
    state: "Mock source",
    tone: "warning",
    detail: "The private cockpit has no live internal event source connected yet.",
    visibleSignal: "Use summary freshness only until a private source exists.",
    ownerGate: "Owner can see the absence of a private feed without seeing runtime records.",
    evidence: [
      {
        label: "Live source",
        state: "Missing",
        tone: "warning",
        detail: "No private event feed is attached to this web page."
      },
      {
        label: "Public relay",
        state: "Separate",
        tone: "info",
        detail: "Public relay health should not become private runtime evidence."
      },
      {
        label: "Fallback",
        state: "Summary",
        tone: "private",
        detail: "The UI shows safe posture instead of raw runtime records."
      }
    ],
    risks: ["Freshness can look more precise than it is if mock wording is too confident."],
    noGo: ["No event payload", "No internal feed address", "No implementation label"]
  },
  {
    id: "review-queue-health",
    label: "Review queue health",
    domain: "Owner decisions",
    posture: "watch",
    state: "Review gated",
    tone: "info",
    detail: "Items remain in review state until owner action flows are designed.",
    visibleSignal: "Open decisions are visible in the Review Queue cockpit.",
    ownerGate: "Owner chooses what moves; this page only summarizes posture.",
    evidence: [
      {
        label: "Review state",
        state: "Held",
        tone: "normal",
        detail: "No silent auto-promotion from review into execution."
      },
      {
        label: "Blocked work",
        state: "Visible",
        tone: "warning",
        detail: "Blocked or deferred work should be named as posture, not repaired here."
      },
      {
        label: "Actions",
        state: "Unavailable",
        tone: "private",
        detail: "Approve, reject, publish, and dispatch controls live outside this page."
      }
    ],
    risks: ["Queue health will need a real source before it can become operational evidence."],
    noGo: ["No one-click approve", "No publish action", "No runtime dispatch"]
  },
  {
    id: "command-runtime",
    label: "Command runtime",
    domain: "Command surface",
    posture: "blocked",
    state: "Not connected",
    tone: "private",
    detail: "The command surface is draft-only until a separate audited API exists.",
    visibleSignal: "Command work can be drafted, but not sent to runtime.",
    ownerGate: "Write APIs need auth, audit, recovery, and error handling before controls exist.",
    evidence: [
      {
        label: "Write API",
        state: "Missing",
        tone: "private",
        detail: "No mutation endpoint is exposed from the cockpit."
      },
      {
        label: "Audit",
        state: "Required",
        tone: "warning",
        detail: "Future commands need a reviewable action log."
      },
      {
        label: "Recovery",
        state: "Required",
        tone: "warning",
        detail: "Future repair or command flows need a recovery model."
      }
    ],
    risks: ["Adding a control before audit design would turn diagnostics into execution."],
    noGo: ["No command dispatch", "No hidden retry", "No unaudited mutation"]
  },
  {
    id: "trading-execution",
    label: "Trading execution",
    domain: "Research boundary",
    posture: "blocked",
    state: "Disabled",
    tone: "private",
    detail: "Trading Team remains research-only with no broker write or order path.",
    visibleSignal: "Research posture is visible; execution remains absent.",
    ownerGate: "Owner may read research, not trigger order flow from the web cockpit.",
    evidence: [
      {
        label: "Disclaimer",
        state: "Held",
        tone: "normal",
        detail: "Trading Team remains research-only."
      },
      {
        label: "Broker write",
        state: "Absent",
        tone: "private",
        detail: "No broker, paper, live, or account mutation path is rendered."
      },
      {
        label: "Recommendations",
        state: "Avoided",
        tone: "warning",
        detail: "Signals stay evidence-oriented, not order recommendations."
      }
    ],
    risks: ["Future data integration must not imply execution readiness."],
    noGo: ["No order placement", "No broker write", "No recommendation wording"]
  }
] as const satisfies readonly PrivateSystemService[];

export const privateSystemSignals = [
  {
    id: "event-freshness",
    label: "Event freshness",
    value: "Mock source",
    tone: "warning",
    scope: "Private cockpit",
    detail: "No live private event feed is attached to this page yet.",
    lastChecked: "This session"
  },
  {
    id: "queue-health",
    label: "Queue health",
    value: "Review gated",
    tone: "info",
    scope: "Owner decisions",
    detail: "Decision items remain gated until explicit owner action design exists.",
    lastChecked: "This session"
  },
  {
    id: "failure-feed",
    label: "Recent failures",
    value: "None surfaced",
    tone: "normal",
    scope: "Summary only",
    detail: "No private failure feed is connected; this is not a runtime-record assertion.",
    lastChecked: "Tracked off-page"
  },
  {
    id: "bundle-boundary",
    label: "Bundle boundary",
    value: "Release gate",
    tone: "warning",
    scope: "Build artifact",
    detail: "Private strings must stay out of public/static bundles before release.",
    lastChecked: "Before merge"
  }
] as const satisfies readonly PrivateSystemSignal[];

export const privateSystemGaps = [
  {
    id: "no-private-feed",
    label: "Private event source not connected",
    state: "Known gap",
    tone: "warning",
    detail: "The page is intentionally honest about missing private telemetry rather than inventing precision.",
    notedAt: "Current slice",
    revisitWhen: "When a private source is designed"
  },
  {
    id: "repair-api-not-designed",
    label: "Repair API not designed",
    state: "Blocked",
    tone: "private",
    detail: "Repair, release, queue mutation, recovery, and runtime-detail access require separate auth and audit design.",
    notedAt: "Current slice",
    revisitWhen: "Before any repair control appears"
  },
  {
    id: "public-private-import-risk",
    label: "Public/private import risk",
    state: "Watch",
    tone: "warning",
    detail: "Private operations data should not be imported by public routes or public bundles.",
    notedAt: "Release review",
    revisitWhen: "Every PR touching owner-only diagnostics data"
  }
] as const satisfies readonly PrivateSystemGap[];

const healthySystemServiceCount = privateSystemServices.filter((service) => service.posture === "healthy").length;
const watchSystemServiceCount = privateSystemServices.filter((service) => service.posture === "watch").length;
const blockedSystemServiceCount = privateSystemServices.filter((service) => service.posture === "blocked").length;
const systemEvidenceCount = privateSystemServices.reduce((total, service) => total + service.evidence.length, 0);

export const privateSystemMetrics = [
  { label: "Healthy", value: healthySystemServiceCount.toString(), detail: "Boundaries currently held" },
  { label: "Watch", value: watchSystemServiceCount.toString(), detail: "Summary gaps or weak signals" },
  { label: "Blocked", value: blockedSystemServiceCount.toString(), detail: "No action path allowed" },
  { label: "Tracked rows", value: systemEvidenceCount.toString(), detail: "Evidence, gaps, or controls" }
] as const satisfies readonly PrivateSystemMetric[];

export const privateSystemDiagnosticLanes = [
  {
    label: "Access",
    owner: "Doraemon",
    state: "Held",
    tone: "normal",
    detail: "Owner auth is the first diagnostic boundary: private shell must not render before login."
  },
  {
    label: "Telemetry",
    owner: "Dev MiniDora",
    state: "Watch",
    tone: "warning",
    detail: "Event freshness and failure feed are shown as posture until a private source is connected."
  },
  {
    label: "Review",
    owner: "Product MiniDora",
    state: "Owner gated",
    tone: "info",
    detail: "Review Queue and schedules stay visible, but this page cannot promote work."
  },
  {
    label: "Execution",
    owner: "Owner",
    state: "Blocked",
    tone: "private",
    detail: "Repair, command, trading, and broker paths stay unavailable without audit design."
  }
] as const satisfies readonly PrivateSystemDiagnosticLane[];

export const privateSystemDiagnostics = [
  "Diagnostics are summary-level only.",
  "No implementation address, credential value, local machine label, or runtime record line is rendered.",
  "Bundle boundary checks are a release gate for credential values, machine paths, and runtime records.",
  "Repair, release, and recovery workflows need separate authenticated APIs.",
  "Public Doraemon status and private Owner Cockpit status stay separated."
] as const;
