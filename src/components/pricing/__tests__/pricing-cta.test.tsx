import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PricingCta } from "../pricing-cta";

describe("PricingCta", () => {
  describe("Content", () => {
    it("renders the heading and description", () => {
      render(<PricingCta />);

      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "Ready to start building?",
      );
      expect(
        screen.getByText(/Clone the template, add your credits/),
      ).toBeInTheDocument();
    });
  });

  describe("Authenticated state", () => {
    it("shows the sign-in button when logged out", () => {
      render(<PricingCta isLoggedIn={false} />);

      expect(
        screen.getByRole("button", { name: /sign in/i }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("link", { name: /get started/i }),
      ).not.toBeInTheDocument();
    });

    it("shows the get-started link to home when logged in", () => {
      render(<PricingCta isLoggedIn={true} />);

      const link = screen.getByRole("link", { name: /get started/i });
      expect(link).toHaveAttribute("href", "/");
      expect(
        screen.queryByRole("button", { name: /sign in/i }),
      ).not.toBeInTheDocument();
    });

    it("defaults to the logged-out state when isLoggedIn is undefined", () => {
      render(<PricingCta />);

      expect(
        screen.getByRole("button", { name: /sign in/i }),
      ).toBeInTheDocument();
    });
  });
});
