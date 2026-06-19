export const tradingResearchDisclaimer = "Research-only. Not an order, recommendation, or execution system.";

export type TradingView = "Today" | "Signals" | "Desks" | "Options Lab" | "Evidence" | "Replay" | "System";

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
  sourceHealth: readonly {
    source: string;
    state: string;
    detail: string;
  }[];
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
