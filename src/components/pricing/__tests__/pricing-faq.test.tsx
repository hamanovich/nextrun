import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PricingFaq } from "../pricing-faq";

vi.mock("@/components/faq/faq", () => ({
  Faq: ({
    badge,
    heading,
    description,
    faqs,
  }: {
    badge: string;
    heading: string;
    description: string;
    faqs: { question: string; answer: string }[];
  }) => (
    <div data-testid="faq-component">
      <div data-testid="faq-badge">{badge}</div>
      <h2 data-testid="faq-heading">{heading}</h2>
      <p data-testid="faq-description">{description}</p>
      <div data-testid="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} data-testid={`faq-item-${index}`}>
            <h3 data-testid={`faq-question-${index}`}>{faq.question}</h3>
            <p data-testid={`faq-answer-${index}`}>{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  ),
}));

describe("PricingFaq", () => {
  describe("Default Rendering", () => {
    it("renders the component", () => {
      render(<PricingFaq />);

      expect(screen.getByTestId("faq-component")).toBeInTheDocument();
    });

    it("renders the section with correct structure", () => {
      render(<PricingFaq />);

      const section = screen.getByTestId("faq-component").closest("section");
      expect(section).toHaveClass("py-6");

      const container = section?.querySelector(".container");
      expect(container).toHaveClass("container", "mx-auto", "px-4");
    });
  });

  describe("Faq Component Props", () => {
    it("passes correct badge to Faq component", () => {
      render(<PricingFaq />);

      expect(screen.getByTestId("faq-badge")).toHaveTextContent("Pricing FAQ");
    });

    it("passes correct heading to Faq component", () => {
      render(<PricingFaq />);

      expect(screen.getByTestId("faq-heading")).toHaveTextContent(
        "Frequently Asked Questions",
      );
    });

    it("passes correct description to Faq component", () => {
      render(<PricingFaq />);

      expect(screen.getByTestId("faq-description")).toHaveTextContent(
        "Everything you need to know about our pricing and plans.",
      );
    });
  });

  describe("FAQ Data", () => {
    it("renders all pricing FAQs", () => {
      render(<PricingFaq />);

      for (let i = 0; i < 6; i++) {
        expect(screen.getByTestId(`faq-item-${i}`)).toBeInTheDocument();
      }
    });

    it("renders correct FAQ questions", () => {
      render(<PricingFaq />);

      const expectedQuestions = [
        "How do credits work?",
        "Do I need a subscription?",
        "What payment methods do you accept?",
        "Is there a free tier?",
        "Do you offer refunds?",
        "What is included in the template?",
      ];

      expectedQuestions.forEach((question, index) => {
        expect(screen.getByTestId(`faq-question-${index}`)).toHaveTextContent(
          question,
        );
      });
    });

    it("renders correct FAQ answers", () => {
      render(<PricingFaq />);

      const expectedAnswers = [
        "Each credit covers one paid action, such as a generation request. Credits do not expire and roll over from month to month.",
        "No. NextRun uses one-off credit purchases, so there is no recurring subscription and nothing to cancel.",
        "We accept major credit and debit cards, processed securely by Stripe. Depending on your region, Apple Pay or Google Pay may also be available.",
        "Yes. Every new account starts with 5 free credits, and no credit card is required to get started.",
        "We offer a 30-day money-back guarantee. If the template is not the right fit, contact us for a full refund.",
        "Authentication, Stripe payments, a Postgres database, a Telegram bot, and a typed shadcn/ui component library, all pre-configured.",
      ];

      expectedAnswers.forEach((answer, index) => {
        expect(screen.getByTestId(`faq-answer-${index}`)).toHaveTextContent(
          answer,
        );
      });
    });
  });

  describe("Responsive Behavior", () => {
    it("applies responsive section classes", () => {
      render(<PricingFaq />);

      const section = screen.getByTestId("faq-component").closest("section");
      expect(section).toHaveClass("py-6");
    });

    it("applies responsive container classes", () => {
      render(<PricingFaq />);

      const container = screen
        .getByTestId("faq-component")
        .closest("section")
        ?.querySelector(".container");
      expect(container).toHaveClass("container", "mx-auto", "px-4");
    });
  });

  describe("Accessibility", () => {
    it("has proper semantic structure", () => {
      render(<PricingFaq />);

      const section = screen.getByTestId("faq-component").closest("section");
      expect(section).toBeInTheDocument();
    });

    it("passes accessibility props to Faq component", () => {
      render(<PricingFaq />);

      expect(screen.getByTestId("faq-heading")).toBeInTheDocument();
      expect(screen.getByTestId("faq-description")).toBeInTheDocument();
    });
  });

  describe("Content Validation", () => {
    it("has all required FAQ content", () => {
      render(<PricingFaq />);

      for (let i = 0; i < 6; i++) {
        const question = screen.getByTestId(`faq-question-${i}`);
        const answer = screen.getByTestId(`faq-answer-${i}`);

        expect(question).toBeInTheDocument();
        expect(answer).toBeInTheDocument();
        expect(question.textContent).toBeTruthy();
        expect(answer.textContent).toBeTruthy();
      }
    });

    it("has non-empty FAQ content", () => {
      render(<PricingFaq />);

      for (let i = 0; i < 6; i++) {
        const question = screen.getByTestId(`faq-question-${i}`);
        const answer = screen.getByTestId(`faq-answer-${i}`);

        expect(question.textContent?.trim()).toBeTruthy();
        expect(answer.textContent?.trim()).toBeTruthy();
      }
    });
  });
});
