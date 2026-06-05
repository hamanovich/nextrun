export const getProviderFromEmail = (email?: string | null) => {
  if (!email) return "Unknown";
  if (email.includes("@gmail.com")) return "Google";
  if (email.includes("@outlook.com") || email.includes("@hotmail.com"))
    return "Microsoft";
  if (email.includes("@yahoo.com")) return "Yahoo";
  return "Email";
};

export const formatUserData = (
  data?: string | null,
  noData = "Not available",
) => (data ? `${data.slice(0, 8)}…${data.slice(-4)}` : noData);

export const getCreditsStatus = (credits: number) => {
  const status = credits === 0 ? "empty" : credits < 10 ? "low" : "good";

  return {
    status,
    color: "text-foreground",
    bg: "bg-muted/50",
    border: "border-border",
  };
};

export const hasStripeData = (
  user: unknown,
): user is {
  stripeCredits: number;
  stripeCustomerId: string | null;
  stripeCheckoutSessionId: string | null;
} => user !== null && typeof user === "object" && "stripeCredits" in user;
