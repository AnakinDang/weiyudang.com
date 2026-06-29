import { tradingViewSlugs, type TradingView } from "@/lib/trading-team";

export const ALL_SIGNAL_FILTER = "__all_signals__";
export const ALL_STATE_FILTER = "All states";
export const ALL_DESK_FILTER = "All desks";
export const ALL_INSTRUMENT_FILTER = "All instruments";
export const ALL_EVIDENCE_FILTER = "All evidence";

export const EVIDENCE_SIGNAL_PARAM = "signal";
export const EVIDENCE_STATE_PARAM = "evidence_state";
export const REPLAY_DESK_PARAM = "replay_desk";
export const REPLAY_INSTRUMENT_PARAM = "instrument";
export const REPLAY_INSTRUMENT_LEGACY_PARAM = "replay_instrument";
export const REPLAY_EVIDENCE_PARAM = "replay_evidence";
export const TRADING_REVIEW_PACKET_PARAM = "review_packet";

export const tradingTraceParams = [
  EVIDENCE_SIGNAL_PARAM,
  EVIDENCE_STATE_PARAM,
  REPLAY_DESK_PARAM,
  REPLAY_INSTRUMENT_PARAM,
  REPLAY_INSTRUMENT_LEGACY_PARAM,
  REPLAY_EVIDENCE_PARAM
] as const;

export type TradingSearchUpdater = (params: URLSearchParams) => void;

export type TradingTraceContext = {
  readonly reviewPacketId?: string;
};

export type TradingTraceTokenLookup = {
  readonly tokenToValue: ReadonlyMap<string, string>;
  readonly valueToToken: ReadonlyMap<string, string>;
  readonly values: ReadonlySet<string>;
};

export type TradingTraceParamStatus = "missing" | "token" | "legacy" | "invalid";

export type TradingTraceParamResolution = {
  readonly status: TradingTraceParamStatus;
  readonly value: string;
};

export type TradingTraceNoticeKind = "normalized" | "stale" | "removed";

export type TradingTraceNotice = {
  readonly kind: TradingTraceNoticeKind;
  readonly view: TradingView;
};

export function clearTradingTraceParams(params: URLSearchParams) {
  tradingTraceParams.forEach((param) => params.delete(param));
}

export function tradingTraceToken(scope: string, value: string) {
  let hash = 0x811c9dc5;
  const input = `${scope}:${value}`;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return `${scope}_${(hash >>> 0).toString(36).padStart(7, "0")}`;
}

export function createTradingTraceTokenLookup(scope: string, values: readonly string[]): TradingTraceTokenLookup {
  const tokenToValue = new Map<string, string>();
  const valueToToken = new Map<string, string>();
  const uniqueValues = [...new Set(values)];

  uniqueValues.forEach((value) => {
    let token = tradingTraceToken(scope, value);
    let attempt = 0;

    while (tokenToValue.has(token) && tokenToValue.get(token) !== value) {
      attempt += 1;
      token = tradingTraceToken(scope, `${value}:${attempt}`);
    }

    tokenToValue.set(token, value);
    valueToToken.set(value, token);
  });

  return {
    tokenToValue,
    valueToToken,
    values: new Set(uniqueValues)
  };
}

export function setOptionalTradingParam(
  params: URLSearchParams,
  key: string,
  value: string,
  defaultValue: string,
  lookup: TradingTraceTokenLookup
) {
  if (value === defaultValue) {
    params.delete(key);
    return;
  }

  const token = lookup.valueToToken.get(value);

  if (!token) {
    params.delete(key);
    return;
  }

  params.set(key, token);
}

export function evidenceSearchUpdater(
  signalFilter: string,
  stateFilter: string,
  signalLookup: TradingTraceTokenLookup,
  stateLookup: TradingTraceTokenLookup
): TradingSearchUpdater {
  return (params) => {
    setOptionalTradingParam(params, EVIDENCE_SIGNAL_PARAM, signalFilter, ALL_SIGNAL_FILTER, signalLookup);
    setOptionalTradingParam(params, EVIDENCE_STATE_PARAM, stateFilter, ALL_STATE_FILTER, stateLookup);
  };
}

export function replaySearchUpdater(
  deskFilter: string,
  instrumentFilter: string,
  evidenceFilter: string,
  deskLookup: TradingTraceTokenLookup,
  instrumentLookup: TradingTraceTokenLookup,
  evidenceLookup: TradingTraceTokenLookup
): TradingSearchUpdater {
  return (params) => {
    setOptionalTradingParam(params, REPLAY_DESK_PARAM, deskFilter, ALL_DESK_FILTER, deskLookup);
    setOptionalTradingParam(params, REPLAY_INSTRUMENT_PARAM, instrumentFilter, ALL_INSTRUMENT_FILTER, instrumentLookup);
    setOptionalTradingParam(params, REPLAY_EVIDENCE_PARAM, evidenceFilter, ALL_EVIDENCE_FILTER, evidenceLookup);
  };
}

export function traceParamResolution(
  params: URLSearchParams,
  key: string,
  lookup: TradingTraceTokenLookup,
  fallback: string,
  legacyKeys: readonly string[] = []
): TradingTraceParamResolution {
  const paramKeys = [key, ...legacyKeys];
  let sawInvalidValue = false;

  for (const paramKey of paramKeys) {
    if (!params.has(paramKey)) {
      continue;
    }

    const value = params.get(paramKey);
    if (!value) {
      continue;
    }

    const tokenValue = lookup.tokenToValue.get(value);
    if (tokenValue) {
      const status = paramKey === key && !legacyKeys.some((legacyKey) => params.has(legacyKey)) ? "token" : "legacy";
      return { status, value: tokenValue };
    }

    if (lookup.values.has(value)) {
      return { status: "legacy", value };
    }

    sawInvalidValue = true;
  }

  if (sawInvalidValue) {
    return { status: "invalid", value: fallback };
  }

  return { status: "missing", value: fallback };
}

export function traceNoticeForResolutions(
  view: TradingView,
  resolutions: readonly TradingTraceParamResolution[],
  hadCrossViewParams = false
): TradingTraceNotice | null {
  if (resolutions.some((resolution) => resolution.status === "invalid")) {
    return { kind: "stale", view };
  }

  if (resolutions.some((resolution) => resolution.status === "legacy")) {
    return { kind: "normalized", view };
  }

  if (hadCrossViewParams) {
    return { kind: "removed", view };
  }

  return null;
}

function applyTradingTraceContext(params: URLSearchParams, context?: TradingTraceContext) {
  if (context?.reviewPacketId) {
    params.set(TRADING_REVIEW_PACKET_PARAM, context.reviewPacketId);
    return;
  }

  params.delete(TRADING_REVIEW_PACKET_PARAM);
}

export function tradingTraceHref(
  view: TradingView,
  updateSearch?: TradingSearchUpdater,
  basePath = "/app/trading",
  context?: TradingTraceContext
) {
  const params = new URLSearchParams();

  if (view !== "Today") {
    params.set("view", tradingViewSlugs[view]);
  }

  updateSearch?.(params);
  applyTradingTraceContext(params, context);

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function tradingEvidenceTraceHref(
  signalFilter: string,
  stateFilter: string,
  signalLookup: TradingTraceTokenLookup,
  stateLookup: TradingTraceTokenLookup,
  context?: TradingTraceContext
) {
  return tradingTraceHref("Evidence", evidenceSearchUpdater(signalFilter, stateFilter, signalLookup, stateLookup), "/app/trading", context);
}

export function tradingReplayTraceHref(
  deskFilter: string,
  instrumentFilter: string,
  evidenceFilter: string,
  deskLookup: TradingTraceTokenLookup,
  instrumentLookup: TradingTraceTokenLookup,
  evidenceLookup: TradingTraceTokenLookup,
  context?: TradingTraceContext
) {
  return tradingTraceHref(
    "Replay",
    replaySearchUpdater(deskFilter, instrumentFilter, evidenceFilter, deskLookup, instrumentLookup, evidenceLookup),
    "/app/trading",
    context
  );
}

export function tradingSystemTraceHref(context?: TradingTraceContext) {
  return tradingTraceHref("System", undefined, "/app/trading", context);
}
