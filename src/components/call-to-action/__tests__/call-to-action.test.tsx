import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CallToAction } from "../call-to-action";

describe("CallToAction", () => {
  describe("Default props", () => {
    it("renders the default heading, description and CTA", () => {
      render(<CallToAction />);

      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "Ready to launch your next project?",
      );
      expect(screen.getByText(/Clone the template/)).toBeInTheDocument();

      const cta = screen.getByRole("link", { name: /get started/i });
      expect(cta).toHaveAttribute("href", "/pricing");
    });

    it("renders the default checklist", () => {
      render(<CallToAction />);

      [
        "Next.js 16 + TypeScript",
        "Better Auth",
        "Stripe Payments",
        "shadcn/ui components",
        "Tailwind CSS v4",
      ].forEach((item) => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
      expect(screen.getAllByRole("listitem")).toHaveLength(5);
    });
  });

  describe("Custom props", () => {
    it("renders a custom title and description", () => {
      render(
        <CallToAction title="Custom Title" description="Custom description" />,
      );

      expect(screen.getByText("Custom Title")).toBeInTheDocument();
      expect(screen.getByText("Custom description")).toBeInTheDocument();
      expect(
        screen.queryByText("Ready to launch your next project?"),
      ).not.toBeInTheDocument();
    });

    it("renders a custom button text and url", () => {
      render(
        <CallToAction buttonText="Buy credits" buttonUrl="/pricing#buy" />,
      );

      const link = screen.getByRole("link", { name: /buy credits/i });
      expect(link).toHaveAttribute("href", "/pricing#buy");
    });

    it("renders a custom items list", () => {
      render(<CallToAction items={["Item A", "Item B", "Item C"]} />);

      expect(screen.getAllByRole("listitem")).toHaveLength(3);
      expect(screen.getByText("Item A")).toBeInTheDocument();
    });

    it("renders an empty list when items is empty", () => {
      render(<CallToAction items={[]} />);

      expect(screen.getByRole("list").children).toHaveLength(0);
    });
  });

  describe("Accessibility", () => {
    it("hides the arrow icon from assistive technology", () => {
      render(<CallToAction />);

      const icon = screen
        .getByRole("link", { name: /get started/i })
        .querySelector("svg");
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });
  });
});
