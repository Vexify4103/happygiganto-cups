import type { Config } from "@netlify/functions";
import { clearCookie, SESSION_COOKIE } from "./_lib/auth";

const handler = async (request: Request) => new Response(null, {
  status: 302,
  headers: {
    Location: "/#apply",
    "Set-Cookie": clearCookie(SESSION_COOKIE, new URL(request.url).protocol === "https:"),
    "Cache-Control": "no-store",
  },
});

export default handler;

export const config: Config = {
  path: "/api/auth/discord/logout",
  method: "GET",
};
