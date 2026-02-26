import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CallToAction } from "../call-to-action";

describe("CallToAction", () => {
  describe("Default Props Rendering", () => {
    it("renders with default props", () => {
      render(<CallToAction />);

      expect(
        screen.getByText("Ready to Launch Your Next Project?"),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "Join thousands of developers who are accelerating their development journey with NextRun. Get a production-ready template with authentication, payments, and modern UI in seconds.",
        ),
      ).toBeInTheDocument();

      expect(screen.getByText("View Pricing")).toBeInTheDocument();

      const buttonLink = screen.getByRole("link", {
        name: /view pricing/i,
      });
      expect(buttonLink).toHaveAttribute("href", "/pricing");

      const defaultItems = [
        "Next.js 16 + TypeScript",
        "Auth.js Authentication",
        "Stripe Payments Ready",
        "Beautiful UI Components",
        "Tailwind CSS + Shadcn",
      ];

      defaultItems.forEach((item) => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });

    it("renders the section header with correct styling", () => {
      render(<CallToAction />);

      expect(
        screen.getByText("START YOUR DEVELOPMENT JOURNEY"),
      ).toBeInTheDocument();

      const indicator = screen
        .getByText("START YOUR DEVELOPMENT JOURNEY")
        .closest("p");
      expect(indicator).toHaveClass(
        "text-muted-foreground",
        "flex",
        "items-center",
        "gap-3",
        "text-sm",
        "mb-2",
      );
    });

    it("renders the gradient title with correct styling", () => {
      render(<CallToAction />);

      const titleElement = screen.getByText(
        "Ready to Launch Your Next Project?",
      );
      expect(titleElement).toHaveClass(
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

    it("renders ArrowRight icon in button", () => {
      render(<CallToAction />);

      const buttonLink = screen.getByRole("link");
      const arrowIcon = buttonLink.querySelector("svg");
      expect(arrowIcon).toBeInTheDocument();
      expect(arrowIcon).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Custom Props Rendering", () => {
    it("renders with custom title", () => {
      const customTitle = "Custom Title";
      render(<CallToAction title={customTitle} />);

      expect(screen.getByText(customTitle)).toBeInTheDocument();
      expect(
        screen.queryByText("Ready to Launch Your Next Project?"),
      ).not.toBeInTheDocument();
    });

    it("renders with custom description", () => {
      const customDescription = "Custom description text";
      render(<CallToAction description={customDescription} />);

      expect(screen.getByText(customDescription)).toBeInTheDocument();
      expect(
        screen.queryByText(
          "Join thousands of developers who are accelerating their development journey with NextRun. Get a production-ready template with authentication, payments, and modern UI in seconds.",
        ),
      ).not.toBeInTheDocument();
    });

    it("renders with custom button text and URL", () => {
      const customButtonText = "Custom Button";
      const customButtonUrl = "/custom-url";
      render(
        <CallToAction
          buttonText={customButtonText}
          buttonUrl={customButtonUrl}
        />,
      );

      expect(screen.getByText(customButtonText)).toBeInTheDocument();

      const buttonLink = screen.getByRole("link", {
        name: new RegExp(customButtonText, "i"),
      });
      expect(buttonLink).toHaveAttribute("href", customButtonUrl);
    });

    it("renders with custom items list", () => {
      const customItems = ["Custom Item 1", "Custom Item 2", "Custom Item 3"];
      render(<CallToAction items={customItems} />);

      customItems.forEach((item) => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });

      expect(screen.queryByText("AI-Powered Learning")).not.toBeInTheDocument();
    });

    it("renders with empty items array", () => {
      render(<CallToAction items={[]} />);

      const list = screen.getByRole("list");
      expect(list).toBeInTheDocument();
      expect(list.children).toHaveLength(0);
    });

    it("renders with single custom item", () => {
      const singleItem = ["Single Item"];
      render(<CallToAction items={singleItem} />);

      expect(screen.getByText("Single Item")).toBeInTheDocument();
      expect(screen.getByRole("list").children).toHaveLength(1);
    });
  });

  describe("Accessibility Features", () => {
    it("has proper heading structure", () => {
      render(<CallToAction />);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Ready to Launch Your Next Project?");
    });

    it("has accessible button with proper role", () => {
      render(<CallToAction />);

      const button = screen.getByRole("link");
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("href", "/pricing");
    });

    it("has proper list structure", () => {
      render(<CallToAction />);

      const list = screen.getByRole("list");
      expect(list).toBeInTheDocument();

      const listItems = screen.getAllByRole("listitem");
      expect(listItems).toHaveLength(5); // Default 5 items
    });

    it("has proper ARIA attributes for icons", () => {
      render(<CallToAction />);

      const buttonLink = screen.getByRole("link");
      const arrowIcon = buttonLink.querySelector("svg");
      expect(arrowIcon).toHaveAttribute("aria-hidden", "true");
    });

    it("has proper semantic structure", () => {
      render(<CallToAction />);

      const container = screen
        .getByText("Ready to Launch Your Next Project?")
        .closest(".container");
      expect(container).toBeInTheDocument();
    });
  });

  describe("Responsive Behavior", () => {
    it("applies responsive classes correctly", () => {
      render(<CallToAction />);

      const mainContainer = screen
        .getByText("Ready to Launch Your Next Project?")
        .closest(".container");
      expect(mainContainer).toHaveClass("container", "pt-6", "mx-auto");

      const innerContainer = mainContainer?.querySelector(".max-w-5xl");
      expect(innerContainer).toBeInTheDocument();

      const flexContainers = mainContainer?.querySelectorAll(".flex");
      const outerFlexContainer = flexContainers?.[0];
      expect(outerFlexContainer).toHaveClass("flex", "justify-center");

      const contentWrapper = flexContainers?.[1];
      expect(contentWrapper).toHaveClass(
        "flex",
        "flex-col",
        "items-start",
        "justify-between",
        "gap-8",
        "rounded-lg",
        "bg-muted",
        "px-6",
        "py-10",
        "md:flex-row",
        "lg:px-20",
        "lg:py-12",
      );
    });

    it("applies responsive text sizing", () => {
      render(<CallToAction />);

      const titleHeading = screen.getByRole("heading", { level: 2 });
      expect(titleHeading).toHaveClass("text-2xl", "font-bold", "md:text-3xl");

      const description = screen.getByText(
        "Join thousands of developers who are accelerating their development journey with NextRun. Get a production-ready template with authentication, payments, and modern UI in seconds.",
      );
      expect(description).toHaveClass(
        "text-muted-foreground",
        "text-base",
        "lg:text-lg",
      );
    });

    it("applies responsive width classes", () => {
      render(<CallToAction />);

      const leftColumn = screen
        .getByText("Ready to Launch Your Next Project?")
        .closest("div");
      expect(leftColumn).toHaveClass("md:w-1/2");

      const rightColumn = screen.getByRole("list").closest("div");
      expect(rightColumn).toHaveClass("md:w-1/3");
    });
  });

  describe("Button Functionality", () => {
    it("renders button as Link component", () => {
      render(<CallToAction />);

      const buttonLink = screen.getByRole("link");
      expect(buttonLink).toBeInTheDocument();
      expect(buttonLink.tagName).toBe("A");
    });

    it("button has correct size class", () => {
      render(<CallToAction />);

      const buttonLink = screen.getByRole("link");
      expect(buttonLink).toHaveClass("mt-6");
    });

    it("button contains both text and icon", () => {
      render(<CallToAction />);

      const buttonLink = screen.getByRole("link");
      expect(buttonLink).toHaveTextContent("View Pricing");

      const arrowIcon = buttonLink.querySelector("svg");
      expect(arrowIcon).toBeInTheDocument();
    });
  });

  describe("List Items Rendering", () => {
    it("renders each item with Check icon", () => {
      render(<CallToAction />);

      const listItems = screen.getAllByRole("listitem");

      listItems.forEach((item) => {
        const checkIcon = item.querySelector("svg");
        expect(checkIcon).toBeInTheDocument();
        expect(item).toHaveClass("flex", "items-center");
      });
    });

    it("applies correct classes to list items", () => {
      render(<CallToAction />);

      const list = screen.getByRole("list");
      expect(list).toHaveClass(
        "flex",
        "flex-col",
        "space-y-2",
        "text-sm",
        "font-medium",
      );

      const listItems = screen.getAllByRole("listitem");
      listItems.forEach((item) => {
        expect(item).toHaveClass("flex", "items-center");
      });
    });

    it("renders items with proper key attributes", () => {
      const customItems = ["Item 1", "Item 2", "Item 3"];
      render(<CallToAction items={customItems} />);

      const listItems = screen.getAllByRole("listitem");
      expect(listItems).toHaveLength(3);

      customItems.forEach((item) => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles undefined props gracefully", () => {
      render(<CallToAction title={undefined} description={undefined} />);

      expect(
        screen.getByText("Ready to Launch Your Next Project?"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Join thousands of developers who are accelerating their development journey with NextRun. Get a production-ready template with authentication, payments, and modern UI in seconds.",
        ),
      ).toBeInTheDocument();
    });

    it("handles null items array", () => {
      expect(() => {
        render(<CallToAction items={null as unknown as string[]} />);
      }).toThrow();
    });

    it("handles very long text content", () => {
      const longTitle = "A".repeat(1000);
      const longDescription = "B".repeat(2000);
      const longItems = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);

      render(
        <CallToAction
          title={longTitle}
          description={longDescription}
          items={longItems}
        />,
      );

      expect(screen.getByText(longTitle)).toBeInTheDocument();
      expect(screen.getByText(longDescription)).toBeInTheDocument();
      expect(screen.getAllByRole("listitem")).toHaveLength(50);
    });
  });
});
