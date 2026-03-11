import { conversations } from "@grammyjs/conversations";
import { hydrateFiles } from "@grammyjs/files";
import { apiThrottler } from "@grammyjs/transformer-throttler";
import { Bot, session } from "grammy";
import type { MyContext } from "@/types/bot.types";
import { env } from "@/lib/env";
import { taggerLogger } from "@/lib/logger";
import { setupHandlers } from "./handlers";

export interface SessionData {
  rawTranscript?: string;
}

const log = taggerLogger("bot");

const bot = new Bot<MyContext>(env.TELEGRAM_BOT_TOKEN);

bot.api.config.use(hydrateFiles(bot.token));
bot.api.config.use(apiThrottler());

bot.use(
  session({
    initial: (): SessionData => ({
      rawTranscript: undefined,
    }),
  }),
);

bot.use(conversations());

setupHandlers(bot);

bot.catch((err) => {
  log.error(`Error while handling update ${err.ctx.update.update_id}:`);
  if (err.error) {
    log.error(err.error);
  }
});

bot.api.setMyCommands([
  { command: "start", description: "Start the bot" },
  { command: "help", description: "Bot help" },
]);

bot.start({
  onStart: (botInfo) => log.info(`Bot started as @${botInfo.username}`),
  allowed_updates: ["message", "callback_query"],
});

const shutdown = async (signal: string) => {
  log.info(`Received ${signal}, shutting down gracefully...`);
  await bot.stop();
  process.exit(0);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("uncaughtException", (err) => {
  log.error("Uncaught exception in bot process:", err);
  shutdown("uncaughtException");
});

process.on("unhandledRejection", (reason) => {
  log.error("Unhandled rejection in bot process:", reason);
});
