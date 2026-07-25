import type { Config } from "@netlify/functions";
import { MongoServerError } from "mongodb";
import { json, sameOrigin, sessionFromRequest } from "./_lib/auth";
import { applicationsCollection, type Tournament } from "./_lib/mongodb";

const requiredFields = ["tournament", "player-name", "riot-id", "rank", "language", "consent"];
const tournaments = new Set<Tournament>(["league", "valorant"]);
const languages = new Set(["de", "en", "both"]);
const leagueRoles = new Set(["Top", "Jungle", "Mid", "ADC", "Support"]);
const valorantRoles = new Set(["Duelist", "Initiator", "Controller", "Sentinel"]);
const valorantAgents = new Set([
  "Astra", "Breach", "Brimstone", "Chamber", "Clove", "Cypher", "Deadlock", "Fade", "Gekko", "Harbor",
  "Iso", "Jett", "KAY/O", "Killjoy", "Miks", "Neon", "Omen", "Phoenix", "Raze", "Reyna", "Sage", "Skye",
  "Sova", "Tejo", "Veto", "Viper", "Vyse", "Waylay", "Yoru",
]);

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

  const opggUrl = field(incoming, "opgg-url", 500);
  const peakRank = field(incoming, "peak-rank", 80);
  const mainRole = field(incoming, "main-role", 80);
  const secondaryRole = field(incoming, "secondary-role", 80);
  const mostPlayedAgents = [...new Set(incoming.getAll("most-played-agents")
    .map((value) => String(value).trim().slice(0, 80))
    .filter(Boolean))];
  if (!peakRank) return json({ error: "Peak rank is required." }, 400);

  if (tournament === "league") {
    if (!opggUrl) return json({ error: "OP.GG profile is required for League." }, 400);
    if (!leagueRoles.has(mainRole) || !leagueRoles.has(secondaryRole) || mainRole === secondaryRole) {
      return json({ error: "Valid and different main and secondary roles are required for League." }, 400);
    }
    try {
      const profileUrl = new URL(opggUrl);
      const hostname = profileUrl.hostname.toLowerCase();
      if (profileUrl.protocol !== "https:" || (hostname !== "op.gg" && !hostname.endsWith(".op.gg"))) {
        return json({ error: "Invalid OP.GG profile URL." }, 400);
      }
    } catch {
      return json({ error: "Invalid OP.GG profile URL." }, 400);
    }
  } else {
    if (!valorantRoles.has(mainRole) || !valorantRoles.has(secondaryRole) || mainRole === secondaryRole) {
      return json({ error: "Valid and different main and secondary roles are required for Valorant." }, 400);
    }
    if (mostPlayedAgents.some((agent) => !valorantAgents.has(agent))) {
      return json({ error: "Invalid Valorant agent selection." }, 400);
    }
  }

  const now = new Date();
  try {
    const collection = await applicationsCollection();
    await collection.insertOne({
      tournament,
      playerName: field(incoming, "player-name", 120),
      riotId: field(incoming, "riot-id", 120),
      contact: field(incoming, "contact", 254).toLowerCase(),
      preferredRole: mainRole,
      mainRole,
      secondaryRole,
      rank: field(incoming, "rank", 80),
      opggUrl: tournament === "league" ? opggUrl : "",
      peakRank,
      mostPlayedAgents: tournament === "valorant" ? mostPlayedAgents : [],
      language,
      flexRole: false,
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
