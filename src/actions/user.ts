"use server";

import { headers } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { SessionUser } from "@/types/user.types";
import { auth } from "@/lib/auth";

export const getSessionUser = async (): Promise<SessionUser> => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) return null;

  const [userData] = await db
    .select({
      stripeCredits: sql<number>`coalesce(${users.stripeCredits}, 0)`,
      stripeCustomerId: users.stripeCustomerId,
      stripeCheckoutSessionId: users.stripeCheckoutSessionId,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!userData) return null;

  return {
    user: { ...session.user, ...userData },
    userId: session.user.id,
  };
};

export const getUserCredits = async (): Promise<number> => {
  const sessionUser = await getSessionUser();
  return sessionUser?.user.stripeCredits ?? 0;
};
