import { CheckCircle2, CircleDashed, LockKeyhole, ShieldAlert } from "lucide-react";

const toneMap = {
  normal: "status-badge-normal",
  info: "status-badge-info",
  warning: "status-badge-warning",
  private: "status-badge-private",
  danger: "status-badge-danger"
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
    <span className={`status-badge ${toneMap[tone]}`}>
      <Icon size={13} aria-hidden />
      {children}
    </span>
  );
}
