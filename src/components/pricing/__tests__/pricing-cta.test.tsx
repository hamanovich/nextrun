import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PricingCta } from "../pricing-cta";

describe("PricingCta", () => {
  describe("Default Rendering", () => {
    it("renders with default props", () => {
      render(<PricingCta />);

      expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
      expect(screen.getByText("Ready to Start Building?")).toBeInTheDocument();
      expect(
        screen.getByText(
          /Join hundreds of developers who are already accelerating their progress with NextRun/,
        ),
      ).toBeInTheDocument();
    });

    it("renders when not logged in", () => {
      render(<PricingCta isLoggedIn={false} />);

      expect(
        screen.getByRole("button", { name: /sign in/i }),
      ).toBeInTheDocument();
      expect(screen.queryByText("Get Started Now")).not.toBeInTheDocument();
    });

    it("renders when logged in", () => {
      render(<PricingCta isLoggedIn={true} />);

      expect(screen.getByText("Get Started Now")).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /sign in/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe("Content Structure", () => {
    it("renders the main heading with correct styling", () => {
      render(<PricingCta />);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveClass("text-3xl", "font-bold", "mb-4");
      expect(heading).toHaveTextContent("Ready to Start Building?");
    });

    it("renders the description with correct styling", () => {
      render(<PricingCta />);

      const description = screen.getByText(
        /Join hundreds of developers who are already accelerating their progress with NextRun/,
      );
      expect(description).toHaveClass(
        "text-xl",
        "mb-8",
        "opacity-90",
        "max-w-2xl",
        "mx-auto",
      );
    });

    it("renders the section with correct structure", () => {
      render(<PricingCta />);

      const section = screen
        .getByRole("heading", { level: 2 })
        .closest("section");
      expect(section).toHaveClass("pb-12");

      const container = section?.querySelector(".container");
      expect(container).toHaveClass("container", "mx-auto", "px-4");
    });
  });

  describe("Card Styling", () => {
    it("renders card with primary styling", () => {
      render(<PricingCta />);

      const card = screen
        .getByRole("heading", { level: 2 })
        .closest(".bg-primary");
      expect(card).toHaveClass("bg-primary", "text-primary-foreground");
    });

    it("renders card content with correct padding", () => {
      render(<PricingCta />);

      const cardContent = screen
        .getByRole("heading", { level: 2 })
        .closest(".p-6");
      expect(cardContent).toHaveClass("p-6", "text-center");
    });
  });

  describe("Button Rendering - Logged In", () => {
    it("renders Get Started button when logged in", () => {
      render(<PricingCta isLoggedIn={true} />);

      const button = screen.getByRole("link", { name: /get started now/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("href", "/");
    });

    it("renders button with correct styling when logged in", () => {
      render(<PricingCta isLoggedIn={true} />);

      const button = screen.getByRole("link", { name: /get started now/i });
      expect(button).toHaveClass("text-primary");
    });

    it("renders ArrowRight icon in button when logged in", () => {
      render(<PricingCta isLoggedIn={true} />);

      const button = screen.getByRole("link", { name: /get started now/i });
      const arrowIcon = button.querySelector("svg");
      expect(arrowIcon).toBeInTheDocument();
      expect(arrowIcon).toHaveClass("ml-2", "w-4", "h-4");
    });
  });

  describe("Responsive Behavior", () => {
    it("applies responsive button container classes", () => {
      render(<PricingCta />);

      const buttonContainer = screen
        .getByRole("heading", { level: 2 })
        .closest("section")
        ?.querySelector(".flex.flex-col.sm\\:flex-row");
      expect(buttonContainer).toHaveClass(
        "flex",
        "flex-col",
        "sm:flex-row",
        "gap-4",
        "justify-center",
      );
    });
  });

  describe("Accessibility", () => {
    it("has proper heading structure", () => {
      render(<PricingCta />);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Ready to Start Building?");
    });

    it("has accessible button when logged in", () => {
      render(<PricingCta isLoggedIn={true} />);

      const button = screen.getByRole("link");
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("href", "/");
    });

    it("has proper semantic structure", () => {
      render(<PricingCta />);

      const section = screen
        .getByRole("heading", { level: 2 })
        .closest("section");
      expect(section).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles undefined isLoggedIn prop", () => {
      render(<PricingCta isLoggedIn={undefined} />);

      expect(
        screen.getByRole("button", { name: /sign in/i }),
      ).toBeInTheDocument();
      expect(screen.queryByText("Get Started Now")).not.toBeInTheDocument();
    });

    it("handles null isLoggedIn prop", () => {
      render(<PricingCta isLoggedIn={false} />);

      expect(
        screen.getByRole("button", { name: /sign in/i }),
      ).toBeInTheDocument();
      expect(screen.queryByText("Get Started Now")).not.toBeInTheDocument();
    });
  });
});
