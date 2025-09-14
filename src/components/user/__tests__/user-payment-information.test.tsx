import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  formatUserData,
  getCreditsStatus,
  hasStripeData,
} from "@/lib/user.utils";
import { UserPaymentInformation } from "../user-payment-information";

vi.mock("@/lib/user.utils", () => ({
  formatUserData: vi.fn((data?: string | null, noData = "Not available") =>
    data ? `${data.slice(0, 8)}…${data.slice(-4)}` : noData,
  ),
  getCreditsStatus: vi.fn((credits: number) => {
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
  }),
  hasStripeData: vi.fn(
    (user: unknown) =>
      user !== null && typeof user === "object" && "stripeCredits" in user,
  ),
}));

describe("UserPaymentInformation", () => {
  describe("Conditional Rendering", () => {
    it("renders when user has Stripe data", () => {
      const user = {
        stripeCredits: 50,
        stripeCustomerId: "cus_1234567890",
        stripeCheckoutSessionId: "cs_1234567890",
      };

      vi.mocked(hasStripeData).mockReturnValue(true);

      render(<UserPaymentInformation user={user} />);

      expect(screen.getByText("Payment Information")).toBeInTheDocument();
      expect(
        screen.getByText("Your Stripe account details and credit balance"),
      ).toBeInTheDocument();
    });

    it("does not render when user has no Stripe data", () => {
      const user = {};

      vi.mocked(hasStripeData).mockReturnValue(false);

      const { container } = render(<UserPaymentInformation user={user} />);

      expect(container.firstChild).toBeNull();
    });

    it("does not render when user is null", () => {
      vi.mocked(hasStripeData).mockReturnValue(false);

      const { container } = render(
        <UserPaymentInformation
          user={
            {} as {
              stripeCredits?: number;
              stripeCustomerId?: string | null;
              stripeCheckoutSessionId?: string | null;
            }
          }
        />,
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe("Credits Display", () => {
    it("renders credits with good status", () => {
      const user = {
        stripeCredits: 50,
        stripeCustomerId: "cus_1234567890",
        stripeCheckoutSessionId: "cs_1234567890",
      };

      vi.mocked(hasStripeData).mockReturnValue(true);
      vi.mocked(getCreditsStatus).mockReturnValue({
        status: "good",
        color: "text-green-600",
        bg: "bg-green-50 dark:bg-green-950/20",
        border: "border-green-200 dark:border-green-800",
      });

      render(<UserPaymentInformation user={user} />);

      expect(screen.getByText("Available Credits")).toBeInTheDocument();
      expect(screen.getByText("50")).toBeInTheDocument();
      expect(screen.getByText("Credits available for use")).toBeInTheDocument();
      expect(screen.getByText("Active")).toBeInTheDocument();
    });

    it("renders credits with low status", () => {
      const user = {
        stripeCredits: 5,
        stripeCustomerId: "cus_1234567890",
        stripeCheckoutSessionId: "cs_1234567890",
      };

      vi.mocked(hasStripeData).mockReturnValue(true);
      vi.mocked(getCreditsStatus).mockReturnValue({
        status: "low",
        color: "text-yellow-600",
        bg: "bg-yellow-50 dark:bg-yellow-950/20",
        border: "border-yellow-200 dark:border-yellow-800",
      });

      render(<UserPaymentInformation user={user} />);

      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("Low credit balance")).toBeInTheDocument();
      expect(screen.getByText("Low")).toBeInTheDocument();
    });

    it("renders credits with empty status", () => {
      const user = {
        stripeCredits: 0,
        stripeCustomerId: "cus_1234567890",
        stripeCheckoutSessionId: "cs_1234567890",
      };

      vi.mocked(hasStripeData).mockReturnValue(true);
      vi.mocked(getCreditsStatus).mockReturnValue({
        status: "empty",
        color: "text-red-600",
        bg: "bg-red-50 dark:bg-red-950/20",
        border: "border-red-200 dark:border-red-800",
      });

      render(<UserPaymentInformation user={user} />);

      expect(screen.getByText("0")).toBeInTheDocument();
      expect(screen.getByText("No credits remaining")).toBeInTheDocument();
      expect(screen.getByText("Empty")).toBeInTheDocument();
    });
  });

  describe("Credits Status Styling", () => {
    it("applies correct styling for good status", () => {
      const user = {
        stripeCredits: 50,
        stripeCustomerId: "cus_1234567890",
        stripeCheckoutSessionId: "cs_1234567890",
      };

      vi.mocked(hasStripeData).mockReturnValue(true);
      vi.mocked(getCreditsStatus).mockReturnValue({
        status: "good",
        color: "text-green-600",
        bg: "bg-green-50 dark:bg-green-950/20",
        border: "border-green-200 dark:border-green-800",
      });

      render(<UserPaymentInformation user={user} />);

      const creditsContainer = screen.getByText("50").closest("div");
      expect(creditsContainer).toHaveClass("text-green-600");
    });

    it("applies correct styling for low status", () => {
      const user = {
        stripeCredits: 5,
        stripeCustomerId: "cus_1234567890",
        stripeCheckoutSessionId: "cs_1234567890",
      };

      vi.mocked(hasStripeData).mockReturnValue(true);
      vi.mocked(getCreditsStatus).mockReturnValue({
        status: "low",
        color: "text-yellow-600",
        bg: "bg-yellow-50 dark:bg-yellow-950/20",
        border: "border-yellow-200 dark:border-yellow-800",
      });

      render(<UserPaymentInformation user={user} />);

      const creditsContainer = screen.getByText("5").closest("div");
      expect(creditsContainer).toHaveClass("text-yellow-600");
    });

    it("applies correct styling for empty status", () => {
      const user = {
        stripeCredits: 0,
        stripeCustomerId: "cus_1234567890",
        stripeCheckoutSessionId: "cs_1234567890",
      };

      vi.mocked(hasStripeData).mockReturnValue(true);
      vi.mocked(getCreditsStatus).mockReturnValue({
        status: "empty",
        color: "text-red-600",
        bg: "bg-red-50 dark:bg-red-950/20",
        border: "border-red-200 dark:border-red-800",
      });

      render(<UserPaymentInformation user={user} />);

      const creditsContainer = screen.getByText("0").closest("div");
      expect(creditsContainer).toHaveClass("text-red-600");
    });
  });

  describe("Account Details", () => {
    it("renders customer ID with formatting", () => {
      const user = {
        stripeCredits: 50,
        stripeCustomerId: "cus_1234567890",
        stripeCheckoutSessionId: "cs_1234567890",
      };

      vi.mocked(hasStripeData).mockReturnValue(true);
      vi.mocked(formatUserData).mockImplementation(
        (data, noData = "Not available") => {
          if (data === "cus_1234567890") return "cus_1234…7890";
          if (data === "cs_1234567890") return "cs_1234…7890";
          return noData;
        },
      );

      render(<UserPaymentInformation user={user} />);

      expect(screen.getByText("Customer ID")).toBeInTheDocument();
      expect(screen.getByText("cus_1234…7890")).toBeInTheDocument();
    });

    it("renders last session with formatting", () => {
      const user = {
        stripeCredits: 50,
        stripeCustomerId: "cus_1234567890",
        stripeCheckoutSessionId: "cs_1234567890",
      };

      vi.mocked(hasStripeData).mockReturnValue(true);
      vi.mocked(formatUserData).mockImplementation(
        (data, noData = "Not available") => {
          if (data === "cus_1234567890") return "cus_1234…7890";
          if (data === "cs_1234567890") return "cs_1234…7890";
          return noData;
        },
      );

      render(<UserPaymentInformation user={user} />);

      expect(screen.getByText("Last Session")).toBeInTheDocument();
      expect(screen.getByText("cs_1234…7890")).toBeInTheDocument();
    });

    it("renders fallback text for missing customer ID", () => {
      const user = {
        stripeCredits: 50,
        stripeCustomerId: null,
        stripeCheckoutSessionId: "cs_1234567890",
      };

      vi.mocked(hasStripeData).mockReturnValue(true);
      vi.mocked(formatUserData).mockImplementation(
        (data, noData = "Not available") => {
          if (data === null) return "Not created";
          if (data === "cs_1234567890") return "cs_1234…7890";
          return noData;
        },
      );

      render(<UserPaymentInformation user={user} />);

      expect(screen.getByText("Not created")).toBeInTheDocument();
    });

    it("renders fallback text for missing session ID", () => {
      const user = {
        stripeCredits: 50,
        stripeCustomerId: "cus_1234567890",
        stripeCheckoutSessionId: null,
      };

      vi.mocked(hasStripeData).mockReturnValue(true);
      vi.mocked(formatUserData).mockImplementation(
        (data, noData = "Not available") => {
          if (data === "cus_1234567890") return "cus_1234…7890";
          if (data === null) return "None";
          return noData;
        },
      );

      render(<UserPaymentInformation user={user} />);

      expect(screen.getByText("None")).toBeInTheDocument();
    });
  });

  describe("Buy Credits Button", () => {
    it("renders buy credits button", () => {
      const user = {
        stripeCredits: 50,
        stripeCustomerId: "cus_1234567890",
        stripeCheckoutSessionId: "cs_1234567890",
      };

      vi.mocked(hasStripeData).mockReturnValue(true);

      render(<UserPaymentInformation user={user} />);

      const buyButton = screen.getByRole("link", { name: /buy credits/i });
      expect(buyButton).toBeInTheDocument();
      expect(buyButton).toHaveAttribute("href", "/pricing");
    });

    it("renders buy credits button with correct styling", () => {
      const user = {
        stripeCredits: 50,
        stripeCustomerId: "cus_1234567890",
        stripeCheckoutSessionId: "cs_1234567890",
      };

      vi.mocked(hasStripeData).mockReturnValue(true);

      render(<UserPaymentInformation user={user} />);

      const buyButton = screen.getByRole("link", { name: /buy credits/i });
      expect(buyButton).toHaveClass("flex-1");
    });

    it("renders coins icon in buy credits button", () => {
      const user = {
        stripeCredits: 50,
        stripeCustomerId: "cus_1234567890",
        stripeCheckoutSessionId: "cs_1234567890",
      };

      vi.mocked(hasStripeData).mockReturnValue(true);

      render(<UserPaymentInformation user={user} />);

      const buyButton = screen.getByRole("link", { name: /buy credits/i });
      const coinsIcon = buyButton.querySelector("svg");
      expect(coinsIcon).toBeInTheDocument();
      expect(coinsIcon).toHaveClass("w-4", "h-4", "mr-2");
    });
  });

  describe("Responsive Behavior", () => {
    it("applies responsive grid classes", () => {
      const user = {
        stripeCredits: 50,
        stripeCustomerId: "cus_1234567890",
        stripeCheckoutSessionId: "cs_1234567890",
      };

      vi.mocked(hasStripeData).mockReturnValue(true);

      render(<UserPaymentInformation user={user} />);

      const gridContainer = screen.getByText("Customer ID").closest(".grid");
      expect(gridContainer).toHaveClass(
        "grid",
        "grid-cols-1",
        "sm:grid-cols-2",
        "gap-4",
      );
    });

    it("applies responsive flex classes for button container", () => {
      const user = {
        stripeCredits: 50,
        stripeCustomerId: "cus_1234567890",
        stripeCheckoutSessionId: "cs_1234567890",
      };

      vi.mocked(hasStripeData).mockReturnValue(true);

      render(<UserPaymentInformation user={user} />);

      const buttonContainer = screen
        .getByRole("link", { name: /buy credits/i })
        .closest(".flex");
      expect(buttonContainer).toHaveClass(
        "flex",
        "flex-col",
        "sm:flex-row",
        "gap-3",
      );
    });
  });

  describe("Accessibility", () => {
    it("has proper heading structure", () => {
      const user = {
        stripeCredits: 50,
        stripeCustomerId: "cus_1234567890",
        stripeCheckoutSessionId: "cs_1234567890",
      };

      vi.mocked(hasStripeData).mockReturnValue(true);

      render(<UserPaymentInformation user={user} />);

      const heading = screen.getByRole("heading", { level: 4 });
      expect(heading).toHaveTextContent("Account Details");
    });

    it("has proper card structure", () => {
      const user = {
        stripeCredits: 50,
        stripeCustomerId: "cus_1234567890",
        stripeCheckoutSessionId: "cs_1234567890",
      };

      vi.mocked(hasStripeData).mockReturnValue(true);

      render(<UserPaymentInformation user={user} />);

      const card = screen
        .getByText("Payment Information")
        .closest(".overflow-hidden");
      expect(card).toBeInTheDocument();
    });

    it("has proper labels for form elements", () => {
      const user = {
        stripeCredits: 50,
        stripeCustomerId: "cus_1234567890",
        stripeCheckoutSessionId: "cs_1234567890",
      };

      vi.mocked(hasStripeData).mockReturnValue(true);

      render(<UserPaymentInformation user={user} />);

      expect(screen.getByText("Customer ID")).toBeInTheDocument();
      expect(screen.getByText("Last Session")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles undefined stripe properties", () => {
      const user = {
        stripeCredits: 0,
        stripeCustomerId: undefined,
        stripeCheckoutSessionId: undefined,
      };

      vi.mocked(hasStripeData).mockReturnValue(true);
      vi.mocked(formatUserData).mockReturnValue("Not available");

      render(<UserPaymentInformation user={user} />);

      expect(screen.getAllByText("Not available")).toHaveLength(2);
    });

    it("handles null stripe properties", () => {
      const user = {
        stripeCredits: 0,
        stripeCustomerId: null,
        stripeCheckoutSessionId: null,
      };

      vi.mocked(hasStripeData).mockReturnValue(true);
      vi.mocked(formatUserData).mockReturnValue("Not available");

      render(<UserPaymentInformation user={user} />);

      expect(screen.getAllByText("Not available")).toHaveLength(2);
    });

    it("handles very large credit numbers", () => {
      const user = {
        stripeCredits: 999999,
        stripeCustomerId: "cus_1234567890",
        stripeCheckoutSessionId: "cs_1234567890",
      };

      vi.mocked(hasStripeData).mockReturnValue(true);

      render(<UserPaymentInformation user={user} />);

      expect(screen.getByText("999999")).toBeInTheDocument();
    });

    it("handles negative credit numbers", () => {
      const user = {
        stripeCredits: -5,
        stripeCustomerId: "cus_1234567890",
        stripeCheckoutSessionId: "cs_1234567890",
      };

      vi.mocked(hasStripeData).mockReturnValue(true);

      render(<UserPaymentInformation user={user} />);

      expect(screen.getByText("-5")).toBeInTheDocument();
    });
  });
});
