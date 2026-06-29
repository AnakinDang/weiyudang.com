const OWNER_NEXT_FALLBACK = "/app";
const OWNER_NEXT_BASE = "https://owner.local";

export function safeOwnerNextPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/")) {
    return OWNER_NEXT_FALLBACK;
  }

  try {
    const parsed = new URL(value, OWNER_NEXT_BASE);
    if (parsed.origin !== OWNER_NEXT_BASE || !/^\/app(?:\/|$)/.test(parsed.pathname)) {
      return OWNER_NEXT_FALLBACK;
    }

    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return OWNER_NEXT_FALLBACK;
  }
}
