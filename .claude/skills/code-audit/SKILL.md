---
name: code-audit
description: Use when the user asks to audit the NextWine codebase, check production readiness, find technical debt, do a deep/broad code review, or asks "is the app ready for production?". Triggers on "full audit", "codebase audit", "pre-release check", "production readiness", or any whole-project quality assessment. For a single diff/PR/file, use code-review instead.
---

# Production Readiness Audit

## When to use

- **Use this** for a broad, whole-codebase assessment before a release or milestone.
- **Don't use this** for a single diff, PR, or file — use the `code-review` skill (faster, scoped).

**Role:** You are a Principal Full-Stack Engineer and Software Architect. Conduct a ruthless but objective audit. The goal is a "bird's eye view" — technical debt, architectural violations, hidden bugs. Reference file:line, never praise code for free, never invent issues.

## Setup — read first

- `CLAUDE.md` — architecture, data flow (Sanity + Mongo + OpenAI), App Router conventions, business context
- `.claude/rules/code-style.md` — coding standards and the "Never" list

Source-of-truth files (read instead of trusting numbers in this skill — they drift):

- `vitest.config.mts` — test setup, `server-only` alias, mocks (no coverage thresholds are configured — note that as a gap)
- `package.json` — exact dependency versions and scripts
- `src/lib/env.ts` — the env contract (Zod schema, parsed at startup, throws on missing vars)
- `sanity/schemaTypes/` + `src/models/` — the Sanity content model and the Mongoose schemas

## How to run the audit

1. **Baseline the gates.** Run `bun run check` (= `ts:check && lint && format && test`) and `bun run build`. Capture every failure first — these are free, high-confidence findings. (`format` writes Prettier changes; flag any file it rewrites.)
2. **Map before judging.** Enumerate `src/actions/`, `src/lib/sanity/`, `src/hooks/`, `src/components/`, `src/models/`, `src/app/`, `sanity/`. For broad sweeps, dispatch parallel `Explore` agents per area and keep the conclusions.
3. **Delegate the deep dimensions** to the project subagents (run in parallel):
   - `security-reviewer` — session gates, role checks, AI rate-limit/credit gating, webhook signatures, secret/PII exposure.
   - `rsc-boundary-reviewer` — Sanity-reader / Mongo-in-actions boundary, cache tagging, RSC client/server split, code-style "Never" list.
4. **Grep recipes** for fast, mechanical violations:
   - Raw Sanity client outside readers: `grep -rn 'client.fetch\|@/sanity/lib/client' src/ | grep -v 'src/lib/sanity'`
   - Mongo leaking out of actions: `grep -rnE "from \"@/models" src/components src/hooks`
   - `any` usage: `grep -rnE ': any|<any>|as any' src/`
   - `function` declarations: `grep -rn 'function ' src/ --include='*.ts' --include='*.tsx'`
   - Raw fetch for mutations: `grep -rn 'fetch(' src/actions src/components`
   - `next/navigation` instead of i18n: `grep -rn 'from "next/navigation"' src/`
   - Direct env reads: `grep -rn 'process.env\.' src/ --include='*.ts' --include='*.tsx'`
   - Missing session gates: list every exported action and confirm `getSessionUser()` runs before user-scoped logic.
5. **Synthesize** into the audit artifact (see Output). Verify each subagent finding against the code before reporting it.

## Tech stack (majors; check `package.json` for exact pins)

Next.js 16 (App Router) · React 19 · TypeScript 5 · Tailwind CSS v4 · shadcn/ui + Radix · TanStack Query v5 · **Sanity** CMS (GROQ) + `next-sanity` · **MongoDB + Mongoose** · NextAuth (Google OAuth only) · React Hook Form + Zod v4 · Stripe (credits + webhooks) · Upstash Redis (rate limiting) · OpenAI SDK · next-intl (i18n) · Sentry · Vitest 4 + React Testing Library · `consola` logging.

## Focus areas

### 1. Architecture (data-flow boundary) — violations are CRITICAL

Two read paths, one write path, **no service layer**:

- **Sanity reads** go through `src/lib/sanity/*` → `clientFetch` (cache `tags` + `revalidate`). No raw `client.fetch` in components/pages.
- **Mongo** access lives in `src/actions/*` via Mongoose models (`src/models/*`) after `await connectDB()`. Not in components or hooks.
- `src/hooks/queries/*` — TanStack Query wrappers over actions. No raw fetch, no API routes for mutations.
- `src/app/api/*` is only: NextAuth catch-all, Sanity revalidate webhook, Stripe webhook, health check.

### 2. Auth & security

- Every user-scoped action resolves `getSessionUser()` before logic; data is scoped to the authenticated `userId`, never to an unvalidated id from input. Admin paths check `UserRole.ADMIN`/`SUPERADMIN`.
- `generateAIWines` gates on `checkRateLimit()` (`src/lib/rate-limit.ts`) and Stripe credits, and rolls back the credit on failure.
- Stripe webhook verifies `STRIPE_WEBHOOK_SECRET`; Sanity revalidate verifies `SANITY_REVALIDATE_SECRET` before any state change.
- No hardcoded secrets — all via `src/lib/env.ts`. No user-controlled Mongoose query operators.

### 3. Next.js App Router

- Server Components by default; `"use client"` only for state/events/browser APIs, pushed to the leaves.
- Pages fetch server-side (Sanity readers / actions) and pass `initialData`/`placeholderData` to hooks.
- Mutations via Server Actions only. `next/image` for images, absolute `@/...` imports, navigation via `@/i18n/navigation`.

### 4. Data layer (Sanity + Mongo)

- **Sanity:** every reader passes cache `tags` so the revalidate webhook can invalidate them; GROQ projections fetch only needed fields; generated types in `src/types/sanity.types.ts` stay in sync with `sanity/schemaTypes/`.
- **Mongo:** `connectDB()` is memoized — no per-request connection churn; N+1 patterns across `find` loops; multi-write atomicity where needed; indexes on frequently filtered fields in `src/models/*`.

### 5. Client-side data management

- Correct TanStack Query cache invalidation after mutations; no duplicated load logic between RSC and hooks; optimistic updates where sensible; no needless re-renders in RHF forms.

### 6. Forms & validation

- Zod schemas (co-located, e.g. `src/components/hero-ai/aiFormSchema.ts`, `src/components/search-form/searchFormSchema.ts`) reused on client (RHF resolver) and server (action). No unvalidated action inputs. UI surfaces validation errors.

### 7. TypeScript

- Avoid `any` (use `unknown` + narrowing); `type` for object shapes; no gratuitous `as`; all optional Sanity/Mongo fields explicitly handled.

### 8. Testing & coverage

- Branching logic and external calls (OpenAI, Stripe, Redis, Mongo) are covered. Global setup in `vitest.setup.ts` + `src/__mocks__/setup.ts`; `server-only` is aliased to a mock in `vitest.config.mts`.
- **No coverage thresholds are configured** — flag this and recommend adding `test:coverage` gates. Tests assert behavior, not implementation.

### 9. Observability & i18n

- Action/API error handling uses the Sentry helpers (`src/utils/sentry-actions.ts`, `src/utils/sentry-api.ts`) consistently. `consola`-based `logger` for the rest.
- i18n: only `en` is enabled in `src/i18n/routing.ts`; navigation uses `@/i18n/navigation`. Flag hardcoded user-facing strings that bypass `next-intl` messages.

### 10. Operational readiness (project-wide)

- **CI:** `.github/workflows/ci.yml` runs the check matrix (ts:check + lint + Prettier `--check` + test) plus a stale-Sanity-types guard on push to `main`/`develop` and on every PR. Confirm it still mirrors `bun run check`; note that CI is a signal only (no branch protection on the current plan, Vercel deploys aren't gated by it). Flag drift between CI steps and the local `check` script.
- **Observability:** Sentry is wired (`sentry.*.config.ts`, `instrumentation-client.ts`). Confirm it's actually used in new error paths.
- **Resilience:** OpenAI / Mongo / Stripe / Redis calls have timeouts, retries, and graceful degradation (`/api/health` already probes all four).
- **E2E / a11y:** any Playwright e2e or accessibility tests for critical flows (auth, AI generation, checkout)? Flag if none.
- **Reports:** the audit writes to `docs/` — `docs/` is committed to the repo, so the report is intended to be tracked alongside the code.

## Severity rubric

- `[CRITICAL]` — blocks production: vulnerabilities, missing/incorrect auth, unverified webhooks, AI credit/rate-limit bypass, crashes, data leaks, layer violations exposing data
- `[HIGH]` — serious logic bugs, boundary violations, heavy/unsafe queries, uncached Sanity reads
- `[MEDIUM]` — suboptimal code, missing edge cases, type holes, absent error handling
- `[LOW]` — technical debt, naming, minor style

## Output

Create `docs/` if needed, then write a **date-stamped** report so prior audits are never overwritten:
`docs/production-readiness-audit-<YYYY-MM-DD>.md` (use today's date — get it from the `currentDate`
context or `date +%F`; e.g. `docs/production-readiness-audit-2026-06-02.md`). If a report with the same
date already exists, append `-2`, `-3`, … rather than overwriting it. Each report is a point-in-time
snapshot — do not read a previous report as a baseline; audit from scratch every run.

The report contains:

1. **Executive Summary** — TL;DR: strengths and top risks.
2. **Architectural Review** — Sanity/Mongo boundary compliance, RSC boundary, separation of concerns.
3. **Bug Tracker** — table of issues with severity (above), each with `file:line`.
4. **File-by-File Recommendations** — "As is" → "Should be" with corrected snippets.
5. **Testing Gaps** — what's missing for a safe release.
6. **Operational Readiness** — CI, observability, resilience, e2e/a11y.
7. **Next Steps** — prioritized roadmap to production-ready.

Be specific — reference file and line, propose concrete fixes.
