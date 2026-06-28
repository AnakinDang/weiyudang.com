export const tradingResearchDisclaimer = "Research-only. Not an order, recommendation, or execution system.";

export const tradingResearchViews = [
  "Today",
  "Signals",
  "Desks",
  "Instruments",
  "Options Lab",
  "Evidence",
  "Replay",
  "System"
] as const;

export type TradingView = (typeof tradingResearchViews)[number];

export const tradingViewSlugs = {
  Today: "today",
  Signals: "signals",
  Desks: "desks",
  Instruments: "instruments",
  "Options Lab": "options",
  Evidence: "evidence",
  Replay: "replay",
  System: "system"
} as const satisfies Record<TradingView, string>;

const tradingViewSlugAliases: Record<string, TradingView> = {
  today: "Today",
  signals: "Signals",
  desks: "Desks",
  instruments: "Instruments",
  options: "Options Lab",
  "options-lab": "Options Lab",
  evidence: "Evidence",
  gates: "Evidence",
  "gates-evidence": "Evidence",
  replay: "Replay",
  system: "System",
  "system-status": "System"
};

export function tradingViewFromSlug(value: string | null | undefined): TradingView | undefined {
  if (!value) {
    return undefined;
  }

  return tradingViewSlugAliases[value.trim().toLowerCase()];
}

export function tradingViewSlugFromParam(value: string | null | undefined) {
  const view = tradingViewFromSlug(value);
  return view ? tradingViewSlugs[view] : undefined;
}

export function tradingConsoleHref(view: TradingView = "Today") {
  const slug = tradingViewSlugs[view];
  const query = view === "Today" ? "" : `?view=${slug}`;

  return `/app/trading${query}`;
}

export type TradingSignal = {
  instrument: string;
  thesis: string;
  posture: string;
  confidence: string;
  horizon: string;
  evidence: number;
  counterEvidence: number;
  updated: string;
  desk: string;
  sourceHealth: string;
  state: string;
  blocker: string;
};

export type TradingInstrument = {
  symbol: string;
  label: string;
  desk: string;
  posture: string;
  confidence: string;
  sourceHealth: string;
  lastUpdated: string;
  summary: string;
  signalHistory: readonly {
    time: string;
    state: string;
    note: string;
  }[];
  evidenceTimeline: readonly {
    time: string;
    label: string;
    state: string;
    detail: string;
  }[];
  sourceQuality: readonly {
    source: string;
    state: string;
    detail: string;
  }[];
  riskFlags: readonly string[];
};

export type TradingEvidencePacket = {
  id: string;
  title: string;
  instrument: string;
  source: string;
  provenance: string;
  state: string;
  quality: string;
  linkedSignal: string;
  appliesToSignals: readonly string[];
  blocker: string;
  updated: string;
  checks: readonly string[];
};

export type TradingResearchCockpitData = {
  disclaimer: string;
  views: readonly TradingView[];
  status: {
    mode: string;
    phase: string;
    posture: string;
    lastUpdated: string;
  };
  todayFocus: readonly {
    title: string;
    state: string;
    icon: "alert" | "shield" | "compare" | "search";
    detail: string;
  }[];
  signals: readonly TradingSignal[];
  desks: readonly {
    name: string;
    focus: string;
    stance: string;
    disagreement: string;
    needs: string;
  }[];
  instruments: readonly TradingInstrument[];
  sourceHealth: readonly {
    source: string;
    state: string;
    detail: string;
  }[];
  evidencePackets: readonly TradingEvidencePacket[];
  gates: readonly {
    label: string;
    value: string;
    detail: string;
  }[];
  optionsLab: readonly {
    title: string;
    state: string;
    detail: string;
    checks: readonly string[];
  }[];
  replay: readonly {
    time: string;
    desk: string;
    instrument: string;
    evidenceState: string;
    state: string;
    change: string;
    note: string;
  }[];
  openQuestions: readonly string[];
  systemStatus: readonly {
    label: string;
    state: string;
    detail: string;
  }[];
  unavailableActions: readonly string[];
};
