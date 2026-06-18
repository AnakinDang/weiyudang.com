import type { Metadata } from "next";
import { DoraOfficeShell } from "@/components/DoraOfficeShell";
import { SystemHealthPanel } from "@/app/dora/system/SystemHealthPanel";
import { publicSystemBoundaries, publicSystemEvents, publicSystemStatus } from "@/lib/dora-office";

export const metadata: Metadata = {
  title: "Doraemon System",
  description: "Public-safe Doraemon Office system status without private infrastructure details or repair controls."
};

export default function DoraSystemPage() {
  return (
    <DoraOfficeShell
      active="/dora/system"
      title="System"
      summary="Public Doraemon Office health at a safe abstraction level: mode, schema posture, freshness, and sanitized replay."
      showBoundaryStrip={false}
    >
      <SystemHealthPanel statuses={publicSystemStatus} events={publicSystemEvents} boundaries={publicSystemBoundaries} />
    </DoraOfficeShell>
  );
}
