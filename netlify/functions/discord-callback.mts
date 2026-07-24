import type { Config } from "@netlify/functions";
import {
  clearCookie,
  createSessionToken,
  discordConfig,
  OAUTH_STATE_COOKIE,
  readCookie,
  secureCookie,
  SESSION_COOKIE,
} from "./_lib/auth";

type DiscordUser = {
  id: string;
  username: string;
  global_name: string | null;
  avatar: string | null;
};

const handler = async (request: Request) => {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");
  const expectedState = readCookie(request, OAUTH_STATE_COOKIE);
  const isSecure = requestUrl.protocol === "https:";

  if (!code || !state || !expectedState || state !== expectedState) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/?auth=invalid-state#apply",
        "Set-Cookie": clearCookie(OAUTH_STATE_COOKIE, isSecure),
      },
    });
  }

  try {
    const { clientId, clientSecret } = discordConfig();
    const origin = requestUrl.origin;
    const tokenResponse = await fetch("https://discord.com/api/v10/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: `${origin}/api/auth/discord/callback`,
      }),
    });

    if (!tokenResponse.ok) throw new Error("Discord token exchange failed");
    const token = await tokenResponse.json() as { access_token: string };
    const userResponse = await fetch("https://discord.com/api/v10/users/@me", {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    if (!userResponse.ok) throw new Error("Discord user request failed");
    const user = await userResponse.json() as DiscordUser;
    const session = createSessionToken({
      id: user.id,
      username: user.username,
      globalName: user.global_name,
      avatar: user.avatar,
    });

    const headers = new Headers({
      Location: "/#apply",
      "Cache-Control": "no-store",
    });
    headers.append("Set-Cookie", secureCookie(SESSION_COOKIE, session, 60 * 60 * 24 * 7, isSecure));
    headers.append("Set-Cookie", clearCookie(OAUTH_STATE_COOKIE, isSecure));
    return new Response(null, { status: 302, headers });
  } catch {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/?auth=discord-error#apply",
        "Set-Cookie": clearCookie(OAUTH_STATE_COOKIE, isSecure),
      },
    });
  }
};

export default handler;

export const config: Config = {
  path: "/api/auth/discord/callback",
  method: "GET",
};
