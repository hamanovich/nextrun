# CLAUDE.md

Guidance for Claude Code (and contributors) working in this repository.

## Project

**NextRun** — a production-ready Next.js 16 starter / boilerplate: Better Auth (Google OAuth), Stripe payments with a credit system, a grammY Telegram bot, Drizzle ORM on Neon Postgres, and a shadcn/ui component library. The marketing surface (home, about, pricing) follows a strict monochrome design language meant to be reusable as a starting point for other projects.

## Tech stack

- **Next.js 16** (App Router, Turbopack, React Server Components) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS v4** — theme defined inline via `@theme` in `src/app/globals.css` (OKLch tokens); there is **no** `tailwind.config`. PostCSS uses `@tailwindcss/postcss`.
- **shadcn/ui** in `src/components/ui/**` (generated; lint- and coverage-excluded — do not hand-edit). Icons: `lucide-react`.
- **Better Auth** (`src/lib/auth.ts`, Drizzle adapter) · **Drizzle ORM** + **Neon Postgres** (`src/db`)
- **Stripe** (checkout + webhooks) · **grammY** Telegram bot (`src/bot`)
- **TanStack Query** (client data) · **Zod** (validation) · **next-themes** (dark mode) · **Vitest** + Testing Library
- Package manager / runtime: **Bun**.

## Commands

```bash
bun run dev            # dev server (Turbopack)
bun run build          # production build
bun run check          # ts:check + lint + format + test  ← run before declaring work done
bun run ts:check       # tsc --noEmit
bun run lint           # eslint
bun run test           # vitest run
bun run db:push        # push Drizzle schema to the DB
bun run stripe:listen  # forward Stripe webhooks to localhost
bun run bot:dev        # run the Telegram bot in watch mode
```

Always verify changes with `bun run ts:check`, `bun run lint`, and `bun run test` (or `bun run check`) before claiming completion.

## Architecture & data flow

- **Server Components by default.** `"use client"` lives only at leaf components (forms, motion, anything using hooks/session/theme).
- **Database** access goes through **Drizzle** inside **Server Actions** (`src/actions/*`). There is intentionally no `src/services/` layer. No raw DB client calls from components.
- **Auth:** read the session server-side with `getSessionUser()` (`src/actions/user.ts`); on the client use `authClient` (`src/lib/auth-client.ts`). Route protection is in `src/proxy.ts` (Next.js middleware — guards `/profile`). There is **no i18n / locale routing**.
- **Client data fetching** uses **TanStack Query** hooks in `src/hooks/*` (e.g. `use-credits.ts`) wrapping Server Actions / API routes.
- **Env:** never read `process.env` directly for required config — import the validated `env` from `src/lib/env.ts` (Zod-validated at startup; the full list is in `.env.example`).
- **API routes** (`src/app/api/*`): `auth/[...all]`, `credits`, `health`, `webhooks/stripe`.
- **Metadata/SEO:** each page keeps its metadata in a sibling `metadata.ts`; site-wide defaults + JSON-LD `@graph` live in `src/app/layout.tsx`.

## Conventions

Full rules: `.claude/rules/code-style.md`. Highlights:

- **Arrow functions** for app code (`const X = () => ...`); Next.js page/layout default exports and framework hooks like `generateMetadata` are the exception.
- Merge classes with **`cn()` from `@/lib/utils`**. Import aliases: `@/*` → `src/*`, `@/public/*` → `public/*`, `@app` → `package.json`.
- `Link` from `next/link`; `redirect`/`useRouter`/`usePathname` from `next/navigation`.
- Validate all user input with Zod in Server Actions. No comments unless documenting non-obvious logic.
- **Design is strict monochrome:** only the neutral OKLch scale with `--primary` as the single accent; no gradient text, no colored status dots, no hardcoded brand colors (`text-destructive` only for genuine errors). Use `min-h-[100dvh]`/`min-h-[60vh]`, never `h-screen`.

## Testing

- Vitest + Testing Library (`jsdom`); setup in `src/test`. `src/components/ui/**` is excluded from coverage.
- Tests are **behavior-focused**: assert content, roles, and behavior — not exact Tailwind class strings. When redesigning a component, update its test to match behavior rather than re-pinning CSS classes.

## Dependency version locks (do not bump)

Two transitive versions are pinned in `package.json` to keep the build and tests working. Bumping them reintroduces real failures:

- **`kysely` overridden to `0.28.17`.** `better-auth` bundles `@better-auth/kysely-adapter` (loaded even though we use the Drizzle adapter); it imports `DEFAULT_MIGRATION_LOCK_TABLE`/`DEFAULT_MIGRATION_TABLE` from the `kysely` root. `kysely@0.29.x` moved those to `kysely/migration` → Turbopack fails with "Export DEFAULT_MIGRATION_LOCK_TABLE doesn't exist".
- **`@vitejs/plugin-react` v6 needs `vite` 8.** Keep `vite` on 8 (resolved transitively; `vitest@4` works with it). If `vite` slips back to 7 while plugin-react is v6, the test runner crashes at startup with `ERR_PACKAGE_PATH_NOT_EXPORTED` on `vite/internal`. The new `react-hooks/error-boundaries` rule (shipped with `eslint-config-next@16`) also bans returning JSX from inside `try/catch` — wrap only the awaited call in the try and return JSX after it.

## Secrets / going public

- Never commit real secrets. Only `.env.example` (placeholders) is tracked; `.gitignore` ignores `.env` and `.env.*`.
- All required env vars are validated at startup by `src/lib/env.ts` and listed in `.env.example`.
