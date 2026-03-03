---
trigger: always_on
---

# grammY Bot Coding Standards

## Bot Architecture

- **Artifact-First:** Before complex tasks, create `artifacts/plan_[id].md`.
- **Modular Design:** Logic is split between `src/bot/handlers.ts` and `src/bot/callbacks.ts`. Avoid bloating `bot.ts`.
- **State:** Use `grammY Sessions` + `Conversations` plugin. Do not manage multi-step states manually.
- **Safety:** Implement a global `bot.catch` handler.

## Telegram UI/UX

- **Keyboards:** Use `InlineKeyboard` or `Keyboard` builders.
- **Feedback:** Always `await ctx.answerCallbackQuery()` for buttons.

## Middleware

- Keep middleware thin. Move DB logic to `src/services/`.
- Context parameter is always named `ctx`.

## Resilience & UX

- **Escaping:** Use `esc()` helper for MarkdownV2 text to avoid API errors.
- **Sessions:** Always define a clear `SessionData` interface.
- **Throttle:** Use `apiThrottler()` middleware for all instances.
