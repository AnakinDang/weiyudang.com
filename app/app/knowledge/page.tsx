import { KnowledgeVaultCockpit } from "@/app/app/knowledge/KnowledgeVaultCockpit";
import { requireOwnerSession } from "@/lib/private/owner-session";
import {
  privateKnowledgePolicy,
  privateKnowledgePosture,
  privateKnowledgePublishBridge,
  privateKnowledgeQueue,
  privateKnowledgeSources,
  privateKnowledgeUnavailableControls
} from "@/lib/private/knowledge-vault";

export const dynamic = "force-dynamic";

export default async function KnowledgePage() {
  await requireOwnerSession("/app/knowledge");
  return (
    <KnowledgeVaultCockpit
      data={{
        sources: privateKnowledgeSources,
        queue: privateKnowledgeQueue,
        policy: privateKnowledgePolicy,
        posture: privateKnowledgePosture,
        publishBridge: privateKnowledgePublishBridge,
        unavailableControls: privateKnowledgeUnavailableControls
      }}
    />
  );
}
