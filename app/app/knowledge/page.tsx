import { redirect } from "next/navigation";
import { KnowledgeVaultCockpit } from "@/app/app/knowledge/KnowledgeVaultCockpit";
import {
  isOwnerKnowledgeCandidateId,
  knowledgeCandidateIdFromRoute,
  OWNER_KNOWLEDGE_CANDIDATE_PARAM,
  ownerKnowledgeHref
} from "@/lib/knowledge-route";
import type { OwnerKnowledgeCandidateId } from "@/lib/knowledge-route";
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

type KnowledgePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function candidateFromSearchParams(params: Record<string, string | string[] | undefined> = {}): OwnerKnowledgeCandidateId | undefined {
  const candidateId = knowledgeCandidateIdFromRoute(firstParam(params[OWNER_KNOWLEDGE_CANDIDATE_PARAM]));
  return isOwnerKnowledgeCandidateId(candidateId) && privateKnowledgeQueue.some((item) => item.id === candidateId)
    ? candidateId
    : undefined;
}

function nextPathFromSearchParams(params: Record<string, string | string[] | undefined> = {}) {
  return ownerKnowledgeHref(candidateFromSearchParams(params));
}

function hasInvalidCandidateParam(params: Record<string, string | string[] | undefined> = {}) {
  return Boolean(firstParam(params[OWNER_KNOWLEDGE_CANDIDATE_PARAM])) && !candidateFromSearchParams(params);
}

export default async function KnowledgePage({ searchParams }: KnowledgePageProps) {
  const params = await searchParams;
  await requireOwnerSession(nextPathFromSearchParams(params));

  if (hasInvalidCandidateParam(params)) {
    redirect("/app/knowledge");
  }

  const initialCandidateId = candidateFromSearchParams(params);

  return (
    <KnowledgeVaultCockpit
      initialCandidateId={initialCandidateId}
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
