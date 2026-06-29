"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2, Radio, ShieldCheck, Target } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { DORA_LIVE_BRIDGE_URL, type PublicDoraEventClientView } from "@/lib/dora-public-client";
import { formatPublicEventDateTime } from "@/lib/dora-public-format";
import { localizeSiteText } from "@/lib/site-i18n";
import {
  activityModeLabel,
  displayEvents,
  focusEvent,
  freshnessLabel,
  modeLabel,
  replayBufferLabel,
  useDoraLiveEvents,
  visibleLiveEvents
} from "@/lib/use-dora-live";

type DoraOfficeLiveBridgeProps = {
  fallbackEvents: PublicDoraEventClientView[];
  boundaryItems: readonly string[];
};

export function DoraOfficeLiveBridge({ fallbackEvents, boundaryItems }: DoraOfficeLiveBridgeProps) {
  const { locale } = useLanguage();
  const t = (value: string) => localizeSiteText(value, locale);
  const live = useDoraLiveEvents();
  const events = useMemo(() => displayEvents(live.events, fallbackEvents), [fallbackEvents, live.events]);
  const hasVisibleLiveActivity = useMemo(() => visibleLiveEvents(live.events).length > 0, [live.events]);
  const currentFocus = focusEvent(events);
  const bridgeHost = DORA_LIVE_BRIDGE_URL.replace(/^https?:\/\//, "");
  const currentMode = modeLabel(live.connection, live.events);
  const activityMode = activityModeLabel(live.connection, live.events, hasVisibleLiveActivity);
  const hasLiveTransport = live.connection === "live" || live.connection === "connected";
  const isLiveActivity = live.connection === "live" && hasVisibleLiveActivity;
  const focusDescription = hasVisibleLiveActivity
    ? "Live public relay event mapped through the native site allowlist."
    : hasLiveTransport
      ? "Relay is connected; the visible feed keeps the demo-safe snapshot until a public event arrives."
      : "Public-safe activity snapshot with relay health shown below.";
  const heartbeatRows = [
    { label: "Relay mode", value: currentMode },
    { label: "Public schema", value: "Closed allowlist" },
    { label: "Event freshness", value: freshnessLabel(live.events) },
    {
      label: "Replay buffer",
      value: replayBufferLabel(live.health)
    }
  ];

  return (
    <>
      <aside className="dora-office-product-command-rail" aria-label="Office Live public context">
        <section className="dora-office-product-command-card">
          <Target size={20} aria-hidden />
          <h2>{t("Current Focus")}</h2>
          <strong>{t(currentFocus?.title ?? "Demo snapshot")}</strong>
          <p>{t(focusDescription)}</p>
          <dl>
            <div>
              <dt>{t("Led by")}</dt>
              <dd>{t(currentFocus?.agent ?? "Doraemon")}</dd>
            </div>
            <div>
              <dt>{t("Status")}</dt>
              <dd>{t(currentFocus?.state ?? "Demo")}</dd>
            </div>
          </dl>
        </section>

        <section className="dora-office-product-command-card">
          <ShieldCheck size={20} aria-hidden />
          <h2>{t("Public Boundary")}</h2>
          <ul>
            {boundaryItems.slice(0, 4).map((item) => (
              <li key={item}>
                <CheckCircle2 size={13} aria-hidden />
                {t(item)}
              </li>
            ))}
          </ul>
        </section>

        <section className="dora-office-product-command-card">
          <Radio size={20} aria-hidden />
          <h2>{t("System Heartbeat")}</h2>
          <dl>
            {heartbeatRows.map((item) => (
              <div key={item.label}>
                <dt>{t(item.label)}</dt>
                <dd>{t(item.value)}</dd>
              </div>
            ))}
          </dl>
          <a
            href={DORA_LIVE_BRIDGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open full-screen visualizer ${bridgeHost} in a new tab`}
            className="link-focus dora-office-product-bridge-inline"
          >
            {t("Full-screen bridge")} · {bridgeHost}
            <ArrowUpRight size={13} aria-hidden />
          </a>
        </section>
      </aside>

      <section className="dora-office-product-livebar" aria-label="Recent public-safe Doraemon Office activity">
        <div className="dora-office-product-livebar-head">
          <span
            aria-hidden
            className={isLiveActivity ? "is-live" : hasLiveTransport ? "is-connected" : undefined}
          />
          <strong>{t("Recent public activity")}</strong>
          <small>{t(activityMode)} · {t("Newest first")}</small>
        </div>
        <ol>
          {events.slice(0, 5).map((event) => (
            <li key={event.event_id}>
              <time dateTime={event.created_at}>{formatPublicEventDateTime(event.created_at)}</time>
              <strong>{t(event.agent)}</strong>
              <span>{t(event.title)}</span>
            </li>
          ))}
        </ol>
        <Link href="/dora/activity" className="link-focus dora-office-product-livebar-link">
          {t("View all")}
          <ArrowRight size={14} aria-hidden />
        </Link>
      </section>

      <div className="sr-only" aria-live="polite">
        {t("Doraemon Office public relay mode:")} {t(currentMode)}.
      </div>
    </>
  );
}
