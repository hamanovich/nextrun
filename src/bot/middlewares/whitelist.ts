import { Context, NextFunction } from "grammy";
import { env } from "@/lib/env";

export const WHITELIST_IDS = env.WHITELIST_USER_IDS.split(",")
  .map((id) => id.trim())
  .filter(Boolean)
  .map((id) => parseInt(id, 10));

export const whitelistMiddleware = async (ctx: Context, next: NextFunction) => {
  if (!ctx.from) return;

  const userId = ctx.from.id;

  if (WHITELIST_IDS.length === 0) {
    console.warn(`Whitelist empty, rejected user: ${userId}`);
    return;
  }

  if (WHITELIST_IDS.includes(userId)) await next();
  else
    console.log(
      `Access denied for user: ${userId} (${ctx.from.username || "no username"})`,
    );
};
