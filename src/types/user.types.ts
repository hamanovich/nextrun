import type { Session } from "next-auth";

export type SessionUser = {
  user: Session["user"] & {
    stripeCredits: number;
    stripeCustomerId: string | null;
    stripeCheckoutSessionId: string | null;
  };
  userId: string;
} | null;
