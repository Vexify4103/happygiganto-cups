import type { Config } from "@netlify/functions";
import { createOAuthState, discordConfig, OAUTH_STATE_COOKIE, secureCookie } from "./_lib/auth";

const handler = async (request: Request) => {
  try {
    const { clientId } = discordConfig();
    const state = createOAuthState();
    const requestUrl = new URL(request.url);
    const origin = requestUrl.origin;
    const callback = `${origin}/api/auth/discord/callback`;
    const authorization = new URL("https://discord.com/oauth2/authorize");
    authorization.search = new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      redirect_uri: callback,
      scope: "identify",
      state,
      prompt: "consent",
    }).toString();

    return new Response(null, {
      status: 302,
      headers: {
        Location: authorization.toString(),
        "Set-Cookie": secureCookie(OAUTH_STATE_COOKIE, state, 600, requestUrl.protocol === "https:"),
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new Response(null, {
      status: 302,
      headers: { Location: "/?auth=configuration#apply" },
    });
  }
};

export default handler;

export const config: Config = {
  path: "/api/auth/discord/login",
  method: "GET",
};
