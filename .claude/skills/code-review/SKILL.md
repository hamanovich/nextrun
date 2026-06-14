---
name: code-review
description: Use when the user asks to review code, check a PR, inspect changes or a file for issues, or asks "does this look right?", "is this correct?", "can you check this?", "review my changes". Scoped to a diff/PR/branch/file. For a whole-codebase production-readiness sweep, use code-audit instead.
---

# Code Review

## When to use

- **Use this** to review a bounded change: uncommitted diff, staged changes, a PR/branch, or specific files.
- **Don't use this** for a whole-repo sweep — use the `code-audit` skill.
- **Scope discipline:** review the changes **and the code they directly touch**. Don't expand into unrelated files.

## Setup — read first

- `CLAUDE.md` — architecture, data flow (Drizzle/Neon + Better Auth + Stripe credits + grammY bot), business context
- `.claude/rules/code-style.md` — coding standards and the "Never" list

Sources of truth (consult instead of assuming): `src/actions/user.ts` (`getSessionUser`, credit helpers), `src/actions/stripe.ts` (Zod schemas), `src/db/schema.ts`, `src/lib/env.ts`, `src/lib/auth.ts`, `vitest.config.ts`, `package.json`.

## How to run the review

1. **Resolve the target.**
   - No arg → uncommitted work: `git diff` and `git diff --staged`.
   - File/dir → read those files plus their direct callers/callees.
   - PR# / branch → `git diff main...<branch>` (or `gh pr diff <n>`).
2. **Run the mechanical gates first.** Prettier and types are auto-enforced (PostToolUse format hook + Stop typecheck hook). Run `bun run ts:check` and `bun run lint` on the branch and fold real failures into findings — **don't spend review budget on formatting nits the tools already handle.** Focus human attention on logic, architecture, and security.
3. **Grep the diff for the "Never" list:**
   - DB client leaking out of actions/api: `grep -rnE 'from "@/db"' <changed components/hooks>`
   - `any`: `grep -rnE ': any|<any>|as any' <changed files>`
   - `function` decls: `grep -rn 'function ' <changed files>`
   - raw `fetch` mutations: `grep -rn 'fetch(' src/actions src/components`
   - direct `process.env`: `grep -rn 'process.env' <changed files>`
   - hardcoded colors / `h-screen`: `grep -rnE 'bg-(green|blue|red|yellow)-|text-(green|blue|red)-|h-screen' <changed files>`
4. **Delegate deep dimensions** (optional, for larger changes) to the project subagents, in parallel:
   - `security-reviewer` — session gates, credit deduct/refund integrity, Stripe webhook signature, bot trust boundary, secret/PII exposure.
   - `rsc-boundary-reviewer` — DB-in-actions boundary + RSC client/server split + code-style.
     Verify each returned finding against the code before reporting it.
5. **Write the review** in the Feedback Format below.

## Review checklist

### 1. Architecture & layer boundaries (violations = BLOCKER)

One data path, **no service layer**:

- **DB access** (`db` from `@/db`, schema `@/db/schema`) lives in `src/actions/*`, `src/app/api/*`, the Better Auth adapter (`src/lib/auth.ts`), and bot/db wiring (`src/db/*`, `src/bot/*`). Not in components or client hooks.
- Hooks (`src/hooks/*`, e.g. `use-credits.ts`) wrap actions / API routes via TanStack Query. No raw fetch / ad-hoc API routes for mutations.
- `src/app/api/*` is only the Better Auth catch-all (`auth/[...all]`), the Stripe webhook, the `credits` read, and health.

### 2. Auth & access control

- User-scoped actions call `getSessionUser()` (`src/actions/user.ts`) before any logic, and scope Drizzle queries to the authenticated `userId` (`eq(users.id, userId)`) — never to an unvalidated id from input.
- Credit spends are atomic and reversible: `consumeOneCredit` deducts under a `gte(stripeCredits, 1)` guard and checks the returned row; callers `refundOneCredit` on downstream failure.
- The Stripe webhook verifies `STRIPE_WEBHOOK_SECRET` via `constructEvent` and only grants credits on a paid session with trusted `metadata.userId`, before mutating state.
- No hardcoded secrets (all via `src/lib/env.ts`). Bot token / Stripe secret / DB URL never `NEXT_PUBLIC_`.

### 3. Input validation

- Action inputs validated with Zod (inline or co-located) before any data access.
- External inputs (form data, Stripe responses, webhook bodies, bot commands) validated at the boundary — never trust-and-pass-through.
- Forms: RHF + Zod resolver on the client, the **same** schema reused in the action where one exists.

### 4. TypeScript quality

- Avoid `any` — use `unknown` + narrowing. `type` for object shapes. No gratuitous `as`. Optional/nullable DB fields explicitly handled (strict null checks).

### 5. Code style

- Arrow functions only — flag `function` (allow framework exceptions: Next.js page/layout default exports, `generateMetadata`/`generateStaticParams`).
- `camelCase` vars/functions, `PascalCase` components, `[Component]Props` prop types.
- `cn()` from `@/lib/utils` for conditional Tailwind merging — no ad-hoc class concatenation.
- No comments except for non-obvious logic. No utility introduced for a single call site. `src/components/ui/**` (shadcn) is exempt from style nits.

### 6. Next.js App Router (if applicable)

- Server Components by default; `"use client"` only for state/events/browser APIs, kept at the leaves.
- `next/image` for images; absolute `@/...` imports (no `../../`); navigation via `next/link` + `next/navigation` (no i18n layer).
- Pages fetch server-side (actions) and pass `initialData`/`placeholderData` to hooks. Mutations via Server Actions, not new API routes.
- Page metadata lives in a sibling `metadata.ts`; site-wide defaults + JSON-LD in `src/app/layout.tsx`.

### 7. Design language (if UI changed)

- Strict monochrome: only the neutral OKLch scale with `--primary` as the single accent. No gradient text, no colored status dots, no hardcoded brand colors (`text-destructive` only for genuine errors). Use `min-h-[100dvh]`/`min-h-[60vh]`, never `h-screen`. Theme tokens come from `@theme` in `src/app/globals.css` — there is no `tailwind.config`.

### 8. Testing

- New functions with branching logic or external calls (Stripe, DB) need a Vitest test (happy path + missing/malformed input + auth failure).
- Setup lives in `src/test/setup.ts` + `src/test/mocks/`; `server-only` is aliased in `vitest.config.ts`. Tests are **behavior-focused** — assert content/roles/behavior, not exact Tailwind classes.
- Changes in `src/actions/` should add or update unit tests.

### 9. Error handling & observability

- External calls (DB, Stripe) wrapped in try/catch — errors routed through the `logger`/`taggerLogger` (`@/lib/logger`) with a graceful user-facing result. Sanitize user-derived values with `src/lib/sanitize.ts` before logging. No fire-and-forget promises without an explicit reason.

### 10. Performance

- No redundant per-request DB reads; no N+1 across loops. Don't persist large Stripe responses verbatim — extract only needed fields. Reuse existing actions/hooks rather than duplicating queries.

## Feedback format

Severity:

- **[BLOCKER]** — must fix before merge: security, missing/incorrect auth, unverified webhook, credit deduction without refund-on-failure, layer violation exposing data, data-loss risk.
- **[ISSUE]** — should fix: convention violation, missing tests for branching logic, absent error handling, design-language violation.
- **[SUGGESTION]** — optional: readability, minor perf. (Skip pure formatting — tools enforce it.)

For each item: quote `file.ts:42`, explain **why** (cite the rule/principle), give a concrete corrected snippet.

End with a one-line verdict: **Approve**, **Approve with suggestions**, or **Request changes**.
