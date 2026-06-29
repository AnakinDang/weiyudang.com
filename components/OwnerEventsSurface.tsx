"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock3,
  FileSearch,
  Filter,
  GitBranch,
  History,
  LockKeyhole,
  Radio,
  ShieldCheck,
  UserCheck,
  Waypoints
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { StatusBadge } from "@/components/StatusBadge";
import {
  isOwnerAgentId,
  isOwnerEventKind,
  ownerAgentIdFromRoute,
  OWNER_AGENT_PARAM,
  OWNER_EVENT_KIND_PARAM,
  ownerEventsHref
} from "@/lib/agent-route";
import { translateToZh, type SiteLocale } from "@/lib/site-i18n";
import { ownerSystemHref } from "@/lib/system-route";

type EventTone = "normal" | "info" | "warning" | "private";

type OwnerEventKind = "Agent history" | "Handoff" | "Review signal" | "Boundary signal" | "Source posture";

type OwnerEventAgentOption = {
  id: string;
  name: string;
  role: string;
  state: string;
  tone: EventTone;
};

type OwnerEventMetric = {
  label: string;
  value: string;
  detail: string;
};

type OwnerEventTimelineItem = {
  id: string;
  kind: OwnerEventKind;
  time: string;
  title: string;
  detail: string;
  state: string;
  tone: EventTone;
  agentId?: string;
  agentName: string;
  source: string;
  evidence: readonly string[];
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
};

export type OwnerEventsSurfaceData = {
  agents: readonly OwnerEventAgentOption[];
  kinds: readonly OwnerEventKind[];
  metrics: readonly OwnerEventMetric[];
  events: readonly OwnerEventTimelineItem[];
  boundary: readonly string[];
};

export type OwnerEventsInitialFilters = {
  agentId?: string;
  kind?: OwnerEventKind;
};

const kindIcons = {
  "Agent history": History,
  Handoff: Waypoints,
  "Review signal": FileSearch,
  "Boundary signal": ShieldCheck,
  "Source posture": Radio
} as const;

const metricToneClasses = [
  "border-sky-200/25 bg-sky-300/10 text-sky-100",
  "border-yellow-200/30 bg-yellow-300/10 text-yellow-100",
  "border-emerald-200/25 bg-emerald-300/10 text-emerald-100",
  "border-violet-200/25 bg-violet-300/10 text-violet-100",
  "border-slate-600 bg-white/[0.045] text-slate-200"
] as const;

const ALL_FILTER = "all";

const eventZhOverrides: Partial<Record<string, string>> = {
  "Private Events": "私密事件",
  "Owner-only history, handoffs, and review signals.": "仅本人可见的历史、交接和审核信号。",
  "Read the MiniDora operating trail without exposing raw runtime payloads. This page reconstructs a private timeline from curated cockpit packets; it does not approve, publish, trade, dispatch, or execute work.":
    "阅读 MiniDora 的运行轨迹，同时不暴露原始运行时载荷。本页从精选驾驶舱包重建私密时间线；不会审批、发布、交易、派发或执行工作。",
  "Owner-only": "仅限本人",
  "Read-only timeline": "只读时间线",
  "No raw runtime payloads": "无原始运行时载荷",
  "Filter timeline": "筛选时间线",
  "Agent lane": "智能体通道",
  "Event type": "事件类型",
  "All agents": "全部智能体",
  "All event types": "全部事件类型",
  "Showing": "正在显示",
  "events": "事件",
  "Timeline": "时间线",
  "Select an event to inspect its source, evidence, linked context, and boundary posture. The selected event never becomes an action.":
    "选择事件，检查其来源、证据、关联上下文和边界状态。选中的事件不会变成动作。",
  "Selected event": "选中事件",
  "Source": "来源",
  "Evidence": "证据",
  "Linked owner context": "关联的本人上下文",
  "Open primary context": "打开主要上下文",
  "Open supporting context": "打开辅助上下文",
  "Context bridges": "上下文桥",
  "Open Agents": "打开智能体",
  "Inspect roster, leases, source health, and per-agent history.": "检查花名册、lease、来源健康和每个智能体的历史。",
  "Open Review Queue": "打开审核队列",
  "Review owner-gated packets before any future action path exists.": "在任何未来动作路径存在前，先审核本人把关的包。",
  "Open System Health": "打开系统健康",
  "Read diagnostics and event freshness at a safe owner-only abstraction.": "在安全的仅本人抽象层阅读诊断和事件新鲜度。",
  "Boundary": "边界",
  "No matching private events": "没有匹配的私密事件",
  "Clear filters or choose another agent lane.": "清除筛选或选择另一个智能体通道。",
  "Clear filters": "清除筛选",
  "Agent history": "智能体历史",
  Handoff: "交接",
  "Review signal": "审核信号",
  "Boundary signal": "边界信号",
  "Source posture": "来源状态",
  "Curated agent roster": "精选智能体花名册",
  "Handoff register": "交接登记",
  "Review Queue": "审核队列",
  "Source health register": "来源健康登记",
  "Boundary contract": "边界契约",
  "Private events": "私密事件",
  "Curated cockpit packets": "精选驾驶舱包",
  "Agents represented": "覆盖的智能体",
  "MiniDora lanes with context": "有上下文的 MiniDora 通道",
  "Review signals": "审核信号",
  "Owner-gated packets": "本人把关的包",
  "Source postures": "来源状态",
  "Source health summaries": "来源健康摘要",
  Executions: "执行",
  "No dispatch path": "没有派发路径",
  "Events are curated private cockpit packets, not raw runtime payloads.":
    "事件是精选的私密驾驶舱包，不是原始运行时载荷。",
  "No raw prompts, task bodies, local paths, account details, or tool payloads are rendered.":
    "不会渲染原始 prompt、任务正文、本地路径、账户细节或工具载荷。",
  "This page can route to owner-only context, but it cannot approve, publish, trade, dispatch, or execute work.":
    "本页可以路由到仅本人可见的上下文，但不能审批、发布、交易、派发或执行工作。",
  "A future live private event source needs a separate schema, retention, and audit design.":
    "未来的实时私密事件源需要单独的 schema、保留策略和审计设计。",
  "Open agent context": "打开智能体上下文",
  "Open review queue": "打开审核队列",
  "Open system health": "打开系统健康",
  "Coordination chain": "协作链",
  "Owner review loop": "本人审核循环",
  "Boundary held": "边界保持",
  "Guardrail held": "护栏保持",
  Always: "始终",
  Held: "保持",
  "Owner Cockpit": "私密驾驶舱",
  "Owner-only, Read-only, No dispatch": "仅本人、只读、无派发"
};

function eventText(value: string | undefined, locale: SiteLocale): string {
  if (!value) return "";
  if (locale !== "zh") return value;

  const handoffMatch = value.match(/^(.+) to (.+)$/);
  if (handoffMatch) {
    return `${eventText(handoffMatch[1], locale)} → ${eventText(handoffMatch[2], locale)}`;
  }

  const sourcePostureMatch = value.match(/^(.+) source posture$/);
  if (sourcePostureMatch) {
    return `${eventText(sourcePostureMatch[1], locale)} 来源状态`;
  }

  return eventZhOverrides[value] ?? translateToZh(value) ?? value;
}

function eventCountLabel(count: number, locale: SiteLocale) {
  return locale === "zh" ? `${count} 条事件` : `${count} ${count === 1 ? "event" : "events"}`;
}

function filterSummary(count: number, locale: SiteLocale) {
  return locale === "zh" ? `正在显示 ${count} 条事件` : `Showing ${count} ${count === 1 ? "event" : "events"}`;
}

function agentFilterFromSearch(search: string, agents: readonly OwnerEventAgentOption[]) {
  const routeId = new URLSearchParams(search).get(OWNER_AGENT_PARAM);
  const agentId = ownerAgentIdFromRoute(routeId);
  return agentId && agents.some((agent) => agent.id === agentId) ? agentId : ALL_FILTER;
}

function kindFilterFromSearch(search: string, kinds: readonly OwnerEventKind[]) {
  const kind = new URLSearchParams(search).get(OWNER_EVENT_KIND_PARAM);
  return isOwnerEventKind(kind) && kinds.includes(kind) ? kind : ALL_FILTER;
}

function eventFilterUrl(agentId: string, kind: string) {
  const safeAgent = isOwnerAgentId(agentId) ? agentId : undefined;
  const safeKind = isOwnerEventKind(kind) ? kind : undefined;
  const nextHref = ownerEventsHref(safeAgent, safeKind);

  if (typeof window === "undefined") {
    return nextHref;
  }

  const currentUrl = new URL(window.location.href);
  const nextUrl = new URL(nextHref, currentUrl.origin);
  return `${nextUrl.pathname}${nextUrl.search}${currentUrl.hash}`;
}

function currentFilterUrl() {
  if (typeof window === "undefined") {
    return "";
  }

  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function MetricStrip({ metrics, locale }: { metrics: readonly OwnerEventMetric[]; locale: SiteLocale }) {
  const t = (value: string | undefined) => eventText(value, locale);

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {metrics.map((metric, index) => (
        <div key={metric.label} className={`rounded-[8px] border p-4 ${metricToneClasses[index % metricToneClasses.length]}`}>
          <p className="text-xs font-bold uppercase text-current">{t(metric.label)}</p>
          <strong className="mt-2 block text-3xl font-semibold text-white">{metric.value}</strong>
          <p className="mt-2 text-sm leading-5 text-slate-200/85">{t(metric.detail)}</p>
        </div>
      ))}
    </div>
  );
}

function EventsHero({ metrics, locale }: { metrics: readonly OwnerEventMetric[]; locale: SiteLocale }) {
  const t = (value: string | undefined) => eventText(value, locale);

  return (
    <section className="panel relative isolate overflow-hidden p-6 md:p-8" aria-labelledby="owner-events-title">
      <div
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-2/3 bg-[radial-gradient(circle_at_64%_18%,rgba(56,189,248,0.22),transparent_32%),radial-gradient(circle_at_80%_70%,rgba(250,204,21,0.12),transparent_30%),linear-gradient(135deg,transparent,rgba(59,130,246,0.10))]"
        aria-hidden
      />
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-[8px] border border-violet-200/25 bg-violet-300/10 px-3 py-1.5 text-xs font-bold uppercase text-violet-100">
          <LockKeyhole size={14} aria-hidden />
          {t("Owner-only")}
        </span>
        <span className="inline-flex items-center gap-2 rounded-[8px] border border-sky-200/25 bg-sky-300/10 px-3 py-1.5 text-xs font-bold uppercase text-sky-100">
          <Activity size={14} aria-hidden />
          {t("Read-only timeline")}
        </span>
        <span className="inline-flex items-center gap-2 rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 px-3 py-1.5 text-xs font-bold uppercase text-yellow-100">
          <ShieldCheck size={14} aria-hidden />
          {t("No raw runtime payloads")}
        </span>
      </div>

      <div className="mt-8 max-w-4xl">
        <p className="eyebrow">{t("Private Events")}</p>
        <h2 id="owner-events-title" className="mt-2 text-3xl font-semibold leading-tight text-white md:text-5xl">
          {t("Owner-only history, handoffs, and review signals.")}
        </h2>
        <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
          {t("Read the MiniDora operating trail without exposing raw runtime payloads. This page reconstructs a private timeline from curated cockpit packets; it does not approve, publish, trade, dispatch, or execute work.")}
        </p>
      </div>

      <div className="mt-7">
        <MetricStrip metrics={metrics} locale={locale} />
      </div>
    </section>
  );
}

function FilterPanel({
  agents,
  kinds,
  activeAgent,
  activeKind,
  visibleCount,
  onAgentChange,
  onKindChange,
  onClear,
  locale
}: {
  agents: readonly OwnerEventAgentOption[];
  kinds: readonly OwnerEventKind[];
  activeAgent: string;
  activeKind: string;
  visibleCount: number;
  onAgentChange: (agentId: string) => void;
  onKindChange: (kind: string) => void;
  onClear: () => void;
  locale: SiteLocale;
}) {
  const t = (value: string | undefined) => eventText(value, locale);

  return (
    <section className="panel p-5" aria-labelledby="owner-event-filter-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <Filter size={20} aria-hidden />
            <h2 id="owner-event-filter-title" className="text-2xl font-semibold text-white">{t("Filter timeline")}</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-400">{filterSummary(visibleCount, locale)}</p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="link-focus rounded-[8px] border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:border-sky-200/35 hover:text-white"
        >
          {t("Clear filters")}
        </button>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <label className="block">
          <span className="text-xs font-bold uppercase text-slate-400">{t("Agent lane")}</span>
          <select
            value={activeAgent}
            onChange={(event) => onAgentChange(event.target.value)}
            className="mt-2 w-full rounded-[8px] border border-slate-700 bg-[#07111f] px-3 py-2 text-sm font-semibold text-white outline-none transition focus:border-sky-300"
          >
            <option value="all">{t("All agents")}</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {t(agent.name)}
              </option>
            ))}
          </select>
        </label>

        <div>
          <p className="text-xs font-bold uppercase text-slate-400">{t("Event type")}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={activeKind === "all"}
              onClick={() => onKindChange("all")}
              className={`link-focus rounded-[8px] border px-3 py-2 text-xs font-semibold transition ${
                activeKind === "all"
                  ? "border-sky-200/45 bg-sky-300/15 text-white"
                  : "border-slate-700 bg-white/[0.035] text-slate-300 hover:border-sky-200/30 hover:text-white"
              }`}
            >
              {t("All event types")}
            </button>
            {kinds.map((kind) => (
              <button
                key={kind}
                type="button"
                aria-pressed={activeKind === kind}
                onClick={() => onKindChange(kind)}
                className={`link-focus rounded-[8px] border px-3 py-2 text-xs font-semibold transition ${
                  activeKind === kind
                    ? "border-sky-200/45 bg-sky-300/15 text-white"
                    : "border-slate-700 bg-white/[0.035] text-slate-300 hover:border-sky-200/30 hover:text-white"
                }`}
              >
                {t(kind)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function EventRow({
  event,
  active,
  onSelect,
  locale
}: {
  event: OwnerEventTimelineItem;
  active: boolean;
  onSelect: () => void;
  locale: SiteLocale;
}) {
  const t = (value: string | undefined) => eventText(value, locale);
  const Icon = kindIcons[event.kind];

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className={`link-focus grid gap-3 rounded-[8px] border p-4 text-left transition ${
        active
          ? "border-sky-300/55 bg-sky-300/14 shadow-[0_18px_50px_rgba(14,165,233,0.14)]"
          : "border-slate-700 bg-white/[0.045] hover:-translate-y-0.5 hover:border-sky-200/35 hover:bg-white/[0.07]"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] border border-sky-200/25 bg-sky-300/10 text-sky-100">
            <Icon size={18} aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase text-yellow-100">{t(event.kind)}</p>
            <h3 className="mt-1 text-base font-semibold text-white">{t(event.title)}</h3>
          </div>
        </div>
        <StatusBadge tone={event.tone}>{t(event.state)}</StatusBadge>
      </div>
      <p className="text-sm leading-6 text-slate-300">{t(event.detail)}</p>
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <Clock3 size={13} aria-hidden />
          {t(event.time)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Bot size={13} aria-hidden />
          {t(event.agentName)}
        </span>
      </div>
    </button>
  );
}

function SelectedEventPanel({ event, locale }: { event: OwnerEventTimelineItem; locale: SiteLocale }) {
  const t = (value: string | undefined) => eventText(value, locale);
  const Icon = kindIcons[event.kind];

  return (
    <aside className="panel sticky top-28 grid content-start gap-4 p-5" aria-labelledby="owner-selected-event-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">{t("Selected event")}</p>
          <h2 id="owner-selected-event-title" className="mt-2 text-2xl font-semibold text-white">{t(event.title)}</h2>
          <p className="mt-2 text-xs font-bold uppercase text-yellow-100">{t(event.kind)}</p>
        </div>
        <span className="flex size-11 items-center justify-center rounded-[8px] border border-sky-200/25 bg-sky-300/10 text-sky-100">
          <Icon size={20} aria-hidden />
        </span>
      </div>

      <p className="text-sm leading-6 text-slate-300">{t(event.detail)}</p>

      <div className="grid gap-3">
        <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
          <p className="text-xs font-bold uppercase text-slate-400">{t("Source")}</p>
          <p className="mt-2 text-sm font-semibold text-white">{t(event.source)}</p>
          <p className="mt-1 text-xs text-slate-500">{t(event.time)} - {t(event.agentName)}</p>
        </div>
        <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
          <p className="text-xs font-bold uppercase text-slate-400">{t("Evidence")}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {event.evidence.map((item) => (
              <span key={`${event.id}-${item}`} className="rounded-[8px] border border-slate-700 bg-[#07111f]/70 px-2.5 py-1 text-xs text-slate-300">
                {t(item)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[8px] border border-sky-200/25 bg-sky-300/10 p-4">
        <p className="text-xs font-bold uppercase text-sky-100">{t("Linked owner context")}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href={event.primaryHref}
            prefetch={false}
            className="link-focus inline-flex items-center gap-2 rounded-[8px] bg-sky-300 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-sky-200"
          >
            {t(event.primaryLabel)}
            <ArrowRight size={14} aria-hidden />
          </Link>
          <Link
            href={event.secondaryHref}
            prefetch={false}
            className="link-focus inline-flex items-center gap-2 rounded-[8px] border border-slate-700 bg-white/[0.045] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-sky-200/35 hover:text-white"
          >
            {t(event.secondaryLabel)}
            <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      </div>
    </aside>
  );
}

function ContextBridges({ locale }: { locale: SiteLocale }) {
  const t = (value: string | undefined) => eventText(value, locale);
  const links = [
    {
      href: "/app/agents",
      label: "Open Agents",
      detail: "Inspect roster, leases, source health, and per-agent history.",
      icon: Bot
    },
    {
      href: "/app/review",
      label: "Open Review Queue",
      detail: "Review owner-gated packets before any future action path exists.",
      icon: UserCheck
    },
    {
      href: ownerSystemHref("event-freshness"),
      label: "Open System Health",
      detail: "Read diagnostics and event freshness at a safe owner-only abstraction.",
      icon: GitBranch
    }
  ] as const;

  return (
    <section className="panel p-5" aria-labelledby="event-context-bridges-title">
      <div className="flex items-center gap-2 text-sky-100">
        <Waypoints size={22} aria-hidden />
        <h2 id="event-context-bridges-title" className="text-2xl font-semibold text-white">{t("Context bridges")}</h2>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {links.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className="link-focus group rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 transition hover:-translate-y-0.5 hover:border-sky-200/35 hover:bg-sky-300/10"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Icon size={17} aria-hidden />
                  {t(item.label)}
                </span>
                <ArrowRight className="text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-sky-100" size={16} aria-hidden />
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">{t(item.detail)}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function BoundaryPanel({ boundary, locale }: { boundary: readonly string[]; locale: SiteLocale }) {
  const t = (value: string | undefined) => eventText(value, locale);

  return (
    <section className="panel p-5" aria-labelledby="event-boundary-title">
      <div className="flex items-center gap-2 text-yellow-100">
        <ShieldCheck size={22} aria-hidden />
        <h2 id="event-boundary-title" className="text-2xl font-semibold text-white">{t("Boundary")}</h2>
      </div>
      <ul className="mt-5 grid gap-3 md:grid-cols-2">
        {boundary.map((item) => (
          <li key={item} className="flex gap-3 rounded-[8px] border border-slate-700 bg-white/[0.045] p-3 text-sm leading-6 text-slate-300">
            <CheckCircle2 className="mt-1 shrink-0 text-sky-100" size={16} aria-hidden />
            <span>{t(item)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function OwnerEventsSurface({
  data,
  initialFilters = {}
}: {
  data: OwnerEventsSurfaceData;
  initialFilters?: OwnerEventsInitialFilters;
}) {
  const { locale } = useLanguage();
  const t = (value: string | undefined) => eventText(value, locale);
  const [activeAgent, setActiveAgent] = useState(initialFilters.agentId ?? ALL_FILTER);
  const [activeKind, setActiveKind] = useState<string>(initialFilters.kind ?? ALL_FILTER);
  const [selectedEventId, setSelectedEventId] = useState(data.events[0]?.id ?? "");

  const visibleEvents = useMemo(
    () =>
      data.events.filter((event) => {
        const agentMatches = activeAgent === ALL_FILTER || event.agentId === activeAgent;
        const kindMatches = activeKind === ALL_FILTER || event.kind === activeKind;
        return agentMatches && kindMatches;
      }),
    [activeAgent, activeKind, data.events]
  );

  const selectedEvent = visibleEvents.find((event) => event.id === selectedEventId) ?? visibleEvents[0];

  function updateFilters(nextAgent: string, nextKind: string) {
    setActiveAgent(nextAgent);
    setActiveKind(nextKind);

    if (typeof window === "undefined") {
      return;
    }

    const nextUrl = eventFilterUrl(nextAgent, nextKind);
    if (nextUrl !== currentFilterUrl()) {
      window.history.pushState(null, "", nextUrl);
    }
  }

  function clearFilters() {
    updateFilters(ALL_FILTER, ALL_FILTER);
  }

  useEffect(() => {
    function syncFiltersFromLocation() {
      const nextAgent = agentFilterFromSearch(window.location.search, data.agents);
      const nextKind = kindFilterFromSearch(window.location.search, data.kinds);

      setActiveAgent((current) => (current === nextAgent ? current : nextAgent));
      setActiveKind((current) => (current === nextKind ? current : nextKind));
    }

    syncFiltersFromLocation();
    window.addEventListener("popstate", syncFiltersFromLocation);
    return () => window.removeEventListener("popstate", syncFiltersFromLocation);
  }, [data.agents, data.kinds]);

  return (
    <div className="grid gap-5" data-i18n-skip>
      <EventsHero metrics={data.metrics} locale={locale} />
      <FilterPanel
        agents={data.agents}
        kinds={data.kinds}
        activeAgent={activeAgent}
        activeKind={activeKind}
        visibleCount={visibleEvents.length}
        onAgentChange={(agentId) => updateFilters(agentId, activeKind)}
        onKindChange={(kind) => updateFilters(activeAgent, kind)}
        onClear={clearFilters}
        locale={locale}
      />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_26rem]" aria-labelledby="owner-event-timeline-title">
        <div className="panel p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sky-100">
                <Activity size={22} aria-hidden />
                <h2 id="owner-event-timeline-title" className="text-2xl font-semibold text-white">{t("Timeline")}</h2>
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                {t("Select an event to inspect its source, evidence, linked context, and boundary posture. The selected event never becomes an action.")}
              </p>
            </div>
            <StatusBadge tone="info">{eventCountLabel(visibleEvents.length, locale)}</StatusBadge>
          </div>

          {visibleEvents.length > 0 ? (
            <div className="mt-5 grid gap-3">
              {visibleEvents.map((event) => (
                <EventRow
                  key={event.id}
                  event={event}
                  active={event.id === selectedEvent?.id}
                  onSelect={() => setSelectedEventId(event.id)}
                  locale={locale}
                />
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-[8px] border border-slate-700 bg-white/[0.045] p-5">
              <p className="text-lg font-semibold text-white">{t("No matching private events")}</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">{t("Clear filters or choose another agent lane.")}</p>
            </div>
          )}
        </div>

        {selectedEvent ? <SelectedEventPanel event={selectedEvent} locale={locale} /> : null}
      </section>

      <ContextBridges locale={locale} />
      <BoundaryPanel boundary={data.boundary} locale={locale} />
    </div>
  );
}
