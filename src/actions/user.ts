"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { and, eq, gte, sql } from "drizzle-orm";
import { SessionUser } from "@/types/user.types";
import { auth } from "@/lib/auth";

export const getSessionUser = async (): Promise<SessionUser> => {
  try {
    const session = await auth();

    if (!session?.user) return null;

    if (!session.user.id) {
      throw new Error("Session user id is undefined");
    }

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
  } catch {
    return null;
  }
};

export const updateUserStripeData = async (
  userId: string,
  stripeData: {
    stripeCustomerId?: string;
    stripeCheckoutSessionId?: string;
    stripeCredits?: number;
  },
) => {
  try {
    const updates = Object.fromEntries(
      Object.entries(stripeData).filter(([, v]) => v !== undefined),
    ) as typeof stripeData;
    if (
      typeof updates.stripeCredits === "number" &&
      updates.stripeCredits < 0
    ) {
      updates.stripeCredits = 0;
    }
    if (Object.keys(updates).length === 0) return;
    await db.update(users).set(updates).where(eq(users.id, userId));
  } catch (error) {
    throw error;
  }
};

export async function consumeOneCredit(userId: string): Promise<boolean> {
  const rows = await db
    .update(users)
    .set({ stripeCredits: sql<number>`${users.stripeCredits} - 1` })
    .where(and(eq(users.id, userId), gte(users.stripeCredits, 1)))
    .returning({ stripeCredits: users.stripeCredits });
  return rows.length === 1;
}

export async function refundOneCredit(userId: string): Promise<void> {
  await db
    .update(users)
    .set({ stripeCredits: sql<number>`${users.stripeCredits} + 1` })
    .where(eq(users.id, userId));
}

export async function getUserCredits(): Promise<number> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return 0;
    }

    const userData = await db
      .select({
        stripeCredits: users.stripeCredits,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (userData.length === 0) {
      return 0;
    }

    return userData[0].stripeCredits;
  } catch {
    return 0;
  }
}
