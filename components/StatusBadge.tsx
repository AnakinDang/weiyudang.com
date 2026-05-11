import { CheckCircle2, CircleDashed, LockKeyhole, ShieldAlert } from "lucide-react";

const toneMap = {
  normal: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100",
  info: "border-sky-300/30 bg-sky-300/10 text-sky-100",
  warning: "border-yellow-300/30 bg-yellow-300/10 text-yellow-100",
  private: "border-slate-300/30 bg-slate-300/10 text-slate-100",
  danger: "border-red-300/30 bg-red-300/10 text-red-100"
} as const;

const icons = {
  normal: CheckCircle2,
  info: CircleDashed,
  warning: ShieldAlert,
  private: LockKeyhole,
  danger: ShieldAlert
} as const;

export function StatusBadge({
  children,
  tone = "info"
}: {
  children: React.ReactNode;
  tone?: keyof typeof toneMap;
}) {
  const Icon = icons[tone];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-[8px] border px-2.5 py-1 text-xs font-semibold ${toneMap[tone]}`}>
      <Icon size={13} aria-hidden />
      {children}
    </span>
  );
}
