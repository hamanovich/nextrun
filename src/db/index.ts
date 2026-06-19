import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "@/lib/env";
import { lazyClient } from "@/lib/lazy";
import * as schema from "./schema";

export const db = lazyClient(() => {
  const sql = neon(env.DATABASE_URL);
  return drizzle(sql, { schema });
});
