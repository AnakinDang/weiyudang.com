import { NextRequest, NextResponse } from "next/server";
import { getOwnerAccessSecret, OWNER_SESSION_COOKIE, verifyOwnerSession } from "@/lib/auth-session";
import { tradingViewSlugFromParam } from "@/lib/trading-team";

function ownerNextPath(request: NextRequest) {
  if (request.nextUrl.pathname !== "/app/trading") {
    return `${request.nextUrl.pathname}${request.nextUrl.search}`;
  }

  const view = tradingViewSlugFromParam(request.nextUrl.searchParams.get("view"));

  if (!view) {
    return request.nextUrl.pathname;
  }

  return `${request.nextUrl.pathname}?${new URLSearchParams({ view }).toString()}`;
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
