"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Ban,
  BarChart3,
  CheckCircle2,
  Clock3,
  Database,
  ExternalLink,
  FileSearch,
  Gauge,
  GitCompareArrows,
  LineChart,
  LockKeyhole,
  Radio,
  ShieldCheck,
  SlidersHorizontal
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { StatusBadge } from "@/components/StatusBadge";
import { UnavailableControlsPanel } from "@/components/UnavailableControlsPanel";
import { tradingViewFromSlug } from "@/lib/trading-team";
import {
  ALL_DESK_FILTER,
  ALL_EVIDENCE_FILTER,
  ALL_INSTRUMENT_FILTER,
  ALL_SIGNAL_FILTER,
  ALL_STATE_FILTER,
  EVIDENCE_SIGNAL_PARAM,
  EVIDENCE_STATE_PARAM,
  REPLAY_DESK_PARAM,
  REPLAY_EVIDENCE_PARAM,
  REPLAY_INSTRUMENT_LEGACY_PARAM,
  REPLAY_INSTRUMENT_PARAM,
  createTradingTraceTokenLookup,
  evidenceSearchUpdater,
  replaySearchUpdater,
  traceNoticeForResolutions,
  traceParamResolution,
  tradingTraceHref,
  tradingTraceParams,
  type TradingSearchUpdater,
  type TradingTraceNotice
} from "@/lib/trading-trace";
import type {
  TradingEvidencePacket,
  TradingInstrument,
  TradingResearchCockpitData,
  TradingSignal,
  TradingView
} from "@/lib/trading-team";
import { translateToZh, type SiteLocale } from "@/lib/site-i18n";

type TradingTodayFocus = TradingResearchCockpitData["todayFocus"][number];
type TradingDesk = TradingResearchCockpitData["desks"][number];
type TradingSource = TradingResearchCockpitData["sourceHealth"][number];
type TradingGate = TradingResearchCockpitData["gates"][number];
type TradingOptionsScenario = TradingResearchCockpitData["optionsLab"][number];
type TradingReplayEvent = TradingResearchCockpitData["replay"][number];
type TradingSystemStatusItem = TradingResearchCockpitData["systemStatus"][number];
type StatusTone = "normal" | "info" | "warning" | "private" | "danger";
type TradingReviewQueueItem = {
  id: string;
  title: string;
  state: string;
  source: string;
  detail: string;
  actionLabel: "Open evidence" | "Review gate" | "Open system" | "Open replay";
  action: "evidence" | "replay" | "system";
  signalFilter?: string;
  evidenceStateFilter?: string;
  replayInstrumentFilter?: string;
  replayEvidenceFilter?: string;
};

const viewIcons = {
  Today: Gauge,
  Signals: LineChart,
  Desks: GitCompareArrows,
  Instruments: SlidersHorizontal,
  "Options Lab": BarChart3,
  Evidence: FileSearch,
  Replay: Clock3,
  System: Radio
} as const satisfies Record<TradingView, typeof Gauge>;

const DEFAULT_TRADING_VIEW: TradingView = "Today";

const viewZhLabels = {
  Today: "今日",
  Signals: "信号",
  Desks: "研究台",
  Instruments: "标的",
  "Options Lab": "期权研究室",
  Evidence: "证据",
  Replay: "回放",
  System: "系统"
} as const satisfies Record<TradingView, string>;

const deskZhLabels = {
  "All desks": "全部研究台",
  "Macro Desk": "宏观研究台",
  "Equity Desk": "股票研究台",
  "Options Desk": "期权研究台",
  "Risk Desk": "风险研究台",
  "News Desk": "新闻研究台",
  "Crypto Desk": "数字资产研究台",
  "Evidence Desk": "证据研究台"
} as const satisfies Record<string, string>;

const stateZhLabels: Record<string, string> = {
  "All states": "全部状态",
  Attached: "已附加",
  Blocked: "阻塞",
  Cautious: "谨慎",
  Clear: "清晰",
  Degraded: "降级",
  Disabled: "已禁用",
  Healthy: "健康",
  High: "高",
  Hold: "保持",
  Incomplete: "不完整",
  Investigating: "调查中",
  Low: "低",
  Medium: "中",
  "Medium-low": "中低",
  "Needs counter-evidence": "需要反证",
  "Needs evidence": "需要证据",
  "No view": "暂无观点",
  Opened: "已打开",
  "Open blockers": "开放阻塞点",
  "Owner gated": "本人把关",
  "Owner review": "本人审核",
  "Owner-gated": "本人把关",
  Partial: "部分完成",
  Pending: "待处理",
  Required: "必需",
  Research: "研究",
  Scenario: "情景研究",
  "Scenario research": "情景研究",
  Watch: "观察",
  Working: "工作中"
};

function labelForLocale(value: string, locale: SiteLocale, labels: Record<string, string>) {
  return locale === "zh" ? labels[value] ?? translateToZh(value) ?? value : value;
}

function viewLabel(view: TradingView, locale: SiteLocale) {
  return locale === "zh" ? viewZhLabels[view] : view;
}

function deskLabel(desk: string, locale: SiteLocale) {
  return labelForLocale(desk, locale, deskZhLabels);
}

function stateLabel(state: string, locale: SiteLocale) {
  return labelForLocale(state, locale, stateZhLabels);
}

function actionLabel(action: string, locale: SiteLocale) {
  return labelForLocale(action, locale, {});
}

function gateLabel(gate: string, locale: SiteLocale) {
  return labelForLocale(gate, locale, {});
}

function reviewActionAriaLabel(item: TradingReviewQueueItem, locale: SiteLocale) {
  if (locale === "zh") {
    return `${translateToZh(item.actionLabel) ?? item.actionLabel}：${translateToZh(item.title) ?? item.title}`;
  }

  return `${item.actionLabel}: ${item.title}`;
}

function reviewSourceLabel(source: string, locale: SiteLocale) {
  if (locale !== "zh") {
    return source;
  }

  return source
    .split(" · ")
    .map((part) => translateToZh(part) ?? part)
    .join(" · ");
}

function replayTraceAriaLabel(packet: TradingEvidencePacket, locale: SiteLocale) {
  if (locale === "zh") {
    return `打开“${translateToZh(packet.title) ?? packet.title}”的回放追踪`;
  }

  return `Open replay trace for ${packet.title}`;
}

function traceEvidenceAriaLabel(signal: Pick<TradingSignal, "instrument">, locale: SiteLocale) {
  const instrument = locale === "zh" ? translateToZh(signal.instrument) ?? signal.instrument : signal.instrument;
  return locale === "zh" ? `追溯${instrument}的证据` : `Trace evidence for ${signal.instrument}`;
}

function evidenceCountLabel(visible: number, total: number, locale: SiteLocale) {
  return locale === "zh" ? `已显示 ${visible} / ${total} 个证据包` : `${visible} of ${total} evidence packets shown`;
}

function eventCountLabel(visible: number, total: number, locale: SiteLocale) {
  return locale === "zh" ? `已显示 ${visible} / ${total} 条事件` : `${visible} of ${total} events shown`;
}

function reviewItemCountLabel(count: number, locale: SiteLocale) {
  if (locale === "zh") {
    return `${count} 个待审`;
  }

  return `${count} review ${count === 1 ? "item" : "items"}`;
}

function tradingViewFromLocation() {
  if (typeof window === "undefined") {
    return DEFAULT_TRADING_VIEW;
  }

  const params = new URLSearchParams(window.location.search);
  return tradingViewFromSlug(params.get("view")) ?? DEFAULT_TRADING_VIEW;
}

function traceNoticeTitle(notice: TradingTraceNotice, locale: SiteLocale) {
  if (locale === "zh") {
    if (notice.kind === "stale") return "追踪链接已更新";
    if (notice.kind === "removed") return "已移除无关追踪参数";
    return "追踪链接已标准化";
  }

  if (notice.kind === "stale") return "Trace link updated";
  if (notice.kind === "removed") return "Out-of-view trace filters removed";
  return "Trace link normalized";
}

function traceNoticeDetail(notice: TradingTraceNotice, locale: SiteLocale) {
  const view = viewLabel(notice.view, locale);

  if (locale === "zh") {
    if (notice.kind === "stale") {
      return `${view} 中不可用或过期的追踪筛选已被忽略；可用筛选仍保留，链接未显示原始私密值。`;
    }

    if (notice.kind === "removed") {
      return `${view} 不使用的追踪筛选已被清理，避免地址栏保留无关研究上下文。`;
    }

    return `${view} 已读取旧格式追踪链接，并替换为当前的私密短 token。`;
  }

  if (notice.kind === "stale") {
    return `${view} ignored unavailable or expired trace filters; available filters stayed applied and raw private values are not shown in the URL.`;
  }

  if (notice.kind === "removed") {
    return `${view} removed trace filters that do not apply to this view, keeping unrelated research context out of the address bar.`;
  }

  return `${view} read an older trace link and replaced it with current private short tokens.`;
}

function tradingViewUrl(view: TradingView, updateSearch?: TradingSearchUpdater) {
  if (typeof window === "undefined") {
    return tradingTraceHref(view, updateSearch);
  }

  const url = new URL(window.location.href);
  const nextHref = tradingTraceHref(view, updateSearch, url.pathname);
  const nextUrl = new URL(nextHref, url.origin);

  return `${nextUrl.pathname}${nextUrl.search}${url.hash}`;
}

function currentTradingUrl() {
  if (typeof window === "undefined") {
    return "";
  }

  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function replaceTradingUrlIfChanged(view: TradingView, updateSearch?: TradingSearchUpdater) {
  if (typeof window === "undefined") {
    return false;
  }

  const nextUrl = tradingViewUrl(view, updateSearch);

  if (nextUrl !== currentTradingUrl()) {
    window.history.replaceState(null, "", nextUrl);
    return true;
  }

  return false;
}

function useTradingViewRoute(initialView: TradingView = DEFAULT_TRADING_VIEW) {
  const [activeView, setActiveView] = useState<TradingView>(initialView);

  useEffect(() => {
    function syncFromLocation() {
      const nextView = tradingViewFromLocation();
      setActiveView((currentView) => (currentView === nextView ? currentView : nextView));
    }

    syncFromLocation();
    window.addEventListener("popstate", syncFromLocation);
    return () => window.removeEventListener("popstate", syncFromLocation);
  }, []);

  const writeTradingViewRoute = useCallback(
    (view: TradingView, updateSearch: TradingSearchUpdater | undefined, mode: "push" | "replace") => {
      setActiveView(view);

      if (typeof window === "undefined") {
        return;
      }

      const nextUrl = tradingViewUrl(view, updateSearch);
      const currentUrl = currentTradingUrl();

      if (nextUrl !== currentUrl) {
        // Keep research view changes in browser history so Back returns to the previously inspected desk view.
        window.history[mode === "push" ? "pushState" : "replaceState"](null, "", nextUrl);
      }
    },
    []
  );

  const navigateTradingView = useCallback(
    (view: TradingView, updateSearch?: TradingSearchUpdater) => writeTradingViewRoute(view, updateSearch, "push"),
    [writeTradingViewRoute]
  );
  const replaceTradingView = useCallback(
    (view: TradingView, updateSearch?: TradingSearchUpdater) => writeTradingViewRoute(view, updateSearch, "replace"),
    [writeTradingViewRoute]
  );

  return [activeView, navigateTradingView, replaceTradingView] as const;
}

function sourceTone(state: string): StatusTone {
  if (state === "Disabled") {
    return "private";
  }

  if (state === "Blocked") {
    return "danger";
  }

  if (state === "Degraded" || state === "Pending" || state === "Incomplete" || state === "Partial" || state === "Required") {
    return "warning";
  }

  return "info";
}

function gateTone(value: string): StatusTone {
  if (value === "Disabled") {
    return "private";
  }

  if (value === "Blocked" || value === "Incomplete" || value === "Required") {
    return "warning";
  }

  return "normal";
}

function qualityTone(quality: string): StatusTone {
  if (quality === "Low" || quality === "Medium-low" || quality === "Required") {
    return "warning";
  }

  return "info";
}

function isOpenEvidenceState(state: string) {
  return ["Degraded", "Incomplete", "Partial", "Pending", "Required"].includes(state);
}

function isDegradedSourceState(state: string) {
  return state !== "Working" && state !== "Healthy";
}

function isGateBlocker(gate: TradingGate) {
  return gate.value !== "Clear" && gate.value !== "Working" && gate.value !== "Healthy";
}

function confidenceTone(confidence: string): StatusTone {
  if (confidence === "Low" || confidence === "Medium-low") {
    return "warning";
  }

  if (confidence === "High") {
    return "normal";
  }

  return "info";
}

function sourceDotClass(state: string) {
  if (state === "Working" || state === "Healthy") {
    return "is-normal";
  }

  if (state === "Disabled") {
    return "is-private";
  }

  return "is-warning";
}

function tradingPosture(data: TradingResearchCockpitData) {
  const degradedSourceCount = data.sourceHealth.filter((source) => isDegradedSourceState(source.state)).length;
  const gateBlockerCount = data.gates.filter(isGateBlocker).length;
  const systemReviewCount = data.systemStatus.filter((item) => item.state !== "Working" && item.state !== "Healthy").length;
  const hasDanger = data.gates.some((gate) => gate.value === "Blocked") || data.systemStatus.some((item) => item.state === "Blocked");
  const hasReviewWork = degradedSourceCount > 0 || gateBlockerCount > 0 || systemReviewCount > 0;

  if (!hasReviewWork) {
    return {
      label: "Research steady",
      detail: data.status.lastUpdated,
      tone: "normal" as const
    };
  }

  return {
    label: data.status.posture,
    detail: `${degradedSourceCount}/${data.sourceHealth.length} sources need review · ${gateBlockerCount} gates unavailable`,
    tone: hasDanger ? ("danger" as const) : ("warning" as const)
  };
}

function replayInstrumentFilterForEvidence(packet: TradingEvidencePacket) {
  return packet.instrument === "ALL" ? ALL_INSTRUMENT_FILTER : packet.instrument;
}

function buildTradingReviewQueue(data: TradingResearchCockpitData): TradingReviewQueueItem[] {
  const signalNames = new Set(data.signals.map((signal) => signal.instrument));
  const evidenceItems = data.evidencePackets.filter((packet) => isOpenEvidenceState(packet.state)).map((packet) => ({
    id: `evidence-${packet.id}`,
    title: packet.title,
    state: packet.state,
    source: `${packet.linkedSignal} · ${packet.source}`,
    detail: packet.blocker,
    actionLabel: "Open evidence" as const,
    action: "evidence" as const,
    signalFilter: signalNames.has(packet.linkedSignal) ? packet.linkedSignal : ALL_SIGNAL_FILTER,
    evidenceStateFilter: packet.state,
    replayInstrumentFilter: replayInstrumentFilterForEvidence(packet),
    replayEvidenceFilter: packet.state
  }));

  const gateItems = data.gates.filter(isGateBlocker).map((gate) => ({
    id: `gate-${gate.label}`,
    title: gate.label,
    state: gate.value,
    source: "Gate status",
    detail: gate.detail,
    actionLabel: "Review gate" as const,
    action: "evidence" as const,
    evidenceStateFilter: ALL_STATE_FILTER
  }));

  const sourceItems = data.sourceHealth.filter((source) => isDegradedSourceState(source.state)).map((source) => ({
    id: `source-${source.source}`,
    title: source.source,
    state: source.state,
    source: "Source health",
    detail: source.detail,
    actionLabel: "Open system" as const,
    action: "system" as const
  }));

  const systemItems = data.systemStatus.filter((item) => isDegradedSourceState(item.state)).map((item) => ({
    id: `system-${item.label}`,
    title: item.label,
    state: item.state,
    source: "System status",
    detail: item.detail,
    actionLabel: "Open system" as const,
    action: "system" as const
  }));

  const replayItems = data.replay
    .filter((event) => isOpenEvidenceState(event.evidenceState) || sourceTone(event.state) !== "info")
    .slice(-2)
    .map((event) => ({
      id: `replay-${event.time}-${event.desk}-${event.instrument}`,
      title: event.change,
      state: event.evidenceState,
      source: `${event.time} · ${event.desk}`,
      detail: event.note,
      actionLabel: "Open replay" as const,
      action: "replay" as const,
      replayInstrumentFilter: event.instrument === "ALL" ? ALL_INSTRUMENT_FILTER : event.instrument,
      replayEvidenceFilter: event.evidenceState
    }));

  const balancedItems = [
    ...evidenceItems.slice(0, 4),
    ...gateItems.slice(0, 2),
    ...sourceItems.slice(0, 1),
    ...systemItems.slice(0, 1),
    ...replayItems.slice(0, 2)
  ];
  const selectedIds = new Set(balancedItems.map((item) => item.id));
  const overflowItems = [...evidenceItems, ...gateItems, ...sourceItems, ...systemItems, ...replayItems].filter(
    (item) => !selectedIds.has(item.id)
  );

  return [...balancedItems, ...overflowItems].slice(0, 9);
}

function SignalCard({
  signal,
  onTraceEvidence
}: {
  signal: TradingSignal;
  onTraceEvidence: (instrument: string) => void;
}) {
  const { locale } = useLanguage();

  return (
    <article className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-white">{signal.instrument}</h3>
          <p className="mt-1 text-xs font-bold uppercase text-yellow-100" data-i18n-skip>
            {deskLabel(signal.desk, locale)}
          </p>
        </div>
        <StatusBadge tone={sourceTone(signal.sourceHealth)}>
          <span data-i18n-skip>{stateLabel(signal.sourceHealth, locale)}</span>
        </StatusBadge>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">{signal.thesis}</p>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-bold uppercase text-slate-400">Confidence</dt>
          <dd className="mt-1 font-semibold text-white" data-i18n-skip>
            {stateLabel(signal.confidence, locale)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase text-slate-400">Evidence</dt>
          <dd className="mt-1 font-semibold text-white">
            {signal.evidence} / {signal.counterEvidence} counter
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase text-slate-400">Horizon</dt>
          <dd className="mt-1 text-slate-300">{signal.horizon}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase text-slate-400">Updated</dt>
          <dd className="mt-1 text-slate-300">{signal.updated}</dd>
        </div>
      </dl>
      <div className="mt-4 rounded-[8px] border border-slate-700 bg-black/15 p-3">
        <p className="text-xs font-bold uppercase text-slate-400">Blocker</p>
        <p className="mt-2 text-sm leading-6 text-slate-300">{signal.blocker}</p>
      </div>
      <button
        type="button"
        className="trading-cockpit-link mt-4"
        aria-label={traceEvidenceAriaLabel(signal, locale)}
        onClick={() => onTraceEvidence(signal.instrument)}
        data-i18n-skip
      >
        {actionLabel("Trace evidence", locale)}
      </button>
    </article>
  );
}

function SignalTable({
  signals,
  onTraceEvidence
}: {
  signals: readonly TradingSignal[];
  onTraceEvidence: (instrument: string) => void;
}) {
  const { locale } = useLanguage();

  return (
    <section className="panel overflow-hidden p-0" aria-labelledby="trading-signals-title">
      <div className="border-b border-slate-700/70 p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-yellow-100">
              <LineChart size={22} aria-hidden />
              <h2 id="trading-signals-title" className="text-2xl font-semibold text-white">
                Signals needing review
              </h2>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Signal rows are research artifacts. They show uncertainty, evidence state, and blockers; they do not
              produce orders or trading recommendations.
            </p>
          </div>
          <StatusBadge tone="warning">Owner review required</StatusBadge>
        </div>
      </div>

      <div className="grid gap-3 p-4 lg:hidden">
        {signals.map((signal) => (
          <SignalCard key={`${signal.instrument}-${signal.desk}`} signal={signal} onTraceEvidence={onTraceEvidence} />
        ))}
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-[780px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-700/70 text-xs font-bold uppercase text-slate-400">
              <th scope="col" className="px-4 py-3">
                Instrument
              </th>
              <th scope="col" className="px-4 py-3">
                Thesis
              </th>
              <th scope="col" className="px-4 py-3">
                Confidence
              </th>
              <th scope="col" className="px-4 py-3">
                Evidence
              </th>
              <th scope="col" className="px-4 py-3">
                Source health
              </th>
              <th scope="col" className="px-4 py-3">
                Desk
              </th>
            </tr>
          </thead>
          <tbody>
            {signals.map((signal) => (
              <tr key={`${signal.instrument}-${signal.desk}`} className="border-b border-slate-800/80 last:border-0">
                <td className="px-4 py-4 align-top">
                  <p className="font-semibold text-white">{signal.instrument}</p>
                  <p className="mt-1 text-xs text-slate-400">{signal.horizon}</p>
                </td>
                <td className="max-w-[20rem] px-4 py-4 align-top text-sm leading-6 text-slate-300">{signal.thesis}</td>
                <td className="px-4 py-4 align-top">
                  <p className="text-sm font-semibold text-white" data-i18n-skip>
                    {stateLabel(signal.confidence, locale)}
                  </p>
                  <p className="mt-1 text-xs text-yellow-100" data-i18n-skip>
                    {stateLabel(signal.state, locale)}
                  </p>
                </td>
                <td className="px-4 py-4 align-top text-sm text-slate-300">
                  <span className="font-semibold text-white">{signal.evidence}</span> evidence
                  <p className="mt-1 text-xs text-slate-400">{signal.counterEvidence} counter</p>
                </td>
                <td className="px-4 py-4 align-top">
                  <StatusBadge tone={sourceTone(signal.sourceHealth)}>
                    <span data-i18n-skip>{stateLabel(signal.sourceHealth, locale)}</span>
                  </StatusBadge>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{signal.blocker}</p>
                  <button
                    type="button"
                    className="trading-cockpit-link mt-3"
                    aria-label={traceEvidenceAriaLabel(signal, locale)}
                    onClick={() => onTraceEvidence(signal.instrument)}
                    data-i18n-skip
                  >
                    {actionLabel("Trace evidence", locale)}
                  </button>
                </td>
                <td className="px-4 py-4 align-top text-sm text-slate-300">
                  <span data-i18n-skip>{deskLabel(signal.desk, locale)}</span>
                  <p className="mt-1 text-xs text-slate-400">{signal.updated}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SafetyRail({ unavailableActions }: { unavailableActions: readonly string[] }) {
  const { locale } = useLanguage();

  return (
    <aside className="grid content-start gap-4">
      <section className="panel p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-yellow-100">
              <ShieldCheck size={22} aria-hidden />
              <h2 className="text-2xl font-semibold text-white">Research boundary</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">Persistent guardrails for every tab and row.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3">
          {["No broker write", "No account data", "No orders", "Owner review required"].map((rule) => (
            <div key={rule} className="flex gap-3 rounded-[8px] border border-slate-700 bg-white/[0.045] p-3 text-sm leading-6 text-slate-300">
              <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-200" size={17} aria-hidden />
              {rule}
            </div>
          ))}
        </div>
      </section>

      <section className="panel p-5">
        <div className="flex items-center gap-2 text-red-100">
          <Ban size={18} aria-hidden />
          <h2 className="font-semibold text-white">Blocked actions</h2>
        </div>
        <div className="mt-4 grid gap-2">
          {unavailableActions.slice(0, 5).map((action) => (
            <div key={action} className="rounded-[8px] border border-red-300/20 bg-red-300/10 px-3 py-2 text-sm text-red-100">
              <span data-i18n-skip>
                {locale === "zh" ? `${actionLabel(action, locale)}：不可用` : `${action}: unavailable`}
              </span>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}

function DeskDisagreement({ desks }: { desks: readonly TradingDesk[] }) {
  const { locale } = useLanguage();

  return (
    <section className="panel p-5" aria-labelledby="trading-desk-title">
      <div className="flex items-center gap-2">
        <GitCompareArrows className="text-sky-100" size={22} aria-hidden />
        <div>
          <p className="eyebrow">Desk disagreement</p>
          <h2 id="trading-desk-title" className="mt-1 text-2xl font-semibold text-white">
            Different desks, visible uncertainty
          </h2>
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        {desks.map((desk) => (
          <article key={desk.name} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold text-white" data-i18n-skip>
                {deskLabel(desk.name, locale)}
              </h3>
              <span className="text-xs font-bold uppercase text-yellow-100" data-i18n-skip>
                {stateLabel(desk.stance, locale)}
              </span>
            </div>
            <p className="mt-2 text-xs font-semibold uppercase text-slate-400">{desk.focus}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{desk.disagreement}</p>
            <p className="mt-3 rounded-[8px] border border-slate-700 bg-black/15 p-3 text-xs leading-5 text-slate-400">
              Needs: {desk.needs}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SourceDegradation({ sources }: { sources: readonly TradingSource[] }) {
  const { locale } = useLanguage();

  return (
    <section className="panel p-5" aria-labelledby="trading-source-title">
      <div className="flex items-center gap-2">
        <AlertTriangle className="text-yellow-100" size={22} aria-hidden />
        <div>
          <p className="eyebrow">Source degradation</p>
          <h2 id="trading-source-title" className="mt-1 text-2xl font-semibold text-white">
            Missing evidence stays visible
          </h2>
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        {sources.map((source) => (
          <article key={source.source} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-semibold text-white">{source.source}</h3>
              <StatusBadge tone={sourceTone(source.state)}>
                <span data-i18n-skip>{stateLabel(source.state, locale)}</span>
              </StatusBadge>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{source.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function TradingTodayCockpit({
  signals,
  todayFocus,
  desks,
  sourceHealth,
  evidencePackets,
  gates,
  replay,
  openQuestions,
  reviewQueue,
  unavailableActions,
  deskScope,
  onOpenEvidenceQueue,
  onOpenReviewItem,
  onSelectView,
  onTraceEvidence
}: {
  signals: readonly TradingSignal[];
  todayFocus: readonly TradingTodayFocus[];
  desks: readonly TradingDesk[];
  sourceHealth: readonly TradingSource[];
  evidencePackets: readonly TradingEvidencePacket[];
  gates: readonly TradingGate[];
  replay: readonly TradingReplayEvent[];
  openQuestions: readonly string[];
  reviewQueue: readonly TradingReviewQueueItem[];
  unavailableActions: readonly string[];
  deskScope: string;
  onOpenEvidenceQueue: () => void;
  onOpenReviewItem: (item: TradingReviewQueueItem) => void;
  onSelectView: (view: TradingView) => void;
  onTraceEvidence: (instrument: string) => void;
}) {
  const { locale } = useLanguage();
  const degradedSources = sourceHealth.filter((source) => isDegradedSourceState(source.state));
  const openEvidencePackets = evidencePackets.filter((packet) => isOpenEvidenceState(packet.state));
  const gateBlockers = gates.filter(isGateBlocker);
  const topSignals = signals.slice(0, 5);
  const disagreementDesks = desks.slice(0, 5);
  const replayEvents = replay.slice(-5);
  const reviewItems = reviewQueue.slice(0, 3);
  const visibleOpenQuestions = openQuestions.slice(0, 3);
  const primaryReviewItem = reviewQueue[0];
  const primaryEvidencePacket = openEvidencePackets[0];
  const primaryGateBlocker = gateBlockers[0];
  const primarySource = degradedSources[0] ?? sourceHealth[0];
  const primaryQuestion = visibleOpenQuestions[0];
  const evidencePressure = openEvidencePackets.length;
  const primarySourceState = primarySource ? primarySource.state : "Empty";
  const primaryQuestionDetail =
    locale === "zh"
      ? primaryQuestion
        ? "先查看最新回放追踪，再改变任何研究姿态。"
        : "当前没有未解决的开放问题；最新回放仅用于保持研究上下文。"
      : primaryQuestion
        ? "Review the latest replay trace before changing any research posture."
        : "No open questions are unresolved in this research session.";
  const runwayCards = [
    {
      key: "review",
      eyebrow: "Owner review",
      value: reviewQueue.length.toString(),
      title: primaryReviewItem?.title ?? "Review queue clear",
      detail: primaryReviewItem?.detail ?? "No owner-only review blockers are open in this session.",
      state: primaryReviewItem?.state ?? "Clear",
      tone: reviewQueue.length > 0 ? ("warning" as const) : ("normal" as const),
      actionLabel: primaryReviewItem?.actionLabel ?? "Open evidence",
      actionAriaLabel: primaryReviewItem
        ? reviewActionAriaLabel(primaryReviewItem, locale)
        : locale === "zh"
          ? "打开证据队列"
          : "Open evidence queue",
      onClick: primaryReviewItem ? () => onOpenReviewItem(primaryReviewItem) : onOpenEvidenceQueue
    },
    {
      key: "evidence",
      eyebrow: "Evidence blockers",
      value: evidencePressure.toString(),
      title: primaryEvidencePacket?.title ?? "Evidence runway clear",
      detail:
        primaryEvidencePacket?.blocker ??
        (primaryGateBlocker
          ? locale === "zh"
            ? `门禁仍阻塞：${gateLabel(primaryGateBlocker.label, locale)}。`
            : `Gate still blocked: ${primaryGateBlocker.label}.`
          : "No open evidence blockers in the owner-only research queue."),
      state: primaryEvidencePacket?.state ?? "Clear",
      tone: evidencePressure > 0 ? ("warning" as const) : ("normal" as const),
      actionLabel: "Open evidence center",
      actionAriaLabel: locale === "zh" ? "打开证据中心" : "Open evidence center",
      onClick: onOpenEvidenceQueue
    },
    {
      key: "sources",
      eyebrow: "Source posture",
      value: sourceHealth.length > 0 ? `${degradedSources.length}/${sourceHealth.length}` : "0",
      title: primarySource?.source ?? "Source model empty",
      detail: primarySource?.detail ?? "No source health rows are attached to this owner-only session.",
      state: primarySourceState,
      tone: primarySource ? sourceTone(primarySource.state) : ("info" as const),
      actionLabel: "Review source health",
      actionAriaLabel: locale === "zh" ? "查看来源健康" : "Review source health",
      onClick: () => onSelectView("System")
    },
    {
      key: "question",
      eyebrow: "Next question",
      value: visibleOpenQuestions.length.toString(),
      title: primaryQuestion ?? "No open question",
      detail: primaryQuestionDetail,
      state: visibleOpenQuestions.length > 0 ? "Owner review" : "Clear",
      tone: visibleOpenQuestions.length > 0 ? ("warning" as const) : ("normal" as const),
      actionLabel: "Open replay center",
      actionAriaLabel: locale === "zh" ? "打开回放中心" : "Open replay center",
      onClick: () => onSelectView("Replay")
    }
  ];

  const metrics = [
    {
      label: "Signals needing review",
      value: signals.length.toString(),
      detail:
        locale === "zh"
          ? `${signals.filter((signal) => sourceTone(signal.sourceHealth) !== "info").length} 个信号需要来源复核`
          : `${signals.filter((signal) => sourceTone(signal.sourceHealth) !== "info").length} need source review`,
      source:
        locale === "zh"
          ? `来自 ${deskLabel(deskScope, locale)} 信号行`
          : `Counted from ${deskScope} signal rows`
    },
    {
      label: "Evidence packets",
      value: evidencePackets.length.toString(),
      detail: locale === "zh" ? `${openEvidencePackets.length} 个开放阻塞点` : `${openEvidencePackets.length} open blockers`,
      source: locale === "zh" ? "全部研究台 · 证据包" : "All desks · evidence packets"
    },
    {
      label: "Gates blocked",
      value: gateBlockers.length.toString(),
      detail: locale === "zh" ? `${unavailableActions.length} 个动作不可用` : `${unavailableActions.length} unavailable actions`,
      source: locale === "zh" ? "全部研究台 · 已禁用门禁" : "All desks · disabled gates"
    },
    {
      label: "Source degradation",
      value: `${degradedSources.length}/${sourceHealth.length}`,
      detail: locale === "zh" ? "置信度上升前保持可见" : "visible before confidence rises",
      source: locale === "zh" ? "全部研究台 · 来源健康" : "All desks · source health"
    },
    {
      label: "Replay events",
      value: replay.length.toString(),
      detail: locale === "zh" ? "研究状态变化" : "research state changes",
      source: locale === "zh" ? "全部研究台 · 回放追踪" : "All desks · replay trace"
    }
  ];

  return (
    <div className="trading-today-cockpit">
      <section className="trading-today-focus-card" aria-labelledby="trading-today-focus-title">
        <div className="trading-today-card-head">
          <div>
            <p>Today</p>
            <h2 id="trading-today-focus-title">What matters today</h2>
          </div>
          <StatusBadge tone="warning">Owner review</StatusBadge>
        </div>
        <div className="trading-today-focus-list">
          {todayFocus.slice(0, 4).map((item) => (
            <article key={item.title}>
              <span />
              <div>
                <strong>{item.title}</strong>
                <small>{item.detail}</small>
              </div>
              <StatusBadge tone={sourceTone(item.state)}>
                <span data-i18n-skip>{stateLabel(item.state, locale)}</span>
              </StatusBadge>
            </article>
          ))}
        </div>
        <button type="button" className="trading-cockpit-link" onClick={onOpenEvidenceQueue}>
          Open evidence queue
        </button>
      </section>

      <section className="trading-today-review-runway" aria-labelledby="trading-today-runway-title">
        <div className="trading-today-card-head">
          <div>
            <p>Owner review runway</p>
            <h2 id="trading-today-runway-title">Next research decisions</h2>
          </div>
          <StatusBadge tone={reviewQueue.length > 0 ? "warning" : "normal"}>
            <span data-i18n-skip>{reviewItemCountLabel(reviewQueue.length, locale)}</span>
          </StatusBadge>
        </div>
        <div className="trading-today-runway-grid">
          {runwayCards.map((item) => {
            const itemTitleId = `trading-today-runway-${item.key}-title`;
            const itemTitle = labelForLocale(item.title, locale, {});
            const itemDetail = labelForLocale(item.detail, locale, {});

            return (
              <article key={item.key} aria-labelledby={itemTitleId}>
                <div className="trading-today-runway-topline">
                  <span>{item.eyebrow}</span>
                  <strong>{item.value}</strong>
                </div>
                <h3 id={itemTitleId} title={itemTitle} data-i18n-skip>
                  {itemTitle}
                </h3>
                <p title={itemDetail} data-i18n-skip>
                  {itemDetail}
                </p>
                <div className="trading-today-runway-actions">
                  <StatusBadge tone={item.tone}>
                    <span data-i18n-skip>{stateLabel(item.state, locale)}</span>
                  </StatusBadge>
                  <button
                    type="button"
                    className="trading-cockpit-link"
                    onClick={item.onClick}
                    aria-label={item.actionAriaLabel}
                    data-i18n-skip
                  >
                    {labelForLocale(item.actionLabel, locale, {})}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
        <p className="trading-today-runway-boundary">
          Review opens evidence only. No orders, recommendations, broker writes, or execution controls exist here.
        </p>
      </section>

      <section className="trading-today-metrics" aria-label="Trading research cockpit summary">
        {metrics.map((metric) => (
          <article key={metric.label}>
            <p>{metric.label}</p>
            <strong>{metric.value}</strong>
            <span data-i18n-skip>{metric.detail}</span>
            <small data-i18n-skip>{metric.source}</small>
          </article>
        ))}
      </section>

      <section className="trading-today-signal-table" aria-labelledby="trading-today-signals-title">
        <div className="trading-today-card-head">
          <div>
            <p>Signals</p>
            <h2 id="trading-today-signals-title">Signals needing review</h2>
          </div>
          <p className="trading-today-filter-note" data-i18n-skip>
            {locale === "zh"
              ? `显示：${deskLabel(deskScope, locale)} · 证据优先 · 全部主题`
              : `Showing: ${deskScope} · evidence priority · all themes`}
          </p>
        </div>
        <div className="trading-today-table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Desk</th>
                <th scope="col">Instrument / theme</th>
                <th scope="col">Signal</th>
                <th scope="col">Confidence</th>
                <th scope="col">Evidence</th>
                <th scope="col">Gate</th>
              </tr>
            </thead>
            <tbody>
              {topSignals.map((signal) => (
                <tr key={`${signal.instrument}-${signal.desk}`}>
                  <td>
                    <span className="trading-today-desk-dot" aria-hidden />
                    <span data-i18n-skip>{deskLabel(signal.desk, locale)}</span>
                  </td>
                  <td>
                    <strong>{signal.instrument}</strong>
                    <small>{signal.horizon}</small>
                  </td>
                  <td>{signal.thesis}</td>
                  <td>
                    <StatusBadge tone={confidenceTone(signal.confidence)}>
                      <span data-i18n-skip>{stateLabel(signal.confidence, locale)}</span>
                    </StatusBadge>
                  </td>
                  <td>
                    {signal.evidence} / {signal.counterEvidence} counter
                  </td>
                  <td>
                    <StatusBadge tone={sourceTone(signal.sourceHealth)}>
                      <span data-i18n-skip>{stateLabel(signal.sourceHealth, locale)}</span>
                    </StatusBadge>
                    <button
                      type="button"
                      className="trading-cockpit-link mt-2"
                      aria-label={traceEvidenceAriaLabel(signal, locale)}
                      onClick={() => onTraceEvidence(signal.instrument)}
                      data-i18n-skip
                    >
                      {actionLabel("Trace evidence", locale)}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" className="trading-cockpit-link" onClick={() => onSelectView("Signals")}>
          View all signals
        </button>
      </section>

      <section className="trading-today-disagreement" aria-labelledby="trading-today-disagreement-title">
        <div className="trading-today-card-head">
          <div>
            <p>Desks</p>
            <h2 id="trading-today-disagreement-title">Desk disagreement</h2>
          </div>
          <button type="button" className="trading-cockpit-link" onClick={() => onSelectView("Desks")}>
            Full desk view
          </button>
        </div>
        <div className="trading-today-desk-list">
          {disagreementDesks.map((desk) => (
            <article key={desk.name}>
              <div>
                <strong data-i18n-skip>{deskLabel(desk.name, locale)}</strong>
                <small>{desk.focus}</small>
              </div>
              <StatusBadge tone={sourceTone(desk.stance)}>
                <span data-i18n-skip>{stateLabel(desk.stance, locale)}</span>
              </StatusBadge>
              <p>{desk.disagreement}</p>
              <span className="trading-today-desk-need">Needs: {desk.needs}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="trading-today-source-card" aria-labelledby="trading-today-source-title">
        <div className="trading-today-card-head">
          <div>
            <p>Sources</p>
            <h2 id="trading-today-source-title">Source degradation</h2>
          </div>
        </div>
        <div className="trading-today-source-list">
          {sourceHealth.map((source) => (
            <article key={source.source}>
              <span className={`trading-today-source-dot ${sourceDotClass(source.state)}`} aria-hidden />
              <strong>{source.source}</strong>
              <span data-i18n-skip>{stateLabel(source.state, locale)}</span>
            </article>
          ))}
        </div>
        <button type="button" className="trading-cockpit-link" onClick={() => onSelectView("System")}>
          Review source health
        </button>
      </section>

      <section className="trading-today-evidence-card" aria-labelledby="trading-today-evidence-title">
        <div className="trading-today-card-head">
          <div>
            <p>Evidence</p>
            <h2 id="trading-today-evidence-title">Gates & Evidence summary</h2>
          </div>
        </div>
        <div className="trading-today-gate-list">
          {gates.slice(0, 5).map((gate) => (
            <article key={gate.label}>
              <span>{gate.label}</span>
              <StatusBadge tone={gateTone(gate.value)}>
                <span data-i18n-skip>{stateLabel(gate.value, locale)}</span>
              </StatusBadge>
            </article>
          ))}
        </div>
        <button type="button" className="trading-cockpit-link" onClick={onOpenEvidenceQueue}>
          Open evidence center
        </button>
      </section>

      <section className="trading-today-replay-card" aria-labelledby="trading-today-replay-title">
        <div className="trading-today-card-head">
          <div>
            <p>Replay</p>
            <h2 id="trading-today-replay-title">Replay timeline</h2>
          </div>
        </div>
        <ol className="trading-today-replay-line">
          {replayEvents.map((event) => (
            <li key={`${event.time}-${event.desk}-${event.change}`}>
              <span aria-hidden />
              <time>{event.time}</time>
              <strong>{event.change}</strong>
              <small data-i18n-skip>{deskLabel(event.desk, locale)}</small>
            </li>
          ))}
        </ol>
        <button type="button" className="trading-cockpit-link" onClick={() => onSelectView("Replay")}>
          Open replay center
        </button>
      </section>

      <section className="trading-today-review-card" aria-labelledby="trading-today-review-title">
        <div className="trading-today-card-head">
          <div>
            <p>Owner review</p>
            <h2 id="trading-today-review-title">Review queue</h2>
          </div>
          <StatusBadge tone={reviewQueue.length > 0 ? "warning" : "normal"}>
            <span data-i18n-skip>{reviewItemCountLabel(reviewQueue.length, locale)}</span>
          </StatusBadge>
        </div>

        <div className="trading-today-review-list">
          {reviewItems.map((item) => (
            <article key={item.id}>
              <div>
                <small data-i18n-skip>{reviewSourceLabel(item.source, locale)}</small>
                <strong>{item.title}</strong>
              </div>
              <StatusBadge tone={sourceTone(item.state)}>
                <span data-i18n-skip>{stateLabel(item.state, locale)}</span>
              </StatusBadge>
              <button
                type="button"
                className="trading-cockpit-link"
                onClick={() => onOpenReviewItem(item)}
                aria-label={reviewActionAriaLabel(item, locale)}
                data-i18n-skip
              >
                {labelForLocale(item.actionLabel, locale, {})}
              </button>
            </article>
          ))}
          {reviewItems.length === 0 ? (
            <p className="trading-today-review-empty" data-i18n-skip>
              {locale === "zh"
                ? "当前仅本人可见的模拟会话中没有开放的审核项。"
                : "No review items are open in this owner-only mock session."}
            </p>
          ) : null}
        </div>

        <div className="trading-today-open-questions">
          <p>Open questions</p>
          <ul>
            {visibleOpenQuestions.map((question) => (
              <li key={question} data-i18n-skip>
                {labelForLocale(question, locale, {})}
              </li>
            ))}
          </ul>
        </div>
        <button type="button" className="trading-cockpit-link" onClick={() => onSelectView("System")}>
          View system health
        </button>
      </section>
    </div>
  );
}

function InstrumentsView({
  instruments,
  activeInstrument,
  onSelectInstrument,
  unavailableActions
}: {
  instruments: readonly TradingInstrument[];
  activeInstrument: TradingInstrument;
  onSelectInstrument: (symbol: string) => void;
  unavailableActions: readonly string[];
}) {
  const { locale } = useLanguage();

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="grid gap-5">
        <section className="panel overflow-hidden p-0" aria-labelledby="trading-instruments-title">
          <div className="border-b border-slate-700/70 p-5 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sky-100">
                  <FileSearch size={22} aria-hidden />
                  <h2 id="trading-instruments-title" className="text-2xl font-semibold text-white">
                    Instruments
                  </h2>
                </div>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                  Instrument-level research pages show signal history, evidence state, source quality, and risk flags.
                  They never expose accounts, positions, order tickets, or execution controls.
                </p>
              </div>
              <StatusBadge tone="private">Owner-only research</StatusBadge>
            </div>
          </div>

          <div className="grid gap-0 lg:grid-cols-[18rem_minmax(0,1fr)]">
            <nav
              className="grid content-start gap-2 border-b border-slate-700/70 bg-black/10 p-4 lg:border-b-0 lg:border-r"
              aria-label="Instrument research pages"
            >
              {instruments.map((instrument) => {
                const selected = instrument.symbol === activeInstrument.symbol;

                return (
                  <button
                    key={instrument.symbol}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onSelectInstrument(instrument.symbol)}
                    className={`link-focus rounded-[8px] border p-3 text-left transition ${
                      selected
                        ? "border-sky-200/45 bg-sky-300/15 text-white"
                        : "border-slate-700 bg-white/[0.035] text-slate-300 hover:border-sky-200/30 hover:text-white"
                    }`}
                  >
                    <span className="mono block text-xs text-yellow-100">{instrument.symbol}</span>
                    <strong className="mt-2 block text-sm">{instrument.label}</strong>
                    <span className="mt-2 block text-xs text-slate-400" data-i18n-skip>
                      {deskLabel(instrument.desk, locale)}
                    </span>
                  </button>
                );
              })}
            </nav>

            <article className="p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="mono text-xs text-yellow-100">{activeInstrument.symbol}</p>
                  <h3 className="mt-2 text-3xl font-semibold text-white">{activeInstrument.label}</h3>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{activeInstrument.summary}</p>
                </div>
                <div className="grid min-w-[12rem] gap-2 rounded-[8px] border border-slate-700 bg-white/[0.045] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold uppercase text-slate-400">Posture</span>
                    <span className="text-sm font-semibold text-white" data-i18n-skip>
                      {stateLabel(activeInstrument.posture, locale)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold uppercase text-slate-400">Confidence</span>
                    <span className="text-sm font-semibold text-white" data-i18n-skip>
                      {stateLabel(activeInstrument.confidence, locale)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold uppercase text-slate-400">Freshness</span>
                    <span className="text-sm font-semibold text-white">{activeInstrument.lastUpdated}</span>
                  </div>
                  <StatusBadge tone={sourceTone(activeInstrument.sourceHealth)}>
                    <span data-i18n-skip>{stateLabel(activeInstrument.sourceHealth, locale)}</span>
                  </StatusBadge>
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <section aria-labelledby="instrument-history-title">
                  <h4 id="instrument-history-title" className="text-sm font-bold uppercase text-slate-400">
                    Signal history
                  </h4>
                  <div className="mt-3 grid gap-3">
                    {activeInstrument.signalHistory.map((item, index) => (
                      <article key={`${item.time}-${item.state}-${index}`} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="mono text-xs text-yellow-100">{item.time}</p>
                          <StatusBadge tone={sourceTone(item.state)}>
                            <span data-i18n-skip>{stateLabel(item.state, locale)}</span>
                          </StatusBadge>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-300">{item.note}</p>
                      </article>
                    ))}
                  </div>
                </section>

                <section aria-labelledby="instrument-evidence-title">
                  <h4 id="instrument-evidence-title" className="text-sm font-bold uppercase text-slate-400">
                    Evidence timeline
                  </h4>
                  <div className="mt-3 grid gap-3">
                    {activeInstrument.evidenceTimeline.map((item, index) => (
                      <article key={`${item.time}-${item.label}-${index}`} className="rounded-[8px] border border-slate-700 bg-black/15 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="mono text-xs text-yellow-100">{item.time}</p>
                            <h5 className="mt-2 font-semibold text-white">{item.label}</h5>
                          </div>
                          <StatusBadge tone={sourceTone(item.state)}>
                            <span data-i18n-skip>{stateLabel(item.state, locale)}</span>
                          </StatusBadge>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-300">{item.detail}</p>
                      </article>
                    ))}
                  </div>
                </section>
              </div>
            </article>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_0.82fr]">
          <article className="panel p-5" aria-labelledby="instrument-source-title">
            <div className="flex items-center gap-2 text-sky-100">
              <Radio size={22} aria-hidden />
              <h2 id="instrument-source-title" className="text-2xl font-semibold text-white">
                Source quality
              </h2>
            </div>
            <div className="mt-5 grid gap-3">
              {activeInstrument.sourceQuality.map((source) => (
                <div key={source.source} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <strong className="text-white">{source.source}</strong>
                    <StatusBadge tone={sourceTone(source.state)}>
                      <span data-i18n-skip>{stateLabel(source.state, locale)}</span>
                    </StatusBadge>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{source.detail}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="panel p-5" aria-labelledby="instrument-risk-title">
            <div className="flex items-center gap-2 text-yellow-100">
              <AlertTriangle size={22} aria-hidden />
              <h2 id="instrument-risk-title" className="text-2xl font-semibold text-white">
                Risk flags
              </h2>
            </div>
            <div className="mt-5 grid gap-3">
              {activeInstrument.riskFlags.map((flag) => (
                <div key={flag} className="flex gap-3 rounded-[8px] border border-yellow-200/20 bg-yellow-300/10 p-3 text-sm leading-6 text-yellow-50">
                  <AlertTriangle className="mt-0.5 shrink-0" size={16} aria-hidden />
                  {flag}
                </div>
              ))}
            </div>
            <p className="mt-5 rounded-[8px] border border-slate-700 bg-black/15 p-3 text-xs leading-5 text-slate-400">
              Instrument pages can organize research and blockers only. They do not create orders, recommendations,
              account actions, or execution states.
            </p>
          </article>
        </section>
      </div>

      <SafetyRail unavailableActions={unavailableActions} />
    </section>
  );
}

function OptionsLab({ scenarios }: { scenarios: readonly TradingOptionsScenario[] }) {
  const { locale } = useLanguage();

  return (
    <section className="panel p-5" aria-labelledby="trading-options-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <BarChart3 size={22} aria-hidden />
            <h2 id="trading-options-title" className="text-2xl font-semibold text-white">
              Options Lab
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Scenario notes for volatility research only. No strategy execution, no order ticket, and no account context.
          </p>
        </div>
        <StatusBadge tone="private">Research artifact</StatusBadge>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {scenarios.map((scenario) => (
          <article key={scenario.title} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-white">{scenario.title}</h3>
              <StatusBadge tone={sourceTone(scenario.state)}>
                <span data-i18n-skip>{stateLabel(scenario.state, locale)}</span>
              </StatusBadge>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{scenario.detail}</p>
            <div className="mt-4 grid gap-2">
              {scenario.checks.map((check) => (
                <div key={check} className="rounded-[8px] border border-slate-700 bg-black/15 px-3 py-2 text-xs text-slate-300">
                  {check}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReviewQueuePanel({
  items,
  onOpenItem
}: {
  items: readonly TradingReviewQueueItem[];
  onOpenItem: (item: TradingReviewQueueItem) => void;
}) {
  const { locale } = useLanguage();

  return (
    <section className="panel p-5" aria-labelledby="trading-review-queue-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-yellow-100">
            <AlertTriangle size={22} aria-hidden />
            <h2 id="trading-review-queue-title" className="text-2xl font-semibold text-white">
              Review queue
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Owner attention stays attached to evidence, gates, sources, and replay traces. Nothing here can create an
            order or recommendation.
          </p>
        </div>
        <StatusBadge tone={items.length > 0 ? "warning" : "normal"}>
          <span data-i18n-skip>{reviewItemCountLabel(items.length, locale)}</span>
        </StatusBadge>
      </div>

      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase text-slate-400" data-i18n-skip>
                  {reviewSourceLabel(item.source, locale)}
                </p>
                <h3 className="mt-1 font-semibold text-white">{item.title}</h3>
              </div>
              <StatusBadge tone={sourceTone(item.state)}>
                <span data-i18n-skip>{stateLabel(item.state, locale)}</span>
              </StatusBadge>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{item.detail}</p>
            <button
              type="button"
              className="trading-cockpit-link mt-4"
              onClick={() => onOpenItem(item)}
              aria-label={reviewActionAriaLabel(item, locale)}
              data-i18n-skip
            >
              {labelForLocale(item.actionLabel, locale, {})}
            </button>
          </article>
        ))}
        {items.length === 0 ? (
          <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 text-sm leading-6 text-slate-300">
            No review items are open in this owner-only mock session.
          </div>
        ) : null}
      </div>
    </section>
  );
}

function EvidenceView({
  gates,
  evidencePackets,
  sourceHealth,
  signals,
  unavailableActions,
  signalFilter,
  onSignalFilterChange,
  stateFilter,
  onStateFilterChange,
  onClearFilters,
  onFocusEvidencePacket,
  onOpenReplayTrace
}: {
  gates: readonly TradingGate[];
  evidencePackets: readonly TradingEvidencePacket[];
  sourceHealth: readonly TradingSource[];
  signals: readonly TradingSignal[];
  unavailableActions: readonly string[];
  signalFilter: string;
  onSignalFilterChange: (value: string) => void;
  stateFilter: string;
  onStateFilterChange: (value: string) => void;
  onClearFilters: () => void;
  onFocusEvidencePacket: (packet: TradingEvidencePacket) => void;
  onOpenReplayTrace: (instrument: string, evidenceState?: string) => void;
}) {
  const { locale } = useLanguage();
  const signalOptions = useMemo(
    () => [
      { label: "All signals", value: ALL_SIGNAL_FILTER },
      ...signals.map((signal) => ({ label: signal.instrument, value: signal.instrument }))
    ],
    [signals]
  );
  const stateOptions = useMemo(
    () => [ALL_STATE_FILTER, ...new Set(evidencePackets.map((packet) => packet.state))],
    [evidencePackets]
  );
  const filteredEvidence = useMemo(
    () =>
      evidencePackets.filter((packet) => {
        if (signalFilter !== ALL_SIGNAL_FILTER && !packet.appliesToSignals.includes(signalFilter)) {
          return false;
        }

        if (stateFilter !== ALL_STATE_FILTER && packet.state !== stateFilter) {
          return false;
        }

        return true;
      }),
    [evidencePackets, signalFilter, stateFilter]
  );
  const degradedSources = sourceHealth.filter((source) => source.state !== "Working" && source.state !== "Healthy");
  const missingEvidence = evidencePackets.filter((packet) =>
    ["Degraded", "Incomplete", "Partial", "Pending", "Required"].includes(packet.state)
  );
  const filteredMissingEvidence = filteredEvidence.filter((packet) =>
    ["Degraded", "Incomplete", "Partial", "Pending", "Required"].includes(packet.state)
  );
  const openGateBlockers = gates.filter((gate) => ["Blocked", "Incomplete", "Required"].includes(gate.value));
  const hasFilters = signalFilter !== ALL_SIGNAL_FILTER || stateFilter !== ALL_STATE_FILTER;
  const evidenceSummaryKey = `${signalFilter}:${stateFilter}:${filteredEvidence.length}:${hasFilters ? "filtered" : "full"}`;
  const firstReviewPacket = filteredMissingEvidence[0];

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="grid gap-5">
        <article className="panel p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-yellow-100">
                <FileSearch size={22} aria-hidden />
                <h2 className="text-2xl font-semibold text-white">Gates & Evidence</h2>
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                Every important signal needs evidence, counter-evidence, source health, and owner review before
                confidence can rise. Missing packets stay visible as blockers.
              </p>
            </div>
            <StatusBadge tone="warning">Traceable research only</StatusBadge>
          </div>

          <dl className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[8px] border border-slate-700 bg-black/15 p-3">
              <dt className="text-xs font-bold uppercase text-slate-400">Evidence packets</dt>
              <dd className="mt-2 text-2xl font-semibold text-white">{evidencePackets.length}</dd>
            </div>
            <div className="rounded-[8px] border border-slate-700 bg-black/15 p-3">
              <dt className="text-xs font-bold uppercase text-slate-400">Open blockers</dt>
              <dd className="mt-2 text-2xl font-semibold text-white">{missingEvidence.length + openGateBlockers.length}</dd>
            </div>
            <div className="rounded-[8px] border border-slate-700 bg-black/15 p-3">
              <dt className="text-xs font-bold uppercase text-slate-400">Degraded sources</dt>
              <dd className="mt-2 text-2xl font-semibold text-white">{degradedSources.length}</dd>
            </div>
          </dl>

          <div className="mt-5 grid gap-3 rounded-[8px] border border-slate-700 bg-black/15 p-3 md:grid-cols-[1fr_1fr_auto]">
            <label className="grid gap-1.5 text-sm">
              <span className="text-xs font-bold uppercase text-slate-400">Linked signal</span>
              <select
                value={signalFilter}
                onChange={(event) => onSignalFilterChange(event.target.value)}
                className="link-focus rounded-[8px] border border-slate-700 bg-[#08111f] px-3 py-2 text-sm font-semibold text-slate-100"
              >
                {signalOptions.map((signal) => (
                  <option key={signal.value} value={signal.value}>
                    {signal.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="text-xs font-bold uppercase text-slate-400">Evidence state</span>
              <select
                value={stateFilter}
                onChange={(event) => onStateFilterChange(event.target.value)}
                className="link-focus rounded-[8px] border border-slate-700 bg-[#08111f] px-3 py-2 text-sm font-semibold text-slate-100"
              >
                {stateOptions.map((state) => (
                  <option key={state} value={state}>
                    {stateLabel(state, locale)}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={onClearFilters}
              disabled={!hasFilters}
              className="link-focus self-end rounded-[8px] border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-300 transition enabled:hover:border-sky-200/30 enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
            >
              <span data-i18n-skip>{locale === "zh" ? "清除" : "Clear"}</span>
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p key={`count-${evidenceSummaryKey}`} className="text-xs font-bold uppercase text-slate-400" aria-live="polite">
              <span data-i18n-skip>{evidenceCountLabel(filteredEvidence.length, evidencePackets.length, locale)}</span>
            </p>
            <StatusBadge key={`state-${evidenceSummaryKey}`} tone={hasFilters ? "info" : "private"}>
              <span data-i18n-skip>
                {locale === "zh" ? (hasFilters ? "已筛选证据" : "完整追踪") : hasFilters ? "Filtered evidence" : "Full trace"}
              </span>
            </StatusBadge>
          </div>

          <section className="trading-evidence-runway" aria-labelledby="trading-evidence-runway-title">
            <div className="trading-evidence-runway__copy">
              <div className="flex items-center gap-2 text-yellow-100">
                <ShieldCheck size={20} aria-hidden />
                <h3 id="trading-evidence-runway-title">Owner-gated evidence review</h3>
              </div>
              <p>
                This is the private landing point behind Trading MiniDora. Review evidence packets, source health, gate
                state, and replay traces before any research language becomes stronger.
              </p>
            </div>

            <div className="trading-evidence-runway__rail" aria-label="Evidence review posture">
              <article>
                <Database size={17} aria-hidden />
                <span>Visible now</span>
                <strong>{filteredEvidence.length}</strong>
                <small>evidence packets in scope</small>
              </article>
              <article>
                <AlertTriangle size={17} aria-hidden />
                <span>Needs review</span>
                <strong>{filteredMissingEvidence.length}</strong>
                <small>open evidence blockers</small>
              </article>
              <article>
                <GitCompareArrows size={17} aria-hidden />
                <span>Gate pressure</span>
                <strong>{openGateBlockers.length}</strong>
                <small>blocked or incomplete gates</small>
              </article>
            </div>

            <div className="trading-evidence-runway__actions">
              {firstReviewPacket ? (
                <button type="button" className="trading-cockpit-link" onClick={() => onFocusEvidencePacket(firstReviewPacket)}>
                  Focus first blocker
                </button>
              ) : null}
              <button type="button" className="trading-cockpit-link" onClick={onClearFilters} disabled={!hasFilters}>
                Show full trace
              </button>
            </div>
          </section>
        </article>

        <section className="grid gap-3" aria-label="Evidence trace">
          {filteredEvidence.length > 0 ? (
            filteredEvidence.map((packet) => (
              <article key={packet.id} className="panel p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="mono text-xs text-yellow-100">{packet.id}</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{packet.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{packet.provenance}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge tone={sourceTone(packet.state)}>
                      <span data-i18n-skip>{stateLabel(packet.state, locale)}</span>
                    </StatusBadge>
                    <StatusBadge tone={qualityTone(packet.quality)}>
                      <span data-i18n-skip>{stateLabel(packet.quality, locale)}</span>
                    </StatusBadge>
                  </div>
                </div>

                <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-[8px] border border-slate-700 bg-black/15 p-3">
                    <dt className="text-xs font-bold uppercase text-slate-400">Linked signal</dt>
                    <dd className="mt-2 text-sm font-semibold text-white">{packet.linkedSignal}</dd>
                  </div>
                  <div className="rounded-[8px] border border-slate-700 bg-black/15 p-3">
                    <dt className="text-xs font-bold uppercase text-slate-400">Instrument</dt>
                    <dd className="mt-2 text-sm font-semibold text-white">{packet.instrument}</dd>
                  </div>
                  <div className="rounded-[8px] border border-slate-700 bg-black/15 p-3">
                    <dt className="text-xs font-bold uppercase text-slate-400">Source</dt>
                    <dd className="mt-2 text-sm font-semibold text-white">{packet.source}</dd>
                  </div>
                  <div className="rounded-[8px] border border-slate-700 bg-black/15 p-3">
                    <dt className="text-xs font-bold uppercase text-slate-400">Updated</dt>
                    <dd className="mt-2 text-sm font-semibold text-white">{packet.updated}</dd>
                  </div>
                </dl>

                <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_18rem]">
                  <div className="rounded-[8px] border border-yellow-200/20 bg-yellow-300/10 p-3">
                    <p className="text-xs font-bold uppercase text-yellow-100">Blocker</p>
                    <p className="mt-2 text-sm leading-6 text-slate-200">{packet.blocker}</p>
                    <button
                      type="button"
                      className="trading-cockpit-link mt-3"
                      onClick={() => onOpenReplayTrace(replayInstrumentFilterForEvidence(packet), packet.state)}
                      aria-label={replayTraceAriaLabel(packet, locale)}
                      data-i18n-skip
                    >
                      {labelForLocale("Open replay trace", locale, {})}
                    </button>
                  </div>
                  <div className="grid gap-2">
                    {packet.checks.map((check) => (
                      <div key={check} className="rounded-[8px] border border-slate-700 bg-white/[0.045] px-3 py-2 text-xs text-slate-300">
                        {check}
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="panel p-5 text-sm leading-6 text-slate-300">
              No evidence packets match this filter set. Clear filters to return to the full evidence trace.
            </div>
          )}
        </section>

        <section className="panel p-5" aria-labelledby="trading-signal-trace-title">
          <div className="flex items-center gap-2">
            <GitCompareArrows className="text-sky-100" size={22} aria-hidden />
            <div>
              <p className="eyebrow">Signal trace coverage</p>
              <h2 id="trading-signal-trace-title" className="mt-1 text-2xl font-semibold text-white">
                Signals mapped to evidence
              </h2>
            </div>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Packet counts are grouped evidence packets. They complement the raw evidence and counter-evidence counts on
            each signal row.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {signals.map((signal) => {
              const signalSpecificPackets = evidencePackets.filter((packet) => packet.linkedSignal === signal.instrument);
              const sharedPackets = evidencePackets.filter(
                (packet) => packet.linkedSignal !== signal.instrument && packet.appliesToSignals.includes(signal.instrument)
              );

              return (
                <article key={signal.instrument} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-semibold text-white">{signal.instrument}</h3>
                    <StatusBadge tone={signalSpecificPackets.length > 0 ? "info" : "warning"}>
                      <span data-i18n-skip>
                        {locale === "zh" ? `${signalSpecificPackets.length} 个专属` : `${signalSpecificPackets.length} specific`}
                      </span>
                    </StatusBadge>
                  </div>
                  <p className="mt-2 text-xs font-bold uppercase text-slate-400" data-i18n-skip>
                    {locale === "zh"
                      ? `${signalSpecificPackets.length} 个信号专属 · ${sharedPackets.length} 个共享`
                      : `${signalSpecificPackets.length} signal-specific · ${sharedPackets.length} shared`}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{signal.blocker}</p>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      <aside className="grid content-start gap-4">
        <section className="panel p-5" aria-labelledby="trading-evidence-gates-title">
          <div className="flex items-center gap-2 text-yellow-100">
            <ShieldCheck size={22} aria-hidden />
            <h2 id="trading-evidence-gates-title" className="text-2xl font-semibold text-white">
              Gate status
            </h2>
          </div>
          <div className="mt-5 grid gap-3">
            {gates.map((gate) => (
              <article key={gate.label} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-semibold text-white" data-i18n-skip>
                    {gateLabel(gate.label, locale)}
                  </h3>
                  <StatusBadge tone={gateTone(gate.value)}>
                    <span data-i18n-skip>{stateLabel(gate.value, locale)}</span>
                  </StatusBadge>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{gate.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel p-5" aria-labelledby="trading-open-blockers-title">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-yellow-100" size={22} aria-hidden />
            <div>
              <p className="eyebrow">Open blockers</p>
              <h2 id="trading-open-blockers-title" className="mt-1 text-2xl font-semibold text-white">
                Missing evidence
              </h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {filteredMissingEvidence.map((packet) => (
              <div key={packet.id} className="rounded-[8px] border border-yellow-200/20 bg-yellow-300/10 p-3">
                <p className="text-sm font-semibold text-white">{packet.linkedSignal}</p>
                <p className="mt-2 text-xs leading-5 text-slate-300">{packet.blocker}</p>
              </div>
            ))}
            {filteredMissingEvidence.length === 0 ? (
              <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-3 text-sm text-slate-300">
                No missing evidence in this filtered set.
              </div>
            ) : null}
          </div>
        </section>

        <SourceDegradation sources={sourceHealth} />

        <UnavailableControlsPanel
          eyebrow="Blocked actions"
          title="No trading controls"
          items={unavailableActions}
          note="This cockpit can prepare evidence and questions only. It cannot place, submit, replace, cancel, or produce trading recommendations."
        />
      </aside>
    </section>
  );
}

function ReplayView({
  replay,
  openQuestions,
  disclaimer,
  deskFilter,
  onDeskFilterChange,
  instrumentFilter,
  onInstrumentFilterChange,
  evidenceFilter,
  onEvidenceFilterChange,
  onClearFilters
}: {
  replay: readonly TradingReplayEvent[];
  openQuestions: readonly string[];
  disclaimer: string;
  deskFilter: string;
  onDeskFilterChange: (value: string) => void;
  instrumentFilter: string;
  onInstrumentFilterChange: (value: string) => void;
  evidenceFilter: string;
  onEvidenceFilterChange: (value: string) => void;
  onClearFilters: () => void;
}) {
  const { locale } = useLanguage();

  const deskOptions = useMemo(() => [ALL_DESK_FILTER, ...new Set(replay.map((event) => event.desk))], [replay]);
  const instrumentOptions = useMemo(() => [ALL_INSTRUMENT_FILTER, ...new Set(replay.map((event) => event.instrument))], [replay]);
  const evidenceOptions = useMemo(() => [ALL_EVIDENCE_FILTER, ...new Set(replay.map((event) => event.evidenceState))], [replay]);
  const filteredReplay = useMemo(
    () =>
      replay.filter((event) => {
        if (deskFilter !== ALL_DESK_FILTER && event.desk !== deskFilter) {
          return false;
        }

        if (instrumentFilter !== ALL_INSTRUMENT_FILTER && event.instrument !== instrumentFilter) {
          return false;
        }

        if (evidenceFilter !== ALL_EVIDENCE_FILTER && event.evidenceState !== evidenceFilter) {
          return false;
        }

        return true;
      }),
    [deskFilter, evidenceFilter, instrumentFilter, replay]
  );
  const hasFilters =
    deskFilter !== ALL_DESK_FILTER || instrumentFilter !== ALL_INSTRUMENT_FILTER || evidenceFilter !== ALL_EVIDENCE_FILTER;

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <article className="panel p-5">
        <div className="flex items-center gap-2">
          <Clock3 className="text-sky-100" size={22} aria-hidden />
          <div>
            <p className="eyebrow">Replay</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">How the research day formed</h2>
          </div>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          Reconstruct how desks formed or revised a research view. Filters are local-only and never create execution,
          recommendation, or account actions.
        </p>

        <div className="mt-5 grid gap-3 rounded-[8px] border border-slate-700 bg-black/15 p-3 lg:grid-cols-[1fr_1fr_1fr_auto]">
          <label className="grid gap-1.5 text-sm">
            <span className="text-xs font-bold uppercase text-slate-400">Desk</span>
            <select
              value={deskFilter}
              onChange={(event) => onDeskFilterChange(event.target.value)}
              className="link-focus rounded-[8px] border border-slate-700 bg-[#08111f] px-3 py-2 text-sm font-semibold text-slate-100"
            >
              {deskOptions.map((desk) => (
                <option key={desk} value={desk}>
                  {deskLabel(desk, locale)}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="text-xs font-bold uppercase text-slate-400">Instrument</span>
            <select
              value={instrumentFilter}
              onChange={(event) => onInstrumentFilterChange(event.target.value)}
              className="link-focus rounded-[8px] border border-slate-700 bg-[#08111f] px-3 py-2 text-sm font-semibold text-slate-100"
            >
              {instrumentOptions.map((instrument) => (
                <option key={instrument} value={instrument}>
                  {locale === "zh" && instrument === ALL_INSTRUMENT_FILTER ? "全部标的" : instrument}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="text-xs font-bold uppercase text-slate-400">Evidence</span>
            <select
              value={evidenceFilter}
              onChange={(event) => onEvidenceFilterChange(event.target.value)}
              className="link-focus rounded-[8px] border border-slate-700 bg-[#08111f] px-3 py-2 text-sm font-semibold text-slate-100"
            >
              {evidenceOptions.map((evidence) => (
                <option key={evidence} value={evidence}>
                  {locale === "zh" && evidence === ALL_EVIDENCE_FILTER ? "全部证据" : stateLabel(evidence, locale)}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={onClearFilters}
            disabled={!hasFilters}
            className="link-focus self-end rounded-[8px] border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-300 transition enabled:hover:border-sky-200/30 enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
          >
            <span data-i18n-skip>{locale === "zh" ? "清除" : "Clear"}</span>
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase text-slate-400">
            <span data-i18n-skip>{eventCountLabel(filteredReplay.length, replay.length, locale)}</span>
          </p>
          <StatusBadge tone={hasFilters ? "info" : "private"}>
            <span data-i18n-skip>
              {locale === "zh" ? (hasFilters ? "已筛选回放" : "完整回放") : hasFilters ? "Filtered replay" : "Full replay"}
            </span>
          </StatusBadge>
        </div>

        <div className="mt-4 grid gap-3">
          {filteredReplay.length > 0 ? (
            filteredReplay.map((event, index) => (
              <article
                key={`${event.time}-${event.desk}-${event.instrument}-${index}`}
                className="grid gap-4 rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 md:grid-cols-[5rem_minmax(0,1fr)_12rem]"
              >
                <div>
                  <p className="mono text-xs text-yellow-100">{event.time}</p>
                  <p className="mt-2 text-xs font-bold uppercase text-slate-500">{event.instrument}</p>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-white" data-i18n-skip>
                      {deskLabel(event.desk, locale)}
                    </h3>
                    <StatusBadge tone={sourceTone(event.evidenceState)}>
                      <span data-i18n-skip>{stateLabel(event.evidenceState, locale)}</span>
                    </StatusBadge>
                  </div>
                  <p className="mt-2 text-xs font-bold uppercase text-sky-100">{event.change}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{event.note}</p>
                </div>
                <div className="rounded-[8px] border border-slate-700 bg-black/15 p-3">
                  <p className="text-xs font-bold uppercase text-slate-500">State change</p>
                  <p className="mt-2 text-sm font-semibold leading-5 text-white" data-i18n-skip>
                    {stateLabel(event.state, locale)}
                  </p>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-5 text-sm leading-6 text-slate-300">
              No replay events match this filter set. Clear filters to return to the full research day.
            </div>
          )}
        </div>
      </article>

      <aside className="grid content-start gap-4">
        <article className="panel p-5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="text-sky-100" size={22} aria-hidden />
            <div>
              <p className="eyebrow">State changes</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">What changed in view</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {filteredReplay.map((event, index) => (
              <div key={`${event.time}-${event.change}-${index}`} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-3">
                <p className="mono text-xs text-yellow-100">{event.time}</p>
                <p className="mt-2 text-sm font-semibold text-white">{event.change}</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  <span data-i18n-skip>
                    {deskLabel(event.desk, locale)} · {event.instrument}
                  </span>
                </p>
              </div>
            ))}
            {filteredReplay.length === 0 ? (
              <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-3 text-sm text-slate-300">
                No matching state changes.
              </div>
            ) : null}
          </div>
        </article>

        <article className="panel p-5">
          <div className="flex items-center gap-2">
            <FileSearch className="text-sky-100" size={22} aria-hidden />
            <div>
              <p className="eyebrow">Open questions</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">What must be answered</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {openQuestions.map((question) => (
              <div key={question} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 text-sm leading-6 text-slate-300">
                {question}
              </div>
            ))}
          </div>
          <p className="mt-5 rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 p-4 text-sm font-semibold leading-6 text-yellow-50">
            {disclaimer}
          </p>
        </article>
      </aside>
    </section>
  );
}

function SystemView({
  systemStatus,
  sourceHealth,
  gates,
  evidencePackets,
  replay,
  unavailableActions,
  reviewQueue,
  onOpenEvidenceQueue,
  onOpenReplayCenter,
  onOpenReviewItem
}: {
  systemStatus: readonly TradingSystemStatusItem[];
  sourceHealth: readonly TradingSource[];
  gates: readonly TradingGate[];
  evidencePackets: readonly TradingEvidencePacket[];
  replay: readonly TradingReplayEvent[];
  unavailableActions: readonly string[];
  reviewQueue: readonly TradingReviewQueueItem[];
  onOpenEvidenceQueue: () => void;
  onOpenReplayCenter: () => void;
  onOpenReviewItem: (item: TradingReviewQueueItem) => void;
}) {
  const { locale } = useLanguage();
  const degradedSources = sourceHealth.filter((source) => isDegradedSourceState(source.state));
  const gateBlockers = gates.filter(isGateBlocker);
  const openEvidencePackets = evidencePackets.filter((packet) => isOpenEvidenceState(packet.state));
  const latestReplay = replay.slice(-4).reverse();
  const systemMetrics = [
    {
      label: "Open evidence",
      value: openEvidencePackets.length.toString(),
      detail: "Packets with missing, degraded, pending, or required evidence."
    },
    {
      label: "Source issues",
      value: `${degradedSources.length}/${sourceHealth.length}`,
      detail: "Source health that must stay visible before confidence rises."
    },
    {
      label: "Gate blockers",
      value: gateBlockers.length.toString(),
      detail: "Disabled, incomplete, or required gates still blocking promotion."
    },
    {
      label: "Replay coverage",
      value: replay.length.toString(),
      detail: "Trace events available for reconstructing the research day."
    }
  ];

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="grid gap-5">
        <article className="panel p-5" aria-labelledby="trading-system-title">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sky-100">
                <Radio size={22} aria-hidden />
                <h2 id="trading-system-title" className="text-2xl font-semibold text-white">
                  System Status
                </h2>
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                Private system posture summarizes source health, artifact availability, gates, and replay coverage.
                It stays diagnostic and read-only.
              </p>
            </div>
            <StatusBadge tone={reviewQueue.length > 0 ? "warning" : "normal"}>
              <span data-i18n-skip>{reviewItemCountLabel(reviewQueue.length, locale)}</span>
            </StatusBadge>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {systemMetrics.map((metric) => (
              <article key={metric.label} className="rounded-[8px] border border-slate-700 bg-black/15 p-4">
                <p className="text-xs font-bold uppercase text-slate-400">{metric.label}</p>
                <strong className="mt-2 block text-2xl font-semibold text-white">{metric.value}</strong>
                <span className="mt-2 block text-xs leading-5 text-slate-400">{metric.detail}</span>
              </article>
            ))}
          </div>
        </article>

        <section className="grid gap-5 lg:grid-cols-3">
          {systemStatus.map((item) => (
            <article key={item.label} className="panel p-5">
              <div className="flex items-start justify-between gap-3">
                <Gauge className="text-sky-100" size={22} aria-hidden />
                <StatusBadge tone={sourceTone(item.state)}>
                  <span data-i18n-skip>{stateLabel(item.state, locale)}</span>
                </StatusBadge>
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">{item.label}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{item.detail}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="panel p-5" aria-labelledby="trading-system-source-title">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-yellow-100" size={22} aria-hidden />
              <div>
                <p className="eyebrow">Source health</p>
                <h2 id="trading-system-source-title" className="mt-1 text-2xl font-semibold text-white">
                  Degraded sources stay visible
                </h2>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              {sourceHealth.map((source) => (
                <article key={source.source} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <strong className="text-white">{source.source}</strong>
                    <StatusBadge tone={sourceTone(source.state)}>
                      <span data-i18n-skip>{stateLabel(source.state, locale)}</span>
                    </StatusBadge>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{source.detail}</p>
                </article>
              ))}
            </div>
            <button type="button" className="trading-cockpit-link mt-5" onClick={onOpenEvidenceQueue}>
              Open evidence queue
            </button>
          </article>

          <article className="panel p-5" aria-labelledby="trading-system-replay-title">
            <div className="flex items-center gap-2">
              <Clock3 className="text-sky-100" size={22} aria-hidden />
              <div>
                <p className="eyebrow">Replay coverage</p>
                <h2 id="trading-system-replay-title" className="mt-1 text-2xl font-semibold text-white">
                  Latest research state changes
                </h2>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              {latestReplay.map((event) => (
                <article key={`${event.time}-${event.desk}-${event.instrument}`} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="mono text-xs text-yellow-100">{event.time}</p>
                    <StatusBadge tone={sourceTone(event.evidenceState)}>
                      <span data-i18n-skip>{stateLabel(event.evidenceState, locale)}</span>
                    </StatusBadge>
                  </div>
                  <h3 className="mt-2 font-semibold text-white">{event.change}</h3>
                  <p className="mt-1 text-xs font-bold uppercase text-slate-400" data-i18n-skip>
                    {deskLabel(event.desk, locale)} · {event.instrument}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{event.note}</p>
                </article>
              ))}
            </div>
            <button type="button" className="trading-cockpit-link mt-5" onClick={onOpenReplayCenter}>
              Open replay center
            </button>
          </article>
        </section>
      </div>

      <aside className="grid content-start gap-4">
        <ReviewQueuePanel items={reviewQueue} onOpenItem={onOpenReviewItem} />

        <UnavailableControlsPanel
          eyebrow="Blocked actions"
          title="Execution remains unavailable"
          items={unavailableActions}
          note="System status is diagnostic only. It does not expose accounts, positions, broker writes, paper submits, live submits, or order controls."
        />
      </aside>
    </section>
  );
}

export function TradingResearchCockpit({
  data,
  initialView = DEFAULT_TRADING_VIEW
}: {
  data: TradingResearchCockpitData;
  initialView?: TradingView;
}) {
  const { locale } = useLanguage();
  const [activeView, navigateTradingView, replaceTradingView] = useTradingViewRoute(initialView);
  const activeViewButtonRef = useRef<HTMLButtonElement>(null);
  const [activeDesk, setActiveDesk] = useState(ALL_DESK_FILTER);
  const [activeInstrumentSymbol, setActiveInstrumentSymbol] = useState(data.instruments[0]?.symbol ?? "");
  const [evidenceSignalFilter, setEvidenceSignalFilter] = useState(ALL_SIGNAL_FILTER);
  const [evidenceStateFilter, setEvidenceStateFilter] = useState(ALL_STATE_FILTER);
  const [replayDeskFilter, setReplayDeskFilter] = useState(ALL_DESK_FILTER);
  const [replayInstrumentFilter, setReplayInstrumentFilter] = useState(ALL_INSTRUMENT_FILTER);
  const [replayEvidenceFilter, setReplayEvidenceFilter] = useState(ALL_EVIDENCE_FILTER);
  const [traceNotice, setTraceNotice] = useState<TradingTraceNotice | null>(null);

  const deskFilters = useMemo(() => [ALL_DESK_FILTER, ...new Set(data.signals.map((signal) => signal.desk))], [data.signals]);
  const evidenceSignalLookup = useMemo(
    () => createTradingTraceTokenLookup("sig", [ALL_SIGNAL_FILTER, ...data.signals.map((signal) => signal.instrument)]),
    [data.signals]
  );
  // Evidence and Replay intentionally share the "state" token scope so a state token can travel across both views.
  const evidenceStateLookup = useMemo(
    () => createTradingTraceTokenLookup("state", [ALL_STATE_FILTER, ...data.evidencePackets.map((packet) => packet.state)]),
    [data.evidencePackets]
  );
  const replayDeskLookup = useMemo(
    () => createTradingTraceTokenLookup("desk", [ALL_DESK_FILTER, ...data.replay.map((event) => event.desk)]),
    [data.replay]
  );
  const replayInstrumentLookup = useMemo(
    () => createTradingTraceTokenLookup("inst", [ALL_INSTRUMENT_FILTER, ...data.replay.map((event) => event.instrument)]),
    [data.replay]
  );
  // Keep this scope aligned with evidenceStateLookup; param names still distinguish Evidence vs Replay.
  const replayEvidenceLookup = useMemo(
    () => createTradingTraceTokenLookup("state", [ALL_EVIDENCE_FILTER, ...data.replay.map((event) => event.evidenceState)]),
    [data.replay]
  );
  const evidenceUrlUpdater = useCallback(
    (signalFilter: string, stateFilter: string) =>
      evidenceSearchUpdater(signalFilter, stateFilter, evidenceSignalLookup, evidenceStateLookup),
    [evidenceSignalLookup, evidenceStateLookup]
  );
  const replayUrlUpdater = useCallback(
    (deskFilter: string, instrumentFilter: string, evidenceFilter: string) =>
      replaySearchUpdater(
        deskFilter,
        instrumentFilter,
        evidenceFilter,
        replayDeskLookup,
        replayInstrumentLookup,
        replayEvidenceLookup
      ),
    [replayDeskLookup, replayEvidenceLookup, replayInstrumentLookup]
  );
  const filteredSignals = useMemo(
    () => (activeDesk === ALL_DESK_FILTER ? data.signals : data.signals.filter((signal) => signal.desk === activeDesk)),
    [activeDesk, data.signals]
  );
  const activeInstrument = useMemo(
    () => data.instruments.find((instrument) => instrument.symbol === activeInstrumentSymbol) ?? data.instruments[0],
    [activeInstrumentSymbol, data.instruments]
  );
  const posture = useMemo(() => tradingPosture(data), [data]);
  const reviewQueue = useMemo(() => buildTradingReviewQueue(data), [data]);

  useEffect(() => {
    const activeButton = activeViewButtonRef.current;
    const tabStrip = activeButton?.parentElement;

    if (!activeButton || !tabStrip) {
      return;
    }

    const buttonRect = activeButton.getBoundingClientRect();
    const stripRect = tabStrip.getBoundingClientRect();
    const isHorizontallyVisible = buttonRect.left >= stripRect.left && buttonRect.right <= stripRect.right;

    if (!isHorizontallyVisible) {
      activeButton.scrollIntoView({ block: "nearest", inline: "center" });
    }
  }, [activeView]);

  useEffect(() => {
    function syncTraceFiltersFromLocation() {
      const params = new URLSearchParams(window.location.search);
      const nextView = tradingViewFromSlug(params.get("view")) ?? DEFAULT_TRADING_VIEW;

      if (nextView === "Evidence") {
        const signalResolution = traceParamResolution(params, EVIDENCE_SIGNAL_PARAM, evidenceSignalLookup, ALL_SIGNAL_FILTER);
        const evidenceStateResolution = traceParamResolution(params, EVIDENCE_STATE_PARAM, evidenceStateLookup, ALL_STATE_FILTER);
        const hadCrossViewParams =
          params.has(REPLAY_DESK_PARAM) ||
          params.has(REPLAY_INSTRUMENT_PARAM) ||
          params.has(REPLAY_INSTRUMENT_LEGACY_PARAM) ||
          params.has(REPLAY_EVIDENCE_PARAM);
        const nextSignalFilter = signalResolution.value;
        const nextEvidenceState = evidenceStateResolution.value;

        setEvidenceSignalFilter(nextSignalFilter);
        setEvidenceStateFilter(nextEvidenceState);
        replaceTradingUrlIfChanged("Evidence", evidenceUrlUpdater(nextSignalFilter, nextEvidenceState));
        setTraceNotice(traceNoticeForResolutions("Evidence", [signalResolution, evidenceStateResolution], hadCrossViewParams));
        return;
      }

      if (nextView === "Replay") {
        const deskResolution = traceParamResolution(params, REPLAY_DESK_PARAM, replayDeskLookup, ALL_DESK_FILTER);
        const instrumentResolution = traceParamResolution(
          params,
          REPLAY_INSTRUMENT_PARAM,
          replayInstrumentLookup,
          ALL_INSTRUMENT_FILTER,
          [REPLAY_INSTRUMENT_LEGACY_PARAM]
        );
        const replayEvidenceResolution = traceParamResolution(
          params,
          REPLAY_EVIDENCE_PARAM,
          replayEvidenceLookup,
          ALL_EVIDENCE_FILTER
        );
        const hadCrossViewParams = params.has(EVIDENCE_SIGNAL_PARAM) || params.has(EVIDENCE_STATE_PARAM);
        const nextDeskFilter = deskResolution.value;
        const nextInstrumentFilter = instrumentResolution.value;
        const nextEvidenceFilter = replayEvidenceResolution.value;

        setReplayDeskFilter(nextDeskFilter);
        setReplayInstrumentFilter(nextInstrumentFilter);
        setReplayEvidenceFilter(nextEvidenceFilter);
        replaceTradingUrlIfChanged("Replay", replayUrlUpdater(nextDeskFilter, nextInstrumentFilter, nextEvidenceFilter));
        setTraceNotice(
          traceNoticeForResolutions("Replay", [deskResolution, instrumentResolution, replayEvidenceResolution], hadCrossViewParams)
        );
        return;
      }

      if (tradingTraceParams.some((param) => params.has(param))) {
        replaceTradingUrlIfChanged(nextView);
        setTraceNotice({ kind: "removed", view: nextView });
        return;
      }

      setTraceNotice(null);
    }

    syncTraceFiltersFromLocation();
    window.addEventListener("popstate", syncTraceFiltersFromLocation);
    return () => window.removeEventListener("popstate", syncTraceFiltersFromLocation);
  }, [evidenceSignalLookup, evidenceStateLookup, evidenceUrlUpdater, replayDeskLookup, replayEvidenceLookup, replayInstrumentLookup, replayUrlUpdater]);

  function openEvidenceCenter() {
    setTraceNotice(null);
    setEvidenceSignalFilter(ALL_SIGNAL_FILTER);
    setEvidenceStateFilter(ALL_STATE_FILTER);
    navigateTradingView("Evidence");
  }

  function selectTradingView(view: TradingView) {
    setTraceNotice(null);
    navigateTradingView(view);
  }

  function traceEvidenceForSignal(instrument: string) {
    setTraceNotice(null);
    setEvidenceSignalFilter(instrument);
    setEvidenceStateFilter(ALL_STATE_FILTER);
    navigateTradingView("Evidence", evidenceUrlUpdater(instrument, ALL_STATE_FILTER));
  }

  function focusEvidencePacket(packet: TradingEvidencePacket) {
    setTraceNotice(null);
    setEvidenceSignalFilter(packet.linkedSignal);
    setEvidenceStateFilter(packet.state);
    navigateTradingView("Evidence", evidenceUrlUpdater(packet.linkedSignal, packet.state));
  }

  function traceReplayForInstrument(instrument: string, evidenceState = ALL_EVIDENCE_FILTER) {
    setTraceNotice(null);
    const nextInstrument = instrument === "ALL" || instrument === ALL_INSTRUMENT_FILTER ? ALL_INSTRUMENT_FILTER : instrument;
    setReplayDeskFilter(ALL_DESK_FILTER);
    setReplayInstrumentFilter(nextInstrument);
    setReplayEvidenceFilter(evidenceState);
    navigateTradingView("Replay", replayUrlUpdater(ALL_DESK_FILTER, nextInstrument, evidenceState));
  }

  function openReviewQueueItem(item: TradingReviewQueueItem) {
    setTraceNotice(null);

    if (item.action === "evidence") {
      const nextSignalFilter = item.signalFilter ?? ALL_SIGNAL_FILTER;
      const nextEvidenceState = item.evidenceStateFilter ?? ALL_STATE_FILTER;

      setEvidenceSignalFilter(nextSignalFilter);
      setEvidenceStateFilter(nextEvidenceState);
      navigateTradingView("Evidence", evidenceUrlUpdater(nextSignalFilter, nextEvidenceState));
      return;
    }

    if (item.action === "replay") {
      const nextInstrument = item.replayInstrumentFilter ?? ALL_INSTRUMENT_FILTER;
      const nextEvidenceState = item.replayEvidenceFilter ?? ALL_EVIDENCE_FILTER;

      setReplayDeskFilter(ALL_DESK_FILTER);
      setReplayInstrumentFilter(nextInstrument);
      setReplayEvidenceFilter(nextEvidenceState);
      navigateTradingView("Replay", replayUrlUpdater(ALL_DESK_FILTER, nextInstrument, nextEvidenceState));
      return;
    }

    if (activeView !== "System") {
      navigateTradingView("System");
    }
  }

  function changeEvidenceSignalFilter(value: string) {
    setTraceNotice(null);
    setEvidenceSignalFilter(value);

    if (activeView === "Evidence") {
      replaceTradingView("Evidence", evidenceUrlUpdater(value, evidenceStateFilter));
    }
  }

  function changeEvidenceStateFilter(value: string) {
    setTraceNotice(null);
    setEvidenceStateFilter(value);

    if (activeView === "Evidence") {
      replaceTradingView("Evidence", evidenceUrlUpdater(evidenceSignalFilter, value));
    }
  }

  function clearEvidenceFilters() {
    setTraceNotice(null);
    setEvidenceSignalFilter(ALL_SIGNAL_FILTER);
    setEvidenceStateFilter(ALL_STATE_FILTER);

    if (activeView === "Evidence") {
      replaceTradingView("Evidence");
    }
  }

  function changeReplayDeskFilter(value: string) {
    setTraceNotice(null);
    setReplayDeskFilter(value);

    if (activeView === "Replay") {
      replaceTradingView("Replay", replayUrlUpdater(value, replayInstrumentFilter, replayEvidenceFilter));
    }
  }

  function changeReplayInstrumentFilter(value: string) {
    setTraceNotice(null);
    setReplayInstrumentFilter(value);

    if (activeView === "Replay") {
      replaceTradingView("Replay", replayUrlUpdater(replayDeskFilter, value, replayEvidenceFilter));
    }
  }

  function changeReplayEvidenceFilter(value: string) {
    setTraceNotice(null);
    setReplayEvidenceFilter(value);

    if (activeView === "Replay") {
      replaceTradingView("Replay", replayUrlUpdater(replayDeskFilter, replayInstrumentFilter, value));
    }
  }

  function clearReplayFilters() {
    setTraceNotice(null);
    setReplayDeskFilter(ALL_DESK_FILTER);
    setReplayInstrumentFilter(ALL_INSTRUMENT_FILTER);
    setReplayEvidenceFilter(ALL_EVIDENCE_FILTER);

    if (activeView === "Replay") {
      replaceTradingView("Replay");
    }
  }

  return (
    <div className="trading-research-cockpit">
      <section className="trading-cockpit-heading" aria-labelledby="trading-cockpit-title">
        <div>
          <h2 id="trading-cockpit-title">MiniDora Trading Research</h2>
          <p>Evidence-first research cockpit for market understanding, desk disagreement, gates, and replay.</p>
        </div>
        <div className={`trading-cockpit-status is-${posture.tone}`} aria-label="Trading research status">
          <span className="trading-cockpit-live-dot" aria-hidden />
          <strong>{posture.label}</strong>
          <small>{posture.detail}</small>
        </div>
      </section>

      <section className="trading-cockpit-continuity" aria-label="Trading research continuity">
        <Link href="/dora/team/trading" className="link-focus">
          <ExternalLink size={16} aria-hidden />
          <span>
            <strong>Public agent profile</strong>
            <small>Trading MiniDora stays the single public team identity.</small>
          </span>
          <ArrowRight size={15} aria-hidden />
        </Link>
        <Link href="/projects/minidora-trading" className="link-focus">
          <ExternalLink size={16} aria-hidden />
          <span>
            <strong>Public methodology</strong>
            <small>Research workflow, desks, and safety boundary.</small>
          </span>
          <ArrowRight size={15} aria-hidden />
        </Link>
        <button
          type="button"
          onClick={() => selectTradingView("Evidence")}
          aria-label="Open private Evidence research view"
        >
          <FileSearch size={16} aria-hidden />
          <span>
            <strong>Owner evidence view</strong>
            <small>Private gates, source health, and blockers.</small>
          </span>
          <ArrowRight size={15} aria-hidden />
        </button>
      </section>

      <section className="trading-cockpit-chip-row" aria-label="Trading research posture">
        <span>
          <LockKeyhole size={15} aria-hidden />
          Owner-only
        </span>
        <span>
          <Database size={15} aria-hidden />
          Evidence-first
        </span>
        <span>
          <Ban size={15} aria-hidden />
          No execution
        </span>
      </section>

      <section className="trading-cockpit-boundary-banner" aria-label="Trading research boundary">
        <ShieldCheck size={22} aria-hidden />
        <div>
          {/* Fixed compliance wording stays in English across locales. */}
          <strong data-i18n-skip>{data.disclaimer}</strong>
          <p>MiniDora Trading provides research artifacts for owner review. No broker connectivity. No accounts. No auto-execution.</p>
        </div>
        <button type="button" onClick={openEvidenceCenter}>
          Open evidence center
        </button>
      </section>

      {traceNotice ? (
        <section
          className="rounded-[8px] border border-yellow-200/25 bg-yellow-300/10 p-4 text-sm text-slate-200"
          role="note"
          data-trace-notice
        >
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 shrink-0 text-yellow-100" size={20} aria-hidden />
            <div>
              <strong className="text-yellow-50" data-i18n-skip>
                {traceNoticeTitle(traceNotice, locale)}
              </strong>
              {" "}
              <p className="mt-1 leading-6 text-slate-300" data-i18n-skip>
                {traceNoticeDetail(traceNotice, locale)}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="trading-cockpit-tabs" aria-label="Trading research views">
        <div>
          {data.views.map((view) => {
            const Icon = viewIcons[view];
            const isActive = activeView === view;

            return (
              <button
                key={view}
                type="button"
                ref={isActive ? activeViewButtonRef : undefined}
                aria-pressed={isActive}
                onClick={() => selectTradingView(view)}
                className={isActive ? "is-active" : ""}
              >
                <Icon size={16} aria-hidden />
                <span data-i18n-skip>{viewLabel(view, locale)}</span>
              </button>
            );
          })}
        </div>
      </section>

      {(activeView === "Today" || activeView === "Signals") && (
        <section className="trading-cockpit-filter-bar" aria-label="Desk signal filters">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-bold uppercase text-slate-400">Desk filter</span>
            {deskFilters.map((desk) => {
              const isActive = activeDesk === desk;

              return (
                <button
                  key={desk}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveDesk(desk)}
                  className={`link-focus rounded-[8px] border px-3 py-1.5 text-xs font-semibold transition ${
                    isActive
                      ? "border-yellow-200/40 bg-yellow-300/10 text-yellow-50"
                      : "border-slate-700 bg-white/[0.035] text-slate-300 hover:border-yellow-200/30 hover:text-white"
                  }`}
                >
                  <span data-i18n-skip>{deskLabel(desk, locale)}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {activeView === "Today" ? (
        <TradingTodayCockpit
          signals={filteredSignals}
          todayFocus={data.todayFocus}
          desks={data.desks}
          sourceHealth={data.sourceHealth}
          evidencePackets={data.evidencePackets}
          gates={data.gates}
          replay={data.replay}
          openQuestions={data.openQuestions}
          reviewQueue={reviewQueue}
          unavailableActions={data.unavailableActions}
          deskScope={activeDesk}
          onOpenEvidenceQueue={openEvidenceCenter}
          onOpenReviewItem={openReviewQueueItem}
          onSelectView={selectTradingView}
          onTraceEvidence={traceEvidenceForSignal}
        />
      ) : null}
      {activeView === "Signals" ? (
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_24rem]">
          <SignalTable signals={filteredSignals} onTraceEvidence={traceEvidenceForSignal} />
          <SafetyRail unavailableActions={data.unavailableActions} />
        </section>
      ) : null}
      {activeView === "Desks" ? <DeskDisagreement desks={data.desks} /> : null}
      {activeView === "Instruments" ? (
        activeInstrument ? (
          <InstrumentsView
            instruments={data.instruments}
            activeInstrument={activeInstrument}
            onSelectInstrument={setActiveInstrumentSymbol}
            unavailableActions={data.unavailableActions}
          />
        ) : (
          <section className="panel p-5" aria-labelledby="trading-instruments-empty-title">
            <div className="flex items-center gap-2 text-sky-100">
              <SlidersHorizontal size={22} aria-hidden />
              <h2 id="trading-instruments-empty-title" className="text-2xl font-semibold text-white">
                Instruments
              </h2>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              No instrument research packets are available in this owner-only mock session. Research boundaries and
              blocked actions remain unchanged.
            </p>
          </section>
        )
      ) : null}
      {activeView === "Options Lab" ? <OptionsLab scenarios={data.optionsLab} /> : null}
      {activeView === "Evidence" ? (
        <EvidenceView
          gates={data.gates}
          evidencePackets={data.evidencePackets}
          sourceHealth={data.sourceHealth}
          signals={data.signals}
          unavailableActions={data.unavailableActions}
          signalFilter={evidenceSignalFilter}
          onSignalFilterChange={changeEvidenceSignalFilter}
          stateFilter={evidenceStateFilter}
          onStateFilterChange={changeEvidenceStateFilter}
          onClearFilters={clearEvidenceFilters}
          onFocusEvidencePacket={focusEvidencePacket}
          onOpenReplayTrace={traceReplayForInstrument}
        />
      ) : null}
      {activeView === "Replay" ? (
        <ReplayView
          replay={data.replay}
          openQuestions={data.openQuestions}
          disclaimer={data.disclaimer}
          deskFilter={replayDeskFilter}
          onDeskFilterChange={changeReplayDeskFilter}
          instrumentFilter={replayInstrumentFilter}
          onInstrumentFilterChange={changeReplayInstrumentFilter}
          evidenceFilter={replayEvidenceFilter}
          onEvidenceFilterChange={changeReplayEvidenceFilter}
          onClearFilters={clearReplayFilters}
        />
      ) : null}
      {activeView === "System" ? (
        <SystemView
          systemStatus={data.systemStatus}
          sourceHealth={data.sourceHealth}
          gates={data.gates}
          evidencePackets={data.evidencePackets}
          replay={data.replay}
          unavailableActions={data.unavailableActions}
          reviewQueue={reviewQueue}
          onOpenEvidenceQueue={openEvidenceCenter}
          onOpenReplayCenter={() => traceReplayForInstrument(ALL_INSTRUMENT_FILTER)}
          onOpenReviewItem={openReviewQueueItem}
        />
      ) : null}
    </div>
  );
}
