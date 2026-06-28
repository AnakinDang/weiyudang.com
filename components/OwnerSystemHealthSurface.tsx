"use client";

import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  FileSearch,
  Gauge,
  GitBranch,
  Layers3,
  LockKeyhole,
  Radio,
  Route,
  Server,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Waypoints,
  XCircle
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { translateToZh, type SiteLocale } from "@/lib/site-i18n";

type SystemTone = "normal" | "info" | "warning" | "private" | "danger";
type PrivateSystemPosture = "healthy" | "watch" | "blocked";

type PrivateSystemEvidence = {
  label: string;
  state: string;
  tone: SystemTone;
  detail: string;
};

type PrivateSystemService = {
  id: string;
  label: string;
  domain: string;
  posture: PrivateSystemPosture;
  state: string;
  tone: SystemTone;
  detail: string;
  visibleSignal: string;
  ownerGate: string;
  evidence: readonly PrivateSystemEvidence[];
  risks: readonly string[];
  noGo: readonly string[];
};

type PrivateSystemSignal = {
  id: string;
  label: string;
  value: string;
  tone: SystemTone;
  scope: string;
  detail: string;
  lastChecked: string;
};

type PrivateSystemGap = {
  id: string;
  label: string;
  state: string;
  tone: SystemTone;
  detail: string;
  notedAt: string;
  revisitWhen: string;
};

type PrivateSystemMetric = {
  label: string;
  value: string;
  detail: string;
};

type PrivateSystemDiagnosticLane = {
  label: string;
  owner: string;
  state: string;
  tone: SystemTone;
  detail: string;
};

export type OwnerSystemHealthData = {
  services: readonly PrivateSystemService[];
  signals: readonly PrivateSystemSignal[];
  gaps: readonly PrivateSystemGap[];
  metrics: readonly PrivateSystemMetric[];
  lanes: readonly PrivateSystemDiagnosticLane[];
  diagnostics: readonly string[];
};

type FilterValue = "all" | "attention" | "public" | "owner";

type FilterOption = {
  label: string;
  value: FilterValue;
  icon: LucideIcon;
};

const filters = [
  { label: "All", value: "all", icon: Layers3 },
  { label: "Attention", value: "attention", icon: ShieldAlert },
  { label: "Public boundary", value: "public", icon: Route },
  { label: "Owner cockpit", value: "owner", icon: LockKeyhole }
] as const satisfies readonly FilterOption[];

const unavailableControls = ["Repair action", "Release action", "Queue mutation", "Runtime detail view", "Automatic recovery"] as const;

const postureCopy = {
  healthy: {
    label: "Held",
    detail: "Core boundaries are in place and visible at a safe summary level.",
    icon: CheckCircle2
  },
  watch: {
    label: "Watch",
    detail: "The system is honest about weak signals and missing evidence.",
    icon: CircleDashed
  },
  blocked: {
    label: "Blocked",
    detail: "Execution paths remain unavailable until a separate audit design exists.",
    icon: LockKeyhole
  }
} as const satisfies Record<PrivateSystemPosture, { label: string; detail: string; icon: LucideIcon }>;

const constellationIcons = [LockKeyhole, ShieldCheck, Radio, FileSearch, Waypoints, XCircle] as const;

const systemZhOverrides: Partial<Record<string, string>> = {
  "Owner cockpit": "私密驾驶舱",
  "Repair action": "修复动作",
  "Release action": "发布动作",
  "Queue mutation": "队列变更",
  "Runtime detail view": "运行时详情视图",
  "Automatic recovery": "自动恢复",
  "A private posture room for Doraemon and the MiniDoras: service status, review gates, boundary checks, and known gaps without turning diagnostics into an operations console.":
    "这是 Doraemon 和 MiniDoras 的私密状态室：展示服务状态、审核门禁、边界检查和已知缺口，但不把诊断变成运维控制台。",
  "System health filters": "系统健康筛选",
  Services: "服务",
  "System map": "系统地图",
  "Select a node to inspect posture, evidence, and the owner boundary. The map shows relationships without exposing runtime internals.":
    "选择一个节点查看姿态、证据和本人边界。地图展示关系，但不暴露运行时内部信息。",
  Interactive: "可交互",
  "Diagnostic lanes": "诊断通道",
  "The lanes describe where Doraemon can summarize posture and where the owner boundary stops action.":
    "这些通道说明 Doraemon 可以在哪里总结姿态，以及本人边界在哪里阻止行动。",
  "System signals and boundary": "系统信号与边界",
  Signals: "信号",
  "Summary only": "仅摘要",
  "Signals are deliberately summary-level. Missing feeds are shown as gaps instead of pretending precision.":
    "信号刻意保持摘要级别。缺失的数据源会被显示为缺口，而不是假装精确。",
  "Safe abstraction": "安全抽象",
  "Last checked": "上次检查",
  "Known gaps": "已知缺口",
  "Noted:": "记录：",
  "Revisit:": "复查：",
  "System diagnostic boundary": "系统诊断边界",
  "Diagnostic boundary": "诊断边界",
  "This page can summarize posture and gaps. It cannot expose internals or mutate runtime state.":
    "本页可以总结姿态和缺口。它不能暴露内部信息，也不能变更运行时状态。",
  "Review schedules": "查看日程",
  "Diagnostics empty": "诊断为空",
  "No owner-visible diagnostics are available in this private source. The surface remains read-only and avoids exposing runtime internals or repair controls.":
    "这个私密数据源中没有本人可见的诊断。界面保持只读，并避免暴露运行时内部信息或修复控制。",
  "Private system health diagnostics": "私密系统健康诊断",
  "Interactive system health workspace": "可交互系统健康工作区",

  "Private gate": "私密门禁",
  "The route guard must redirect before private UI is sent.": "路由守卫必须在私密 UI 发出前完成重定向。",
  "Session material": "会话材料",
  "The page never renders credential values or cookie contents.": "页面绝不渲染凭据值或 cookie 内容。",
  "Public pages": "公开页面",
  Separate: "分离",
  "Public Doraemon pages remain reachable without owner auth.": "公开 Doraemon 页面无需本人认证也可访问。",
  "Auth copy can drift if route smoke is skipped.": "如果跳过路由 smoke，认证文案可能漂移。",
  "Future private APIs must check auth server-side.": "未来私密 API 必须在服务端检查认证。",
  "No credential display": "不显示凭据",
  "No client-readable session": "不提供客户端可读会话",
  "No unauthenticated app shell": "未认证时不渲染 app shell",

  "Public relay": "公开 relay",
  "Public surfaces use safe labels, public schemas, and no owner controls.":
    "公开界面使用安全标签、公开 schema，并且没有本人控制项。",
  "Public dashboard uses sanitized status and fixed labels.": "公开 dashboard 使用脱敏状态和固定标签。",
  "Public fields stay allowlisted; private detail belongs in Owner Cockpit only.":
    "公开字段保持白名单；私密细节只属于 Owner Cockpit。",
  IDs: "ID",
  Opaque: "不透明",
  "Public IDs must remain hashed or fixed public labels.": "公开 ID 必须保持哈希化或固定公开标签。",
  Titles: "标题",
  Fixed: "固定",
  "Public text cannot expose private task names or prompts.": "公开文本不能暴露私密任务名或 prompt。",
  Controls: "控制项",
  "Public surfaces stay display-only.": "公开界面保持仅展示。",
  "A future import from private operations data into public routes could leak mock detail.":
    "未来若把私密运维数据导入公开路由，可能泄露模拟细节。",
  "No raw IDs": "不显示原始 ID",
  "No prompt bodies": "不显示 prompt 正文",
  "No owner controls": "不提供本人控制项",

  "Signal posture": "信号姿态",
  "Mock source": "模拟来源",
  "The private cockpit has no live internal event source connected yet.":
    "私密驾驶舱尚未连接实时内部事件源。",
  "No live private event feed is attached to this page yet.": "本页尚未接入实时私密事件 feed。",
  "Use summary freshness only until a private source exists.": "在私密来源存在前，只使用摘要新鲜度。",
  "Owner can see the absence of a private feed without seeing runtime records.":
    "本人可以看到私密 feed 缺失，而不看到运行时记录。",
  "Live source": "实时来源",
  "No private event feed is attached to this web page.": "这个网页没有接入私密事件 feed。",
  "Public relay health should not become private runtime evidence.":
    "公开 relay 健康状态不应变成私密运行时证据。",
  Fallback: "后备",
  "The UI shows safe posture instead of raw runtime records.": "界面展示安全姿态，而不是原始运行时记录。",
  "Freshness can look more precise than it is if mock wording is too confident.":
    "如果模拟文案过于肯定，新鲜度会显得比实际更精确。",
  "No event payload": "不显示事件 payload",
  "No internal feed address": "不显示内部 feed 地址",
  "No implementation label": "不显示实现标签",

  "Review queue health": "审核队列健康",
  "Owner decisions": "本人决策",
  "Review gated": "审核门禁",
  "Items remain in review state until owner action flows are designed.":
    "在本人动作流程设计完成前，条目保持审核状态。",
  "Open decisions are visible in the Review Queue cockpit.": "开放决策在 Review Queue 驾驶舱中可见。",
  "Owner chooses what moves; this page only summarizes posture.": "由本人决定什么推进；本页只总结姿态。",
  "Review state": "审核状态",
  "No silent auto-promotion from review into execution.": "不会从审核静默自动推进到执行。",
  "Blocked work": "阻塞工作",
  "Blocked or deferred work should be named as posture, not repaired here.":
    "阻塞或延期的工作应作为姿态命名，而不是在这里修复。",
  "Approve, reject, publish, and dispatch controls live outside this page.":
    "批准、拒绝、发布和派发控制都位于本页之外。",
  "Queue health will need a real source before it can become operational evidence.":
    "队列健康需要真实来源后，才能成为运维证据。",
  "No one-click approve": "不提供一键批准",
  "No publish action": "不提供发布动作",
  "No runtime dispatch": "不提供运行时派发",

  "Command runtime": "指挥运行时",
  "Command surface": "指挥界面",
  "The command surface is draft-only until a separate audited API exists.":
    "在单独审计过的 API 存在前，指挥界面只用于草稿。",
  "Command work can be drafted, but not sent to runtime.": "指挥工作可以起草，但不能发送到运行时。",
  "Write APIs need auth, audit, recovery, and error handling before controls exist.":
    "写入 API 在出现控制项前，需要认证、审计、恢复和错误处理。",
  "Write API": "写入 API",
  "No mutation endpoint is exposed from the cockpit.": "驾驶舱不暴露变更端点。",
  Recovery: "恢复",
  "Future commands need a reviewable action log.": "未来指令需要可审核的动作日志。",
  "Future repair or command flows need a recovery model.": "未来修复或指挥流程需要恢复模型。",
  "Adding a control before audit design would turn diagnostics into execution.":
    "在审计设计完成前加入控制项，会把诊断变成执行。",
  "No command dispatch": "不派发指令",
  "No hidden retry": "不隐藏重试",
  "No unaudited mutation": "不做未经审计的变更",

  "Trading Team remains research-only with no broker write or order path.":
    "Trading Team 保持仅研究，没有券商写入或下单路径。",
  "Research posture is visible; execution remains absent.": "研究姿态可见；执行能力仍然不存在。",
  "Owner may read research, not trigger order flow from the web cockpit.":
    "本人可以阅读研究，但不能从 web 驾驶舱触发订单流。",
  "Trading Team remains research-only.": "Trading Team 保持仅研究。",
  "No broker, paper, live, or account mutation path is rendered.":
    "不渲染券商、模拟盘、实盘或账户变更路径。",
  Recommendations: "建议",
  Avoided: "已避免",
  "Signals stay evidence-oriented, not order recommendations.": "信号保持证据导向，而不是订单建议。",
  "Future data integration must not imply execution readiness.": "未来数据集成不得暗示执行已就绪。",
  "No recommendation wording": "不使用建议性措辞",

  "Private cockpit": "私密驾驶舱",
  "Queue health": "队列健康",
  "Decision items remain gated until explicit owner action design exists.":
    "决策条目在明确的本人动作设计存在前保持门禁。",
  "Recent failures": "近期故障",
  "None surfaced": "未暴露",
  "No private failure feed is connected; this is not a runtime-record assertion.":
    "没有连接私密故障 feed；这不是运行时记录断言。",
  "Bundle boundary": "bundle 边界",
  "Release gate": "发布门禁",
  "Build artifact": "构建产物",
  "Before merge": "合并前",
  "Private event source not connected": "私密事件源未连接",
  "Known gap": "已知缺口",
  "The page is intentionally honest about missing private telemetry rather than inventing precision.":
    "页面刻意诚实呈现私密遥测缺失，而不是虚构精确度。",
  "Current slice": "当前切片",
  "When a private source is designed": "当私密来源完成设计时",
  "Repair API not designed": "修复 API 尚未设计",
  "Repair, release, queue mutation, recovery, and runtime-detail access require separate auth and audit design.":
    "修复、发布、队列变更、恢复和运行时详情访问都需要单独的认证与审计设计。",
  "Before any repair control appears": "任何修复控制出现之前",
  "Private operations data should not be imported by public routes or public bundles.":
    "私密运维数据不应被公开路由或公开 bundle 导入。",
  "Release review": "发布审核",
  "Summary gaps or weak signals": "摘要缺口或弱信号",
  "Evidence, gaps, or controls": "证据、缺口或控制项",
  Telemetry: "遥测",
  "Owner auth is the first diagnostic boundary: private shell must not render before login.":
    "本人认证是第一条诊断边界：登录前不得渲染私密 shell。",
  "Event freshness and failure feed are shown as posture until a private source is connected.":
    "在私密来源接入前，事件新鲜度和故障 feed 都以姿态展示。",
  "Review Queue and schedules stay visible, but this page cannot promote work.":
    "Review Queue 和日程保持可见，但本页不能推进工作。",
  "Repair, command, trading, and broker paths stay unavailable without audit design.":
    "没有审计设计时，修复、指挥、交易和券商路径保持不可用。",
  "Diagnostics are summary-level only.": "诊断只保持摘要级别。",
  "No implementation address, credential value, local machine label, or runtime record line is rendered.":
    "不渲染实现地址、凭据值、本机标签或运行时记录行。",
  "Bundle boundary checks are a release gate for credential values, machine paths, and runtime records.":
    "bundle 边界检查是凭据值、机器路径和运行时记录的发布门禁。",
  "Repair, release, and recovery workflows need separate authenticated APIs.":
    "修复、发布和恢复工作流需要单独认证过的 API。",
  "Public Doraemon status and private Owner Cockpit status stay separated.":
    "公开 Doraemon 状态和私密 Owner Cockpit 状态保持分离。"
};

function systemText(value: string | undefined, locale: SiteLocale) {
  if (!value) return "";
  return locale === "zh" ? systemZhOverrides[value] ?? translateToZh(value) ?? value : value;
}

function SystemBadge({ children, tone = "info" }: { children: React.ReactNode; tone?: SystemTone }) {
  const { locale } = useLanguage();
  const className = {
    normal: "border-emerald-200/25 bg-emerald-300/10 text-emerald-100",
    info: "border-sky-200/25 bg-sky-300/10 text-sky-100",
    warning: "border-yellow-200/30 bg-yellow-300/10 text-yellow-100",
    private: "border-violet-200/25 bg-violet-300/10 text-violet-100",
    danger: "border-red-300/30 bg-red-300/10 text-red-100"
  }[tone];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-[8px] border px-2.5 py-1 text-xs font-bold uppercase ${className}`}>
      {typeof children === "string" ? systemText(children, locale) : children}
    </span>
  );
}

function filterServices(services: readonly PrivateSystemService[], activeFilter: FilterValue) {
  if (activeFilter === "attention") {
    return services.filter((service) => service.posture !== "healthy" || service.tone === "warning" || service.tone === "private");
  }

  if (activeFilter === "public") {
    return services.filter((service) => service.id.includes("public") || service.domain.toLowerCase().includes("public"));
  }

  if (activeFilter === "owner") {
    return services.filter(
      (service) =>
        service.id.includes("owner") ||
        service.id.includes("review") ||
        service.id.includes("command") ||
        service.domain.toLowerCase().includes("owner")
    );
  }

  return [...services];
}

function healthSummary(services: readonly PrivateSystemService[]) {
  const healthy = services.filter((service) => service.posture === "healthy").length;
  const watch = services.filter((service) => service.posture === "watch").length;
  const blocked = services.filter((service) => service.posture === "blocked").length;

  return { healthy, watch, blocked };
}

function evidenceSummary(service: PrivateSystemService) {
  const ready = service.evidence.filter((item) => item.tone === "normal" || item.state === "Held" || item.state === "Visible").length;
  return `${ready} / ${service.evidence.length}`;
}

function SystemHero({ data, selectedService }: { data: OwnerSystemHealthData; selectedService: PrivateSystemService }) {
  const { locale } = useLanguage();
  const t = (value: string | undefined) => systemText(value, locale);
  const summary = healthSummary(data.services);
  const PostureIcon = postureCopy[selectedService.posture].icon;
  const metricToneClass = (label: string) => {
    const normalized = label.toLowerCase();
    if (normalized.includes("healthy")) {
      return "border-emerald-200/25 bg-emerald-300/10 text-emerald-100";
    }
    if (normalized.includes("watch")) {
      return "border-yellow-200/30 bg-yellow-300/10 text-yellow-100";
    }
    if (normalized.includes("blocked")) {
      return "border-violet-200/25 bg-violet-300/10 text-violet-100";
    }
    return "border-sky-200/25 bg-sky-300/10 text-sky-100";
  };

  return (
    <section
      className="panel relative isolate overflow-hidden p-0"
      aria-labelledby="system-health-title"
    >
      <div
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-2/3 bg-[radial-gradient(circle_at_66%_18%,rgba(56,189,248,0.22),transparent_34%),radial-gradient(circle_at_82%_72%,rgba(250,204,21,0.13),transparent_30%),linear-gradient(135deg,transparent,rgba(59,130,246,0.10))]"
        aria-hidden
      />
      <div className="grid min-h-[31rem] gap-0 xl:grid-cols-[minmax(0,1fr)_25rem] 2xl:grid-cols-[minmax(0,1fr)_29rem]">
        <div className="relative overflow-hidden p-6 md:p-8">
          <div className="pointer-events-none absolute -left-28 top-10 size-96 rounded-full bg-sky-500/14 blur-3xl" aria-hidden />
          <div
            className="pointer-events-none absolute bottom-0 right-0 h-56 w-[46rem] rounded-tl-full border border-sky-200/10 bg-[radial-gradient(circle_at_65%_100%,rgba(250,204,21,0.12),rgba(56,189,248,0.10)_42%,transparent_70%)]"
            aria-hidden
          />

          <div className="relative inline-flex items-center gap-2 rounded-[8px] border border-sky-200/25 bg-sky-300/10 px-3 py-2 text-xs font-bold uppercase text-sky-100">
            <Gauge size={14} aria-hidden />
            {t("Owner System Health")}
          </div>

          <div className="relative mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-violet-200/25 bg-violet-300/10 px-3 py-1.5 text-xs font-bold uppercase text-violet-100">
              <LockKeyhole size={14} aria-hidden />
              {t("Owner-only")}
            </span>
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-emerald-200/25 bg-emerald-300/10 px-3 py-1.5 text-xs font-bold uppercase text-emerald-100">
              <FileSearch size={14} aria-hidden />
              {t("Evidence-first")}
            </span>
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 px-3 py-1.5 text-xs font-bold uppercase text-yellow-100">
              <ShieldCheck size={14} aria-hidden />
              {t("Read-only posture")}
            </span>
          </div>

          <div className="relative mt-10 grid gap-8 2xl:grid-cols-[minmax(18rem,0.82fr)_minmax(24rem,1fr)]">
            <div>
              <p className="eyebrow">{t("Private diagnostics room")}</p>
              <h2 id="system-health-title" className="mt-2 max-w-3xl text-3xl font-semibold leading-[1.04] text-white md:text-5xl">
                {t("System Health")}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                {t("A private posture room for Doraemon and the MiniDoras: service status, review gates, boundary checks, and known gaps without turning diagnostics into an operations console.")}
              </p>
            </div>

            <div className="relative min-h-[18rem] rounded-[8px] border border-slate-700 bg-[#07111f]/72 p-5 shadow-[0_24px_90px_rgba(14,165,233,0.10)] backdrop-blur">
              <div className="absolute inset-6 rounded-full border border-sky-200/12" aria-hidden />
              <div className="absolute inset-x-12 top-1/2 border-t border-sky-200/12" aria-hidden />
              <div className="absolute inset-y-12 left-1/2 border-l border-sky-200/12" aria-hidden />
              <div className="relative flex h-full min-h-[15rem] items-center justify-center">
                <div className="flex size-24 items-center justify-center rounded-full border border-sky-200/35 bg-sky-300/16 text-sky-50 shadow-[0_22px_70px_rgba(14,165,233,0.18)]">
                  <Gauge size={36} aria-hidden />
                </div>
                {data.services.slice(0, 6).map((service, index) => {
                  const Icon = constellationIcons[index] ?? Server;
                  const angle = (index / Math.max(data.services.slice(0, 6).length, 1)) * Math.PI * 2 - Math.PI / 2;
                  const x = Math.cos(angle) * 8;
                  const y = Math.sin(angle) * 6;
                  const isSelected = service.id === selectedService.id;

                  return (
                    <div
                      key={service.id}
                      className={`absolute flex size-14 items-center justify-center rounded-[8px] border transition ${
                        isSelected
                          ? "border-sky-300/60 bg-sky-300/18 text-white shadow-[0_12px_34px_rgba(14,165,233,0.18)]"
                          : "border-slate-700 bg-slate-950/70 text-slate-300"
                      }`}
                      style={{ left: "50%", top: "50%", transform: `translate(-50%, -50%) translate(${x}rem, ${y}rem)` }}
                      aria-label={t(service.label)}
                    >
                      <Icon size={20} aria-hidden />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="relative mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {data.metrics.map((metric) => (
              <div
                key={metric.label}
                className={`rounded-[8px] border p-4 ${metricToneClass(metric.label)}`}
              >
                <p className="text-xs font-bold uppercase text-current">{t(metric.label)}</p>
                <strong className="mt-2 block text-3xl font-semibold text-white">{metric.value}</strong>
                <p className="mt-2 text-sm leading-5 text-slate-200/85">{t(metric.detail)}</p>
              </div>
            ))}
          </div>
        </div>

        <section
          className="relative border-t border-slate-700/70 bg-[#07111f]/45 p-5 md:p-6 xl:border-l xl:border-t-0"
          aria-labelledby="posture-card-title"
        >
          <div className="pointer-events-none absolute inset-x-6 top-6 h-48 rounded-full bg-sky-500/12 blur-3xl" aria-hidden />
          <div className="relative rounded-[8px] border border-slate-700 bg-[#07111f]/76 p-5 shadow-[0_20px_80px_rgba(14,165,233,0.10)] backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-yellow-100">{t("Selected service")}</p>
                <h3 id="posture-card-title" className="mt-1 text-2xl font-semibold text-white">
                  {t(selectedService.label)}
                </h3>
                <p className="mt-1 text-xs font-bold uppercase text-sky-100">{t(selectedService.domain)}</p>
              </div>
              <span className="flex size-12 items-center justify-center rounded-[8px] border border-sky-200/25 bg-sky-300/10 text-sky-100">
                <PostureIcon size={22} aria-hidden />
              </span>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-300">{t(selectedService.visibleSignal)}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <SystemBadge tone={selectedService.tone}>{selectedService.state}</SystemBadge>
              <SystemBadge tone="private">{postureCopy[selectedService.posture].label}</SystemBadge>
            </div>
          </div>

          <dl className="relative mt-4 grid grid-cols-3 gap-3 rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 text-sm">
            <div>
              <dt className="text-xs font-bold uppercase text-slate-400">{t("Held")}</dt>
              <dd className="mt-1 text-lg font-semibold text-white">{summary.healthy}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase text-slate-400">{t("Watch")}</dt>
              <dd className="mt-1 text-lg font-semibold text-white">{summary.watch}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase text-slate-400">{t("Blocked")}</dt>
              <dd className="mt-1 text-lg font-semibold text-white">{summary.blocked}</dd>
            </div>
          </dl>

          <div className="relative mt-4 grid gap-3">
            <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <p className="text-xs font-bold uppercase text-slate-400">{t("Owner gate")}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-white">{t(selectedService.ownerGate)}</p>
            </div>
            <div className="rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 p-4">
              <p className="text-xs font-bold uppercase text-yellow-100">{t("Boundary posture")}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-yellow-50">{t(postureCopy[selectedService.posture].detail)}</p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

function FilterTabs({
  activeFilter,
  onSelect,
  counts
}: {
  activeFilter: FilterValue;
  onSelect: (value: FilterValue) => void;
  counts: Record<FilterValue, number>;
}) {
  const { locale } = useLanguage();
  const t = (value: string | undefined) => systemText(value, locale);

  return (
    <div className="panel p-3" aria-label={t("System health filters")}>
      <div className="grid gap-2 md:grid-cols-4">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const selected = activeFilter === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => onSelect(filter.value)}
              className={`link-focus flex min-h-12 items-center justify-between gap-3 rounded-[8px] border px-4 py-3 text-left text-sm font-semibold transition ${
                selected
                  ? "border-sky-300 bg-sky-300/16 text-white"
                  : "border-slate-700 bg-white/[0.045] text-slate-300 hover:border-sky-300/60 hover:text-white"
              }`}
              aria-pressed={selected}
            >
              <span className="inline-flex items-center gap-2">
                <Icon size={17} aria-hidden />
                {t(filter.label)}
              </span>
              <span className="rounded-[8px] border border-current/20 px-2 py-0.5 text-xs">{counts[filter.value]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ServiceRail({
  services,
  selectedService,
  onSelect
}: {
  services: readonly PrivateSystemService[];
  selectedService: PrivateSystemService;
  onSelect: (id: string) => void;
}) {
  const { locale } = useLanguage();
  const t = (value: string | undefined) => systemText(value, locale);

  return (
    <aside className="panel p-4" aria-labelledby="system-service-rail-title">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sky-100">
          <Server size={20} aria-hidden />
          <h2 id="system-service-rail-title" className="text-xl font-semibold text-white">
            {t("Services")}
          </h2>
        </div>
        <SystemBadge tone="private">{services.length}</SystemBadge>
      </div>
      <div className="mt-4 grid gap-2">
        {services.map((service, index) => {
          const selected = service.id === selectedService.id;

          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onSelect(service.id)}
              className={`link-focus rounded-[8px] border p-3 text-left transition ${
                selected
                  ? "border-sky-300 bg-sky-300/14 text-white"
                  : "border-slate-700 bg-white/[0.045] text-slate-300 hover:border-slate-500 hover:bg-white/[0.065]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[0.68rem] font-bold uppercase text-slate-400">{String(index + 1).padStart(2, "0")} - {t(service.domain)}</p>
                  <p className="mt-1 text-sm font-semibold">{t(service.label)}</p>
                </div>
                <SystemBadge tone={service.tone}>{service.state}</SystemBadge>
              </div>
              <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">{t(service.visibleSignal)}</p>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function SystemConstellation({
  services,
  selectedService,
  onSelect
}: {
  services: readonly PrivateSystemService[];
  selectedService: PrivateSystemService;
  onSelect: (id: string) => void;
}) {
  const { locale } = useLanguage();
  const t = (value: string | undefined) => systemText(value, locale);

  return (
    <section className="panel overflow-hidden p-5" aria-labelledby="system-constellation-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <Waypoints size={22} aria-hidden />
            <h2 id="system-constellation-title" className="text-2xl font-semibold text-white">
              {t("System map")}
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            {t("Select a node to inspect posture, evidence, and the owner boundary. The map shows relationships without exposing runtime internals.")}
          </p>
        </div>
        <SystemBadge tone="info">{t("Interactive")}</SystemBadge>
      </div>

      <div className="relative mt-6 min-h-[34rem] overflow-hidden rounded-[8px] border border-slate-700 bg-[radial-gradient(circle_at_50%_42%,rgba(37,99,235,0.22),rgba(15,23,42,0.2)_40%,rgba(255,255,255,0.035)_100%)] p-5">
        <div className="pointer-events-none absolute inset-8 rounded-full border border-sky-200/15" aria-hidden />
        <div className="pointer-events-none absolute inset-20 rounded-full border border-sky-200/15" aria-hidden />
        <div className="pointer-events-none absolute inset-x-10 top-1/2 border-t border-sky-200/15" aria-hidden />
        <div className="pointer-events-none absolute inset-y-10 left-1/2 border-l border-sky-200/15" aria-hidden />

        <div className="relative z-10 flex min-h-[30rem] items-center justify-center">
          <div className="flex size-32 items-center justify-center rounded-full border border-sky-200/40 bg-sky-300/16 text-sky-50 shadow-[0_24px_90px_rgba(14,165,233,0.18)]">
            <Sparkles size={42} aria-hidden />
          </div>
          {services.map((service, index) => {
            const Icon = constellationIcons[index % constellationIcons.length] ?? Server;
            const angle = (index / Math.max(services.length, 1)) * Math.PI * 2 - Math.PI / 2;
            const x = services.length === 1 ? 0 : Math.cos(angle) * 9;
            const y = services.length === 1 ? 0 : Math.sin(angle) * 7;
            const selected = service.id === selectedService.id;

            return (
              <button
                key={service.id}
                type="button"
                onClick={() => onSelect(service.id)}
                className={`link-focus absolute w-44 rounded-[8px] border p-3 text-left shadow-[0_18px_70px_rgba(2,6,23,0.18)] transition ${
                  selected
                    ? "border-sky-300 bg-sky-300/18 text-white"
                    : "border-slate-700 bg-slate-950/42 text-slate-300 hover:border-sky-300/60 hover:text-white"
                }`}
                style={{ left: "50%", top: "50%", transform: `translate(-50%, -50%) translate(${x}rem, ${y}rem)` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex size-8 items-center justify-center rounded-[8px] border border-current/20 bg-white/8 text-sky-100">
                    <Icon size={15} aria-hidden />
                  </span>
                  <SystemBadge tone={service.tone}>{service.state}</SystemBadge>
                </div>
                <p className="mt-3 text-sm font-semibold">{t(service.label)}</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">{t(service.domain)}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ServiceInspector({ service }: { service: PrivateSystemService }) {
  const { locale } = useLanguage();
  const t = (value: string | undefined) => systemText(value, locale);

  return (
    <aside className="panel p-5" aria-labelledby="system-inspector-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{t("Selected service")}</p>
          <h2 id="system-inspector-title" className="mt-2 text-2xl font-semibold text-white">
            {t(service.label)}
          </h2>
          <p className="mt-2 text-xs font-bold uppercase text-yellow-100">{t(service.domain)}</p>
        </div>
        <SystemBadge tone={service.tone}>{service.state}</SystemBadge>
      </div>

      <p className="mt-5 text-sm leading-6 text-slate-300">{t(service.detail)}</p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
          <p className="text-xs font-bold uppercase text-slate-400">{t("Evidence")}</p>
          <p className="mt-2 text-xl font-semibold text-white">{evidenceSummary(service)}</p>
        </div>
        <div className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
          <p className="text-xs font-bold uppercase text-slate-400">{t("No-go")}</p>
          <p className="mt-2 text-xl font-semibold text-white">{service.noGo.length}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {service.evidence.map((item) => (
          <article key={`${service.id}-${item.label}`} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold text-white">{t(item.label)}</h3>
              <SystemBadge tone={item.tone}>{item.state}</SystemBadge>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{t(item.detail)}</p>
          </article>
        ))}
      </div>

      <div className="mt-5 rounded-[8px] border border-amber-200/25 bg-amber-200/10 p-4">
        <div className="flex items-center gap-2 text-yellow-100">
          <ShieldAlert size={17} aria-hidden />
          <p className="text-sm font-semibold">{t("Watch items")}</p>
        </div>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-300">
          {service.risks.map((risk) => (
            <li key={`${service.id}-${risk}`} className="flex gap-2">
              <Radio className="mt-1 shrink-0 text-yellow-100" size={15} aria-hidden />
              <span>{t(risk)}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

function DiagnosticLanes({ lanes }: { lanes: readonly PrivateSystemDiagnosticLane[] }) {
  const { locale } = useLanguage();
  const t = (value: string | undefined) => systemText(value, locale);

  return (
    <section className="panel p-5" aria-labelledby="diagnostic-lanes-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <GitBranch size={22} aria-hidden />
            <h2 id="diagnostic-lanes-title" className="text-2xl font-semibold text-white">
              {t("Diagnostic lanes")}
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            {t("The lanes describe where Doraemon can summarize posture and where the owner boundary stops action.")}
          </p>
        </div>
        <SystemBadge tone="private">{t("Summary only")}</SystemBadge>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {lanes.map((lane, index) => (
          <article key={lane.label} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
            <div className="flex items-start justify-between gap-3">
              <span className="flex size-9 items-center justify-center rounded-[8px] border border-sky-200/35 bg-sky-200/16 text-xs font-semibold text-white">
                {String(index + 1).padStart(2, "0")}
              </span>
              <SystemBadge tone={lane.tone}>{lane.state}</SystemBadge>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">{t(lane.label)}</h3>
            <p className="mt-1 text-xs font-bold uppercase text-yellow-100">{t(lane.owner)}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{t(lane.detail)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SignalsAndBoundary({ data }: { data: OwnerSystemHealthData }) {
  const { locale } = useLanguage();
  const t = (value: string | undefined) => systemText(value, locale);

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]" aria-label={t("System signals and boundary")}>
      <div className="panel p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-100">
              <Activity size={22} aria-hidden />
              <h2 className="text-2xl font-semibold text-white">{t("Signals")}</h2>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              {t("Signals are deliberately summary-level. Missing feeds are shown as gaps instead of pretending precision.")}
            </p>
          </div>
          <SystemBadge tone="warning">{t("Safe abstraction")}</SystemBadge>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {data.signals.map((signal) => (
            <article key={signal.id} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-white">{t(signal.label)}</h3>
                <SystemBadge tone={signal.tone}>{signal.value}</SystemBadge>
              </div>
              <p className="mt-2 text-xs font-bold uppercase text-yellow-100">{t(signal.scope)}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{t(signal.detail)}</p>
              <p className="mt-4 text-xs font-bold uppercase text-slate-400">{t("Last checked")}</p>
              <p className="mt-1 text-sm text-slate-300">{t(signal.lastChecked)}</p>
            </article>
          ))}
        </div>
      </div>

      <aside className="panel p-5">
        <div className="flex items-center gap-2 text-yellow-100">
          <FileSearch size={20} aria-hidden />
          <h2 className="text-2xl font-semibold text-white">{t("Known gaps")}</h2>
        </div>
        <div className="mt-5 grid gap-3">
          {data.gaps.map((gap) => (
            <article key={gap.id} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-sm font-semibold text-white">{t(gap.label)}</h3>
                <SystemBadge tone={gap.tone}>{gap.state}</SystemBadge>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{t(gap.detail)}</p>
              <div className="mt-4 grid gap-2 text-xs leading-5 text-slate-400">
                <p>
                  <span className="font-bold uppercase text-slate-500">{t("Noted:")}</span> {t(gap.notedAt)}
                </p>
                <p>
                  <span className="font-bold uppercase text-slate-500">{t("Revisit:")}</span> {t(gap.revisitWhen)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </aside>
    </section>
  );
}

function BoundaryAndControls({ diagnostics }: { diagnostics: readonly string[] }) {
  const { locale } = useLanguage();
  const t = (value: string | undefined) => systemText(value, locale);

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]" aria-label={t("System diagnostic boundary")}>
      <div className="panel p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-yellow-100">
              <ShieldCheck size={22} aria-hidden />
              <h2 className="text-2xl font-semibold text-white">{t("Diagnostic boundary")}</h2>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              {t("This page can summarize posture and gaps. It cannot expose internals or mutate runtime state.")}
            </p>
          </div>
          <SystemBadge tone="private">Read-only</SystemBadge>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {diagnostics.map((item) => (
            <div key={item} className="rounded-[8px] border border-slate-700 bg-white/[0.045] p-4 text-sm leading-6 text-slate-300">
              {t(item)}
            </div>
          ))}
        </div>
      </div>

      <aside className="panel p-5">
        <div className="flex items-center gap-2 text-yellow-100">
          <LockKeyhole size={20} aria-hidden />
          <h2 className="text-2xl font-semibold text-white">{t("Unavailable")}</h2>
        </div>
        <div className="mt-5 grid gap-2">
          {unavailableControls.map((item) => (
            <div key={item} className="flex items-center justify-between gap-3 rounded-[8px] border border-slate-700 bg-white/[0.045] px-3 py-2 text-sm text-slate-300">
              <span>{t(item)}</span>
              <SystemBadge tone="private">Unavailable</SystemBadge>
            </div>
          ))}
        </div>
        <Link
          href="/app/schedules"
          className="link-focus mt-4 inline-flex items-center gap-2 rounded-[8px] border border-sky-300/35 bg-sky-300/12 px-3 py-2 text-sm font-semibold text-sky-100 transition hover:border-sky-200 hover:bg-sky-300/18"
        >
          {t("Review schedules")}
          <ArrowRight size={15} aria-hidden />
        </Link>
      </aside>
    </section>
  );
}

function EmptySystemHealthSurface() {
  const { locale } = useLanguage();
  const t = (value: string | undefined) => systemText(value, locale);

  return (
    <section className="panel p-6 md:p-7" aria-labelledby="system-empty-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-100">
            <Server size={22} aria-hidden />
            <h2 id="system-empty-title" className="text-2xl font-semibold text-white">
              {t("Diagnostics empty")}
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            {t("No owner-visible diagnostics are available in this private source. The surface remains read-only and avoids exposing runtime internals or repair controls.")}
          </p>
        </div>
        <SystemBadge tone="private">{t("Owner-only")}</SystemBadge>
      </div>
    </section>
  );
}

export function OwnerSystemHealthSurface({ data }: { data: OwnerSystemHealthData }) {
  const { locale } = useLanguage();
  const t = (value: string | undefined) => systemText(value, locale);
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");
  const [selectedServiceId, setSelectedServiceId] = useState(data.services[0]?.id ?? "");

  const counts = useMemo(
    () => ({
      all: filterServices(data.services, "all").length,
      attention: filterServices(data.services, "attention").length,
      public: filterServices(data.services, "public").length,
      owner: filterServices(data.services, "owner").length
    }),
    [data.services]
  );

  const visibleServices = useMemo(() => filterServices(data.services, activeFilter), [activeFilter, data.services]);
  const selectedService =
    visibleServices.find((service) => service.id === selectedServiceId) ?? visibleServices[0] ?? data.services[0];

  if (!selectedService) {
    return (
      <div className="grid gap-5" data-i18n-skip>
        <h1 className="sr-only">{t("Private system health diagnostics")}</h1>
        <EmptySystemHealthSurface />
      </div>
    );
  }

  return (
    <div className="grid gap-5" data-i18n-skip>
      <h1 className="sr-only">{t("Private system health diagnostics")}</h1>
      <SystemHero data={data} selectedService={selectedService} />
      <FilterTabs activeFilter={activeFilter} counts={counts} onSelect={setActiveFilter} />
      <section className="grid gap-5 2xl:grid-cols-[20rem_minmax(0,1fr)_26rem]" aria-label={t("Interactive system health workspace")}>
        <ServiceRail services={visibleServices} selectedService={selectedService} onSelect={setSelectedServiceId} />
        <SystemConstellation services={visibleServices} selectedService={selectedService} onSelect={setSelectedServiceId} />
        <ServiceInspector service={selectedService} />
      </section>
      <DiagnosticLanes lanes={data.lanes} />
      <SignalsAndBoundary data={data} />
      <BoundaryAndControls diagnostics={data.diagnostics} />
    </div>
  );
}
