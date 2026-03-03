import { whitelistMiddleware } from "@/bot/middlewares/whitelist";
import { conversations } from "@grammyjs/conversations";
import { hydrateFiles } from "@grammyjs/files";
import { apiThrottler } from "@grammyjs/transformer-throttler";
import { Bot, session } from "grammy";
import type { MyContext } from "@/types/bot.types";
import { env } from "@/lib/env";
import { setupHandlers } from "./handlers";

export interface SessionData {
  rawTranscript?: string;
}

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
bot.use(whitelistMiddleware);

setupHandlers(bot);

bot.catch((err) => {
  console.error(`Error while handling update ${err.ctx.update.update_id}:`);
  if (err.error) {
    console.error(err.error);
  }
});

bot.api.setMyCommands([
  { command: "start", description: "Start the bot" },
  { command: "help", description: "Bot help" },
]);

bot.start({
  onStart(botInfo) {
    console.log(`Bot started as @${botInfo.username}`);
  },
});
