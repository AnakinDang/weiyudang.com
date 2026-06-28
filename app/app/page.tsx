import { OwnerTodaySurface, type OwnerTodaySurfaceData } from "@/components/OwnerTodaySurface";
import {
  ownerCommandShortcuts,
  ownerDecisionHub,
  ownerMarketAlerts,
  ownerOperatingMap,
  ownerReviewQueue,
  ownerSchedulePressure,
  ownerSystemHealth,
  ownerTodayBrief,
  ownerTodayPriorities
} from "@/lib/private/owner-cockpit";
import { requireOwnerSession } from "@/lib/private/owner-session";

export const dynamic = "force-dynamic";

function shanghaiToday() {
  const now = new Date();

  return {
    en: new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      timeZone: "Asia/Shanghai"
    }).format(now),
    zh: new Intl.DateTimeFormat("zh-CN", {
      weekday: "long",
      month: "short",
      day: "numeric",
      timeZone: "Asia/Shanghai"
    }).format(now)
  };
}

export default async function PrivateAppPage() {
  await requireOwnerSession("/app");

  const data = {
    dateLabel: shanghaiToday(),
    brief: ownerTodayBrief,
    priorities: ownerTodayPriorities,
    operatingMap: ownerOperatingMap,
    reviewQueue: ownerReviewQueue,
    decisionHub: ownerDecisionHub,
    marketAlerts: ownerMarketAlerts,
    schedulePressure: ownerSchedulePressure,
    systemHealth: ownerSystemHealth,
    commandShortcuts: ownerCommandShortcuts
  } satisfies OwnerTodaySurfaceData;

  return <OwnerTodaySurface data={data} />;
}
