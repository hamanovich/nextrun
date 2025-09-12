import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Faq } from "../faq";
import {
  customProps,
  emptyFaqs,
  faqsWithReactNode,
  longFaqs,
  mockFaqs,
  reactNodeProps,
  specialFaqs,
} from "./faq.mock";

vi.mock("@/lib/sanitize", () => ({
  sanitizeJsonLd: vi.fn((data) => JSON.stringify(data)),
}));

describe("Faq Component", () => {
  describe("Default Props", () => {
    it("should render with default props when no props are provided", () => {
      render(<Faq />);

      expect(screen.getByText("FAQ")).toBeInTheDocument();
      expect(
        screen.getByText("Frequently Asked Questions"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Find answers to common questions."),
      ).toBeInTheDocument();
    });

    it("should render with default props when empty faqs array is provided", () => {
      render(<Faq faqs={[]} />);

      expect(screen.getByText("FAQ")).toBeInTheDocument();
      expect(
        screen.getByText("Frequently Asked Questions"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Find answers to common questions."),
      ).toBeInTheDocument();
    });
  });

  describe("Custom Props", () => {
    it("should render with custom badge, heading, and description", () => {
      render(<Faq {...customProps} />);

      expect(screen.getByText("Help Center")).toBeInTheDocument();
      expect(screen.getByText("Need Help?")).toBeInTheDocument();
      expect(
        screen.getByText("Get answers to your questions here."),
      ).toBeInTheDocument();
    });

    it("should render with ReactNode props", () => {
      render(<Faq {...reactNodeProps} />);

      expect(screen.getByTestId("custom-badge")).toBeInTheDocument();
      expect(screen.getByTestId("custom-heading")).toBeInTheDocument();
      expect(screen.getByTestId("custom-description")).toBeInTheDocument();
    });
  });

  describe("FAQ Items Rendering", () => {
    it("should render FAQ items with proper numbering", () => {
      render(<Faq faqs={mockFaqs} />);

      expect(screen.getByText("What is NextRun?")).toBeInTheDocument();
      expect(screen.getByText("How do I get started?")).toBeInTheDocument();
      expect(screen.getByText("Is it free to use?")).toBeInTheDocument();

      expect(
        screen.getByText(
          "NextRun is a platform for running applications efficiently.",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "You can get started by creating an account and following our setup guide.",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "We offer both free and premium plans to suit different needs.",
        ),
      ).toBeInTheDocument();

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("should render FAQ items with ReactNode answers", () => {
      render(<Faq faqs={faqsWithReactNode} />);

      expect(screen.getByText("What is NextRun?")).toBeInTheDocument();
      expect(
        screen.getByText(
          "NextRun is a platform for running applications efficiently.",
        ),
      ).toBeInTheDocument();
      expect(screen.getByText("Learn more")).toBeInTheDocument();
    });

    it("should handle empty FAQ list gracefully", () => {
      render(<Faq faqs={[]} />);

      expect(screen.getByText("FAQ")).toBeInTheDocument();
      expect(
        screen.getByText("Frequently Asked Questions"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Find answers to common questions."),
      ).toBeInTheDocument();

      expect(screen.queryByText("1")).not.toBeInTheDocument();
    });
  });

  describe("Structured Data (JSON-LD)", () => {
    it("should generate and render structured data script", () => {
      const { container } = render(<Faq faqs={mockFaqs} />);

      const scriptElement = container.querySelector(
        'script[type="application/ld+json"]',
      );
      expect(scriptElement).toBeInTheDocument();

      const scriptContent = scriptElement?.innerHTML || "";
      expect(scriptContent).toContain("@context");
      expect(scriptContent).toContain("@type");
      expect(scriptContent).toContain("FAQPage");
      expect(scriptContent).toContain("Question");
      expect(scriptContent).toContain("Answer");
    });

    it("should include all FAQ items in structured data", () => {
      const { container } = render(<Faq faqs={mockFaqs} />);

      const scriptElement = container.querySelector(
        'script[type="application/ld+json"]',
      );
      const scriptContent = scriptElement?.innerHTML || "";

      expect(scriptContent).toContain("What is NextRun?");
      expect(scriptContent).toContain(
        "NextRun is a platform for running applications efficiently.",
      );
      expect(scriptContent).toContain("How do I get started?");
      expect(scriptContent).toContain(
        "You can get started by creating an account and following our setup guide.",
      );
      expect(scriptContent).toContain("Is it free to use?");
      expect(scriptContent).toContain(
        "We offer both free and premium plans to suit different needs.",
      );
    });

    it("should handle empty FAQ list in structured data", () => {
      const { container } = render(<Faq faqs={[]} />);

      const scriptElement = container.querySelector(
        'script[type="application/ld+json"]',
      );
      const scriptContent = scriptElement?.innerHTML || "";

      expect(scriptContent).toContain("@context");
      expect(scriptContent).toContain("@type");
      expect(scriptContent).toContain("FAQPage");
      expect(scriptContent).toContain("mainEntity");
      expect(scriptContent).toContain("[]");
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes", () => {
      render(<Faq faqs={mockFaqs} />);

      const section = screen.getByRole("region", { hidden: true });
      expect(section).toHaveAttribute("aria-labelledby", "faq-heading");

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveAttribute("id", "faq-heading");
    });

    it("should have proper heading hierarchy", () => {
      render(<Faq faqs={mockFaqs} />);

      const mainHeading = screen.getByRole("heading", { level: 2 });
      expect(mainHeading).toHaveTextContent("Frequently Asked Questions");

      const questionHeadings = screen.getAllByRole("heading", { level: 3 });
      expect(questionHeadings).toHaveLength(3);
      expect(questionHeadings[0]).toHaveTextContent("What is NextRun?");
      expect(questionHeadings[1]).toHaveTextContent("How do I get started?");
      expect(questionHeadings[2]).toHaveTextContent("Is it free to use?");
    });
  });

  describe("CSS Classes and Styling", () => {
    it("should apply correct CSS classes to container elements", () => {
      render(<Faq faqs={mockFaqs} />);

      const section = screen.getByRole("region", { hidden: true });
      expect(section).toHaveClass("py-12");

      const container = section.querySelector(".container");
      expect(container).toHaveClass("mx-auto");

      const textCenter = section.querySelector(".text-center");
      expect(textCenter).toBeInTheDocument();

      const maxWidth = section.querySelector(".max-w-xl");
      expect(maxWidth).toHaveClass("mx-auto", "mt-12", "max-w-xl");
    });

    it("should apply correct CSS classes to FAQ items", () => {
      const { container } = render(<Faq faqs={mockFaqs} />);

      const firstFaqItem = container.querySelector(".flex.gap-4");
      expect(firstFaqItem).toBeInTheDocument();
      expect(firstFaqItem).toHaveClass("gap-4");

      const numberSpan = firstFaqItem?.querySelector("span");
      expect(numberSpan).toHaveClass(
        "flex",
        "size-6",
        "shrink-0",
        "items-center",
        "justify-center",
        "rounded-sm",
        "bg-secondary",
        "font-mono",
        "text-xs",
        "text-primary",
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle FAQ items with special characters", () => {
      render(<Faq faqs={specialFaqs} />);

      expect(
        screen.getByText("What's the cost? (including taxes)"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("The cost is $99.99 + tax. That's about €85.50."),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Can I use it with <script> tags?"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("No, we sanitize all input to prevent XSS attacks."),
      ).toBeInTheDocument();
    });

    it("should handle very long FAQ content", () => {
      render(<Faq faqs={longFaqs} />);

      expect(
        screen.getByText(/What is a very long question/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/This is a very long answer/),
      ).toBeInTheDocument();
    });

    it("should handle FAQ items with empty strings", () => {
      render(<Faq faqs={emptyFaqs} />);

      expect(screen.getByText("Valid question")).toBeInTheDocument();
      expect(screen.getByText("Valid answer")).toBeInTheDocument();

      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
    });
  });
});
