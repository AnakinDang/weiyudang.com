export type AgentState =
  | "idle"
  | "planning"
  | "researching"
  | "coding"
  | "writing"
  | "tool_call"
  | "handoff"
  | "waiting_user"
  | "error"
  | "done";

export type AgentEvent = {
  event_id: string;
  run_id: string;
  task_id: string;
  agent_id: string;
  agent_role: string;
  state: AgentState;
  tool_name?: string;
  message_short: string;
  started_at: string;
  ended_at?: string | null;
  parent_event_id?: string | null;
  cost_usd?: number;
  tokens?: number;
  severity: "normal" | "info" | "warning" | "error" | "critical";
};

export const companyModel = [
  {
    title: "Human Vision",
    summary: "Weiyu defines direction, taste, judgment, and final approval."
  },
  {
    title: "Doraemon Orchestrator",
    summary: "Doraemon translates ideas into plans, tasks, summaries, and review checkpoints."
  },
  {
    title: "MiniDora Agents",
    summary: "Specialized agents help with research, engineering, media, and trading research."
  }
];

export const tradingStatus = {
  fixture_id: "weiyudang-com-dashboard-fixture-seed-v0_1",
  fixture_hash: "875cba2d4fccbb2c…bd46a",
  snapshot_time: "2026-05-15 14:55 UTC",
  campaign_id: "P0-LPC-20260427-001",
  phase: "T0 observation-card route online",
  blocked_phase: "T1 stable signal blocked",
  mode: "Local fixture / research-only",
  route_status: "route/auth/deploy pending owner technical review",
  research_only_label: "Research-only. Not an order, not execution, not account-specific sizing.",
  broker_write: false,
  paper_submit: false,
  live_submit: false,
  phase_auto_promotion: false,
  runtime_signal_or_order_objects: false,
  exact_account_sizing: false
};

export const hardStopFlags = [
  "No broker/order/funds",
  "No live account write",
  "No real funds movement",
  "No auto-execution",
  "No exact account-specific sizing",
  "No signal_event / order_intent",
  "No strategy runtime or phase promotion",
  "No public release without owner approval"
];

export const researchGates = [
  {
    id: "QR-01",
    name: "Source quality",
    status: "warn",
    note: "Primary/fallback labels visible; some desk inputs remain degraded."
  },
  {
    id: "QR-02",
    name: "Evidence packet",
    status: "pass",
    note: "Sanitized fixture includes source refs, hashes, and page contracts."
  },
  {
    id: "QR-03",
    name: "Liquidity / IV",
    status: "blocked",
    note: "Greeks and live option liquidity are not connected in this UI."
  },
  {
    id: "QR-04",
    name: "Replay maturity",
    status: "not_run",
    note: "T+1/T+5/T+20 outcomes are waiting for enough observation history."
  },
  {
    id: "QR-05",
    name: "Owner review",
    status: "blocked",
    note: "No route, auth model, or phase promotion decision has been approved."
  }
] as const;

export const deskMatrix = [
  {
    desk: "MI",
    stance: "Context only",
    confidence: "capped",
    evidence: "Macro regime label is allowed as sanitized status metadata.",
    risk: "Fallback sources can stale quickly.",
    disagreement: "Does not override hard stops."
  },
  {
    desk: "FA",
    stance: "Pending review",
    confidence: "low",
    evidence: "Fundamental packet not attached to this local fixture.",
    risk: "Missing source freshness.",
    disagreement: "Requires manual artifact validation."
  },
  {
    desk: "TA",
    stance: "Observation candidate",
    confidence: "medium-low",
    evidence: "Canary card metadata exists; card text is intentionally redacted.",
    risk: "Trigger/invalidation must remain research language.",
    disagreement: "Blocked from execution wording."
  },
  {
    desk: "Social",
    stance: "Offline",
    confidence: "unavailable",
    evidence: "Private/public social feeds are not connected.",
    risk: "No raw DM or chat content may appear here.",
    disagreement: "N/A"
  },
  {
    desk: "Quant",
    stance: "Gate blocked",
    confidence: "capped",
    evidence: "Replay labels and canary maturity are incomplete.",
    risk: "Insufficient sample history.",
    disagreement: "No stable-signal upgrade."
  },
  {
    desk: "Doraemon",
    stance: "Review required",
    confidence: "policy-high",
    evidence: "AQTV-167 boundary contract and redaction matrix.",
    risk: "Route/auth/deploy unresolved.",
    disagreement: "Keep dashboard private and read-only."
  }
] as const;

export const candidateQueue = [
  {
    id: "obs-tsla-350c-canary",
    label: "研究观察 / observation candidate",
    title: "TSLA 2026-05-22 350C canary receipt",
    direction: "options context only",
    trigger: "Material trigger policy only; no scheduled send unless conditions change.",
    invalidation: "Greeks/liquidity missing, source degraded, or owner review not complete.",
    confidence: "capped",
    gates: ["QR-01 warn", "QR-02 pass", "QR-03 blocked"],
    evidence_count: 2,
    updated: "2026-05-15 21:35 GMT+8"
  },
  {
    id: "intraday-beta-watch",
    label: "research-card beta",
    title: "AQTV-163 intraday card schedule",
    direction: "default no-send",
    trigger: "One card per run and five per day cap, send only on material trigger.",
    invalidation: "Duplicate receipt, no material change, or canary budget exhausted.",
    confidence: "policy-defined",
    gates: ["send cap visible", "idempotency visible", "default no-send"],
    evidence_count: 3,
    updated: "2026-05-15 21:35 GMT+8"
  },
  {
    id: "weiyudang-route-review",
    label: "surface decision",
    title: "weiyudang.com detailed dashboard route",
    direction: "private route pending",
    trigger: "Owner selects protected path, subdomain, or standalone private app.",
    invalidation: "No auth model, deploy approval, or redaction check.",
    confidence: "blocked",
    gates: ["route pending", "auth pending", "no public release"],
    evidence_count: 2,
    updated: "2026-05-15 14:55 UTC"
  }
] as const;

export const evidenceTrail = [
  {
    id: "aqtv167_surface_contract",
    title: "Read-only dashboard surface contract",
    kind: "contract",
    status: "pass",
    source: "AQTV-167",
    hash: "17180cf9…fcb3d8e",
    privacy: "sanitized metadata only",
    summary: "Defines weiyudang.com as future detailed evidence surface and preserves research-only hard stops."
  },
  {
    id: "aqtv163_beta_summary",
    title: "Intraday research-card beta summary",
    kind: "runtime summary",
    status: "warn",
    source: "AQTV-163",
    hash: "a6202fe4…fae6c9e",
    privacy: "redacted receipt metadata",
    summary: "Beta cron exists with default no-send, material-trigger policy, and idempotency constraints."
  },
  {
    id: "aqtv161_canary_receipt",
    title: "Canary delivery receipt",
    kind: "receipt",
    status: "pass",
    source: "AQTV-161",
    hash: "c797d4b8…24ffcb3",
    privacy: "card text absent",
    summary: "One research-card canary was sent once; target is redacted and card body is not bundled."
  },
  {
    id: "target_dashboard_v0_203",
    title: "Target-state dashboard snapshot",
    kind: "snapshot",
    status: "info",
    source: "target_dashboard_v0_203",
    hash: "3b761016…fa7e6",
    privacy: "sanitized derivative",
    summary: "Provides compact current-state metadata for status, gates, artifacts, and blocker reasons."
  }
] as const;

export const teamRoles = [
  {
    role: "Weiyu",
    owner: "Human owner",
    responsibility: "Route/auth approval, research judgment, final review, and any future phase decision."
  },
  {
    role: "Doraemon",
    owner: "Orchestrator",
    responsibility: "Keeps task boundaries clear, summarizes evidence, and blocks unsafe scope creep."
  },
  {
    role: "MiniDora Trading",
    owner: "Research desk",
    responsibility: "Produces observation candidates, gates, replay labels, and sanitized artifacts."
  },
  {
    role: "WebUI",
    owner: "Read-only surface",
    responsibility: "Displays fixture data only; no backend calls, broker writes, or runtime activation."
  }
] as const;

export const nextReviewActions = [
  "Choose protected route model for /app/trading before any deployment exposure.",
  "Promote only sanitized fixture/schema derivatives into the website repo.",
  "Add validated artifact adapter later, after auth and redaction checklist pass.",
  "Keep WhatsApp as concise alert layer; use website only for evidence drill-down.",
  "Wait for replay maturity before considering T1 stable signal discussion."
] as const;

export const events: AgentEvent[] = [
  {
    event_id: "evt_001",
    run_id: "run_website_mvp",
    task_id: "site_shell",
    agent_id: "doraemon",
    agent_role: "orchestrator",
    state: "planning",
    message_short: "Public portal shell defined from design blueprint.",
    started_at: "2026-05-09T09:00:00+08:00",
    ended_at: "2026-05-09T09:04:00+08:00",
    severity: "info"
  },
  {
    event_id: "evt_002",
    run_id: "run_website_mvp",
    task_id: "trading_dashboard",
    agent_id: "minidora-trading",
    agent_role: "research",
    state: "waiting_user",
    message_short: "Read-only P0 local-paper dashboard is waiting for real artifact feed.",
    started_at: "2026-05-09T09:10:00+08:00",
    severity: "warning"
  },
  {
    event_id: "evt_003",
    run_id: "run_website_mvp",
    task_id: "content_system",
    agent_id: "minidora-dev",
    agent_role: "engineering",
    state: "done",
    message_short: "Project pages are sourced from structured content files.",
    started_at: "2026-05-09T09:16:00+08:00",
    ended_at: "2026-05-09T09:18:00+08:00",
    severity: "normal"
  }
];

export const publicQuestions = [
  "What is Weiyu AI?",
  "How does Dora work?",
  "Show me Weiyu's projects.",
  "What does Weiyu share outside the lab?",
  "What is the MiniDora Trading research desk?",
  "How can I collaborate with Weiyu?"
];

export const doraAnswers: Record<string, string> = {
  "What is Weiyu AI?":
    "Weiyu AI is the personal AI lab inside Weiyu's website. It explores how agents, interfaces, and workflows can support research, creative work, and review.",
  "How does Dora work?":
    "Dora is the warm public guide and orchestration concept. It explains public projects, points visitors to the right pages, and keeps private systems out of scope.",
  "Show me Weiyu's projects.":
    "Start with Weiyu AI, Dora, MiniDora Trading, AI Media Lab, and Games & Apps. The Projects page has the public index.",
  "What does Weiyu share outside the lab?":
    "The Journal is the softer side of the site: photography, life notes, places, and field observations that sit beside the technical work.",
  "What is the MiniDora Trading research desk?":
    "MiniDora Trading is an evidence-first research desk. It observes, validates, records, and prepares owner-review artifacts. It does not autonomously trade.",
  "How can I collaborate with Weiyu?":
    "Use the Contact page for AI systems, creative workflows, physics and quantum computing notes, or research collaboration."
};
