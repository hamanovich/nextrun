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
    faqs: Array<{ question: string; answer: string }>;
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
      expect(section).toHaveClass("py-6", "bg-muted/30");

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
        "Can I change my plan anytime?",
        "What payment methods do you accept?",
        "Is there a free trial?",
        "Do you offer refunds?",
        "Can I use credits for both Anki and Quizlet?",
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
        "Each credit allows you to generate one set of flashcards. For example, creating 50 Spanish vocabulary cards costs 1 credit. Credits don't expire and roll over month to month.",
        "Yes! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately, and you'll only pay for what you use.",
        "We accept major credit and debit cards (processed securely by Stripe). Depending on your region, Apple Pay or Google Pay may also be available.",
        "Yes! Every new user gets 5 free credits to try our features. No credit card required to get started.",
        "We offer a 30-day money-back guarantee. If you're not satisfied with our service, contact us for a full refund.",
        "Absolutely! Your credits work for both platforms. You can generate content for Anki, Quizlet, or both - it's up to you.",
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
      expect(section).toHaveClass("py-6", "bg-muted/30");
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
