import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PricingHero } from "../pricing-hero";

describe("PricingHero", () => {
  describe("Default Rendering", () => {
    it("renders with default props", () => {
      render(<PricingHero />);

      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
      expect(screen.getByText("PRICING")).toBeInTheDocument();
      expect(screen.getByText("Choose Your")).toBeInTheDocument();
      expect(screen.getByText("Learning Journey")).toBeInTheDocument();
    });

    it("renders the pricing badge with correct styling", () => {
      render(<PricingHero />);

      const badge = screen.getByText("PRICING");
      const badgeContainer = badge.closest("p");
      expect(badgeContainer).toHaveClass(
        "text-muted-foreground",
        "mb-2",
        "flex",
        "items-center",
        "justify-center",
        "gap-3",
        "text-sm",
      );

      const indicator = badgeContainer?.querySelector("span");
      expect(indicator).toHaveClass(
        "inline-block",
        "size-2",
        "rounded",
        "bg-orange-500",
      );
    });

    it("renders the main heading with gradient styling", () => {
      render(<PricingHero />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveClass(
        "mb-6",
        "text-4xl",
        "font-semibold",
        "tracking-tighter",
        "md:text-5xl",
        "lg:text-6xl",
      );

      const gradientSpan = screen.getByText("Learning Journey");
      expect(gradientSpan).toHaveClass(
        "text-transparent",
        "bg-gradient-to-br",
        "bg-clip-text",
        "from-teal-500",
        "via-indigo-500",
        "to-sky-500",
        "dark:from-teal-200",
        "dark:via-indigo-300",
        "dark:to-sky-500",
      );
    });

    it("renders the description text", () => {
      render(<PricingHero />);

      const description = screen.getByText(
        "Start free and scale as you grow. Our credit-based system gives you complete control over your language learning investment.",
      );
      expect(description).toHaveClass(
        "text-muted-foreground",
        "mx-auto",
        "max-w-2xl",
        "text-lg",
        "leading-relaxed",
      );
    });

    it("does not render credits section when currentCredits is undefined", () => {
      render(<PricingHero />);

      expect(screen.queryByText(/Current Credits:/)).not.toBeInTheDocument();
      expect(
        screen.queryByRole("img", { hidden: true }),
      ).not.toBeInTheDocument();
    });
  });

  describe("With Credits Display", () => {
    it("renders credits section when currentCredits is provided", () => {
      render(<PricingHero currentCredits={42} />);

      expect(screen.getByText("Current Credits: 42")).toBeInTheDocument();
    });

    it("renders credits section with zero credits", () => {
      render(<PricingHero currentCredits={0} />);

      expect(screen.getByText("Current Credits: 0")).toBeInTheDocument();
    });

    it("renders credits section with correct styling", () => {
      render(<PricingHero currentCredits={15} />);

      const creditsContainer = screen
        .getByText("Current Credits: 15")
        .closest("div");
      expect(creditsContainer).toHaveClass(
        "mt-8",
        "inline-flex",
        "items-center",
        "gap-2",
        "bg-blue-50",
        "text-blue-700",
        "px-6",
        "py-3",
        "rounded-lg",
      );
    });

    it("renders CreditCard icon in credits section", () => {
      render(<PricingHero currentCredits={10} />);

      const creditsContainer = screen
        .getByText("Current Credits: 10")
        .closest("div");
      const creditCardIcon = creditsContainer?.querySelector("svg");
      expect(creditCardIcon).toBeInTheDocument();
      expect(creditCardIcon).toHaveClass("w-5", "h-5");
    });

    it("renders credits text with correct styling", () => {
      render(<PricingHero currentCredits={25} />);

      const creditsText = screen.getByText("Current Credits: 25");
      expect(creditsText).toHaveClass("font-medium", "text-lg");
    });
  });

  describe("Responsive Behavior", () => {
    it("applies responsive classes correctly", () => {
      render(<PricingHero />);

      const section = screen
        .getByRole("heading", { level: 1 })
        .closest("section");
      expect(section).toHaveClass(
        "py-6",
        "md:py-12",
        "bg-gradient-to-b",
        "from-background",
        "to-muted/50",
      );

      const container = section?.querySelector(".container");
      expect(container).toHaveClass("container", "mx-auto", "px-4");

      const contentWrapper = container?.querySelector(".mx-auto");
      expect(contentWrapper).toHaveClass("mx-auto", "max-w-4xl", "text-center");
    });

    it("applies responsive text sizing to heading", () => {
      render(<PricingHero />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveClass("text-4xl", "md:text-5xl", "lg:text-6xl");
    });
  });

  describe("Accessibility", () => {
    it("has proper heading structure", () => {
      render(<PricingHero />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Choose Your Learning Journey");
    });

    it("has proper semantic structure", () => {
      render(<PricingHero />);

      const section = screen
        .getByRole("heading", { level: 1 })
        .closest("section");
      expect(section).toBeInTheDocument();
    });

    it("has accessible icon with proper attributes", () => {
      render(<PricingHero currentCredits={5} />);

      const creditsContainer = screen
        .getByText("Current Credits: 5")
        .closest("div");
      const creditCardIcon = creditsContainer?.querySelector("svg");
      expect(creditCardIcon).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Edge Cases", () => {
    it("handles very large credit numbers", () => {
      render(<PricingHero currentCredits={999999} />);

      expect(screen.getByText("Current Credits: 999999")).toBeInTheDocument();
    });

    it("handles negative credit numbers", () => {
      render(<PricingHero currentCredits={-5} />);

      expect(screen.getByText("Current Credits: -5")).toBeInTheDocument();
    });

    it("handles undefined currentCredits gracefully", () => {
      render(<PricingHero currentCredits={undefined} />);

      expect(screen.queryByText(/Current Credits:/)).not.toBeInTheDocument();
    });
  });
});
