import { Faq } from "@/components/faq/faq";

const pricingFaqs = [
  {
    question: "How do credits work?",
    answer:
      "Each credit covers one paid action, such as a generation request. Credits do not expire and roll over from month to month.",
  },
  {
    question: "Do I need a subscription?",
    answer:
      "No. NextRun uses one-off credit purchases, so there is no recurring subscription and nothing to cancel.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept major credit and debit cards, processed securely by Stripe. Depending on your region, Apple Pay or Google Pay may also be available.",
  },
  {
    question: "Is there a free tier?",
    answer:
      "Yes. Every new account starts with 5 free credits, and no credit card is required to get started.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 30-day money-back guarantee. If the template is not the right fit, contact us for a full refund.",
  },
  {
    question: "What is included in the template?",
    answer:
      "Authentication, Stripe payments, a Postgres database, a Telegram bot, and a typed shadcn/ui component library, all pre-configured.",
  },
];

export const PricingFaq = () => (
  <section className="py-6">
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
