import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  createOwnerSession,
  getOwnerAccessSecret,
  OWNER_SESSION_COOKIE,
  OWNER_SESSION_TTL_SECONDS
} from "@/lib/auth-session";

function hashValue(value: string) {
  return createHash("sha256").update(value).digest();
}

function safeEquals(input: string, expected: string) {
  return timingSafeEqual(hashValue(input), hashValue(expected));
}

function safeOwnerNextPath(value: string) {
  const fallback = "/app";
  if (!value.startsWith("/")) {
    return fallback;
  }

  try {
    const base = "https://owner.local";
    const parsed = new URL(value, base);
    if (parsed.origin !== base || !/^\/app(?:\/|$)/.test(parsed.pathname)) {
      return fallback;
    }
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return fallback;
  }
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const token = String(formData.get("token") ?? "");
  const nextValue = String(formData.get("next") ?? "/app");
  const safeNext = safeOwnerNextPath(nextValue);
  const expected = getOwnerAccessSecret();

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
  response.cookies.set(OWNER_SESSION_COOKIE, await createOwnerSession(expected), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/app",
    maxAge: OWNER_SESSION_TTL_SECONDS
  });
  return response;
}
