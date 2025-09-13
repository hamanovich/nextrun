import { Faq } from "@/components/faq/faq";

const pricingFaqs = [
  {
    question: "How do credits work?",
    answer:
      "Each credit allows you to generate one set of flashcards. For example, creating 50 Spanish vocabulary cards costs 1 credit. Credits don't expire and roll over month to month.",
  },
  {
    question: "Can I change my plan anytime?",
    answer:
      "Yes! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately, and you'll only pay for what you use.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept major credit and debit cards (processed securely by Stripe). Depending on your region, Apple Pay or Google Pay may also be available.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes! Every new user gets 5 free credits to try our features. No credit card required to get started.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 30-day money-back guarantee. If you're not satisfied with our service, contact us for a full refund.",
  },
  {
    question: "Can I use credits for both Anki and Quizlet?",
    answer:
      "Absolutely! Your credits work for both platforms. You can generate content for Anki, Quizlet, or both - it's up to you.",
  },
];

export const PricingFaq = () => (
  <section className="py-6 bg-muted/30">
    <div className="container mx-auto px-4">
      <Faq
        badge="Pricing FAQ"
        heading="Frequently Asked Questions"
        description="Everything you need to know about our pricing and plans."
        faqs={pricingFaqs}
      />
    </div>
  </section>
);
