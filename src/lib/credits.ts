import "server-only";
import { db } from "@/db";
import { users } from "@/db/schema";
import { and, eq, gte, sql } from "drizzle-orm";

type StripeData = {
  stripeCustomerId?: string;
  stripeCheckoutSessionId?: string;
  stripeCredits?: number;
};

export const updateUserStripeData = async (
  userId: string,
  stripeData: StripeData,
) => {
  const updates = Object.fromEntries(
    Object.entries(stripeData).filter(([, v]) => v !== undefined),
  ) as StripeData;
  if (typeof updates.stripeCredits === "number" && updates.stripeCredits < 0)
    updates.stripeCredits = 0;

  if (Object.keys(updates).length === 0) return;
  await db.update(users).set(updates).where(eq(users.id, userId));
};

export const consumeOneCredit = async (userId: string): Promise<boolean> => {
  const rows = await db
    .update(users)
    .set({ stripeCredits: sql<number>`${users.stripeCredits} - 1` })
    .where(and(eq(users.id, userId), gte(users.stripeCredits, 1)))
    .returning({ stripeCredits: users.stripeCredits });
  return rows.length === 1;
};

export const refundOneCredit = async (userId: string): Promise<void> => {
  await db
    .update(users)
    .set({ stripeCredits: sql<number>`${users.stripeCredits} + 1` })
    .where(eq(users.id, userId));
};
