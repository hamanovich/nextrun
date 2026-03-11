import { listPricingProducts, type PricingProduct } from "@/actions/stripe";
import { getSessionUser } from "@/actions/user";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { type SessionUser } from "@/types/user.types";
import { PricingContent } from "../pricing-content";

vi.mock("@/actions/stripe", () => ({
  createPaymentAction: vi.fn(),
  listPricingProducts: vi.fn(),
}));

vi.mock("@/actions/user", () => ({
  getSessionUser: vi.fn(),
}));

vi.mock("../pricing-hero", () => ({
  PricingHero: ({ currentCredits }: { currentCredits?: number }) => (
    <div data-testid="pricing-hero" data-credits={currentCredits}>
      Pricing Hero
    </div>
  ),
}));

vi.mock("../pricing-faq", () => ({
  PricingFaq: () => <div data-testid="pricing-faq">Pricing FAQ</div>,
}));

vi.mock("../pricing-cta", () => ({
  PricingCta: ({ isLoggedIn }: { isLoggedIn?: boolean }) => (
    <div data-testid="pricing-cta" data-logged-in={isLoggedIn}>
      Pricing CTA
    </div>
  ),
}));

describe("PricingContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Mocked Data Setup", () => {
    it("renders with mocked data when isMocked is true", async () => {
      vi.mocked(getSessionUser).mockResolvedValue({
        user: {
          id: "user_123",
          name: "Test User",
          email: "test@example.com",
          image: null,
          stripeCredits: 10,
          stripeCustomerId: null,
          stripeCheckoutSessionId: null,
        },
        userId: "user_123",
      } as SessionUser);

      const { container } = render(await PricingContent({ isMocked: true }));

      expect(container).toBeInTheDocument();
      expect(screen.getByTestId("pricing-hero")).toBeInTheDocument();
      expect(screen.getByTestId("pricing-faq")).toBeInTheDocument();
      expect(screen.getByTestId("pricing-cta")).toBeInTheDocument();
    });

    it("renders with real data when isMocked is false", async () => {
      const mockProducts = [
        {
          id: "price_123",
          amount: 999,
          interval: "month",
          product: {
            name: "Pro Plan",
            credits: 50,
            description: "Professional plan",
            marketing_features: [
              { name: "50 credits per month" },
              { name: "Priority support" },
            ],
          },
        },
      ];

      vi.mocked(getSessionUser).mockResolvedValue({
        user: {
          id: "user_456",
          name: "Test User 2",
          email: "test2@example.com",
          image: null,
          stripeCredits: 5,
          stripeCustomerId: null,
          stripeCheckoutSessionId: null,
        },
        userId: "user_456",
      } as SessionUser);
      vi.mocked(listPricingProducts).mockResolvedValue(
        mockProducts as unknown as PricingProduct[],
      );

      const { container } = render(await PricingContent({ isMocked: false }));

      expect(container).toBeInTheDocument();
      expect(screen.getByTestId("pricing-hero")).toBeInTheDocument();
      expect(screen.getByTestId("pricing-faq")).toBeInTheDocument();
      expect(screen.getByTestId("pricing-cta")).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("renders all main sections", async () => {
      vi.mocked(getSessionUser).mockResolvedValue({
        user: {
          id: "user_789",
          name: "Test User 3",
          email: "test3@example.com",
          image: null,
          stripeCredits: 0,
          stripeCustomerId: null,
          stripeCheckoutSessionId: null,
        },
        userId: "user_789",
      } as SessionUser);
      vi.mocked(listPricingProducts).mockResolvedValue([]);

      render(await PricingContent({ isMocked: false }));

      expect(screen.getByTestId("pricing-hero")).toBeInTheDocument();
      expect(screen.getByTestId("pricing-faq")).toBeInTheDocument();
      expect(screen.getByTestId("pricing-cta")).toBeInTheDocument();
    });

    it("passes correct props to child components", async () => {
      vi.mocked(getSessionUser).mockResolvedValue({
        user: {
          id: "user_101",
          name: "Test User 4",
          email: "test4@example.com",
          image: null,
          stripeCredits: 15,
          stripeCustomerId: null,
          stripeCheckoutSessionId: null,
        },
        userId: "user_101",
      } as SessionUser);
      vi.mocked(listPricingProducts).mockResolvedValue([]);

      render(await PricingContent({ isMocked: false }));

      const hero = screen.getByTestId("pricing-hero");
      expect(hero).toHaveAttribute("data-credits", "15");

      const cta = screen.getByTestId("pricing-cta");
      expect(cta).toHaveAttribute("data-logged-in", "true");
    });
  });

  describe("Pricing Plans Rendering", () => {
    it("renders free tier when no products", async () => {
      vi.mocked(getSessionUser).mockResolvedValue({
        user: {
          id: "user_102",
          name: "Test User 5",
          email: "test5@example.com",
          image: null,
          stripeCredits: 0,
          stripeCustomerId: null,
          stripeCheckoutSessionId: null,
        },
        userId: "user_102",
      } as SessionUser);
      vi.mocked(listPricingProducts).mockResolvedValue([]);

      render(await PricingContent({ isMocked: false }));

      expect(screen.getByText("Starter")).toBeInTheDocument();
      expect(screen.getByText("Free")).toBeInTheDocument();
      expect(
        screen.getByText("Perfect for trying out our features"),
      ).toBeInTheDocument();
    });

    it("renders paid plans when products available", async () => {
      const mockProducts = [
        {
          id: "price_123",
          amount: 999,
          interval: "month",
          product: {
            name: "Pro Plan",
            credits: 50,
            description: "Professional plan",
            marketing_features: [
              { name: "50 credits per month" },
              { name: "Priority support" },
            ],
          },
        },
      ];

      vi.mocked(getSessionUser).mockResolvedValue({
        user: {
          id: "user_103",
          name: "Test User 6",
          email: "test6@example.com",
          image: null,
          stripeCredits: 0,
          stripeCustomerId: null,
          stripeCheckoutSessionId: null,
        },
        userId: "user_103",
      } as SessionUser);
      vi.mocked(listPricingProducts).mockResolvedValue(
        mockProducts as unknown as PricingProduct[],
      );

      render(await PricingContent({ isMocked: false }));

      expect(screen.getByText("Starter")).toBeInTheDocument();
      expect(screen.getByText("Pro Plan")).toBeInTheDocument();
      expect(screen.getByText("$10")).toBeInTheDocument();
      expect(screen.getByText("/month")).toBeInTheDocument();
    });

    it("renders popular badge for first plan", async () => {
      const mockProducts = [
        {
          id: "price_123",
          amount: 999,
          interval: "month",
          product: {
            name: "Pro Plan",
            credits: 50,
            description: "Professional plan",
            marketing_features: [{ name: "50 credits per month" }],
          },
        },
      ];

      vi.mocked(getSessionUser).mockResolvedValue({
        user: {
          id: "user_104",
          name: "Test User 7",
          email: "test7@example.com",
          image: null,
          stripeCredits: 0,
          stripeCustomerId: null,
          stripeCheckoutSessionId: null,
        },
        userId: "user_104",
      } as SessionUser);
      vi.mocked(listPricingProducts).mockResolvedValue(
        mockProducts as unknown as PricingProduct[],
      );

      render(await PricingContent({ isMocked: false }));

      expect(screen.getByText("Most Popular")).toBeInTheDocument();
    });
  });

  describe("Button Rendering", () => {
    it("renders Get Started Free button for Starter plan", async () => {
      vi.mocked(getSessionUser).mockResolvedValue({
        user: {
          id: "user_105",
          name: "Test User 8",
          email: "test8@example.com",
          image: null,
          stripeCredits: 0,
          stripeCustomerId: null,
          stripeCheckoutSessionId: null,
        },
        userId: "user_105",
      } as SessionUser);
      vi.mocked(listPricingProducts).mockResolvedValue([]);

      render(await PricingContent({ isMocked: false }));

      const starterButton = screen.getByRole("link", {
        name: /get started free/i,
      });
      expect(starterButton).toBeInTheDocument();
      expect(starterButton).toHaveAttribute("href", "/");
    });

    it("renders Purchase Credits button for paid plans when logged in", async () => {
      const mockProducts = [
        {
          id: "price_123",
          amount: 999,
          interval: "month",
          product: {
            name: "Pro Plan",
            credits: 50,
            description: "Professional plan",
            marketing_features: [{ name: "50 credits per month" }],
          },
        },
      ];

      vi.mocked(getSessionUser).mockResolvedValue({
        user: {
          id: "user_106",
          name: "Test User 9",
          email: "test9@example.com",
          image: null,
          stripeCredits: 0,
          stripeCustomerId: null,
          stripeCheckoutSessionId: null,
        },
        userId: "user_106",
      } as SessionUser);
      vi.mocked(listPricingProducts).mockResolvedValue(
        mockProducts as unknown as PricingProduct[],
      );

      render(await PricingContent({ isMocked: false }));

      expect(
        screen.getByRole("button", { name: /purchase credits/i }),
      ).toBeInTheDocument();
    });

    it("renders Contact Sales button for plans without productId", async () => {
      const mockProducts = [
        {
          id: null, // No productId
          amount: 999,
          interval: "month",
          product: {
            name: "Custom Plan",
            credits: null,
            description: "Custom plan",
            marketing_features: [{ name: "Custom feature" }],
          },
        },
      ];

      vi.mocked(getSessionUser).mockResolvedValue({
        user: {
          id: "user_107",
          name: "Test User 10",
          email: "test10@example.com",
          image: null,
          stripeCredits: 0,
          stripeCustomerId: null,
          stripeCheckoutSessionId: null,
        },
        userId: "user_107",
      } as SessionUser);
      vi.mocked(listPricingProducts).mockResolvedValue(
        mockProducts as unknown as PricingProduct[],
      );

      render(await PricingContent({ isMocked: false }));

      expect(
        screen.getByRole("button", { name: /contact sales/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Responsive Layout", () => {
    it("applies single column layout when only one plan", async () => {
      vi.mocked(getSessionUser).mockResolvedValue({
        user: { stripeCredits: 0 },
      } as SessionUser);
      vi.mocked(listPricingProducts).mockResolvedValue([]);

      render(await PricingContent({ isMocked: false }));

      const gridContainer = screen
        .getByText("Starter")
        .closest("section")
        ?.querySelector(".flex");
      expect(gridContainer).toHaveClass("flex", "justify-center");
    });

    it("applies grid layout when multiple plans", async () => {
      const mockProducts = [
        {
          id: "price_123",
          amount: 999,
          interval: "month",
          product: {
            name: "Pro Plan",
            credits: 50,
            description: "Professional plan",
            marketing_features: [{ name: "50 credits per month" }],
          },
        },
      ];

      vi.mocked(getSessionUser).mockResolvedValue({
        user: {
          stripeCredits: 0,
          stripeCustomerId: null,
          stripeCheckoutSessionId: null,
        },
      } as SessionUser);
      vi.mocked(listPricingProducts).mockResolvedValue(
        mockProducts as unknown as PricingProduct[],
      );

      render(await PricingContent({ isMocked: false }));

      const gridContainer = screen
        .getByText("Starter")
        .closest("section")
        ?.querySelector(".grid");
      expect(gridContainer).toHaveClass(
        "grid",
        "gap-8",
        "md:gap-4",
        "md:grid-cols-3",
        "lg:gap-12",
      );
    });
  });

  describe("Error Handling", () => {
    it("handles missing product data gracefully", async () => {
      const mockProducts = [
        {
          id: "price_123",
          amount: null,
          interval: null,
          product: null,
        },
      ];

      vi.mocked(getSessionUser).mockResolvedValue({
        user: {
          stripeCredits: 0,
          stripeCustomerId: null,
          stripeCheckoutSessionId: null,
        },
      } as SessionUser);
      vi.mocked(listPricingProducts).mockResolvedValue(
        mockProducts as unknown as PricingProduct[],
      );

      render(await PricingContent({ isMocked: false }));

      expect(screen.getByTestId("pricing-hero")).toBeInTheDocument();
    });

    it("handles empty products array", async () => {
      vi.mocked(getSessionUser).mockResolvedValue({
        user: {
          stripeCredits: 0,
          stripeCustomerId: null,
          stripeCheckoutSessionId: null,
        },
      } as SessionUser);
      vi.mocked(listPricingProducts).mockResolvedValue([]);

      render(await PricingContent({ isMocked: false }));

      expect(screen.getByText("Starter")).toBeInTheDocument();
      expect(screen.getByText("Free")).toBeInTheDocument();
    });
  });
});
