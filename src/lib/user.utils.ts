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
  if (credits === 0)
    return {
      status: "empty",
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-950/20",
      border: "border-red-200 dark:border-red-800",
    };
  if (credits < 10)
    return {
      status: "low",
      color: "text-yellow-600",
      bg: "bg-yellow-50 dark:bg-yellow-950/20",
      border: "border-yellow-200 dark:border-yellow-800",
    };
  return {
    status: "good",
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-950/20",
    border: "border-green-200 dark:border-green-800",
  };
};

export const hasStripeData = (
  user: unknown,
): user is {
  stripeCredits: number;
  stripeCustomerId: string | null;
  stripeCheckoutSessionId: string | null;
} => user !== null && typeof user === "object" && "stripeCredits" in user;
