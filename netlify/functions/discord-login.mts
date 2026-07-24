import type { Config } from "@netlify/functions";
import {
  createOAuthState,
  discordConfig,
  OAUTH_RETURN_COOKIE,
  OAUTH_STATE_COOKIE,
  oauthReturnValue,
  secureCookie,
} from "./_lib/auth";

const handler = async (request: Request) => {
  try {
    const { clientId } = discordConfig();
    const state = createOAuthState();
    const requestUrl = new URL(request.url);
    const returnValue = oauthReturnValue(requestUrl.searchParams.get("returnTo"));
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

    const headers = new Headers({
      Location: authorization.toString(),
      "Cache-Control": "no-store",
    });
    headers.append("Set-Cookie", secureCookie(OAUTH_STATE_COOKIE, state, 600, requestUrl.protocol === "https:"));
    headers.append("Set-Cookie", secureCookie(OAUTH_RETURN_COOKIE, returnValue, 600, requestUrl.protocol === "https:"));

    return new Response(null, {
      status: 302,
      headers,
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
  path: ["/api/auth/discord/login", "/api/auth/discord/login/"],
  method: "GET",
};
