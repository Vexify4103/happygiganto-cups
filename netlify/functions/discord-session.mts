import type { Config } from "@netlify/functions";
import { json, sessionFromRequest } from "./_lib/auth";

const handler = async (request: Request) => {
  const session = sessionFromRequest(request);
  if (!session) return json({ authenticated: false });

  return json({
    authenticated: true,
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
  path: "/api/auth/discord/session",
  method: "GET",
};
