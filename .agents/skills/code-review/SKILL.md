---
name: code-review
description: Reviews code changes for bugs, style issues, and best practices against NextRun project conventions. Use when reviewing PRs or checking code quality.
---

# Code Review

Before reviewing, read `.agents/rules/base.md`, `.agents/rules/grammy.md`, and `.agents/rules/memory.md` to ensure the review is grounded in current project state and conventions.

## Review Checklist

### 1. Correctness & Business Logic

- Does the code fulfil the intended feature or fix?
- For handlers: does it correctly route voice vs text messages?
- For data writes: does it **merge** into the existing daily log rather than overwrite it? (Critical invariant from `memory.md`.)
- For AI calls: is the structured data returned by GPT/Whisper being validated before being written to Supabase?

### 2. Security & Auth

- Non-whitelisted users must never reach OpenAI or Supabase calls — verify the `whitelist` middleware is applied before any handler that costs quota or touches the DB.
- No secrets or API keys are hardcoded. All env vars must flow through `src/env.ts`.
- Supabase queries must not allow user-supplied strings to bypass row-level conditions (no raw SQL interpolation).

### 3. TypeScript Quality

- No `any`. If something is unknown, use `unknown` and narrow it properly.
- Prefer `interface` over `type` for object shapes (per `base.md`).
- No unnecessary type assertions (`as SomeType`). Validate at boundaries instead.
- Strict null-checks: all optional Supabase/OpenAI response fields must be handled.

### 4. Code Style (per `base.md`)

- Only **arrow functions** (`const fn = () => ...`). Flag any `function` keyword usage.
- `camelCase` for variables/functions. `PascalCase` for types and interfaces.
- Comments exist only for non-obvious business logic or edge cases — no redundant prose.
- Minimal abstraction: no new helper created if it's used only once.

### 5. grammY Conventions (per `grammy.md`)

- Multi-step flows use `grammY Sessions` + `Conversations` — no manual state flags in handlers.
- Every callback query handler calls `await ctx.answerCallbackQuery()`.
- Inline keyboards use `InlineKeyboard` builder; parse mode is `"HTML"`.
- A global `bot.catch` handler must remain in place; new error paths must not swallow errors silently.
- New bot logic goes into `handlers.ts` or `callbacks.ts` — `index.ts` stays thin.

### 6. Testing

- New functions that contain branching logic or touch external services must have a vitest test.
- Mocks for modules belong in the centralized `src/test/mocks/modules.ts`.
- Tests cover at least: happy path, missing/malformed input, and the daily-merge edge case when relevant.

### 7. Error Handling & Resilience

- OpenAI and Supabase calls are wrapped in try/catch. Errors are logged and a graceful user-facing message is sent.

### 8. Performance

- No redundant DB reads in a single request lifecycle — cache the daily record locally within the handler if needed.
- Large OpenAI responses are not stored verbatim in the DB unless required; extract only the structured fields.

---

## How to Provide Feedback

Structure your review as follows:

**[BLOCKER]** — must be fixed before merge. Security issues, data-loss bugs (e.g. overwriting daily log), missing whitelist guard.

**[ISSUE]** — should be fixed. Violation of conventions, missing error handling, absent tests for branching logic.

**[SUGGESTION]** — optional improvement. Style nit, readability, minor performance.

For each item:

1. Quote the exact code or file location.
2. Explain **why** it's a problem, linking to the relevant rule in `.agents/rules/` if applicable.
3. Provide a concrete corrected snippet or alternative.

End the review with a one-line summary verdict: **Approve**, **Approve with suggestions**, or **Request changes**.
