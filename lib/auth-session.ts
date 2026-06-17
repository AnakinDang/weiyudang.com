export const OWNER_SESSION_COOKIE = "weiyu_owner_session";
export const OWNER_SESSION_TTL_SECONDS = 60 * 60 * 8;

const SESSION_VERSION = "v1";
const HEX_RE = /^[a-f0-9]+$/;

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) {
    return false;
  }

  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return diff === 0;
}

async function hmacSha256Hex(message: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return bytesToHex(new Uint8Array(signature));
}

function randomHex(byteLength: number) {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}

export function getOwnerAccessSecret() {
  return process.env.APP_ACCESS_TOKEN || (process.env.NODE_ENV === "development" ? "demo-access" : "");
}

export async function createOwnerSession(secret: string, now = Date.now()) {
  const expiresAt = now + OWNER_SESSION_TTL_SECONDS * 1000;
  const nonce = randomHex(16);
  const payload = `${expiresAt}.${nonce}`;
  const signature = await hmacSha256Hex(payload, secret);
  return `${SESSION_VERSION}.${payload}.${signature}`;
}

export async function verifyOwnerSession(value: string | undefined, secret: string, now = Date.now()) {
  if (!value || !secret) {
    return false;
  }

  const [version, expiresAtValue, nonce, signature, ...extra] = value.split(".");
  if (extra.length > 0 || version !== SESSION_VERSION || !expiresAtValue || !nonce || !signature) {
    return false;
  }

  const expiresAt = Number(expiresAtValue);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= now) {
    return false;
  }

  if (nonce.length !== 32 || signature.length !== 64 || !HEX_RE.test(nonce) || !HEX_RE.test(signature)) {
    return false;
  }

  const expected = await hmacSha256Hex(`${expiresAt}.${nonce}`, secret);
  return constantTimeEqual(signature, expected);
}
