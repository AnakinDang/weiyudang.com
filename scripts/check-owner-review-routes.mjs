import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function readSource(path) {
  return readFileSync(`${process.cwd()}/${path}`, "utf8");
}

function tradingBoundaryPacketId() {
  const source = readSource("lib/review-packet-ids.ts");
  const match = source.match(/REVIEW_TRADING_BOUNDARY_COPY_ID\s*=\s*"([^"]+)"/);
  assert.ok(match, "REVIEW_TRADING_BOUNDARY_COPY_ID must stay explicitly declared.");
  return match[1];
}

function ownerReviewRouteIds() {
  const source = readSource("lib/review-route-public.ts");
  const match = source.match(/OWNER_REVIEW_PACKET_ROUTE_IDS\s*=\s*\[([^\]]+)\]/s);
  assert.ok(match, "OWNER_REVIEW_PACKET_ROUTE_IDS must stay explicitly declared.");
  return [...match[1].matchAll(/"([^"]+)"/g)].map((routeMatch) => routeMatch[1]);
}

function ownerReviewPacketIdsFromRouteMap() {
  const source = readSource("lib/review-route.ts");
  return [...source.matchAll(/packetId:\s*"([^"]+)"/g)].map((match) => match[1]);
}

function privateReviewQueueIds(boundaryPacketId) {
  const source = readSource("lib/private/review-queue.ts");
  return [...source.matchAll(/^\s*id:\s*(?:"([^"]+)"|REVIEW_TRADING_BOUNDARY_COPY_ID),/gm)].map(
    (match) => match[1] ?? boundaryPacketId
  );
}

const REVIEW_TRADING_BOUNDARY_COPY_ID = tradingBoundaryPacketId();
const routeIds = ownerReviewRouteIds();
const mappedPacketIds = ownerReviewPacketIdsFromRouteMap();
const privatePacketIds = privateReviewQueueIds(REVIEW_TRADING_BOUNDARY_COPY_ID);
const routes = mappedPacketIds.map((packetId, index) => ({ routeId: routeIds[index], packetId }));
const expectedRouteIds = Array.from({ length: privatePacketIds.length }, (_, index) => `rq_${String(index + 1).padStart(2, "0")}`);

assert.deepEqual(routeIds, expectedRouteIds, "Review route ids must stay fixed as rq_01..rq_N until explicitly revised.");
assert.equal(routeIds.length, mappedPacketIds.length, "Review route token count must match packet mapping count.");
assert.equal(routes.length, privatePacketIds.length, "Review route allowlist must match private queue size.");
assert.equal(new Set(routeIds).size, routeIds.length, "Review route ids must be unique.");
assert.equal(new Set(mappedPacketIds).size, mappedPacketIds.length, "Review packet ids must be uniquely routed.");
assert.deepEqual(mappedPacketIds, privatePacketIds, "Review route mapping order must match the private Review Queue order.");

for (const route of routes) {
  assert.match(route.routeId, /^rq_0[1-9]\d*$/, `Unsafe review route id ${route.routeId}.`);
  assert.ok(!`/app/review?packet=${route.routeId}`.includes(route.packetId), `Review href leaked raw packet id ${route.packetId}.`);
}

assert.equal(routes[2]?.packetId, REVIEW_TRADING_BOUNDARY_COPY_ID, "Trading boundary packet must stay at rq_03.");

const ownerReviewSurfaceSource = readSource("components/OwnerReviewQueueSurface.tsx");
assert.match(
  ownerReviewSurfaceSource,
  /from "@\/lib\/review-route-public"/,
  "Owner Review Queue client component must import only the public token helper."
);
assert.doesNotMatch(
  ownerReviewSurfaceSource,
  /from "@\/lib\/review-route"/,
  "Owner Review Queue client component must not import raw review packet mapping."
);
assert.match(
  ownerReviewSurfaceSource,
  /writePacketUrl\(nextVisible\[0\]\.id,\s*"replace"\)/,
  "Lane-driven Review Queue selection must replace history instead of pushing unencoded lane filter states."
);

const tradingTraceSource = readSource("lib/trading-trace.ts");
assert.match(
  tradingTraceSource,
  /isOwnerReviewPacketRouteId\(context\?\.reviewPacketRouteId\)/,
  "Trading trace context must validate review packet route tokens before writing URL params."
);
assert.doesNotMatch(
  tradingTraceSource,
  /reviewPacketId/,
  "Trading trace client helper must not accept raw review packet ids."
);
assert.doesNotMatch(
  tradingTraceSource,
  /from "@\/lib\/review-route"/,
  "Trading trace client helper must not import raw review packet mapping."
);

const tradingPageSource = readSource("app/app/trading/page.tsx");
assert.match(
  tradingPageSource,
  /ownerReviewPacketIdFromRoute\(firstParam\(params\[TRADING_REVIEW_PACKET_PARAM\]\)\)/,
  "Trading page must resolve review_packet from a route token, not a raw packet id."
);
assert.match(
  tradingPageSource,
  /ownerReviewHref\(reviewPacket\.id\)/,
  "Trading return link must point back to Review Queue through the route helper."
);
assert.match(
  tradingPageSource,
  /routeId,\s*\n\s*title: reviewPacket\.title/,
  "Trading review return context must pass the review route token to the client."
);

console.log(`check-owner-review-routes: ${routes.length} review packet tokens validated`);
