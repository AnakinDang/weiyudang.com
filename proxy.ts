import { NextRequest, NextResponse } from "next/server";
import { getOwnerAccessSecret, OWNER_SESSION_COOKIE, verifyOwnerSession } from "@/lib/auth-session";

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
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/app/:path*"]
};
