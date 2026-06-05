import { CreditCard } from "lucide-react";

interface PricingHeroProps {
  currentCredits?: number;
}

export const PricingHero = ({ currentCredits }: PricingHeroProps) => (
  <section className="container mx-auto px-6 pt-16 pb-10 text-center md:pt-24">
    <div className="mx-auto max-w-3xl">
      <h1 className="text-4xl font-semibold tracking-tighter text-balance md:text-5xl lg:text-6xl">
        Simple, credit-based pricing
      </h1>
      <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-base leading-relaxed md:text-lg">
        Start free and scale as you grow. Buy credits when you need them, with
        no subscription to cancel.
      </p>

      {currentCredits !== undefined && (
        <div className="bg-muted text-foreground mt-8 inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium">
          <CreditCard className="size-4" aria-hidden={true} />
          {currentCredits.toLocaleString()} credits available
        </div>
      )}
    </div>
  </section>
);
