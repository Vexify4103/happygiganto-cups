import type { Config } from "@netlify/functions";
import { isAdminSession, json, sessionFromRequest } from "./_lib/auth";

const handler = async (request: Request) => {
  const session = sessionFromRequest(request);
  if (!session) return json({ authenticated: false });

  return json({
    authenticated: true,
    isAdmin: isAdminSession(session),
    user: {
      id: session.id,
      username: session.username,
      globalName: session.globalName,
      avatar: session.avatar,
    },
  });
};

export default handler;

export const config: Config = {
  path: ["/api/auth/discord/session", "/api/auth/discord/session/"],
  method: "GET",
};
