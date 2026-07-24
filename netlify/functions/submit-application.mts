import type { Config } from "@netlify/functions";
import { MongoServerError } from "mongodb";
import { json, sameOrigin, sessionFromRequest } from "./_lib/auth";
import { applicationsCollection, type Tournament } from "./_lib/mongodb";

const requiredFields = ["tournament", "player-name", "riot-id", "preferred-role", "rank", "language", "consent"];
const tournaments = new Set<Tournament>(["league", "valorant"]);
const languages = new Set(["de", "en", "both"]);

function field(formData: FormData, name: string, maxLength: number): string {
  return String(formData.get(name) || "").trim().slice(0, maxLength);
}

const handler = async (request: Request) => {
  if (!sameOrigin(request)) return json({ error: "Invalid request origin." }, 403);
  const session = sessionFromRequest(request);
  if (!session) return json({ error: "Discord login required." }, 401);

  const incoming = await request.formData();
  if (field(incoming, "bot-field", 100)) return json({ ok: true });
  for (const requiredField of requiredFields) {
    if (!field(incoming, requiredField, 4_000)) {
      return json({ error: `Missing field: ${requiredField}` }, 400);
    }
  }

  const tournament = field(incoming, "tournament", 20) as Tournament;
  const language = field(incoming, "language", 20);
  if (!tournaments.has(tournament) || !languages.has(language)) {
    return json({ error: "Invalid application data." }, 400);
  }

  const now = new Date();
  try {
    const collection = await applicationsCollection();
    await collection.insertOne({
      tournament,
      playerName: field(incoming, "player-name", 120),
      riotId: field(incoming, "riot-id", 120),
      contact: field(incoming, "contact", 254).toLowerCase(),
      preferredRole: field(incoming, "preferred-role", 80),
      rank: field(incoming, "rank", 80),
      language,
      flexRole: field(incoming, "flex-role", 10) === "yes",
      notes: field(incoming, "notes", 2_000),
      consentAt: now,
      discord: {
        id: session.id,
        username: session.username,
        displayName: session.globalName || session.username,
      },
      team: "",
      createdAt: now,
      updatedAt: now,
    });
    return json({ ok: true }, 201);
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return json({ error: "You already applied for this tournament.", code: "duplicate" }, 409);
    }
    console.error("MongoDB application insert failed", error);
    return json({ error: "Application could not be stored." }, 503);
  }
};

export default handler;

export const config: Config = {
  path: ["/api/apply", "/api/apply/"],
  method: "POST",
};
