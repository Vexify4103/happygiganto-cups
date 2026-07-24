import type { Config } from "@netlify/functions";
import { json, sameOrigin, sessionFromRequest } from "./_lib/auth";

const requiredFields = ["tournament", "player-name", "riot-id", "preferred-role", "rank", "language", "consent"];

const handler = async (request: Request) => {
  if (!sameOrigin(request)) return json({ error: "Invalid request origin." }, 403);
  const session = sessionFromRequest(request);
  if (!session) return json({ error: "Discord login required." }, 401);

  const incoming = await request.formData();
  for (const field of requiredFields) {
    if (!String(incoming.get(field) || "").trim()) {
      return json({ error: `Missing field: ${field}` }, 400);
    }
  }

  const formData = new URLSearchParams();
  for (const [key, value] of incoming.entries()) {
    if (typeof value === "string" && key !== "discord-id" && key !== "discord-username") {
      formData.set(key, value.slice(0, 4000));
    }
  }
  formData.set("form-name", "solo-registration");
  formData.set("discord-id", session.id);
  formData.set("discord-username", session.username);
  formData.set("discord-display-name", session.globalName || session.username);
  formData.set("discord-verified", "yes");

  const origin = new URL(request.url).origin;
  const netlifyResponse = await fetch(`${origin}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "HappyGiganto-Application-Function/1.0",
    },
    body: formData.toString(),
  });

  if (!netlifyResponse.ok) return json({ error: "Application could not be stored." }, 502);
  return json({ ok: true });
};

export default handler;

export const config: Config = {
  path: "/api/apply",
  method: "POST",
};
