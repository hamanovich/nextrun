import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PricingHero } from "../pricing-hero";

describe("PricingHero", () => {
  describe("Default Rendering", () => {
    it("renders the heading and description", () => {
      render(<PricingHero />);

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Simple, credit-based pricing",
      );
      expect(
        screen.getByText(/Start free and scale as you grow/),
      ).toBeInTheDocument();
    });

    it("does not render the credits chip when currentCredits is undefined", () => {
      render(<PricingHero />);

      expect(screen.queryByText(/credits available/)).not.toBeInTheDocument();
    });
  });

  describe("With Credits Display", () => {
    it("renders the credits chip when currentCredits is provided", () => {
      render(<PricingHero currentCredits={42} />);

      expect(screen.getByText(/42 credits available/)).toBeInTheDocument();
    });

    it("renders the credits chip with zero credits", () => {
      render(<PricingHero currentCredits={0} />);

      expect(screen.getByText(/0 credits available/)).toBeInTheDocument();
    });

    it("formats large credit numbers", () => {
      render(<PricingHero currentCredits={999999} />);

      expect(screen.getByText(/999,999 credits available/)).toBeInTheDocument();
    });

    it("renders an accessible (hidden) icon in the credits chip", () => {
      render(<PricingHero currentCredits={5} />);

      const chip = screen.getByText(/5 credits available/).closest("div");
      const icon = chip?.querySelector("svg");
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Accessibility", () => {
    it("exposes a single level-1 heading", () => {
      render(<PricingHero />);

      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });
  });
});
