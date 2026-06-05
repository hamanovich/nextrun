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

export const MOCK_TIERS = [
  {
    name: "Pro",
    price: "19",
    period: "one-time",
    credits: 100,
    description: "For shipping your first product",
    features: [
      "100 building credits",
      "All integrations included",
      "Stripe and Telegram bot ready",
      "Email support",
    ],
    popular: true,
    productId: "mock_pro",
  },
  {
    name: "Scale",
    price: "49",
    period: "one-time",
    credits: 300,
    description: "For teams building in production",
    features: [
      "300 building credits",
      "Everything in Pro",
      "Priority support",
      "Early access to new modules",
    ],
    popular: false,
    productId: "mock_scale",
  },
] satisfies PricingTier[];
