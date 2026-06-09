import { sanitizeJsonLd } from "@/lib/sanitize";
import { Badge } from "@/components/ui/badge";
import type { FaqProps } from "./faq.types";

export const Faq = ({
  badge = "FAQ",
  heading = "Frequently Asked Questions",
  description = "Find answers to common questions.",
  faqs = [],
}: FaqProps) => {
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="py-12" aria-labelledby="faq-heading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: sanitizeJsonLd(faqStructuredData),
        }}
      />
      <div className="container mx-auto">
        <div className="text-center">
          <Badge className="text-xs font-medium">{badge}</Badge>
          <h2 id="faq-heading" className="mt-2 text-4xl font-semibold">
            {heading}
          </h2>
          <p className="text-muted-foreground mt-4 font-medium">
            {description}
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-xl">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={faq.question} className="flex gap-4">
                <span className="bg-secondary text-primary flex size-6 shrink-0 items-center justify-center rounded-sm font-mono text-xs">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <h3 className="mb-2 font-medium">{faq.question}</h3>
                  <p className="text-muted-foreground text-sm">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
