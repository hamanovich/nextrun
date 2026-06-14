---
name: code-audit
description: Use when the user asks to audit the NextRun codebase, check production readiness, find technical debt, do a deep/broad code review, or asks "is the app ready for production?". Triggers on "full audit", "codebase audit", "pre-release check", "production readiness", or any whole-project quality assessment. For a single diff/PR/file, use code-review instead.
---

# Production Readiness Audit

## When to use

- **Use this** for a broad, whole-codebase assessment before a release or milestone.
- **Don't use this** for a single diff, PR, or file — use the `code-review` skill (faster, scoped).

**Role:** You are a Principal Full-Stack Engineer and Software Architect. Conduct a ruthless but objective audit. The goal is a "bird's eye view" — technical debt, architectural violations, hidden bugs. Reference file:line, never praise code for free, never invent issues.

## Setup — read first

- `CLAUDE.md` — architecture, data flow (Drizzle/Neon + Better Auth + Stripe credits + grammY bot), App Router conventions, business context
- `.claude/rules/code-style.md` — coding standards and the "Never" list

Source-of-truth files (read instead of trusting numbers in this skill — they drift):

- `vitest.config.ts` — test setup, `server-only` alias, mocks (note any missing coverage thresholds as a gap)
- `package.json` — exact dependency versions and scripts (incl. the intentional `kysely`/`vite` pins documented in CLAUDE.md — do not flag those as outdated)
- `src/lib/env.ts` — the env contract (Zod schema, parsed at startup, throws on missing vars)
- `src/db/schema.ts` — the Drizzle table definitions (users, sessions, credits)

## How to run the audit

1. **Baseline the gates.** Run `bun run check` (= `ts:check && lint && format && test`) and `bun run build`. Capture every failure first — these are free, high-confidence findings. (`format` writes Prettier changes; flag any file it rewrites.)
2. **Map before judging.** Enumerate `src/actions/`, `src/db/`, `src/lib/`, `src/hooks/`, `src/components/`, `src/app/`, `src/bot/`. For broad sweeps, dispatch parallel `Explore` agents per area and keep the conclusions.
3. **Delegate the deep dimensions** to the project subagents (run in parallel):
   - `security-reviewer` — session gates, credit deduct/refund integrity, Stripe webhook signature, bot trust boundary, secret/PII exposure.
   - `rsc-boundary-reviewer` — DB-in-actions boundary, RSC client/server split, code-style "Never" list.
4. **Grep recipes** for fast, mechanical violations:
   - DB client leaking out of actions/api: `grep -rnE 'from "@/db"' src/components src/hooks`
   - `any` usage: `grep -rnE ': any|<any>|as any' src/`
   - `function` declarations: `grep -rn 'function ' src/ --include='*.ts' --include='*.tsx'`
   - Raw fetch for mutations: `grep -rn 'fetch(' src/actions src/components`
   - Direct env reads: `grep -rn 'process.env\.' src/ --include='*.ts' --include='*.tsx'`
   - Hardcoded colors / `h-screen`: `grep -rnE 'bg-(green|blue|red|yellow)-|text-(green|blue|red)-|h-screen' src/ --include='*.tsx'`
   - Missing session gates: list every exported action and confirm `getSessionUser()` runs before user-scoped logic.
5. **Synthesize** into the audit artifact (see Output). Verify each subagent finding against the code before reporting it.

## Tech stack (majors; check `package.json` for exact pins)

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript 5 (strict) · Tailwind CSS v4 (`@theme` in `globals.css`, no `tailwind.config`) · shadcn/ui · TanStack Query v5 · **Better Auth** (Google OAuth) · **Drizzle ORM + Neon Postgres** · Stripe (credits + webhooks) · **grammY** Telegram bot · React Hook Form + Zod · next-themes · Vitest + React Testing Library · `consola`-based `logger`. Runtime/package manager: **Bun**. (No Sanity, MongoDB, OpenAI, Upstash/rate-limit, Sentry, or i18n — do not audit for those.)

## Focus areas

### 1. Architecture (data-flow boundary) — violations are CRITICAL

One data path, **no service layer**:

- **DB access** (`db` from `@/db`, schema `@/db/schema`) lives in `src/actions/*`, `src/app/api/*`, the Better Auth adapter (`src/lib/auth.ts`), and bot/db wiring (`src/db/*`, `src/bot/*`). Not in components or hooks.
- `src/hooks/*` — TanStack Query wrappers over actions / API routes (e.g. `use-credits.ts`). No raw fetch, no ad-hoc API routes for mutations.
- `src/app/api/*` is only: Better Auth catch-all (`auth/[...all]`), Stripe webhook, `credits` read, health check.

### 2. Auth & security

- Every user-scoped action resolves `getSessionUser()` before logic; data is scoped to the authenticated `userId` (`eq(users.id, userId)`), never to an unvalidated id from input.
- Credit spends are atomic and reversible: `consumeOneCredit` deducts under a `gte(stripeCredits, 1)` guard; callers `refundOneCredit` on failure. `updateUserStripeData` clamps negative balances.
- Stripe webhook verifies `STRIPE_WEBHOOK_SECRET` via `constructEvent` and grants credits only on a paid session with trusted `metadata.userId`, before any state change.
- Route protection: `src/proxy.ts` middleware guards `/profile` via the Better Auth session cookie — but actions must still gate the session themselves.
- No hardcoded secrets — all via `src/lib/env.ts`. Bot token / Stripe secret / DB URL never `NEXT_PUBLIC_`. Sanitize user-derived log values with `src/lib/sanitize.ts`.

### 3. Next.js App Router

- Server Components by default; `"use client"` only for state/events/browser APIs, pushed to the leaves.
- Pages fetch server-side (actions) and pass `initialData`/`placeholderData` to hooks.
- Mutations via Server Actions only. `next/image` for images, absolute `@/...` imports, navigation via `next/link` + `next/navigation` (no i18n layer).
- Page metadata lives in a sibling `metadata.ts`; site-wide defaults + JSON-LD `@graph` in `src/app/layout.tsx`.

### 4. Data layer (Drizzle / Neon)

- Queries live in actions; no per-request connection churn or N+1 across loops; multi-write atomicity where needed (use a transaction or a single guarded `update ... returning`). Indexes on frequently filtered columns in `src/db/schema.ts` (e.g. `stripeCustomerId`). Schema changes go through `bun run db:push`.

### 5. Client-side data management

- Correct TanStack Query cache invalidation after mutations; no duplicated load logic between RSC and hooks; optimistic updates where sensible; no needless re-renders in RHF forms.

### 6. Forms & validation

- Zod schemas reused on client (RHF resolver) and server (action) where applicable. No unvalidated action inputs (ids, price ids, amounts). UI surfaces validation errors.

### 7. TypeScript

- Avoid `any` (use `unknown` + narrowing); `type` for object shapes; no gratuitous `as`; all optional/nullable DB fields explicitly handled.

### 8. Testing & coverage

- Branching logic and external calls (Stripe, DB) are covered. Setup in `src/test/setup.ts` + `src/test/mocks/`; `server-only` is aliased in `vitest.config.ts`.
- If no coverage thresholds are configured, flag it and recommend `test:coverage` gates. Tests are **behavior-focused** — assert content/roles/behavior, not exact Tailwind classes (`src/components/ui/**` is excluded from coverage).

### 9. Design language

- Strict monochrome: only the neutral OKLch scale with `--primary` as the single accent. No gradient text, colored status dots, or hardcoded brand colors (`text-destructive` only for genuine errors). `min-h-[100dvh]`/`min-h-[60vh]`, never `h-screen`. Flag drift from the `@theme` tokens in `src/app/globals.css`.

### 10. Observability & operational readiness

- Action/API/bot error handling uses `logger`/`taggerLogger` (`@/lib/logger`) consistently, with graceful user-facing results and sanitized inputs. No swallowed errors or fire-and-forget promises without reason.
- **CI:** `.github/workflows/ci.yml` runs ts:check + lint + Prettier `--check` (`format:check`) + test on push to `main`/`develop` and on every PR. Confirm it still mirrors `bun run check`; flag drift. Note CI is a signal only unless branch protection is configured.
- **Deploy:** `Dockerfile` + standalone `next.config` output (Coolify healthcheck via `/api/health`). Confirm the health route and Docker build stay in sync with runtime env requirements.
- **Resilience:** DB / Stripe / bot calls have error handling and graceful degradation. The Telegram bot (`src/bot/*`) is a separate process — confirm its failure can't take down the web app.
- **E2E / a11y:** any e2e or accessibility tests for critical flows (auth, checkout, credits)? Flag if none.
- **Reports:** the audit writes to `docs/` (committed alongside the code).

## Severity rubric

- `[CRITICAL]` — blocks production: vulnerabilities, missing/incorrect auth, unverified webhooks, credit deduction without refund-on-failure, crashes, data leaks, layer violations exposing data
- `[HIGH]` — serious logic bugs, boundary violations, heavy/unsafe queries, non-atomic credit mutations
- `[MEDIUM]` — suboptimal code, missing edge cases, type holes, absent error handling
- `[LOW]` — technical debt, naming, minor style, design-language drift

## Output

Create `docs/` if needed, then write a **date-stamped** report so prior audits are never overwritten:
`docs/production-readiness-audit-<YYYY-MM-DD>.md` (use today's date — get it from the `currentDate`
context or `date +%F`; e.g. `docs/production-readiness-audit-2026-06-14.md`). If a report with the same
date already exists, append `-2`, `-3`, … rather than overwriting it. Each report is a point-in-time
snapshot — do not read a previous report as a baseline; audit from scratch every run.

The report contains:

1. **Executive Summary** — TL;DR: strengths and top risks.
2. **Architectural Review** — DB-in-actions boundary compliance, RSC boundary, separation of concerns.
3. **Bug Tracker** — table of issues with severity (above), each with `file:line`.
4. **File-by-File Recommendations** — "As is" → "Should be" with corrected snippets.
5. **Testing Gaps** — what's missing for a safe release.
6. **Operational Readiness** — CI, Docker/deploy, observability, resilience, e2e/a11y.
7. **Next Steps** — prioritized roadmap to production-ready.

Be specific — reference file and line, propose concrete fixes.
