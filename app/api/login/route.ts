import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

function hashValue(value: string) {
  return createHash("sha256").update(value).digest();
}

function safeEquals(input: string, expected: string) {
  return timingSafeEqual(hashValue(input), hashValue(expected));
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const token = String(formData.get("token") ?? "");
  const nextValue = String(formData.get("next") ?? "/app");
  const safeNext = nextValue.startsWith("/app") ? nextValue : "/app";
  const expected = process.env.APP_ACCESS_TOKEN || (process.env.NODE_ENV === "development" ? "demo-access" : "");

  if (!expected) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", safeNext);
    url.searchParams.set("config", "missing");
    return NextResponse.redirect(url, 303);
  }

  if (!safeEquals(token, expected)) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", safeNext);
    url.searchParams.set("error", "1");
    return NextResponse.redirect(url, 303);
  }

  const response = NextResponse.redirect(new URL(safeNext, request.url), 303);
  response.cookies.set("weiyu_owner_session", "authenticated", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/app",
    maxAge: 60 * 60 * 8
  });
  return response;
}
