import { NextRequest, NextResponse } from "next/server";
import { getOwnerAccessSecret, OWNER_SESSION_COOKIE, verifyOwnerSession } from "@/lib/auth-session";
import { isPreservedTradingReviewPacketId } from "@/lib/review-packet-ids";
import { isOwnerScheduleId, OWNER_SCHEDULE_PARAM, ownerScheduleHref } from "@/lib/schedule-route";
import { isOwnerSystemServiceId, OWNER_SYSTEM_SERVICE_PARAM, ownerSystemHref } from "@/lib/system-route";
import { TRADING_REVIEW_PACKET_PARAM } from "@/lib/trading-trace";
import { tradingViewSlugFromParam } from "@/lib/trading-team";

function ownerNextPath(request: NextRequest) {
  if (request.nextUrl.pathname === "/app/trading") {
    const view = tradingViewSlugFromParam(request.nextUrl.searchParams.get("view"));
    const reviewPacket = request.nextUrl.searchParams.get(TRADING_REVIEW_PACKET_PARAM);
    const query = new URLSearchParams();

    if (view) {
      query.set("view", view);
    }

    if (isPreservedTradingReviewPacketId(reviewPacket)) {
      query.set(TRADING_REVIEW_PACKET_PARAM, reviewPacket);
    }

    const queryString = query.toString();
    return queryString ? `${request.nextUrl.pathname}?${queryString}` : request.nextUrl.pathname;
  }

  if (request.nextUrl.pathname === "/app/schedules") {
    const scheduleId = request.nextUrl.searchParams.get(OWNER_SCHEDULE_PARAM);
    return ownerScheduleHref(isOwnerScheduleId(scheduleId) ? scheduleId : undefined);
  }

  if (request.nextUrl.pathname === "/app/system") {
    const serviceId = request.nextUrl.searchParams.get(OWNER_SYSTEM_SERVICE_PARAM);
    return ownerSystemHref(isOwnerSystemServiceId(serviceId) ? serviceId : undefined);
  }

  return `${request.nextUrl.pathname}${request.nextUrl.search}`;
}

export async function proxy(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/app")) {
    return NextResponse.next();
  }

  const isAuthed = await verifyOwnerSession(
    request.cookies.get(OWNER_SESSION_COOKIE)?.value,
    getOwnerAccessSecret()
  );

  if (isAuthed) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", ownerNextPath(request));
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/app/:path*"]
};
