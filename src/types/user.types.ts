export type SessionUser = {
  user: {
    id: string;
    name?: string | null;
    email: string;
    image?: string | null;
    emailVerified?: boolean;
    stripeCredits: number;
    stripeCustomerId: string | null;
    stripeCheckoutSessionId: string | null;
  };
  userId: string;
} | null;
