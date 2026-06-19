# grammY Telegram Bot Integration

This document outlines the optional **Telegram bot** in the NextRun application, built with **grammY**. The bot is a standalone long-polling process - separate from the Next.js app.

## Overview

- The bot lives in `src/bot/` (`index.ts` = setup + lifecycle, `handlers.ts` = commands).
- It runs as its **own process** (`bun run src/bot/index.ts`), **not** inside the Next.js server. No Next.js route imports it.
- It talks to Telegram via **long polling** (`bot.start()`) - it dials out, so it needs **no inbound port, domain, or webhook**.
- It shares the database via its own client `src/db/index.bot.ts` (WebSocket pool, see `NEON_DRIZZLE_INTEGRATION.md`).
- Plugins in use: `@grammyjs/conversations` (multi-step flows), `@grammyjs/files` (file downloads), `@grammyjs/transformer-throttler` (rate-limit safety).

## Entry point (`src/bot/index.ts`)

```ts
import { conversations } from "@grammyjs/conversations";
import { hydrateFiles } from "@grammyjs/files";
import { apiThrottler } from "@grammyjs/transformer-throttler";
import { Bot, session } from "grammy";
import type { MyContext } from "@/types/bot.types";
import { env } from "@/lib/env";

const bot = new Bot<MyContext>(env.TELEGRAM_BOT_TOKEN);

bot.api.config.use(hydrateFiles(bot.token));
bot.api.config.use(apiThrottler());

bot.use(
  session({ initial: (): SessionData => ({ rawTranscript: undefined }) }),
);
bot.use(conversations());

setupHandlers(bot);

bot.start({
  onStart: (botInfo) => log.info(`Bot started as @${botInfo.username}`),
  allowed_updates: ["message", "callback_query"],
});
```

Key points:

- The bot constructs `new Bot(env.TELEGRAM_BOT_TOKEN)` **at import** (no lazy wrapper) - that is fine because the process always has env at startup and `next build` never imports this file.
- A typed context `MyContext` (`src/types/bot.types.ts`) carries session + conversation flavors.
- `session()` holds per-chat state (`SessionData`); `conversations()` enables multi-step dialogs.

## Handlers (`src/bot/handlers.ts`)

Commands are registered in `setupHandlers(bot)`:

```ts
export const setupHandlers = (bot: Bot<MyContext>) => {
  bot.command("start", (ctx) =>
    ctx.reply("Welcome! Use /help to see available commands."),
  );
  bot.command("help", (ctx) =>
    ctx.reply(
      "Available commands:\n/start - Start the bot\n/help - Show this message",
    ),
  );
};
```

The command menu shown in Telegram is set via `bot.api.setMyCommands([...])` in `index.ts`. Add new commands here and extend that list.

## Lifecycle & resilience

`index.ts` wires production-grade process handling:

- `bot.catch(...)` - logs handler errors without crashing the loop.
- **Graceful shutdown** on `SIGINT`/`SIGTERM` -> `await bot.stop()` -> `process.exit(0)`.
- `uncaughtException` triggers a graceful shutdown; `unhandledRejection` is logged.

## Environment Variables Required

Add to your `.env` (validated by `src/lib/env.ts`):

```env
TELEGRAM_BOT_TOKEN=123456:ABC-...      # from @BotFather
DATABASE_URL=postgresql://...          # the bot reads the same DB
```

> `src/lib/env.ts` validates the **full** schema at import, so the bot process needs the **same env set as the web app** present (even keys it does not directly use), or the strict parse fails fast at startup.

## BotFather setup

1. Message **@BotFather** on Telegram -> `/newbot` -> follow prompts.
2. Copy the token into `TELEGRAM_BOT_TOKEN`.
3. (Optional) set description/about/commands via BotFather; commands are also pushed from code via `setMyCommands`.

## Running

```bash
bun run bot:dev        # watch mode (bun --watch run src/bot/index.ts)
bun run src/bot/index.ts   # one-off run
```

> **Only one poller per token.** Two processes polling the same token cause `409 Conflict`. Do not run `bot:dev` against the **prod** token while the deployed bot is live.

## Deployment

The bot is a **separate Coolify resource** built from `Dockerfile.bot` (not part of the web image). It has no domain, no published port, and no health check - Coolify treats the running process as liveness. Keep it to a single replica. Full runbook: `DEPLOYMENT.md` (§4.7).

## Usage

### For Users

1. Open the bot in Telegram and press Start (or send `/start`).
2. Send `/help` to list commands.

### For Developers

1. Add commands/handlers in `src/bot/handlers.ts`.
2. For multi-step flows, use `@grammyjs/conversations`; persist step state in `SessionData`.
3. For database access, import `db` from `src/db/index.bot.ts` (the WebSocket-pool client), not the HTTP app client.
4. Update `bot.api.setMyCommands([...])` when you add user-facing commands.

## Security Notes

- `TELEGRAM_BOT_TOKEN` is a real secret - runtime-only, never a build arg, never committed.
- Treat every Telegram update as **untrusted input**: validate command arguments and any file/text payloads before use.
- The bot polls outbound only - it exposes no inbound surface (no port/webhook), which keeps its attack surface minimal.
- If you later gate bot features on app accounts, map the Telegram user to an app user explicitly; do not trust the Telegram id alone for authorization.

## Next Steps

1. Create the bot with BotFather and set `TELEGRAM_BOT_TOKEN`.
2. Implement your real commands in `handlers.ts`.
3. Deploy as a separate resource from `Dockerfile.bot` (single replica).
4. Add conversations/file handling as features require.
