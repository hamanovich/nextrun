import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { lazyClient } from "@/lib/lazy";
import * as schema from "./schema";

export const db = lazyClient(() => {
  const sql = neon(process.env.DATABASE_URL!);
  return drizzle(sql, { schema });
});
