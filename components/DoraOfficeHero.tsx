import type { ReactNode } from "react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";

const commandRoomVisual = "/visuals/doraemon-office-command-room-v2.png";

// These primitives render public Doraemon Office chrome only. Callers must pass already-sanitized copy and state.
function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export type DoraOfficeHeroBoundaryItem = {
  icon: LucideIcon;
  title: string;
  detail: string;
};

export type DoraOfficeHeroBoundaryStripItem = {
  icon: LucideIcon;
  label: string;
};

export type DoraOfficeHeroSignalItem = {
  key: string;
  ariaLabel: string;
  meta: ReactNode;
  metaElement?: "span" | "time";
  metaDateTime?: string;
  title: ReactNode;
  detail?: ReactNode;
};

export function DoraOfficeHeroArt({ className, sizes = "72vw" }: { className?: string; sizes?: string }) {
  return (
    <Image
      className={classNames("dora-office-hero-art", className)}
      src={commandRoomVisual}
      alt=""
      width={1536}
      height={1024}
      sizes={sizes}
    />
  );
}

export function DoraOfficeHeroCopy({
  className,
  lines,
  summary
}: {
  className?: string;
  lines: readonly string[];
  summary: string;
}) {
  return (
    <div className={classNames("dora-office-hero-copy", className)}>
      <p>
        {lines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </p>
      <small>{summary}</small>
    </div>
  );
}

export function DoraOfficeHeroBoundaryCard({
  className,
  items
}: {
  className?: string;
  items: readonly DoraOfficeHeroBoundaryItem[];
}) {
  return (
    <div className={classNames("dora-office-hero-boundary-card", className)}>
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div key={item.title}>
            <Icon size={17} aria-hidden />
            <strong>{item.title}</strong>
            <span>{item.detail}</span>
          </div>
        );
      })}
    </div>
  );
}

export function DoraOfficeHeroBoundaryStrip({
  className,
  items
}: {
  className?: string;
  items: readonly DoraOfficeHeroBoundaryStripItem[];
}) {
  return (
    <div className={classNames("dora-office-hero-boundary", className)}>
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <span key={item.label}>
            <Icon size={15} aria-hidden />
            {item.label}
          </span>
        );
      })}
    </div>
  );
}

export function DoraOfficeHeroSignalRail({
  className,
  ariaLabel,
  label,
  items
}: {
  className?: string;
  ariaLabel: string;
  label: string;
  items: readonly DoraOfficeHeroSignalItem[];
}) {
  return (
    <div className={classNames("dora-office-hero-signal-strip", className)} aria-label={ariaLabel}>
      <div>
        <span aria-hidden />
        <strong>{label}</strong>
      </div>
      <ol role="list">
        {items.map((item) => {
          const MetaElement = item.metaElement ?? "span";

          return (
            <li key={item.key} aria-label={item.ariaLabel}>
              <MetaElement dateTime={item.metaElement === "time" ? item.metaDateTime : undefined}>{item.meta}</MetaElement>
              <strong>{item.title}</strong>
              {item.detail ? <small>{item.detail}</small> : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
