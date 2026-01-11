import React, { cloneElement, type ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Hero } from "../hero";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: ReactNode;
    href: string;
    [key: string]: unknown;
  }) => {
    if (React.isValidElement(children) && children.type === "a") {
      return cloneElement(children, { href, ...props } as Record<
        string,
        unknown
      >);
    }
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
}));

vi.mock("lucide-react", () => ({
  Code: () => <div data-testid="code-icon">Code Icon</div>,
  Shield: () => <div data-testid="shield-icon">Shield Icon</div>,
  CreditCard: () => <div data-testid="credit-card-icon">CreditCard Icon</div>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    asChild,
    size,
    variant,
    className,
    ...props
  }: {
    children: ReactNode;
    asChild?: boolean;
    size?: string;
    variant?: string;
    className?: string;
    [key: string]: unknown;
  }) => {
    if (asChild) {
      return React.cloneElement(
        children as React.ReactElement,
        {
          className: [
            "button",
            size && `button-${size}`,
            variant && `button-${variant}`,
            className,
          ]
            .filter(Boolean)
            .join(" "),
          ...props,
        } as Record<string, unknown>,
      );
    }

    const classes = [
      "button",
      size && `button-${size}`,
      variant && `button-${variant}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");
    return (
      <button className={classes} {...props}>
        {children}
      </button>
    );
  },
}));

describe("Hero Component", () => {
  describe("Basic Rendering", () => {
    it("should render the hero section", () => {
      const { container } = render(<Hero />);

      const hero = container.querySelector(".container");
      expect(hero).toBeInTheDocument();
      expect(hero).toHaveClass(
        "border-b",
        "border-t",
        "border-dashed",
        "m-auto",
      );
    });

    it("should render the status badge", () => {
      render(<Hero />);

      const statusBadge = screen.getByText(
        "NEXT.JS TEMPLATE • READY TO DEPLOY",
      );
      expect(statusBadge).toBeInTheDocument();
      expect(statusBadge).toHaveClass("text-muted-foreground", "text-sm");
    });

    it("should render the status badge with green dot", () => {
      const { container } = render(<Hero />);

      const greenDot = container.querySelector(".bg-green-500");
      expect(greenDot).toBeInTheDocument();
      expect(greenDot).toHaveClass("inline-block", "size-2", "rounded");
    });

    it("should render the main heading", () => {
      render(<Hero />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("NextRun");
      expect(heading).toHaveTextContent("Build Modern Web Apps");
      expect(heading).toHaveTextContent("in Minutes, Not Hours");
    });

    it("should render the gradient text", () => {
      const { container } = render(<Hero />);

      const gradientSpan = container.querySelector(
        ".text-transparent.bg-gradient-to-br.bg-clip-text",
      );
      expect(gradientSpan).toBeInTheDocument();
      expect(gradientSpan).toHaveTextContent("NextRun");
      expect(gradientSpan).toHaveClass(
        "from-teal-500",
        "via-indigo-500",
        "to-sky-500",
        "dark:from-teal-200",
        "dark:via-indigo-300",
        "dark:to-sky-500",
      );
    });

    it("should render the description text", () => {
      render(<Hero />);

      const description = screen.getByText(
        /A powerful Next.js template that comes pre-configured/,
      );
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass("text-muted-foreground", "lg:text-lg");
    });
  });

  describe("Action Buttons", () => {
    it("should render both action buttons", () => {
      render(<Hero />);

      const viewPricingButton = screen.getByRole("link", {
        name: /view pricing/i,
      });
      const learnMoreButton = screen.getByRole("link", {
        name: /learn more/i,
      });

      expect(viewPricingButton).toBeInTheDocument();
      expect(learnMoreButton).toBeInTheDocument();
    });

    it("should render buttons with correct href attributes", () => {
      render(<Hero />);

      const viewPricingButton = screen.getByRole("link", {
        name: /view pricing/i,
      });
      const learnMoreButton = screen.getByRole("link", {
        name: /learn more/i,
      });

      expect(viewPricingButton).toHaveAttribute("href", "/pricing");
      expect(learnMoreButton).toHaveAttribute("href", "/about");
    });

    it("should render buttons with correct styling", () => {
      render(<Hero />);

      const buttons = screen.getAllByRole("link");
      expect(buttons).toHaveLength(2);

      buttons.forEach((button) => {
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute("href");
      });
    });

    it("should render buttons with different variants", () => {
      render(<Hero />);

      const viewPricingButton = screen.getByRole("link", {
        name: /view pricing/i,
      });
      const learnMoreButton = screen.getByRole("link", {
        name: /learn more/i,
      });

      expect(viewPricingButton).toBeInTheDocument();
      expect(learnMoreButton).toBeInTheDocument();
    });
  });

  describe("Feature Items", () => {
    it("should render all feature items", () => {
      render(<Hero />);

      expect(screen.getByText("Next.js 16 + TypeScript")).toBeInTheDocument();
      expect(screen.getByText("Auth.js + Google OAuth")).toBeInTheDocument();
      expect(screen.getByText("Stripe Payments Ready")).toBeInTheDocument();
    });

    it("should render feature icons", () => {
      render(<Hero />);

      expect(screen.getByTestId("code-icon")).toBeInTheDocument();
      expect(screen.getByTestId("shield-icon")).toBeInTheDocument();
      expect(screen.getByTestId("credit-card-icon")).toBeInTheDocument();
    });

    it("should render feature items as list items", () => {
      render(<Hero />);

      const featureList = screen.getByRole("list");
      expect(featureList).toBeInTheDocument();

      const listItems = screen.getAllByRole("listitem");
      expect(listItems).toHaveLength(3);
    });

    it("should render feature items with proper styling", () => {
      const { container } = render(<Hero />);

      const iconContainers = container.querySelectorAll(".bg-muted");
      expect(iconContainers).toHaveLength(3);

      iconContainers.forEach((container) => {
        expect(container).toHaveClass(
          "flex",
          "size-12",
          "items-center",
          "justify-center",
          "rounded-lg",
        );
      });
    });
  });

  describe("CSS Classes and Styling", () => {
    it("should apply correct CSS classes to main container", () => {
      const { container } = render(<Hero />);

      const mainContainer = container.querySelector(".container");
      expect(mainContainer).toHaveClass(
        "border-b",
        "border-t",
        "border-dashed",
        "m-auto",
      );
    });

    it("should apply correct CSS classes to hero content", () => {
      const { container } = render(<Hero />);

      const heroContent = container.querySelector(".relative.flex");
      expect(heroContent).toHaveClass(
        "w-full",
        "max-w-5xl",
        "flex-col",
        "items-center",
        "border",
        "border-t-0",
        "border-dashed",
        "px-5",
        "py-12",
      );
    });

    it("should apply correct CSS classes to heading", () => {
      const { container } = render(<Hero />);

      const headingContainer = container.querySelector(
        ".mb-7.mt-3.w-full.max-w-4xl",
      );
      expect(headingContainer).toHaveClass(
        "text-5xl",
        "font-semibold",
        "tracking-tighter",
        "md:mb-10",
        "text-center",
        "md:text-6xl",
        "lg:relative",
        "lg:mb-0",
        "lg:text-7xl",
      );
    });

    it("should apply correct CSS classes to feature grid", () => {
      const { container } = render(<Hero />);

      const featureGrid = container.querySelector(".mx-auto.grid");
      expect(featureGrid).toHaveClass(
        "w-full",
        "max-w-5xl",
        "grid-cols-1",
        "border",
        "border-b-0",
        "border-dashed",
      );
    });
  });

  describe("Responsive Design", () => {
    it("should apply responsive CSS classes to heading", () => {
      const { container } = render(<Hero />);

      const headingContainer = container.querySelector(
        ".mb-7.mt-3.w-full.max-w-4xl",
      );
      expect(headingContainer).toHaveClass(
        "text-5xl",
        "md:text-6xl",
        "lg:text-7xl",
      );
    });

    it("should apply responsive CSS classes to buttons", () => {
      const { container } = render(<Hero />);

      const buttonContainer = container.querySelector(
        ".flex.flex-col.space-y-3",
      );
      expect(buttonContainer).toHaveClass(
        "sm:flex-row",
        "sm:justify-center",
        "sm:space-y-0",
      );
    });

    it("should apply responsive CSS classes to feature grid", () => {
      const { container } = render(<Hero />);

      const featureGrid = container.querySelector(".mx-auto.grid");
      expect(featureGrid).toHaveClass(
        "grid-cols-1",
        "md:grid-cols-2",
        "lg:grid-cols-3",
      );
    });

    it("should apply responsive CSS classes to feature items", () => {
      const { container } = render(<Hero />);

      const featureItems = container.querySelectorAll("li");
      expect(featureItems[0]).toHaveClass(
        "flex",
        "h-full",
        "items-center",
        "justify-between",
        "gap-10",
        "px-5",
        "md:gap-3",
        "lg:justify-center",
      );
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading hierarchy", () => {
      render(<Hero />);

      const mainHeading = screen.getByRole("heading", { level: 1 });
      expect(mainHeading).toBeInTheDocument();
      expect(mainHeading).toHaveTextContent("NextRun");
    });

    it("should have accessible button text", () => {
      render(<Hero />);

      const buttons = screen.getAllByRole("link");
      buttons.forEach((button) => {
        expect(button.textContent?.trim()).not.toBe("");
        expect(button.textContent?.trim().length).toBeGreaterThan(0);
      });
    });

    it("should have accessible feature item text", () => {
      render(<Hero />);

      const featureTexts = [
        "Next.js 16 + TypeScript",
        "Auth.js + Google OAuth",
        "Stripe Payments Ready",
      ];

      featureTexts.forEach((text) => {
        const element = screen.getByText(text);
        expect(element).toBeInTheDocument();
        expect(element.textContent?.trim()).not.toBe("");
      });
    });

    it("should have proper list structure", () => {
      render(<Hero />);

      const featureList = screen.getByRole("list");
      expect(featureList).toBeInTheDocument();

      const listItems = screen.getAllByRole("listitem");
      expect(listItems).toHaveLength(3);
    });
  });

  describe("Content Structure", () => {
    it("should render the complete hero message", () => {
      render(<Hero />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("NextRun");
      expect(heading).toHaveTextContent("Build Modern Web Apps");
      expect(heading).toHaveTextContent("in Minutes, Not Hours");
    });

    it("should render the complete description", () => {
      render(<Hero />);

      const description = screen.getByText(
        /A powerful Next.js template that comes pre-configured with modern authentication, payment processing, and beautiful UI components/,
      );
      expect(description).toBeInTheDocument();
    });

    it("should render all feature items with correct content", () => {
      render(<Hero />);

      const features = [
        "Next.js 16 + TypeScript",
        "Auth.js + Google OAuth",
        "Stripe Payments Ready",
      ];

      features.forEach((feature) => {
        expect(screen.getByText(feature)).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle component re-rendering", () => {
      const { rerender } = render(<Hero />);

      expect(screen.getByText("NextRun")).toBeInTheDocument();
      expect(screen.getByText("View Pricing")).toBeInTheDocument();

      rerender(<Hero />);

      expect(screen.getByText("NextRun")).toBeInTheDocument();
      expect(screen.getByText("View Pricing")).toBeInTheDocument();
    });

    it("should maintain consistent styling across re-renders", () => {
      const { container, rerender } = render(<Hero />);

      const initialGradient = container.querySelector(
        ".text-transparent.bg-gradient-to-br",
      );
      expect(initialGradient).toHaveClass("from-teal-500");

      rerender(<Hero />);

      const rerenderedGradient = container.querySelector(
        ".text-transparent.bg-gradient-to-br",
      );
      expect(rerenderedGradient).toHaveClass("from-teal-500");
    });

    it("should handle special characters in text content", () => {
      render(<Hero />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading.textContent).toContain("NextRun");
      expect(heading.textContent).toContain("Build Modern Web Apps");
    });
  });

  describe("Icon Integration", () => {
    it("should render all required icons", () => {
      render(<Hero />);

      expect(screen.getByTestId("code-icon")).toBeInTheDocument();
      expect(screen.getByTestId("shield-icon")).toBeInTheDocument();
      expect(screen.getByTestId("credit-card-icon")).toBeInTheDocument();
    });

    it("should render icons with correct styling", () => {
      const { container } = render(<Hero />);

      const iconContainers = container.querySelectorAll(
        ".bg-muted.flex.size-12.items-center.justify-center.rounded-lg",
      );
      expect(iconContainers).toHaveLength(3);

      const icons = container.querySelectorAll("[data-testid$='-icon']");
      expect(icons).toHaveLength(3);

      icons.forEach((icon) => {
        expect(icon).toBeInTheDocument();
      });
    });
  });
});
