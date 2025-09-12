import type { FaqItem } from "../faq.types";

export const mockFaqs: FaqItem[] = [
  {
    question: "What is NextRun?",
    answer: "NextRun is a platform for running applications efficiently.",
  },
  {
    question: "How do I get started?",
    answer:
      "You can get started by creating an account and following our setup guide.",
  },
  {
    question: "Is it free to use?",
    answer: "We offer both free and premium plans to suit different needs.",
  },
];

export const faqsWithReactNode: FaqItem[] = [
  {
    question: "What is NextRun?",
    answer: (
      <span>
        NextRun is a platform for running applications efficiently.{" "}
        <a href="/docs">Learn more</a>
      </span>
    ),
  },
];

export const specialFaqs: FaqItem[] = [
  {
    question: "What's the cost? (including taxes)",
    answer: "The cost is $99.99 + tax. That's about €85.50.",
  },
  {
    question: "Can I use it with <script> tags?",
    answer: "No, we sanitize all input to prevent XSS attacks.",
  },
];

export const longFaqs: FaqItem[] = [
  {
    question:
      "What is a very long question that might wrap to multiple lines and test the component's ability to handle lengthy text content?",
    answer:
      "This is a very long answer that contains multiple sentences and detailed information that might wrap to multiple lines. It tests the component's ability to handle lengthy content without breaking the layout or causing any visual issues. The component should gracefully handle this content and maintain proper spacing and readability.",
  },
];

export const emptyFaqs: FaqItem[] = [
  {
    question: "",
    answer: "",
  },
  {
    question: "Valid question",
    answer: "Valid answer",
  },
];

export const customProps = {
  badge: "Help Center",
  heading: "Need Help?",
  description: "Get answers to your questions here.",
};

export const reactNodeProps = {
  badge: <span data-testid="custom-badge">Custom Badge</span>,
  heading: <span data-testid="custom-heading">Custom Heading</span>,
  description: <span data-testid="custom-description">Custom Description</span>,
};
