import type { Config } from "@netlify/functions";
import { clearCookie, oauthReturnLocation, oauthReturnValue, SESSION_COOKIE } from "./_lib/auth";

const handler = async (request: Request) => {
  const requestUrl = new URL(request.url);
  const location = oauthReturnLocation(oauthReturnValue(requestUrl.searchParams.get("returnTo")));
  return new Response(null, {
    status: 302,
    headers: {
      Location: location,
      "Set-Cookie": clearCookie(SESSION_COOKIE, requestUrl.protocol === "https:"),
      "Cache-Control": "no-store",
    },
  });
};

export default handler;

export const config: Config = {
  path: ["/api/auth/discord/logout", "/api/auth/discord/logout/"],
  method: "GET",
};
