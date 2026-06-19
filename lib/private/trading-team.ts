import "server-only";

// Owner-only MiniDora Trading research data. Public modules may import only types/disclaimer from "@/lib/trading-team".

import { tradingResearchDisclaimer, type TradingResearchCockpitData } from "@/lib/trading-team";

const tradingViews = ["Today", "Signals", "Desks", "Options Lab", "Evidence", "Replay", "System"] as const;

const tradingTeamStatus = {
  mode: "Private research console",
  phase: "Evidence scaffold",
  posture: "Owner review required",
  lastUpdated: "Mock session"
} as const;

const tradingTodayFocus = [
  {
    title: "What matters today",
    state: "Partial",
    icon: "alert",
    detail: "Research packets are useful for context, but source coverage is not complete enough to raise confidence."
  },
  {
    title: "Signals needing review",
    state: "Owner review",
    icon: "shield",
    detail: "Candidate signals need evidence, counter-evidence, and owner review before any public summary."
  },
  {
    title: "Desk disagreement",
    state: "Working",
    icon: "compare",
    detail: "Macro, equity, and options desks disagree on source quality and event-window interpretation."
  },
  {
    title: "Open questions",
    state: "Incomplete",
    icon: "search",
    detail: "Missing source packets and counter-evidence stay visible instead of hiding behind a confidence score."
  }
] as const;

const tradingSignals = [
  {
    instrument: "Index basket",
    thesis: "Macro and breadth evidence are mixed; hold for source confirmation before forming a view.",
    posture: "Watch",
    confidence: "Low",
    horizon: "Intraday to swing",
    evidence: 4,
    counterEvidence: 3,
    updated: "Today",
    desk: "Macro Desk",
    sourceHealth: "Partial",
    state: "Needs evidence",
    blocker: "Macro calendar and breadth packet need a second-source check."
  },
  {
    instrument: "Large-cap AI basket",
    thesis: "Momentum is visible, but valuation and news-source checks are not complete.",
    posture: "No view",
    confidence: "Low",
    horizon: "Multi-day",
    evidence: 3,
    counterEvidence: 4,
    updated: "Today",
    desk: "Equity Desk",
    sourceHealth: "Degraded",
    state: "Blocked",
    blocker: "Company-level source packet and counter-evidence are incomplete."
  },
  {
    instrument: "Volatility surface sample",
    thesis: "Options scenarios need skew and liquidity evidence before any strategy discussion.",
    posture: "Research",
    confidence: "Medium-low",
    horizon: "Event window",
    evidence: 5,
    counterEvidence: 2,
    updated: "Today",
    desk: "Options Desk",
    sourceHealth: "Partial",
    state: "Owner review",
    blocker: "Skew, term-structure, and liquidity checks are not attached."
  },
  {
    instrument: "Digital asset sample",
    thesis: "Narrative and liquidity signals diverge; treat the packet as context until provenance improves.",
    posture: "Research",
    confidence: "Low",
    horizon: "Event window",
    evidence: 2,
    counterEvidence: 3,
    updated: "Today",
    desk: "Crypto Desk",
    sourceHealth: "Pending",
    state: "Blocked",
    blocker: "Provenance and venue-quality notes are pending."
  }
] as const;

const tradingDesks = [
  {
    name: "Macro Desk",
    focus: "Rates, index context, breadth, macro calendar",
    stance: "Cautious",
    disagreement: "Needs confirmation from News Desk before any signal is promoted.",
    needs: "Second-source macro calendar and breadth context."
  },
  {
    name: "Equity Desk",
    focus: "Company and sector evidence packets",
    stance: "Blocked",
    disagreement: "Momentum evidence conflicts with valuation and source coverage.",
    needs: "Company packet, valuation note, and counter-evidence."
  },
  {
    name: "Options Desk",
    focus: "Volatility scenarios, skew, term structure",
    stance: "Investigating",
    disagreement: "Scenario notes are useful, but liquidity evidence is incomplete.",
    needs: "Skew, term structure, and liquidity checks."
  },
  {
    name: "Risk Desk",
    focus: "Gates, missing evidence, forbidden actions",
    stance: "Owner-gated",
    disagreement: "No signal can move forward while source health is degraded.",
    needs: "Visible blockers and owner review."
  },
  {
    name: "News Desk",
    focus: "Source provenance, news freshness, conflict checks",
    stance: "Degraded",
    disagreement: "News provenance is not strong enough to support a confidence increase.",
    needs: "Freshness and provenance audit."
  },
  {
    name: "Crypto Desk",
    focus: "Digital asset context, liquidity, venue quality",
    stance: "Pending",
    disagreement: "Narrative evidence is weaker than liquidity and provenance blockers.",
    needs: "Venue-quality and source-origin notes."
  },
  {
    name: "Evidence Desk",
    focus: "Evidence links, counter-evidence, replay trace",
    stance: "Required",
    disagreement: "Every signal needs traceable evidence before it can leave review.",
    needs: "Artifact links, counter-evidence, and replay coverage."
  }
] as const;

const tradingSourceHealth = [
  { source: "Market context", state: "Partial", detail: "Enough for summary, not enough for promotion." },
  { source: "Fundamental evidence", state: "Pending", detail: "Company-level source packet is not attached." },
  { source: "Options evidence", state: "Partial", detail: "Scenario notes exist; liquidity checks are missing." },
  { source: "Social/news feed", state: "Degraded", detail: "Treat as unavailable until provenance is verified." }
] as const;

const tradingGates = [
  { label: "Broker write", value: "Disabled", detail: "No broker write path exists in this web surface." },
  { label: "Paper submit", value: "Disabled", detail: "Paper submit is not modeled, linked, or available." },
  { label: "Live submit", value: "Disabled", detail: "Live submit remains outside product scope." },
  { label: "Phase auto-promotion", value: "Disabled", detail: "No signal can promote itself without explicit owner review." },
  { label: "Evidence attached", value: "Incomplete", detail: "Missing evidence is shown as a blocker." },
  { label: "Owner review", value: "Required", detail: "The owner remains the final decision gate for research conclusions." }
] as const;

const tradingOptionsLab = [
  {
    title: "Volatility term structure",
    state: "Partial",
    detail: "Term-structure notes are visible, but the packet is not complete enough for a scenario conclusion.",
    checks: ["Skew missing", "Liquidity pending", "Event window only"]
  },
  {
    title: "Skew scenario",
    state: "Incomplete",
    detail: "Skew research needs counter-evidence and a source-quality note before confidence can rise.",
    checks: ["Counter-evidence required", "No strategy button", "Owner review"]
  },
  {
    title: "Liquidity check",
    state: "Pending",
    detail: "Liquidity context is treated as unavailable until source provenance is confirmed.",
    checks: ["No execution", "No sizing", "No recommendation"]
  }
] as const;

const tradingReplay = [
  {
    time: "09:10",
    desk: "Macro Desk",
    note: "Opened market context with mixed breadth and event risk."
  },
  {
    time: "09:22",
    desk: "Equity Desk",
    note: "Flagged missing company evidence and counter-evidence imbalance."
  },
  {
    time: "09:35",
    desk: "Risk Desk",
    note: "Kept all gates owner-reviewed and execution-disabled."
  },
  {
    time: "09:44",
    desk: "Evidence Desk",
    note: "Marked missing source packets as blockers instead of hiding them behind confidence labels."
  },
  {
    time: "10:02",
    desk: "Options Desk",
    note: "Moved volatility notes into scenario research without creating any execution workflow."
  }
] as const;

const tradingOpenQuestions = [
  "Which source packets are missing or degraded?",
  "What counter-evidence would invalidate the thesis?",
  "Which desk disagrees, and why?",
  "Has the owner reviewed the evidence chain?",
  "Can the public summary be written without private watchlists, accounts, or raw artifacts?"
] as const;

const tradingSystemStatus = [
  {
    label: "Research artifact availability",
    state: "Partial",
    detail: "Sample packets are present for UI review; live private research artifacts are not mounted into this build."
  },
  {
    label: "Source health model",
    state: "Working",
    detail: "Signals surface degraded and pending sources directly instead of compressing them into a single score."
  },
  {
    label: "Execution boundary",
    state: "Disabled",
    detail: "No broker, paper, live, sizing, order, or recommendation controls are present."
  }
] as const;

const tradingUnavailableActions = [
  "Order placement",
  "Broker write",
  "Paper submit",
  "Live submit",
  "Replace or cancel order",
  "Auto-promote phase",
  "Recommendation workflow"
] as const;

export const privateTradingResearchData = {
  disclaimer: tradingResearchDisclaimer,
  views: tradingViews,
  status: tradingTeamStatus,
  todayFocus: tradingTodayFocus,
  signals: tradingSignals,
  desks: tradingDesks,
  sourceHealth: tradingSourceHealth,
  gates: tradingGates,
  optionsLab: tradingOptionsLab,
  replay: tradingReplay,
  openQuestions: tradingOpenQuestions,
  systemStatus: tradingSystemStatus,
  unavailableActions: tradingUnavailableActions
} as const satisfies TradingResearchCockpitData;
