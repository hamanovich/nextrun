# Code Style & Conventions

## TypeScript

- Strict TypeScript. Prefer precise types; avoid `any` (the lint config tolerates it, but don't reach for it in new code — use `unknown` + narrowing).
- Use `type` for object shapes (matches `src/types/*`). Component prop types are named `[ComponentName]Props`.

## JavaScript / React

- Always use arrow functions (`const name = () => ...`). Avoid the `function` keyword unless hoisting or dynamic `this` is required. ESLint enforces `prefer-arrow-callback`. (Next.js page/layout default exports and framework hooks like `generateMetadata` are the exception.)
- Use concise bodies for simple functions.
- Naming: components `PascalCase`; variables/functions `camelCase`.
- Keep Client Components at the leaves of the tree; default to Server Components.
- Use `next/image` for images.
- Use absolute imports via aliases: `@/*` → `src/*`, `@/public/*` → `public/*`, `@app` → `package.json`.
- Always merge conditional classes with `cn()` from `@/lib/utils` — no ad-hoc duplicated class strings.
- Navigation: import `Link` from `next/link` and `redirect`/`useRouter`/`usePathname` from `next/navigation`. There is no i18n layer.
- Pages: declare metadata via `export const metadata` / `generateMetadata` in layouts/pages (this repo keeps page metadata in a sibling `metadata.ts`).

## Comments

- Do not add comments. Only document genuinely non-obvious business logic or edge cases.

## Before writing code

- Check whether a utility already exists in `src/lib` or `src/hooks` before creating a new one.
- Reuse existing Server Actions (`src/actions/*`) and TanStack Query hooks (`src/hooks/*`) rather than writing new data access.

## Data access layout (no service layer)

- **Database** access goes through Drizzle ORM (`src/db`) against Neon Postgres. Queries live inside Server Actions (`src/actions/*`); there is intentionally no `src/services/` layer.
- **Auth** is Better Auth (`src/lib/auth.ts`, Drizzle adapter). Read the session server-side via `getSessionUser()` (`src/actions/user.ts`); on the client use `authClient` (`src/lib/auth-client.ts`).
- **Client data fetching** uses TanStack Query hooks in `src/hooks/*` (e.g. `use-credits.ts`) wrapping Server Actions / API routes.

## The "Never" list (lessons learned)

- **Never** use raw `fetch` for mutations — always use Server Actions (`"use server"`) or the dedicated API routes (`src/app/api/*`).
- **Never** skip Zod validation for user-supplied input in a Server Action.
- **Never** read `process.env` directly for required config — import the validated `env` from `src/lib/env.ts`.
- **Never** call the raw database client from a component — go through a Server Action or hook.
- **Never** use `function` declarations for app code — arrow functions only (Next.js page/layout exports and framework hooks excepted).
- **Never** mix client logic into Server Components or vice versa — respect the RSC boundary; `"use client"` lives at the leaves.
- **Never** hand-edit `src/components/ui/**` to match these rules — it is shadcn-generated and lint-excluded.

## Design language

- The UI is strict monochrome: only the neutral OKLch scale, with `--primary` as the single accent (near-black in light, near-white in dark). No gradient text, no colored status dots, no hardcoded brand colors (`bg-green-500`, `text-blue-600`, etc.); `text-destructive` is allowed only for genuine error states. Use `min-h-[100dvh]`/`min-h-[60vh]`, never `h-screen`.
