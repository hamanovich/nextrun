# Neon + Drizzle Integration

This document outlines the database layer in the NextRun application: **Drizzle ORM** running on **Neon serverless Postgres**.

## Overview

- **Neon** is serverless Postgres with branching and scale-to-zero. Each environment (prod, dev) uses its own Neon branch, so dev data never touches prod.
- **Drizzle ORM** is the type-safe query builder and migration tool. Schema lives in `src/db/schema.ts` and is the single source of truth.
- There is **no service layer.** Queries live inside Server Actions (`src/actions/*`); components never touch the database client directly.

## Two database clients (this is intentional)

| File                  | Driver                                           | Used by                                      | Why                                                                                        |
| --------------------- | ------------------------------------------------ | -------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `src/db/index.ts`     | `drizzle-orm/neon-http` (HTTP)                   | Next.js app (Server Actions, route handlers) | Stateless HTTP fetch - ideal for serverless request/response; no connection to keep open   |
| `src/db/index.bot.ts` | `drizzle-orm/neon-serverless` (WebSocket `Pool`) | the grammY bot (`src/bot`)                   | The bot is a long-running process; a pooled WebSocket connection suits its long-lived loop |

The app client is **lazy** so `next build` needs no `DATABASE_URL`:

```ts
// src/db/index.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { lazyClient } from "@/lib/lazy";
import * as schema from "./schema";

export const db = lazyClient(() => {
  const sql = neon(process.env.DATABASE_URL!);
  return drizzle(sql, { schema });
});
```

`neon()` throws on an empty connection string, and `next build` executes route modules. `lazyClient()` (`src/lib/lazy.ts`) defers construction to first use (at request time), so no secret is needed at build. Any new module-level client that throws on empty config must be wrapped the same way.

The bot client is **not** lazy - the bot process always has the env present at startup, and `next build` never imports `src/bot`.

## Schema

`src/db/schema.ts` defines four tables. The first three are the Better Auth contract (see `BETTER_AUTH_INTEGRATION.md`); `user` carries the extra Stripe/credit columns:

- `user` - id, name, email, emailVerified, image, timestamps, plus `stripeCredits` (default 5), `stripeCustomerId`, `stripeCheckoutSessionId`. Indexed on `stripeCustomerId`.
- `session` - Better Auth sessions (token, expiry, ip, userAgent), `userId` FK with `onDelete: cascade`.
- `account` - OAuth/provider accounts (tokens), `userId` FK with `onDelete: cascade`.
- `verification` - Better Auth verification records.

Define tables with the `pgTable` helpers (`text`, `integer`, `boolean`, `timestamp`, `index`). Use `withTimezone: true, mode: "date"` for timestamps to keep JS `Date` semantics.

## Environment Variables Required

Add to your `.env` (validated at startup by `src/lib/env.ts`):

```env
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
```

Get the pooled connection string from the Neon dashboard (Connection Details). Use the **pooled** endpoint for the app.

## Drizzle config

`drizzle.config.ts` points drizzle-kit at the schema and the Neon database:

```ts
import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { env } from "@/lib/env";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: { url: env.DATABASE_URL },
});
```

## Migrations / pushing schema

This project uses **push** (schema-first), not generated migration files, for the dev flow:

```bash
bun run db:push        # drizzle-kit push - syncs src/db/schema.ts to the database
```

`db:push` diffs the schema against the live database and applies the change directly. Run it after editing `schema.ts`.

> **Branch safety:** point `DATABASE_URL` at a **dev Neon branch** before `db:push` during development. Create a branch in the Neon dashboard (or CLI) so you never push experimental schema to prod. For production, apply schema changes deliberately against the prod branch.

## Querying (inside Server Actions)

All access goes through `db` inside a `"use server"` action. Example from `src/actions/user.ts`:

```ts
"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

const rows = await db
  .select({
    stripeCredits: sql<number>`coalesce(${users.stripeCredits}, 0)`,
    stripeCustomerId: users.stripeCustomerId,
  })
  .from(users)
  .where(eq(users.id, userId))
  .limit(1);
```

## Usage

### For Developers

1. Edit `src/db/schema.ts` to add/change tables or columns.
2. Run `bun run db:push` against a dev Neon branch.
3. Write the query inside a Server Action in `src/actions/*` - import `db` from `@/db` and the table from `@/db/schema`.
4. From the client, wrap the action in a TanStack Query hook in `src/hooks/*` (e.g. `use-credits.ts`).

## Security Notes

- **Never** call `db` from a component - always go through a Server Action or a hook that wraps one.
- **Never** read `process.env.DATABASE_URL` directly elsewhere - the connection string is centralized in the two `db` clients; required config is validated via `src/lib/env.ts`.
- Validate all user-supplied input with Zod inside the action before it reaches a query.
- FK cascades (`onDelete: cascade`) mean deleting a user removes their sessions and accounts automatically.

## Next Steps

1. Create a Neon project and copy the pooled `DATABASE_URL`.
2. Create a separate Neon **branch** for dev.
3. Run `bun run db:push` to materialize the schema.
4. Add new tables to `schema.ts` and new queries to `src/actions/*` as features grow.
5. Consider generated SQL migrations (`drizzle-kit generate`) if you later need an auditable migration history for production.
