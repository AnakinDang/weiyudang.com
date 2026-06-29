import assert from "node:assert/strict";

const {
  OWNER_AGENT_ROUTES,
  isOwnerAgentId,
  isOwnerAgentRouteId,
  ownerAgentHref,
  ownerAgentIdFromRoute,
  ownerAgentRouteId,
  ownerEventsHref
} = await import("../lib/agent-route.ts");
const { privateAgentRoster } = await import("../lib/agent-ops.ts");

const expectedRouteIds = Array.from({ length: 8 }, (_, index) => `ag_${String(index + 1).padStart(2, "0")}`);
const agentIds = new Set(privateAgentRoster.map((agent) => agent.id));
const routeIds = new Set(OWNER_AGENT_ROUTES.map((route) => route.routeId));
const routedAgentIds = new Set(OWNER_AGENT_ROUTES.map((route) => route.agentId));

assert.deepEqual(
  OWNER_AGENT_ROUTES.map((route) => route.routeId),
  expectedRouteIds,
  "Owner agent route ids must stay fixed as ag_01..ag_08 until the route contract is explicitly revised."
);
assert.equal(routeIds.size, OWNER_AGENT_ROUTES.length, "Owner agent route ids must be unique.");
assert.equal(routedAgentIds.size, OWNER_AGENT_ROUTES.length, "Owner agent ids must be uniquely routed.");
assert.equal(
  OWNER_AGENT_ROUTES.length,
  privateAgentRoster.length,
  "Owner agent route allowlist must be updated whenever the private roster size changes."
);

for (const agent of privateAgentRoster) {
  assert.ok(routedAgentIds.has(agent.id), `Missing owner route token for private agent ${agent.id}.`);
}

for (const route of OWNER_AGENT_ROUTES) {
  assert.match(route.routeId, /^ag_0[1-8]$/, `Unsafe owner agent route id ${route.routeId}.`);
  assert.ok(agentIds.has(route.agentId), `Owner route ${route.routeId} points at an unknown private agent.`);
  assert.equal(ownerAgentIdFromRoute(route.routeId), route.agentId, `Route ${route.routeId} did not resolve.`);
  assert.equal(ownerAgentRouteId(route.agentId), route.routeId, `Agent ${route.agentId} did not reverse-resolve.`);
  assert.ok(isOwnerAgentRouteId(route.routeId), `Route guard rejected ${route.routeId}.`);
  assert.ok(isOwnerAgentId(route.agentId), `Agent guard rejected ${route.agentId}.`);

  const agentHref = ownerAgentHref(route.agentId);
  const eventsHref = ownerEventsHref(route.agentId);
  assert.equal(agentHref, `/app/agents?agent=${route.routeId}`);
  assert.equal(eventsHref, `/app/events?agent=${route.routeId}`);
  assert.ok(!agentHref.includes(route.agentId), `Agent href leaked raw id ${route.agentId}.`);
  assert.ok(!eventsHref.includes(route.agentId), `Events href leaked raw id ${route.agentId}.`);
}

assert.equal(isOwnerAgentRouteId("ag_09"), false, "Route guard must fail closed for future route ids.");
assert.equal(isOwnerAgentRouteId("AG_01"), false, "Route guard must be case-sensitive.");
assert.equal(ownerEventsHref(undefined, "Handoff"), "/app/events?kind=Handoff");

console.log(`check-owner-agent-routes: ${OWNER_AGENT_ROUTES.length} route tokens validated`);
