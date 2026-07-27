import type { Config } from "@netlify/functions";

const handler = async () =>
  Response.json(
    {
      error: "Applications have moved to happygiganto.de.",
      code: "moved",
      location: "https://happygiganto.de/tournaments",
    },
    {
      status: 410,
      headers: { Location: "https://happygiganto.de/tournaments" },
    },
  );

export default handler;

export const config: Config = {
  path: ["/api/apply", "/api/apply/"],
  method: "POST",
};
