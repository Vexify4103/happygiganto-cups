import { MongoClient, ServerApiVersion, type Collection, type ObjectId } from "mongodb";

export type Tournament = "league" | "valorant";

export type ApplicationDocument = {
  _id?: ObjectId;
  tournament: Tournament;
  playerName: string;
  riotId: string;
  contact: string;
  preferredRole: string;
  mainRole?: string;
  secondaryRole?: string;
  rank: string;
  opggUrl?: string;
  peakRank?: string;
  mostPlayedAgents?: string[];
  language: string;
  flexRole: boolean;
  notes: string;
  consentAt: Date;
  discord: {
    id: string;
    username: string;
    displayName: string;
  };
  team: string;
  assignedAt?: Date;
  assignedBy?: string;
  createdAt: Date;
  updatedAt: Date;
};

let clientPromise: Promise<MongoClient> | undefined;
let indexesPromise: Promise<unknown> | undefined;

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

async function mongoClient(): Promise<MongoClient> {
  if (!clientPromise) {
    const client = new MongoClient(requiredEnv("MONGODB_URI"), {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      maxPoolSize: 5,
      minPoolSize: 0,
      connectTimeoutMS: 5_000,
      serverSelectionTimeoutMS: 5_000,
      socketTimeoutMS: 10_000,
    });
    clientPromise = client.connect().catch((error) => {
      clientPromise = undefined;
      throw error;
    });
  }
  return clientPromise;
}

export async function applicationsCollection(): Promise<Collection<ApplicationDocument>> {
  const client = await mongoClient();
  const databaseName = process.env.MONGODB_DB_NAME?.trim() || "happygiganto_cups";
  const collection = client.db(databaseName).collection<ApplicationDocument>("applications");

  if (!indexesPromise) {
    indexesPromise = Promise.all([
      collection.createIndex({ tournament: 1, "discord.id": 1 }, { unique: true }),
      collection.createIndex({ createdAt: -1 }),
      collection.createIndex({ tournament: 1, team: 1 }),
    ]).catch((error) => {
      indexesPromise = undefined;
      throw error;
    });
  }
  await indexesPromise;
  return collection;
}
