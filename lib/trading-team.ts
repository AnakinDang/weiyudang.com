export const tradingResearchDisclaimer = "Research-only. Not an order, recommendation, or execution system.";

export const tradingTeamStatus = {
  mode: "Private research console",
  phase: "Evidence scaffold",
  posture: "Owner review required",
  lastUpdated: "Mock session"
} as const;

export const tradingSignals = [
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
    state: "Needs evidence"
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
    state: "Blocked"
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
    state: "Owner review"
  }
] as const;

export const tradingDesks = [
  {
    name: "Macro Desk",
    focus: "Rates, index context, breadth, macro calendar",
    view: "Cautious",
    disagreement: "Needs confirmation from News Desk before any signal is promoted."
  },
  {
    name: "Equity Desk",
    focus: "Company and sector evidence packets",
    view: "Blocked",
    disagreement: "Momentum evidence conflicts with valuation and source coverage."
  },
  {
    name: "Options Desk",
    focus: "Volatility scenarios, skew, term structure",
    view: "Investigating",
    disagreement: "Scenario notes are useful, but liquidity evidence is incomplete."
  },
  {
    name: "Risk Desk",
    focus: "Gates, missing evidence, forbidden actions",
    view: "Owner-gated",
    disagreement: "No signal can move forward while source health is degraded."
  }
] as const;

export const tradingSourceHealth = [
  { source: "Market context", state: "Partial", detail: "Enough for summary, not enough for promotion." },
  { source: "Fundamental evidence", state: "Pending", detail: "Company-level source packet is not attached." },
  { source: "Options evidence", state: "Partial", detail: "Scenario notes exist; liquidity checks are missing." },
  { source: "Social/news feed", state: "Degraded", detail: "Treat as unavailable until provenance is verified." }
] as const;

export const tradingGates = [
  { label: "Broker write", value: "Disabled", tone: "private" },
  { label: "Paper submit", value: "Disabled", tone: "private" },
  { label: "Live submit", value: "Disabled", tone: "private" },
  { label: "Phase auto-promotion", value: "Disabled", tone: "private" },
  { label: "Evidence attached", value: "Incomplete", tone: "warning" },
  { label: "Owner review", value: "Required", tone: "warning" }
] as const;

export const tradingReplay = [
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
  }
] as const;
