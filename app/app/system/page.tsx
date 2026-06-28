import { OwnerSystemHealthSurface } from "@/components/OwnerSystemHealthSurface";
import { requireOwnerSession } from "@/lib/private/owner-session";
import {
  privateSystemContextLinks,
  privateSystemDiagnosticLanes,
  privateSystemDiagnostics,
  privateSystemGaps,
  privateSystemMetrics,
  privateSystemServices,
  privateSystemSignals
} from "@/lib/private/system";

export const dynamic = "force-dynamic";

export default async function SystemPage() {
  await requireOwnerSession("/app/system");

  return (
    <OwnerSystemHealthSurface
      data={{
        services: privateSystemServices,
        signals: privateSystemSignals,
        gaps: privateSystemGaps,
        metrics: privateSystemMetrics,
        lanes: privateSystemDiagnosticLanes,
        contextLinks: privateSystemContextLinks,
        diagnostics: privateSystemDiagnostics
      }}
    />
  );
}
