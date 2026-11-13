import { sanitizeJsonLd } from "@/lib/sanitize";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqProps } from "./faq.types";

export const Faq = ({
  badge = "FAQ",
  heading = "Frequently Asked Questions",
  description = "Find answers to common questions.",
  faqs = [],
}: FaqProps) => (
  <section
    className="py-12"
    aria-label={
      typeof heading === "string" ? heading : "Frequently asked questions"
    }
  >
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: sanitizeJsonLd({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }),
      }}
    />
    <div className="site-container grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
      <div>
        <p className="text-muted-foreground mb-3 text-sm font-medium">
          {badge}
        </p>
        <h2 className="text-3xl leading-9 font-semibold">{heading}</h2>
        <p className="text-muted-foreground mt-4 text-base leading-7">
          {description}
        </p>
      </div>
      <Accordion type="multiple" className="brand-faq border-t">
        {faqs.map((faq, index) => (
          <AccordionItem key={faq.question} value={`question-${index}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);
