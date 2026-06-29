"use client";

import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bot,
  Boxes,
  Brain,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Gauge,
  GitBranch,
  History,
  Layers3,
  LineChart,
  LockKeyhole,
  Network,
  Radio,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Waypoints
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { StatusBadge } from "@/components/StatusBadge";
import {
  isOwnerAgentId,
  ownerAgentHref,
  ownerAgentIdFromRoute,
  OWNER_AGENT_PARAM,
  ownerEventsHref
} from "@/lib/agent-route";
import { translateToZh, type SiteLocale } from "@/lib/site-i18n";
import type {
  PrivateAgent,
  PrivateAgentCoverageLane,
  PrivateAgentHandoff,
  PrivateAgentLeaseStatus,
  PrivateAgentMetric,
  PrivateAgentRole,
  PrivateAgentSourceHealth
} from "@/lib/agent-ops";

type Tone = PrivateAgent["tone"];
type ReviewQueuePreviewItem = {
  title: string;
  tone: Tone;
  decision: string;
  urgency: string;
  agent: string;
  note: string;
};

type PrivateAgentsSurfaceProps = {
  agents: readonly PrivateAgent[];
  metrics: readonly PrivateAgentMetric[];
  coverage: readonly PrivateAgentCoverageLane[];
  boundary: readonly string[];
  handoffs: readonly PrivateAgentHandoff[];
  reviewQueue: readonly ReviewQueuePreviewItem[];
  initialAgentId?: PrivateAgent["id"];
};

const roleIcons = {
  Orchestrator: Bot,
  Implementation: Boxes,
  Evidence: GitBranch,
  "Trading Research": ShieldCheck,
  "Creative Production": FileText,
  "Product Quality": ClipboardCheck,
  Operations: CalendarClock,
  Knowledge: Brain
} as const satisfies Record<PrivateAgentRole, LucideIcon>;

const sourceHealthTone = {
  Good: "normal",
  Partial: "warning",
  Degraded: "warning",
  Pending: "private"
} as const satisfies Record<PrivateAgentSourceHealth, Tone>;

const leaseStatusTone = {
  "Active lease": "info",
  "Review lease": "warning",
  "Owner-gated": "warning",
  "Queued lease": "private",
  "Idle lease": "private"
} as const satisfies Record<PrivateAgentLeaseStatus, Tone>;

const sourceHealthOrder: readonly PrivateAgentSourceHealth[] = ["Good", "Partial", "Degraded", "Pending"];
const leaseStatusOrder: readonly PrivateAgentLeaseStatus[] = [
  "Active lease",
  "Review lease",
  "Owner-gated",
  "Queued lease",
  "Idle lease"
];

const REVIEW_QUEUE_PREVIEW_LIMIT = 3;

type AgentReviewRow = {
  label: string;
  state: string;
  tone: Tone;
  ready: boolean;
  detail: string;
};

type AgentOwnerPosture = {
  key: string;
  label: string;
  state: string;
  tone: Tone;
  detail: string;
  next: string;
};

type AgentSafeOutputRow = {
  label: string;
  state: string;
  tone: Tone;
  detail: string;
};

// These short labels have different public-site and owner-cockpit meanings.
const privateAgentZhOverrides: Partial<Record<string, string>> = {
  Owner: "本人",
  "Owner-gated": "本人把关",
  Partial: "部分",
  Pending: "待处理"
};

function agentText(value: string | undefined, locale: SiteLocale) {
  if (!value) return "";
  if (locale !== "zh") return value;
  const stepMatch = value.match(/^Step (\d+)$/);
  if (stepMatch) return `第 ${stepMatch[1]} 步`;
  return privateAgentZhOverrides[value] ?? translateToZh(value) ?? value;
}

function joinAgentText(values: readonly string[], locale: SiteLocale) {
  return values.map((value) => agentText(value, locale)).join(locale === "zh" ? "、" : ", ");
}

function countBy<T extends string>(items: readonly PrivateAgent[], read: (agent: PrivateAgent) => T) {
  const counts = new Map<T, number>();

  items.forEach((agent) => {
    const key = read(agent);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });

  return counts;
}

function agentIdFromSearch(search: string, agents: readonly PrivateAgent[]) {
  const params = new URLSearchParams(search);
  const agentId = ownerAgentIdFromRoute(params.get(OWNER_AGENT_PARAM));
  return agentId && agents.some((agent) => agent.id === agentId) ? agentId : undefined;
}

function agentRouteUrl(agentId: string) {
  if (!isOwnerAgentId(agentId)) {
    return ownerAgentHref();
  }

  const nextHref = ownerAgentHref(agentId);

  if (typeof window === "undefined") {
    return nextHref;
  }

  const url = new URL(window.location.href);
  const nextUrl = new URL(nextHref, url.origin);
  return `${nextUrl.pathname}${nextUrl.search}${url.hash}`;
}

function currentAgentUrl() {
  if (typeof window === "undefined") {
    return "";
  }

  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function readinessLabel(rows: readonly AgentReviewRow[], locale: SiteLocale) {
  const ready = rows.filter((row) => row.ready).length;
  if (locale === "zh") return `${ready}/${rows.length} 项就绪`;
  return `${ready} of ${rows.length} ready`;
}

function sourceHealthReady(sourceHealth: PrivateAgentSourceHealth) {
  return sourceHealth === "Good" || sourceHealth === "Partial";
}

function leaseHasOwnerSignal(leaseStatus: PrivateAgentLeaseStatus) {
  return leaseStatus === "Active lease" || leaseStatus === "Review lease" || leaseStatus === "Owner-gated";
}

function reviewRowsForAgent(agent: PrivateAgent, locale: SiteLocale): AgentReviewRow[] {
  return [
    {
      label: "Lease posture",
      state: agent.leaseStatus,
      tone: leaseStatusTone[agent.leaseStatus],
      ready: leaseHasOwnerSignal(agent.leaseStatus),
      detail: agent.lease
    },
    {
      label: "Source health",
      state: agent.sourceHealth,
      tone: sourceHealthTone[agent.sourceHealth],
      ready: sourceHealthReady(agent.sourceHealth),
      detail: agent.sourceDetail
    },
    {
      label: "History trail",
      state: locale === "zh" ? `${agent.history.length} 条` : `${agent.history.length} items`,
      tone: agent.history.length > 0 ? "normal" : "private",
      ready: agent.history.length > 0,
      detail: agent.history.length > 0 ? "Recent state history is visible for owner review." : "No history is available for this agent."
    }
  ];
}

function safeOutputsForAgent(agent: PrivateAgent, locale: SiteLocale): AgentSafeOutputRow[] {
  const name = agentText(agent.name, locale);

  return [
    {
      label: "Owner brief",
      state: "Allowed",
      tone: "normal",
      detail:
        locale === "zh"
          ? `${name} 可以汇总给本人阅读，不创建任何运行时动作。`
          : `${agent.name} can be summarized for owner reading without creating runtime action.`
    },
    {
      label: "Review queue note",
      state: "Allowed",
      tone: "info",
      detail: "A decision packet can point to the Review Queue after explicit owner review."
    },
    {
      label: "Dispatch",
      state: "Unavailable",
      tone: "private",
      detail: "This page has no execute, approve, publish, trade, or dispatch control."
    }
  ];
}

function ownerPosturesForAgent(agent: PrivateAgent, locale: SiteLocale): AgentOwnerPosture[] {
  const sourceReady = sourceHealthReady(agent.sourceHealth);
  const name = agentText(agent.name, locale);

  return [
    {
      key: "review_now",
      label: locale === "zh" ? "现在审核" : "Review now",
      state: locale === "zh" ? "本人阅读" : "Owner read",
      tone: sourceReady ? "normal" : "warning",
      detail:
        locale === "zh"
          ? "在驾驶舱中检查这个智能体的 lease、证据和近期历史。"
          : "Inspect this agent's lease, evidence, and recent history in the cockpit.",
      next:
        locale === "zh"
          ? `阅读 ${name} 的 lease 和历史，再把任何决策移入 Command 或 Review Queue。`
          : `Read ${agent.name}'s lease and history, then move any decision into Command or Review Queue.`
    },
    {
      key: "hold_or_source_proof",
      label: locale === "zh" ? (sourceReady ? "等待本人" : "需要来源证明") : sourceReady ? "Hold for owner" : "Need source proof",
      state: locale === "zh" ? (sourceReady ? "安全保持" : "需要证据") : sourceReady ? "Safe hold" : "Needs evidence",
      tone: sourceReady ? "info" : "warning",
      detail:
        locale === "zh"
          ? sourceReady
            ? "保持这个智能体可见，但不推进新工作。"
            : "来源健康不足以支持有把握的推进。"
          : sourceReady
            ? "Keep the agent visible without promoting new work."
            : "Source health is not strong enough for confident promotion.",
      next:
        locale === "zh"
          ? sourceReady
            ? "保持 lease 不变，在下一个本人审核窗口再复查。"
            : "先要求来源证据，再把这个智能体通道视为就绪。"
          : sourceReady
            ? "Leave the lease unchanged and revisit at the next owner review window."
            : "Require source evidence before treating this agent lane as ready."
    },
    {
      key: "no_dispatch",
      label: locale === "zh" ? "不要派发" : "Do not dispatch",
      state: locale === "zh" ? "无动作" : "No action",
      tone: "private",
      detail: locale === "zh" ? "即使智能体看起来就绪，此页也保持只读。" : "Keep this page read-only even when the agent looks ready.",
      next:
        locale === "zh"
          ? "不会创建隐藏执行、工具调用、发布、交易或日程变更。"
          : "No hidden execution, tool call, publish, trade, or schedule mutation is created."
    }
  ];
}

function postureChoiceKey(agentId: PrivateAgent["id"], key: string) {
  return `${agentId}:${key}`;
}

function AgentButton({
  agent,
  active,
  onSelect,
  locale
}: {
  agent: PrivateAgent;
  active: boolean;
  onSelect: () => void;
  locale: SiteLocale;
}) {
  const Icon = roleIcons[agent.role];
  const t = (value: string | undefined) => agentText(value, locale);

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className={`link-focus grid min-h-[14.5rem] gap-3 rounded-[8px] border p-4 text-left transition ${
        active
          ? "border-sky-300/55 bg-sky-300/14 shadow-[0_18px_50px_rgba(14,165,233,0.14)]"
          : "border-slate-700 bg-white/[0.045] hover:-translate-y-0.5 hover:border-sky-300/35 hover:bg-white/[0.07]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-11 items-center justify-center rounded-[8px] border border-sky-200/25 bg-sky-300/10 text-sky-100">
          <Icon size={21} aria-hidden />
        </span>
        <span className="grid justify-items-end gap-1">
          <StatusBadge tone={agent.tone}>{t(agent.state)}</StatusBadge>
          <span className="text-[0.68rem] font-semibold uppercase text-slate-500">{t(agent.sourceHealth)}</span>
        </span>
      </div>
      <div>
        <h3 className="text-base font-semibold text-white">{t(agent.name)}</h3>
        <p className="mt-1 text-xs font-bold uppercase text-yellow-100">{t(agent.role)}</p>
      </div>
      <p className="line-clamp-2 text-sm leading-6 text-slate-300">{t(agent.currentFocus)}</p>
      <div className="mt-auto grid gap-2 border-t border-slate-700 pt-3 text-xs text-slate-400">
        <span>
          <strong className="text-slate-300">{t("Lease")}:</strong> {t(agent.leaseStatus)}
        </span>
        <span>
          <strong className="text-slate-300">{t("Next")}:</strong> {t(agent.nextReview)}
        </span>
      </div>
    </button>
  );
}

function HeroPanel({
  activeAgent,
  metrics,
  locale
}: {
  activeAgent: PrivateAgent;
  metrics: readonly PrivateAgentMetric[];
  locale: SiteLocale;
}) {
  const ActiveIcon = roleIcons[activeAgent.role];
  const t = (value: string | undefined) => agentText(value, locale);
  const heroMetrics = metrics.map((metric, index) => ({
    ...metric,
    toneClass: [
      "border-sky-200/25 bg-sky-300/10 text-sky-100",
      "border-yellow-200/30 bg-yellow-300/10 text-yellow-100",
      "border-emerald-200/25 bg-emerald-300/10 text-emerald-100",
      "border-violet-200/25 bg-violet-300/10 text-violet-100"
    ][index % 4]
  }));

  return (
    <section
      className="panel relative isolate overflow-hidden p-0"
      aria-labelledby="private-agents-title"
    >
      <div
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-2/3 bg-[radial-gradient(circle_at_66%_18%,rgba(56,189,248,0.22),transparent_34%),radial-gradient(circle_at_82%_72%,rgba(250,204,21,0.13),transparent_30%),linear-gradient(135deg,transparent,rgba(59,130,246,0.10))]"
        aria-hidden
      />
      <div className="grid min-h-[30rem] gap-0 xl:grid-cols-[minmax(0,1.08fr)_31rem]">
        <div className="relative overflow-hidden p-6 md:p-8">
          <div
            className="pointer-events-none absolute -left-28 top-10 size-96 rounded-full bg-sky-500/14 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-0 right-0 h-56 w-[46rem] rounded-tl-full border border-sky-200/10 bg-[radial-gradient(circle_at_65%_100%,rgba(250,204,21,0.12),rgba(56,189,248,0.10)_42%,transparent_70%)]"
            aria-hidden
          />

          <div className="relative inline-flex items-center gap-2 rounded-[8px] border border-sky-200/25 bg-sky-300/10 px-3 py-2 text-xs font-bold uppercase text-sky-100">
            <Network size={14} aria-hidden />
            {t("Agent operations")}
          </div>

          <div className="relative mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-violet-200/25 bg-violet-300/10 px-3 py-1.5 text-xs font-bold uppercase text-violet-100">
              <LockKeyhole size={14} aria-hidden />
              {t("Owner-only")}
            </span>
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-emerald-200/25 bg-emerald-300/10 px-3 py-1.5 text-xs font-bold uppercase text-emerald-100">
              <Radio size={14} aria-hidden />
              {t("Read-only roster")}
            </span>
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 px-3 py-1.5 text-xs font-bold uppercase text-yellow-100">
              <ShieldCheck size={14} aria-hidden />
              {t("No execution")}
            </span>
          </div>

          <div className="relative mt-10 max-w-4xl">
            <p className="eyebrow">{t("Private MiniDora roster")}</p>
            <h2 id="private-agents-title" className="mt-2 max-w-4xl text-3xl font-semibold leading-[1.04] text-white md:text-5xl">
              {t("MiniDora Agents")}
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
              {t("Inspect the team behind the Personal OS: current leases, source health, recent outputs, handoffs, and guardrails. Intelligence without execution. You approve the work.")}
            </p>
          </div>

          <div className="relative mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {heroMetrics.map((metric) => (
              <div
                key={metric.label}
                className={`rounded-[8px] border p-4 ${metric.toneClass}`}
              >
                <p className="text-xs font-bold uppercase text-current">{t(metric.label)}</p>
                <strong className="mt-2 block text-3xl font-semibold text-white">{metric.value}</strong>
                <p className="mt-2 text-sm leading-5 text-slate-200/85">{t(metric.detail)}</p>
              </div>
            ))}
          </div>

          <div className="relative mt-6 grid gap-3 md:grid-cols-3">
            {[
              {
                label: "Doraemon coordinates",
                value: t(activeAgent.mission),
                icon: Waypoints
              },
              {
                label: "MiniDoras prepare",
                value: joinAgentText(activeAgent.outputs, locale),
                icon: Sparkles
              },
              {
                label: "Owner decides",
                value: t(activeAgent.nextReview),
                icon: UserCheck
              }
            ].map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.label} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 shadow-[0_16px_55px_rgba(14,165,233,0.08)] backdrop-blur">
                  <div className="flex items-center gap-2 text-sky-100">
                    <Icon size={16} aria-hidden />
                    <p className="text-xs font-bold uppercase">{t(item.label)}</p>
                  </div>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-200">{item.value}</p>
                </article>
              );
            })}
          </div>
        </div>

        <section
          className="relative border-t border-slate-700/70 bg-[#07111f]/45 p-5 md:p-6 xl:border-l xl:border-t-0"
          aria-labelledby="active-agent-title"
        >
          <div
            className="pointer-events-none absolute inset-x-6 top-6 h-48 rounded-full bg-sky-500/12 blur-3xl"
            aria-hidden
          />
          <div className="relative rounded-[8px] border border-slate-700 bg-[#07111f]/76 p-5 shadow-[0_20px_80px_rgba(14,165,233,0.10)] backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-yellow-100">{t("Active selection")}</p>
                <h3 id="active-agent-title" className="mt-1 text-2xl font-semibold text-white">
                  {t(activeAgent.name)}
                </h3>
                <p className="mt-1 text-xs font-bold uppercase text-sky-100">{t(activeAgent.role)}</p>
              </div>
              <span className="flex size-12 items-center justify-center rounded-[8px] border border-sky-200/25 bg-sky-300/10 text-sky-100">
                <ActiveIcon size={23} aria-hidden />
              </span>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-300">{t(activeAgent.mission)}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <StatusBadge tone={activeAgent.tone}>{t(activeAgent.state)}</StatusBadge>
              <StatusBadge tone={leaseStatusTone[activeAgent.leaseStatus]}>{t(activeAgent.leaseStatus)}</StatusBadge>
              <StatusBadge tone={sourceHealthTone[activeAgent.sourceHealth]}>{t(activeAgent.sourceHealth)}</StatusBadge>
            </div>
          </div>

          <div className="relative mt-4 grid gap-3">
            <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <p className="text-xs font-bold uppercase text-slate-400">{t("Current lease")}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-white">{t(activeAgent.lease)}</p>
            </div>
            <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <p className="text-xs font-bold uppercase text-slate-400">{t("Last output")}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-white">{t(activeAgent.lastOutput)}</p>
            </div>
            <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <p className="text-xs font-bold uppercase text-slate-400">{t("Next review")}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-white">{t(activeAgent.nextReview)}</p>
            </div>
            <div className="rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 p-4">
              <p className="text-xs font-bold uppercase text-yellow-100">{t("Guardrail")}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-yellow-50">{t(activeAgent.guardrail)}</p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

function AgentDetail({ agent, locale }: { agent: PrivateAgent; locale: SiteLocale }) {
  const t = (value: string | undefined) => agentText(value, locale);

  return (
    <section className="panel p-5" aria-labelledby="agent-detail-title" aria-live="polite">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{t("Agent detail")}</p>
          <h2 id="agent-detail-title" className="mt-2 text-2xl font-semibold text-white">
            {t(agent.name)}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{t(agent.currentFocus)}</p>
        </div>
        <StatusBadge tone={agent.tone}>{t(agent.state)}</StatusBadge>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="grid gap-4">
          <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <p className="text-xs font-bold uppercase text-slate-400">{t("Last output")}</p>
            <p className="mt-2 text-sm leading-6 text-slate-200">{t(agent.lastOutput)}</p>
          </div>
          <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <div className="flex items-center gap-2 text-sky-100">
              <History size={18} aria-hidden />
              <p className="text-xs font-bold uppercase text-slate-400">{t("State history")}</p>
            </div>
            <ol className="mt-4 grid gap-3">
              {agent.history.map((item) => (
                <li key={`${item.time}-${item.title}`} className="grid gap-3 rounded-[8px] border border-slate-700 bg-[#07111f]/58 p-3 sm:grid-cols-[4.5rem_minmax(0,1fr)_auto]">
                  <time className="text-xs font-bold uppercase text-slate-500">{t(item.time)}</time>
                  <div>
                    <p className="text-sm font-semibold text-white">{t(item.title)}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{t(item.detail)}</p>
                  </div>
                  <StatusBadge tone={item.tone}>{t(item.state)}</StatusBadge>
                </li>
              ))}
            </ol>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <p className="text-xs font-bold uppercase text-slate-400">{t("Inputs watched")}</p>
              <ul className="mt-3 grid gap-2 text-sm text-slate-300">
                {agent.inputs.map((input) => (
                  <li key={input} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-sky-100" size={15} aria-hidden />
                    <span>{t(input)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <p className="text-xs font-bold uppercase text-slate-400">{t("Outputs prepared")}</p>
              <ul className="mt-3 grid gap-2 text-sm text-slate-300">
                {agent.outputs.map((output) => (
                  <li key={output} className="flex gap-2">
                    <Sparkles className="mt-0.5 shrink-0 text-yellow-100" size={15} aria-hidden />
                    <span>{t(output)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <aside className="grid content-start gap-4">
          <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <p className="text-xs font-bold uppercase text-slate-400">{t("Capabilities")}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {agent.capabilities.map((capability) => (
                <span key={capability} className="rounded-[8px] border border-slate-700 bg-[#07111f]/70 px-2.5 py-1 text-xs text-slate-300">
                  {t(capability)}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase text-slate-400">{t("Source health")}</p>
              <StatusBadge tone={sourceHealthTone[agent.sourceHealth]}>{t(agent.sourceHealth)}</StatusBadge>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{t(agent.sourceDetail)}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function AgentOperationsMap({
  agents,
  activeAgent,
  locale
}: {
  agents: readonly PrivateAgent[];
  activeAgent: PrivateAgent;
  locale: SiteLocale;
}) {
  const sourceCounts = countBy(agents, (agent) => agent.sourceHealth);
  const leaseCounts = countBy(agents, (agent) => agent.leaseStatus);
  const t = (value: string | undefined) => agentText(value, locale);

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)]">
      <section className="panel p-5" aria-labelledby="agent-lease-map-title">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-100">
              <Network size={22} aria-hidden />
              <h2 id="agent-lease-map-title" className="text-2xl font-semibold text-white">
                {t("Lease map")}
              </h2>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              {t("A scan-first view of who is active, who needs review, and which lanes are intentionally queued.")}
            </p>
          </div>
          <StatusBadge tone="private">{t("Owner controlled")}</StatusBadge>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-5">
          {leaseStatusOrder.map((status) => {
            const count = leaseCounts.get(status) ?? 0;
            return (
              <article key={status} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
                <StatusBadge tone={leaseStatusTone[status]}>{t(status)}</StatusBadge>
                <strong className="mt-4 block text-3xl font-semibold text-white">{count}</strong>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  {locale === "zh" ? `${count} 个智能体处于这个状态。` : `${count === 1 ? "agent" : "agents"} currently in this posture.`}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-5 overflow-hidden rounded-[8px] border border-slate-700">
          {agents.map((agent) => {
            const Icon = roleIcons[agent.role];
            const active = agent.id === activeAgent.id;

            return (
              <div
                key={agent.id}
                className={`grid gap-3 border-b border-slate-700 p-3 last:border-b-0 md:grid-cols-[minmax(0,1fr)_11rem_9rem_9rem] md:items-center ${
                  active ? "bg-sky-300/12" : "bg-white/[0.025]"
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-[8px] border border-sky-200/25 bg-sky-300/10 text-sky-100">
                    <Icon size={17} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{t(agent.name)}</p>
                    <p className="truncate text-xs text-slate-400">{t(agent.lease)}</p>
                  </div>
                </div>
                <StatusBadge tone={agent.tone}>{t(agent.state)}</StatusBadge>
                <StatusBadge tone={leaseStatusTone[agent.leaseStatus]}>{t(agent.leaseStatus)}</StatusBadge>
                <StatusBadge tone={sourceHealthTone[agent.sourceHealth]}>{t(agent.sourceHealth)}</StatusBadge>
              </div>
            );
          })}
        </div>
      </section>

      <aside className="grid gap-5">
        <section className="panel p-5" aria-labelledby="agent-source-map-title">
          <div className="flex items-center gap-2 text-yellow-100">
            <Gauge size={22} aria-hidden />
            <h2 id="agent-source-map-title" className="text-2xl font-semibold text-white">
              {t("Source health")}
            </h2>
          </div>
          <div className="mt-5 grid gap-3">
            {sourceHealthOrder.map((source) => {
              const count = sourceCounts.get(source) ?? 0;
              const width = agents.length > 0 ? Math.round((count / agents.length) * 100) : 0;

              return (
                <div key={source} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <StatusBadge tone={sourceHealthTone[source]}>{t(source)}</StatusBadge>
                    <span className="text-sm font-semibold text-slate-300">
                      {count}/{agents.length}
                    </span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800" aria-hidden>
                    <div className="h-full rounded-full bg-sky-300" style={{ width: `${width}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="panel p-5" aria-labelledby="agent-command-path-title">
          <div className="flex items-center gap-2 text-sky-100">
            <Layers3 size={22} aria-hidden />
            <h2 id="agent-command-path-title" className="text-2xl font-semibold text-white">
              {t("Review paths")}
            </h2>
          </div>
          <div className="mt-5 grid gap-3">
            <Link href="/app/command" prefetch={false} className="link-focus group rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 transition hover:border-sky-200/35 hover:bg-sky-300/10">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm font-semibold text-white">
                  <UserCheck size={17} aria-hidden />
                  {t("Open Command")}
                </span>
                <ArrowRight className="text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-sky-100" size={16} aria-hidden />
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">{t("Prepare a mission packet for the selected agent lane.")}</p>
            </Link>
            <Link href="/app/review" prefetch={false} className="link-focus group rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 transition hover:border-sky-200/35 hover:bg-sky-300/10">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm font-semibold text-white">
                  <ClipboardCheck size={17} aria-hidden />
                  {t("Open Review Queue")}
                </span>
                <ArrowRight className="text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-sky-100" size={16} aria-hidden />
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">{t("Review owner-gated work before any future action path exists.")}</p>
            </Link>
            <Link
              href={isOwnerAgentId(activeAgent.id) ? ownerEventsHref(activeAgent.id) : ownerEventsHref()}
              prefetch={false}
              className="link-focus group rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 transition hover:border-sky-200/35 hover:bg-sky-300/10"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm font-semibold text-white">
                  <History size={17} aria-hidden />
                  {t("Open Events")}
                </span>
                <ArrowRight className="text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-sky-100" size={16} aria-hidden />
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">{t("Read the curated private event trail for this agent lane.")}</p>
            </Link>
          </div>
        </section>
      </aside>
    </section>
  );
}

function AgentReviewDrilldown({
  agent,
  ownerPostures,
  postureChoice,
  onPostureChoice,
  locale
}: {
  agent: PrivateAgent;
  ownerPostures: readonly AgentOwnerPosture[];
  postureChoice: string;
  onPostureChoice: (choice: string) => void;
  locale: SiteLocale;
}) {
  const t = (value: string | undefined) => agentText(value, locale);
  const readinessRows = reviewRowsForAgent(agent, locale);
  const safeOutputs = safeOutputsForAgent(agent, locale);
  const selectedPosture = ownerPostures.find((posture) => posture.key === postureChoice) ?? ownerPostures[0];

  return (
    <section className="panel p-5" aria-labelledby="agent-review-drilldown-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-yellow-100">
            <ClipboardCheck size={22} aria-hidden />
            <h2 id="agent-review-drilldown-title" className="text-2xl font-semibold text-white">
              {t("Owner review drilldown")}
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            {t("Decide how to read the selected agent lane. This inspector is local-only: it does not dispatch agents, create tasks, publish notes, or promote leases.")}
          </p>
        </div>
        <StatusBadge tone="private">{t("Local only")}</StatusBadge>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <article className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-5" aria-labelledby="agent-readiness-title">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase text-yellow-100">{t("Selected lane")}</p>
              <h3 id="agent-readiness-title" className="mt-2 text-2xl font-semibold text-white">
                {t(agent.name)}
              </h3>
              <p className="mt-2 text-xs font-bold uppercase text-slate-400">
                {t(agent.role)}, {readinessLabel(readinessRows, locale)}
              </p>
            </div>
            <StatusBadge tone={agent.tone}>{t(agent.state)}</StatusBadge>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
            {readinessRows.map((row) => (
              <div key={`${agent.id}-${row.label}`} className="rounded-[8px] border border-slate-700 bg-[#07111f]/58 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-white">{t(row.label)}</h4>
                  <StatusBadge tone={row.tone}>{t(row.state)}</StatusBadge>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-400">{t(row.detail)}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-[8px] border border-red-300/30 bg-red-400/8 p-4">
            <h4 className="text-xs font-bold uppercase text-red-100">{t("Guardrail")}</h4>
            <p className="mt-2 text-sm leading-6 text-slate-300">{t(agent.guardrail)}</p>
          </div>
        </article>

        <aside className="grid content-start gap-4">
          <section className="rounded-[8px] border border-yellow-200/35 bg-yellow-300/10 p-4" aria-labelledby="agent-owner-posture-title">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-yellow-100">
                  <UserCheck size={17} aria-hidden />
                  <h3 id="agent-owner-posture-title" className="text-sm font-semibold text-white">
                    {t("Owner posture")}
                  </h3>
                </div>
                <p className="mt-2 text-xs leading-5 text-yellow-50/80">
                  {t("Choose a local reading posture for this agent. The choice is not saved or sent.")}
                </p>
              </div>
              <StatusBadge tone="private">{t("No dispatch")}</StatusBadge>
            </div>
            {selectedPosture ? (
              <p className="sr-only" aria-live="polite">
                {t(agent.name)} {t("posture")}: {selectedPosture.label}. {selectedPosture.next}
              </p>
            ) : null}

            <div className="mt-4 grid gap-2">
              {ownerPostures.map((posture) => {
                const active = posture.key === selectedPosture?.key;

                return (
                  <button
                    key={postureChoiceKey(agent.id, posture.key)}
                    type="button"
                    aria-pressed={active}
                    onClick={() => onPostureChoice(posture.key)}
                    className={`link-focus rounded-[8px] border p-3 text-left transition ${
                      active
                        ? "border-yellow-100/65 bg-yellow-200/14 text-white"
                        : "border-slate-700 bg-[#07111f]/58 text-slate-300 hover:border-yellow-100/35 hover:bg-white/[0.07]"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-semibold">{posture.label}</span>
                      <StatusBadge tone={posture.tone}>{posture.state}</StatusBadge>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-400">{posture.detail}</p>
                  </button>
                );
              })}
            </div>

            {selectedPosture ? (
              <div className="mt-4 rounded-[8px] border border-slate-700 bg-[#07111f]/70 p-3">
                <h4 className="text-xs font-bold uppercase text-slate-400">{t("If selected")}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-300">{selectedPosture.next}</p>
              </div>
            ) : null}
          </section>

          <section className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <h3 className="text-sm font-semibold text-white">{t("Safe outputs")}</h3>
            <div className="mt-3 grid gap-2">
              {safeOutputs.map((output) => (
                <div key={`${agent.id}-${output.label}`} className="rounded-[8px] border border-slate-700 bg-[#07111f]/58 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                      <CheckCircle2 size={15} aria-hidden />
                      {t(output.label)}
                    </span>
                    <StatusBadge tone={output.tone}>{t(output.state)}</StatusBadge>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{t(output.detail)}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}

function CoverageAndBoundary({
  coverage,
  boundary,
  locale
}: {
  coverage: readonly PrivateAgentCoverageLane[];
  boundary: readonly string[];
  locale: SiteLocale;
}) {
  const t = (value: string | undefined) => agentText(value, locale);

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <section className="panel p-5" aria-labelledby="agent-coverage-title">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-100">
              <Waypoints size={22} aria-hidden />
              <h2 id="agent-coverage-title" className="text-2xl font-semibold text-white">
                {t("Coverage lanes")}
              </h2>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              {t("The roster is useful only when every lane says who owns the next review and what evidence is missing.")}
            </p>
          </div>
          <StatusBadge tone="info">{t("Review map")}</StatusBadge>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {coverage.map((lane, index) => (
            <article key={lane.label} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <div className="flex items-start justify-between gap-3">
                <span
                  className="flex size-9 items-center justify-center rounded-[8px] border border-sky-200/35 bg-sky-200/16 text-xs font-semibold text-white"
                  aria-hidden
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <StatusBadge tone={lane.tone}>{t(lane.state)}</StatusBadge>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{t(lane.label)}</h3>
              <p className="mt-1 text-xs font-bold uppercase text-yellow-100">{t(lane.owner)}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{t(lane.detail)}</p>
            </article>
          ))}
        </div>
      </section>

      <aside className="panel p-5" aria-labelledby="agent-boundary-title">
        <div className="flex items-center gap-2 text-yellow-100">
          <ShieldCheck size={22} aria-hidden />
          <h2 id="agent-boundary-title" className="text-2xl font-semibold text-white">
            {t("Boundary")}
          </h2>
        </div>
        <ul className="mt-5 grid gap-3">
          {boundary.map((item) => (
            <li key={item} className="flex gap-3 rounded-[8px] border border-slate-700 bg-white/[0.045] p-3 text-sm leading-6 text-slate-300">
              <CheckCircle2 className="mt-1 shrink-0 text-sky-100" size={16} aria-hidden />
              <span>{t(item)}</span>
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
}

function HandoffsAndQueue({
  activeAgent,
  handoffs,
  reviewQueue,
  locale
}: {
  activeAgent: PrivateAgent;
  handoffs: readonly PrivateAgentHandoff[];
  reviewQueue: readonly ReviewQueuePreviewItem[];
  locale: SiteLocale;
}) {
  const t = (value: string | undefined) => agentText(value, locale);
  const relatedHandoffs = handoffs.filter(
    (handoff) => handoff.fromAgentId === activeAgent.id || handoff.toAgentId === activeAgent.id
  );

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <section className="panel p-5" aria-labelledby="agent-handoff-title">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-100">
              <Radio size={22} aria-hidden />
              <h2 id="agent-handoff-title" className="text-2xl font-semibold text-white">
                {t("Handoffs")}
              </h2>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              {t("Recent coordination chain for the selected agent. Empty states are explicit when no direct handoff has been recorded for this slice.")}
            </p>
          </div>
          <StatusBadge tone="private">{t("No dispatch")}</StatusBadge>
        </div>

        {relatedHandoffs.length > 0 ? (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {relatedHandoffs.map((handoff) => (
              <article key={`${handoff.time}-${handoff.from}-${handoff.to}`} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-white">{t(handoff.time)}</h3>
                  <StatusBadge tone={handoff.tone}>{t(handoff.state)}</StatusBadge>
                </div>
                <p className="mt-2 text-xs font-bold uppercase text-yellow-100">
                  {locale === "zh" ? `${t(handoff.from)} → ${t(handoff.to)}` : `${handoff.from} to ${handoff.to}`}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-300">{t(handoff.summary)}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <p className="text-sm font-semibold text-white">{t("No direct handoff recorded.")}</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {t("This agent has no direct handoff in the current slice evidence. Keep the lease visible, but do not invent a coordination chain.")}
            </p>
          </div>
        )}
      </section>

      <aside className="panel p-5" aria-labelledby="agent-review-title">
        <div className="flex items-center gap-2 text-yellow-100">
          <ClipboardCheck size={22} aria-hidden />
          <h2 id="agent-review-title" className="text-2xl font-semibold text-white">
            {t("Review queue")}
          </h2>
        </div>
        <div className="mt-5 grid gap-3">
          {reviewQueue.slice(0, REVIEW_QUEUE_PREVIEW_LIMIT).map((item) => (
            <article key={item.title} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-white">{t(item.title)}</h3>
                <StatusBadge tone={item.tone}>{t(item.decision)}</StatusBadge>
              </div>
              <p className="mt-2 text-xs font-bold uppercase text-slate-400">
                {t(item.urgency)} - {t(item.agent)}
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-400">{t(item.note)}</p>
            </article>
          ))}
        </div>
        <Link href="/app/review" className="link-focus mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-100 hover:text-white">
          {t("Open Review Queue")}
          <LineChart size={15} aria-hidden />
        </Link>
      </aside>
    </section>
  );
}

export function PrivateAgentsSurface({
  agents,
  metrics,
  coverage,
  boundary,
  handoffs,
  reviewQueue,
  initialAgentId
}: PrivateAgentsSurfaceProps) {
  const { locale } = useLanguage();
  const t = (value: string | undefined) => agentText(value, locale);
  const [activeAgentId, setActiveAgentId] = useState(initialAgentId ?? agents[0]?.id ?? "");
  const [postureChoices, setPostureChoices] = useState<Partial<Record<PrivateAgent["id"], string>>>({});
  const activeAgent = useMemo(
    () => agents.find((agent) => agent.id === activeAgentId) ?? agents[0],
    [activeAgentId, agents]
  );

  if (!activeAgent) {
    return null;
  }

  const activePostures = ownerPosturesForAgent(activeAgent, locale);
  const postureChoice = postureChoices[activeAgent.id] ?? activePostures[0]?.key ?? "";

  function selectAgent(agentId: PrivateAgent["id"]) {
    setActiveAgentId(agentId);

    if (typeof window === "undefined") {
      return;
    }

    const nextUrl = agentRouteUrl(agentId);

    if (nextUrl !== currentAgentUrl()) {
      window.history.pushState(null, "", nextUrl);
    }
  }

  function handlePostureChoice(choice: string) {
    setPostureChoices((current) => ({
      ...current,
      [activeAgent.id]: choice
    }));
  }

  useEffect(() => {
    function syncFromLocation() {
      const agentId = agentIdFromSearch(window.location.search, agents) ?? agents[0]?.id;

      if (agentId) {
        setActiveAgentId((current) => (current === agentId ? current : agentId));
      }
    }

    syncFromLocation();
    window.addEventListener("popstate", syncFromLocation);
    return () => window.removeEventListener("popstate", syncFromLocation);
  }, [agents]);

  return (
    <div className="grid gap-5" data-i18n-skip>
      <HeroPanel activeAgent={activeAgent} metrics={metrics} locale={locale} />

      <section className="panel-quiet p-4" aria-labelledby="minidora-roster-title">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3 px-1">
          <div>
            <div className="flex items-center gap-2 text-sky-100">
              <Bot size={22} aria-hidden />
              <h2 id="minidora-roster-title" className="text-2xl font-semibold text-white">
                {t("MiniDora roster")}
              </h2>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              {t("Select an agent to inspect its lease, recent history, inputs, outputs, source posture, and guardrail.")}
            </p>
          </div>
          <StatusBadge tone="info">{t("Interactive inspector")}</StatusBadge>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {agents.map((agent) => (
            <AgentButton
              key={agent.id}
              agent={agent}
              active={agent.id === activeAgent.id}
              onSelect={() => selectAgent(agent.id)}
              locale={locale}
            />
          ))}
        </div>
      </section>

      <AgentOperationsMap agents={agents} activeAgent={activeAgent} locale={locale} />
      <AgentReviewDrilldown
        agent={activeAgent}
        ownerPostures={activePostures}
        postureChoice={postureChoice}
        onPostureChoice={handlePostureChoice}
        locale={locale}
      />
      <AgentDetail agent={activeAgent} locale={locale} />
      <CoverageAndBoundary coverage={coverage} boundary={boundary} locale={locale} />
      <HandoffsAndQueue activeAgent={activeAgent} handoffs={handoffs} reviewQueue={reviewQueue} locale={locale} />
    </div>
  );
}
