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

- `CLAUDE.md` — architecture, data flow (Sanity + Mongo + OpenAI), business context
- `.claude/rules/code-style.md` — coding standards and the "Never" list

Sources of truth (consult instead of assuming): co-located Zod schemas (`src/components/**/*Schema.ts`), `src/actions/user.ts` (`getSessionUser`), `src/lib/rate-limit.ts`, `src/lib/env.ts`, `vitest.config.mts`, `package.json`.

## How to run the review

1. **Resolve the target.**
   - No arg → uncommitted work: `git diff` and `git diff --staged`.
   - File/dir → read those files plus their direct callers/callees.
   - PR# / branch → `git diff main...<branch>` (or `gh pr diff <n>`).
2. **Run the mechanical gates first.** Prettier and types are auto-enforced (PostToolUse format hook + Stop typecheck hook). Run `bun run ts:check` and `bun run lint` on the branch and fold real failures into findings — **don't spend review budget on formatting nits the tools already handle.** Focus human attention on logic, architecture, and security.
3. **Grep the diff for the "Never" list:**
   - Raw Sanity client outside readers: `grep -rn 'client.fetch\|@/sanity/lib/client' <changed files>`
   - Mongo models in components/hooks: `grep -rnE 'from "@/models' <changed files>`
   - `any`: `grep -rnE ': any|<any>|as any' <changed files>`
   - `function` decls: `grep -rn 'function ' <changed files>`
   - raw `fetch` mutations: `grep -rn 'fetch(' src/actions src/components`
   - `next/navigation` instead of `@/i18n/navigation`: `grep -rn 'from "next/navigation"' <changed files>`
4. **Delegate deep dimensions** (optional, for larger changes) to the project subagents, in parallel:
   - `security-reviewer` — session gates, role checks, AI rate-limit/credit gating, webhook signatures, secret/PII exposure.
   - `rsc-boundary-reviewer` — Sanity-reader / Mongo-in-actions boundary + RSC client/server split + code-style.
     Verify each returned finding against the code before reporting it.
5. **Write the review** in the Feedback Format below.

## Review checklist

### 1. Architecture & layer boundaries (violations = BLOCKER)

Two read paths, one write path, **no service layer**:

- **Sanity reads** go through `src/lib/sanity/*` → `clientFetch` with cache `tags` + `revalidate`. No raw `client.fetch` in components/pages.
- **Mongo** access lives in `src/actions/*` via Mongoose models (`src/models/*`) after `await connectDB()`. Not in components/hooks.
- Hooks (`src/hooks/queries/*`) wrap actions via TanStack Query. No raw fetch / API routes for mutations.
- `src/app/api/*` is only NextAuth, the Sanity/Stripe webhooks, and health.

### 2. Auth & access control

- User-scoped actions call `getSessionUser()` (`src/actions/user.ts`) before any logic, and scope Mongo queries to the authenticated `userId` — never to an unvalidated id from input. Admin paths check `UserRole.ADMIN`/`SUPERADMIN`.
- AI generation gates on `checkRateLimit()` + Stripe credits and rolls the credit back on failure.
- Webhooks verify their secret (`STRIPE_WEBHOOK_SECRET`, `SANITY_REVALIDATE_SECRET`) before mutating state.
- No hardcoded secrets (all via `src/lib/env.ts`). No user-controlled Mongoose query operators; `ObjectId.isValid()` before `findById`.

### 3. Input validation

- Action inputs validated with Zod (co-located schema or inline) before any data access.
- External inputs (form data, OpenAI/Stripe responses, webhook bodies) validated at the boundary — never trust-and-pass-through.
- Forms: RHF + Zod resolver on the client, the **same** schema reused in the action.

### 4. TypeScript quality

- Avoid `any` — use `unknown` + narrowing. `type` for object shapes. No gratuitous `as`. Optional Sanity/Mongo fields explicitly handled (strict null checks).

### 5. Code style

- Arrow functions only — flag `function` (allow framework-required exceptions like `generateMetadata`/`generateStaticParams`).
- `camelCase` vars/functions, `PascalCase` components, `[Component]Props` prop types.
- `cn()` from `@/utils/tailwind.utils` for conditional Tailwind merging — no ad-hoc class concatenation.
- No comments except for non-obvious logic. No utility introduced for a single call site. `src/components/ui/**` (shadcn) is exempt from style nits.

### 6. Next.js App Router (if applicable)

- Server Components by default; `"use client"` only for state/events/browser APIs, kept at the leaves.
- `next/image` for images; absolute `@/...` imports (no `../../`); navigation via `@/i18n/navigation`.
- Pages fetch server-side (Sanity readers / actions) and pass `initialData`/`placeholderData` to hooks. Mutations via Server Actions, not API routes.

### 7. Sanity & caching (if applicable)

- New/changed readers in `src/lib/sanity/*` pass cache `tags` (and a sensible `revalidate`) so `src/app/api/revalidate/route.ts` can invalidate them.
- GROQ projections fetch only needed fields. If a schema type changed in `sanity/schemaTypes/`, generated types in `src/types/sanity.types.ts` should be regenerated.

### 8. Testing

- New functions with branching logic or external calls (OpenAI, Stripe, Redis, Mongo) need a Vitest test (happy path + missing/malformed input + auth failure).
- Mocks/setup live in `vitest.setup.ts` + `src/__mocks__/`; `server-only` is aliased in `vitest.config.mts`.
- Changes in `src/actions/` should add or update unit tests.

### 9. Error handling & observability

- External calls (Mongo, OpenAI, Stripe, Redis) wrapped in try/catch — errors routed through the Sentry helpers (`src/utils/sentry-actions.ts` / `sentry-api.ts`) and `consola` logger, with a graceful user-facing result. No fire-and-forget promises without an explicit reason.

### 10. Performance

- No redundant Mongo reads per request; no N+1 across `find` loops; reuse the memoized `connectDB()`. Don't persist large OpenAI/Stripe responses verbatim — extract only needed fields. Uncached Sanity reads on hot paths are a smell.

## Feedback format

Severity:

- **[BLOCKER]** — must fix before merge: security, missing/incorrect auth, unverified webhook, AI credit/rate-limit bypass, layer violation exposing data, data-loss risk.
- **[ISSUE]** — should fix: convention violation, missing tests for branching logic, absent error handling, uncached Sanity read.
- **[SUGGESTION]** — optional: readability, minor perf. (Skip pure formatting — tools enforce it.)

For each item: quote `file.ts:42`, explain **why** (cite the rule/principle), give a concrete corrected snippet.

End with a one-line verdict: **Approve**, **Approve with suggestions**, or **Request changes**.
