import { OwnerSettingsSurface } from "@/components/OwnerSettingsSurface";
import { requireOwnerSession } from "@/lib/private/owner-session";
import {
  ownerNotificationPreferences,
  ownerProfileSettings,
  ownerSettingsLanes,
  ownerSettingsMetrics,
  ownerSettingsPackets,
  ownerSettingsPolicy
} from "@/lib/private/settings";

export const dynamic = "force-dynamic";

const unavailableControls = [
  "Reveal credential",
  "Copy credential",
  "Rotate token",
  "Connect account",
  "Save preference",
  "Send notification"
] as const;

export default async function SettingsPage() {
  await requireOwnerSession("/app/settings");

  return (
    <OwnerSettingsSurface
      data={{
        profile: ownerProfileSettings,
        packets: ownerSettingsPackets,
        notifications: ownerNotificationPreferences,
        metrics: ownerSettingsMetrics,
        lanes: ownerSettingsLanes,
        policy: ownerSettingsPolicy,
        unavailableControls
      }}
    />
  );
}
