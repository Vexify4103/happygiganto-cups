import type { Config } from "@netlify/functions";
import { ObjectId } from "mongodb";
import { isAdminSession, json, sameOrigin, sessionFromRequest } from "./_lib/auth";
import { applicationsCollection } from "./_lib/mongodb";

const teamOptions = new Set([
  "",
  "Team 1",
  "Team 2",
  "Team 3",
  "Team 4",
  "Team 5",
  "Team 6",
  "Team 7",
  "Team 8",
  "Waitlist",
]);

const handler = async (request: Request) => {
  const session = sessionFromRequest(request);
  if (!session) return json({ error: "Discord login required." }, 401);
  if (!isAdminSession(session)) return json({ error: "Admin access required." }, 403);

  try {
    const collection = await applicationsCollection();

    if (request.method === "GET") {
      const documents = await collection.find({}, {
        projection: {
          tournament: 1,
          playerName: 1,
          riotId: 1,
          contact: 1,
          preferredRole: 1,
          rank: 1,
          language: 1,
          flexRole: 1,
          notes: 1,
          discord: 1,
          team: 1,
          createdAt: 1,
        },
      }).sort({ createdAt: -1 }).limit(1_000).toArray();

      return json({
        user: {
          id: session.id,
          username: session.username,
          globalName: session.globalName,
        },
        applications: documents.map((application) => ({
          id: application._id?.toHexString(),
          submittedAt: application.createdAt.toISOString(),
          tournament: application.tournament,
          playerName: application.playerName,
          riotId: application.riotId,
          contact: application.contact,
          preferredRole: application.preferredRole,
          rank: application.rank,
          language: application.language,
          flexRole: application.flexRole,
          notes: application.notes,
          discordId: application.discord.id,
          discordUsername: application.discord.username,
          discordDisplayName: application.discord.displayName,
          team: application.team,
        })),
      });
    }

    if (request.method === "PATCH") {
      if (!sameOrigin(request)) return json({ error: "Invalid request origin." }, 403);
      const body = await request.json() as { id?: unknown; team?: unknown };
      const id = typeof body.id === "string" ? body.id : "";
      const team = typeof body.team === "string" ? body.team : "";
      if (!ObjectId.isValid(id) || !teamOptions.has(team)) return json({ error: "Invalid assignment." }, 400);

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            team,
            assignedAt: new Date(),
            assignedBy: session.id,
            updatedAt: new Date(),
          },
        },
      );
      if (!result.matchedCount) return json({ error: "Application not found." }, 404);
      return json({ ok: true, id, team });
    }

    return json({ error: "Method not allowed." }, 405);
  } catch (error) {
    console.error("Admin application operation failed", error);
    return json({ error: "Database operation failed." }, 503);
  }
};

export default handler;

export const config: Config = {
  path: ["/api/admin/applications", "/api/admin/applications/"],
};
