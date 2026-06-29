import "server-only";

// Today owns a compact cockpit snapshot. Detailed system diagnostics stay in "@/lib/private/system".

import { ownerKnowledgeHref } from "@/lib/knowledge-route";
import { privateTradingEvidenceHref, privateTradingSystemHref } from "@/lib/private/trading-team";
import { ownerReviewHref } from "@/lib/review-route";
import { ownerScheduleHref } from "@/lib/schedule-route";
import { ownerSystemHref } from "@/lib/system-route";

export const ownerTodayBrief = {
  focus: "Ship the next Personal OS slice without weakening the public/private boundary.",
  posture: "Authenticated, read-only, owner-reviewed",
  nextReview: "Owner Cockpit Today",
  freshness: "Seeded private scaffold"
} as const;

export const ownerTodayPriorities = [
  {
    lane: "Product",
    title: "Turn Today into the owner command surface",
    owner: "Doraemon",
    state: "Active slice",
    tone: "warning",
    summary: "Keep the private home focused on priorities, approvals, research posture, schedule pressure, and system health.",
    nextStep: "Review the refreshed cockpit layout before the next route expands.",
    freshness: "Now"
  },
  {
    lane: "Systems",
    title: "Keep the public Doraemon window verifiable",
    owner: "Dev MiniDora",
    state: "Live probe",
    tone: "info",
    summary: "Use the public-safe system page as the owner-visible bridge to relay health without exposing internals.",
    nextStep: "Preserve route smokes, leak probes, and production bundle checks.",
    freshness: "Today"
  },
  {
    lane: "Research",
    title: "Prepare trading research evidence lanes",
    owner: "Trading MiniDora",
    state: "Research-only",
    tone: "private",
    summary: "Make source quality, gate status, and owner review visible without broker actions.",
    nextStep: "Separate signals, gates, and evidence from any execution concept.",
    freshness: "Queued"
  }
] as const;

export const ownerOperatingMap = [
  {
    title: "Public Doraemon Office",
    href: "/dora/system",
    state: "Public-safe live probe",
    tone: "normal",
    current: false,
    summary: "Sanitized Office pages show public relay posture, agent presence, tasks, schedules, knowledge, and system health.",
    evidence: "No private task titles, raw IDs, prompts, credentials, or repair controls."
  },
  {
    title: "Owner Cockpit",
    href: "/app",
    state: "Authenticated read-only",
    tone: "private",
    current: true,
    summary: "The private shell organizes Today, Command, Agents, Review Queue, Schedules, Settings, and System Health.",
    evidence: "Owner session required before private app chrome or data renders."
  },
  {
    title: "Trading Research",
    href: "/app/trading",
    state: "Research-only",
    tone: "warning",
    current: false,
    summary: "MiniDora Trading collects signals, desks, gates, evidence, replay, and source degradation for owner review.",
    evidence: "Research-only. Not an order, recommendation, or execution system."
  },
  {
    title: "Review Queue",
    href: "/app/review",
    state: "Owner-gated",
    tone: "info",
    current: false,
    summary: "Decisions stay visible as checkpoints, not hidden execution paths or one-click approvals.",
    evidence: "Future mutations require authentication, audit logging, explicit owner action, and rollback behavior."
  }
] as const;

export const ownerReviewQueue = [
  {
    title: "Review Owner Cockpit Today operating map",
    agent: "Codex + Opus",
    urgency: "Now",
    state: "In review",
    tone: "warning",
    decision: "Accept, revise, or narrow the next private route slice.",
    evidence: "Build, auth redirect, screenshot, leak probe, and Opus review.",
    href: ownerReviewHref("review-private-events-surface"),
    hrefLabel: "Open review packet",
    contextHref: "/app/command",
    contextLabel: "Open command context"
  },
  {
    title: "Decide next private cockpit slice",
    agent: "Doraemon",
    urgency: "Next",
    state: "Waiting",
    tone: "warning",
    decision: "Pick Command, Agents, or Trading evidence depth.",
    evidence: "Docs define the route map; implementation should stay read-only.",
    href: ownerReviewHref("review-agent-history-depth"),
    hrefLabel: "Open review packet",
    contextHref: "/app/agents",
    contextLabel: "Open agent context"
  },
  {
    title: "Define Trading Team evidence bridge",
    agent: "Trading MiniDora",
    urgency: "Later",
    state: "Draft",
    tone: "info",
    decision: "Choose what private research evidence becomes owner-scannable.",
    evidence: "Research-only boundary remains fixed; no broker writes.",
    href: ownerReviewHref("review-trading-boundary-copy"),
    hrefLabel: "Open review packet",
    contextHref: privateTradingEvidenceHref("Volatility surface sample", "Pending"),
    contextLabel: "Open evidence center"
  }
] as const;

export const ownerDecisionHub = [
  {
    title: "Review Queue",
    href: "/app/review",
    state: "Decision packets",
    tone: "warning",
    summary: "Owner decisions, missing evidence, safe deferrals, and merge gates stay in one read-only queue.",
    proof: "No approve, reject, publish, execute, or dispatch action is available."
  },
  {
    title: "Trading Evidence",
    href: privateTradingSystemHref(),
    state: "Research-only",
    tone: "private",
    summary: "Trading review items open the evidence, source health, gate, and replay surfaces without execution.",
    proof: "Research-only. Not an order, recommendation, or execution system."
  },
  {
    title: "Command Context",
    href: "/app/command",
    state: "Draft only",
    tone: "info",
    summary: "Command stays a planning surface for owner review until audited write APIs exist.",
    proof: "No runtime dispatch endpoint is exposed from Today."
  },
  {
    title: "System Health",
    href: ownerSystemHref("owner-auth-gate"),
    state: "Diagnostics",
    tone: "normal",
    summary: "System posture remains visible at owner depth while public health stays sanitized.",
    proof: "Private auth gate is required before diagnostics render."
  }
] as const;

export const ownerMarketAlerts = [
  {
    label: "Research mode",
    value: "Read-only",
    detail: "No orders, recommendations, broker writes, or execution controls."
  },
  {
    label: "Signal quality",
    value: "Evidence pending",
    detail: "Today surface should show source coverage before any candidate is promoted."
  },
  {
    label: "Gate posture",
    value: "Owner-gated",
    detail: "Private console can prepare evidence, but owner review remains the decision point."
  }
] as const;

export const ownerSchedulePressure = [
  { label: "Daily brief", time: "Morning", state: "Ready", tone: "normal", href: ownerScheduleHref("daily-brief") },
  { label: "Market scan", time: "Market session", state: "Research-only", tone: "private", href: ownerScheduleHref("market-scan") },
  { label: "System health", time: "Tonight", state: "Watching", tone: "info", href: ownerScheduleHref("system-health") },
  { label: "Weekly review", time: "This week", state: "Queued", tone: "warning", href: ownerScheduleHref("weekly-review") }
] as const;

export const ownerSystemHealth = [
  { label: "Private auth gate", value: "Enabled", tone: "normal" },
  { label: "Public relay probe", value: "Live-safe", tone: "normal" },
  { label: "Public Doraemon boundary", value: "Sanitized", tone: "normal" },
  { label: "Data source", value: "Seeded scaffold", tone: "warning" },
  { label: "Trading execution", value: "Disabled", tone: "private" },
  { label: "Private writes", value: "Unavailable", tone: "private" }
] as const;

export const ownerCommandShortcuts = [
  {
    title: "Command",
    href: "/app/command",
    summary: "Draft plans, review owner checkpoints, and inspect current mission shape."
  },
  {
    title: "Review Queue",
    href: "/app/review",
    summary: "Inspect owner decisions, evidence cards, gates, blockers, and allowed next steps."
  },
  {
    title: "Trading Team",
    href: privateTradingSystemHref(),
    summary: "Open the research-only console at source health, gates, evidence, and replay coverage."
  },
  {
    title: "Knowledge Vault",
    href: ownerKnowledgeHref("personal-os-memory"),
    summary: "Review private synthesis layers before anything is curated for public publishing."
  }
] as const;
