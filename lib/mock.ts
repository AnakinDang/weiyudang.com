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
  campaign_id: "P0-LPC-20260427-001",
  phase: "P0 local-paper",
  qualifying_days: 0,
  required_days: 10,
  qualifying_trades: 0,
  required_trades: 30,
  broker_write: false,
  paper_submit: false,
  live_submit: false,
  phase_auto_promotion: false
};

export const riskState = [
  { label: "Daily loss state", value: "normal", severity: "info" },
  { label: "Duplicate signal state", value: "clear", severity: "normal" },
  { label: "Halt state", value: "not active", severity: "normal" },
  { label: "Forbidden action attempts", value: "0", severity: "normal" }
] as const;

export const marketContext = [
  "MI context placeholder",
  "TA evidence pending",
  "Options data not connected",
  "Social feed offline",
  "FA source review pending"
];

export const candidateQueue = [
  {
    stage: "candidate_seed",
    title: "Evidence-backed watch idea",
    status: "waiting for source packet"
  },
  {
    stage: "candidate_contract",
    title: "Hypothesis contract",
    status: "not created"
  },
  {
    stage: "quant_verification_report",
    title: "Quant verification",
    status: "blocked until candidate_contract exists"
  },
  {
    stage: "strategy_spec_draft",
    title: "Strategy spec draft",
    status: "owner review required"
  }
];

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
