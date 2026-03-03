import { Bot } from "grammy";
import { MyContext } from "@/types/bot.types";

export const setupHandlers = (bot: Bot<MyContext>) => {
  bot.command("start", (ctx: MyContext) => {
    ctx.reply("Welcome! Use /help to see available commands.");
  });

  bot.command("help", (ctx: MyContext) => {
    ctx.reply(
      "Available commands:\n/start — Start the bot\n/help — Show this message",
    );
  });
};
