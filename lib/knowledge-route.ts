export const OWNER_KNOWLEDGE_CANDIDATE_PARAM = "candidate";

export const OWNER_KNOWLEDGE_CANDIDATE_ROUTES = [
  { routeId: "kc_01", candidateId: "personal-os-memory" },
  { routeId: "kc_02", candidateId: "doraemon-office-release-notes" },
  { routeId: "kc_03", candidateId: "trading-research-glossary" }
] as const;

export type OwnerKnowledgeCandidateRouteId = (typeof OWNER_KNOWLEDGE_CANDIDATE_ROUTES)[number]["routeId"];
export type OwnerKnowledgeCandidateId = (typeof OWNER_KNOWLEDGE_CANDIDATE_ROUTES)[number]["candidateId"];

export function isOwnerKnowledgeCandidateRouteId(value: string | null | undefined): value is OwnerKnowledgeCandidateRouteId {
  return OWNER_KNOWLEDGE_CANDIDATE_ROUTES.some((route) => route.routeId === value);
}

export function isOwnerKnowledgeCandidateId(value: string | null | undefined): value is OwnerKnowledgeCandidateId {
  return OWNER_KNOWLEDGE_CANDIDATE_ROUTES.some((route) => route.candidateId === value);
}

export function knowledgeCandidateIdFromRoute(value: string | null | undefined): OwnerKnowledgeCandidateId | undefined {
  return OWNER_KNOWLEDGE_CANDIDATE_ROUTES.find((route) => route.routeId === value)?.candidateId;
}

export function knowledgeCandidateRouteId(candidateId: string | null | undefined): OwnerKnowledgeCandidateRouteId | undefined {
  return OWNER_KNOWLEDGE_CANDIDATE_ROUTES.find((route) => route.candidateId === candidateId)?.routeId;
}

export function ownerKnowledgeHref(candidateId?: OwnerKnowledgeCandidateId) {
  const routeId = knowledgeCandidateRouteId(candidateId);

  if (!routeId) {
    return "/app/knowledge";
  }

  const query = new URLSearchParams({ [OWNER_KNOWLEDGE_CANDIDATE_PARAM]: routeId });
  return `/app/knowledge?${query.toString()}`;
}

export function ownerKnowledgeHrefFromRouteId(routeId?: OwnerKnowledgeCandidateRouteId) {
  if (!routeId) {
    return "/app/knowledge";
  }

  const query = new URLSearchParams({ [OWNER_KNOWLEDGE_CANDIDATE_PARAM]: routeId });
  return `/app/knowledge?${query.toString()}`;
}
