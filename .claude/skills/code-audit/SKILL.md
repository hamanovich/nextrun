---
name: code-audit
description: Conducts a brutal, thorough audit of the NextRun codebase covering the Drizzle/Neon data-flow boundary, RSC client/server split, file discipline, complexity, auth & Stripe credit/webhook gating, the grammY bot trust boundary, env contract, TypeScript correctness, forms & validation, TanStack Query cache discipline, test discipline, observability, design-language drift, docs SSoT same-change, and forbidden artifacts. Use when preparing for a production release, after major feature work, or when the user asks for a code audit, production readiness check, or deep codebase review. For a single diff/PR/file use the code-review skill instead.
---

# Code Audit

## Mindset

Don't praise the codebase. Hunt for rot, bloat, boundary violations, and hidden coupling. Every file must justify its existence and its size. If something smells — it's a bug.

**Size vs Cohesion rule:** Raw LOC is NOT a metric by itself. A long cohesive module (a Drizzle action file, a Zod schema set, a Stripe webhook handler) with a single bounded context is fine — if every export serves the same responsibility and the file reads sequentially. What IS a finding: a file that mixes unrelated concerns (DB query + JSX + client hook), a Server Action that inlines business logic that belongs in a helper, or a `utils/` file that became a dumping ground for unrelated helpers.

**Directory analogue:** A directory with 10+ files is NOT a finding if it is a bounded context split into purposeful sub-folders (e.g. `src/components/<feature>/`, `src/app/<route>/`). What IS a finding: a flat dumping-ground directory of 10+ unrelated files with no sub-structure.

**Component analogue:** A long component is NOT a finding by itself. A 150-LOC Server Component that reads top-to-bottom as one cohesive page (fetch → derive → render) is fine. LOC is a _trigger for hand-review_, not an automatic finding. What IS a finding inside a long component: a `"use client"` boundary pushed too high, mixed concerns, nesting >3, cyclomatic >6, repeated JSX that should extract, or boolean-blind props. Ritualistic splitting "to satisfy the cap" is worse than the original — do not file findings that would force it.

**No-praise rule:** The output is a defect tracker, not a report card. Do not include sentences like "the architecture is solid", "tests are comprehensive", or "code is well-organized". Either a finding is recorded or it is not — neutral state needs no commentary.

---

## Section 0 — Audit Boundaries

`code-audit` covers **structural code quality**. It does NOT cover:

| Concern                                                                                  | Use this instead                                       |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| A single diff / PR / file review                                                         | `code-review` skill (faster, scoped)                   |
| Exploitability (auth-bypass chains, Stripe webhook forgery, bot command injection, SSRF) | `security-reviewer` agent                              |
| Runtime cost, N+1 under real load, bundle size, render perf                              | `performance` analysis / `rsc-boundary-reviewer` agent |

`code-audit` MAY flag a security-shaped defect at structural severity (e.g., `process.env.X` outside `src/lib/env.ts`, a Server Action with no `getSessionUser()` gate, an unverified webhook, a credit consumed without refund-on-failure) but stops short of exploit chains — those go to the `security-reviewer` agent.

---

## Before You Start

Read these files to ground the audit in current project state:

1. `CLAUDE.md` — architecture, data flow (Drizzle/Neon + Better Auth + Stripe credits + grammY bot), App Router conventions, business context
2. `.claude/rules/code-style.md` — coding standards and the "Never" list

Source-of-truth files (read instead of trusting numbers in this skill — they drift):

3. `vitest.config.mts` — test setup, `server-only` alias, mocks, coverage thresholds
4. `package.json` — exact dependency pins and scripts (incl. the intentional `kysely@0.28.17` and `vite` pins documented in CLAUDE.md — do not flag those as outdated)
5. `src/lib/env.ts` — the env contract (Zod schema, parsed at startup, throws on missing vars)
6. `src/db/schema.ts` — the Drizzle table definitions (users, sessions, accounts, verifications, credits)
7. `src/actions/user.ts` — `getSessionUser`, `consumeOneCredit`, `refundOneCredit`, `updateUserStripeData`
8. `src/lib/auth.ts` / `src/lib/auth-client.ts` — Better Auth server config + client

**Precedence when artifacts disagree:** shipped code is the source of truth. If `CLAUDE.md` describes a layer but `src/` has none, the finding is "doc drift in CLAUDE.md", NOT "missing layer in code". Same rule for all rules files and SSoT docs — code wins, docs catch up.

---

## Audit Workflow

### Step 1 — Explore & Measure

Walk the focus clusters below to build a baseline mental map of THIS codebase — what's normal here, what files dominate, where the boundaries actually sit. **This is context, not a substitute for Step 2c:** Step 1 builds the intuition that lets you read Step 2c hits correctly (a `wc -l` spike on a cohesive action file is OK; the same spike on a component is a defect). Skipping Step 1 means Step 2c findings get filed without that judgment.

If an `Agent`/subagent tool is available, dispatch one per cluster in parallel (one message, multiple Agent calls). Otherwise walk them sequentially. Suggested split:

- **Explore-A:** file/LOC map of `src/`, top-30 largest files, directory cardinality, barrel `index.ts` audit, `src/app/` route-tree shape.
- **Explore-B:** import graph — components/hooks reaching into `@/db`, raw DB client calls outside actions/api/auth/bot, deep `../../..` chains, alias `@/` discipline.
- **Explore-C:** `"use client"` map — which components are client, how high the boundary sits, whether state/event-only leaves are correctly isolated.
- **Explore-D:** test layout — `src/test/setup.ts` + `src/test/mocks/` coverage of Stripe/DB/auth/bot, `.skip`/`.only` count, `server-only` alias correctness, coverage thresholds.

You may also delegate the deep dimensions to the project subagents (run in parallel):

- `security-reviewer` — session gates, credit deduct/refund integrity, Stripe webhook signature, bot trust boundary, secret/PII exposure.
- `rsc-boundary-reviewer` — DB-in-actions boundary, RSC client/server split, code-style "Never" list.

Verify each subagent finding against the code before reporting it.

### Step 2 — Full check

```bash
bun run check
```

`check` = `ts:check && lint && format:check && test`. **Any failure ⇒ automatic CRITICAL #1 finding.** Record the failing tail in Section 2 and stop until it exits 0. `format:check` is read-only; if it reports unformatted files, flag each (committed code should already be formatted — run `bun run format` to confirm what it would rewrite). If the user explicitly asks to proceed anyway, see Exit Criteria #2 — the verdict is forcibly pinned to 🔴 BLOCKED.

```bash
bun run build
```

A failing `next build` is also CRITICAL — record the failing tail. Common causes worth attributing precisely: missing env var (`src/lib/env.ts` throws at startup), `server-only` import pulled into a client bundle, or a type error that `ts:check` somehow missed.

### Step 2b — Dead-code / dependency scan

```bash
bunx --bun knip   # no knip config is committed; absence of a knip gate is itself a MEDIUM tooling gap — note it
```

If run, treat it as the authoritative source for dead files and unused exports/deps. Severity mapping is **deterministic**:

| knip output                                              | Severity |
| -------------------------------------------------------- | -------- |
| Unused files                                             | HIGH     |
| Phantom dependencies (declared elsewhere, imported here) | HIGH     |
| Unused dependencies in `package.json`                    | MEDIUM   |
| Unused exports                                           | MEDIUM   |
| Unused exported types                                    | LOW      |

### Step 2c — Static signal grep

Run each command and record every hit. Each maps to a deterministic finding type and severity (see Severity Rubric).

```bash
# 1. LOC distribution (manual review only — not a finding by itself)
find src -name '*.ts' -o -name '*.tsx' | grep -v '__tests__\|/test/\|.test.' | xargs wc -l | sort -rn | head -30
find src -name '*.ts' -o -name '*.tsx' | grep -v '__tests__\|/test/\|.test.' | xargs wc -l | awk '$1>400 {print}' | sort -rn

# 2. DB client leaking out of actions/api/auth/db/bot  (HIGH each — data-flow boundary)
grep -rnE "from ['\"]@/db" src/components src/hooks --include='*.ts' --include='*.tsx'

# 3. Raw fetch for mutations (should be Server Actions)  (HIGH each)
grep -rn "fetch(" src/actions src/components src/hooks --include='*.ts' --include='*.tsx' | grep -v '/api/health\|test'

# 4. Direct env reads outside the contract  (HIGH each — env contract violation; NODE_ENV in logger.ts is the documented exception)
grep -rn "process\.env\." src/ --include='*.ts' --include='*.tsx' | grep -v 'src/lib/env.ts'

# 5. `any` type leaks  (MEDIUM each)
grep -rnE ": any(\b|\[|;|,|\))|<any>|as any" src/ --include='*.ts' --include='*.tsx' | grep -v 'test'

# 6. Inline `function` keyword in production code  (MEDIUM each — arrow-only style; allow page/layout default exports + generateMetadata/generateStaticParams/generateViewport)
grep -rnE "^[[:space:]]*function |^export function " src/ --include='*.ts' --include='*.tsx' \
  | grep -v 'test' | grep -vE "generateMetadata|generateStaticParams|generateViewport"

# 7. ts-ignore / ts-expect-error  (MEDIUM — must have adjacent justification comment)
grep -rnE "@ts-(ignore|expect-error|nocheck)" src/ --include='*.ts' --include='*.tsx'

# 8. .skip / .only / xit / xdescribe in tests  (MEDIUM each)
grep -rnE "\.(skip|only)\(|^[[:space:]]*xit\(|^[[:space:]]*xdescribe\(" src/ --include='*.test.ts' --include='*.test.tsx'

# 9. Hardcoded brand colors / h-screen — design-language drift  (LOW each — see Focus Area I)
grep -rnE "bg-(green|blue|red|yellow|orange|purple|pink)-[0-9]|text-(green|blue|red|yellow|orange|purple|pink)-[0-9]|h-screen" src/ --include='*.tsx' | grep -v 'src/components/ui/'

# 10. Deep relative imports  (MEDIUM each)
grep -rnE "from ['\"]\.\./\.\./\.\." src/ --include='*.ts' --include='*.tsx' | grep -v 'test'

# 11. Circular imports  (HIGH each)
bunx --bun madge --circular --extensions ts,tsx src/ 2>/dev/null || true

# 12. Webhook secret verification present  (CRITICAL if a webhook handler lacks it — LOCATOR; hand-confirm)
grep -rn "STRIPE_WEBHOOK_SECRET\|constructEvent" src/app/api --include='*.ts'

# 13. Session gate present in actions  (CRITICAL if a user-scoped action lacks it — LOCATOR; hand-confirm in Step 2d)
grep -rn "getSessionUser" src/actions --include='*.ts'
grep -rLn "getSessionUser" src/actions --include='*.ts'   # actions with NO session call — review each

# 14. Credit consume/refund pairing  (CRITICAL if a credit is consumed without a refund-on-failure path — LOCATOR; hand-confirm)
grep -rn "consumeOneCredit\|refundOneCredit\|stripeCredits" src/ --include='*.ts' --include='*.tsx'

# 15. TODO/FIXME/XXX/HACK without issue link  (LOW each)
grep -rnE "TODO|FIXME|XXX|HACK" src/ --include='*.ts' --include='*.tsx' | grep -v 'test'

# 16. Forbidden refs in permanent artifacts (HIGH each — see Section L)
#     Exempt: docs/planning/, docs/*-audit-*.md (output of other audit runs).
grep -rEn "\bF-[0-9]{3}\b|\bP-[0-9]+\.[0-9]+\b|plan_[a-z0-9_]+\.md" src/ docs/ --include='*.ts' --include='*.tsx' --include='*.md' \
  | grep -v 'docs/planning/' | grep -vE 'docs/.*-audit-' || true

# 17. bun discipline — npm/npx/yarn/pnpm in scripts or docs
grep -rnE "\b(npm|npx|yarn|pnpm) " package.json docs/ .claude/ --include='*.json' --include='*.md' | grep -v 'bunx' || true

# 18. Secret/PUBLIC leak — server secrets must never be NEXT_PUBLIC_  (CRITICAL if a server secret is exposed)
grep -rnE "NEXT_PUBLIC_.*(SECRET|TOKEN|KEY|PASSWORD|DATABASE_URL)" src/ .env.example --include='*.ts' --include='*.tsx' || true

# 19. Docs SSoT same-change drift — see Section K for window choice and noise filtering.
#     Set $AUDIT_WINDOW to the previous audit date (from latest docs/*-audit-*.md) or '7 days ago'.
git log --since="$AUDIT_WINDOW" --pretty=format:'%h %s' --shortstat -- src/db/schema.ts
```

### Step 2d — Hand-review hints (explicitly non-deterministic)

These cannot be reduced to a clean grep, so they live OUTSIDE the Step 2c deterministic contract. Sample the top-10 largest production files from Step 2c #1 and the locator hits from #12/#13/#14, and confirm by reading. A finding here still needs all five Evidence fields.

| Hint                                              | What to look for                                                                                                                                                                                                                                                                 | Severity if confirmed |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| Session gate (paired with grep #13)               | For each action with no `getSessionUser()`: is it genuinely public (e.g. `listPricingProducts`), or does it touch user-scoped data using an id from input rather than the authenticated session? Unscoped user data = finding.                                                   | CRITICAL              |
| Webhook verification (paired with #12)            | Does `src/app/api/webhooks/stripe/route.ts` verify `STRIPE_WEBHOOK_SECRET` via `constructEvent` before any state change, and grant credits only on a paid session with trusted `metadata.userId`? Unverified mutation = finding.                                                 | CRITICAL              |
| Credit consume/refund integrity (paired with #14) | Does `consumeOneCredit` deduct under a `gte(stripeCredits, 1)` guard and check the returned row? Does every caller `refundOneCredit` on downstream failure? Does `updateUserStripeData` clamp negative balances? Missing guard, missing refund, or unclamped negative = finding. | CRITICAL              |
| Bot trust boundary                                | Does the grammY bot (`src/bot/*`) validate command input, scope DB access to the resolved Telegram user, and fail without taking down the web app? Unvalidated bot input → DB = finding.                                                                                         | HIGH                  |
| Inline production comments                        | `// WHAT this does` comments duplicating the identifier. Exceptions (NOT findings): JSDoc on public exports; comments citing `docs/`, a rule file, an issue/PR/commit ID, or the source of a magic number. Pure intuition WHY without citation is still a finding.               | LOW                   |

### Step 3 — Systematic deep dive

Work through EVERY focus area (A–M). For each finding record: **file:line range, severity (from Rubric), evidence (quoted snippet), why it's wrong, corrected snippet or refactor directive.**

**A finding without an evidence snippet is invalid and must be dropped from the report.**

---

## Focus Area Checklist

Severity column is **mandatory** — copy from the Severity Rubric below, do not invent.

### A. Architecture — Data-Flow Boundary (violations are CRITICAL/HIGH)

One data path, **no service layer**.

| #   | Check                                                                                                                                                                                                                      | Severity if violated |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| A1  | DB access (`db` from `@/db`, schema `@/db/schema`) lives only in `src/actions/*`, `src/app/api/*`, the Better Auth adapter (`src/lib/auth.ts`), and bot/db wiring (`src/db/*`, `src/bot/*`) — never in components or hooks | HIGH                 |
| A2  | `src/hooks/*` are TanStack Query wrappers over actions / API routes (e.g. `use-credits.ts`) — no raw fetch, no API route for a mutation                                                                                    | HIGH                 |
| A3  | `src/app/api/*` is ONLY: Better Auth catch-all (`auth/[...all]`), Stripe webhook (`webhooks/stripe`), `credits` read, health check                                                                                         | HIGH                 |
| A4  | A layer violation leaking one user's data into another's path                                                                                                                                                              | CRITICAL             |
| A5  | Single Responsibility per file (no DB query + JSX + client-hook mix)                                                                                                                                                       | MEDIUM               |
| A6  | God file (mixed concerns + >8 unrelated imports + >5 unrelated exports)                                                                                                                                                    | MEDIUM               |
| A7  | Directory coherence — bounded sub-folders, not a flat dumping ground                                                                                                                                                       | MEDIUM               |
| A8  | Barrel `index.ts` is thin re-exports only                                                                                                                                                                                  | MEDIUM               |
| A9  | Dead files (knip output)                                                                                                                                                                                                   | HIGH                 |

### B. Auth & Security

| #   | Check                                                                                                                       | Severity if violated |
| --- | --------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| B1  | Every user-scoped action resolves `getSessionUser()` before logic                                                           | CRITICAL             |
| B2  | Data scoped to the authenticated `userId` (`eq(users.id, userId)`), never to an unvalidated id from input                   | CRITICAL             |
| B3  | `consumeOneCredit` deducts under a `gte(stripeCredits, 1)` guard and checks the returned row                                | CRITICAL             |
| B4  | Every credit consumer calls `refundOneCredit` on downstream failure                                                         | CRITICAL             |
| B5  | `updateUserStripeData` clamps negative balances                                                                             | HIGH                 |
| B6  | Stripe webhook verifies `STRIPE_WEBHOOK_SECRET` via `constructEvent` before state change, and trusts only `metadata.userId` | CRITICAL             |
| B7  | No hardcoded secrets/tokens/keys — all via `src/lib/env.ts`                                                                 | CRITICAL             |
| B8  | Bot token / Stripe secret / DB URL never `NEXT_PUBLIC_`                                                                     | CRITICAL             |
| B9  | grammY bot validates command input and scopes DB access to the resolved Telegram user                                       | HIGH                 |
| B10 | User-derived values sanitized via `src/lib/sanitize.ts` before logging                                                      | MEDIUM               |
| B11 | `src/proxy.ts` middleware guards `/profile`; actions still gate the session themselves                                      | HIGH                 |

### C. Next.js App Router & RSC Boundary

| #   | Check                                                                                                             | Severity if violated |
| --- | ----------------------------------------------------------------------------------------------------------------- | -------------------- |
| C1  | Server Components by default; `"use client"` only for state/events/browser APIs                                   | MEDIUM               |
| C2  | `"use client"` pushed to the leaves, not parked high in the tree                                                  | MEDIUM               |
| C3  | Pages fetch server-side (actions) and pass `initialData`/`placeholderData` to hooks                               | HIGH                 |
| C4  | Mutations via Server Actions only (no client `fetch` to an API route)                                             | HIGH                 |
| C5  | `server-only` imported in modules that must never reach the client bundle                                         | HIGH                 |
| C6  | `next/image` for images; absolute `@/...` imports; navigation via `next/link` + `next/navigation` (no i18n layer) | LOW                  |
| C7  | Page metadata in a sibling `metadata.ts`; site-wide defaults + JSON-LD `@graph` in `src/app/layout.tsx`           | LOW                  |

### D. Data Layer — Drizzle / Neon

| #   | Check                                                                                                    | Severity if violated |
| --- | -------------------------------------------------------------------------------------------------------- | -------------------- |
| D1  | Queries live in actions; no per-request connection churn (use the shared `db` from `@/db`)               | HIGH                 |
| D2  | No N+1 across `find`/`select` loops in a hot path                                                        | HIGH                 |
| D3  | Multi-write paths use atomicity where needed (a transaction or a single guarded `update ... returning`)  | HIGH                 |
| D4  | Indexes on frequently filtered columns in `src/db/schema.ts` (e.g. `stripeCustomerId`)                   | MEDIUM               |
| D5  | No raw user input in a query without validation                                                          | CRITICAL             |
| D6  | No over-fetch where a column projection fits                                                             | MEDIUM               |
| D7  | Schema changes go through `bun run db:push`; `src/db/index.bot.ts` and `src/db/index.ts` stay consistent | MEDIUM               |

### E. Client Data Management (TanStack Query)

| #   | Check                                                             | Severity if violated |
| --- | ----------------------------------------------------------------- | -------------------- |
| E1  | Correct cache invalidation after every mutation                   | HIGH                 |
| E2  | No duplicated load logic between RSC `initialData` and the hook   | MEDIUM               |
| E3  | Optimistic updates where sensible, with rollback on error         | MEDIUM               |
| E4  | No needless re-renders in RHF forms (uncontrolled where possible) | LOW                  |

### F. Forms & Validation

| #   | Check                                                                           | Severity if violated |
| --- | ------------------------------------------------------------------------------- | -------------------- |
| F1  | Zod schema reused on client (RHF resolver) AND server (action) where applicable | HIGH                 |
| F2  | No unvalidated action inputs (ids, price ids, amounts)                          | CRITICAL             |
| F3  | UI surfaces validation errors (no silent reject)                                | MEDIUM               |

### G. TypeScript Correctness

| #   | Check                                                                                          | Severity if violated |
| --- | ---------------------------------------------------------------------------------------------- | -------------------- |
| G1  | Zero `any` (use `unknown` + narrowing)                                                         | MEDIUM               |
| G2  | No `as SomeType` at a trust boundary (form input / webhook / Stripe response / DB / bot input) | HIGH                 |
| G3  | All optional/nullable Drizzle fields explicitly handled                                        | HIGH                 |
| G4  | `type` for object shapes per code-style; no gratuitous `as`                                    | LOW                  |
| G5  | `@ts-ignore` / `@ts-expect-error` only with adjacent justification comment                     | MEDIUM               |
| G6  | Public action functions with complex returns have explicit return types                        | MEDIUM               |

### H. Constants & Configuration

| #   | Check                                                                                     | Severity if violated |
| --- | ----------------------------------------------------------------------------------------- | -------------------- |
| H1  | Shared thresholds (credit grants ↔ pricing ↔ product config) defined once, not duplicated | HIGH                 |
| H2  | No magic numbers/strings inline where a named constant belongs                            | MEDIUM               |
| H3  | No orphan constants (defined, never imported)                                             | LOW                  |

### I. Design Language

| #   | Check                                                                                                                    | Severity if violated |
| --- | ------------------------------------------------------------------------------------------------------------------------ | -------------------- |
| I1  | Strict monochrome — only the neutral OKLch scale with `--primary` as the single accent                                   | LOW                  |
| I2  | No gradient text, colored status dots, or hardcoded brand colors (`text-destructive` only for genuine errors)            | LOW                  |
| I3  | `min-h-[100dvh]`/`min-h-[60vh]`, never `h-screen`                                                                        | LOW                  |
| I4  | Classes merged with `cn()` from `@/lib/utils`; tokens come from `@theme` in `src/app/globals.css` (no `tailwind.config`) | LOW                  |

### J. Testing & Coverage

| #   | Check                                                                                                                      | Severity if violated |
| --- | -------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| J1  | Branching logic and external calls (Stripe, DB, auth, bot) are covered                                                     | HIGH                 |
| J2  | Global setup in `src/test/setup.ts` + `src/test/mocks/`; `server-only` aliased in `vitest.config.ts`                       | HIGH                 |
| J3  | Coverage thresholds present in `vitest.config.mts` (currently 50%); flag if removed or unmet                                | MEDIUM               |
| J4  | Tests assert behavior (content/roles/behavior), not exact Tailwind classes (`src/components/ui/**` excluded from coverage) | MEDIUM               |
| J5  | No `.skip` / `.only` / `xit` / `xdescribe` left in committed code                                                          | MEDIUM               |
| J6  | Every behavioral bugfix has a regression test                                                                              | HIGH                 |

### K. Docs SSoT Same-Change Discipline

| #   | Check                                                                                                                                   | Severity |
| --- | --------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| K1  | User-facing feature change (credit flow, bot command, pricing/tier, auth surface, setting) with no diff in `CLAUDE.md` business context | MEDIUM   |
| K2  | Stripe-flow change with no diff in `docs/STRIPE_INTEGRATION.md`                                                                         | MEDIUM   |

**Method:**

1. **Window:** since the previous audit (read date from latest `docs/*-audit-*.md` filename); fallback 7 days if no prior audit. Avoid a 30-day default — it produces unmanageable noise.
2. **Query:** `git log --since="$AUDIT_WINDOW" --pretty=format:'%h %s' --shortstat -- <path> <doc>` (same `$AUDIT_WINDOW` as Step 2c #19).
3. **Noise filter — skip non-behavioural commits:** pure rename/move, formatting, dead-code removal, test-only commits, typo/comment fixes (shortstat ≤3 LOC, no new exports).
4. **Finding trigger:** a behavioural commit (new schema column, new credit/price path, new public export, contract change) on the code path with no corresponding doc diff in the same commit.
5. **Cap output:** if a row has >20 candidate commits, sample latest 10 + largest 5 by shortstat and note "sampled".

### L. Forbidden Patterns in Permanent Artifacts

Ticket-shaped IDs and plan refs dangle when plans get deleted. Forbidden in `src/**` and `docs/**` SSoT.

**Exempt artefacts** (do NOT file findings against these): `docs/planning/**` (plan artefacts carry their own IDs); `docs/*-audit-*.md` (output of other audit runs, which legitimately register their own finding IDs).

**NEW vs OLD violation — severity context (deterministic):**

- **NEW** = the offending line was added or last touched within this audit's window (since previous `docs/*-audit-*.md` or 7-day fallback). Severity from the table applies as-is.
- **OLD** = the line pre-dates the window. Downgrade by one tier (HIGH → MEDIUM) and tag `[pre-existing, opportunistic cleanup]`.
- **Determine** with `git blame <file>` on the offending line; if the blame commit is outside the window, it is OLD.

| #   | Check                                                                                                                       | Severity |
| --- | --------------------------------------------------------------------------------------------------------------------------- | -------- |
| L1  | `F-NNN` / `P-N.N` / `plan_*.md` references in code or SSoT docs                                                             | HIGH     |
| L2  | Inline production comments duplicating the code ("the what") — full rule and exceptions in Step 2d (SSoT); do not copy here | LOW      |

### M. Operational Readiness

| #   | Check                                                                                                                                                               | Severity if violated |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| M1  | CI (`.github/workflows/ci.yml`) mirrors `bun run check` (ts:check + lint + Prettier `format:check` + test) on push to `main`/`develop` and on every PR — flag drift | MEDIUM               |
| M2  | Action/API/bot error handling uses `logger`/`taggerLogger` (`@/lib/logger`) consistently, with sanitized inputs and graceful user-facing results                    | HIGH                 |
| M3  | DB / Stripe / bot calls have error handling and graceful degradation; no swallowed errors or unexplained fire-and-forget promises                                   | HIGH                 |
| M4  | The Telegram bot (`src/bot/*`) is a separate process — its failure can't take down the web app                                                                      | HIGH                 |
| M5  | `/api/health` reflects runtime env requirements; `Dockerfile` + standalone `next.config` output stay in sync (Coolify healthcheck)                                  | MEDIUM               |
| M6  | Any Playwright e2e or a11y test for critical flows (auth, checkout, credits) — flag if none                                                                         | MEDIUM               |

> **CI caveat:** CI is a signal only — confirm whether branch protection gates merges and whether deploys (Coolify) are gated by it. Record drift between CI steps and the local `check` script, but do not treat green CI as a deploy gate unless protection is configured.

---

## Severity Rubric (deterministic)

When recording a finding, copy the severity from the corresponding focus-area table. Do NOT invent. If a defect fits no row, default to the closest analogue and note the deviation in the finding body.

| Severity     | Definition                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **CRITICAL** | Build/process crash, data loss, security hole, missing/incorrect auth gate, unverified webhook, credit consumed without refund-on-failure, layer violation exposing one user's data, raw user input in a DB query, hardcoded secret, server secret exposed via `NEXT_PUBLIC_`, `bun run check` / `bun run build` failure.                                                                                              |
| **HIGH**     | Data-flow boundary violation (DB client in a component, mutation via API route, raw fetch mutation), N+1 in hot path, unclamped negative credit balance, circular import, `as` at a trust boundary, unhandled optional Drizzle field, missing logger on an error path, unvalidated bot input → DB, schema/docs SSoT drift on a behavioural change, forbidden `F-NNN`/`plan_*.md` ref, knip unused-file or phantom-dep. |
| **MEDIUM**   | God file, `"use client"` parked too high, `any` type, `@ts-ignore` without justification, duplicated constant, DB over-fetch, missing/unmet coverage threshold, `.skip` in committed code, deep relative import, CI/check drift, missing knip gate.                                                                                                                                                                    |
| **LOW**      | Dead import, naming inconsistency, orphan constant, `TODO`/`FIXME` without issue link, inline production comment (L2 — see Step 2d for exceptions), missing `next/image`, design-language drift (monochrome / `h-screen`), raw `console` log.                                                                                                                                                                          |

**knip findings:** severity is authoritative in the Step 2b table — do NOT re-derive from this Rubric.

**Trust-boundary escape valves (deterministic downgrade):** apply with the matching reason cited inline in the finding's Why field.

| Rule                       | Default  | Downgrade to | Trigger condition                                                                                                                                                                    |
| -------------------------- | -------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Circular import (grep #11) | HIGH     | LOW          | Cycle is fully `import type` on both sides, OR runtime import on one side + `import type` on the reverse. madge over-reports type-only cycles — verify by reading both import lines. |
| G2 (`as SomeType`)         | HIGH     | MEDIUM       | Cast is at an internal seam between two project modules sharing a schema, NOT at a trust boundary (HTTP / webhook / DB / bot / user-input edge).                                     |
| B2 (unvalidated id)        | CRITICAL | —            | **No downgrade.** Always CRITICAL. Listed so the absence of an escape valve is explicit.                                                                                             |

**Rules:** (1) match a downgrade row → file at downgraded severity, cite the row in Why; (2) no match → file at the focus-area default; (3) escape valves are bounded — if a fourth case appears, file at default and surface it under Refactoring Recommendations as a candidate new row.

---

## Evidence Required Per Finding

Every Bug Tracker row MUST contain:

1. **File:line range** (e.g. `src/actions/stripe.ts:52-68`)
2. **Quoted code snippet** (3–10 lines, exact text from current branch)
3. **Severity** (from Rubric, not invented)
4. **Why it's wrong** (one sentence — the rule it violates, the failure mode it causes)
5. **Fix** (corrected snippet or one-line refactor directive — not a vague "consider extracting")

**A finding without all five fields is invalid and MUST be dropped.** This is the single most important rule — speculative findings dilute trust and waste reviewer time.

---

## Exit Criteria

The audit is DONE when ALL hold:

1. Every focus area A–M has been walked top-to-bottom (go by the table of contents, not a count — sub-rows grow).
2. `bun run check` exits 0. If the user asks to proceed with a failing check, the audit MAY continue but the verdict is pinned to 🔴 BLOCKED, and Section 1 must include: _"Audit ran with failing `bun run check` at user request — verdict pinned to BLOCKED until check passes."_
3. `bun run build` result recorded.
4. `bunx --bun knip` output recorded with deterministic severity from Step 2b (or its absence noted as a MEDIUM tooling gap).
5. Every Step 2c grep executed — either zero hits or findings with evidence.
6. Step 2d hand-review record written (proof-of-execution — see Output §3).
7. Every recorded finding has all five required fields.
8. Verdict (🟢/🟡/🔴) written and justified.

---

## Output

Create `docs/` if needed, then write a **date-stamped** report so prior audits are never overwritten:
`docs/production-readiness-audit-<YYYY-MM-DD>-<HHMM>.md` (UTC HHMM keeps same-day audits from colliding; later audits derive the SSoT window from the most recent filename). Get the date from the `currentDate` context or `date -u +%F-%H%M`. Each report is a point-in-time snapshot — **do not** read a previous report as a baseline; audit from scratch every run.

The report contains:

### 1. Verdict

One of:

- **🟢 CLEAN** — Ship it. LOW findings only.
- **🟡 CONDITIONAL** — Shippable, but HIGH items must be addressed within 1 sprint.
- **🔴 BLOCKED** — CRITICAL issues. Do not ship until resolved.

Defect-tracker voice (no praise lines). Write only:

- **Gating findings:** every unresolved CRITICAL and HIGH by `#`. Empty for the tier → write `none`.
- **Top 3 highest-severity findings:** three `#` references + one-line summary from Section 5.

**Forbidden here:** "architecture is solid", "tests comprehensive", "well-organized", numerical health scores, or any sentence softening the verdict by noting what is NOT broken.

### 2. `bun run check` + `bun run build` + `bunx knip` Result

`check`: PASS/FAIL (+ failing tail if FAIL — the CRITICAL #1 finding). `build`: PASS/FAIL (+ tail). `knip`: unused files / unused exports / phantom deps / unused deps counts + lists (or "not configured — MEDIUM tooling gap").

### 3. Step 2c Static-Signal Grep Summary

For each grep (1–19): hit count + worst-severity finding ID. Zero-hit greps recorded as ✓.

**Step 2d hand-review record (proof-of-execution).** A one-paragraph record: the top-10 file paths sampled (from #1), and for each Step 2d hint (session gate, webhook verification, credit refund integrity, bot trust boundary, inline comments) either the finding `#`s filed OR `scanned <N> — 0 findings`. Absence of this paragraph means Step 2d was skipped — a critical workflow failure, not a "no findings" outcome.

### 4. Architecture Health

File-size distribution (>400 LOC mixed-concern vs cohesive vs <400); data-flow boundary violations (greps #2/#3); RSC `"use client"` boundary map; god files.

### 5. Bug Tracker (Summary Index)

One row per finding — scannable, no multi-line code in cells. Evidence + Fix live in Section 6.

| #   | Severity | Area | File:Lines               | One-liner                                                  |
| --- | -------- | ---- | ------------------------ | ---------------------------------------------------------- |
| 1   | CRITICAL | B1   | src/actions/stripe.ts:52 | Action mutates Stripe data with no `getSessionUser()` gate |

### 6. File-by-File Findings (Detail)

For each `#` in numeric order:

**### Finding #N — [SEVERITY] [Area code] — `file:lines`**
**Evidence** (3–10 lines, exact quote from current branch) → fenced code.
**Why:** one sentence — the rule it violates, the failure mode.
**Fix:** corrected snippet or one-line refactor directive (NOT "consider extracting").

### 7. Refactoring Recommendations

Concrete split/extract suggestions: `path/file.ts` (X LOC) → split into A + B because [reason].

### 8. Release Readiness Checklist

First two items binary (pass/fail). Every other item checked iff **zero HIGH/CRITICAL findings** in its area. The "All CRITICAL and HIGH resolved" item is the global rollup.

- [ ] `bun run check` exits 0
- [ ] `bun run build` succeeds
- [ ] `bunx knip` clean (or gate added)
- [ ] All CRITICAL and HIGH items resolved (global rollup)
- [ ] No data-flow boundary violation (greps #2/#3 clean)
- [ ] Every user-scoped action gated by `getSessionUser()` (B1/B2)
- [ ] Stripe webhook verifies its secret + trusts only `metadata.userId` (B6)
- [ ] Credits consumed under a guard + rolled back on failure; negatives clamped (B3/B4/B5)
- [ ] All env vars via `src/lib/env.ts`; no server secret under `NEXT_PUBLIC_` (B7/B8)
- [ ] Bot input validated + scoped; bot failure isolated from web app (B9/M4)
- [ ] No `any` remaining (G1)
- [ ] No N+1 in hot paths; no per-request connection churn (D1/D2)
- [ ] No circular imports OR all cycles type-only (escape valve)
- [ ] Logger + sanitize on all error paths (M2)
- [ ] Design language monochrome; no `h-screen` (I1–I3)
- [ ] Docs SSoT in sync on behavioural changes (K1/K2)
- [ ] No `F-NNN` / `plan_*.md` refs in src/ or docs SSoT (L1) — NEW only

### 9. Action Items (Priority-Ordered)

Numbered, highest impact first. Each: what to do, file(s), complexity.

**Complexity (fixed — do not invent per-audit):**

- **S** — < 2h, single function/config, no migration, no contract change.
- **M** — < 1 day, single area or 2–3 files in one bounded context.
- **L** — > 1 day OR multi-area touch OR schema change OR public contract change (env var, exported type, action signature, route).

---

## Anti-Patterns the Auditor Itself Must Avoid

- **Hallucinated findings** — every row needs a quoted snippet from the current branch. Can't quote it → don't file it.
- **Vague directives** — "consider refactoring" / "looks complex" are not findings. Record a concrete fix or drop it.
- **Severity inflation** — do not promote MEDIUM to HIGH "to be safe". The Rubric is the contract.
- **Praise text** — see No-praise rule. Output is a defect tracker.
- **grep hits filed blind** — greps #12/#13/#14 are locators; confirm by reading in Step 2d before filing.
- **Auditing for absent stacks** — there is no Sanity, MongoDB, OpenAI, rate-limiter, Sentry, or i18n here. Do not file findings for their absence.
- **Scope creep** — purely exploit-chain, perf, or single-PR findings go to the `security-reviewer` / `rsc-boundary-reviewer` agents or `code-review` (Section 0), not here.
- **Skipping focus areas** — Exit Criteria #1 is non-negotiable. Walk every area A–M by the table of contents, not by counting letters.
