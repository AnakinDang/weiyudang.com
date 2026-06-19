import { OwnerCommandSurface } from "@/components/OwnerCommandSurface";
import { ownerCommandSurfaceData } from "@/lib/private/command";
import { requireOwnerSession } from "@/lib/private/owner-session";

export const dynamic = "force-dynamic";

export default async function CommandPage() {
  await requireOwnerSession("/app/command");
  return <OwnerCommandSurface data={ownerCommandSurfaceData} />;
}
