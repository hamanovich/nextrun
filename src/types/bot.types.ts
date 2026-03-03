import { type ConversationFlavor } from "@grammyjs/conversations";
import { FileFlavor } from "@grammyjs/files";
import { Context } from "grammy";
import { SessionData } from "../bot/index";

export type MyContext = ConversationFlavor<FileFlavor<Context>> & {
  session: SessionData;
};
