# NextRun — Hybrid Production Audit Report

**Date:** 2026-03-10
**Auditor:** Principal Software Architect AI Agent
**Scope:** Full-stack Next.js 16.1 + grammY Telegram Bot hybrid codebase
**Status:** Pre-production readiness review

---

## 1. Executive Summary

NextRun is a well-structured hybrid Full-Stack project combining a **Next.js 16.1 (App Router, React 19)** web application with a **grammY v1.40 Telegram bot**, sharing a common database layer (Neon PostgreSQL + Drizzle ORM) and authentication (Better-Auth).

**Critical weaknesses preventing production launch:**

- **No rate limiting** on any API endpoint — health, credits, webhooks all exposed
- **No error monitoring** — Rollbar mentioned in tech stack but not integrated
- **Health endpoint leaks secrets** — exposes API keys via live calls to OpenAI/Stripe
- **Bot has no graceful shutdown** — potential data corruption on restarts

---

## 2. Code Boundaries & Shared Logic

### Boundary Analysis

| Aspect                | Status  | Details                                                                                                                                                                                                                                                               |
| --------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Server Actions in Bot | ⚠️ Risk | `src/actions/user.ts` uses `"use server"` directive + `headers()` from `next/headers`. These **cannot** be called from the bot process (no Next.js request context). Currently bot doesn't call them, but the `"use server"` directive is misleading for shared code. |
| `src/lib/auth.ts`     | ⚠️ Risk | Has `import "server-only"` — the bot cannot import this module. If the bot ever needs auth verification, it has no path to do so.                                                                                                                                     |

### Recommendations

1. **Extract shared business logic** from Server Actions into a separate `src/services/` layer that is framework-agnostic (no `"use server"`, no `headers()`).
2. **Create `src/services/user.service.ts`** with pure DB operations (no Next.js deps), then have Server Actions be thin wrappers.

---

## 3. Bug Tracker

### [CRITICAL]

| #   | Issue                                | Location              | Impact                                                                                                                                                                                                           | Fix Effort |
| --- | ------------------------------------ | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| C3  | **No rate limiting on any endpoint** | Entire `src/app/api/` | `@upstash/ratelimit` is mentioned in tech stack but **not installed** and not used anywhere. All API routes are vulnerable to abuse — especially `/api/webhooks/stripe` (webhook amplification), `/api/credits`. | High       |

### [MEDIUM]

| #   | Issue                                                | Location                                     | Impact                                                                                                                                                                                                                                                     | Fix Effort |
| --- | ---------------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| M2  | **`useWindowScroll` uses `useLayoutEffect` in SSR**  | `src/hooks/use-scroll.ts`                    | Will trigger React SSR warning "useLayoutEffect does nothing on the server". Should use `useEffect` or an `isomorphicLayoutEffect` wrapper.                                                                                                                | Trivial    |
| M6  | **No CSRF protection on form actions**               | `src/components/pricing/pricing-content.tsx` | `<form action={createPaymentAction}>` — Server Actions have built-in CSRF tokens in Next.js, but the `createPaymentAction` doesn't validate origin. Next.js handles this internally, so risk is LOW — but worth double-checking with the `headers()` call. | Low        |
| M7  | **CSP allows `'unsafe-eval'` and `'unsafe-inline'`** | `next.config.ts` L5                          | `script-src 'self' 'unsafe-eval' 'unsafe-inline'` significantly weakens CSP. `unsafe-eval` is likely needed for dev only. Production CSP should use nonce-based script policy if possible.                                                                 | Medium     |

---

## 5. Next Steps — Pre-Production Roadmap

### Phase 1: Critical Fixes (must-do before launch)

- [ ] **Add rate limiting (C3)** — Install `@upstash/ratelimit` and apply to `/api/credits`, `/api/health`, `/api/webhooks/stripe`
- [ ] **Integrate error monitoring (C4)** — Install Rollbar or Sentry; instrument both web (`global-error.tsx`, `error.tsx`) and bot (`bot.catch`)

### Phase 2: High Priority (launch week)

- [ ] **Add webhook idempotency (H2)** — Deduplicate by `event.id` or `session.id`
- [ ] **Validate Server Action inputs (H5)** — Zod schema for `priceId` in `createPaymentAction`

### Phase 3: Quality Improvements (post-launch)

- [ ] **Fix `useLayoutEffect` SSR warning (M2)**
- [ ] **Eliminate duplicate session fetching (M3)**
- [ ] **Tighten CSP (M7)** — Remove `unsafe-eval` in production; consider nonce-based script policy

### Phase 4: Architecture Refinement

- [ ] **Extract `src/services/` layer** — Framework-agnostic business logic that both web Server Actions and bot can share safely
- [ ] **Centralize command definitions for bot (L5)** — Single source of truth for commands
