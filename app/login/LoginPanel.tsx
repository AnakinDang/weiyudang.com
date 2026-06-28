"use client";

import Link from "next/link";
import { ArrowLeft, LockKeyhole, ShieldCheck } from "lucide-react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/components/LanguageProvider";
import type { SiteLocale } from "@/lib/site-i18n";

type LoginPanelProps = {
  next: string;
  error: boolean;
  missingConfig: boolean;
  showDevTokenHint: boolean;
};

const copy = {
  en: {
    back: "Back to public site",
    title: "Private owner area",
    intro:
      "This gate protects owner-only routes. Private app content is not rendered until the owner session is valid.",
    tokenMismatch: "Access token did not match.",
    missingConfig: "APP_ACCESS_TOKEN is missing in this environment.",
    tokenLabel: "Access token",
    tokenPlaceholder: "Enter private token",
    submit: "Enter app",
    devHint: "Local development accepts demo-access when APP_ACCESS_TOKEN is not set.",
    prodHint: "Production access requires a configured owner token.",
    cookieHint: "The session cookie is HttpOnly and scoped to `/app`."
  },
  zh: {
    back: "返回公开站",
    title: "私密区域",
    intro: "这道门保护仅限本人的路由。只有私密会话有效后，私密应用内容才会渲染。",
    tokenMismatch: "访问凭据不匹配。",
    missingConfig: "当前环境缺少 APP_ACCESS_TOKEN。",
    tokenLabel: "访问凭据",
    tokenPlaceholder: "输入私密凭据",
    submit: "进入私密区",
    devHint: "本地开发在未设置 APP_ACCESS_TOKEN 时接受 demo-access。",
    prodHint: "生产访问需要配置好的本人凭据。",
    cookieHint: "会话 cookie 是 HttpOnly，并且作用域限定在 `/app`。"
  }
} satisfies Record<
  SiteLocale,
  {
    back: string;
    title: string;
    intro: string;
    tokenMismatch: string;
    missingConfig: string;
    tokenLabel: string;
    tokenPlaceholder: string;
    submit: string;
    devHint: string;
    prodHint: string;
    cookieHint: string;
  }
>;

export function LoginPanel({ next, error, missingConfig, showDevTokenHint }: LoginPanelProps) {
  const { locale } = useLanguage();
  const t = copy[locale];

  return (
    <main
      className="flex min-h-screen items-center justify-center bg-[#08111f] px-5 py-12 text-slate-100"
      data-i18n-skip
    >
      <section className="panel w-full max-w-md p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="link-focus inline-flex items-center gap-2 text-sm font-semibold text-sky-100 hover:text-sky-50">
            <ArrowLeft size={16} aria-hidden />
            {t.back}
          </Link>
          <LanguageToggle tone="dark" compact />
        </div>
        <div className="mt-8 flex size-14 items-center justify-center rounded-[8px] border border-yellow-200/30 bg-yellow-300/10 text-yellow-100">
          <LockKeyhole size={28} aria-hidden />
        </div>
        <h1 className="mt-5 text-3xl font-semibold text-white">{t.title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">{t.intro}</p>
        {error ? (
          <div className="mt-5 rounded-[8px] border border-red-300/30 bg-red-300/10 p-3 text-sm text-red-100">
            {t.tokenMismatch}
          </div>
        ) : null}
        {missingConfig ? (
          <div className="mt-5 rounded-[8px] border border-yellow-300/30 bg-yellow-300/10 p-3 text-sm text-yellow-100">
            {t.missingConfig}
          </div>
        ) : null}
        <form action="/api/login" method="post" className="mt-6 space-y-4">
          <input type="hidden" name="next" value={next} />
          <input
            type="text"
            name="username"
            value="owner"
            readOnly
            autoComplete="username"
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
          />
          <label className="block">
            <span className="text-sm font-semibold text-slate-200">{t.tokenLabel}</span>
            <input
              type="password"
              name="token"
              autoComplete="current-password"
              className="mt-2 w-full rounded-[8px] border border-slate-600 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300"
              placeholder={t.tokenPlaceholder}
            />
          </label>
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-yellow-300 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-yellow-200">
            <ShieldCheck size={17} aria-hidden />
            {t.submit}
          </button>
        </form>
        <p className="mt-5 text-xs leading-5 text-slate-500">
          {showDevTokenHint ? t.devHint : t.prodHint} {t.cookieHint}
        </p>
      </section>
    </main>
  );
}
