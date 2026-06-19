# Contributing to NextRun

Thanks for your interest in improving NextRun. This guide covers local setup, the conventions the project enforces, and how to get a change merged.

## Prerequisites

- **[Bun](https://bun.sh)** - the package manager and runtime for this repo (do not use npm/yarn/pnpm; the lockfile is `bun.lock`).
- A **Neon Postgres** database (or any Postgres) for the data layer.
- Optional, per feature: a **Stripe** account, a **Google OAuth** client, and a **Telegram bot** token.

## Setup

```bash
git clone https://github.com/hamanovich/nextrun.git
cd nextrun
bun install
cp .env.example .env        # then fill in the values
bun run db:push             # sync the Drizzle schema to your database
bun run dev                 # http://localhost:3000
```

All required environment variables are listed in `.env.example` and validated at startup by `src/lib/env.ts` - the app fails fast if one is missing. See the per-integration guides in [`docs/`](docs) for what each area needs.

## Useful commands

```bash
bun run dev            # dev server (Turbopack)
bun run build          # production build
bun run check          # ts:check + lint + format:check + test  ← run before every PR
bun run ts:check       # tsc --noEmit
bun run lint           # eslint
bun run test           # vitest run
bun run format         # prettier --write .
bun run db:push        # push Drizzle schema to the DB
bun run stripe:listen  # forward Stripe webhooks to localhost
bun run bot:dev        # run the Telegram bot in watch mode
```

**Before opening a PR, `bun run check` must pass.** It is the same gate CI runs.

## Code style & conventions

Full rules live in [`CLAUDE.md`](CLAUDE.md) and [`.claude/rules/code-style.md`](.claude/rules/code-style.md). Highlights:

- **Arrow functions** for app code (`const X = () => ...`); the only exceptions are Next.js page/layout default exports and framework hooks like `generateMetadata`.
- **Server Components by default.** Keep `"use client"` at the leaves (forms, motion, hooks/session/theme). Respect the RSC boundary.
- **Data access** goes through Drizzle inside **Server Actions** (`src/actions/*`) - there is intentionally no service layer, and components never call the DB client directly.
- **Validate all user input with Zod** in Server Actions. Never skip it.
- Never read `process.env` directly for required config - import the validated `env` from `src/lib/env.ts`.
- Merge classes with **`cn()`** from `@/lib/utils`; use the import aliases (`@/*` → `src/*`).
- **Design is strict monochrome:** only the neutral OKLch scale with `--primary` as the single accent. No gradient text, no colored status dots, no hardcoded brand colors. Use `min-h-[100dvh]`/`min-h-[60vh]`, never `h-screen`.
- **No em dash** (`—`, U+2014) in any `.ts` or `.html` file. Use a hyphen, comma, colon, or parentheses. Markdown is exempt.
- Do not hand-edit `src/components/ui/**` (shadcn-generated, lint-excluded).

## Testing

- Vitest + Testing Library (`jsdom`); setup in `src/test`.
- Tests are **behavior-focused** - assert content, roles, and behavior, not exact Tailwind class strings. When you redesign a component, update its test to match behavior rather than re-pinning CSS classes.
- Add or update tests for the behavior you change.

## Commits

This repo uses **[Conventional Commits](https://www.conventionalcommits.org/)**, enforced by **commitlint** via a Husky `commit-msg` hook. A `pre-commit` hook runs **lint-staged** (eslint + prettier on staged files), so commits with lint errors are rejected.

Format: `type(scope): subject`

```
feat(pricing): add annual billing toggle
fix(webhooks): verify Stripe signature before crediting
docs(auth): document Google OAuth redirect URIs
chore(deps): bump drizzle-orm
```

Common types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `style`, `perf`, `ci`.

> The hooks run automatically after `bun install` (`prepare: husky`). If they do not fire, run `bun run prepare` once.

## Dependency version locks (do not bump)

Two transitive versions are pinned in `package.json` to keep the build and tests working - **do not** bump them without reading the rationale in [`CLAUDE.md`](CLAUDE.md):

- **`kysely` is pinned to `0.28.17`** (a `better-auth` transitive import breaks on `0.29.x`).
- **`vite` must stay on 8** while `@vitejs/plugin-react` is v6 (otherwise the test runner crashes at startup).

## Pull requests

1. Branch off `main` (the default working branch in this repo is `develop`; target `main` for releases per the deployment model).
2. Keep the change focused; update tests and any affected doc in [`docs/`](docs) in the **same** PR (e.g. a Stripe-flow change updates `docs/STRIPE_INTEGRATION.md`).
3. Run `bun run check` locally - it must be green.
4. Write a clear PR description: what changed, why, and how you verified it.
5. Be responsive to review feedback.

## Reporting bugs & requesting features

Open an issue on [GitHub](https://github.com/hamanovich/nextrun/issues). For **security** issues, do **not** open a public issue - follow [`SECURITY.md`](SECURITY.md) instead.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
