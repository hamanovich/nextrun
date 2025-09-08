import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

export interface FaqItem {
  question: string;
  answer: ReactNode;
}

export interface FaqProps {
  badge?: ReactNode;
  heading?: ReactNode;
  description?: ReactNode;
  faqs?: ReadonlyArray<FaqItem>;
}

export const Faq = ({
  badge = "FAQ",
  heading = "Frequently Asked Questions",
  description = "Find answers to common questions.",
  faqs = [],
}: FaqProps) => (
  <section className="py-12" aria-labelledby="faq-heading">
    <div className="container">
      <div className="text-center">
        <Badge className="text-xs font-medium">{badge}</Badge>
        <h2 id="faq-heading" className="mt-4 text-4xl font-semibold">
          {heading}
        </h2>
        <p className="mt-6 font-medium text-muted-foreground">{description}</p>
      </div>
      <div className="mx-auto mt-14 max-w-xl">
        <dl>
          {faqs.map((faq, index) => (
            <div key={faq.question} className="mb-8 flex gap-4">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-secondary font-mono text-xs text-primary">
                {index + 1}
              </span>
              <div>
                <dt className="mb-2 font-medium">{faq.question}</dt>
                <dd className="text-sm text-muted-foreground">{faq.answer}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </div>
  </section>
);
