# Better Auth Integration

This document outlines authentication in the NextRun application, implemented with **Better Auth** (Google OAuth) on the **Drizzle adapter**.

## Overview

- **Better Auth** handles sessions, OAuth, and the auth API routes.
- Storage is the **Drizzle adapter** over Neon Postgres - the `user`, `session`, `account`, and `verification` tables in `src/db/schema.ts` are the auth contract (see `NEON_DRIZZLE_INTEGRATION.md`).
- The only social provider configured is **Google** (offline access, account chooser + consent).
- Read the session **server-side** with `getSessionUser()`; on the **client** use `authClient`.

## Server config (`src/lib/auth.ts`)

The `auth` instance is **lazy** (built on first use, not at import) so `next build` needs no auth secrets:

```ts
import "server-only";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "@/lib/env";
import { lazyClient } from "@/lib/lazy";

export const auth = lazyClient(() =>
  betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: {
        ...schema,
        user: schema.users,
        session: schema.sessions,
        account: schema.accounts,
      },
    }),
    trustedOrigins: [env.NEXT_PUBLIC_DOMAIN],
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        accessType: "offline",
        prompt: "select_account consent",
      },
    },
  }),
);
```

Note the schema aliasing: Better Auth expects `user`/`session`/`account`, but the Drizzle tables are named `users`/`sessions`/`accounts`, so they are remapped here.

## API route (`src/app/api/auth/[...all]/route.ts`)

A single catch-all route mounts the whole Better Auth handler:

```ts
import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";
import "@/lib/logger";

export const { GET, POST } = toNextJsHandler(auth);
```

This serves sign-in, callback, sign-out, session, etc., under `/api/auth/*`.

## Client (`src/lib/auth-client.ts`)

```ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();
```

Use `authClient` in Client Components (`"use client"`) for `signIn`, `signOut`, and `useSession`. Keep it at the leaves of the tree.

## Reading the session server-side

In Server Components and Server Actions, use `getSessionUser()` (`src/actions/user.ts`) - it wraps `auth.api.getSession({ headers })` and enriches the user with the Stripe/credit columns from the database:

```ts
const session = await getSessionUser();
if (!session) {
  // not signed in
}
// session.userId, session.user.stripeCredits, ...
```

## Route protection (`src/proxy.ts`)

Next.js middleware guards protected routes by checking only for the session cookie (a cheap edge check - no DB call):

```ts
import { getSessionCookie } from "better-auth/cookies";

const protectedRoutes = ["/profile"];
// if a protected path has no session cookie -> redirect to /auth/signin?callbackUrl=...
```

`getSessionCookie` is a presence check, not validation; full session validation still happens server-side in actions via `getSessionUser()`. Add paths to `protectedRoutes` to extend coverage.

## Environment Variables Required

Add to your `.env` (validated by `src/lib/env.ts`):

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
BETTER_AUTH_URL=https://your-app.dev        # the app origin (prod origin in production)
BETTER_AUTH_SECRET=...                       # min 32 chars - used to sign sessions
```

`BETTER_AUTH_URL` must equal the deployed origin; `BETTER_AUTH_SECRET` must be at least 32 characters.

## Google OAuth setup

1. Google Cloud Console -> APIs & Services -> Credentials -> **Create OAuth client ID** (Web application).
2. **Authorized redirect URI:** `https://your-app.dev/api/auth/callback/google` (and a localhost variant for dev: `http://localhost:3000/api/auth/callback/google`).
3. Copy the client ID/secret into `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.
4. In production, make sure `BETTER_AUTH_URL` and `NEXT_PUBLIC_DOMAIN` point at the prod origin and the redirect URI is registered (a common cutover gotcha - see `DEPLOYMENT.md`).

## Usage

### For Users

1. Click sign in -> redirected to Google -> choose account + consent.
2. Returned to the app authenticated; a `session` row is created.

### For Developers

1. **Server:** read the user with `getSessionUser()`; gate every privileged action on a valid session.
2. **Client:** use `authClient.useSession()` / `authClient.signIn.social({ provider: "google" })` / `authClient.signOut()`.
3. **Protect a route:** add its path prefix to `protectedRoutes` in `src/proxy.ts`.

## Security Notes

- Every Server Action that touches user data must call `getSessionUser()` and reject when it returns `null`.
- The middleware cookie check is a fast gate only - **authorization decisions still happen server-side** with a validated session.
- `BETTER_AUTH_SECRET` is a real secret (min 32 chars); keep it runtime-only, never a build arg.
- `trustedOrigins` is pinned to `NEXT_PUBLIC_DOMAIN` to prevent cross-origin abuse of the auth endpoints.
- Session/account rows cascade-delete with the user (`onDelete: cascade`).

## Next Steps

1. Create the Google OAuth client and register redirect URIs.
2. Generate a 32+ char `BETTER_AUTH_SECRET`.
3. Run `bun run db:push` so the auth tables exist.
4. Add more providers under `socialProviders` (GitHub, etc.) if needed.
5. Extend `protectedRoutes` as you add gated pages.
