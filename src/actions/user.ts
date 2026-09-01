"use server";

import { headers } from "next/headers";
import { unstable_rethrow } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { and, eq, gte, sql } from "drizzle-orm";
import { SessionUser } from "@/types/user.types";
import { auth } from "@/lib/auth";
import { taggerLogger } from "@/lib/logger";

const log = taggerLogger("user-actions");

export const getSessionUser = async (): Promise<SessionUser> => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) return null;

    if (!session.user.id) throw new Error("Session user id is undefined");

    const userData = await db
      .select({
        stripeCredits: sql<number>`coalesce(${users.stripeCredits}, 0)`,
        stripeCustomerId: users.stripeCustomerId,
        stripeCheckoutSessionId: users.stripeCheckoutSessionId,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (userData.length === 0) {
      throw new Error("User not found in database");
    }

    const userWithStripeData = {
      ...session.user,
      stripeCredits: userData[0].stripeCredits,
      stripeCustomerId: userData[0].stripeCustomerId,
      stripeCheckoutSessionId: userData[0].stripeCheckoutSessionId,
    };

    return {
      user: userWithStripeData,
      userId: session.user.id,
    };
  } catch (error) {
    unstable_rethrow(error);
    log.error("Failed to get session user:", error);
    return null;
  }
};

export const updateUserStripeData = async (stripeData: {
  stripeCustomerId?: string;
  stripeCheckoutSessionId?: string;
  stripeCredits?: number;
}) => {
  const sessionUser = await getSessionUser();
  if (!sessionUser) throw new Error("User not authenticated");

  const updates = Object.fromEntries(
    Object.entries(stripeData).filter(([, v]) => v !== undefined),
  ) as typeof stripeData;
  if (typeof updates.stripeCredits === "number" && updates.stripeCredits < 0)
    updates.stripeCredits = 0;

  if (Object.keys(updates).length === 0) return;
  await db.update(users).set(updates).where(eq(users.id, sessionUser.userId));
};

export const consumeOneCredit = async (): Promise<boolean> => {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return false;

  const rows = await db
    .update(users)
    .set({ stripeCredits: sql<number>`${users.stripeCredits} - 1` })
    .where(and(eq(users.id, sessionUser.userId), gte(users.stripeCredits, 1)))
    .returning({ stripeCredits: users.stripeCredits });
  return rows.length === 1;
};

export const refundOneCredit = async (): Promise<void> => {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return;

  await db
    .update(users)
    .set({ stripeCredits: sql<number>`${users.stripeCredits} + 1` })
    .where(eq(users.id, sessionUser.userId));
};

export const getUserCredits = async (): Promise<number> => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) return 0;

    const userData = await db
      .select({
        stripeCredits: users.stripeCredits,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (userData.length === 0) return 0;

    return userData[0].stripeCredits;
  } catch (error) {
    unstable_rethrow(error);
    return 0;
  }
};
