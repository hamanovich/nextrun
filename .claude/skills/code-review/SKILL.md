---
name: code-review
description: Reviews a bounded code change (uncommitted diff, staged changes, a PR/branch, or specific files) for bugs, the Drizzle/Neon data-flow boundary, RSC client/server split, auth & Stripe credit/webhook gating, the grammY bot trust boundary, env-contract violations, input validation, TanStack Query cache discipline, test quality, observability, design-language drift, docs SSoT same-change, and forbidden artifact refs. Use when the user asks to review code, check a PR, inspect changes, or asks "does this look right?", "can you check this?", "review my changes". For a whole-codebase production-readiness sweep, use code-audit instead.
---

# Code Review

## Mindset

Every line of changed code is guilty until proven correct. Don't look for what works — hunt for what breaks, leaks, or violates boundaries. If a change "looks fine" on first read, read it again harder.

**No praise.** The output is a defect list, not a report card. No "the change is well-structured", no "tests look comprehensive". Either a finding is recorded or it is not.

**Component/function analogue:** A long function or Server Component inside the diff is NOT a finding by itself. A 150-LOC component that reads top-to-bottom as one cohesive page (fetch → derive → render) is fine. LOC is a _trigger for hand-review_, not an automatic finding. What IS a finding inside it: a `"use client"` boundary parked too high, mixed concerns (DB query + JSX + client hook), nesting >3, cyclomatic >6, repeated JSX/logic that should extract, boolean-blind props. Ritualistic splitting "to satisfy the cap" is worse than the original — do not file findings that would force it.

---

## Section 0 — Review Boundaries

`code-review` is **diff-driven**. It catches defects the change introduces, not whole-codebase rot. If a finding requires walking the entire repo, it belongs elsewhere:

| Concern                                                                                  | Use this instead                                       |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Whole-repo structural rot, god files, dead code, package.json hygiene                    | `code-audit` skill                                     |
| Exploit chains: auth-bypass, Stripe webhook forgery, bot command injection, PII exposure | `security-reviewer` agent                              |
| Runtime cost under load, bundle size, render perf                                        | `rsc-boundary-reviewer` agent / `performance` analysis |

`code-review` MAY flag a security-shaped defect at BLOCKER severity (missing `getSessionUser()` gate, unverified webhook, raw user input → DB query, hardcoded secret, credit consumed without refund) — but a full exploit analysis is the `security-reviewer` agent's job. Cross-ref it in the finding body when appropriate; do not block the review on it.

**Vendor exemption.** Files under `src/components/ui/**` (shadcn/Radix generated) are third-party scaffolding. They are **exempt from §5 style nits** (the generated structure is intentional). Changes you actively author inside such a file are still reviewed under §1–§14; the pristine generated content is not reviewed as if you wrote it.

---

## Before You Start

Read these to ground the review in current project state:

1. `CLAUDE.md` — architecture, data flow (Drizzle/Neon + Better Auth + Stripe credits + grammY bot), business context
2. `.claude/rules/code-style.md` — coding standards and the "Never" list

Sources of truth (consult instead of assuming): `src/actions/user.ts` (`getSessionUser`, `consumeOneCredit`, `refundOneCredit`, `updateUserStripeData`), `src/actions/stripe.ts` (Zod schemas), `src/db/schema.ts`, `src/lib/env.ts`, `src/lib/auth.ts`, `src/lib/logger.ts`, `src/lib/sanitize.ts`, `vitest.config.ts`, `package.json`.

**Precedence when artifacts disagree:** shipped code is the source of truth. If `CLAUDE.md` describes a layer but `src/` has none, the finding is "doc drift in CLAUDE.md" (filed against the doc), NOT "missing layer in code". Code wins, docs catch up.

---

## Review Target

The user usually specifies a path, glob, or PR ref. If none is given, default to **all uncommitted changes** in the working tree.

> ⚠️ **Untracked files are the highest-risk part of any review.** `git diff` + `git diff --staged` do NOT include new untracked files. Always enumerate the full change set with `git status --porcelain`, then review: modified tracked files (`git diff`), staged files (`git diff --staged`), AND every untracked (`??`) file in full. Skipping untracked-files enumeration invalidates the review (see Anti-Patterns + Exit Criteria).

Resolve the target:

- No arg → `git status --porcelain`, then `git diff` + `git diff --staged` + every `??` file.
- File/dir → read those files plus their direct callers/callees.
- PR# / branch → `git diff main...<branch>` (or `gh pr diff <n>`), plus untracked enumeration if reviewing a local branch.

If the change set is empty, ask the user what to review before proceeding.

### Diff-Size Tier

Pick the tier from `git diff --stat | tail -1` (lines changed) and `git diff --name-only | wc -l` (file count). The tier controls **conditional** sections only — the always-on set runs in every review.

**Always-on (every diff, regardless of size):** §1 Correctness, §2 Architecture & Boundaries, §3 Security & Auth, §8 Error Handling, §9 Performance hot-spots.

These carry BLOCKER-class defects that hide in 5-line changes (a Server Action with no session gate, a DB client in a component, an unverified webhook branch, a credit not rolled back). Tier does not gate them.

**Conditional sections** — run when the diff touches the matching scope:

| Section                       | Triggers when…                                                                        |
| ----------------------------- | ------------------------------------------------------------------------------------- |
| §4 TypeScript Quality         | Any `.ts`/`.tsx` changed                                                              |
| §5 Code Style                 | Any `.ts`/`.tsx` changed                                                              |
| §6 Next.js & RSC Boundary     | Any `src/app/**` or component changed                                                 |
| §7 Design Language            | Any `.tsx` rendering UI changed                                                       |
| §10 Import Hygiene            | `>10` files changed OR new directory under `src/` OR `package.json` changed           |
| §11 Test Discipline           | Any `src/**` production change OR a `*.test.ts(x)` changed                            |
| §12 Observability             | New error path or new logging added                                                   |
| §13 Docs SSoT Same-Change     | `src/db/schema.ts` changed, the Stripe flow changed, or a user-facing surface changed |
| §14 Forbidden Patterns        | Any `src/**` or `docs/**` changed                                                     |
| §15 Commit Message Discipline | Always (cheap)                                                                        |

Diff-volume class also adjusts the workflow:

| Class        | Trigger                    | Procedure                                                                                                                                                                                                                                                                                                                         |
| ------------ | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Smoke**    | <20 lines AND ≤2 files     | Always-on + conditionals that fire. Single pass.                                                                                                                                                                                                                                                                                  |
| **Standard** | 20–300 lines OR 3–20 files | Always-on + every triggered conditional.                                                                                                                                                                                                                                                                                          |
| **Deep**     | >300 lines OR >20 files    | If `Agent` available, dispatch parallel Explore subagents (one per directory cluster) for §1–§10, or delegate to the `security-reviewer` / `rsc-boundary-reviewer` agents; walk §11–§15 yourself. **Fallback (no Agent):** walk §1–§10 sequentially as in Standard — do NOT skip. Populate `## Diff-Size Tier note` (see Output). |

### Read-Twice Rule

**Pass 1 — intent.** Read the diff start-to-finish without the checklist. The artifact is **one mandatory line** at the top of Output:

```
Intent: extract credit consumption into a Server Action; no behavior change expected.
```

If you cannot write that sentence after reading the diff, you have not done Pass 1. No checklist walk until the Intent line exists.

**Pass 2 — checklist.** Walk §1–§15 applying the rules. Findings are recorded only in Pass 2.

---

## Static-Grep on Changed Files

Narrow the audit-style greps to the diff. Run once before the checklist walk; the hits seed concrete findings.

```bash
CHANGED=$(git diff --name-only --diff-filter=AM HEAD; git ls-files --others --exclude-standard)
PROD=$(echo "$CHANGED" | grep -E '^src/' | grep -vE '\.test\.|/test/|__tests__' | grep -E '\.tsx?$' || true)
TEST=$(echo "$CHANGED" | grep -E '\.test\.tsx?$' || true)

# 1. DB client in components/hooks  (BLOCKER each — data-flow boundary)
[ -n "$PROD" ] && echo "$PROD" | grep -E 'src/(components|hooks)/' | xargs grep -nE "from ['\"]@/db" 2>/dev/null

# 2. Raw fetch for a mutation (should be a Server Action)  (BLOCKER each)
[ -n "$PROD" ] && echo "$PROD" | grep -E 'src/(actions|components|hooks)/' | xargs grep -n "fetch(" 2>/dev/null | grep -v '/api/health'

# 3. process.env.X outside src/lib/env.ts  (BLOCKER each — env contract; NODE_ENV in logger.ts is the documented exception)
[ -n "$PROD" ] && echo "$PROD" | grep -v 'src/lib/env.ts' | xargs grep -n "process\.env\." 2>/dev/null

# 4. `any` leaks  (ISSUE each)
[ -n "$PROD" ] && echo "$PROD" | xargs grep -nE ": any(\b|\[|;|,|\))|<any>|as any" 2>/dev/null

# 5. Inline `function` keyword in production  (ISSUE each — allow page/layout default exports + generateMetadata/generateStaticParams/generateViewport)
[ -n "$PROD" ] && echo "$PROD" | xargs grep -nE "^[[:space:]]*function |^export function " 2>/dev/null \
  | grep -vE "generateMetadata|generateStaticParams|generateViewport"

# 6. Hardcoded brand colors / h-screen — design-language drift  (ISSUE each; ui/ exempt)
[ -n "$PROD" ] && echo "$PROD" | grep -v 'src/components/ui/' | xargs grep -nE "bg-(green|blue|red|yellow|orange|purple|pink)-[0-9]|text-(green|blue|red|yellow|orange|purple|pink)-[0-9]|h-screen" 2>/dev/null

# 7. @ts-ignore / @ts-expect-error  — LOCATOR + HAND-REVIEW (-B/-A shows context; see §4)
[ -n "$CHANGED" ] && echo "$CHANGED" | xargs grep -nE -B1 -A1 "@ts-(ignore|expect-error|nocheck)" 2>/dev/null

# 8. Stripe webhook handler in the diff  (cross-ref §3 — MUST verify its secret before mutating)
echo "$CHANGED" | grep -qE 'src/app/api/webhooks' && \
  echo "$PROD" | xargs grep -nE "constructEvent|STRIPE_WEBHOOK_SECRET" 2>/dev/null

# 9. Actions touched without a session gate  (cross-ref §3 — hand-review each)
echo "$CHANGED" | grep -qE '^src/actions/' && echo "$CHANGED" | grep -E '^src/actions/' \
  | xargs grep -Ln "getSessionUser" 2>/dev/null

# 10. Credit consume without a refund path nearby  (cross-ref §3 — hand-review each)
echo "$CHANGED" | xargs grep -nE "consumeOneCredit|refundOneCredit|stripeCredits" 2>/dev/null

# 11. Server secret exposed via NEXT_PUBLIC_  (BLOCKER each)
[ -n "$CHANGED" ] && echo "$CHANGED" | xargs grep -nE "NEXT_PUBLIC_.*(SECRET|TOKEN|KEY|PASSWORD|DATABASE_URL)" 2>/dev/null

# 12. .skip / .only / xit / xdescribe in tests  (ISSUE each)
[ -n "$TEST" ] && echo "$TEST" | xargs grep -nE "\.(skip|only)\(|^[[:space:]]*xit\(|^[[:space:]]*xdescribe\(" 2>/dev/null

# 13. Forbidden refs F-NNN / P-N.N / plan_*.md  (ISSUE each)
[ -n "$CHANGED" ] && echo "$CHANGED" | xargs grep -EnH "\bF-[0-9]{3}\b|\bP-[0-9]+\.[0-9]+\b|plan_[a-z0-9_]+\.md" 2>/dev/null \
  | grep -v '^docs/planning/' | grep -vE 'docs/.*-audit-'
```

Cross-reference each hit to a checklist item. **Hits #8, #9, #10 are locators, not automated findings** — each match needs hand-review of adjacent context to decide if the gate/verification/refund actually exists.

### Optional commands (run only when triggered)

```bash
# Circular import — run if diff touches >10 files OR adds a new directory under src/
bunx --bun madge --circular --extensions ts,tsx src/ 2>/dev/null

# Knip — run if diff adds >5 new exports OR a new .ts(x) file OR a new package.json dep (no knip config is committed)
bunx --bun knip
```

Don't run these on every review — slow and noisy on small diffs.

---

## Review Checklist

Each item carries an explicit severity (BLOCKER / ISSUE / SUGGESTION). Copy it as-is into the finding — do not invent or downgrade (use a waiver for genuine false-positives).

### §1. Correctness & Business Logic

- **Intent fulfilled, all edge cases handled, not just happy path.** Missing edge case → ISSUE. Wrong logic → BLOCKER.
- **Server Action orchestration clean** (validate → auth → data access → return). Business logic that belongs in a helper inlined into a component → ISSUE.
- **External responses validated** (Zod or explicit narrowing) before use; Stripe/bot failure degrades gracefully (user gets a sensible result, not a crash). Missing validation at a boundary → BLOCKER. No graceful degradation → ISSUE.
- **New calculations / derivations** — null/empty/undefined inputs handled, no divide-by-zero, credit math never goes negative un-clamped. Missing guard → BLOCKER if crash-prone or balance-corrupting, ISSUE if silent-wrong.

### §2. Architecture & Boundaries

One data path, **no service layer**.

- **DB access** (`db` from `@/db`, schema `@/db/schema`) lives in `src/actions/*`, `src/app/api/*`, the Better Auth adapter (`src/lib/auth.ts`), and bot/db wiring (`src/db/*`, `src/bot/*`). DB client imported in a component/hook → BLOCKER (grep #1).
- **Hooks** (`src/hooks/*`, e.g. `use-credits.ts`) wrap actions / API routes via TanStack Query. Raw `fetch` for a mutation, or a new API route used as a mutation endpoint → BLOCKER (grep #2).
- **`src/app/api/*`** is only the Better Auth catch-all (`auth/[...all]`), the Stripe webhook (`webhooks/stripe`), the `credits` read, and health. A new route outside those four → ISSUE (justify) or BLOCKER (if it bypasses a Server Action for a mutation).
- **Concern separation:** one file mixing DB query + JSX + client hook → ISSUE.
- **No new god files:** change makes an existing file significantly larger with unrelated functionality → ISSUE. A long-but-cohesive file is not a finding (see Mindset).
- **Barrel exports:** `index.ts` is thin re-exports only. Logic in a barrel → ISSUE.

### §3. Security & Auth

- **User-scoped action calls `getSessionUser()` before any logic**, and scopes Drizzle queries to the authenticated `userId` (`eq(users.id, userId)`) — never to an unvalidated id from input. Missing gate → BLOCKER (grep #9). Scoping to an input id → BLOCKER.
- **Credit spends are atomic and reversible:** `consumeOneCredit` deducts under a `gte(stripeCredits, 1)` guard and checks the returned row; every caller `refundOneCredit` on downstream failure; `updateUserStripeData` clamps negatives. Missing guard, missing refund, or unclamped negative → BLOCKER (grep #10).
- **Stripe webhook verifies `STRIPE_WEBHOOK_SECRET`** via `constructEvent` before mutating state, and grants credits only on a paid session with trusted `metadata.userId`. Missing → BLOCKER (grep #8).
- **No hardcoded secrets/tokens/keys** — all via `src/lib/env.ts`. Hit → BLOCKER.
- **All env vars flow through `src/lib/env.ts`** (Zod-validated). `process.env.X` outside it → BLOCKER (grep #3). `NODE_ENV` in `src/lib/logger.ts` is the documented exception — waive with the file:line basis.
- **Server secrets never `NEXT_PUBLIC_`** (bot token, Stripe secret, DB URL). Hit → BLOCKER (grep #11).
- **grammY bot validates command input** and scopes DB access to the resolved Telegram user — no raw user input → query without validation. Raw bot input → DB → BLOCKER (injection risk).

### §4. TypeScript Quality

- **Zero `any`.** Any `any` / `as any` / `: any` → ISSUE (grep #4).
- **No unsafe `as SomeType` at a trust boundary** (form input, Stripe response, webhook body, bot command, DB result). Use Zod or runtime narrowing → BLOCKER at trust boundary, ISSUE elsewhere.
- **Strict null-checks:** all optional/nullable Drizzle fields explicitly handled. Missing → ISSUE.
- **`@ts-ignore`/`@ts-expect-error` only with a justification** in the PR description + a pinned test (NOT an inline comment — see §5). Unjustified → ISSUE (grep #7).
- **`type` for object shapes** per code-style; no gratuitous `as`. SUGGESTION.
- **Public action functions with complex returns** have explicit return-type annotations. Missing → SUGGESTION.

### §5. Code Style

- **Arrow functions only.** Flag `function` (allow Next.js page/layout default exports + framework `generateMetadata`/`generateStaticParams`/`generateViewport`) → ISSUE (grep #5).
- **`camelCase` vars/functions, `PascalCase` components, `[Component]Props` prop types.** Violation → ISSUE.
- **`cn()` from `@/lib/utils`** for conditional Tailwind merging — no ad-hoc class concatenation → ISSUE.
- **No comments except for genuinely non-obvious logic.** Prefer self-documenting names + PR description + pinned tests over WHY/INVARIANT comments. **This binds the reviewer too:** never emit a `[SUGGESTION]` whose fix adds an explanatory comment — such a finding is **invalidated** (dropped; the rest of the review stands). `src/components/ui/**` (shadcn) is exempt from style nits (see Section 0).
- **No new abstraction for a single call site.** Speculative "flexibility" → ISSUE.
- **Minimal change footprint:** no opportunistic "improvement" of unrelated adjacent code → SUGGESTION if minor, ISSUE if substantive.

### §6. Next.js & RSC Boundary

- **Server Components by default;** `"use client"` only for state/events/browser APIs, kept at the **leaves**. Boundary parked too high (a whole page marked client to use one hook) → ISSUE.
- **`server-only`** imported in modules that must never reach the client bundle (DB, secrets). Missing on a server-only module pulled near a client tree → BLOCKER.
- **Pages fetch server-side** (actions) and pass `initialData`/`placeholderData` to hooks. Client-side initial fetch that duplicates an available server fetch → ISSUE.
- **Mutations via Server Actions, not API routes.** (mirrors §2.)
- **`next/image` for images; absolute `@/...` imports** (no `../../`); navigation via `next/link` + `next/navigation` (there is **no i18n layer** — `next/navigation` is correct here) → ISSUE on a relative import.
- **Page metadata** in a sibling `metadata.ts`; site-wide defaults + JSON-LD in `src/app/layout.tsx`. New page with metadata inlined into the component → SUGGESTION.

### §7. Design Language

- **Strict monochrome:** only the neutral OKLch scale with `--primary` as the single accent. Hardcoded brand color → ISSUE (grep #6). `text-destructive` only for genuine error states.
- **No gradient text, no colored status dots.** Hit → ISSUE.
- **`min-h-[100dvh]`/`min-h-[60vh]`, never `h-screen`.** `h-screen` → ISSUE (grep #6).
- **Theme tokens come from `@theme` in `src/app/globals.css`** — there is no `tailwind.config`. A new hardcoded token where a CSS variable exists → SUGGESTION.

### §8. Error Handling & Resilience

- **External calls** (DB, Stripe, bot) wrapped in try/catch, errors routed through the `consola`-based `logger`/`taggerLogger` (`@/lib/logger`), with user-derived values sanitized via `src/lib/sanitize.ts` and a graceful user-facing result. Missing → ISSUE.
- **No unhandled promise rejections.** Every `Promise.all`/`.catch` chain is safe; no unexplained fire-and-forget. Missing → BLOCKER (crash risk).
- **Graceful degradation:** one data source fails → a useful result still returns where the product allows it. Silent total drop → ISSUE.
- **No internal detail leaks** (stack traces, DB structure, keys) in user-facing error messages → BLOCKER.
- **Bot isolation:** a bot-handler failure must not crash the web app (separate process) → BLOCKER if a shared module would throw across the boundary.

### §9. Performance (hot-spot only — full analysis → `rsc-boundary-reviewer` agent)

- **No N+1 across `select`/`find` loops** in a request path. Hit → BLOCKER if user-facing latency, ISSUE otherwise.
- **Reuse the shared `db` client** (`@/db`) — no new per-request connection. New ad-hoc connection → BLOCKER.
- **Don't persist large Stripe responses verbatim** — extract only needed fields. Verbatim persist → ISSUE.
- **No redundant per-request DB reads** where an existing action/hook already loads the data → ISSUE.

### §10. Import Hygiene

- **`@/` alias for all imports within `src/`.** Relative `../../..` chain → ISSUE.
- **No circular imports introduced.** Run madge only when triggered (Optional commands). Hit → BLOCKER, but apply the type-only escape valve in the Rubric.
- **No unused imports** (ESLint catches; if it missed one, ESLint is misconfigured → ISSUE).
- **Unused exports / dead files / phantom deps** — caught by `bunx knip` (conditional). Phantom dep → ISSUE; unused export of a newly-added symbol → ISSUE.

### §11. Test Discipline

`src/test/` holds setup + mocks; tests are co-located (`*.test.tsx` / `__tests__/`). The project gates on `bun run check` (ts:check + lint + format:check + test) and has coverage thresholds (50%) in `vitest.config.ts`.

- **Tests ship with the change.** New action / branching logic without a colocated test → ISSUE. New action in the credit/checkout/webhook path with zero tests → BLOCKER.
- **Bugfix ⇒ regression test** that fails on old code, passes on new. Bugfix with no test → ISSUE unless pure typo/formatting with explicit justification.
- **External calls mocked from shared setup** (`src/test/setup.ts` + `src/test/mocks/`); `server-only` aliased in `vitest.config.ts`. Hand-rolled duplicate of an existing mock → ISSUE.
- **Tests assert behavior, not implementation.** Each anti-pattern → ISSUE:
  - Test body with zero `expect(...)`.
  - Test asserting only `.not.toThrow()` with no state assertion (exempt: a constructor/factory smoke test that ALSO has one minimal post-construction assertion).
  - Asserting exact Tailwind class strings instead of content/roles/behavior.
  - `.skip` / `.only` / `xit` / `xdescribe` (grep #12).
- **Self-mock locator** — a `*.test.ts` that imports the unit under test AND `vi.mock(...)`s that same path warrants hand-review; confirmed full self-mock of the unit → ISSUE (tautology). Partial mock of an adjacent symbol is NOT a finding.
- **Suite green.** `bun run check` exits 0. Failing or skipped test → BLOCKER.

### §12. Observability

- **New error path routes through the `logger`/`taggerLogger`** (`@/lib/logger`) consistently, with sanitized inputs. Raw `console.error` on a new action/API/bot error path → ISSUE.
- **Non-error logging uses the `consola`-based `logger`,** not raw `console` → SUGGESTION.

### §13. Docs SSoT Same-Change Discipline

The diff must update the matching SSoT in the same change. Run `git diff --name-only | sort -u`.

| If diff changes…                                                                                | …it MUST also change                                                    | Severity if missing |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------- |
| `src/db/schema.ts` (new/changed column on a behavioural path)                                   | `bun run db:push` applied + `CLAUDE.md` business context if user-facing | ISSUE               |
| The Stripe / credit flow                                                                        | `docs/STRIPE_INTEGRATION.md`                                            | ISSUE               |
| Any user-facing surface (credit flow, bot command, pricing/tier, auth surface, settings toggle) | `CLAUDE.md` business context                                            | ISSUE               |

**Escape — internal change exemption.** The requirement applies only when the diff changes documented behavior or external contract. Exempt: internal rename/extract/inline of a private symbol; a bug fix restoring already-documented behavior; test-only change; comment/string-only change with no semantic effect. When invoking, record one line in `## Exemptions & Skipped Checks`: `[§13 exempt: internal refactor of src/actions/user.ts — no schema or contract change]`. The reviewer owns the call; the user can challenge with a counter-example.

### §14. Forbidden Patterns in Permanent Artifacts

Ticket-shaped IDs and plan refs dangle when plans get deleted. Forbidden in `src/**` and `docs/**` SSoT. Exempt: `docs/planning/**`, `docs/*-audit-*.md`.

- `F-NNN` / `P-N.N` / `plan_*.md` references in code or SSoT docs → ISSUE (grep #13).
- Inline production comment that merely restates the code ("the what") → SUGGESTION (drop it; do not propose a _replacement_ comment — see §5).

### §15. Commit Message Discipline

- **Conventional commit prefix** (`feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`). Missing/wrong → SUGGESTION.
- **No `WIP` / `fixup!`** without a stated squash plan → ISSUE.

**Verdict-cap:** findings _exclusively_ in §15 never trigger ⚠️ Request changes by themselves. The max verdict for a §15-only review is ✅ Approve with suggestions, even if a §15 item is ISSUE severity. Blocking a substantive PR over commit hygiene alone is severity inflation through procedure.

---

## Severity Rubric (deterministic)

Three classes. Copy from the checklist item — do not invent.

| Class            | Definition                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[BLOCKER]**    | Must fix before merge. Security hole (hardcoded secret, server secret under `NEXT_PUBLIC_`, raw user input → DB query, missing session gate, unverified webhook, credit consumed without refund-on-failure or unclamped negative), data-flow boundary violation exposing data (DB client in a component/hook, mutation via API route), `server-only` leak into the client bundle, process-crash risk (unhandled rejection, bot failure crossing into the web app), data loss, internal-detail leak in user-facing error, `process.env.X` outside `env.ts`, `as` at a trust boundary, N+1 in a user-facing path, ad-hoc per-request DB connection, failing/skipped test in suite. |
| **[ISSUE]**      | Should fix. Convention violation, missing error handling on an external call, `any`, `as` off trust boundary, `next/image` missing, mixed concerns in one file, `"use client"` parked too high, DB over-fetch, deep relative import, forbidden `F-NNN`/`plan_*.md` ref, `.skip` in a test, missing test for new action/branching logic, `@ts-ignore` without justification, design-language violation (hardcoded color / `h-screen`), unvalidated bot input, raw `console.error` on a new error path, knip phantom dep, docs SSoT not updated on a behavioural change.                                                                                                           |
| **[SUGGESTION]** | Optional. Readability nit, minor simplification, `type` vs explicit-shape preference, explicit return type on a public function, commit prefix, opportunistic out-of-scope cleanup, raw `console` for non-error logging, metadata inlined instead of a sibling `metadata.ts`.                                                                                                                                                                                                                                                                                                                                                                                                    |

**Trust-boundary escape valves (deterministic downgrade — cite the row in the Why field):**

| Rule                                  | Default | Downgrade to | Trigger                                                                                                                                                                       |
| ------------------------------------- | ------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| §10 circular import                   | BLOCKER | SUGGESTION   | Cycle is fully `import type` on both sides, OR runtime on one side + `import type` on the reverse. madge over-reports type-only cycles — verify by reading both import lines. |
| §4 `as SomeType`                      | BLOCKER | ISSUE        | Cast is at an internal seam between two project modules sharing a schema, NOT at a trust boundary (HTTP / webhook / DB / bot / form-input edge).                              |
| §3 unvalidated id → user-scoped query | BLOCKER | —            | **No downgrade.** Always BLOCKER. Listed so the absence of an escape valve is explicit.                                                                                       |

---

## Evidence Required Per Finding

Every finding MUST contain:

1. **File:line range** (e.g. `src/actions/stripe.ts:52-68`)
2. **Quoted snippet** (3–10 lines, exact text from the diff or untracked file)
3. **Severity class** (`[BLOCKER]`/`[ISSUE]`/`[SUGGESTION]` — copied, not invented)
4. **Why it's wrong** — one sentence citing the §N rule it violates
5. **Fix** — corrected snippet or one-line refactor directive (not "consider refactoring"). **A fix that adds a comment is invalid** — the finding is dropped (see §5).

**A finding without all five fields is invalid and MUST be dropped.** Speculative findings dilute trust.

### Waiver mechanism

If a checklist rule fires but is contextually a false-positive, the reviewer MAY downgrade by recording it as **`[BLOCKER:WAIVED]`** / **`[ISSUE:WAIVED]`** instead of dropping. A waiver MUST include:

- **A file:line basis** (e.g. `WAIVED: src/lib/logger.ts:8 uses process.env.NODE_ENV — the documented logger-flag exception; src/lib/env.ts schema excludes NODE_ENV`).
- **Inclusion in a dedicated `## Waivers` section** at the bottom of Output.

A waiver without a file:line basis reverts to the original severity. Waivers are for false-positive escape, not "looks OK to me" downgrades.

**Waiver overuse → Rule Calibration Note.** More than 2 waivers in one review REQUIRES a `## Rule Calibration Note` at the very bottom listing, per waivered rule: (1) the §N reference, (2) the false-positive pattern in one sentence, (3) a proposed tightening for the next iteration of this skill. The note is a feedback loop on the skill, not a blocker on the PR. >2 waivers with no note → the review is a draft (Exit Criteria).

---

## Exit Criteria

Review is DONE only when ALL hold:

1. Untracked files enumerated via `git status --porcelain` and reviewed in full.
2. Diff-Size Tier resolved: always-on sections (§1/§2/§3/§8/§9) walked; conditionals fired-or-skipped per scope. Deep tier without `Agent` → §1–§10 walked sequentially.
3. Read-Twice honored: `Intent:` line present at the top of Output.
4. Static-grep executed; every hit either produced a finding or was explicitly dismissed in Output with a reason.
5. Every recorded finding has all five evidence fields.
6. Waivers (if any) collected in `## Waivers` with a file:line basis each.
7. If waivers >2, `## Rule Calibration Note` present with all three fields per waivered rule.
8. Verdict written per the formula below.
9. **Pre-flight attestation block present** below `Intent:` with all three lines (`Untracked files reviewed:`, `Sections walked:`, `Conditional skipped:`). `N/A`/`none` are valid values but the line must exist — silent omission invalidates the review.
10. If any `[§13 exempt: ...]` invocation applies, `## Exemptions & Skipped Checks` is present and contains every invocation.
11. If Deep tier, `## Diff-Size Tier note` is present with the `Diff size: ...` line.

If any of 1–11 is incomplete, the review is a draft, not a deliverable.

---

## Output Format

Output structure (in order — each slot the reviewer either fills or explicitly marks N/A / `none`):

1. `Intent:` line (mandatory)
2. **Pre-flight attestation block** (mandatory) — three lines, no blank line between:
   - `Untracked files reviewed: <list, or "N/A — no untracked files">`
   - `Sections walked: §1 §2 ...` (always-on + every triggered conditional)
   - `Conditional skipped: §N (reason if not obvious), ...` (or `none`)
3. Findings in order BLOCKER → ISSUE → SUGGESTION
4. `## Exemptions & Skipped Checks` (mandatory when any `[§13 exempt: ...]` applies; omit heading otherwise)
5. `## Waivers` (mandatory when ≥1 waiver)
6. `## Rule Calibration Note` (mandatory when waivers >2)
7. `## Diff-Size Tier note` (mandatory for Deep; optional otherwise; ≤2 lines, leads with `Diff size: ...`)
8. `Verdict:` line (mandatory, mechanical per table below — no narrative after)

**Example — Standard tier:**

````
Intent: add a Server Action to spend a credit on a feature; wire a TanStack mutation hook.

Untracked files reviewed: src/actions/feature.ts, src/hooks/use-feature.ts
Sections walked: §1 §2 §3 §4 §5 §6 §8 §9 §11 §15
Conditional skipped: §7 (no UI changed), §13 (no schema/contract change)

[BLOCKER] §3 Security & Auth
File: src/actions/feature.ts:12-20
```ts
export const runFeature = async (userId: string) => {
  const ok = await consumeOneCredit(userId);
  if (!ok) throw new Error("No credits");
  await doExpensiveWork();
};
````

Why: §3 — the action trusts `userId` from input instead of resolving `getSessionUser()`, and never calls `refundOneCredit` when `doExpensiveWork()` throws, so a failure burns the user's credit.
Fix:

```ts
export const runFeature = async () => {
  const user = await getSessionUser();
  const ok = await consumeOneCredit(user.id);
  if (!ok) throw new Error("No credits");
  try {
    await doExpensiveWork();
  } catch (err) {
    await refundOneCredit(user.id);
    throw err;
  }
};
```

[ISSUE] §7 Design Language
File: src/components/feature/feature.tsx:18

```tsx
<div className="h-screen bg-green-500">
```

Why: §7 — strict monochrome forbids hardcoded brand colors, and `h-screen` is banned in favor of `min-h-[100dvh]`.
Fix: `<div className="min-h-[100dvh] bg-background">`

Verdict: 🛑 Block

```

### Plain-text Verdict alternative (GitHub mobile)

Tables collapse on mobile; prefer a bare bold verdict line: `BLOCK` (🛑), `REQUEST CHANGES` (⚠️), `APPROVE-WITH-SUGGESTIONS` (✅+), `APPROVE` (✅).

---

## Verdict (deterministic, count-based)

Count findings AFTER applying the §15 verdict-cap and AFTER waivers (waived findings do not count).

| Counts (post-waiver, post-cap) | Verdict |
|---|---|
| ≥1 [BLOCKER] | **🛑 Block** — do not merge until resolved |
| 0 [BLOCKER], ≥1 [ISSUE] | **⚠️ Request changes** — ISSUE items must be addressed |
| 0 [BLOCKER], 0 [ISSUE], ≥1 [SUGGESTION] | **✅ Approve with suggestions** |
| 0 of all three | **✅ Approve** |

The verdict is mechanical. If you want to say "Block, but optional" or "Approve, but do this first" — either your severity is wrong or a waiver applies. Resolve via reclassification or waiver, not a narrative gradient.

---

## Anti-Patterns the Reviewer Itself Must Avoid

- **Skipping the untracked-files check** — new `??` files are highest-risk; never review only `git diff`. Omission invalidates the review (Exit Criteria #1).
- **Hallucinated findings** — every finding needs a snippet quoted from the current diff or untracked file. Can't quote it → don't file it.
- **Vague directives** — "consider refactoring" / "looks complex" are not findings. Record a corrected snippet or drop it.
- **Severity inflation** — do not promote ISSUE to BLOCKER "to be safe". The Rubric is the contract; if a rule misfires, use a waiver, not reclassification.
- **Comment suggestions** — never propose an inline/JSDoc/WHY comment as a fix (§5). A finding whose fix adds a comment is invalidated (that finding only).
- **Reviewing for absent stacks** — there is no Sanity, MongoDB, OpenAI, rate-limiter, Sentry, or i18n here; `next/navigation` is correct. Do not file findings for their absence.
- **Praise text** — see Mindset no-praise rule.
- **Scope creep** — pure exploit-chain, perf, or whole-repo findings get cross-referenced to the `security-reviewer`/`rsc-boundary-reviewer` agents or `code-audit`, not deeply analyzed here.
- **Mechanical-only review without intent pass** — a checklist walk with no `Intent:` line produces line-level findings that miss the actual defect.
- **Waiver overuse without Rule Calibration Note** — >2 waivers forces the note; filing waivers without it invalidates the review.
```
