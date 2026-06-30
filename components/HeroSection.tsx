import { HomeHeroClient } from "@/components/HomeHeroClient";
import { formatPublicEventTime, getRecentPublicDoraEvents, toPublicDoraEventClientView } from "@/lib/dora-office";

export function HeroSection() {
  const recentEvents = getRecentPublicDoraEvents(5).map((event) => ({
    ...toPublicDoraEventClientView(event),
    displayTime: formatPublicEventTime(event.created_at)
  }));

  return <HomeHeroClient recentEvents={recentEvents} />;
}
