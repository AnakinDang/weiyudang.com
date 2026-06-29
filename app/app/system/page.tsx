import { redirect } from "next/navigation";
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
import { isOwnerSystemServiceId, OWNER_SYSTEM_SERVICE_PARAM, ownerSystemHref } from "@/lib/system-route";
import type { OwnerSystemServiceId } from "@/lib/system-route";

export const dynamic = "force-dynamic";

type SystemPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function serviceFromSearchParams(params: Record<string, string | string[] | undefined> = {}): OwnerSystemServiceId | undefined {
  const serviceId = firstParam(params[OWNER_SYSTEM_SERVICE_PARAM]);
  return isOwnerSystemServiceId(serviceId) && privateSystemServices.some((service) => service.id === serviceId)
    ? serviceId
    : undefined;
}

function nextPathFromSearchParams(params: Record<string, string | string[] | undefined> = {}) {
  return ownerSystemHref(serviceFromSearchParams(params));
}

function hasInvalidServiceParam(params: Record<string, string | string[] | undefined> = {}) {
  return Boolean(firstParam(params[OWNER_SYSTEM_SERVICE_PARAM])) && !serviceFromSearchParams(params);
}

export default async function SystemPage({ searchParams }: SystemPageProps) {
  const params = await searchParams;
  await requireOwnerSession(nextPathFromSearchParams(params));

  if (hasInvalidServiceParam(params)) {
    redirect("/app/system");
  }

  const initialServiceId = serviceFromSearchParams(params);

  return (
    <OwnerSystemHealthSurface
      initialServiceId={initialServiceId}
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
