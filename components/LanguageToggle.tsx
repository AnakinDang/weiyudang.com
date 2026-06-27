"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

type LanguageToggleTone = "light" | "dark" | "doraemon";

const toneClasses = {
  light: {
    shell: "border-slate-200 bg-white text-slate-700 shadow-sm",
    active: "bg-slate-950 text-white",
    idle: "text-slate-500 hover:bg-slate-100 hover:text-slate-950",
    icon: "text-slate-400"
  },
  dark: {
    shell: "border-slate-700 bg-white/[0.04] text-slate-200",
    active: "bg-sky-300/18 text-white",
    idle: "text-slate-400 hover:bg-white/[0.08] hover:text-white",
    icon: "text-slate-400"
  },
  doraemon: {
    shell: "border-[#d6e3f0] bg-white/78 text-[#0f172a] shadow-[0_10px_28px_rgba(15,23,42,0.06)]",
    active: "bg-[#155eef] text-white",
    idle: "text-[#64748b] hover:bg-[#eef6ff] hover:text-[#155eef]",
    icon: "text-[#155eef]"
  }
} as const satisfies Record<
  LanguageToggleTone,
  {
    shell: string;
    active: string;
    idle: string;
    icon: string;
  }
>;

export function LanguageToggle({
  tone = "light",
  compact = false
}: {
  tone?: LanguageToggleTone;
  compact?: boolean;
}) {
  const { locale, setLocale } = useLanguage();
  const classes = toneClasses[tone];

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-[8px] border p-1 text-xs font-semibold ${classes.shell}`}
      aria-label="Language switcher"
      data-i18n-skip
    >
      {!compact ? <Languages size={14} className={classes.icon} aria-hidden /> : null}
      <button
        type="button"
        className={`link-focus rounded-[6px] px-2 py-1 transition ${locale === "en" ? classes.active : classes.idle}`}
        aria-label="Switch to English"
        aria-pressed={locale === "en"}
        lang="en"
        onClick={() => setLocale("en")}
      >
        EN
      </button>
      <button
        type="button"
        className={`link-focus rounded-[6px] px-2 py-1 transition ${locale === "zh" ? classes.active : classes.idle}`}
        aria-label="切换到中文"
        aria-pressed={locale === "zh"}
        lang="zh-Hans"
        onClick={() => setLocale("zh")}
      >
        中文
      </button>
    </div>
  );
}
