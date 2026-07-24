import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "hg_discord_session";
export const OAUTH_STATE_COOKIE = "hg_discord_oauth_state";

export type DiscordSession = {
  id: string;
  username: string;
  globalName: string | null;
  avatar: string | null;
  exp: number;
};

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function signature(value: string): string {
  return createHmac("sha256", requiredEnv("SESSION_SECRET")).update(value).digest("base64url");
}

export function createSessionToken(user: Omit<DiscordSession, "exp">): string {
  const payload: DiscordSession = {
    ...user,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${signature(encoded)}`;
}

export function verifySessionToken(token: string | undefined): DiscordSession | null {
  if (!token) return null;
  const [encoded, providedSignature] = token.split(".");
  if (!encoded || !providedSignature) return null;

  try {
    const expected = Buffer.from(signature(encoded));
    const provided = Buffer.from(providedSignature);
    if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) return null;
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as DiscordSession;
    if (!payload.id || !payload.username || payload.exp <= Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function readCookie(request: Request, name: string): string | undefined {
  const cookie = request.headers.get("cookie") || "";
  return cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1);
}

export function sessionFromRequest(request: Request): DiscordSession | null {
  return verifySessionToken(readCookie(request, SESSION_COOKIE));
}

export function secureCookie(name: string, value: string, maxAge: number, secure = true): string {
  return `${name}=${value}; Path=/; HttpOnly; ${secure ? "Secure; " : ""}SameSite=Lax; Max-Age=${maxAge}`;
}

export function clearCookie(name: string, secure = true): string {
  return `${name}=; Path=/; HttpOnly; ${secure ? "Secure; " : ""}SameSite=Lax; Max-Age=0`;
}

export function createOAuthState(): string {
  return randomBytes(24).toString("base64url");
}

export function discordConfig() {
  return {
    clientId: requiredEnv("DISCORD_CLIENT_ID"),
    clientSecret: requiredEnv("DISCORD_CLIENT_SECRET"),
  };
}

export function json(data: unknown, status = 200): Response {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}
