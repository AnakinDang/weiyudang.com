import "server-only";

// Server-only owner session guard for private route defense in depth.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getOwnerAccessSecret, OWNER_SESSION_COOKIE, verifyOwnerSession } from "@/lib/auth-session";

export async function requireOwnerSession(nextPath: string) {
  const cookieStore = await cookies();
  const isAuthed = await verifyOwnerSession(
    cookieStore.get(OWNER_SESSION_COOKIE)?.value,
    getOwnerAccessSecret()
  );

  if (!isAuthed) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }
}
