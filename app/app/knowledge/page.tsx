import { KnowledgeVaultCockpit } from "@/app/app/knowledge/KnowledgeVaultCockpit";
import { requireOwnerSession } from "@/lib/private/owner-session";

export const dynamic = "force-dynamic";

export default async function KnowledgePage() {
  await requireOwnerSession("/app/knowledge");
  return <KnowledgeVaultCockpit />;
}
