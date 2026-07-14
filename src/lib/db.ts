import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@/db/schema";
import * as relations from "@/db/relations";

const connectionString = process.env.DATABASE_URL;

if (!connectionString && process.env.NODE_ENV !== "production") {
  console.warn("DATABASE_URL is not set");
}

export const db = drizzle(connectionString || "postgresql://localhost:5432/twitter_auto", {
  schema: { ...schema, ...relations },
});
