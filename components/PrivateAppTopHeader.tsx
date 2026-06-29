"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Ban,
  CalendarClock,
  ExternalLink,
  LockKeyhole,
  ShieldCheck
} from "lucide-react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/components/LanguageProvider";

type LocalizedCopy = {
  en: string;
  zh: string;
};

type HeaderBadge = {
  label: LocalizedCopy;
  tone: "owner" | "safe" | "warn";
  icon: typeof LockKeyhole;
};

type HeaderRoute = {
  href: string;
  kicker: LocalizedCopy;
  title: LocalizedCopy;
  summary: LocalizedCopy;
  badges?: readonly HeaderBadge[];
};

const defaultBadges = [
  {
    label: { en: "Owner-only", zh: "仅限本人" },
    tone: "owner",
    icon: LockKeyhole
  },
  {
    label: { en: "Read-only", zh: "只读" },
    tone: "safe",
    icon: ShieldCheck
  },
  {
    label: { en: "Private mock mode", zh: "私密模拟模式" },
    tone: "warn",
    icon: CalendarClock
  }
] as const satisfies readonly HeaderBadge[];

const tradingBadges = [
  defaultBadges[0],
  {
    label: { en: "Research-only", zh: "仅研究" },
    tone: "safe",
    icon: ShieldCheck
  },
  {
    label: { en: "No execution", zh: "无执行" },
    tone: "warn",
    icon: Ban
  }
] as const satisfies readonly HeaderBadge[];

const headerRoutes = [
  {
    href: "/app",
    kicker: { en: "Owner session", zh: "私密会话" },
    title: { en: "Owner Today", zh: "今日驾驶舱" },
    summary: {
      en: "Daily priorities, approvals, research posture, schedule pressure, and system health in one private cockpit.",
      zh: "把今日优先级、审核、研究状态、日程压力和系统健康放在同一个私密驾驶舱。"
    }
  },
  {
    href: "/app/command",
    kicker: { en: "Owner command", zh: "本人指挥" },
    title: { en: "Command Drafting", zh: "指令草稿" },
    summary: {
      en: "Draft command intent with visible gates before any future audited action path exists.",
      zh: "在任何未来审计动作路径存在之前，先用可见门禁整理指令意图。"
    }
  },
  {
    href: "/app/agents",
    kicker: { en: "MiniDora operations", zh: "MiniDora 运营" },
    title: { en: "Private Agents", zh: "私密智能体" },
    summary: {
      en: "Owner-only roster, handoffs, source posture, and review context for the MiniDora team.",
      zh: "仅本人可见的 MiniDora 花名册、交接、来源状态和审核上下文。"
    }
  },
  {
    href: "/app/trading",
    kicker: { en: "Research cockpit", zh: "研究驾驶舱" },
    title: { en: "Trading Research", zh: "交易研究" },
    summary: {
      en: "Evidence-first market research, desk disagreement, gates, and replay. Not an order, recommendation, or execution system.",
      zh: "以证据为先的市场研究、研究台分歧、门禁和回放。不是订单、建议或执行系统。"
    },
    badges: tradingBadges
  },
  {
    href: "/app/knowledge",
    kicker: { en: "Private memory", zh: "私密记忆" },
    title: { en: "Knowledge Vault", zh: "知识库" },
    summary: {
      en: "Private sources, publish candidates, and owner-gated transformations before anything crosses into public pages.",
      zh: "私密来源、发布候选和本人把关的转化路径，确保内容跨到公开页前先经过审查。"
    }
  },
  {
    href: "/app/schedules",
    kicker: { en: "Operating rhythm", zh: "运行节奏" },
    title: { en: "Owner Schedules", zh: "本人日程" },
    summary: {
      en: "Private rhythm, reading windows, schedule evidence, and owner gates without scheduler mutation controls.",
      zh: "私密节奏、阅读窗口、日程证据和本人门禁，不提供调度器写入控制。"
    }
  },
  {
    href: "/app/review",
    kicker: { en: "Owner gates", zh: "本人门禁" },
    title: { en: "Review Queue", zh: "审核队列" },
    summary: {
      en: "Decision packets, evidence, blockers, and allowed next steps before private work can move forward.",
      zh: "私密工作推进前，先查看决策包、证据、阻塞点和允许的下一步。"
    }
  },
  {
    href: "/app/events",
    kicker: { en: "Owner history", zh: "本人历史" },
    title: { en: "Events Context", zh: "事件上下文" },
    summary: {
      en: "Curated owner-readable history, handoffs, review signals, and source posture.",
      zh: "经过整理的本人可读历史、交接、审核信号和来源状态。"
    }
  },
  {
    href: "/app/system",
    kicker: { en: "Diagnostics", zh: "诊断" },
    title: { en: "System Health", zh: "系统健康" },
    summary: {
      en: "Owner-only service posture, gaps, diagnostics, and recovery context kept separate from public status.",
      zh: "仅本人可见的服务状态、缺口、诊断和恢复上下文，与公开状态分离。"
    }
  },
  {
    href: "/app/settings",
    kicker: { en: "Private preferences", zh: "私密偏好" },
    title: { en: "Settings", zh: "设置" },
    summary: {
      en: "Read-only account, profile, notification, and credential posture until audited settings writes exist.",
      zh: "在审计过的设置写入能力存在前，只读展示账户、档案、通知和凭据状态。"
    }
  }
] as const satisfies readonly HeaderRoute[];

const badgeToneClasses = {
  owner: "border-blue-100 bg-blue-50 text-blue-800",
  safe: "border-emerald-100 bg-emerald-50 text-emerald-800",
  warn: "border-amber-100 bg-amber-50 text-amber-800"
} as const;

function copy(value: LocalizedCopy, locale: "en" | "zh") {
  return locale === "zh" ? value.zh : value.en;
}

function routeMatchesPath(pathname: string, route: HeaderRoute) {
  if (route.href === "/app") {
    return pathname === route.href;
  }

  return pathname === route.href || pathname.startsWith(`${route.href}/`);
}

function routeForPath(pathname: string): HeaderRoute {
  const matched = headerRoutes
    .filter((route) => routeMatchesPath(pathname, route))
    .sort((left, right) => right.href.length - left.href.length)[0];

  if (!matched && process.env.NODE_ENV !== "production") {
    console.warn(`PrivateAppTopHeader is using the default route copy for unregistered path: ${pathname}`);
  }

  return matched ?? headerRoutes[0];
}

export function PrivateAppTopHeader() {
  const pathname = usePathname();
  const { locale } = useLanguage();
  const route = routeForPath(pathname);
  const badges = route.badges ?? defaultBadges;

  return (
    <>
      <h1 className="sr-only lg:hidden">{copy(route.title, locale)}</h1>
      <header className="hidden border-b border-white/45 bg-white/82 px-6 py-5 text-slate-950 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:block">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div>
          <p className="text-xs font-bold uppercase text-blue-700">{copy(route.kicker, locale)}</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-950">{copy(route.title, locale)}</h1>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">{copy(route.summary, locale)}</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <LanguageToggle tone="light" />
          {badges.map((badge) => {
            const Icon = badge.icon;

            return (
              <div
                key={badge.label.en}
                className={`inline-flex items-center gap-2 rounded-[8px] border px-3 py-2 text-sm font-semibold ${badgeToneClasses[badge.tone]}`}
              >
                <Icon size={16} aria-hidden />
                {copy(badge.label, locale)}
              </div>
            );
          })}
          <Link
            href="/dora"
            className="link-focus inline-flex items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
          >
            {locale === "zh" ? "公开 Doraemon" : "Public Doraemon"}
            <ExternalLink size={15} aria-hidden />
          </Link>
        </div>
      </div>
      </header>
    </>
  );
}
