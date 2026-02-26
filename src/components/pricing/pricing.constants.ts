export type PricingPeriod = "month" | "year" | "one-time" | "forever";

export interface PricingTier {
  name: string;
  price: string; // e.g., "Free" or "9.99"
  period: PricingPeriod;
  credits: number | null;
  description: string;
  features: readonly string[];
  popular: boolean;
  productId: string | null;
}

export const FREE_TIER = {
  name: "Starter",
  price: "Free",
  period: "forever",
  credits: 5,
  description: "Perfect for trying out our features",
  features: [
    "5 free credits to start",
    "Essential Next.js components",
    "Basic deployment support",
    "Community support",
  ],
  popular: false,
  productId: null,
} satisfies PricingTier;

export const FREE_TIER_FEATURES = [
  "5 free credits to start",
  "Essential Next.js components",
  "Basic deployment support",
  "Community support",
] as const;
